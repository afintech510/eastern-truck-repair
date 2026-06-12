import nodemailer from "nodemailer";

// The one swappable seam: deliver a lead. Today it emails over SMTP. To move to
// SMS / a transactional API / an automation tool later, change ONLY this file —
// the /api/lead route contract and the form stay exactly as they are.

export type LeadPayload = {
  formType: "contact" | "quote";
  lang: "en" | "es";
  name: string;
  phone: string;
  email?: string;
  service?: string;
  vehicle?: string;
  message?: string;
};

// Distinct from a send failure: this means the server isn't configured, so the
// route should answer 500 "email not configured" (not 502 "delivery failed").
export class LeadConfigError extends Error {}

function loadConfig() {
  const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, LEAD_FROM, LEAD_TO } = process.env;
  if (!SMTP_HOST || !SMTP_USER || !SMTP_PASS || !LEAD_FROM || !LEAD_TO) {
    throw new LeadConfigError(
      "missing one of SMTP_HOST / SMTP_USER / SMTP_PASS / LEAD_FROM / LEAD_TO"
    );
  }
  const to = LEAD_TO.split(",").map((s) => s.trim()).filter(Boolean);
  if (to.length === 0) throw new LeadConfigError("LEAD_TO has no recipients");
  return {
    host: SMTP_HOST,
    port: Number(SMTP_PORT) || 587,
    user: SMTP_USER,
    pass: SMTP_PASS,
    from: LEAD_FROM,
    to,
  };
}

export async function sendLead(payload: LeadPayload): Promise<void> {
  const cfg = loadConfig();

  const transporter = nodemailer.createTransport({
    host: cfg.host,
    port: cfg.port,
    secure: cfg.port === 465, // 465 = implicit TLS, 587 = STARTTLS
    auth: { user: cfg.user, pass: cfg.pass },
    connectionTimeout: 10000,
    greetingTimeout: 10000,
    socketTimeout: 10000,
  });

  const submittedAt = new Date().toISOString();
  const rows: [string, string | undefined][] = [
    ["Form", payload.formType],
    ["Language", payload.lang === "es" ? "Spanish" : "English"],
    ["Name", payload.name],
    ["Phone", payload.phone],
    ["Email", payload.email],
    ["Service", payload.service],
    ["Vehicle / Equipment", payload.vehicle],
    ["Message", payload.message],
    ["Submitted", submittedAt],
  ];
  const present = rows.filter(([, v]) => v && String(v).trim() !== "");

  const text = present.map(([k, v]) => `${k}: ${v}`).join("\n");
  const html =
    `<h2 style="font-family:sans-serif">New ${payload.formType} lead</h2>` +
    `<table cellpadding="6" style="border-collapse:collapse;font-family:sans-serif;font-size:14px">` +
    present
      .map(([k, v]) => {
        const cell =
          k === "Phone"
            ? `<a href="tel:${String(v).replace(/[^0-9+]/g, "")}">${v}</a>`
            : String(v);
        return `<tr><td style="font-weight:bold;border:1px solid #ddd">${k}</td><td style="border:1px solid #ddd">${cell}</td></tr>`;
      })
      .join("") +
    `</table>`;

  await transporter.sendMail({
    from: cfg.from,
    to: cfg.to,
    replyTo: payload.email && payload.email.trim() !== "" ? payload.email.trim() : undefined,
    subject: `New ${payload.formType} lead — ${payload.name}`,
    text,
    html,
  });
}

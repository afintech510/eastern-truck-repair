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
  const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, LEAD_FROM, LEAD_TO, LEAD_CC } = process.env;
  if (!SMTP_HOST || !SMTP_USER || !SMTP_PASS || !LEAD_FROM || !LEAD_TO) {
    throw new LeadConfigError(
      "missing one of SMTP_HOST / SMTP_USER / SMTP_PASS / LEAD_FROM / LEAD_TO"
    );
  }
  const to = LEAD_TO.split(",").map((s) => s.trim()).filter(Boolean);
  if (to.length === 0) throw new LeadConfigError("LEAD_TO has no recipients");
  const cc = (LEAD_CC ?? "").split(",").map((s) => s.trim()).filter(Boolean);
  return {
    host: SMTP_HOST,
    port: Number(SMTP_PORT) || 587,
    user: SMTP_USER,
    pass: SMTP_PASS,
    from: LEAD_FROM,
    to,
    cc,
  };
}

async function sendSms(payload: LeadPayload): Promise<void> {
  const { TWILIO_SID, TWILIO_AUTH, TWILIO_FROM, SMS_TO } = process.env;
  if (!TWILIO_SID || !TWILIO_AUTH || !TWILIO_FROM || !SMS_TO) return;

  const recipients = SMS_TO.split(",").map((s) => s.trim()).filter(Boolean);
  const body =
    `New ${payload.formType} lead\n` +
    `Name: ${payload.name}\n` +
    `Phone: ${payload.phone}\n` +
    (payload.service ? `Service: ${payload.service}\n` : "") +
    (payload.message ? `Msg: ${payload.message.slice(0, 300)}\n` : "");

  const auth = Buffer.from(`${TWILIO_SID}:${TWILIO_AUTH}`).toString("base64");
  const url = `https://api.twilio.com/2010-04-01/Accounts/${TWILIO_SID}/Messages.json`;

  await Promise.allSettled(
    recipients.map((to) =>
      fetch(url, {
        method: "POST",
        headers: {
          Authorization: `Basic ${auth}`,
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({ From: TWILIO_FROM, To: to, Body: body }),
      })
    )
  );
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
    cc: cfg.cc.length > 0 ? cfg.cc : undefined,
    replyTo: payload.email && payload.email.trim() !== "" ? payload.email.trim() : undefined,
    subject: `New ${payload.formType} lead — ${payload.name}`,
    text,
    html,
  });

  // SMS is fire-and-forget — a Twilio failure should never block the lead response.
  sendSms(payload).catch((err) => console.error("[sendLead] SMS failed:", err));
}

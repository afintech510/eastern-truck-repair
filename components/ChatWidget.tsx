"use client";
import { useState, useRef, useEffect, FormEvent } from "react";
import { MessageCircle, Send, Truck, Settings, Flame, ChevronLeft, ChevronRight } from "lucide-react";
import { useLang, T } from "./Lang";
import { trackLeadConversion, trackChatConversion } from "./GoogleAnalytics";
import { business } from "@/lib/data";
import { truckMakes, equipmentMakes, trailerTypes, equipmentTypes, years } from "@/lib/vehicleData";
import type { ChatMessage, VehicleContext } from "@/lib/chatbot";

type IntakeStep = "vehicle-type" | "vehicle-details" | "symptom" | "chat";
type VehicleType = "truck" | "trailer" | "equipment" | "other";

const VEHICLE_EMOJI: Record<VehicleType, string> = {
  truck: "\u{1F69B}",
  trailer: "\u{1F69A}",
  equipment: "\u{1F3D7}️",
  other: "\u{1F527}",
};

const VEHICLE_LABELS: Record<VehicleType, { en: string; es: string }> = {
  truck: { en: "Truck", es: "Camión" },
  trailer: { en: "Trailer", es: "Trailer" },
  equipment: { en: "Equipment", es: "Equipo" },
  other: { en: "Other", es: "Otro" },
};

function getMakesForType(type: VehicleType): string[] {
  switch (type) {
    case "truck": return truckMakes;
    case "equipment": return equipmentMakes;
    case "trailer": return trailerTypes;
    default: return [];
  }
}

function makeLabel(type: VehicleType, lang: "en" | "es"): string {
  if (type === "trailer") return lang === "es" ? "Tipo" : "Type";
  return lang === "es" ? "Marca" : "Make";
}

export default function ChatWidget({ inline }: { inline?: boolean }) {
  const { lang } = useLang();
  const [step, setStep] = useState<IntakeStep>("vehicle-type");
  const [vehicleType, setVehicleType] = useState<VehicleType | null>(null);
  const [vehicle, setVehicle] = useState<VehicleContext>({});
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [bookingName, setBookingName] = useState("");
  const [bookingPhone, setBookingPhone] = useState("");
  const [bookingDate, setBookingDate] = useState("");
  const [bookingSlot, setBookingSlot] = useState("");
  const [bookingConsent, setBookingConsent] = useState(false);
  const [bookingProblem, setBookingProblem] = useState("");
  const [bookingStatus, setBookingStatus] = useState<"idle" | "sending" | "done" | "error">("idle");
  const [bubbleVisible, setBubbleVisible] = useState(true);
  const [axleOffline, setAxleOffline] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const bookingRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (inline) return;
    const target = document.getElementById("axle-chat");
    if (!target) return;
    const observer = new IntersectionObserver(
      ([entry]) => setBubbleVisible(!entry.isIntersecting),
      { threshold: 0.1 },
    );
    observer.observe(target);
    return () => observer.disconnect();
  }, [inline]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, loading]);

  function skipToFreeText() {
    setStep("symptom");
  }

  function resetVehicle() {
    setVehicleType(null);
    setVehicle({});
    setStep("vehicle-type");
  }

  function selectVehicleType(t: VehicleType) {
    setVehicleType(t);
    setVehicle({ type: t });
    setStep("vehicle-details");
  }

  function submitDetails(e: FormEvent) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget as HTMLFormElement);
    setVehicle((v) => ({
      ...v,
      year: String(fd.get("year") || ""),
      make: String(fd.get("make") || ""),
      model: String(fd.get("model") || ""),
    }));
    setStep("symptom");
  }

  async function sendMessage(text: string) {
    const userMsg: ChatMessage = { role: "user", content: text };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInput("");
    setLoading(true);

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 30000);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: newMessages, vehicle, lang }),
        signal: controller.signal,
      });

      if (res.status === 429) {
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content:
              lang === "es"
                ? `¡Has estado chateando mucho! Llámanos al ${business.phone} para ayuda inmediata.`
                : `You've been chatting a lot! Call us at ${business.phone} for immediate help.`,
          },
        ]);
        return;
      }

      const data = await res.json();
      if (data.ok && data.message) {
        setMessages((prev) => [...prev, { role: "assistant", content: data.message }]);
        if (data.leadCaptured) {
          trackLeadConversion("chatbot");
          trackChatConversion("web");
        }
      } else {
        showAxleOnBreak();
      }
    } catch {
      showAxleOnBreak();
    } finally {
      clearTimeout(timeout);
      setLoading(false);
    }
  }

  function showAxleOnBreak() {
    setAxleOffline(true);
    setMessages((prev) => [
      ...prev,
      {
        role: "assistant",
        content:
          lang === "es"
            ? "Axle está en descanso — todavía está en desarrollo. Pero puedo ayudarte a agendar una cita. Completa el formulario abajo con tu información y te contactaremos."
            : "Axle is taking a break — he's still under development. But I can still help you schedule an appointment! Fill out the form below with your info and we'll get back to you.",
      },
    ]);
    setTimeout(() => {
      bookingRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
    }, 300);
  }

  function submitSymptom(e: FormEvent) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget as HTMLFormElement);
    const symptom = String(fd.get("symptom") || "");
    if (!symptom.trim()) return;

    let context = "";
    if (vehicle.year || vehicle.make || vehicle.model) {
      context = `[${[vehicle.year, vehicle.make, vehicle.model].filter(Boolean).join(" ")}] `;
    }

    setStep("chat");
    sendMessage(`${context}${symptom}`);
  }

  function handleChatSubmit(e: FormEvent) {
    e.preventDefault();
    if (!input.trim() || loading) return;
    sendMessage(input.trim());
  }

  async function submitBooking(e: FormEvent) {
    e.preventDefault();
    if (!bookingName.trim() || !bookingPhone.trim() || !bookingConsent) return;
    setBookingStatus("sending");

    const conversationSummary = messages
      .map((m) => `${m.role === "user" ? "Customer" : "Bot"}: ${m.content}`)
      .join("\n");

    const vehicleInfo = [vehicle.year, vehicle.make, vehicle.model].filter(Boolean).join(" ");

    try {
      const res = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          formType: "chatbot",
          lang,
          name: bookingName,
          phone: bookingPhone,
          email: "",
          service: "",
          vehicle: vehicleInfo,
          message: `[Chatbot appointment request]\n\nVehicle: ${vehicleInfo || "Not specified"}${bookingProblem ? `\nProblem: ${bookingProblem}` : ""}${bookingDate ? `\nPreferred date: ${bookingDate}` : ""}${bookingSlot ? `\nPreferred time: ${bookingSlot}` : ""}${conversationSummary ? `\n\nConversation:\n${conversationSummary}` : ""}`,
          company: "",
        }),
      });
      const data = await res.json().catch(() => ({ ok: false }));
      if (!res.ok || !data.ok) throw new Error("submit failed");
      trackLeadConversion("chatbot");
      trackChatConversion("web");
      setBookingStatus("done");
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            lang === "es"
              ? "¡Listo! Te llamaremos para confirmar tu cita."
              : "Got it! We'll call you to confirm your appointment.",
        },
      ]);
    } catch {
      setBookingStatus("error");
    }
  }

  function scrollToInline() {
    const el = document.getElementById("axle-chat");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    } else {
      window.location.href = "/#axle-chat";
    }
  }

  // --- Build vehicle badge text ---
  function vehicleBadgeText(): string {
    const parts: string[] = [];
    if (vehicle.year) parts.push(vehicle.year);
    if (vehicle.make) parts.push(vehicle.make);
    if (vehicle.model) parts.push(vehicle.model);
    if (parts.length > 0) return parts.join(" ");
    if (vehicleType) return lang === "es" ? VEHICLE_LABELS[vehicleType].es : VEHICLE_LABELS[vehicleType].en;
    return "";
  }

  // --- Render pieces ---

  const vehicleTypeButtons = (
    <div className="p-4">
      <p className="text-zinc-200 text-sm mb-4">
        <T
          en="What type of vehicle or equipment do you need help with?"
          es="¿Qué tipo de vehículo o equipo necesita ayuda?"
        />
      </p>
      <div className="grid grid-cols-2 gap-3">
        {(
          [
            { key: "truck", en: "Truck", es: "Camión", icon: Truck },
            { key: "trailer", en: "Trailer", es: "Trailer", icon: Truck },
            { key: "equipment", en: "Heavy Equipment", es: "Equipo Pesado", icon: Settings },
            { key: "other", en: "Other", es: "Otro", icon: Flame },
          ] as const
        ).map((vt) => (
          <button
            key={vt.key}
            onClick={() => selectVehicleType(vt.key)}
            className="flex flex-col items-center gap-2 p-4 rounded-lg border border-line bg-steel hover:border-[#39ff14] hover:bg-steel2 transition text-zinc-200 hover:text-[#39ff14]"
          >
            <vt.icon size={28} />
            <span className="text-sm font-medium">{lang === "es" ? vt.es : vt.en}</span>
          </button>
        ))}
      </div>
      <button onClick={skipToFreeText} className="mt-3 text-xs text-zinc-500 hover:text-[#39ff14] transition w-full text-center">
        <T en="Skip — just describe the issue" es="Saltar — solo describe el problema" /> <ChevronRight size={12} className="inline" />
      </button>
    </div>
  );

  const vehicleDetailsForm = (
    <form onSubmit={submitDetails} className="p-4 space-y-3">
      <div className="flex items-center gap-2 mb-1">
        <button type="button" onClick={() => setStep("vehicle-type")} className="text-zinc-400 hover:text-[#39ff14] transition">
          <ChevronLeft size={18} />
        </button>
        <p className="text-zinc-200 text-sm">
          <T en="Tell us about your vehicle" es="Cuéntanos sobre tu vehículo" />
        </p>
      </div>
      <div>
        <label className="block text-xs text-zinc-400 mb-1 uppercase tracking-wide disp font-bold">
          <T en="Year" es="Año" />
        </label>
        <select name="year" className="axle-inp w-full">
          <option value="">{lang === "es" ? "Seleccionar" : "Select"}</option>
          {years.map((y) => (
            <option key={y} value={y}>{y}</option>
          ))}
        </select>
      </div>
      <div>
        <label className="block text-xs text-zinc-400 mb-1 uppercase tracking-wide disp font-bold">
          {makeLabel(vehicleType!, lang)}
        </label>
        {vehicleType === "other" ? (
          <input name="make" type="text" className="axle-inp w-full" placeholder={lang === "es" ? "Marca o tipo" : "Make or type"} />
        ) : (
          <select name="make" className="axle-inp w-full">
            <option value="">{lang === "es" ? "Seleccionar" : "Select"}</option>
            {getMakesForType(vehicleType!).map((m) => (
              <option key={m} value={m}>{m}</option>
            ))}
          </select>
        )}
      </div>
      {vehicleType !== "trailer" && (
        <div>
          <label className="block text-xs text-zinc-400 mb-1 uppercase tracking-wide disp font-bold">
            <T en="Model" es="Modelo" />
          </label>
          <input name="model" type="text" className="axle-inp w-full" placeholder={lang === "es" ? "Ej: 579, 320GC" : "e.g. 579, 320GC"} />
        </div>
      )}
      <button type="submit" className="w-full bg-safety hover:bg-safety-d text-steel py-2.5 rounded disp font-bold transition">
        <T en="Continue" es="Continuar" />
      </button>
      <button type="button" onClick={skipToFreeText} className="text-xs text-zinc-500 hover:text-[#39ff14] transition w-full text-center">
        <T en="Skip — just describe the issue" es="Saltar — solo describe el problema" /> <ChevronRight size={12} className="inline" />
      </button>
    </form>
  );

  const symptomForm = (
    <form onSubmit={submitSymptom} className="p-4 space-y-3">
      <p className="text-zinc-200 text-sm">
        <T
          en={`What's going on with your ${vehicleType === "equipment" ? "equipment" : vehicleType === "trailer" ? "trailer" : "vehicle"}?`}
          es={`¿Qué problema tiene su ${vehicleType === "equipment" ? "equipo" : vehicleType === "trailer" ? "trailer" : "vehículo"}?`}
        />
      </p>
      <textarea
        name="symptom"
        required
        className="axle-inp w-full min-h-[100px]"
        placeholder={
          lang === "es"
            ? "Describa los síntomas, ruidos, luces en el tablero..."
            : "Describe symptoms, noises, dashboard lights..."
        }
      />
      <button type="submit" className="w-full bg-safety hover:bg-safety-d text-steel py-2.5 rounded disp font-bold transition">
        <T en="Send" es="Enviar" />
      </button>
    </form>
  );

  const typingIndicator = (
    <div className="flex items-center gap-1 px-4 py-2">
      <div className="flex gap-1">
        <span className="w-2 h-2 bg-[#39ff14] rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
        <span className="w-2 h-2 bg-[#39ff14] rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
        <span className="w-2 h-2 bg-[#39ff14] rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
      </div>
    </div>
  );

  const walkinNote = (
    <div className="mx-4 mb-2 px-3 py-2 rounded bg-steel border border-line text-xs text-zinc-400">
      <T
        en="Walk-ins welcome — during busy times there may be a wait to speak with a mechanic"
        es="Se aceptan visitas sin cita — en horarios ocupados puede haber espera para hablar con un mecánico"
      />
    </div>
  );

  const badgeText = vehicleBadgeText();
  const vehicleBadge = badgeText && (step === "symptom" || step === "chat") ? (
    <div className="px-4 py-2 bg-steel/50 border-b border-[#39ff14]/20 relative z-10">
      <button
        onClick={resetVehicle}
        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-[#39ff14]/10 text-[#39ff14] border border-[#39ff14]/30 hover:bg-[#39ff14]/20 transition"
      >
        <span>{vehicleType ? VEHICLE_EMOJI[vehicleType] : "\u{1F697}"}</span>
        <span>{badgeText}</span>
        <span className="text-[10px] text-[#39ff14]/60 ml-0.5">
          <T en="change" es="cambiar" />
        </span>
      </button>
    </div>
  ) : null;

  // --- Time slots ---
  const timeSlots = [
    { id: "7:00–9:30", en: "7:00 – 9:30 AM", es: "7:00 – 9:30 AM" },
    { id: "9:30–12:00", en: "9:30 – 12:00 PM", es: "9:30 – 12:00 PM" },
    { id: "12:00–2:30", en: "12:00 – 2:30 PM", es: "12:00 – 2:30 PM" },
    { id: "2:30–5:00", en: "2:30 – 5:00 PM", es: "2:30 – 5:00 PM" },
  ];

  function getMinDate(): string {
    const d = new Date();
    if (d.getDay() === 0) d.setDate(d.getDate() + 1);
    else if (d.getDay() === 6) d.setDate(d.getDate() + 2);
    else if (d.getHours() >= 17) {
      d.setDate(d.getDate() + 1);
      if (d.getDay() === 0) d.setDate(d.getDate() + 1);
      else if (d.getDay() === 6) d.setDate(d.getDate() + 2);
    }
    return d.toISOString().split("T")[0];
  }

  const chatPanel = (
    <div className="w-full rounded-lg border-2 border-[#39ff14] bg-steel2 overflow-hidden axle-glow relative">
      <div className="axle-scanlines" />

      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-steel border-b border-[#39ff14]/30 relative z-10">
        <div className="flex items-center gap-3">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="disp font-bold text-lg text-[#39ff14]">AXLE</h3>
              <span className="px-2 py-0.5 text-[10px] font-bold tracking-wider text-[#39ff14] bg-[#39ff14]/10 border border-[#39ff14]/40 rounded-full disp axle-badge-glow">
                AI
              </span>
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#39ff14] opacity-60" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#39ff14]" />
              </span>
            </div>
            <p className="text-xs text-zinc-500">
              <T en="AI-Powered Vehicle Diagnostics" es="Diagnóstico de Vehículos con IA" />
            </p>
          </div>
        </div>
      </div>

      {/* Vehicle badge */}
      {vehicleBadge}

      {/* Body */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto relative z-10" style={{ maxHeight: 420 }}>
        {step === "vehicle-type" && vehicleTypeButtons}
        {step === "vehicle-details" && vehicleDetailsForm}
        {step === "symptom" && symptomForm}
        {step === "chat" && (
          <div className="p-4 space-y-3">
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                <div
                  className={`max-w-[85%] rounded-lg px-3 py-2 text-sm whitespace-pre-wrap ${
                    m.role === "user"
                      ? "bg-safety text-steel"
                      : "bg-steel text-zinc-200 border border-[#39ff14]/20"
                  }`}
                >
                  {m.content}
                </div>
              </div>
            ))}
            {loading && typingIndicator}
          </div>
        )}
      </div>

      {/* Walk-in note */}
      {step === "chat" && messages.length > 0 && walkinNote}

      {/* Input area */}
      {step === "chat" && (
        <form onSubmit={handleChatSubmit} className="flex items-center gap-2 p-3 border-t border-[#39ff14]/30 bg-steel relative z-10">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={lang === "es" ? "Escribe un mensaje…" : "Type a message…"}
            className="flex-1 bg-steel2 border border-[#39ff14]/30 rounded px-3 py-2 text-sm text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-[#39ff14]"
            disabled={loading}
          />
          <button
            type="submit"
            disabled={loading || !input.trim()}
            className="w-9 h-9 grid place-items-center rounded bg-safety hover:bg-safety-d text-steel disabled:opacity-40 transition"
          >
            <Send size={16} />
          </button>
        </form>
      )}

      <style>{`
        .axle-glow{box-shadow:0 0 15px rgba(57,255,20,0.3),0 0 30px rgba(57,255,20,0.1);animation:axle-pulse 3s ease-in-out infinite}
        @keyframes axle-pulse{0%,100%{box-shadow:0 0 15px rgba(57,255,20,0.3),0 0 30px rgba(57,255,20,0.1)}50%{box-shadow:0 0 20px rgba(57,255,20,0.5),0 0 40px rgba(57,255,20,0.2)}}
        .axle-badge-glow{text-shadow:0 0 6px rgba(57,255,20,0.6)}
        .axle-scanlines{position:absolute;inset:0;pointer-events:none;z-index:1;background:repeating-linear-gradient(0deg,transparent,transparent 2px,rgba(57,255,20,0.02) 2px,rgba(57,255,20,0.02) 4px)}
        .axle-inp{width:100%;background:#10161d;border:1px solid rgba(57,255,20,0.3);border-radius:5px;padding:11px 13px;color:#eef2f6;font-size:16px}
        .axle-inp:focus{outline:none;border-color:#39ff14}
      `}</style>
    </div>
  );

  // --- Booking form (below chat panel) ---
  const showBookingForm = (step === "chat" || step === "symptom" || axleOffline) && bookingStatus !== "done";
  const bookingSection = showBookingForm ? (
    <form ref={bookingRef} onSubmit={submitBooking} className={`mt-4 p-4 rounded-lg border bg-steel space-y-3 ${axleOffline ? "border-safety" : "border-line"}`}>
      <h4 className="disp font-bold text-sm text-zinc-100">
        <T en="Schedule an Appointment" es="Agendar una Cita" />
      </h4>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className="block text-xs text-zinc-400 mb-1 uppercase tracking-wide disp font-bold">
            <T en="Name" es="Nombre" />
          </label>
          <input
            type="text"
            value={bookingName}
            onChange={(e) => setBookingName(e.target.value)}
            placeholder={lang === "es" ? "Tu nombre" : "Your name"}
            required
            className="axle-inp w-full"
          />
        </div>
        <div>
          <label className="block text-xs text-zinc-400 mb-1 uppercase tracking-wide disp font-bold">
            <T en="Phone" es="Teléfono" />
          </label>
          <input
            type="tel"
            value={bookingPhone}
            onChange={(e) => setBookingPhone(e.target.value)}
            placeholder={lang === "es" ? "Tu teléfono" : "Your phone number"}
            required
            className="axle-inp w-full"
          />
        </div>
      </div>
      <div>
        <label className="block text-xs text-zinc-400 mb-1 uppercase tracking-wide disp font-bold">
          <T en="Problem Description" es="Descripción del Problema" />
        </label>
        <textarea
          value={bookingProblem}
          onChange={(e) => setBookingProblem(e.target.value)}
          placeholder={lang === "es" ? "Describa el problema brevemente..." : "Briefly describe the issue..."}
          className="axle-inp w-full min-h-[60px]"
        />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className="block text-xs text-zinc-400 mb-1 uppercase tracking-wide disp font-bold">
            <T en="Preferred Date" es="Fecha Preferida" />
          </label>
          <input
            type="date"
            value={bookingDate}
            onChange={(e) => setBookingDate(e.target.value)}
            min={getMinDate()}
            className="axle-inp w-full"
          />
        </div>
        <div>
          <label className="block text-xs text-zinc-400 mb-1.5 uppercase tracking-wide disp font-bold">
            <T en="Preferred Time" es="Hora Preferida" />
          </label>
          <div className="grid grid-cols-2 gap-1.5">
            {timeSlots.map((slot) => (
              <button
                key={slot.id}
                type="button"
                onClick={() => setBookingSlot(slot.id)}
                className={`px-2 py-2 rounded text-xs font-medium border transition ${
                  bookingSlot === slot.id
                    ? "bg-[#39ff14]/20 border-[#39ff14] text-[#39ff14]"
                    : "bg-steel2 border-line text-zinc-400 hover:border-[#39ff14]/50 hover:text-zinc-200"
                }`}
              >
                {lang === "es" ? slot.es : slot.en}
              </button>
            ))}
          </div>
        </div>
      </div>
      <label className="flex items-start gap-2 cursor-pointer">
        <input
          type="checkbox"
          checked={bookingConsent}
          onChange={(e) => setBookingConsent(e.target.checked)}
          className="mt-0.5 accent-[#39ff14]"
        />
        <span className="text-xs text-zinc-400 leading-tight">
          <T
            en="I consent to being contacted by Eastern Truck & Equipment Repair & Welding via phone or text regarding my appointment request."
            es="Doy mi consentimiento para que Eastern Truck & Equipment Repair & Welding me contacte por teléfono o mensaje de texto sobre mi solicitud de cita."
          />
        </span>
      </label>
      <button
        type="submit"
        disabled={bookingStatus === "sending" || !bookingConsent || !bookingName.trim() || !bookingPhone.trim()}
        className="w-full bg-safety hover:bg-safety-d text-steel py-2.5 rounded disp font-bold text-sm disabled:opacity-40 transition"
      >
        {bookingStatus === "sending"
          ? lang === "es" ? "Enviando…" : "Sending…"
          : lang === "es" ? "Solicitar Cita" : "Request Appointment"}
      </button>
      {bookingStatus === "error" && (
        <p className="text-xs text-red-400">
          <T
            en={<>Couldn&apos;t submit. Call us at <a href={business.phoneHref} className="underline">{business.phone}</a>.</>}
            es={<>No se pudo enviar. Llámanos al <a href={business.phoneHref} className="underline">{business.phone}</a>.</>}
          />
        </p>
      )}
      <div className="flex items-center gap-3 pt-1">
        <a
          href={business.phoneHref}
          className="text-xs text-safety hover:underline"
        >
          <T en={`Or call ${business.phone}`} es={`O llama al ${business.phone}`} />
        </a>
      </div>
    </form>
  ) : bookingStatus === "done" ? (
    <div className="mt-4 p-4 rounded-lg border border-[#39ff14]/30 bg-steel text-center">
      <p className="text-sm text-[#39ff14] disp font-bold">
        <T en="Appointment request sent!" es="¡Solicitud de cita enviada!" />
      </p>
      <p className="text-xs text-zinc-400 mt-1">
        <T en="We'll call you to confirm." es="Te llamaremos para confirmar." />
      </p>
    </div>
  ) : null;

  // Inline mode: render chat panel + booking form below it
  if (inline) {
    return (
      <div>
        {chatPanel}
        {bookingSection}
      </div>
    );
  }

  // Bubble mode: scroll to inline section when clicked
  if (!bubbleVisible) return null;

  return (
    <button
      onClick={scrollToInline}
      className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-[#39ff14] hover:bg-[#32e612] text-steel grid place-items-center shadow-lg transition-transform hover:scale-105"
      style={{ boxShadow: "0 0 15px rgba(57,255,20,0.4)" }}
      aria-label="Chat with Axle"
    >
      <MessageCircle size={26} />
    </button>
  );
}

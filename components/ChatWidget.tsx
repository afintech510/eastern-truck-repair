"use client";
import { useState, useRef, useEffect, FormEvent } from "react";
import { MessageCircle, X, Send, Truck, Settings, Flame, ChevronRight } from "lucide-react";
import { useLang, T } from "./Lang";
import { trackLeadConversion, trackChatConversion } from "./GoogleAnalytics";
import { business } from "@/lib/data";
import { truckMakes, equipmentMakes, trailerTypes, equipmentTypes, years } from "@/lib/vehicleData";
import type { ChatMessage, VehicleContext } from "@/lib/chatbot";

type IntakeStep = "vehicle-type" | "vehicle-details" | "symptom" | "chat";
type VehicleType = "truck" | "trailer" | "equipment" | "other";

const vehicleTypeIcons: Record<VehicleType, typeof Truck> = {
  truck: Truck,
  trailer: Truck,
  equipment: Settings,
  other: Flame,
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
  const [open, setOpen] = useState(inline ?? false);
  const [step, setStep] = useState<IntakeStep>("vehicle-type");
  const [vehicleType, setVehicleType] = useState<VehicleType | null>(null);
  const [vehicle, setVehicle] = useState<VehicleContext>({});
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [showBooking, setShowBooking] = useState(false);
  const [bookingName, setBookingName] = useState("");
  const [bookingPhone, setBookingPhone] = useState("");
  const [bookingStatus, setBookingStatus] = useState<"idle" | "sending" | "done" | "error">("idle");
  const [pulseVisible, setPulseVisible] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const t = setTimeout(() => setPulseVisible(false), 5000);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, loading]);

  function skipToFreeText() {
    setStep("symptom");
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
      } else {
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content:
              lang === "es"
                ? `Lo siento, no pude procesar tu mensaje. Por favor llama al ${business.phone}.`
                : `Sorry, I couldn't process that. Please call us at ${business.phone}.`,
          },
        ]);
      }
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            lang === "es"
              ? `Lo siento, el chat no está disponible. Por favor llama al ${business.phone}.`
              : `Sorry, chat is temporarily unavailable. Please call us at ${business.phone}.`,
        },
      ]);
    } finally {
      clearTimeout(timeout);
      setLoading(false);
    }
  }

  function submitSymptom(e: FormEvent) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget as HTMLFormElement);
    const symptom = String(fd.get("symptom") || "");
    if (!symptom.trim()) return;

    const typeLabel =
      vehicleType === "truck"
        ? lang === "es" ? "camión" : "truck"
        : vehicleType === "trailer"
          ? "trailer"
          : vehicleType === "equipment"
            ? lang === "es" ? "equipo" : "equipment"
            : lang === "es" ? "vehículo" : "vehicle";

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

  function handleBookAppointment() {
    setShowBooking(true);
  }

  async function submitBooking(e: FormEvent) {
    e.preventDefault();
    if (!bookingName.trim() || !bookingPhone.trim()) return;
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
          message: `[Chatbot appointment request]\n\nVehicle: ${vehicleInfo || "Not specified"}\n\nConversation:\n${conversationSummary}`,
          company: "",
        }),
      });
      const data = await res.json().catch(() => ({ ok: false }));
      if (!res.ok || !data.ok) throw new Error("submit failed");
      trackLeadConversion("chatbot");
      trackChatConversion("web");
      setBookingStatus("done");
      setShowBooking(false);
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
            className="flex flex-col items-center gap-2 p-4 rounded-lg border border-line bg-steel hover:border-safety hover:bg-steel2 transition text-zinc-200 hover:text-safety"
          >
            <vt.icon size={28} />
            <span className="text-sm font-medium">{lang === "es" ? vt.es : vt.en}</span>
          </button>
        ))}
      </div>
      <button onClick={skipToFreeText} className="mt-3 text-xs text-zinc-500 hover:text-safety transition w-full text-center">
        <T en="Skip — just describe the issue" es="Saltar — solo describe el problema" /> <ChevronRight size={12} className="inline" />
      </button>
    </div>
  );

  const vehicleDetailsForm = (
    <form onSubmit={submitDetails} className="p-4 space-y-3">
      <p className="text-zinc-200 text-sm mb-1">
        <T en="Tell us about your vehicle" es="Cuéntanos sobre tu vehículo" />
      </p>
      <div>
        <label className="block text-xs text-zinc-400 mb-1 uppercase tracking-wide disp font-bold">
          <T en="Year" es="Año" />
        </label>
        <select name="year" className="inp w-full">
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
          <input name="make" type="text" className="inp w-full" placeholder={lang === "es" ? "Marca o tipo" : "Make or type"} />
        ) : (
          <select name="make" className="inp w-full">
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
          <input name="model" type="text" className="inp w-full" placeholder={lang === "es" ? "Ej: 579, 320GC" : "e.g. 579, 320GC"} />
        </div>
      )}
      <button type="submit" className="w-full bg-safety hover:bg-safety-d text-steel py-2.5 rounded disp font-bold transition">
        <T en="Continue" es="Continuar" />
      </button>
      <button type="button" onClick={skipToFreeText} className="text-xs text-zinc-500 hover:text-safety transition w-full text-center">
        <T en="Skip — just describe the issue" es="Saltar — solo describe el problema" /> <ChevronRight size={12} className="inline" />
      </button>
      <style>{`.inp{width:100%;background:#10161d;border:1px solid #313e4d;border-radius:5px;padding:11px 13px;color:#eef2f6;font-size:16px}.inp:focus{outline:none;border-color:#ff7a00}`}</style>
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
        className="inp w-full min-h-[100px]"
        placeholder={
          lang === "es"
            ? "Describa los síntomas, ruidos, luces en el tablero..."
            : "Describe symptoms, noises, dashboard lights..."
        }
      />
      <button type="submit" className="w-full bg-safety hover:bg-safety-d text-steel py-2.5 rounded disp font-bold transition">
        <T en="Send" es="Enviar" />
      </button>
      <style>{`.inp{width:100%;background:#10161d;border:1px solid #313e4d;border-radius:5px;padding:11px 13px;color:#eef2f6;font-size:16px}.inp:focus{outline:none;border-color:#ff7a00}`}</style>
    </form>
  );

  const typingIndicator = (
    <div className="flex items-center gap-1 px-4 py-2">
      <div className="flex gap-1">
        <span className="w-2 h-2 bg-zinc-500 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
        <span className="w-2 h-2 bg-zinc-500 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
        <span className="w-2 h-2 bg-zinc-500 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
      </div>
    </div>
  );

  const ctaButtons = (
    <div className="flex flex-col gap-2 mt-2">
      <button
        onClick={handleBookAppointment}
        className="w-full bg-safety hover:bg-safety-d text-steel py-2.5 rounded disp font-bold text-sm transition"
      >
        <T en="Schedule Appointment" es="Agendar Cita" />
      </button>
      <a
        href={business.phoneHref}
        className="w-full border border-safety text-safety hover:bg-safety/10 py-2.5 rounded disp font-bold text-sm text-center transition block"
      >
        <T en={`Call ${business.phone}`} es={`Llamar ${business.phone}`} />
      </a>
      <button
        onClick={handleBookAppointment}
        className="text-xs text-zinc-400 hover:text-safety transition"
      >
        <T en="$29 Phone Consultation" es="Consulta Telefónica $29" />
      </button>
    </div>
  );

  const bookingForm = (
    <form onSubmit={submitBooking} className="p-3 bg-steel rounded-lg border border-line mt-2 space-y-2">
      <p className="text-xs text-zinc-300 font-medium">
        <T en="Enter your info and we'll call to confirm:" es="Ingresa tus datos y te llamamos para confirmar:" />
      </p>
      <input
        type="text"
        value={bookingName}
        onChange={(e) => setBookingName(e.target.value)}
        placeholder={lang === "es" ? "Nombre" : "Name"}
        required
        className="inp w-full"
      />
      <input
        type="tel"
        value={bookingPhone}
        onChange={(e) => setBookingPhone(e.target.value)}
        placeholder={lang === "es" ? "Teléfono" : "Phone"}
        required
        className="inp w-full"
      />
      <button
        type="submit"
        disabled={bookingStatus === "sending"}
        className="w-full bg-safety hover:bg-safety-d text-steel py-2 rounded disp font-bold text-sm disabled:opacity-60 transition"
      >
        {bookingStatus === "sending"
          ? lang === "es" ? "Enviando…" : "Sending…"
          : lang === "es" ? "Enviar" : "Submit"}
      </button>
      {bookingStatus === "error" && (
        <p className="text-xs text-red-400">
          <T
            en={<>Couldn&apos;t submit. Call us at <a href={business.phoneHref} className="underline">{business.phone}</a>.</>}
            es={<>No se pudo enviar. Llámanos al <a href={business.phoneHref} className="underline">{business.phone}</a>.</>}
          />
        </p>
      )}
      <style>{`.inp{width:100%;background:#10161d;border:1px solid #313e4d;border-radius:5px;padding:11px 13px;color:#eef2f6;font-size:16px}.inp:focus{outline:none;border-color:#ff7a00}`}</style>
    </form>
  );

  const walkinNote = (
    <div className="mx-4 mb-2 px-3 py-2 rounded bg-steel border border-line text-xs text-zinc-400">
      <T
        en="Walk-ins welcome — during busy times there may be a wait to speak with a mechanic"
        es="Se aceptan visitas sin cita — en horarios ocupados puede haber espera para hablar con un mecánico"
      />
    </div>
  );

  const chatPanel = (
    <div
      className={
        inline
          ? "w-full rounded-lg border border-line bg-steel2 overflow-hidden"
          : "fixed bottom-6 right-6 z-50 w-[380px] max-h-[600px] rounded-lg border border-line bg-steel2 shadow-2xl overflow-hidden flex flex-col max-sm:inset-0 max-sm:bottom-0 max-sm:right-0 max-sm:w-full max-sm:max-h-full max-sm:rounded-none"
      }
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-steel border-b border-line">
        <div>
          <h3 className="disp font-bold text-sm text-zinc-100">{business.shortName}</h3>
          <p className="text-xs text-zinc-500">
            <T en="Virtual Service Advisor" es="Asesor de Servicio Virtual" />
          </p>
        </div>
        {!inline && (
          <button onClick={() => setOpen(false)} className="text-zinc-400 hover:text-zinc-200 transition">
            <X size={20} />
          </button>
        )}
      </div>

      {/* Body */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto" style={{ maxHeight: inline ? 420 : 460 }}>
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
                      : "bg-steel text-zinc-200"
                  }`}
                >
                  {m.content}
                </div>
              </div>
            ))}
            {loading && typingIndicator}
            {messages.length > 0 && messages[messages.length - 1].role === "assistant" && !loading && !showBooking && ctaButtons}
            {showBooking && bookingStatus !== "done" && bookingForm}
          </div>
        )}
      </div>

      {/* Walk-in note */}
      {step === "chat" && messages.length > 0 && walkinNote}

      {/* Input area */}
      {step === "chat" && (
        <form onSubmit={handleChatSubmit} className="flex items-center gap-2 p-3 border-t border-line bg-steel">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={lang === "es" ? "Escribe un mensaje…" : "Type a message…"}
            className="flex-1 bg-steel2 border border-line rounded px-3 py-2 text-sm text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-safety"
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
    </div>
  );

  // Floating bubble (not shown in inline mode)
  if (inline) return chatPanel;

  return (
    <>
      {open && chatPanel}
      {!open && (
        <button
          onClick={() => setOpen(true)}
          className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-safety hover:bg-safety-d text-steel grid place-items-center shadow-lg transition-transform hover:scale-105"
        >
          <MessageCircle size={26} />
          {pulseVisible && (
            <span className="absolute inset-0 rounded-full bg-safety animate-ping opacity-40" />
          )}
        </button>
      )}
    </>
  );
}

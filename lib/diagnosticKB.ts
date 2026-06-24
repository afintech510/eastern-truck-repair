export type DiagnosticEntry = {
  symptom: string;
  keywords: string[];
  causes: string[];
  service: string;
  urgency: "immediate" | "soon" | "routine";
};

const entries: DiagnosticEntry[] = [
  // Engine
  {
    symptom: "White smoke from exhaust",
    keywords: ["white smoke", "exhaust smoke", "humo blanco"],
    causes: ["Blown head gasket", "Cracked cylinder head", "Coolant leak into combustion chamber"],
    service: "Engine Repair",
    urgency: "immediate",
  },
  {
    symptom: "Black smoke from exhaust",
    keywords: ["black smoke", "humo negro", "dark smoke"],
    causes: ["Over-fueling / injector failure", "Clogged air filter", "Turbocharger issue", "Faulty fuel pressure regulator"],
    service: "Engine Repair",
    urgency: "soon",
  },
  {
    symptom: "Engine overheating",
    keywords: ["overheating", "overheat", "temperature high", "hot engine", "sobrecalentamiento"],
    causes: ["Coolant leak", "Failed water pump", "Thermostat stuck closed", "Radiator blockage", "Fan clutch failure"],
    service: "Engine Repair",
    urgency: "immediate",
  },
  {
    symptom: "Engine won't start / hard starting",
    keywords: ["won't start", "hard start", "no start", "cranks but", "no arranca", "no enciende"],
    causes: ["Dead batteries", "Starter motor failure", "Fuel system issue", "Glow plug failure (diesel)", "Air in fuel lines"],
    service: "Engine Repair",
    urgency: "immediate",
  },
  {
    symptom: "Rough idle or misfiring",
    keywords: ["rough idle", "misfire", "shaking", "vibrating", "rough running", "tiembla"],
    causes: ["Faulty injector", "Air leak in intake", "EGR valve stuck", "Compression loss in cylinder"],
    service: "Engine Repair",
    urgency: "soon",
  },
  {
    symptom: "Loss of power under load",
    keywords: ["loss of power", "no power", "sluggish", "weak", "sin fuerza", "pierde fuerza"],
    causes: ["Turbocharger failure", "Clogged fuel filter", "DPF restriction", "Boost leak", "Exhaust restriction"],
    service: "Engine Repair",
    urgency: "soon",
  },
  {
    symptom: "Excessive oil consumption",
    keywords: ["burning oil", "oil consumption", "oil smoke", "blue smoke", "consume aceite"],
    causes: ["Worn piston rings", "Valve seal leaks", "Turbo oil seal failure", "PCV system issue"],
    service: "Engine Repair",
    urgency: "soon",
  },

  // Diesel Emissions / DPF
  {
    symptom: "Check engine light + loss of power (DPF related)",
    keywords: ["check engine", "dpf", "def", "regen", "derate", "limp mode", "regeneration", "emission"],
    causes: ["DPF clogged / needs forced regen", "DEF quality sensor failure", "EGR valve failure", "Turbo actuator issue", "SCR catalyst degradation"],
    service: "Diesel Emissions & DPF Service",
    urgency: "soon",
  },
  {
    symptom: "DPF regeneration not completing",
    keywords: ["regen", "regeneration", "dpf light", "soot", "ash"],
    causes: ["Faulty DPF temperature sensor", "DOC (diesel oxidation catalyst) failure", "Excessive idle time preventing regen", "DPF needs cleaning"],
    service: "Diesel Emissions & DPF Service",
    urgency: "soon",
  },
  {
    symptom: "DEF system warning / DEF light on",
    keywords: ["def light", "def warning", "urea", "adblue", "def quality", "def tank"],
    causes: ["Contaminated DEF fluid", "DEF injector clogged", "DEF quality sensor failure", "DEF pump failure", "NOx sensor fault"],
    service: "Diesel Emissions & DPF Service",
    urgency: "soon",
  },

  // Transmission
  {
    symptom: "Transmission slipping or delayed shifts",
    keywords: ["slipping", "delayed shift", "hard shift", "transmission", "gear", "transmisión"],
    causes: ["Low transmission fluid", "Worn clutch packs", "Solenoid failure", "Torque converter issue"],
    service: "Transmission & Driveline",
    urgency: "soon",
  },
  {
    symptom: "Grinding noise when shifting",
    keywords: ["grinding shift", "gear grinding", "hard to shift", "cruje al cambiar"],
    causes: ["Worn synchronizers", "Clutch not fully disengaging", "Low transmission fluid", "Shift linkage issue"],
    service: "Transmission & Driveline",
    urgency: "soon",
  },
  {
    symptom: "Driveshaft vibration",
    keywords: ["driveshaft", "vibration", "shudder", "u-joint", "vibración"],
    causes: ["Worn U-joints", "Driveshaft out of balance", "Carrier bearing failure", "Yoke wear"],
    service: "Transmission & Driveline",
    urgency: "soon",
  },

  // Brakes
  {
    symptom: "Grinding noise when braking",
    keywords: ["grinding", "brake noise", "braking noise", "metal on metal", "frenos rechinan"],
    causes: ["Worn brake pads/shoes", "Damaged rotor/drum", "Caliper or S-cam issue", "Debris in brake assembly"],
    service: "Brake Service",
    urgency: "immediate",
  },
  {
    symptom: "Soft or spongy brake pedal",
    keywords: ["soft brake", "spongy", "brake pedal", "brakes feel", "pedal goes to floor", "freno suave"],
    causes: ["Air in brake lines", "Brake fluid leak", "Worn master cylinder", "Brake booster failure"],
    service: "Brake Service",
    urgency: "immediate",
  },
  {
    symptom: "Air brake system losing pressure",
    keywords: ["air brake", "air pressure", "compressor", "air leak", "presión de aire"],
    causes: ["Air line leak", "Compressor failure", "Dryer needs service", "Gladhand seal worn", "Brake chamber diaphragm tear"],
    service: "Brake Service",
    urgency: "immediate",
  },
  {
    symptom: "ABS warning light on",
    keywords: ["abs light", "abs warning", "antilock", "luz abs"],
    causes: ["Wheel speed sensor failure", "ABS modulator issue", "Wiring/connector damage", "ECU fault"],
    service: "Brake Service",
    urgency: "soon",
  },

  // Electrical
  {
    symptom: "Dead batteries / won't hold charge",
    keywords: ["battery", "dead battery", "won't charge", "no power", "batería muerta"],
    causes: ["Battery end of life", "Alternator not charging", "Parasitic drain", "Corroded connections"],
    service: "Electrical & Diagnostics",
    urgency: "soon",
  },
  {
    symptom: "Warning lights / check engine light",
    keywords: ["warning light", "check engine", "dashboard light", "fault code", "luz de check"],
    causes: ["Sensor failure", "Emission system fault", "Electrical short", "ECM/ECU issue"],
    service: "Electrical & Diagnostics",
    urgency: "soon",
  },

  // Hydraulic
  {
    symptom: "Hydraulic system slow or weak",
    keywords: ["hydraulic slow", "weak hydraulic", "lift slow", "cylinder weak", "hidráulico lento"],
    causes: ["Low hydraulic fluid", "Worn pump", "Internal cylinder bypass", "Clogged filter", "Relief valve issue"],
    service: "Hydraulic Repair",
    urgency: "soon",
  },
  {
    symptom: "Hydraulic fluid leak",
    keywords: ["hydraulic leak", "hose leak", "cylinder leak", "oil leak", "fuga hidráulica", "fuga de aceite"],
    causes: ["Blown hose", "Worn cylinder seals", "Loose fitting", "Cracked line"],
    service: "Hydraulic Hose Fabrication",
    urgency: "immediate",
  },
  {
    symptom: "Hydraulic hose burst",
    keywords: ["hose burst", "hose blew", "broken hose", "manguera rota", "manguera reventada"],
    causes: ["Age/wear deterioration", "Excessive pressure", "Abrasion damage", "Improper hose rating"],
    service: "Hydraulic Hose Fabrication",
    urgency: "immediate",
  },

  // Steering & Suspension
  {
    symptom: "Steering wander or pulling",
    keywords: ["steering", "pulling", "wander", "alignment", "drifting", "dirección"],
    causes: ["Worn tie rod ends", "Alignment off", "Steering gear worn", "King pin wear", "Uneven tire wear"],
    service: "Steering & Suspension",
    urgency: "soon",
  },
  {
    symptom: "Rough ride or bouncing",
    keywords: ["rough ride", "bouncing", "bumpy", "shock", "spring", "suspensión"],
    causes: ["Worn shock absorbers", "Broken leaf spring", "Air bag leak (air ride)", "Bushing wear"],
    service: "Steering & Suspension",
    urgency: "soon",
  },

  // Frame / Structural
  {
    symptom: "Frame crack or damage",
    keywords: ["frame crack", "frame damage", "cracked frame", "bent frame", "chasis roto", "chasis dañado"],
    causes: ["Fatigue cracking", "Overload damage", "Corrosion", "Impact damage"],
    service: "On-Site Welding & Fabrication",
    urgency: "immediate",
  },
  {
    symptom: "Bucket, boom, or attachment damage",
    keywords: ["bucket", "boom", "attachment", "crack", "broken", "bent", "cucharón", "brazo"],
    causes: ["Weld fatigue", "Impact damage", "Overloading", "Pivot pin wear"],
    service: "On-Site Welding & Fabrication",
    urgency: "soon",
  },

  // General / Cooling
  {
    symptom: "Coolant leak",
    keywords: ["coolant leak", "antifreeze", "radiator leak", "hose leak", "fuga de refrigerante"],
    causes: ["Radiator crack", "Hose failure", "Water pump seal", "Head gasket leak", "Heater core"],
    service: "Engine Repair",
    urgency: "soon",
  },
  {
    symptom: "Exhaust leak or loud exhaust",
    keywords: ["exhaust leak", "loud exhaust", "exhaust noise", "escape ruidoso"],
    causes: ["Cracked exhaust manifold", "Failed gasket", "Corroded pipe", "Broken hangers"],
    service: "Engine Repair",
    urgency: "soon",
  },

  // Trailer-specific
  {
    symptom: "Trailer brakes not working",
    keywords: ["trailer brake", "trailer won't stop", "frenos del trailer"],
    causes: ["Brake adjustment needed", "Worn brake shoes", "Air line disconnected or leaking", "Slack adjuster failure"],
    service: "Brake Service",
    urgency: "immediate",
  },
  {
    symptom: "Trailer lights not working",
    keywords: ["trailer light", "no lights", "luces del trailer"],
    causes: ["Corroded connector", "Broken wiring", "Ground fault", "Bulb/LED failure"],
    service: "Electrical & Diagnostics",
    urgency: "soon",
  },
];

export function findRelevantEntries(text: string): DiagnosticEntry[] {
  const lower = text.toLowerCase();
  return entries.filter((e) =>
    e.keywords.some((kw) => lower.includes(kw)),
  );
}

export { entries as diagnosticEntries };

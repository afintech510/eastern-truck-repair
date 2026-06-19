export type ServiceDetail = {
  slug: string;
  icon: string;
  title: { en: string; es: string };
  subtitle: { en: string; es: string };
  intro: { en: string; es: string };
  process: { en: string; es: string }[];
  faqs: { q: { en: string; es: string }; a: { en: string; es: string } }[];
};

export const serviceDetails: ServiceDetail[] = [
  {
    slug: "truck-repair",
    icon: "Truck",
    title: { en: "Commercial Truck Repair", es: "Reparacion de Camiones Comerciales" },
    subtitle: { en: "Box trucks, dumps, tractors, and everything that hauls.", es: "Camiones de caja, volteo, tractores y todo lo que transporta." },
    intro: {
      en: "When your truck is down, your business stops. We diagnose and repair commercial vehicles of all makes and models — from Class 3 box trucks to Class 8 tractor-trailers. Engine rebuilds, transmission work, brake systems, electrical diagnostics, and everything in between. We work on your schedule, not ours.",
      es: "Cuando tu camion para, tu negocio para. Diagnosticamos y reparamos vehiculos comerciales de todas las marcas y modelos — desde camiones de caja Clase 3 hasta tractocamiones Clase 8. Reconstruccion de motores, trabajo de transmision, sistemas de frenos, diagnostico electrico y todo lo demas. Trabajamos en tu horario, no en el nuestro.",
    },
    process: [
      { en: "Call or submit a quote request — we respond same-day.", es: "Llama o envia una solicitud de cotizacion — respondemos el mismo dia." },
      { en: "We diagnose the problem on-site or in our shop.", es: "Diagnosticamos el problema en sitio o en nuestro taller." },
      { en: "You get a clear estimate before any work starts.", es: "Recibes un presupuesto claro antes de que comience cualquier trabajo." },
      { en: "We repair and test — your truck leaves road-ready.", es: "Reparamos y probamos — tu camion sale listo para la carretera." },
    ],
    faqs: [
      { q: { en: "What types of trucks do you repair?", es: "¿Que tipos de camiones reparan?" }, a: { en: "All commercial trucks — box trucks, dump trucks, flatbeds, tractor-trailers, delivery vans, and more. All makes and models, gas and diesel.", es: "Todos los camiones comerciales — de caja, volteo, plataformas, tractocamiones, furgonetas de entrega y mas. Todas las marcas y modelos, gasolina y diesel." } },
      { q: { en: "Do you offer mobile truck repair?", es: "¿Ofrecen reparacion movil de camiones?" }, a: { en: "Yes. If your truck can't be moved, we can bring diagnostic and repair equipment to your location across Eastern Long Island.", es: "Si. Si tu camion no se puede mover, llevamos equipo de diagnostico y reparacion a tu ubicacion en todo Eastern Long Island." } },
      { q: { en: "How fast can you get my truck back on the road?", es: "¿Que tan rapido pueden poner mi camion en marcha?" }, a: { en: "Most common repairs are completed same-day or next-day. We stock common parts and prioritize getting you back to work.", es: "La mayoria de las reparaciones comunes se completan el mismo dia o al dia siguiente. Tenemos partes comunes en stock y priorizamos ponerte de vuelta al trabajo." } },
    ],
  },
  {
    slug: "equipment-repair",
    icon: "Settings",
    title: { en: "Heavy Equipment Repair", es: "Reparacion de Equipo Pesado" },
    subtitle: { en: "Excavators, loaders, dozers, and earth-moving machinery.", es: "Excavadoras, cargadores, bulldozers y maquinaria de movimiento de tierra." },
    intro: {
      en: "Heavy equipment downtime costs hundreds per hour. We service excavators, backhoes, wheel loaders, dozers, skid steers, and compact track loaders — hydraulic systems, undercarriage rebuilds, engine work, and electrical. On-site service available so your machine stays on the job.",
      es: "El tiempo de inactividad del equipo pesado cuesta cientos por hora. Damos servicio a excavadoras, retroexcavadoras, cargadores frontales, bulldozers, minicargadores y cargadores de orugas compactos — sistemas hidraulicos, reconstruccion de rodaje, trabajo de motor y electrico. Servicio en sitio disponible para que tu maquina siga en el trabajo.",
    },
    process: [
      { en: "Describe the issue — we'll assess whether on-site or shop service is best.", es: "Describe el problema — evaluaremos si es mejor servicio en sitio o en taller." },
      { en: "Our technicians diagnose using OEM tools and experience.", es: "Nuestros tecnicos diagnostican usando herramientas OEM y experiencia." },
      { en: "Clear estimate with parts and labor before we start.", es: "Presupuesto claro con partes y mano de obra antes de empezar." },
      { en: "Repair, test under load, and return to service.", es: "Reparacion, prueba bajo carga y regreso al servicio." },
    ],
    faqs: [
      { q: { en: "What brands of equipment do you service?", es: "¿Que marcas de equipo reparan?" }, a: { en: "All major brands — Caterpillar, Komatsu, Kubota, John Deere, Volvo, Case, Bobcat, Takeuchi, and more.", es: "Todas las marcas principales — Caterpillar, Komatsu, Kubota, John Deere, Volvo, Case, Bobcat, Takeuchi y mas." } },
      { q: { en: "Can you repair equipment on my job site?", es: "¿Pueden reparar equipo en mi obra?" }, a: { en: "Yes. Our mobile service rig handles most hydraulic, engine, and welding repairs on-site. No need to transport heavy iron.", es: "Si. Nuestro equipo movil maneja la mayoria de reparaciones hidraulicas, de motor y soldadura en sitio. Sin necesidad de transportar hierro pesado." } },
      { q: { en: "Do you rebuild hydraulic cylinders?", es: "¿Reconstruyen cilindros hidraulicos?" }, a: { en: "Yes. Hydraulic cylinder rebuild, hose replacement, pump repair, and full system diagnostics.", es: "Si. Reconstruccion de cilindros hidraulicos, reemplazo de mangueras, reparacion de bombas y diagnostico completo del sistema." } },
    ],
  },
  {
    slug: "welding",
    icon: "Flame",
    title: { en: "On-Site Welding & Fabrication", es: "Soldadura y Fabricacion en Sitio" },
    subtitle: { en: "Certified welders. We bring the rig to your job site.", es: "Soldadores certificados. Llevamos el equipo a tu obra." },
    intro: {
      en: "Most shops make you tow it in. We don't. Our certified welders come to your site for structural repair, frame work, bucket and boom fixes, and custom fabrication. MIG, TIG, stick, and flux-core on steel, stainless, and aluminum. From cracked excavator booms to custom truck body mounts — if it's metal, we weld it.",
      es: "La mayoria de los talleres te hacen remolcarlo. Nosotros no. Nuestros soldadores certificados llegan a tu obra para reparacion estructural, trabajo de chasis, arreglos de cucharones y brazos, y fabricacion a medida. MIG, TIG, electrodo y flux-core en acero, inoxidable y aluminio. Desde brazos de excavadora agrietados hasta montajes de carroceria — si es metal, lo soldamos.",
    },
    process: [
      { en: "Call with the job details — we'll confirm if it's a shop or field job.", es: "Llama con los detalles del trabajo — confirmamos si es trabajo de taller o de campo." },
      { en: "We dispatch our mobile welding rig to your location.", es: "Enviamos nuestro equipo movil de soldadura a tu ubicacion." },
      { en: "Assess, prep, and weld to spec on-site.", es: "Evaluamos, preparamos y soldamos a especificacion en sitio." },
      { en: "Inspect the weld, clean up, and you're back to work.", es: "Inspeccionamos la soldadura, limpiamos y vuelves al trabajo." },
    ],
    faqs: [
      { q: { en: "Do you do mobile welding?", es: "¿Hacen soldadura movil?" }, a: { en: "Yes — mobile welding is one of our core services. We bring a fully equipped welding rig to your job site, yard, or roadside location across Eastern Long Island.", es: "Si — la soldadura movil es uno de nuestros servicios principales. Llevamos un equipo de soldadura completamente equipado a tu obra, patio o ubicacion en carretera en todo Eastern Long Island." } },
      { q: { en: "What welding processes do you use?", es: "¿Que procesos de soldadura usan?" }, a: { en: "MIG, TIG, stick (SMAW), and flux-core (FCAW) on carbon steel, stainless steel, and aluminum.", es: "MIG, TIG, electrodo (SMAW) y flux-core (FCAW) en acero al carbono, acero inoxidable y aluminio." } },
      { q: { en: "Can you fabricate custom parts?", es: "¿Pueden fabricar piezas a medida?" }, a: { en: "Yes. Brackets, mounts, guards, structural reinforcements, trailer modifications — we build what you need from raw steel.", es: "Si. Soportes, montajes, protecciones, refuerzos estructurales, modificaciones de remolques — construimos lo que necesites desde acero crudo." } },
    ],
  },
  {
    slug: "inspections",
    icon: "ClipboardCheck",
    title: { en: "NY State Inspections", es: "Inspecciones del Estado de NY" },
    subtitle: { en: "Commercial and passenger vehicle inspections, done fast.", es: "Inspecciones de vehiculos comerciales y de pasajeros, hechas rapido." },
    intro: {
      en: "Stay compliant and keep your fleet legal. We perform NY State safety and emissions inspections for commercial trucks, passenger vehicles, and diesel equipment. No appointment needed for most inspections — drive in during business hours and we'll get you through.",
      es: "Manten el cumplimiento y tu flota legal. Realizamos inspecciones de seguridad y emisiones del Estado de NY para camiones comerciales, vehiculos de pasajeros y equipo diesel. No se necesita cita para la mayoria de las inspecciones — ven durante el horario de trabajo y te atendemos.",
    },
    process: [
      { en: "Drive in or call ahead — no appointment needed for most inspections.", es: "Ven directamente o llama — no se necesita cita para la mayoria de las inspecciones." },
      { en: "We run the full NY State safety and emissions check.", es: "Realizamos la revision completa de seguridad y emisiones del Estado de NY." },
      { en: "Pass? You get your sticker and you're on your way.", es: "¿Paso? Recibes tu etiqueta y sigues tu camino." },
      { en: "Failed items? We can repair them right here and re-inspect.", es: "¿Algo fallo? Lo reparamos aqui mismo y reinspeccionamos." },
    ],
    faqs: [
      { q: { en: "Do you inspect commercial trucks?", es: "¿Inspeccionan camiones comerciales?" }, a: { en: "Yes. We inspect commercial vehicles including dump trucks, box trucks, flatbeds, and tractor-trailers for NY State compliance.", es: "Si. Inspeccionamos vehiculos comerciales incluyendo camiones de volteo, de caja, plataformas y tractocamiones para cumplimiento del Estado de NY." } },
      { q: { en: "Do I need an appointment?", es: "¿Necesito cita?" }, a: { en: "Not for most inspections. Drive in during business hours. For fleet inspections (multiple vehicles), call ahead so we can schedule efficiently.", es: "No para la mayoria de las inspecciones. Ven durante el horario de trabajo. Para inspecciones de flota (multiples vehiculos), llama para programar eficientemente." } },
      { q: { en: "What if my vehicle fails inspection?", es: "¿Que pasa si mi vehiculo no pasa la inspeccion?" }, a: { en: "We can repair the failed items in our shop and re-inspect the same day in most cases.", es: "Podemos reparar los items que fallaron en nuestro taller y reinspeccionar el mismo dia en la mayoria de los casos." } },
    ],
  },
  {
    slug: "maintenance",
    icon: "Wrench",
    title: { en: "Preventative Maintenance", es: "Mantenimiento Preventivo" },
    subtitle: { en: "Keep small problems small. Scheduled fleet service.", es: "Manten los problemas pequenos, pequenos. Servicio de flota programado." },
    intro: {
      en: "A breakdown on the LIE costs you more than a scheduled oil change ever will. We offer preventative maintenance programs for commercial fleets — oil and fluid service, brake inspections, belt and hose replacement, DOT readiness checks, and seasonal prep. Keep your trucks running and your DOT record clean.",
      es: "Una averia en la LIE te cuesta mas de lo que jamas costara un cambio de aceite programado. Ofrecemos programas de mantenimiento preventivo para flotas comerciales — servicio de aceite y fluidos, inspecciones de frenos, reemplazo de bandas y mangueras, revisiones de preparacion DOT y preparacion estacional. Manten tus camiones en marcha y tu registro DOT limpio.",
    },
    process: [
      { en: "Tell us your fleet size and service needs.", es: "Dinos el tamano de tu flota y necesidades de servicio." },
      { en: "We build a maintenance schedule around your operations.", es: "Construimos un calendario de mantenimiento alrededor de tus operaciones." },
      { en: "Regular service visits — in shop or at your yard.", es: "Visitas de servicio regulares — en taller o en tu patio." },
      { en: "We track service history and flag upcoming needs.", es: "Rastreamos el historial de servicio y senalamos necesidades futuras." },
    ],
    faqs: [
      { q: { en: "Do you offer fleet maintenance contracts?", es: "¿Ofrecen contratos de mantenimiento de flota?" }, a: { en: "Yes. We work with fleet operators to set up regular maintenance schedules — weekly, biweekly, or monthly depending on your fleet size and usage.", es: "Si. Trabajamos con operadores de flota para establecer calendarios de mantenimiento regulares — semanal, quincenal o mensual dependiendo del tamano y uso de tu flota." } },
      { q: { en: "Can you come to our yard for maintenance?", es: "¿Pueden venir a nuestro patio para mantenimiento?" }, a: { en: "Yes. We offer on-site maintenance for fleets across Eastern Long Island. No need to bring every truck to the shop.", es: "Si. Ofrecemos mantenimiento en sitio para flotas en todo Eastern Long Island. No necesitas traer cada camion al taller." } },
      { q: { en: "What does a basic maintenance visit include?", es: "¿Que incluye una visita basica de mantenimiento?" }, a: { en: "Oil and filter change, fluid top-off, brake check, belt and hose inspection, tire pressure, and a visual safety inspection.", es: "Cambio de aceite y filtro, relleno de fluidos, revision de frenos, inspeccion de bandas y mangueras, presion de llantas e inspeccion visual de seguridad." } },
    ],
  },
  {
    slug: "emergency",
    icon: "Siren",
    title: { en: "Emergency Service", es: "Servicio de Emergencia" },
    subtitle: { en: "Breakdowns don't wait. Neither do we.", es: "Las averias no esperan. Nosotros tampoco." },
    intro: {
      en: "When a truck goes down on the Sunrise Highway or a loader dies mid-dig, you need someone who picks up the phone and moves. We offer priority emergency diagnostics and repair for commercial trucks and heavy equipment across Eastern Long Island. Call us — we'll get there.",
      es: "Cuando un camion se detiene en Sunrise Highway o un cargador muere a media excavacion, necesitas a alguien que conteste el telefono y se mueva. Ofrecemos diagnostico y reparacion de emergencia prioritaria para camiones comerciales y equipo pesado en todo Eastern Long Island. Llamanos — llegaremos.",
    },
    process: [
      { en: "Call us — describe the situation and your location.", es: "Llamanos — describe la situacion y tu ubicacion." },
      { en: "We dispatch the right rig and tools for the job.", es: "Enviamos el equipo y herramientas correctas para el trabajo." },
      { en: "On-site diagnosis and repair whenever possible.", es: "Diagnostico y reparacion en sitio siempre que sea posible." },
      { en: "If it needs the shop, we coordinate towing and fast-track the repair.", es: "Si necesita taller, coordinamos remolque y aceleramos la reparacion." },
    ],
    faqs: [
      { q: { en: "Do you offer 24/7 emergency service?", es: "¿Ofrecen servicio de emergencia 24/7?" }, a: { en: "Call us any time. We prioritize emergencies and respond as fast as possible to get your equipment back in service.", es: "Llamanos a cualquier hora. Priorizamos emergencias y respondemos lo mas rapido posible para poner tu equipo de vuelta en servicio." } },
      { q: { en: "How fast can you get to my location?", es: "¿Que tan rapido pueden llegar a mi ubicacion?" }, a: { en: "Response time depends on your location and current workload, but we serve all of Eastern Long Island and prioritize getting to breakdown calls quickly.", es: "El tiempo de respuesta depende de tu ubicacion y carga de trabajo actual, pero servimos todo Eastern Long Island y priorizamos llegar rapido a llamadas de averia." } },
      { q: { en: "What if my truck needs to be towed?", es: "¿Que pasa si mi camion necesita ser remolcado?" }, a: { en: "If we can't fix it on-site, we'll coordinate towing to our shop and fast-track the repair so you're back on the road as soon as possible.", es: "Si no podemos arreglarlo en sitio, coordinamos el remolque a nuestro taller y aceleramos la reparacion para que vuelvas a la carretera lo antes posible." } },
    ],
  },
];

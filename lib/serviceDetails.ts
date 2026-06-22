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
    slug: "hydraulic-hose",
    icon: "Gauge",
    title: { en: "Hydraulic Hose Fabrication & Repair", es: "Fabricacion y Reparacion de Mangueras Hidraulicas" },
    subtitle: { en: "Custom hose assemblies built same-day. High-pressure lines for trucks, excavators, and heavy equipment.", es: "Ensamblajes de manguera a medida el mismo dia. Lineas de alta presion para camiones, excavadoras y equipo pesado." },
    intro: {
      en: "A blown hydraulic hose shuts your machine down and your job site with it. We fabricate custom hydraulic hose assemblies in-house — matched to your exact pressure rating, temperature spec, and fitting size. From excavator boom lines running at 5,000 PSI to loader steering hoses, we cut, crimp, and test same-day so your iron gets back to work. We stock a range of hose sizes up to 2 inches, high-pressure fittings, quick disconnects, and adapters for construction equipment, dump trucks, ag machinery, vacuum trucks, and marine applications.",
      es: "Una manguera hidraulica reventada detiene tu maquina y tu obra con ella. Fabricamos ensamblajes de manguera hidraulica a medida en taller — con la presion, temperatura y tamano de conexion exactos. Desde lineas de brazo de excavadora a 5,000 PSI hasta mangueras de direccion de cargador, cortamos, prensamos y probamos el mismo dia para que tu hierro vuelva al trabajo. Tenemos en stock mangueras de hasta 2 pulgadas, conexiones de alta presion, desconexion rapida y adaptadores para equipo de construccion, camiones de volteo, maquinaria agricola, camiones de vacio y aplicaciones marinas.",
    },
    process: [
      { en: "Bring the old hose or give us the specs — length, pressure rating, fitting type, and application.", es: "Trae la manguera vieja o danos las especificaciones — largo, presion, tipo de conexion y aplicacion." },
      { en: "We match the right hose and fittings to your pressure and temperature requirements.", es: "Seleccionamos la manguera y conexiones correctas para tus requisitos de presion y temperatura." },
      { en: "Cut, crimp, and pressure-test the assembly in our shop.", es: "Cortamos, prensamos y probamos la presion del ensamblaje en nuestro taller." },
      { en: "Pick it up same-day — or we can install it on-site.", es: "Recogelo el mismo dia — o podemos instalarlo en sitio." },
    ],
    faqs: [
      { q: { en: "How fast can you make a hydraulic hose?", es: "¿Que tan rapido pueden hacer una manguera hidraulica?" }, a: { en: "Most custom hose assemblies are fabricated same-day. Bring in the old hose or your specs and we'll have you back on the job as fast as possible.", es: "La mayoria de los ensamblajes se fabrican el mismo dia. Trae la manguera vieja o tus especificaciones y te tendremos de vuelta al trabajo lo mas rapido posible." } },
      { q: { en: "What pressure ratings do you support?", es: "¿Que presiones manejan?" }, a: { en: "We fabricate hoses rated up to 6,000 PSI for high-pressure hydraulic applications — excavators, loaders, cranes, dump trucks, and more. We match the hose, fittings, and crimp to the exact OEM or application spec.", es: "Fabricamos mangueras hasta 6,000 PSI para aplicaciones hidraulicas de alta presion — excavadoras, cargadores, gruas, camiones de volteo y mas. Ajustamos la manguera, conexiones y prensado a la especificacion OEM o de la aplicacion." } },
      { q: { en: "Can you replace hydraulic hoses on-site?", es: "¿Pueden reemplazar mangueras hidraulicas en sitio?" }, a: { en: "Yes. If your equipment can't be moved, we can fabricate the hose in our shop and come to your job site to install it. We also carry common sizes on our mobile service rig for field replacements.", es: "Si. Si tu equipo no se puede mover, fabricamos la manguera en taller y vamos a tu obra a instalarla. Tambien llevamos tamanos comunes en nuestro equipo movil para reemplazos en campo." } },
      { q: { en: "What types of equipment do you make hoses for?", es: "¿Para que tipos de equipo hacen mangueras?" }, a: { en: "Excavators, backhoes, wheel loaders, skid steers, dump trucks, vacuum trucks, cranes, forklifts, agricultural equipment, and marine hydraulic systems. If it runs on hydraulic pressure, we can build the hose for it.", es: "Excavadoras, retroexcavadoras, cargadores, minicargadores, camiones de volteo, camiones de vacio, gruas, montacargas, equipo agricola y sistemas hidraulicos marinos. Si funciona con presion hidraulica, podemos fabricar la manguera." } },
    ],
  },
  {
    slug: "diesel-emissions",
    icon: "Fuel",
    title: { en: "Diesel Emissions & DPF Service", es: "Emisiones Diesel y Servicio DPF" },
    subtitle: { en: "DPF cleaning, DEF repair, EGR service. Avoid derate, avoid fines, stay running.", es: "Limpieza DPF, reparacion DEF, servicio EGR. Evita derate, evita multas, sigue trabajando." },
    intro: {
      en: "Every time that check engine light comes on and your truck goes into derate mode, you're losing money. Clogged DPF filters, failed regen cycles, DEF system faults, and worn EGR valves don't just slow you down — they can trigger fines exceeding $45,000 per non-compliant vehicle. We diagnose and service the full diesel aftertreatment system: DPF cleaning and forced regeneration, DEF dosing system diagnostics, SCR catalyst service, EGR valve replacement, sensor and wiring repair, and ECM resets. We get your truck out of derate and back on the road — compliant and running clean.",
      es: "Cada vez que se enciende la luz de check engine y tu camion entra en modo derate, pierdes dinero. Filtros DPF tapados, ciclos de regeneracion fallidos, fallas del sistema DEF y valvulas EGR desgastadas no solo te frenan — pueden generar multas que superan $45,000 por vehiculo no conforme. Diagnosticamos y damos servicio al sistema completo de post-tratamiento diesel: limpieza DPF y regeneracion forzada, diagnostico del sistema de dosificacion DEF, servicio del catalizador SCR, reemplazo de valvula EGR, reparacion de sensores y cableado, y resets de ECM. Sacamos tu camion del derate y lo ponemos de vuelta en la carretera — conforme y funcionando limpio.",
    },
    process: [
      { en: "Call with your symptoms — derate mode, regen failures, DEF warnings, or check engine codes.", es: "Llama con tus sintomas — modo derate, fallas de regeneracion, advertencias DEF o codigos de check engine." },
      { en: "We pull codes and diagnose the aftertreatment system — DPF, DEF, EGR, SCR, and sensors.", es: "Leemos codigos y diagnosticamos el sistema de post-tratamiento — DPF, DEF, EGR, SCR y sensores." },
      { en: "Clean, repair, or replace the failed components and reset the ECM.", es: "Limpiamos, reparamos o reemplazamos los componentes fallidos y reseteamos el ECM." },
      { en: "Verify the system is out of derate, running clean, and road-ready.", es: "Verificamos que el sistema salio del derate, funciona limpio y esta listo para la carretera." },
    ],
    faqs: [
      { q: { en: "What is DPF cleaning and how often does it need to be done?", es: "¿Que es la limpieza DPF y cada cuanto se necesita?" }, a: { en: "The Diesel Particulate Filter (DPF) traps soot from your exhaust. Over time it clogs — especially if your truck does a lot of stop-and-go or short runs that prevent full regeneration. We clean the DPF to restore exhaust flow and prevent forced regen failures. Most trucks need DPF service every 100,000-200,000 miles, but hard-working fleets often need it sooner.", es: "El Filtro de Particulas Diesel (DPF) atrapa hollin del escape. Con el tiempo se tapa — especialmente si tu camion hace mucho arranque y parada o recorridos cortos que impiden la regeneracion completa. Limpiamos el DPF para restaurar el flujo de escape y prevenir fallas de regeneracion. La mayoria de los camiones necesitan servicio DPF cada 100,000-200,000 millas, pero flotas de trabajo pesado a menudo lo necesitan antes." } },
      { q: { en: "My truck is stuck in derate mode — can you fix it?", es: "¿Mi camion esta en modo derate — pueden arreglarlo?" }, a: { en: "Yes. Derate mode is usually triggered by a DPF, DEF, or EGR fault. We diagnose the root cause — whether it's a clogged filter, a bad DEF injector, a faulty NOx sensor, or an EGR valve issue — and fix it so your truck runs at full power again.", es: "Si. El modo derate generalmente es causado por una falla de DPF, DEF o EGR. Diagnosticamos la causa raiz — ya sea un filtro tapado, inyector DEF malo, sensor NOx defectuoso o problema de valvula EGR — y lo reparamos para que tu camion funcione a plena potencia otra vez." } },
      { q: { en: "Do you service DEF systems?", es: "¿Dan servicio a sistemas DEF?" }, a: { en: "Yes. We diagnose and repair the full DEF (Diesel Exhaust Fluid) dosing system — DEF pump, injector, tank, lines, quality sensors, and NOx sensors. DEF system faults are one of the most common causes of derate mode in modern diesel trucks.", es: "Si. Diagnosticamos y reparamos el sistema completo de dosificacion DEF — bomba DEF, inyector, tanque, lineas, sensores de calidad y sensores NOx. Las fallas del sistema DEF son una de las causas mas comunes del modo derate en camiones diesel modernos." } },
      { q: { en: "What brands of trucks do you service for emissions work?", es: "¿Que marcas de camiones atienden para trabajo de emisiones?" }, a: { en: "All major brands — Freightliner, Kenworth, Peterbilt, International, Volvo, Mack, Hino, and Isuzu. Cummins, Detroit Diesel, Paccar, and Navistar engines. The aftertreatment systems are similar across manufacturers, and we have the diagnostic tools to work on all of them.", es: "Todas las marcas principales — Freightliner, Kenworth, Peterbilt, International, Volvo, Mack, Hino e Isuzu. Motores Cummins, Detroit Diesel, Paccar y Navistar. Los sistemas de post-tratamiento son similares entre fabricantes, y tenemos las herramientas de diagnostico para trabajar en todos." } },
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

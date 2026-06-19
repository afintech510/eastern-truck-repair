export type Equipment = {
  slug: string;
  icon: string;
  title: { en: string; es: string };
  subtitle: { en: string; es: string };
  intro: { en: string; es: string };
  services: { en: string; es: string }[];
  brands: string[];
  faqs: { q: { en: string; es: string }; a: { en: string; es: string } }[];
};

export const equipment: Equipment[] = [
  {
    slug: "excavators",
    icon: "Settings",
    title: { en: "Excavator Repair", es: "Reparacion de Excavadoras" },
    subtitle: { en: "Hydraulics, undercarriage, boom, and engine service.", es: "Hidraulica, rodaje, brazo y servicio de motor." },
    intro: {
      en: "Excavators take constant abuse — hydraulic failures, undercarriage wear, cracked booms, and engine trouble come with the territory. We service all sizes from mini excavators to 50-ton machines, on-site or in shop. Hydraulic cylinder rebuilds, track and roller replacement, boom and stick welding, and complete engine overhauls.",
      es: "Las excavadoras sufren abuso constante — fallas hidraulicas, desgaste de rodaje, brazos agrietados y problemas de motor vienen con el territorio. Damos servicio a todos los tamanos desde miniexcavadoras hasta maquinas de 50 toneladas, en sitio o en taller. Reconstruccion de cilindros hidraulicos, reemplazo de orugas y rodillos, soldadura de brazo y pluma, y overhauls completos de motor.",
    },
    services: [
      { en: "Hydraulic cylinder rebuild and hose replacement", es: "Reconstruccion de cilindros hidraulicos y reemplazo de mangueras" },
      { en: "Undercarriage rebuild — tracks, rollers, idlers, sprockets", es: "Reconstruccion de rodaje — orugas, rodillos, tensores, sprockets" },
      { en: "Boom and stick crack repair (certified welding)", es: "Reparacion de grietas en brazo y pluma (soldadura certificada)" },
      { en: "Bucket teeth, cutting edges, and hardfacing", es: "Dientes de cucharon, bordes de corte y recubrimiento duro" },
      { en: "Engine and turbo repair", es: "Reparacion de motor y turbo" },
      { en: "Electrical diagnostics and wiring", es: "Diagnostico electrico y cableado" },
    ],
    brands: ["Caterpillar", "Komatsu", "Kubota", "John Deere", "Volvo", "Case", "Kobelco", "Takeuchi", "Bobcat"],
    faqs: [
      { q: { en: "Can you repair my excavator on the job site?", es: "¿Pueden reparar mi excavadora en la obra?" }, a: { en: "Yes. Most hydraulic, welding, and engine repairs can be done on-site with our mobile service rig. No need to transport a 30-ton machine.", es: "Si. La mayoria de las reparaciones hidraulicas, de soldadura y de motor se pueden hacer en sitio con nuestro equipo movil. Sin necesidad de transportar una maquina de 30 toneladas." } },
      { q: { en: "How much does excavator undercarriage replacement cost?", es: "¿Cuanto cuesta el reemplazo de rodaje de excavadora?" }, a: { en: "Cost depends on machine size and component condition. Call us with your make, model, and what's worn — we'll give you a clear estimate.", es: "El costo depende del tamano de la maquina y condicion de los componentes. Llamanos con tu marca, modelo y que esta desgastado — te daremos un presupuesto claro." } },
    ],
  },
  {
    slug: "dump-trucks",
    icon: "Truck",
    title: { en: "Dump Truck Repair", es: "Reparacion de Camiones de Volteo" },
    subtitle: { en: "Hydraulic lifts, body work, diesel engines, and frames.", es: "Elevadores hidraulicos, carroceria, motores diesel y chasis." },
    intro: {
      en: "Dump trucks work harder than almost anything on the road — hauling aggregate, dirt, and demolition debris takes its toll on hydraulic hoists, frames, bodies, and drivetrains. We handle everything from hydraulic lift cylinder rebuilds to frame crack welding, body floor patching, PTO repair, and complete diesel engine service.",
      es: "Los camiones de volteo trabajan mas duro que casi cualquier cosa en la carretera — transportar agregado, tierra y escombros de demolicion cobra su precio en elevadores hidraulicos, chasis, carrocerias y trenes motrices. Manejamos todo, desde reconstruccion de cilindros de elevacion hidraulica hasta soldadura de grietas de chasis, parcheo de piso de carroceria, reparacion de PTO y servicio completo de motor diesel.",
    },
    services: [
      { en: "Hydraulic hoist and cylinder repair", es: "Reparacion de elevador hidraulico y cilindros" },
      { en: "Dump body floor and sidewall patching", es: "Parcheo de piso y paredes laterales de carroceria" },
      { en: "Frame crack welding and reinforcement", es: "Soldadura de grietas de chasis y refuerzo" },
      { en: "PTO and pump service", es: "Servicio de PTO y bomba" },
      { en: "Diesel engine repair and overhaul", es: "Reparacion y overhaul de motor diesel" },
      { en: "Tailgate repair and hinge replacement", es: "Reparacion de compuerta y reemplazo de bisagras" },
    ],
    brands: ["International", "Mack", "Kenworth", "Peterbilt", "Freightliner", "Ford", "Chevrolet", "Hino"],
    faqs: [
      { q: { en: "Can you weld a cracked dump truck frame?", es: "¿Pueden soldar un chasis de camion de volteo agrietado?" }, a: { en: "Yes. Frame welding is one of our specialties. We assess the crack, prep the metal, and weld to structural spec — on-site or in shop.", es: "Si. La soldadura de chasis es una de nuestras especialidades. Evaluamos la grieta, preparamos el metal y soldamos a especificacion estructural — en sitio o en taller." } },
      { q: { en: "My dump body floor is rusted through — can you fix it?", es: "¿Mi piso de carroceria esta oxidado — pueden arreglarlo?" }, a: { en: "Yes. We cut out the damaged section and weld in new plate steel. Stronger than the original.", es: "Si. Cortamos la seccion danada y soldamos placa de acero nueva. Mas fuerte que el original." } },
    ],
  },
  {
    slug: "wheel-loaders",
    icon: "Settings",
    title: { en: "Wheel Loader Repair", es: "Reparacion de Cargadores Frontales" },
    subtitle: { en: "Drivetrain, hydraulics, buckets, and tire service.", es: "Tren motriz, hidraulica, cucharones y servicio de llantas." },
    intro: {
      en: "Wheel loaders run all day loading trucks, moving material, and grading sites. That means transmission wear, hydraulic fatigue, bucket edge damage, and tire abuse. We service all sizes from compact loaders to full-size production machines — transmission rebuilds, hydraulic pump and cylinder service, bucket cutting edge and tooth replacement, and axle repair.",
      es: "Los cargadores frontales trabajan todo el dia cargando camiones, moviendo material y nivelando sitios. Eso significa desgaste de transmision, fatiga hidraulica, dano en bordes de cucharon y abuso de llantas. Damos servicio a todos los tamanos desde cargadores compactos hasta maquinas de produccion de tamano completo — reconstrucciones de transmision, servicio de bomba y cilindro hidraulico, reemplazo de bordes de corte y dientes de cucharon, y reparacion de ejes.",
    },
    services: [
      { en: "Transmission rebuild and torque converter service", es: "Reconstruccion de transmision y servicio de convertidor de par" },
      { en: "Hydraulic pump, valve, and cylinder repair", es: "Reparacion de bomba, valvula y cilindro hidraulico" },
      { en: "Bucket cutting edge and tooth replacement", es: "Reemplazo de borde de corte y dientes de cucharon" },
      { en: "Axle and differential repair", es: "Reparacion de ejes y diferencial" },
      { en: "Brake service", es: "Servicio de frenos" },
      { en: "Engine diagnostics and repair", es: "Diagnostico y reparacion de motor" },
    ],
    brands: ["Caterpillar", "Komatsu", "Volvo", "John Deere", "Case", "Kubota", "Doosan"],
    faqs: [
      { q: { en: "Can you service my loader on-site?", es: "¿Pueden dar servicio a mi cargador en sitio?" }, a: { en: "Yes. Hydraulic repairs, welding, and most mechanical work can be done at your yard or job site.", es: "Si. Reparaciones hidraulicas, soldadura y la mayoria del trabajo mecanico se pueden hacer en tu patio u obra." } },
      { q: { en: "How long does a loader transmission rebuild take?", es: "¿Cuanto tarda una reconstruccion de transmision de cargador?" }, a: { en: "Typically 3-5 days depending on parts availability and the extent of the damage. We'll give you a timeline upfront.", es: "Tipicamente 3-5 dias dependiendo de la disponibilidad de partes y la extension del dano. Te damos un cronograma desde el inicio." } },
    ],
  },
  {
    slug: "skid-steers",
    icon: "Settings",
    title: { en: "Skid Steer & Track Loader Repair", es: "Reparacion de Minicargadores" },
    subtitle: { en: "Hydraulics, drive motors, tracks, and attachments.", es: "Hidraulica, motores de traccion, orugas y accesorios." },
    intro: {
      en: "Skid steers and compact track loaders are the workhorses of every job site — and they break down hard when pushed. Drive motor failures, hydraulic leaks, track tension issues, and bucket wear are daily realities. We repair all brands on-site or in shop, from hydraulic motor swaps to complete engine rebuilds.",
      es: "Los minicargadores y cargadores de orugas compactos son los caballos de batalla de cada obra — y se averan fuerte cuando se les exige. Fallas de motor de traccion, fugas hidraulicas, problemas de tension de orugas y desgaste de cucharon son realidades diarias. Reparamos todas las marcas en sitio o en taller, desde cambios de motor hidraulico hasta reconstrucciones completas de motor.",
    },
    services: [
      { en: "Drive motor and final drive repair", es: "Reparacion de motor de traccion y mando final" },
      { en: "Hydraulic pump and control valve service", es: "Servicio de bomba hidraulica y valvula de control" },
      { en: "Track replacement and tension adjustment", es: "Reemplazo de orugas y ajuste de tension" },
      { en: "Bucket and attachment repair/fabrication", es: "Reparacion y fabricacion de cucharon y accesorios" },
      { en: "Engine service and overhaul", es: "Servicio y overhaul de motor" },
      { en: "Electrical and control system diagnostics", es: "Diagnostico de sistema electrico y de control" },
    ],
    brands: ["Bobcat", "Caterpillar", "John Deere", "Kubota", "Case", "Takeuchi", "New Holland", "ASV"],
    faqs: [
      { q: { en: "Do you work on both wheeled and tracked skid steers?", es: "¿Trabajan en minicargadores de ruedas y de orugas?" }, a: { en: "Yes. We service both wheeled skid steers and compact track loaders — all brands and sizes.", es: "Si. Damos servicio a minicargadores de ruedas y de orugas compactos — todas las marcas y tamanos." } },
      { q: { en: "Can you fabricate custom attachments?", es: "¿Pueden fabricar accesorios a medida?" }, a: { en: "Yes. Custom buckets, grapples, mount plates, and specialty attachments — built to your specs.", es: "Si. Cucharones, garras, placas de montaje y accesorios especiales a medida — construidos a tus especificaciones." } },
    ],
  },
  {
    slug: "trailers",
    icon: "Truck",
    title: { en: "Trailer Repair & Welding", es: "Reparacion y Soldadura de Remolques" },
    subtitle: { en: "Frame, floor, axle, brake, and structural welding.", es: "Chasis, piso, ejes, frenos y soldadura estructural." },
    intro: {
      en: "Trailers take a beating — overloaded floors, cracked crossmembers, worn axles, and failing brakes. We handle structural welding, floor replacement, axle and suspension work, brake service, and DOT compliance repairs for flatbeds, dumps, lowboys, enclosed trailers, and utility trailers.",
      es: "Los remolques sufren mucho — pisos sobrecargados, travesanos agrietados, ejes desgastados y frenos fallando. Manejamos soldadura estructural, reemplazo de piso, trabajo de ejes y suspension, servicio de frenos y reparaciones de cumplimiento DOT para plataformas, volteos, lowboys, remolques cerrados y utilitarios.",
    },
    services: [
      { en: "Structural frame welding and crossmember replacement", es: "Soldadura estructural de chasis y reemplazo de travesanos" },
      { en: "Floor replacement (steel and wood deck)", es: "Reemplazo de piso (cubierta de acero y madera)" },
      { en: "Axle, bearing, and suspension repair", es: "Reparacion de ejes, rodamientos y suspension" },
      { en: "Brake service and adjustment", es: "Servicio y ajuste de frenos" },
      { en: "Landing gear repair", es: "Reparacion de patas de apoyo" },
      { en: "DOT compliance and inspection prep", es: "Cumplimiento DOT y preparacion para inspeccion" },
    ],
    brands: ["Utility Trailer", "Great Dane", "Wabash", "East", "Fontaine", "Eager Beaver", "PJ Trailers", "Big Tex"],
    faqs: [
      { q: { en: "Can you weld a cracked trailer frame?", es: "¿Pueden soldar un chasis de remolque agrietado?" }, a: { en: "Yes. We assess the damage, prep the metal, and weld structural repairs that meet or exceed the original spec. On-site or in shop.", es: "Si. Evaluamos el dano, preparamos el metal y soldamos reparaciones estructurales que igualan o superan la especificacion original. En sitio o en taller." } },
      { q: { en: "Do you replace trailer floors?", es: "¿Reemplazan pisos de remolques?" }, a: { en: "Yes. Full or partial floor replacement — steel plate or wood deck, depending on your trailer type.", es: "Si. Reemplazo de piso completo o parcial — placa de acero o cubierta de madera, dependiendo del tipo de remolque." } },
    ],
  },
];

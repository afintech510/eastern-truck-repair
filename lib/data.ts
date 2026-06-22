export const business = {
  name: "Eastern Truck & Equipment Repair & Welding",
  shortName: "Eastern Truck & Equipment",
  phone: "(631) 939-1397",
  phoneHref: "tel:+16319391397",
  address: "91 N Phillips Ave",
  city: "Speonk", state: "NY", zip: "11972",
  region: "Eastern Long Island",
  hours: { en: "Mon-Fri 7AM-5PM", es: "Lun-Vie 7AM-5PM" },
};

export type Service = {
  slug: string; icon: string; featured?: boolean;
  en: { name: string; blurb: string; bullets: string[] };
  es: { name: string; blurb: string; bullets: string[] };
};

export const services: Service[] = [
  { slug: "truck-repair", icon: "Truck",
    en: { name: "Commercial Truck Repair", blurb: "Complete service for box trucks, dumps, and tractors.",
      bullets: ["Engine rebuilds & overhauls","Transmission & driveline","Brakes, suspension, steering","Electrical & diagnostics"] },
    es: { name: "Reparacion de Camiones", blurb: "Servicio completo para camiones de caja, volteo y tractores.",
      bullets: ["Reconstruccion de motores","Transmision y tren motriz","Frenos, suspension, direccion","Electrico y diagnostico"] } },
  { slug: "equipment-repair", icon: "Settings",
    en: { name: "Heavy Equipment Repair", blurb: "Earth-moving machinery kept job-ready.",
      bullets: ["Excavators & backhoes","Wheel loaders & dozers","Hydraulic repair","Undercarriage rebuilds"] },
    es: { name: "Reparacion de Equipo Pesado", blurb: "Maquinaria de movimiento de tierra lista para trabajar.",
      bullets: ["Excavadoras y retroexcavadoras","Cargadores y bulldozers","Reparacion hidraulica","Reconstruccion de rodaje"] } },
  { slug: "welding", icon: "Flame", featured: true,
    en: { name: "On-Site Welding & Fabrication", blurb: "Certified welding - we bring the rig to your job site.",
      bullets: ["Mobile / on-site welding","Structural & frame repair","Bucket & boom repair","Custom fabrication"] },
    es: { name: "Soldadura y Fabricacion en Sitio", blurb: "Soldadura certificada - llevamos el equipo a tu obra.",
      bullets: ["Soldadura movil / en sitio","Reparacion estructural y de chasis","Reparacion de cucharones y brazos","Fabricacion a medida"] } },
  { slug: "inspections", icon: "ClipboardCheck",
    en: { name: "NY State Inspections", blurb: "Official inspections done fast.",
      bullets: ["Commercial & passenger","Diesel inspections","Quick turnaround"] },
    es: { name: "Inspecciones del Estado de NY", blurb: "Inspecciones oficiales hechas rapido.",
      bullets: ["Comercial y de pasajeros","Inspecciones diesel","Servicio rapido"] } },
  { slug: "maintenance", icon: "Wrench",
    en: { name: "Preventative Maintenance", blurb: "Keep small problems small.",
      bullets: ["Scheduled fleet service","Oil & fluid service","DOT readiness"] },
    es: { name: "Mantenimiento Preventivo", blurb: "Manten los problemas pequenos, pequenos.",
      bullets: ["Servicio de flota programado","Servicio de aceite y fluidos","Preparacion DOT"] } },
  { slug: "hydraulic-hose", icon: "Gauge",
    en: { name: "Hydraulic Hose Fabrication", blurb: "Custom hose assemblies built same-day. Get your machine back to work.",
      bullets: ["Same-day custom fabrication","High-pressure hose up to 6,000 PSI","Fittings, adapters & quick disconnects","On-site hose replacement available"] },
    es: { name: "Fabricacion de Mangueras Hidraulicas", blurb: "Ensamblajes de manguera a medida el mismo dia. Pon tu maquina a trabajar.",
      bullets: ["Fabricacion a medida el mismo dia","Manguera de alta presion hasta 6,000 PSI","Conexiones, adaptadores y desconexion rapida","Reemplazo de manguera en sitio disponible"] } },
  { slug: "diesel-emissions", icon: "Fuel",
    en: { name: "Diesel Emissions & DPF Service", blurb: "DPF cleaning, DEF system repair, EGR service. Stay compliant, stay running.",
      bullets: ["DPF cleaning & regeneration","DEF system diagnostics & repair","EGR valve service","SCR & aftertreatment repair"] },
    es: { name: "Emisiones Diesel y Servicio DPF", blurb: "Limpieza DPF, reparacion de sistema DEF, servicio EGR. Cumple y sigue trabajando.",
      bullets: ["Limpieza y regeneracion DPF","Diagnostico y reparacion sistema DEF","Servicio de valvula EGR","Reparacion SCR y post-tratamiento"] } },
  { slug: "emergency", icon: "Siren",
    en: { name: "Emergency Service", blurb: "Breakdowns don't wait. Neither do we.",
      bullets: ["Priority diagnostics","Fast parts sourcing","Get back to work fast"] },
    es: { name: "Servicio de Emergencia", blurb: "Las averias no esperan. Nosotros tampoco.",
      bullets: ["Diagnostico prioritario","Busqueda rapida de partes","Regresa a trabajar rapido"] } },
];

export const towns = [
  "Speonk","Westhampton","Eastport","Hampton Bays","Flanders",
  "Riverhead","Calverton","Manorville","Center Moriches","East Moriches",
  "Shirley","Mastic","Patchogue","Southampton",
];
export const townSlug = (t: string) => t.toLowerCase().replace(/\s+/g, "-");

// ── Per-town rich content (the differentiation layer) ───────────────────────
// Keyed by townSlug(). A town WITHOUT an entry falls back to generic copy on its
// page — so this can be filled in incrementally. Keep facts real (roads/landmarks
// you can verify); never invent testimonials, job stories, or certifications.
export type TownContent = {
  blurb: { en: string; es: string };    // unique hero subcopy (replaces the generic line)
  roads: string[];                       // real arteries we run service trucks along
  localWork: { en: string; es: string }; // the trucks/equipment that dominate locally
};

export const townContent: Record<string, TownContent> = {
  speonk: {
    blurb: {
      en: "Serving as our home base, this community is where we dispatch our fully equipped mobile rigs to keep local contractors and fleet operators running. We bring expert heavy mechanic and welding services straight to your yard or breakdown site, minimizing expensive downtime. You can rely on our team for rapid on-site solutions that get your iron back to work.",
      es: "Sirviendo como nuestra base principal, esta comunidad es desde donde enviamos nuestros equipos moviles completamente equipados para mantener en marcha a los contratistas y operadores de flotas locales. Llevamos servicios expertos de mecanica pesada y soldadura directamente a su patio o sitio de averia, minimizando el costoso tiempo de inactividad. Puede confiar en nuestro equipo para obtener soluciones rapidas en el sitio que devuelven su maquinaria al trabajo.",
    },
    roads: ["Montauk Highway (County Route 80)", "Speonk-Riverhead Road", "Sunrise Highway (NY-27)"],
    localWork: {
      en: "Operating out of our own backyard, we frequently service the heavy-duty dump trucks, landscaping trailers, and earthmoving equipment essential to local development. Whether it is structural welding on a payloader or preventative maintenance for a regional delivery fleet, our mobile units handle the tough jobs right where they stand.",
      es: "Operando desde nuestro propio patio trasero, reparamos frecuentemente los camiones volquetes de servicio pesado, remolques de jardineria y equipos de movimiento de tierras esenciales para el desarrollo local. Ya sea soldadura estructural en un cargador o mantenimiento preventivo para una flota de entrega regional, nuestras unidades moviles manejan los trabajos dificiles justo donde se encuentran.",
    },
  },
  riverhead: {
    blurb: {
      en: "Riverhead is the working hub of the East End — Route 58 traffic, farm and sod equipment, and commercial fleets all pass through. We bring mobile welding and diesel service straight to the yard so a breakdown on the county seat's busiest corridor doesn't cost you the day.",
      es: "Riverhead es el centro de trabajo del East End — el trafico de la Route 58, equipo agricola y de cesped, y flotas comerciales pasan por aqui. Llevamos soldadura movil y servicio diesel directo al patio para que una averia en el corredor mas concurrido no te cueste el dia.",
    },
    roads: ["Route 58 (Old Country Road)", "Main Road (Route 25)", "County Road 105"],
    localWork: {
      en: "From dump trucks and landscaper fleets to ag equipment off the North Fork farms, Riverhead's mixed commercial base is exactly the work our shop is built for.",
      es: "Desde camiones de volteo y flotas de jardineria hasta equipo agricola de las granjas del North Fork, la base comercial mixta de Riverhead es justo el trabajo para el que esta hecho nuestro taller.",
    },
  },
  calverton: {
    blurb: {
      en: "Calverton's Enterprise Park (EPCAL) and the distribution yards off Route 25 keep heavy equipment moving every day. When an excavator, loader, or fleet truck goes down out here, our mobile rig handles structural welds and diesel repair on the spot.",
      es: "El Enterprise Park de Calverton (EPCAL) y los patios de distribucion junto a la Route 25 mantienen el equipo pesado en movimiento cada dia. Cuando una excavadora, cargador o camion de flota falla aqui, nuestro equipo movil hace soldaduras estructurales y reparacion diesel en el lugar.",
    },
    roads: ["Middle Country Road (Route 25)", "Sound Avenue", "Edwards Avenue"],
    localWork: {
      en: "EPCAL's industrial tenants, trucking yards, and the sod farms north of the LIE run heavy iron — undercarriages, hydraulics, and frame welds are daily work here.",
      es: "Los inquilinos industriales de EPCAL, los patios de camiones y las granjas de cesped al norte de la LIE manejan hierro pesado — rodajes, hidraulica y soldaduras de chasis son trabajo diario aqui.",
    },
  },
  southampton: {
    blurb: {
      en: "Behind Southampton's estates is a non-stop building and landscaping economy — and a lot of excavators, skid steers, and contractor trucks that can't afford downtime in season. We come to the job site along the CR-39 corridor with welding and diesel service.",
      es: "Detras de las propiedades de Southampton hay una economia de construccion y jardineria sin pausa — y muchas excavadoras, minicargadores y camiones de contratistas que no pueden parar en temporada. Vamos a la obra por el corredor de la CR-39 con soldadura y servicio diesel.",
    },
    roads: ["County Road 39", "Montauk Highway", "North Sea Road"],
    localWork: {
      en: "Landscape and site-work fleets dominate Southampton — bucket and boom repair, hydraulic fixes, and inspections that keep crews legal and working.",
      es: "Las flotas de jardineria y movimiento de tierra dominan Southampton — reparacion de cucharones y brazos, arreglos hidraulicos e inspecciones que mantienen a las cuadrillas legales y trabajando.",
    },
  },
  "hampton-bays": {
    blurb: {
      en: "Keeping your machinery and commercial fleets running requires a repair partner who understands the demands of the East End. We dispatch fully equipped mobile welding and repair rigs directly to your job site or yard in Hampton Bays, cutting out unnecessary towing and costly downtime. Whether dealing with a busted excavator arm or routine fleet maintenance, our heavy-duty mechanics handle it right where you are.",
      es: "Mantener su maquinaria pesada y flotas comerciales operando exige un socio que entienda el trabajo duro del East End. Enviamos camiones de soldadura movil y reparacion directamente a su obra o taller en Hampton Bays, reduciendo remolques innecesarios y tiempo perdido. Sin importar si es una falla hidraulica en una excavadora o mantenimiento preventivo, nuestros mecanicos trabajan justo donde usted los necesite.",
    },
    roads: ["Sunrise Highway (Route 27)", "Montauk Highway (CR 80)", "Ponquogue Avenue"],
    localWork: {
      en: "With heavy marine transport near the Shinnecock Canal and non-stop residential construction across the area, boat haulers and earth-moving equipment take a daily beating. Our on-site repair teams keep your vital payload trucks, loaders, and marine transport trailers moving without interruption.",
      es: "Debido a la intensa actividad marina en el Shinnecock Canal y la construccion constante en la zona, la maquinaria de movimiento de tierras y los remolques sufren un gran desgaste diario. Nuestros equipos de reparacion en el sitio mantienen funcionando sus camiones de carga, cargadoras y transportes maritimos sin interrupciones.",
    },
  },
  manorville: {
    blurb: {
      en: "Manorville sits where the LIE and Sunrise Highway meet — equipment yards, sod farms, and the trucks that supply the whole East End. A central spot for a breakdown, and a fast one for our mobile welding and diesel rig to reach.",
      es: "Manorville esta donde se encuentran la LIE y Sunrise Highway — patios de equipo, granjas de cesped y los camiones que abastecen todo el East End. Un punto central para una averia, y rapido de alcanzar para nuestro equipo movil de soldadura y diesel.",
    },
    roads: ["Sunrise Highway (Route 27)", "Long Island Expressway (Exit 70)", "Captain Daniel Roe Highway (CR-111)"],
    localWork: {
      en: "Heavy haulers, agricultural equipment, and contractor fleets stage through Manorville — frame welds, hydraulics, and DOT-ready inspections.",
      es: "Transportistas pesados, equipo agricola y flotas de contratistas pasan por Manorville — soldaduras de chasis, hidraulica e inspecciones listas para DOT.",
    },
  },
  shirley: {
    blurb: {
      en: "Shirley runs on working trucks — contractor pickups, landscape trailers, and commercial vans up and down William Floyd Parkway. We keep them inspected, welded, and running without a trip off the William Floyd corridor.",
      es: "Shirley funciona con camiones de trabajo — camionetas de contratistas, remolques de jardineria y furgonetas comerciales por todo William Floyd Parkway. Los mantenemos inspeccionados, soldados y en marcha sin salir del corredor de William Floyd.",
    },
    roads: ["William Floyd Parkway", "Montauk Highway", "Sunrise Highway (Route 27)"],
    localWork: {
      en: "A dense base of trades and contractor vehicles — brakes, diesel diagnostics, frame and trailer welding, and NY State inspections.",
      es: "Una base densa de vehiculos de oficios y contratistas — frenos, diagnostico diesel, soldadura de chasis y remolques, e inspecciones del Estado de NY.",
    },
  },
  westhampton: {
    blurb: {
      en: "Westhampton runs on more than summer traffic — the business park at Gabreski Airport and the trades that build the Hamptons keep commercial trucks and equipment busy in every season. We're one town over in Speonk, so on-site welding and diesel service reach you fast.",
      es: "Westhampton es mas que trafico de verano — el parque empresarial del aeropuerto Gabreski y los oficios que construyen los Hamptons mantienen ocupados camiones y equipos comerciales sin importar la temporada. Estamos a un pueblo de distancia en Speonk, asi que la soldadura en sitio y el servicio diesel llegan rapido.",
    },
    roads: ["Montauk Highway", "Old Riverhead Road (County Road 31)", "Sunrise Highway (Route 27)"],
    localWork: {
      en: "Airport-area businesses, building contractors, and landscape fleets — inspections, brake and diesel work, and frame welding without the haul west.",
      es: "Negocios cerca del aeropuerto, contratistas de construccion y flotas de jardineria — inspecciones, trabajo de frenos y diesel, y soldadura de chasis sin el viaje al oeste.",
    },
  },
  eastport: {
    blurb: {
      en: "Eastport is where the Hamptons begin, and where nurseries, landscapers, and contractor yards line Montauk Highway. Minutes from our Speonk shop, it's some of the closest mobile-welding and equipment work we do.",
      es: "Eastport es donde comienzan los Hamptons, y donde viveros, jardineros y patios de contratistas bordean Montauk Highway. A minutos de nuestro taller en Speonk, es de los trabajos de soldadura movil y equipo mas cercanos que hacemos.",
    },
    roads: ["Montauk Highway", "Sunrise Highway (Route 27)", "Eastport–Manor Road (County Road 111)"],
    localWork: {
      en: "Nursery and landscape-supply trucks, dump trailers, and contractor rigs — hydraulics, welding, and DOT-ready inspections.",
      es: "Camiones de viveros y suministros de jardineria, remolques de volteo y equipos de contratistas — hidraulica, soldadura e inspecciones listas para DOT.",
    },
  },
  flanders: {
    blurb: {
      en: "Out past the Big Duck on Route 24, Flanders is a working hamlet at Riverhead's doorstep — trades trucks, equipment, and fleets that feed the East End's busiest commercial corridor. We bring welding and diesel service right down Flanders Road.",
      es: "Pasando el Big Duck en la Route 24, Flanders es un pueblo de trabajo a las puertas de Riverhead — camiones de oficios, equipo y flotas que alimentan el corredor comercial mas activo del East End. Llevamos soldadura y servicio diesel directo por Flanders Road.",
    },
    roads: ["Flanders Road (Route 24)", "Long Neck Boulevard", "Pleasure Drive"],
    localWork: {
      en: "Contractor and trades vehicles plus equipment bound for Riverhead's yards — frame welds, hydraulics, and inspections.",
      es: "Vehiculos de contratistas y oficios mas equipo con destino a los patios de Riverhead — soldaduras de chasis, hidraulica e inspecciones.",
    },
  },
  "center-moriches": {
    blurb: {
      en: "Along Moriches Bay, Center Moriches mixes a busy Main Street with the boatyards and marine trades off the water. Commercial vans, trailers, and work trucks here get our on-site welding and diesel service without leaving the bay.",
      es: "A lo largo de Moriches Bay, Center Moriches combina una Main Street activa con los astilleros y oficios marinos junto al agua. Las furgonetas comerciales, remolques y camiones de trabajo aqui reciben nuestra soldadura en sitio y servicio diesel sin salir de la bahia.",
    },
    roads: ["Montauk Highway (Main Street)", "Sunrise Highway (Route 27)", "Frowein Road"],
    localWork: {
      en: "Marine and boatyard operations, trades fleets, and box trucks — fabrication, brakes, and inspections close to home.",
      es: "Operaciones marinas y de astilleros, flotas de oficios y camiones de caja — fabricacion, frenos e inspecciones cerca de casa.",
    },
  },
  "east-moriches": {
    blurb: {
      en: "East Moriches sits on the bay between Center Moriches and Eastport — small in size, steady in commercial work, from marine yards to landscaping crews on Montauk Highway. Our rig reaches it in minutes from Speonk.",
      es: "East Moriches esta en la bahia entre Center Moriches y Eastport — pequeno en tamano, constante en trabajo comercial, desde astilleros hasta cuadrillas de jardineria en Montauk Highway. Nuestro equipo llega en minutos desde Speonk.",
    },
    roads: ["Montauk Highway", "Sunrise Highway (Route 27)", "Atlantic Avenue"],
    localWork: {
      en: "Bayfront marine operations, landscape and contractor trucks — welding, hydraulics, and diesel diagnostics on site.",
      es: "Operaciones marinas frente a la bahia, camiones de jardineria y contratistas — soldadura, hidraulica y diagnostico diesel en el lugar.",
    },
  },
  mastic: {
    blurb: {
      en: "Mastic and Mastic Beach pack a lot of working trucks into a tight grid — landscapers, tradesmen, and small contractors off the William Floyd Parkway and Neighborhood Road. We keep their trailers, brakes, and frames in service without a long trip.",
      es: "Mastic y Mastic Beach concentran muchos camiones de trabajo en una cuadricula apretada — jardineros, obreros y pequenos contratistas en William Floyd Parkway y Neighborhood Road. Mantenemos sus remolques, frenos y chasis en servicio sin un viaje largo.",
    },
    roads: ["William Floyd Parkway", "Neighborhood Road", "Montauk Highway"],
    localWork: {
      en: "Landscape trailers, contractor pickups, and work vans — trailer and frame welding, brake jobs, and NY State inspections.",
      es: "Remolques de jardineria, camionetas de contratistas y furgonetas de trabajo — soldadura de remolques y chasis, trabajos de frenos e inspecciones del Estado de NY.",
    },
  },
  patchogue: {
    blurb: {
      en: "Patchogue is the commercial anchor of the South Shore's west end — a dense village of fleets, industrial yards, and contractors along Sunrise Highway and North Ocean Avenue. When a truck or machine goes down here, mobile welding and diesel service keep the day moving.",
      es: "Patchogue es el ancla comercial del extremo oeste de la South Shore — un pueblo denso de flotas, patios industriales y contratistas a lo largo de Sunrise Highway y North Ocean Avenue. Cuando un camion o maquina falla aqui, la soldadura movil y el servicio diesel mantienen el dia en marcha.",
    },
    roads: ["Sunrise Highway (Route 27)", "Main Street (Montauk Highway)", "North Ocean Avenue (County Road 83)"],
    localWork: {
      en: "Commercial fleets, industrial yards, and building contractors — diesel repair, structural welding, and fleet inspections.",
      es: "Flotas comerciales, patios industriales y contratistas de construccion — reparacion diesel, soldadura estructural e inspecciones de flota.",
    },
  },
};

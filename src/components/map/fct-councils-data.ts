import type { FCTAreaCouncilData, FCTAreaCouncilId } from "@/lib/schema/ngo.schema";

export interface FCTMapPathDef {
  id: FCTAreaCouncilId;
  name: string;
  headquarters: string;
  d: string;
  center: { x: number; y: number };
  labelOffset?: { x: number; y: number };
  badgeOffset?: { x: number; y: number };
}

/**
 * High-fidelity vector contours for the 6 Federal Capital Territory Area Councils.
 * Scaled inside a viewBox="0 0 800 750".
 *
 * Geographical placement:
 * - Bwari: North & Northeast granite ridges, border with Kaduna/Niger.
 * - AMAC: Central-East urban metropolitan center (Abuja Municipal).
 * - Gwagwalada: Central-West agrarian valley & floodplain.
 * - Kuje: South-East forested hills, expansive agricultural territory.
 * - Kwali: South-West savannah woodland.
 * - Abaji: Far South confluence plains bordering Kogi and Niger.
 */
export const FCT_MAP_PATHS: FCTMapPathDef[] = [
  {
    id: "bwari",
    name: "Bwari",
    headquarters: "Bwari Central",
    // Northern council
    d: "M 280,60 C 370,30 460,35 550,75 C 605,102 620,150 635,210 C 600,240 560,250 510,245 C 470,240 435,260 395,270 C 370,240 330,225 300,200 C 275,175 260,110 280,60 Z",
    center: { x: 440, y: 155 },
    labelOffset: { x: 0, y: -10 },
    badgeOffset: { x: 0, y: 22 },
  },
  {
    id: "amac",
    name: "Abuja Municipal (AMAC)",
    headquarters: "Garki",
    // Central-Eastern council
    d: "M 395,270 C 435,260 470,240 510,245 C 560,250 600,240 635,210 C 670,270 705,335 690,410 C 640,430 590,415 540,400 C 495,385 450,400 420,380 C 405,340 410,300 395,270 Z",
    center: { x: 535, y: 320 },
    labelOffset: { x: 0, y: -12 },
    badgeOffset: { x: 0, y: 20 },
  },
  {
    id: "gwagwalada",
    name: "Gwagwalada",
    headquarters: "Gwagwalada Town",
    // Central-West agrarian floodplain
    d: "M 180,210 C 240,200 300,200 300,200 C 330,225 370,240 395,270 C 410,300 405,340 420,380 C 380,410 340,415 295,430 C 250,445 200,430 160,390 C 130,340 140,260 180,210 Z",
    center: { x: 280, y: 310 },
    labelOffset: { x: 0, y: -10 },
    badgeOffset: { x: 0, y: 22 },
  },
  {
    id: "kuje",
    name: "Kuje",
    headquarters: "Kuje Central",
    // South-East forested ridges
    d: "M 420,380 C 450,400 495,385 540,400 C 590,415 640,430 690,410 C 695,480 670,550 630,610 C 570,635 510,615 460,590 C 420,570 380,560 370,520 C 360,470 390,420 420,380 Z",
    center: { x: 510, y: 505 },
    labelOffset: { x: 0, y: -10 },
    badgeOffset: { x: 0, y: 22 },
  },
  {
    id: "kwali",
    name: "Kwali",
    headquarters: "Kwali Town",
    // South-West savannah woodlands
    d: "M 160,390 C 200,430 250,445 295,430 C 340,415 380,410 420,380 C 390,420 360,470 370,520 C 380,560 360,600 330,620 C 280,640 230,620 180,590 C 140,540 120,460 160,390 Z",
    center: { x: 265, y: 500 },
    labelOffset: { x: 0, y: -10 },
    badgeOffset: { x: 0, y: 22 },
  },
  {
    id: "abaji",
    name: "Abaji",
    headquarters: "Abaji Central",
    // Far South confluence & river basin
    d: "M 180,590 C 230,620 280,640 330,620 C 360,600 380,560 370,520 C 380,560 420,570 460,590 C 440,650 390,710 320,720 C 240,730 170,690 130,650 C 145,620 160,605 180,590 Z",
    center: { x: 300, y: 645 },
    labelOffset: { x: 0, y: -8 },
    badgeOffset: { x: 0, y: 18 },
  },
];

export const FALLBACK_FCT_COUNCILS: Record<FCTAreaCouncilId, FCTAreaCouncilData> = {
  amac: {
    id: "amac",
    name: "Abuja Municipal Area Council (AMAC)",
    headquarters: "Garki",
    terrainType: "Urban & Peri-Urban Hills",
    populationServed: 1980000,
    coordinates: { lat: 9.0579, lng: 7.4951 },
    fieldDispatchLead: {
      name: "Engr. Fatima Bello-Kyari",
      role: "Urban Resilience & Community Water Director",
      phone: "+234-802-555-0191",
    },
    activeProjects: [
      {
        id: "amac-water-01",
        title: "Karshi & Nyanya Solar Borehole Aquifer Network",
        category: "water_sanitation",
        settlementName: "Karshi Peri-Urban Outpost",
        settlementType: "Informal Settlement",
        beneficiariesCount: 42000,
        status: "active",
        description: "Four deep-aquifer solar-pumped filtration hubs delivering 65,000 litres daily of potable drinking water to peri-urban communities without municipal supply.",
        mediaPath: "/media/projects/amac-water.jpg",
      },
      {
        id: "amac-idp-02",
        title: "Kuchingoro IDP Transitional Learning & Vocational Annex",
        category: "idp_resilience",
        settlementName: "Kuchingoro Camp",
        settlementType: "Displaced Community Settlement",
        beneficiariesCount: 14500,
        status: "active",
        description: "Solarized community classroom blocks, psycho-social recovery spaces, and tailoring/solar technicians training for displaced youth and women.",
        mediaPath: "/media/projects/amac-idp.jpg",
      },
      {
        id: "amac-health-03",
        title: "Garki Peri-Urban Maternal Cold-Chain Station",
        category: "healthcare",
        settlementName: "Kabusa Outskirts",
        settlementType: "Suburban Semi-Settlement",
        beneficiariesCount: 19800,
        status: "active",
        description: "Continuous 24/7 solar battery cold-chain storage for vaccines, infant immunization supplies, and emergency maternal delivery packs.",
        mediaPath: "/media/projects/amac-health.jpg",
      },
    ],
  },
  bwari: {
    id: "bwari",
    name: "Bwari Area Council",
    headquarters: "Bwari Central",
    terrainType: "Granite Ridgelines & Montane Valleys",
    populationServed: 580000,
    coordinates: { lat: 9.2789, lng: 7.3756 },
    fieldDispatchLead: {
      name: "Ibrahim Danladi",
      role: "Hilly Terrain Outreach Coordinator",
      phone: "+234-803-444-0122",
    },
    activeProjects: [
      {
        id: "bwari-edu-01",
        title: "Ushafa Pottery Village STEM Hub & Primary Extension",
        category: "education",
        settlementName: "Ushafa",
        settlementType: "Artisan Heritage Community",
        beneficiariesCount: 8900,
        status: "active",
        description: "Equipping 12 primary school classrooms with off-grid solar electricity, tablets preloaded with foundational literacy software, and clean sanitation blocks.",
        mediaPath: "/media/projects/bwari-stem.jpg",
      },
      {
        id: "bwari-agric-02",
        title: "Dutse-Alhaji Terraced Hillside Agro-Forestry Cooperative",
        category: "agriculture",
        settlementName: "Dutse Makaranta Foothills",
        settlementType: "Agrarian Agronomy Cluster",
        beneficiariesCount: 11200,
        status: "active",
        description: "Erosion control planting of high-yield cashew and moringa trees combined with gravity-fed drip irrigation for smallholder vegetable farming collectives.",
        mediaPath: "/media/projects/bwari-agro.jpg",
      },
    ],
  },
  gwagwalada: {
    id: "gwagwalada",
    name: "Gwagwalada Area Council",
    headquarters: "Gwagwalada Town",
    terrainType: "Alluvial Floodplains & Riparian Basin",
    populationServed: 410000,
    coordinates: { lat: 8.9464, lng: 7.0858 },
    fieldDispatchLead: {
      name: "Dr. Aliyu Mohammed",
      role: "Riparian Health & Emergency Relief Lead",
      phone: "+234-805-333-0887",
    },
    activeProjects: [
      {
        id: "gwag-health-01",
        title: "Dobi Riparian Malaria Interception & Primary Care Depot",
        category: "healthcare",
        settlementName: "Dobi Settlement",
        settlementType: "Riverine Agrarian Village",
        beneficiariesCount: 16500,
        status: "active",
        description: "Mobile boat and ATV medical teams distributing long-lasting insecticide nets, rapid diagnostic tests, and pediatric fever care in seasonal marshlands.",
        mediaPath: "/media/projects/gwag-clinic.jpg",
      },
      {
        id: "gwag-water-02",
        title: "Zuba Riverbank Clean Spring Capping & Solar Distribution",
        category: "water_sanitation",
        settlementName: "Paiko Kore",
        settlementType: "Agrarian Community",
        beneficiariesCount: 13800,
        status: "active",
        description: "Protection of natural surface springs with bio-sand filtration barriers and automated elevated storage tanks preventing seasonal waterborne cholera spikes.",
        mediaPath: "/media/projects/gwag-water.jpg",
      },
    ],
  },
  kuje: {
    id: "kuje",
    name: "Kuje Area Council",
    headquarters: "Kuje Central",
    terrainType: "Forested Ridges & Deep Woodland",
    populationServed: 325000,
    coordinates: { lat: 8.8789, lng: 7.2345 },
    fieldDispatchLead: {
      name: "Grace Chukwuma-Okafor",
      role: "Forestry & Agricultural Livelihoods Officer",
      phone: "+234-809-222-0941",
    },
    activeProjects: [
      {
        id: "kuje-agric-01",
        title: "Rubochi Cassava Processing & Solar Drying Micro-Mills",
        category: "agriculture",
        settlementName: "Rubochi Valley",
        settlementType: "Agrarian Farming Community",
        beneficiariesCount: 21000,
        status: "active",
        description: "Empowering 400 women smallholders with community-owned solar mechanized grating machines and hygienic solar drying tunnels that eliminate 60% post-harvest spoilage.",
        mediaPath: "/media/projects/kuje-agric.jpg",
      },
      {
        id: "kuje-edu-02",
        title: "Chibiri Forest Ridge Mobile Digital Library Unit",
        category: "education",
        settlementName: "Gaube / Chibiri",
        settlementType: "Remote Ridge Settlements",
        beneficiariesCount: 7400,
        status: "active",
        description: "Ruggedized mobile solar audio-visual van bringing weekly literacy instruction, numeracy workshops, and science experiment kits to underserved ridge schools.",
        mediaPath: "/media/projects/kuje-edu.jpg",
      },
    ],
  },
  kwali: {
    id: "kwali",
    name: "Kwali Area Council",
    headquarters: "Kwali Town",
    terrainType: "Guinea Savannah Plains & Granite Outcrops",
    populationServed: 240000,
    coordinates: { lat: 8.7844, lng: 7.0142 },
    fieldDispatchLead: {
      name: "Musa Sunday Yakubu",
      role: "Savannah Outreach Operations Head",
      phone: "+234-806-111-0433",
    },
    activeProjects: [
      {
        id: "kwali-water-01",
        title: "Ashara & Yebu Deep Bedrock Solar Borehole Installation",
        category: "water_sanitation",
        settlementName: "Ashara",
        settlementType: "Dry Savannah Community",
        beneficiariesCount: 18400,
        status: "active",
        description: "Solar submersible pumping system reaching 140-meter crystalline bedrock aquifers, ending women and children's 6km daily treks for murky creek water.",
        mediaPath: "/media/projects/kwali-water.jpg",
      },
      {
        id: "kwali-health-02",
        title: "Kilankwa Rural Emergency Maternity Transit Post",
        category: "healthcare",
        settlementName: "Kilankwa",
        settlementType: "Semi-isolated Village",
        beneficiariesCount: 9600,
        status: "active",
        description: "Solar-backed 24-hour triage unit with specialized tricycle ambulances for transporting mothers in obstructed labor safely to secondary referral hospitals.",
        mediaPath: "/media/projects/kwali-clinic.jpg",
      },
    ],
  },
  abaji: {
    id: "abaji",
    name: "Abaji Area Council",
    headquarters: "Abaji Central",
    terrainType: "Lowland Alluvium & River Basin Confluence",
    populationServed: 195000,
    coordinates: { lat: 8.4739, lng: 6.9469 },
    fieldDispatchLead: {
      name: "Hajiya Maryam Onoja",
      role: "Border Basin Community Liaison Lead",
      phone: "+234-818-777-0365",
    },
    activeProjects: [
      {
        id: "abaji-agric-01",
        title: "Gurara Confluence Solar Irrigation & Fisheries Collective",
        category: "agriculture",
        settlementName: "Nuku Basin",
        settlementType: "Riverine Agrarian Community",
        beneficiariesCount: 14200,
        status: "active",
        description: "Zero-fuel solar water pumping along river tributaries allowing year-round dry-season irrigation of vegetables and community aquaculture earthen fish ponds.",
        mediaPath: "/media/projects/abaji-agric.jpg",
      },
      {
        id: "abaji-edu-02",
        title: "Agyana Girls' Secondary STEM & Water Resilience Station",
        category: "education",
        settlementName: "Agyana",
        settlementType: "Border Rural Town",
        beneficiariesCount: 6800,
        status: "active",
        description: "Solarized science laboratory and borehole sanitation facility providing dedicated privacy amenities that have increased girls' school retention by 44%.",
        mediaPath: "/media/projects/abaji-edu.jpg",
      },
    ],
  },
};

/**
 * Demonstration data for Bharat Suraksha Connect.
 *
 * IMPORTANT: every value here is illustrative sample data created for this
 * prototype. None of it comes from a government feed, an embassy directory or
 * a live crisis source. Keep the `DEMO_NOTICE` visible wherever it is shown.
 *
 * Integration seam: each array below mirrors the shape a real API would
 * return, so a future data layer can replace these constants without touching
 * the UI components.
 */

export const DEMO_NOTICE =
  "Demo data — illustrative only. Not a live government or emergency-service feed.";

export type RiskLevel = "low" | "caution" | "high" | "critical";

export const riskMeta: Record<
  RiskLevel,
  { label: string; dot: string; text: string; chip: string; ring: string }
> = {
  low: {
    label: "Low risk",
    dot: "bg-safe",
    text: "text-safe",
    chip: "bg-safe/10 text-safe border-safe/25",
    ring: "ring-safe/30",
  },
  caution: {
    label: "Caution",
    dot: "bg-caution",
    text: "text-caution",
    chip: "bg-caution/10 text-caution border-caution/25",
    ring: "ring-caution/30",
  },
  high: {
    label: "High risk",
    dot: "bg-high",
    text: "text-high",
    chip: "bg-high/10 text-high border-high/25",
    ring: "ring-high/30",
  },
  critical: {
    label: "Critical",
    dot: "bg-critical",
    text: "text-critical",
    chip: "bg-critical/10 text-critical border-critical/25",
    ring: "ring-critical/30",
  },
};

export type AlertCategory =
  | "security"
  | "disaster"
  | "travel"
  | "advisory"
  | "health";

export const alertCategoryMeta: Record<
  AlertCategory,
  { label: string; icon: string }
> = {
  security: { label: "Security", icon: "🚨" },
  disaster: { label: "Natural Disaster", icon: "🌪️" },
  travel: { label: "Travel Disruption", icon: "✈️" },
  advisory: { label: "Government Advisory", icon: "🏛️" },
  health: { label: "Health Emergency", icon: "🏥" },
};

export interface CrisisAlert {
  id: string;
  category: AlertCategory;
  risk: RiskLevel;
  title: string;
  summary: string;
  country: string;
  city: string;
  issuedAt: string;
  source: string;
  sourceUrl: string;
  action: string;
}

export const alerts: CrisisAlert[] = [
  {
    id: "ALR-2041",
    category: "security",
    risk: "critical",
    title: "Civil unrest reported in the southern district",
    summary:
      "Demonstrations have disrupted movement across several main roads. Public transport is partially suspended in the affected area.",
    country: "United Arab Emirates",
    city: "Dubai",
    issuedAt: "2026-10-01T06:40:00Z",
    source: "Sample advisory feed (demo)",
    sourceUrl: "https://www.mea.gov.in/",
    action: "Avoid the area and non-essential travel. Keep documents at hand.",
  },
  {
    id: "ALR-2038",
    category: "disaster",
    risk: "high",
    title: "Severe weather warning for coastal regions",
    summary:
      "Heavy rainfall and strong winds are expected over the next 24 hours, with a risk of localised flooding in low-lying areas.",
    country: "United Arab Emirates",
    city: "Sharjah",
    issuedAt: "2026-10-01T02:15:00Z",
    source: "Sample weather feed (demo)",
    sourceUrl: "https://www.mea.gov.in/",
    action: "Stay indoors where possible and secure travel documents.",
  },
  {
    id: "ALR-2033",
    category: "travel",
    risk: "caution",
    title: "Departure delays at the international airport",
    summary:
      "Several outbound flights are delayed due to operational constraints. Airlines are rebooking affected passengers.",
    country: "United Arab Emirates",
    city: "Dubai",
    issuedAt: "2026-09-30T19:05:00Z",
    source: "Sample aviation feed (demo)",
    sourceUrl: "https://www.mea.gov.in/",
    action: "Confirm your flight status before travelling to the airport.",
  },
  {
    id: "ALR-2027",
    category: "advisory",
    risk: "caution",
    title: "Registration reminder for Indian nationals",
    summary:
      "Indian nationals in the region are reminded to keep their contact details current with the nearest Indian Mission.",
    country: "Qatar",
    city: "Doha",
    issuedAt: "2026-09-30T11:30:00Z",
    source: "Sample mission notice (demo)",
    sourceUrl: "https://www.mea.gov.in/",
    action: "Update your contact details with the mission.",
  },
  {
    id: "ALR-2019",
    category: "health",
    risk: "high",
    title: "Seasonal illness advisory issued by local health authority",
    summary:
      "A rise in seasonal respiratory illness has been reported. Clinics are operating extended hours in affected districts.",
    country: "Israel",
    city: "Tel Aviv",
    issuedAt: "2026-09-29T08:00:00Z",
    source: "Sample health feed (demo)",
    sourceUrl: "https://www.mea.gov.in/",
    action: "Follow local health guidance and carry essential medication.",
  },
  {
    id: "ALR-2011",
    category: "security",
    risk: "critical",
    title: "Curfew in effect across the capital",
    summary:
      "Local authorities have declared a night-time curfew. Movement is restricted between 20:00 and 06:00 local time.",
    country: "Sudan",
    city: "Khartoum",
    issuedAt: "2026-09-28T16:45:00Z",
    source: "Sample advisory feed (demo)",
    sourceUrl: "https://www.mea.gov.in/",
    action: "Remain indoors during curfew hours and register with the mission.",
  },
  {
    id: "ALR-2004",
    category: "disaster",
    risk: "low",
    title: "Minor tremor recorded, no damage reported",
    summary:
      "A low-magnitude tremor was recorded offshore. No structural damage or casualties have been reported.",
    country: "Japan",
    city: "Tokyo",
    issuedAt: "2026-09-27T22:10:00Z",
    source: "Sample seismic feed (demo)",
    sourceUrl: "https://www.mea.gov.in/",
    action: "No action required. Monitor local updates.",
  },
];

export interface Mission {
  id: string;
  name: string;
  type: "Embassy" | "Consulate General" | "High Commission";
  country: string;
  city: string;
  address: string;
  phone: string;
  emergency: string;
  website: string;
  hours: string;
  distanceKm: number;
}

export const missions: Mission[] = [
  {
    id: "MIS-AE-1",
    name: "Embassy of India, Abu Dhabi",
    type: "Embassy",
    country: "United Arab Emirates",
    city: "Abu Dhabi",
    address: "Plot 10, Sector W-59/02, Diplomatic Area, Abu Dhabi",
    phone: "+971 2 000 0000 (sample)",
    emergency: "+971 50 000 0000 (sample)",
    website: "https://www.mea.gov.in/",
    hours: "Mon–Fri, 09:00–17:30",
    distanceKm: 12,
  },
  {
    id: "MIS-AE-2",
    name: "Consulate General of India, Dubai",
    type: "Consulate General",
    country: "United Arab Emirates",
    city: "Dubai",
    address: "Al Hamriya, Bur Dubai, Dubai",
    phone: "+971 4 000 0000 (sample)",
    emergency: "+971 50 111 1111 (sample)",
    website: "https://www.mea.gov.in/",
    hours: "Mon–Fri, 08:30–17:00",
    distanceKm: 4,
  },
  {
    id: "MIS-QA-1",
    name: "Embassy of India, Doha",
    type: "Embassy",
    country: "Qatar",
    city: "Doha",
    address: "Al Eithra Street, Villa 86/87, Doha",
    phone: "+974 4000 0000 (sample)",
    emergency: "+974 5000 0000 (sample)",
    website: "https://www.mea.gov.in/",
    hours: "Sun–Thu, 08:00–16:00",
    distanceKm: 380,
  },
  {
    id: "MIS-GB-1",
    name: "High Commission of India, London",
    type: "High Commission",
    country: "United Kingdom",
    city: "London",
    address: "India House, Aldwych, London",
    phone: "+44 20 0000 0000 (sample)",
    emergency: "+44 7000 000000 (sample)",
    website: "https://www.mea.gov.in/",
    hours: "Mon–Fri, 09:00–17:30",
    distanceKm: 5500,
  },
  {
    id: "MIS-US-1",
    name: "Consulate General of India, New York",
    type: "Consulate General",
    country: "United States",
    city: "New York",
    address: "3 East 64th Street, Manhattan, New York",
    phone: "+1 212 000 0000 (sample)",
    emergency: "+1 212 111 1111 (sample)",
    website: "https://www.mea.gov.in/",
    hours: "Mon–Fri, 09:30–18:00",
    distanceKm: 11200,
  },
  {
    id: "MIS-SG-1",
    name: "High Commission of India, Singapore",
    type: "High Commission",
    country: "Singapore",
    city: "Singapore",
    address: "31 Grange Road, Singapore",
    phone: "+65 6000 0000 (sample)",
    emergency: "+65 9000 0000 (sample)",
    website: "https://www.mea.gov.in/",
    hours: "Mon–Fri, 09:00–17:30",
    distanceKm: 5900,
  },
  {
    id: "MIS-IL-1",
    name: "Embassy of India, Tel Aviv",
    type: "Embassy",
    country: "Israel",
    city: "Tel Aviv",
    address: "140 Hayarkon Street, Tel Aviv",
    phone: "+972 3 000 0000 (sample)",
    emergency: "+972 54 000 0000 (sample)",
    website: "https://www.mea.gov.in/",
    hours: "Mon–Fri, 09:00–17:00",
    distanceKm: 2100,
  },
  {
    id: "MIS-JP-1",
    name: "Embassy of India, Tokyo",
    type: "Embassy",
    country: "Japan",
    city: "Tokyo",
    address: "2-2-11 Kudan-Minami, Chiyoda-ku, Tokyo",
    phone: "+81 3 0000 0000 (sample)",
    emergency: "+81 90 0000 0000 (sample)",
    website: "https://www.mea.gov.in/",
    hours: "Mon–Fri, 09:00–17:30",
    distanceKm: 7800,
  },
];

export type MapPointKind =
  | "you"
  | "crisis"
  | "hospital"
  | "mission"
  | "airport"
  | "shelter";

export interface MapPoint {
  id: string;
  kind: MapPointKind;
  label: string;
  detail: string;
  risk: RiskLevel;
  /** percentage coordinates on the schematic map canvas */
  x: number;
  y: number;
}

export const mapPoints: MapPoint[] = [
  { id: "P1", kind: "you", label: "Your approximate location", detail: "Dubai, UAE · accuracy ~2 km", risk: "low", x: 30, y: 48 },
  { id: "P2", kind: "crisis", label: "Civil unrest zone", detail: "Southern district · avoid travel", risk: "critical", x: 18, y: 30 },
  { id: "P3", kind: "crisis", label: "Flood watch area", detail: "Coastal belt · heavy rainfall", risk: "high", x: 55, y: 55 },
  { id: "P4", kind: "crisis", label: "Protest gathering", detail: "City square · intermittent closures", risk: "caution", x: 66, y: 38 },
  { id: "P5", kind: "hospital", label: "Central General Hospital", detail: "24/7 emergency department", risk: "low", x: 40, y: 68 },
  { id: "P6", kind: "hospital", label: "Riverside Medical Centre", detail: "Trauma care available", risk: "low", x: 22, y: 62 },
  { id: "P7", kind: "mission", label: "Consulate General of India", detail: "Bur Dubai · 4 km away", risk: "low", x: 72, y: 24 },
  { id: "P8", kind: "airport", label: "International Airport", detail: "Delays reported on outbound flights", risk: "caution", x: 84, y: 60 },
  { id: "P9", kind: "shelter", label: "Community relief centre", detail: "Officially listed shelter (demo)", risk: "low", x: 48, y: 22 },
  { id: "P10", kind: "shelter", label: "School assembly point", detail: "Officially listed shelter (demo)", risk: "low", x: 60, y: 78 },
];

export const mapKindMeta: Record<MapPointKind, { label: string; icon: string }> = {
  you: { label: "You", icon: "📍" },
  crisis: { label: "Crisis area", icon: "⚠️" },
  hospital: { label: "Hospitals", icon: "🏥" },
  mission: { label: "Indian Missions", icon: "🏛️" },
  airport: { label: "Airports", icon: "✈️" },
  shelter: { label: "Safe locations", icon: "🛡️" },
};

export interface EmergencyService {
  id: string;
  name: string;
  detail: string;
  number: string;
}

export const emergencyServices: EmergencyService[] = [
  { id: "ES1", name: "Local emergency number", detail: "Police, fire and ambulance (sample)", number: "999" },
  { id: "ES2", name: "Ambulance dispatch", detail: "Nearest hospital network (sample)", number: "998" },
  { id: "ES3", name: "Indian Mission helpline", detail: "Consulate General of India (sample)", number: "+971 50 111 1111" },
];

export interface OfficialUpdate {
  id: string;
  title: string;
  source: string;
  sourceUrl: string;
  publishedAt: string;
}

export const officialUpdates: OfficialUpdate[] = [
  {
    id: "UPD-1",
    title: "Mission extends consular counter hours during the advisory period",
    source: "Sample mission notice (demo)",
    sourceUrl: "https://www.mea.gov.in/",
    publishedAt: "2026-10-01T05:00:00Z",
  },
  {
    id: "UPD-2",
    title: "Helpline capacity increased for assistance requests",
    source: "Sample mission notice (demo)",
    sourceUrl: "https://www.mea.gov.in/",
    publishedAt: "2026-09-30T14:20:00Z",
  },
  {
    id: "UPD-3",
    title: "Guidance published on document replacement for travellers",
    source: "Sample mission notice (demo)",
    sourceUrl: "https://www.mea.gov.in/",
    publishedAt: "2026-09-29T09:10:00Z",
  },
];

/* ---------- Admin demo analytics ---------- */

export const citizensByCountry = [
  { country: "UAE", citizens: 4820 },
  { country: "Qatar", citizens: 2310 },
  { country: "UK", citizens: 1890 },
  { country: "USA", citizens: 1640 },
  { country: "Israel", citizens: 760 },
  { country: "Sudan", citizens: 410 },
];

export const requestsByType = [
  { type: "Medical", count: 42 },
  { type: "Security", count: 28 },
  { type: "Trapped", count: 11 },
  { type: "Evacuation", count: 19 },
  { type: "Missing", count: 6 },
  { type: "Contact", count: 24 },
];

export const statusDistribution = [
  { name: "Safe", value: 8420, key: "safe" },
  { name: "No check-in", value: 2190, key: "caution" },
  { name: "Needs help", value: 130, key: "critical" },
];

export const alertsOverTime = [
  { day: "Mon", alerts: 6 },
  { day: "Tue", alerts: 9 },
  { day: "Wed", alerts: 7 },
  { day: "Thu", alerts: 14 },
  { day: "Fri", alerts: 11 },
  { day: "Sat", alerts: 16 },
  { day: "Sun", alerts: 12 },
];

export const crisisLocations = [
  { location: "Dubai, UAE", level: "critical" as RiskLevel, cases: 34 },
  { location: "Khartoum, Sudan", level: "critical" as RiskLevel, cases: 21 },
  { location: "Tel Aviv, Israel", level: "high" as RiskLevel, cases: 12 },
  { location: "Doha, Qatar", level: "caution" as RiskLevel, cases: 5 },
  { location: "Tokyo, Japan", level: "low" as RiskLevel, cases: 1 },
];

export const emergencyTypes = [
  { id: "medical", label: "Medical Emergency", icon: "🏥" },
  { id: "security", label: "Security Threat", icon: "🚨" },
  { id: "trapped", label: "Trapped", icon: "🧱" },
  { id: "evacuation", label: "Evacuation Assistance", icon: "✈️" },
  { id: "missing", label: "Missing Person", icon: "🔎" },
  { id: "contact", label: "Unable to Contact Family", icon: "📵" },
  { id: "other", label: "Other", icon: "❓" },
] as const;

export const countries = Array.from(new Set(alerts.map((a) => a.country))).sort();

/** Nearest mission in the demo scenario (Dubai-based user). */
export const nearestMission: Mission = missions[1]!;

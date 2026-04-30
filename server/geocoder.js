// Pre-built dictionary of NE India locations with coordinates
// Covers all 8 NE states + key rivers, districts, and landmarks

const LOCATIONS = {
  // ============= ASSAM =============
  guwahati: { lat: 26.1445, lng: 91.7362, state: "Assam", type: "city" },
  kamrup: { lat: 26.2228, lng: 91.7532, state: "Assam", type: "district" },
  nagaon: { lat: 26.35, lng: 92.6833, state: "Assam", type: "district" },
  morigaon: { lat: 26.25, lng: 92.34, state: "Assam", type: "district" },
  dibrugarh: { lat: 27.4728, lng: 94.912, state: "Assam", type: "city" },
  jorhat: { lat: 26.7509, lng: 94.2037, state: "Assam", type: "city" },
  silchar: { lat: 24.8333, lng: 92.7789, state: "Assam", type: "city" },
  tezpur: { lat: 26.6338, lng: 92.8, state: "Assam", type: "city" },
  barpeta: { lat: 26.321, lng: 91.0058, state: "Assam", type: "district" },
  nalbari: { lat: 26.4442, lng: 91.4381, state: "Assam", type: "district" },
  dhubri: { lat: 26.02, lng: 89.98, state: "Assam", type: "district" },
  goalpara: { lat: 26.1622, lng: 90.6275, state: "Assam", type: "district" },
  cachar: { lat: 24.7862, lng: 92.8589, state: "Assam", type: "district" },
  karimganj: { lat: 24.8649, lng: 92.359, state: "Assam", type: "district" },
  hailakandi: { lat: 24.681, lng: 92.558, state: "Assam", type: "district" },
  sonitpur: { lat: 26.69, lng: 92.98, state: "Assam", type: "district" },
  lakhimpur: { lat: 27.235, lng: 94.1, state: "Assam", type: "district" },
  dhemaji: { lat: 27.473, lng: 94.56, state: "Assam", type: "district" },
  tinsukia: { lat: 27.4884, lng: 95.3548, state: "Assam", type: "city" },
  sivasagar: { lat: 26.9826, lng: 94.6425, state: "Assam", type: "district" },
  golaghat: { lat: 26.5167, lng: 93.9667, state: "Assam", type: "district" },
  darrang: { lat: 26.5128, lng: 92.1719, state: "Assam", type: "district" },
  kokrajhar: { lat: 26.4006, lng: 90.2716, state: "Assam", type: "district" },
  majuli: { lat: 26.95, lng: 94.17, state: "Assam", type: "district" },
  baksa: { lat: 26.7, lng: 91.25, state: "Assam", type: "district" },

  // ============= MEGHALAYA =============
  shillong: { lat: 25.5788, lng: 91.8933, state: "Meghalaya", type: "city" },
  cherrapunji: { lat: 25.27, lng: 91.72, state: "Meghalaya", type: "town" },
  tura: { lat: 25.5145, lng: 90.2128, state: "Meghalaya", type: "town" },
  "east khasi hills": {
    lat: 25.45,
    lng: 91.85,
    state: "Meghalaya",
    type: "district",
  },
  "west garo hills": {
    lat: 25.51,
    lng: 90.23,
    state: "Meghalaya",
    type: "district",
  },
  "jaintia hills": {
    lat: 25.35,
    lng: 92.2,
    state: "Meghalaya",
    type: "district",
  },
  "ri bhoi": { lat: 25.88, lng: 91.88, state: "Meghalaya", type: "district" },
  "south garo hills": {
    lat: 25.29,
    lng: 90.62,
    state: "Meghalaya",
    type: "district",
  },

  // ============= NAGALAND =============
  kohima: { lat: 25.6586, lng: 94.1086, state: "Nagaland", type: "city" },
  dimapur: { lat: 25.8697, lng: 93.7348, state: "Nagaland", type: "city" },
  mokokchung: { lat: 26.32, lng: 94.52, state: "Nagaland", type: "district" },
  wokha: { lat: 26.1, lng: 94.26, state: "Nagaland", type: "district" },
  zunheboto: {
    lat: 25.9667,
    lng: 94.5167,
    state: "Nagaland",
    type: "district",
  },
  phek: { lat: 25.67, lng: 94.47, state: "Nagaland", type: "district" },
  mon: { lat: 26.71, lng: 94.92, state: "Nagaland", type: "district" },
  tuensang: { lat: 26.27, lng: 94.83, state: "Nagaland", type: "district" },

  // ============= MANIPUR =============
  imphal: { lat: 24.817, lng: 93.9368, state: "Manipur", type: "city" },
  churachandpur: {
    lat: 24.3333,
    lng: 93.6833,
    state: "Manipur",
    type: "district",
  },
  thoubal: { lat: 24.6375, lng: 94.0141, state: "Manipur", type: "district" },
  bishnupur: { lat: 24.62, lng: 93.78, state: "Manipur", type: "district" },
  senapati: { lat: 25.27, lng: 94.02, state: "Manipur", type: "district" },
  ukhrul: { lat: 25.1159, lng: 94.366, state: "Manipur", type: "district" },
  tamenglong: { lat: 25.08, lng: 93.51, state: "Manipur", type: "district" },
  chandel: { lat: 24.3219, lng: 94.048, state: "Manipur", type: "district" },

  // ============= MIZORAM =============
  aizawl: { lat: 23.7271, lng: 92.7176, state: "Mizoram", type: "city" },
  lunglei: { lat: 22.89, lng: 92.73, state: "Mizoram", type: "district" },
  champhai: { lat: 23.4567, lng: 93.328, state: "Mizoram", type: "district" },
  serchhip: { lat: 23.3, lng: 92.85, state: "Mizoram", type: "district" },
  kolasib: { lat: 24.2268, lng: 92.6792, state: "Mizoram", type: "district" },
  mamit: { lat: 23.925, lng: 92.49, state: "Mizoram", type: "district" },
  lawngtlai: { lat: 22.53, lng: 92.9, state: "Mizoram", type: "district" },
  saiha: { lat: 22.49, lng: 92.98, state: "Mizoram", type: "district" },

  // ============= TRIPURA =============
  agartala: { lat: 23.8315, lng: 91.2868, state: "Tripura", type: "city" },
  "west tripura": {
    lat: 23.83,
    lng: 91.28,
    state: "Tripura",
    type: "district",
  },
  "north tripura": {
    lat: 24.32,
    lng: 92.02,
    state: "Tripura",
    type: "district",
  },
  "south tripura": {
    lat: 23.37,
    lng: 91.54,
    state: "Tripura",
    type: "district",
  },
  dhalai: { lat: 23.84, lng: 91.98, state: "Tripura", type: "district" },
  unakoti: { lat: 24.31, lng: 92.1, state: "Tripura", type: "district" },
  khowai: { lat: 24.07, lng: 91.61, state: "Tripura", type: "district" },
  gomati: { lat: 23.5, lng: 91.52, state: "Tripura", type: "district" },
  sepahijala: { lat: 23.6, lng: 91.3, state: "Tripura", type: "district" },

  // ============= ARUNACHAL PRADESH =============
  itanagar: {
    lat: 27.0844,
    lng: 93.6053,
    state: "Arunachal Pradesh",
    type: "city",
  },
  tawang: {
    lat: 27.586,
    lng: 91.8689,
    state: "Arunachal Pradesh",
    type: "district",
  },
  bomdila: {
    lat: 27.2645,
    lng: 92.4159,
    state: "Arunachal Pradesh",
    type: "town",
  },
  ziro: { lat: 27.544, lng: 93.831, state: "Arunachal Pradesh", type: "town" },
  pasighat: {
    lat: 28.0671,
    lng: 95.328,
    state: "Arunachal Pradesh",
    type: "town",
  },
  along: { lat: 28.17, lng: 94.8, state: "Arunachal Pradesh", type: "town" },
  tezu: { lat: 27.91, lng: 96.17, state: "Arunachal Pradesh", type: "town" },
  changlang: {
    lat: 27.12,
    lng: 95.73,
    state: "Arunachal Pradesh",
    type: "district",
  },
  "east siang": {
    lat: 28.08,
    lng: 95.33,
    state: "Arunachal Pradesh",
    type: "district",
  },
  "west siang": {
    lat: 28.15,
    lng: 94.75,
    state: "Arunachal Pradesh",
    type: "district",
  },
  "lower subansiri": {
    lat: 27.54,
    lng: 93.83,
    state: "Arunachal Pradesh",
    type: "district",
  },

  // ============= SIKKIM =============
  gangtok: { lat: 27.3389, lng: 88.6065, state: "Sikkim", type: "city" },
  namchi: { lat: 27.1667, lng: 88.35, state: "Sikkim", type: "town" },
  mangan: { lat: 27.51, lng: 88.53, state: "Sikkim", type: "town" },
  gyalshing: { lat: 27.28, lng: 88.26, state: "Sikkim", type: "town" },
  "east sikkim": { lat: 27.33, lng: 88.62, state: "Sikkim", type: "district" },
  "north sikkim": { lat: 27.65, lng: 88.55, state: "Sikkim", type: "district" },
  "south sikkim": { lat: 27.15, lng: 88.37, state: "Sikkim", type: "district" },
  "west sikkim": { lat: 27.23, lng: 88.22, state: "Sikkim", type: "district" },

  // ============= RIVERS =============
  brahmaputra: { lat: 26.15, lng: 91.75, state: "Assam", type: "river" },
  barak: { lat: 24.82, lng: 92.78, state: "Assam", type: "river" },
  subansiri: { lat: 27.15, lng: 94.2, state: "Assam", type: "river" },
  manas: { lat: 26.76, lng: 91.15, state: "Assam", type: "river" },
  kopili: { lat: 26.08, lng: 92.65, state: "Assam", type: "river" },
  "jia bharali": { lat: 26.83, lng: 92.75, state: "Assam", type: "river" },
  "imphal river": { lat: 24.81, lng: 93.94, state: "Manipur", type: "river" },
  teesta: { lat: 27.15, lng: 88.55, state: "Sikkim", type: "river" },
};

// State centroids as fallback
const STATE_CENTROIDS = {
  assam: { lat: 26.2006, lng: 92.9376 },
  meghalaya: { lat: 25.467, lng: 91.3662 },
  nagaland: { lat: 26.1584, lng: 94.5624 },
  manipur: { lat: 24.6637, lng: 93.9063 },
  mizoram: { lat: 23.1645, lng: 92.9376 },
  tripura: { lat: 23.9408, lng: 91.9882 },
  "arunachal pradesh": { lat: 28.218, lng: 94.7278 },
  sikkim: { lat: 27.533, lng: 88.5122 },
  "north east india": { lat: 26.2006, lng: 92.9376 },
  "northeast india": { lat: 26.2006, lng: 92.9376 },
  "ne india": { lat: 26.2006, lng: 92.9376 },
};

/**
 * Geocode a location string to lat/lng coordinates
 * @param {string} locationName - Name of the location
 * @returns {{ lat: number, lng: number, state: string, type: string, confidence: number } | null}
 */
function geocode(locationName) {
  if (!locationName) return null;

  const normalized = locationName.toLowerCase().trim();

  // Direct match
  if (LOCATIONS[normalized]) {
    return {
      ...LOCATIONS[normalized],
      confidence: 1.0,
      matchedName: normalized,
    };
  }

  // Partial match — check if any known location is contained in the input
  for (const [key, value] of Object.entries(LOCATIONS)) {
    if (normalized.includes(key) || key.includes(normalized)) {
      return { ...value, confidence: 0.8, matchedName: key };
    }
  }

  // State-level fallback
  for (const [key, value] of Object.entries(STATE_CENTROIDS)) {
    if (normalized.includes(key) || key.includes(normalized)) {
      return {
        ...value,
        state: key,
        type: "state",
        confidence: 0.5,
        matchedName: key,
      };
    }
  }

  return null;
}

/**
 * Geocode multiple location names and return the best match
 * @param {string[]} locations
 * @returns {object | null}
 */
function geocodeBest(locations) {
  if (!locations || locations.length === 0) return null;

  let best = null;
  for (const loc of locations) {
    const result = geocode(loc);
    if (result && (!best || result.confidence > best.confidence)) {
      best = result;
    }
  }
  return best;
}

/**
 * Add slight randomness to coordinates for visual separation on map
 */
function jitter(coord, amount = 0.02) {
  return coord + (Math.random() - 0.5) * amount;
}

export { geocode, geocodeBest, jitter, LOCATIONS, STATE_CENTROIDS };

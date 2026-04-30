// NLP Pipeline — Rule-based NER + Disaster Classification
// Extracts: LOCATION, DISASTER_TYPE, SEVERITY, AFFECTED_COUNT

const DISASTER_KEYWORDS = {
  flood: {
    keywords: [
      "flood",
      "flooded",
      "flooding",
      "submerged",
      "inundated",
      "waterlogged",
      "water level",
      "embankment breach",
      "embankment",
      "overflowing",
      "marooned",
      "baan",
      "borha pani",
      "pani bhori",
      "doob",
      "jalmagn",
      "relief camp",
      "displaced",
      "water entered",
      "river bank",
      "erosion",
    ],
    weight: 1.0,
  },
  landslide: {
    keywords: [
      "landslide",
      "mudslide",
      "land slide",
      "slope failure",
      "hill collapse",
      "debris flow",
      "road blocked",
      "road cut off",
      "highway blocked",
      "buried under",
      "hillslope",
      "soil erosion",
      "bhumi dhwas",
    ],
    weight: 1.0,
  },
  heavy_rain: {
    keywords: [
      "heavy rain",
      "torrential",
      "downpour",
      "cloudburst",
      "incessant rain",
      "rainfall",
      "rain alert",
      "red alert",
      "orange alert",
      "IMD warning",
      "monsoon fury",
      "borikhun",
      "bristi",
      "heavy rainfall",
    ],
    weight: 0.8,
  },
  infrastructure: {
    keywords: [
      "bridge collapse",
      "road damage",
      "power outage",
      "power cut",
      "blackout",
      "building collapse",
      "house collapse",
      "dam breach",
      "dam crack",
      "hospital flooded",
      "school closed",
      "railway track",
      "national highway",
      "NH",
      "bridge washed",
    ],
    weight: 0.9,
  },
  earthquake: {
    keywords: [
      "earthquake",
      "tremor",
      "seismic",
      "richter",
      "bhukampa",
      "epicenter",
      "aftershock",
    ],
    weight: 1.0,
  },
  storm: {
    keywords: [
      "storm",
      "cyclone",
      "thunderstorm",
      "hailstorm",
      "lightning",
      "gale",
      "wind speed",
      "toofan",
    ],
    weight: 0.9,
  },
};

const SEVERITY_INDICATORS = {
  critical: {
    keywords: [
      "devastating",
      "catastrophic",
      "emergency",
      "SOS",
      "critical",
      "life threatening",
      "death toll",
      "killed",
      "died",
      "bodies",
      "mass evacuation",
      "unprecedented",
      "worst ever",
      "rescue operation",
      "NDRF",
      "army deployed",
      "army called",
      "dead",
    ],
    level: 4,
    label: "critical",
  },
  high: {
    keywords: [
      "severe",
      "major",
      "serious",
      "dangerous",
      "stranded",
      "trapped",
      "missing",
      "injured",
      "hospitalised",
      "evacuated",
      "thousands",
      "hundreds",
      "massive",
      "widespread",
      "destroyed",
      "collapsed",
      "washed away",
    ],
    level: 3,
    label: "high",
  },
  moderate: {
    keywords: [
      "damaged",
      "affected",
      "disrupted",
      "alert",
      "warning",
      "rising",
      "increasing",
      "several",
      "multiple",
      "concern",
      "waterlogging",
    ],
    level: 2,
    label: "moderate",
  },
  low: {
    keywords: [
      "minor",
      "slight",
      "small",
      "partial",
      "brief",
      "isolated",
      "localized",
      "monitoring",
      "watch",
    ],
    level: 1,
    label: "low",
  },
};

// Known NE India location names for entity extraction
const LOCATION_NAMES = [
  // Assam
  "guwahati",
  "kamrup",
  "nagaon",
  "morigaon",
  "dibrugarh",
  "jorhat",
  "silchar",
  "tezpur",
  "barpeta",
  "nalbari",
  "dhubri",
  "goalpara",
  "cachar",
  "karimganj",
  "hailakandi",
  "sonitpur",
  "lakhimpur",
  "dhemaji",
  "tinsukia",
  "sivasagar",
  "golaghat",
  "darrang",
  "kokrajhar",
  "majuli",
  "baksa",
  // Meghalaya
  "shillong",
  "cherrapunji",
  "tura",
  "east khasi hills",
  "west garo hills",
  "jaintia hills",
  "ri bhoi",
  "south garo hills",
  // Nagaland
  "kohima",
  "dimapur",
  "mokokchung",
  "wokha",
  "zunheboto",
  "phek",
  "mon",
  "tuensang",
  // Manipur
  "imphal",
  "churachandpur",
  "thoubal",
  "bishnupur",
  "senapati",
  "ukhrul",
  "tamenglong",
  "chandel",
  // Mizoram
  "aizawl",
  "lunglei",
  "champhai",
  "serchhip",
  "kolasib",
  "mamit",
  "lawngtlai",
  "saiha",
  // Tripura
  "agartala",
  "west tripura",
  "north tripura",
  "south tripura",
  "dhalai",
  "unakoti",
  "khowai",
  "gomati",
  "sepahijala",
  // Arunachal Pradesh
  "itanagar",
  "tawang",
  "bomdila",
  "ziro",
  "pasighat",
  "along",
  "tezu",
  "changlang",
  "east siang",
  "west siang",
  "lower subansiri",
  // Sikkim
  "gangtok",
  "namchi",
  "mangan",
  "gyalshing",
  // Rivers
  "brahmaputra",
  "barak",
  "subansiri",
  "manas",
  "kopili",
  "jia bharali",
  "teesta",
  // States
  "assam",
  "meghalaya",
  "nagaland",
  "manipur",
  "mizoram",
  "tripura",
  "arunachal pradesh",
  "sikkim",
];

/**
 * Extract locations mentioned in text
 */
function extractLocations(text) {
  const lowerText = text.toLowerCase();
  const found = [];

  // Sort by length descending to match longer names first (e.g., "east khasi hills" before "east")
  const sortedLocations = [...LOCATION_NAMES].sort(
    (a, b) => b.length - a.length,
  );

  for (const loc of sortedLocations) {
    if (lowerText.includes(loc)) {
      // Avoid duplicate entries from overlapping matches
      const alreadyFound = found.some(
        (f) => f.includes(loc) || loc.includes(f),
      );
      if (!alreadyFound) {
        found.push(loc);
      }
    }
  }

  return found;
}

/**
 * Classify disaster type from text
 */
function classifyDisaster(text) {
  const lowerText = text.toLowerCase();
  let bestType = "other";
  let bestScore = 0;

  for (const [type, config] of Object.entries(DISASTER_KEYWORDS)) {
    let matchCount = 0;
    for (const keyword of config.keywords) {
      if (lowerText.includes(keyword)) {
        matchCount++;
      }
    }
    const score = matchCount * config.weight;
    if (score > bestScore) {
      bestScore = score;
      bestType = type;
    }
  }

  return { type: bestType, score: bestScore };
}

/**
 * Determine severity level
 */
function assessSeverity(text) {
  const lowerText = text.toLowerCase();
  let maxLevel = 1;
  let label = "low";

  for (const [, config] of Object.entries(SEVERITY_INDICATORS)) {
    for (const keyword of config.keywords) {
      if (lowerText.includes(keyword) && config.level > maxLevel) {
        maxLevel = config.level;
        label = config.label;
      }
    }
  }

  return { level: maxLevel, label };
}

/**
 * Extract affected counts (people, houses, etc.)
 */
function extractAffectedCount(text) {
  const patterns = [
    /(\d[\d,]*)\s*(?:people|persons|families|villagers|residents)/gi,
    /(\d[\d,]*)\s*(?:houses|homes|buildings|structures)/gi,
    /(\d[\d,]*)\s*(?:killed|dead|died|missing|injured|rescued|evacuated|stranded|displaced)/gi,
    /over\s+(\d[\d,]*)/gi,
    /more\s+than\s+(\d[\d,]*)/gi,
    /at\s+least\s+(\d[\d,]*)/gi,
  ];

  const counts = [];
  for (const pattern of patterns) {
    let match;
    while ((match = pattern.exec(text)) !== null) {
      counts.push(parseInt(match[1].replace(/,/g, ""), 10));
    }
  }

  return counts.length > 0 ? Math.max(...counts) : null;
}

/**
 * Calculate confidence score for the NER extraction
 */
function calculateConfidence(locations, disasterScore, severity) {
  let confidence = 0;

  // Location found adds 0.3
  if (locations.length > 0) confidence += 0.3;
  if (locations.length > 1) confidence += 0.1;

  // Disaster keyword matches
  if (disasterScore >= 3) confidence += 0.3;
  else if (disasterScore >= 2) confidence += 0.25;
  else if (disasterScore >= 1) confidence += 0.15;

  // Higher severity adds more confidence
  confidence += severity.level * 0.05;

  return Math.min(confidence, 1.0);
}

/**
 * Full NLP pipeline — process a tweet text and return structured data
 * @param {string} text
 * @returns {object}
 */
function processText(text) {
  const locations = extractLocations(text);
  const disaster = classifyDisaster(text);
  const severity = assessSeverity(text);
  const affectedCount = extractAffectedCount(text);
  const confidence = calculateConfidence(locations, disaster.score, severity);

  return {
    locations,
    disasterType: disaster.type,
    disasterScore: disaster.score,
    severity: severity.label,
    severityLevel: severity.level,
    affectedCount,
    confidence,
    isDisaster: disaster.score > 0 && confidence >= 0.3,
  };
}

export { processText, extractLocations, classifyDisaster, assessSeverity };

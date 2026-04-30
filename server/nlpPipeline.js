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
 * ============================================================
 * RELEVANCY ENGINE — Multi-Signal Noise vs Real Detection
 * ============================================================
 *
 * 5 signals combined with weights:
 *   Text Quality (0.35) + Source Credibility (0.20) +
 *   Engagement (0.10) + Temporal Coherence (0.15) +
 *   Cross-Reference (0.20)
 *
 * Research basis:
 *   - Castillo et al. (2011): Content features strongest discriminator
 *   - Imran et al. (2015): Textual features most predictive for relevance
 *   - Geospatial clustering studies: Corroboration is gold standard for verification
 *   - Engagement is gameable by bots and penalizes breaking first reports
 */

const RELEVANCY_WEIGHTS = {
  textQuality: 0.35,       // ↑ Most predictive signal (Imran 2015, Castillo 2011)
  sourceCredibility: 0.20, // ↓ Avoid penalizing grassroots citizen reporters
  engagement: 0.10,        // ↓↓ Gameable by bots, penalizes breaking first reports
  temporalCoherence: 0.15, // = Clean binary signal, appropriately weighted
  crossReference: 0.20,    // ↑↑ Gold standard verification (spatiotemporal clustering)
};

// --- Signal 1: Text Quality Analysis ---

const WITNESS_PHRASES = [
  "i can see", "i am seeing", "just saw", "right now",
  "happening now", "i'm here", "we are stuck", "our village",
  "my family", "my house", "we can hear", "looking at",
  "just witnessed", "before my eyes", "live from",
  "i'm reporting", "on the ground", "first hand",
];

const SPECIFICITY_PATTERNS = [
  /\d+\s*(people|persons|families|houses|km|meters|feet|crore|lakh)/i,
  /NH-?\d+/i,
  /\d+\s*(dead|killed|injured|missing|rescued|evacuated|stranded)/i,
  /(district|block|circle|ward|colony|road|highway|river)\b/i,
  /\b(NDRF|SDRF|IAF|Army|BSF|SDMA|IMD|CWC)\b/,
  /(phase|wave|spell)\s*\d+/i,
];

const NOISE_INDICATORS = {
  sarcasm: {
    patterns: [
      /\b(lol|lmao|rofl|haha|😂|🤣|jk|smh)\b/i,
      /\b(sarcasm|just kidding|not really)\b/i,
    ],
    penalty: -0.30,
  },
  pastReference: {
    patterns: [
      /\b(remember|throwback|back in \d{4}|last year|years ago|old photo|old video)\b/i,
      /\b(reminds me|nostalgia|looking back|anniversary of)\b/i,
    ],
    penalty: -0.25,
  },
  hypothetical: {
    patterns: [
      /\b(what if|imagine if|could happen|might happen|hypothetical)\b/i,
      /\b(in case of|if ever|scenario)\b/i,
    ],
    penalty: -0.25,
  },
  promotional: {
    patterns: [
      /\b(follow me|subscribe|check out my|link in bio|promo code|download)\b/i,
      /\b(giveaway|contest|win a|click here|buy now|discount)\b/i,
    ],
    penalty: -0.20,
  },
  shortText: {
    check: (text) => text.replace(/\s/g, "").length < 25,
    penalty: -0.15,
  },
  allCapsSpam: {
    check: (text) => {
      const words = text.split(/\s+/).filter((w) => w.length > 3);
      const capsWords = words.filter((w) => w === w.toUpperCase());
      return words.length > 3 && capsWords.length / words.length > 0.7;
    },
    penalty: -0.10,
  },
  movieMedia: {
    patterns: [
      /\b(movie|film|documentary|trailer|series|episode|book|novel|game)\b/i,
      /\b(watching|binge|review|rating|stars out of)\b/i,
    ],
    penalty: -0.25,
  },
};

function analyzeTextQuality(text) {
  let score = 0.5; // Start neutral
  const signals = [];

  // Boost: witness language
  const lowerText = text.toLowerCase();
  let witnessCount = 0;
  for (const phrase of WITNESS_PHRASES) {
    if (lowerText.includes(phrase)) witnessCount++;
  }
  if (witnessCount > 0) {
    const boost = Math.min(witnessCount * 0.08, 0.15);
    score += boost;
    signals.push(`+witness(${witnessCount})`);
  }

  // Boost: specificity (numbers, named entities)
  let specificityCount = 0;
  for (const pattern of SPECIFICITY_PATTERNS) {
    if (pattern.test(text)) specificityCount++;
  }
  if (specificityCount > 0) {
    const boost = Math.min(specificityCount * 0.05, 0.12);
    score += boost;
    signals.push(`+specific(${specificityCount})`);
  }

  // Boost: urgency markers
  const urgencyPattern = /\b(SOS|urgent|help|please share|emergency|🆘|🚨|⚠️)\b/i;
  if (urgencyPattern.test(text)) {
    score += 0.08;
    signals.push("+urgency");
  }

  // Penalties: noise indicators
  for (const [name, indicator] of Object.entries(NOISE_INDICATORS)) {
    let triggered = false;
    if (indicator.patterns) {
      triggered = indicator.patterns.some((p) => p.test(text));
    } else if (indicator.check) {
      triggered = indicator.check(text);
    }
    if (triggered) {
      score += indicator.penalty;
      signals.push(`-${name}`);
    }
  }

  return { score: Math.max(0, Math.min(1, score)), signals };
}

// --- Signal 2: Engagement Metrics Scoring ---

function scoreEngagement(metrics = {}) {
  if (!metrics || Object.keys(metrics).length === 0) {
    return { score: 0.3, signals: ["no_metrics"] };
  }

  const signals = [];
  let score = 0;

  const { likes = 0, retweets = 0, replies = 0, views = 0 } = metrics;

  // Logarithmic scaling for each metric
  const rtScore = retweets > 0 ? Math.min(Math.log10(retweets + 1) / 4, 0.3) : 0;
  const likeScore = likes > 0 ? Math.min(Math.log10(likes + 1) / 5, 0.2) : 0;
  const replyScore = replies > 0 ? Math.min(Math.log10(replies + 1) / 4, 0.2) : 0;
  const viewScore = views > 0 ? Math.min(Math.log10(views + 1) / 6, 0.15) : 0;

  score = rtScore + likeScore + replyScore + viewScore;

  // Engagement velocity boost: high engagement on recent content = breaking news
  const totalEngagement = likes + retweets + replies;
  if (totalEngagement > 500) {
    score += 0.15;
    signals.push("+viral");
  } else if (totalEngagement > 100) {
    score += 0.08;
    signals.push("+trending");
  } else if (totalEngagement > 20) {
    signals.push("+engaged");
  } else {
    signals.push("low_engagement");
  }

  return { score: Math.max(0, Math.min(1, score)), signals };
}

// --- Signal 3: Source Credibility ---

const SOURCE_TRUST = {
  // Official government/disaster agencies
  "@ndrf_updates": 0.95,
  "@assam_sdma": 0.95,
  "@imd_guwahati": 0.95,
  // Verified news
  "@shillong_times": 0.85,
  "@nagaland_post": 0.85,
  "@ne_india_news": 0.85,
  "@assam_updates": 0.80,
  "@manipur_alert": 0.80,
  "@mizoram_today": 0.80,
  "@tripura_news": 0.80,
  "@arunachal_voice": 0.80,
  "@sikkim_express": 0.80,
  "@weatherNE": 0.80,
  "@disaster_india": 0.80,
  // Relief orgs
  "@redcross_ne": 0.85,
  "@unicef_india": 0.85,
  "@gaborone_relief": 0.80,
  "@relief_NE": 0.75,
  "@help_assam": 0.70,
  // Dedicated monitoring
  "@flood_watch_assam": 0.75,
  "@brahmaputra_watch": 0.75,
  // Local journalists
  "@local_journo_ne": 0.70,
  "@village_voice_assam": 0.65,
  // Citizen reporters
  "@citizen_reporter1": 0.50,
};

function scoreSourceCredibility(handle, accountMeta = {}) {
  const signals = [];
  let score = 0;

  // Known handle trust
  const knownTrust = SOURCE_TRUST[handle];
  if (knownTrust !== undefined) {
    score = knownTrust;
    if (knownTrust >= 0.90) signals.push("official");
    else if (knownTrust >= 0.75) signals.push("trusted");
    else if (knownTrust >= 0.60) signals.push("known");
    else signals.push("citizen");
  } else {
    score = 0.25; // Unknown handle
    signals.push("unknown");
  }

  // Account metadata adjustments
  const { isVerified, followerCount, accountAgeDays } = accountMeta;

  if (isVerified) {
    score = Math.min(score + 0.15, 1.0);
    signals.push("+verified");
  }

  if (followerCount > 50000) {
    score = Math.min(score + 0.10, 1.0);
    signals.push("+highFollowers");
  } else if (followerCount > 5000) {
    score = Math.min(score + 0.05, 1.0);
  }

  if (accountAgeDays !== undefined && accountAgeDays < 30) {
    score = Math.max(score - 0.15, 0);
    signals.push("-newAccount");
  }

  return { score: Math.max(0, Math.min(1, score)), signals };
}

// --- Signal 4: Temporal Coherence ---

const PRESENT_INDICATORS = [
  "right now", "happening now", "currently", "just now",
  "breaking", "live update", "update:", "is flooding",
  "is rising", "has breached", "being evacuated",
  "deployed", "ongoing", "underway", "at this moment",
  "as we speak", "real time", "just witnessed",
];

const PAST_INDICATORS = [
  "remember when", "back in 20", "years ago", "last year",
  "last month", "old photo", "old video", "throwback",
  "anniversary", "that time when", "used to be",
  "historically", "in 19", "in 200", "looking back",
  "nostalgic", "we had a flood in",
];

function analyzeTemporalCoherence(text) {
  const lowerText = text.toLowerCase();
  const signals = [];
  let score = 0.5; // Neutral

  // Check for present/ongoing indicators
  let presentCount = 0;
  for (const phrase of PRESENT_INDICATORS) {
    if (lowerText.includes(phrase)) presentCount++;
  }
  if (presentCount > 0) {
    score += Math.min(presentCount * 0.1, 0.3);
    signals.push(`+present(${presentCount})`);
  }

  // Check for past-tense references
  let pastCount = 0;
  for (const phrase of PAST_INDICATORS) {
    if (lowerText.includes(phrase)) pastCount++;
  }
  if (pastCount > 0) {
    score -= Math.min(pastCount * 0.15, 0.4);
    signals.push(`-past(${pastCount})`);
  }

  // Hashtag analysis: event-specific hashtags boost score
  const yearHashtags = text.match(/#\w*(2026|2025)\b/gi);
  if (yearHashtags) {
    score += 0.1;
    signals.push("+currentYear");
  }

  return { score: Math.max(0, Math.min(1, score)), signals };
}

// --- Signal 5: Cross-Reference / Corroboration ---

function scoreCrossReference(locationName, recentLocationEvents = []) {
  const signals = [];

  if (!locationName || recentLocationEvents.length === 0) {
    return { score: 0.3, signals: ["no_corroboration"] };
  }

  const count = recentLocationEvents.length;

  let score;
  if (count >= 5) {
    score = 0.95;
    signals.push(`+strong_corroboration(${count})`);
  } else if (count >= 3) {
    score = 0.80;
    signals.push(`+corroborated(${count})`);
  } else if (count >= 1) {
    score = 0.55;
    signals.push(`+partial(${count})`);
  } else {
    score = 0.30;
    signals.push("isolated");
  }

  return { score, signals };
}

// --- Weighted Relevancy Calculator ---

function calculateRelevancy(signalScores) {
  let total = 0;
  const breakdown = {};

  for (const [signal, weight] of Object.entries(RELEVANCY_WEIGHTS)) {
    const data = signalScores[signal];
    if (data) {
      const weighted = data.score * weight;
      total += weighted;
      breakdown[signal] = {
        raw: Math.round(data.score * 100) / 100,
        weighted: Math.round(weighted * 100) / 100,
        signals: data.signals,
      };
    }
  }

  return {
    score: Math.round(Math.max(0, Math.min(1, total)) * 100) / 100,
    breakdown,
  };
}

/**
 * Full NLP pipeline — process a tweet text and return structured data
 * Now includes multi-signal relevancy scoring
 *
 * @param {string} text - Tweet text
 * @param {object} options - Additional context
 * @param {object} options.engagement - { likes, retweets, replies, views }
 * @param {string} options.handle - Tweet author handle
 * @param {object} options.accountMeta - { isVerified, followerCount, accountAgeDays }
 * @param {Array}  options.recentLocationEvents - Recent events from same location (for corroboration)
 * @returns {object}
 */
function processText(text, options = {}) {
  const locations = extractLocations(text);
  const disaster = classifyDisaster(text);
  const severity = assessSeverity(text);
  const affectedCount = extractAffectedCount(text);
  const confidence = calculateConfidence(locations, disaster.score, severity);

  // Relevancy signals
  const textQuality = analyzeTextQuality(text);
  const engagement = scoreEngagement(options.engagement);
  const sourceCredibility = scoreSourceCredibility(
    options.handle || "",
    options.accountMeta || {},
  );
  const temporalCoherence = analyzeTemporalCoherence(text);
  const crossReference = scoreCrossReference(
    locations[0],
    options.recentLocationEvents || [],
  );

  const relevancy = calculateRelevancy({
    textQuality,
    sourceCredibility,
    engagement,
    temporalCoherence,
    crossReference,
  });

  return {
    locations,
    disasterType: disaster.type,
    disasterScore: disaster.score,
    severity: severity.label,
    severityLevel: severity.level,
    affectedCount,
    confidence,
    relevancyScore: relevancy.score,
    relevancyBreakdown: relevancy.breakdown,
    isDisaster: disaster.score > 0 && confidence >= 0.3,
    isRelevant: relevancy.score >= 0.4,
  };
}

export {
  processText,
  extractLocations,
  classifyDisaster,
  assessSeverity,
  analyzeTextQuality,
  scoreEngagement,
  scoreSourceCredibility,
  analyzeTemporalCoherence,
  scoreCrossReference,
  calculateRelevancy,
};


// Fake tweet generator for demo — ~120 realistic disaster tweets for NE India

const HANDLES = [
  "@assam_updates",
  "@ne_india_news",
  "@gaborone_relief",
  "@flood_watch_assam",
  "@shillong_times",
  "@nagaland_post",
  "@manipur_alert",
  "@mizoram_today",
  "@tripura_news",
  "@arunachal_voice",
  "@sikkim_express",
  "@brahmaputra_watch",
  "@ndrf_updates",
  "@assam_sdma",
  "@imd_guwahati",
  "@relief_NE",
  "@citizen_reporter1",
  "@local_journo_ne",
  "@village_voice_assam",
  "@help_assam",
  "@redcross_ne",
  "@unicef_india",
  "@disaster_india",
  "@weatherNE",
];

const SOURCES = ["twitter", "twitter", "twitter", "reddit"];

const TWEET_TEMPLATES = [
  // ===== FLOODS (40 tweets) =====
  {
    text: "🚨 BREAKING: Brahmaputra water level crosses danger mark at Guwahati. Over 5000 people evacuated from Kamrup district. #AssamFloods",
    locations: ["guwahati", "kamrup"],
  },
  {
    text: "Massive flooding in Nagaon district. Water has entered homes in low-lying areas. 200+ families displaced. Relief camps set up at schools. #FloodAlert",
    locations: ["nagaon"],
  },
  {
    text: "Morigaon is completely submerged. No electricity for 3 days. People stranded on rooftops. NDRF teams deployed. SOS 🆘",
    locations: ["morigaon"],
  },
  {
    text: "Barpeta road cut off due to flooding. Brahmaputra embankment breached at two points. Thousands marooned. #AssamFlood2026",
    locations: ["barpeta", "brahmaputra"],
  },
  {
    text: "Dhemaji faces unprecedented flooding. Subansiri river overflowing. Over 300 villages affected. Army called in for rescue operations.",
    locations: ["dhemaji", "subansiri"],
  },
  {
    text: "Majuli, the world's largest river island, is facing severe erosion. 15 families lost their homes overnight. The island is shrinking. 😢",
    locations: ["majuli"],
  },
  {
    text: "Water level rising rapidly in Silchar. Barak river above danger level. Cachar DC orders evacuation of riverside areas. #BarakValleyFloods",
    locations: ["silchar", "barak", "cachar"],
  },
  {
    text: "Dibrugarh town flooded for the first time in 10 years. Market areas waterlogged. Shops and businesses severely damaged.",
    locations: ["dibrugarh"],
  },
  {
    text: "Relief camp in Lakhimpur running out of food and clean water. 1500 people sheltering there. Urgent help needed! #AssamNeedsHelp",
    locations: ["lakhimpur"],
  },
  {
    text: "Jorhat-Majuli ferry services suspended due to dangerous water levels. Thousands stranded on both sides. No connectivity.",
    locations: ["jorhat", "majuli"],
  },
  {
    text: "Flash flood hits Goalpara district after heavy overnight rain. Agricultural land submerged, crops destroyed. Farmers devastated.",
    locations: ["goalpara"],
  },
  {
    text: "Flood waters receding in Nalbari but massive destruction left behind. 500+ houses damaged, 3 bridges washed away.",
    locations: ["nalbari"],
  },
  {
    text: "Kokrajhar embankment in critical condition. If it breaches, 50,000 people could be affected. Engineers working overnight. #Urgent",
    locations: ["kokrajhar"],
  },
  {
    text: "Golaghat district reeling under flood. Kopili river has overflowed its banks. Multiple villages cut off from mainland.",
    locations: ["golaghat", "kopili"],
  },
  {
    text: "Darrang district: 10,000 people affected by Brahmaputra floods. 45 relief camps operational. Drinking water is the biggest crisis.",
    locations: ["darrang", "brahmaputra"],
  },
  {
    text: "Karimganj flooded again. Third wave of floods this monsoon season. People have lost everything. When will this end? 💔",
    locations: ["karimganj"],
  },
  {
    text: "Hailakandi town under 4 feet of water. Hospital ground floor submerged. Patients shifted to upper floors. Critical situation.",
    locations: ["hailakandi"],
  },
  {
    text: "Tinsukia faces severe waterlogging. Drainage system completely failed. Residents angry at administration. #TinsukiaFloods",
    locations: ["tinsukia"],
  },
  {
    text: "Dhubri district: Brahmaputra erosion eating away villages. 20 families have become homeless this week alone. No rehabilitation yet.",
    locations: ["dhubri", "brahmaputra"],
  },
  {
    text: "Baksa district flood update: water level still rising. Manas river above danger mark. SDRF teams on standby.",
    locations: ["baksa", "manas"],
  },
  {
    text: "Sonitpur faces dual crisis — floods and erosion. Jia Bharali river has changed course, threatening Tezpur outskirts.",
    locations: ["sonitpur", "jia bharali", "tezpur"],
  },
  {
    text: "Sivasagar historical monuments threatened by rising floodwaters. Rang Ghar and Talatal Ghar areas waterlogged.",
    locations: ["sivasagar"],
  },
  {
    text: "Agartala waterlogged after 48 hours of continuous rain. West Tripura worst affected. 500 people in relief camps.",
    locations: ["agartala", "west tripura"],
  },
  {
    text: "Imphal river overflowing in Thoubal. Bishnupur low-lying areas submerged. Manipur flood toll rises to devastating levels.",
    locations: ["imphal", "thoubal", "bishnupur"],
  },
  {
    text: "Teesta river swelling in North Sikkim. Mangan on high alert. Glacial lake concerns mount. All tourists advised to evacuate.",
    locations: ["teesta", "north sikkim", "mangan"],
  },

  // ===== LANDSLIDES (25 tweets) =====
  {
    text: "🔴 ALERT: Massive landslide in Shillong-Cherrapunji road. 3 vehicles buried. Rescue operations underway. East Khasi Hills on alert.",
    locations: ["shillong", "cherrapunji", "east khasi hills"],
  },
  {
    text: "Landslide blocks NH-6 near Kohima. Nagaland traffic completely cut off. Hundreds of vehicles stranded for 12+ hours.",
    locations: ["kohima"],
  },
  {
    text: "Multiple landslides in Aizawl after 72 hours of rain. 5 houses collapsed. 2 people missing. Mizoram CM reviews situation.",
    locations: ["aizawl"],
  },
  {
    text: "Devastating landslide in Tamenglong, Manipur. Entire hillside collapsed. Road to Imphal blocked. At least 8 people feared trapped.",
    locations: ["tamenglong", "imphal"],
  },
  {
    text: "Itanagar faces massive landslide near capital complex. Governor's residence area affected. 3 killed, several injured. #ArunachalLandslide",
    locations: ["itanagar"],
  },
  {
    text: "Bomdila-Tawang highway blocked by landslide. Army convoy stranded. Debris clearing may take 48-72 hours minimum.",
    locations: ["bomdila", "tawang"],
  },
  {
    text: "South Garo Hills: Multiple landslides cut off 15 villages. No road access, no mobile network. Helicopter rescue requested.",
    locations: ["south garo hills"],
  },
  {
    text: "Tura town area hit by mudslide. West Garo Hills DC declares local emergency. Schools and offices closed.",
    locations: ["tura", "west garo hills"],
  },
  {
    text: "Landslide in Ri Bhoi district buries part of NH-40. Traffic between Shillong and Guwahati disrupted. Long detour needed.",
    locations: ["ri bhoi", "shillong", "guwahati"],
  },
  {
    text: "Ukhrul district, Manipur: Slope failure destroys 4 houses. Villagers relocated to safe zones. More rain expected tonight.",
    locations: ["ukhrul"],
  },
  {
    text: "Lunglei-Lawngtlai road blocked by landslide debris for 3rd time this month. Southern Mizoram completely isolated. 😰",
    locations: ["lunglei", "lawngtlai"],
  },
  {
    text: "Changlang district in Arunachal Pradesh: Landslide kills 3, injures 7. Remote village, rescue teams struggling to reach.",
    locations: ["changlang"],
  },
  {
    text: "Dimapur-Kohima NH29 blocked again. This is the 5th landslide this season on this critical highway. Infrastructure crumbling.",
    locations: ["dimapur", "kohima"],
  },
  {
    text: "Gangtok outskirts: Major landslide near Bojoghari. East Sikkim on high alert. Soil is completely saturated after weeks of rain.",
    locations: ["gangtok", "east sikkim"],
  },
  {
    text: "Champhai, Mizoram: Hillslope collapsed onto village. 12 houses damaged. No casualties reported thankfully. Evacuation complete.",
    locations: ["champhai"],
  },

  // ===== HEAVY RAIN (20 tweets) =====
  {
    text: "🌧️ IMD Red Alert: Extremely heavy rainfall expected in Assam, Meghalaya next 48 hours. 200mm+ predicted. All districts on alert.",
    locations: ["assam", "meghalaya"],
  },
  {
    text: "Cherrapunji records 800mm rainfall in 24 hours. One of the heaviest spells in recent years. Flash flood warning issued.",
    locations: ["cherrapunji"],
  },
  {
    text: "Continuous downpour in Guwahati for 36 hours. City paralyzed. Traffic jams everywhere. Drains overflowing. Schools closed.",
    locations: ["guwahati"],
  },
  {
    text: "IMD Orange Alert for Nagaland and Manipur. Heavy to very heavy rainfall expected. Residents advised to stay indoors.",
    locations: ["nagaland", "manipur"],
  },
  {
    text: "Cloudburst in Tawang, Arunachal Pradesh. Torrential rain causes flash floods in streams. Bridges damaged. Remote areas cut off.",
    locations: ["tawang"],
  },
  {
    text: "Jaintia Hills received 500mm rain in 48 hours. Rivers swelling rapidly. Mining areas flooded. Environmental disaster unfolding.",
    locations: ["jaintia hills"],
  },
  {
    text: "Kolasib, Mizoram: Incessant rain for 5 days. Ground is saturated. Landslide warnings issued for all hilly areas.",
    locations: ["kolasib"],
  },
  {
    text: "North Tripura drenched in monsoon fury. Unakoti district records highest rainfall in a decade. Dhalai river rising fast.",
    locations: ["north tripura", "unakoti", "dhalai"],
  },
  {
    text: "Senapati district, Manipur: Heavy rain triggers multiple small landslides. NH-2 partially blocked. Travel advisory issued.",
    locations: ["senapati"],
  },
  {
    text: "Ziro valley, Arunachal: Unprecedented rainfall destroys paddy fields. Lower Subansiri on alert. Tribal communities worst hit.",
    locations: ["ziro", "lower subansiri"],
  },
  {
    text: "Pasighat records 300mm in 12 hours. East Siang flood alert. Siang river dangerously close to danger level.",
    locations: ["pasighat", "east siang"],
  },
  {
    text: "Thunderstorm and lightning kills 5 in Assam. Incidents reported in Darrang and Baksa. Farmers working in fields were struck.",
    locations: ["darrang", "baksa", "assam"],
  },

  // ===== INFRASTRUCTURE (20 tweets) =====
  {
    text: "⚠️ Bridge collapse on Brahmaputra tributary near Tezpur. A 50-year old bridge gave way. No casualties. Sonitpur cut off from south.",
    locations: ["tezpur", "brahmaputra", "sonitpur"],
  },
  {
    text: "Power outage across Barpeta and Nalbari for 48+ hours. Floodwaters damaged transformers. APDCL unable to restore.",
    locations: ["barpeta", "nalbari"],
  },
  {
    text: "Railway track between Guwahati and Dibrugarh submerged. All trains cancelled. 50,000 passengers stranded at stations.",
    locations: ["guwahati", "dibrugarh"],
  },
  {
    text: "NH-27 near Goalpara completely washed away. 200m stretch gone. Will take months to repair. Assam's lifeline severed.",
    locations: ["goalpara"],
  },
  {
    text: "Silchar airport flooded. All flights cancelled indefinitely. Cachar district completely cut off — no road, rail or air access. 🆘",
    locations: ["silchar", "cachar"],
  },
  {
    text: "Dam spillway opened at Kopili reservoir without warning. Downstream villages in Nagaon flooded within hours. People furious.",
    locations: ["kopili", "nagaon"],
  },
  {
    text: "Mobile towers down in Dhemaji and Lakhimpur. No communication for 72 hours. Families anxious. Cannot contact loved ones.",
    locations: ["dhemaji", "lakhimpur"],
  },
  {
    text: "School building collapses in Kokrajhar. Building was being used as relief camp. 200 people evacuated just in time. Miraculous escape.",
    locations: ["kokrajhar"],
  },
  {
    text: "Dimapur-Imphal railway project site damaged by landslide. ₹500 crore infrastructure at risk. Construction halted.",
    locations: ["dimapur", "imphal"],
  },
  {
    text: "Namchi hospital partially damaged by landslide debris. South Sikkim medical services disrupted. Patients transferred to Gangtok.",
    locations: ["namchi", "south sikkim", "gangtok"],
  },
  {
    text: "Agartala-Sabroom NH fully submerged. South Tripura completely isolated for 4 days. Food supplies running critically low.",
    locations: ["agartala", "south tripura"],
  },
  {
    text: "Gyalshing in West Sikkim: Three bridges washed away. Villages on other side have no access. Helicopter drops being planned.",
    locations: ["gyalshing", "west sikkim"],
  },

  // ===== MIXED/CITIZEN REPORTS (15 tweets) =====
  {
    text: "My village in Morigaon has been underwater for a week. We've lost everything. No government help has come. Please share. #AssamCries",
    locations: ["morigaon"],
  },
  {
    text: "Can anyone help? My family in Majuli has been on their roof for 2 days. Boats are not reaching. The current is too strong. 😭",
    locations: ["majuli"],
  },
  {
    text: "Just saw a huge portion of the hill collapse near Shillong. Road completely blocked. Scary scene. Stay safe everyone in Meghalaya.",
    locations: ["shillong", "meghalaya"],
  },
  {
    text: "Volunteered at Nagaon relief camp today. 3000 people here. Kids are sick, no medicine. Clean water shortage. #HelpAssam",
    locations: ["nagaon"],
  },
  {
    text: "r/india — Assam flood situation is catastrophic. Brahmaputra has swallowed entire villages in Dhubri. Media is not covering this enough.",
    locations: ["assam", "brahmaputra", "dhubri"],
  },
  {
    text: "Kohima update: After 3 days of being stranded, NH finally partially cleared. But another landslide expected tonight. Pray for Nagaland. 🙏",
    locations: ["kohima", "nagaland"],
  },
  {
    text: "My ancestral home in Barpeta has been washed away by erosion. 4 generations lived there. Brahmaputra took everything. 💔 #ClimateChange",
    locations: ["barpeta", "brahmaputra"],
  },
  {
    text: "Thread 🧵 Aizawl landslide situation is worse than reported. Local admin is overwhelmed. Here's what I saw today in the affected area...",
    locations: ["aizawl"],
  },
  {
    text: "Requesting blood donation for flood victims in Silchar. B+ and O- urgently needed at SMC Hospital. Please RT! 🩸 #SilcharFloods",
    locations: ["silchar"],
  },
  {
    text: "Imphal valley flooded AGAIN. 4th time this year. Our drainage infrastructure is a complete joke. When will anyone listen? 🤬",
    locations: ["imphal"],
  },
  {
    text: "Just airlifted from Tawang after being stuck for 5 days. The landslide destruction is unimaginable. Arunachal needs massive help.",
    locations: ["tawang"],
  },
  {
    text: "Friend stuck in Churachandpur with no food. All shops closed. Roads blocked. Manipur government where are you? #ManipurFloods",
    locations: ["churachandpur"],
  },
];

let tweetIndex = 0;

function generateTweet() {
  const template = TWEET_TEMPLATES[tweetIndex % TWEET_TEMPLATES.length];
  tweetIndex++;

  const handle = HANDLES[Math.floor(Math.random() * HANDLES.length)];
  const source = SOURCES[Math.floor(Math.random() * SOURCES.length)];

  // Slightly randomize timestamp (within last few minutes)
  const timestamp = new Date(
    Date.now() - Math.random() * 5 * 60 * 1000,
  ).toISOString();

  return {
    id: `tw_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`,
    text: template.text,
    handle,
    source,
    timestamp,
    hintLocations: template.locations,
  };
}

/**
 * Generate a batch of tweets for historical simulation
 * @param {number} count
 * @param {number} hoursBack - spread tweets over this many hours
 */
function generateHistoricalBatch(count = 50, hoursBack = 48) {
  const tweets = [];
  const now = Date.now();

  for (let i = 0; i < count; i++) {
    const template = TWEET_TEMPLATES[i % TWEET_TEMPLATES.length];
    const handle = HANDLES[Math.floor(Math.random() * HANDLES.length)];
    const source = SOURCES[Math.floor(Math.random() * SOURCES.length)];

    // Distribute across time range, with more recent tweets being more frequent
    const progress = i / count;
    const hoursAgo = hoursBack * (1 - Math.pow(progress, 0.7));
    const timestamp = new Date(now - hoursAgo * 3600 * 1000).toISOString();

    tweets.push({
      id: `tw_hist_${i}_${Math.random().toString(36).substring(2, 8)}`,
      text: template.text,
      handle,
      source,
      timestamp,
      hintLocations: template.locations,
    });
  }

  return tweets.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
}

export { generateTweet, generateHistoricalBatch, TWEET_TEMPLATES };

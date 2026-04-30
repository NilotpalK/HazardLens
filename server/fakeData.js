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

// ===== NOISE TWEETS — should be filtered by relevancy engine =====
const NOISE_TEMPLATES = [
  {
    text: "Just watched a documentary about the 2004 Assam floods. Reminds me how vulnerable Brahmaputra basin is. Great cinematography! 🎬",
    locations: ["assam", "brahmaputra"],
    isNoise: true,
  },
  {
    text: "lol my bathroom is flooded again 😂 feeling like Guwahati in monsoon season haha #FirstWorldProblems",
    locations: ["guwahati"],
    isNoise: true,
  },
  {
    text: "Remember the Silchar floods of 2022? That was devastating. Pray it never happens again. Throwback to those dark days. 🙏",
    locations: ["silchar"],
    isNoise: true,
  },
  {
    text: "What if a massive earthquake hits Shillong? Hypothetical scenario for my disaster management thesis. Need data points. #Research",
    locations: ["shillong"],
    isNoise: true,
  },
  {
    text: "Follow me for daily weather updates from NE India! Subscribe to my newsletter. Link in bio. Use promo code MONSOON20 for discount 🌧️",
    locations: [],
    isNoise: true,
  },
  {
    text: "Playing the new disaster simulation game set in Assam. The flood graphics are insane! 10/10 would recommend. #Gaming #FloodSimulator",
    locations: ["assam"],
    isNoise: true,
  },
  {
    text: "Landslide wins! Best disaster movie of 2026. The scene in Kohima was wild lmao 🤣 #MovieReview",
    locations: ["kohima"],
    isNoise: true,
  },
  {
    text: "FLOOD FLOOD FLOOD BUY NOW SALE SALE SALE MEGA DISCOUNT ON RAIN GEAR CLICK HERE!!!",
    locations: [],
    isNoise: true,
  },
  {
    text: "Imagine if the Brahmaputra dried up. What would happen to Assam? Random thought at 3am. Can't sleep 🤔",
    locations: ["brahmaputra", "assam"],
    isNoise: true,
  },
  {
    text: "Looking back at old photos from my trip to Cherrapunji. Beautiful place. The rain was something else! Nostalgia hits different. 📸",
    locations: ["cherrapunji"],
    isNoise: true,
  },
  {
    text: "My cat knocked over the water bowl. Complete inundation of the kitchen. NDRF please send help lmao 😂🐱",
    locations: [],
    isNoise: true,
  },
  {
    text: "Binge watching disaster documentaries. The Manipur episode was mid tbh. 3 stars out of 5. Not enough drama 🍿",
    locations: ["manipur"],
    isNoise: true,
  },
  {
    text: "We had a flood in our school bathroom back in 2018. Nagaon kids will remember this lol 😂 #GoodOldDays",
    locations: ["nagaon"],
    isNoise: true,
  },
  {
    text: "Win a free rain jacket! RT + Follow @fake_brand. Giveaway ends this monsoon. Contest open to all NE India residents! 🎁",
    locations: [],
    isNoise: true,
  },
  {
    text: "If ever a cyclone hits Tripura, I wonder what would happen. Just thinking hypothetically for no reason. 💭",
    locations: ["tripura"],
    isNoise: true,
  },
  {
    text: "Throwback to last year when Dimapur roads were waterlogged. Smh nothing changes. Same old story every year. 🙄",
    locations: ["dimapur"],
    isNoise: true,
  },
  {
    text: "Just kidding about the flood warning earlier. Not really happening. False alarm sorry everyone! 😅",
    locations: [],
    isNoise: true,
  },
  {
    text: "Anniversary of the 2019 Assam floods today. Never forget the devastation. RIP to all who lost their lives. 🕯️",
    locations: ["assam"],
    isNoise: true,
  },
  {
    text: "Rating NE India states by flood readiness: Assam F, Meghalaya C, Sikkim B. Lol just my opinion don't @ me 😂",
    locations: ["assam", "meghalaya", "sikkim"],
    isNoise: true,
  },
  {
    text: "Download my flood prediction app! Only ₹99/month. Check out my YouTube review. Subscribe for more disaster tech content 📱",
    locations: [],
    isNoise: true,
  },
];

// Noise-specific handles (low credibility)
const NOISE_HANDLES = [
  "@random_user_420",
  "@meme_lord_ne",
  "@bot_farm_7",
  "@spam_account_x",
  "@movie_reviewer_ne",
  "@throwback_daily",
  "@promo_deals_india",
  "@troll_master_69",
];

// Account metadata profiles
const ACCOUNT_PROFILES = {
  // Official — high trust
  "@ndrf_updates": { isVerified: true, followerCount: 250000, accountAgeDays: 3650 },
  "@assam_sdma": { isVerified: true, followerCount: 180000, accountAgeDays: 2920 },
  "@imd_guwahati": { isVerified: true, followerCount: 320000, accountAgeDays: 4015 },
  // News — verified
  "@shillong_times": { isVerified: true, followerCount: 95000, accountAgeDays: 3285 },
  "@nagaland_post": { isVerified: true, followerCount: 72000, accountAgeDays: 2555 },
  "@ne_india_news": { isVerified: true, followerCount: 110000, accountAgeDays: 1825 },
  "@assam_updates": { isVerified: false, followerCount: 45000, accountAgeDays: 1460 },
  "@manipur_alert": { isVerified: false, followerCount: 28000, accountAgeDays: 1095 },
  "@mizoram_today": { isVerified: false, followerCount: 22000, accountAgeDays: 985 },
  "@tripura_news": { isVerified: false, followerCount: 18000, accountAgeDays: 875 },
  "@arunachal_voice": { isVerified: false, followerCount: 15000, accountAgeDays: 730 },
  "@sikkim_express": { isVerified: false, followerCount: 25000, accountAgeDays: 1100 },
  // Relief orgs
  "@redcross_ne": { isVerified: true, followerCount: 65000, accountAgeDays: 2190 },
  "@unicef_india": { isVerified: true, followerCount: 890000, accountAgeDays: 5110 },
  "@gaborone_relief": { isVerified: false, followerCount: 8500, accountAgeDays: 620 },
  "@relief_NE": { isVerified: false, followerCount: 12000, accountAgeDays: 540 },
  "@help_assam": { isVerified: false, followerCount: 7200, accountAgeDays: 410 },
  // Monitoring
  "@flood_watch_assam": { isVerified: false, followerCount: 31000, accountAgeDays: 1460 },
  "@brahmaputra_watch": { isVerified: false, followerCount: 19000, accountAgeDays: 950 },
  "@weatherNE": { isVerified: false, followerCount: 41000, accountAgeDays: 1280 },
  "@disaster_india": { isVerified: true, followerCount: 155000, accountAgeDays: 2555 },
  // Journalists
  "@local_journo_ne": { isVerified: false, followerCount: 5200, accountAgeDays: 780 },
  "@village_voice_assam": { isVerified: false, followerCount: 3100, accountAgeDays: 365 },
  // Citizens
  "@citizen_reporter1": { isVerified: false, followerCount: 820, accountAgeDays: 210 },
  // Noise handles — low trust
  "@random_user_420": { isVerified: false, followerCount: 120, accountAgeDays: 15 },
  "@meme_lord_ne": { isVerified: false, followerCount: 3500, accountAgeDays: 90 },
  "@bot_farm_7": { isVerified: false, followerCount: 45, accountAgeDays: 5 },
  "@spam_account_x": { isVerified: false, followerCount: 8, accountAgeDays: 2 },
  "@movie_reviewer_ne": { isVerified: false, followerCount: 2200, accountAgeDays: 340 },
  "@throwback_daily": { isVerified: false, followerCount: 6800, accountAgeDays: 450 },
  "@promo_deals_india": { isVerified: false, followerCount: 15000, accountAgeDays: 60 },
  "@troll_master_69": { isVerified: false, followerCount: 4100, accountAgeDays: 75 },
};

// Generate realistic engagement metrics based on severity & source
function generateEngagement(handle, isNoise = false) {
  const profile = ACCOUNT_PROFILES[handle];
  const followers = profile?.followerCount || 100;

  if (isNoise) {
    // Noise tweets get low or spammy engagement
    return {
      likes: Math.floor(Math.random() * 15),
      retweets: Math.floor(Math.random() * 5),
      replies: Math.floor(Math.random() * 8),
      views: Math.floor(Math.random() * 500),
    };
  }

  // Real tweets: engagement scales with follower count
  const baseMultiplier = Math.log10(followers + 1) / 5;
  const viralChance = Math.random();

  let likes = Math.floor(followers * baseMultiplier * (0.02 + Math.random() * 0.08));
  let retweets = Math.floor(likes * (0.2 + Math.random() * 0.4));
  let replies = Math.floor(likes * (0.05 + Math.random() * 0.15));
  let views = Math.floor(likes * (5 + Math.random() * 15));

  // Occasional viral spike
  if (viralChance > 0.85) {
    const multiplier = 3 + Math.random() * 7;
    likes = Math.floor(likes * multiplier);
    retweets = Math.floor(retweets * multiplier);
    replies = Math.floor(replies * multiplier * 0.5);
    views = Math.floor(views * multiplier);
  }

  return { likes, retweets, replies, views };
}

let tweetIndex = 0;
let noiseCounter = 0;

function generateTweet() {
  // Mix in noise tweets: roughly 1 in 5 tweets is noise
  const isNoiseTweet = Math.random() < 0.2;

  if (isNoiseTweet) {
    const template = NOISE_TEMPLATES[noiseCounter % NOISE_TEMPLATES.length];
    noiseCounter++;

    const handle = NOISE_HANDLES[Math.floor(Math.random() * NOISE_HANDLES.length)];
    const source = SOURCES[Math.floor(Math.random() * SOURCES.length)];
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
      isNoise: true,
      engagement: generateEngagement(handle, true),
      accountMeta: ACCOUNT_PROFILES[handle] || { isVerified: false, followerCount: 50, accountAgeDays: 10 },
    };
  }

  const template = TWEET_TEMPLATES[tweetIndex % TWEET_TEMPLATES.length];
  tweetIndex++;

  const handle = HANDLES[Math.floor(Math.random() * HANDLES.length)];
  const source = SOURCES[Math.floor(Math.random() * SOURCES.length)];
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
    isNoise: false,
    engagement: generateEngagement(handle, false),
    accountMeta: ACCOUNT_PROFILES[handle] || { isVerified: false, followerCount: 1000, accountAgeDays: 365 },
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
    // 15% noise in historical data
    const isNoise = Math.random() < 0.15;
    const templatePool = isNoise ? NOISE_TEMPLATES : TWEET_TEMPLATES;
    const template = templatePool[i % templatePool.length];
    const handlePool = isNoise ? NOISE_HANDLES : HANDLES;
    const handle = handlePool[Math.floor(Math.random() * handlePool.length)];
    const source = SOURCES[Math.floor(Math.random() * SOURCES.length)];

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
      isNoise: isNoise,
      engagement: generateEngagement(handle, isNoise),
      accountMeta: ACCOUNT_PROFILES[handle] || { isVerified: false, followerCount: 500, accountAgeDays: 180 },
    });
  }

  return tweets.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
}

export { generateTweet, generateHistoricalBatch, TWEET_TEMPLATES, NOISE_TEMPLATES, ACCOUNT_PROFILES };


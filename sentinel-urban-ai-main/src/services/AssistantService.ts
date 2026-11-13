import { LocationService, ResolvedLocation } from "./LocationService";
import { ZONES } from "@/data/mockZones";
import { RiskService } from "./RiskService";

export interface AssistantCitation {
  sourceName: string;
  timestamp: string;
  url?: string;
  type: "live_weather" | "pune_suhi_dataset" | "geocoding_api" | "model_inference";
}

export interface AssistantMessage {
  id: string;
  role: "user" | "assistant";
  text: string;
  timestamp: string;
  resolvedLocation?: ResolvedLocation;
  citations?: AssistantCitation[];
  options?: string[];
  isError?: boolean;
}

export type SupportedLanguage = "en" | "hi" | "mr";

interface ChatContext {
  lastLocation: ResolvedLocation | null;
  lastQuery: string;
  language: SupportedLanguage;
}

export class AssistantService {
  private static context: ChatContext = {
    lastLocation: null,
    lastQuery: "",
    language: "en",
  };

  /**
   * Normalises text by removing markdown (**, *, backticks) and extra whitespace
   */
  static normalizeText(text: string): string {
    if (!text) return "";
    return text
      .replace(/[*_`#]+/g, "")
      .replace(/\s+/g, " ")
      .trim();
  }

  /**
   * Detects language (en, hi, mr) based on script or keywords
   */
  static detectLanguage(text: string): SupportedLanguage {
    const lower = text.toLowerCase();
    // Check for Devanagari script
    const hasDevanagari = /[\u0900-\u097F]/.test(text);
    if (hasDevanagari) {
      if (lower.includes("आहे") || lower.includes("पुण्यात") || lower.includes("उष्णतेचा") || lower.includes("नमस्कार") || lower.includes("कसे")) {
        return "mr";
      }
      return "hi";
    }
    return "en";
  }

  /**
   * Processes typed or spoken user query and returns structured assistant response supporting EN, HI, MR
   */
  static async processQuery(queryText: string): Promise<AssistantMessage> {
    const normalised = this.normalizeText(queryText);
    const lower = normalised.toLowerCase();
    const lang = this.detectLanguage(normalised);
    this.context.language = lang;
    this.context.lastQuery = normalised;

    const nowStr = new Date().toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" });

    // 1. Greetings
    if (/^(hi|hello|hey|helo|greetings|yo|sup|नमस्ते|नमस्कार|कैसे हो|कसे आहात)/i.test(lower)) {
      let greetingText = "Hello! 👋 Welcome to UrbanSenseAI. How can I help you today?";
      if (lang === "hi") {
        greetingText = "नमस्ते! 🙏 UrbanSenseAI में आपका स्वागत है। मैं आपकी क्या सहायता कर सकता हूँ?";
      } else if (lang === "mr") {
        greetingText = "नमस्कार! 🙏 UrbanSenseAI मध्ये तुमचे स्वागत आहे. मी तुम्हाला कशी मदत करू शकतो?";
      }

      return {
        id: `asst-${Date.now()}`,
        role: "assistant",
        text: greetingText,
        timestamp: nowStr,
        citations: [{ sourceName: "UrbanSenseAI System Assistant", timestamp: nowStr, type: "model_inference" }],
        options: lang === "hi" ? ["भायंदर में गर्मी का खतरा", "मुंबई का मौसम", "प्राथमिकता क्षेत्र"] : lang === "mr" ? ["भाईंदरमधील उष्णतेचा धोका", "मुंबईचे हवामान", "प्राधान्य विभाग"] : ["Heat Risk in Bhayandar", "Weather in Mumbai", "Priority Wards"],
      };
    }

    // 2. Courtesies & Thanks
    if (/^(thanks|thank you|thx|धन्यवाद|आभार|खूप आभारी)/i.test(lower)) {
      let thanksText = "You're welcome! Let me know if you need information on any specific ward or city.";
      if (lang === "hi") thanksText = "आपका स्वागत है! यदि आपको किसी वार्ड या शहर के बारे में जानकारी चाहिए, तो बताएं।";
      if (lang === "mr") thanksText = "तुमचे स्वागत आहे! कोणत्याही वॉर्ड किंवा शहराबद्दल माहिती हवी असल्यास सांगा.";

      return {
        id: `asst-${Date.now()}`,
        role: "assistant",
        text: thanksText,
        timestamp: nowStr,
      };
    }

    // 3. Follow-up Contextual queries ("What about Mumbai?", "Which one is higher?", "Will it be hotter tomorrow?")
    if (
      (lower.startsWith("what about") || lower.startsWith("how about") || lower.startsWith("और") || lower.startsWith("अनि")) &&
      this.context.lastLocation
    ) {
      // Extract new location from follow-up query
      const newLocKeyword = this.extractLocationKeyword(normalised);
      if (newLocKeyword) {
        return this.fetchLocationIntelligence(newLocKeyword, nowStr, lang);
      }
    }

    // Comparison / Higher query
    if ((lower.includes("higher") || lower.includes("compare") || lower.includes("अधिक") || lower.includes("तुलना")) && this.context.lastLocation) {
      const matchedZone = ZONES.find((z) => z.name.toLowerCase().includes(this.context.lastLocation!.name.toLowerCase()));
      if (matchedZone) {
        const assessment = RiskService.assessZoneSync(matchedZone);
        return {
          id: `asst-${Date.now()}`,
          role: "assistant",
          text: `📊 **Comparative Analysis for ${this.context.lastLocation.name}:**\n• Risk Score: ${assessment.riskScore}/100 (${assessment.level.toUpperCase()})\n• Population Density: ${matchedZone.populationDensity.toLocaleString()} /km²\n• Vulnerability Index: ${matchedZone.vulnerabilityIndex}`,
          timestamp: nowStr,
        };
      }
    }

    // 4. Extract Location Keyword
    const locationKeyword = this.extractLocationKeyword(normalised);

    if (!locationKeyword) {
      return this.generateTopicAnswer(normalised, nowStr, lang);
    }

    return this.fetchLocationIntelligence(locationKeyword, nowStr, lang);
  }

  private static async fetchLocationIntelligence(locationKeyword: string, nowStr: string, lang: SupportedLanguage): Promise<AssistantMessage> {
    let resolvedLoc: ResolvedLocation | null = null;
    const lowerKw = locationKeyword.toLowerCase();

    if (lowerKw === "my area" || lowerKw === "my location" || lowerKw === "near me" || lowerKw === "मेरा क्षेत्र" || lowerKw === "माझे क्षेत्र") {
      try {
        resolvedLoc = await LocationService.getUserCurrentLocation();
      } catch {
        resolvedLoc = await LocationService.resolveLocation("Pune");
      }
    } else {
      resolvedLoc = await LocationService.resolveLocation(locationKeyword);
    }

    if (!resolvedLoc) {
      const errText = lang === "hi"
        ? `मुझे **"${locationKeyword}"** से मेल खाता कोई स्थान नहीं मिला। कृपया एक वैध शहर या वार्ड का नाम दर्ज करें।`
        : lang === "mr"
        ? `मला **"${locationKeyword}"** शी जुळणारे स्थान आढळले नाही. कृपया वैध शहर किंवा वॉर्डचे नाव प्रविष्ट करा.`
        : `I couldn't find a location matching **"${locationKeyword}"**. Please enter a valid city or ward name.`;

      return {
        id: `asst-${Date.now()}`,
        role: "assistant",
        text: errText,
        timestamp: nowStr,
        isError: true,
      };
    }

    this.context.lastLocation = resolvedLoc;

    // Fetch Live Weather
    let liveWeather: { temp: number; humidity: number; windSpeed: number; rain: number; time: string } | null = null;
    try {
      const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${resolvedLoc.latitude}&longitude=${resolvedLoc.longitude}&current=temperature_2m,relative_humidity_2m,rain,wind_speed_10m&timezone=auto`;
      const res = await fetch(weatherUrl);
      if (res.ok) {
        const json = await res.json();
        const cur = json.current;
        liveWeather = {
          temp: Math.round(cur.temperature_2m * 10) / 10,
          humidity: Math.round(cur.relative_humidity_2m),
          windSpeed: Math.round(cur.wind_speed_10m * 10) / 10,
          rain: cur.rain || 0,
          time: new Date(cur.time).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" }),
        };
      }
    } catch (e) {
      console.warn("Weather fetch error", e);
    }

    const matchedZone = ZONES.find(
      (z) =>
        z.name.toLowerCase().includes(resolvedLoc!.name.toLowerCase()) ||
        z.ward.toLowerCase().includes(resolvedLoc!.name.toLowerCase()) ||
        resolvedLoc!.name.toLowerCase().includes(z.name.toLowerCase()),
    );

    const citations: AssistantCitation[] = [];
    if (liveWeather) {
      citations.push({
        sourceName: "Open-Meteo Live Weather API",
        timestamp: liveWeather.time || nowStr,
        url: "https://open-meteo.com/",
        type: "live_weather",
      });
    }

    if (matchedZone) {
      citations.push({
        sourceName: "UrbanSenseAI Pune SUHI Sensor Dataset v1.0.4",
        timestamp: "Live Ingestion",
        type: "pune_suhi_dataset",
      });

      const assessment = RiskService.assessZoneSync(matchedZone);

      let text = `📍 **Location Resolved:** ${resolvedLoc.formattedAddress}

🌡️ **Live Ambient Weather:** ${liveWeather ? `${liveWeather.temp}°C, Humidity: ${liveWeather.humidity}%, Wind: ${liveWeather.windSpeed} km/h` : "Weather data unavailable"}

🔥 **Urban Heat Island Index (SUHI):**
• **Risk Level:** ${assessment.level.toUpperCase()} (${assessment.riskScore}/100)
• **Priority Rank:** #${assessment.priorityRank} in Pune City
• **Model Confidence:** ${assessment.confidence}%
• **Canopy Cover:** ${matchedZone.vegetationPct}% | **Built-Up Density:** ${matchedZone.builtUpPct}%

💡 **Action Directive:**
${assessment.recommendation}`;

      if (lang === "hi") {
        text = `📍 **स्थान:** ${resolvedLoc.formattedAddress}

🌡️ **मौसम:** ${liveWeather ? `${liveWeather.temp}°C, आर्द्रता: ${liveWeather.humidity}%` : "मौसम डेटा उपलब्ध नहीं"}

🔥 **गर्मी का खतरा (SUHI):**
• **जोखिम स्तर:** ${assessment.level.toUpperCase()} (${assessment.riskScore}/100)
• **प्राथमिकता रैंक:** #${assessment.priorityRank}
• **सिफारिश:** ${assessment.recommendation}`;
      } else if (lang === "mr") {
        text = `📍 **स्थान:** ${resolvedLoc.formattedAddress}

🌡️ **हवामान:** ${liveWeather ? `${liveWeather.temp}°C, आर्द्रता: ${liveWeather.humidity}%` : "हवामान डेटा अनुपलब्ध"}

🔥 **उष्णतेचा धोका (SUHI):**
• **धोका पातळी:** ${assessment.level.toUpperCase()} (${assessment.riskScore}/100)
• **प्राधान्य क्रमांक:** #${assessment.priorityRank}
• **शिफारस:** ${assessment.recommendation}`;
      }

      return {
        id: `asst-${Date.now()}`,
        role: "assistant",
        text,
        timestamp: nowStr,
        resolvedLocation: resolvedLoc,
        citations,
        options: ["View on Map", "Counterfactual Analysis", "Compare Nearby Wards"],
      };
    } else {
      let text = `📍 **Location Resolved:** ${resolvedLoc.formattedAddress} (${resolvedLoc.latitude.toFixed(4)}, ${resolvedLoc.longitude.toFixed(4)})

🌡️ **Live Ambient Weather:**
${liveWeather ? `• **Current Temperature:** ${liveWeather.temp}°C\n• **Relative Humidity:** ${liveWeather.humidity}%\n• **Wind Speed:** ${liveWeather.windSpeed} km/h` : "• Live weather telemetry currently unavailable."}

⚠️ **Urban Heat Risk Coverage Status:**
UrbanSenseAI local microclimate heat-risk sensors are active for the Pune Metropolitan Area. Live heat-risk assessment for **${resolvedLoc.name}** is not in the active local dataset.`;

      if (lang === "hi") {
        text = `📍 **स्थान:** ${resolvedLoc.formattedAddress}\n🌡️ **वर्तमान तापमान:** ${liveWeather ? `${liveWeather.temp}°C` : "उपलब्ध नहीं"}\n\n⚠️ **नोट:** इस क्षेत्र के लिए स्थानीय हीट-रिस्क सेंसर डेटा उपलब्ध नहीं है।`;
      } else if (lang === "mr") {
        text = `📍 **स्थान:** ${resolvedLoc.formattedAddress}\n🌡️ **सध्याचे तापमान:** ${liveWeather ? `${liveWeather.temp}°C` : "उपलब्ध नाही"}\n\n⚠️ **टीप:** या क्षेत्रासाठी स्थानिक उष्णता-जोखम डेटा उपलब्ध नाही.`;
      }

      return {
        id: `asst-${Date.now()}`,
        role: "assistant",
        text,
        timestamp: nowStr,
        resolvedLocation: resolvedLoc,
        citations,
        options: ["Check Pune Wards", "Search Another Location", "View Regional Map"],
      };
    }
  }

  private static generateTopicAnswer(queryText: string, nowStr: string, lang: SupportedLanguage): AssistantMessage {
    const lower = queryText.toLowerCase();

    if (lower.includes("priority") || lower.includes("rank") || lower.includes("highest") || lower.includes("प्राथमिकता") || lower.includes("प्राधान्य")) {
      let text = `City priority ranking is calculated using a multi-criteria decision formula combining Hazard Severity, Population Exposure Index, Vulnerability Factor, and Historical Event Frequency.`;
      if (lang === "hi") text = `शहर की प्राथमिकता रैंकिंग खतरे की गंभीरता, जनसंख्या एक्सपोजर और भेद्यता कारक के आधार पर की जाती है।`;
      if (lang === "mr") text = `शहराची प्राधान्य मानांकन जोखीम तीव्रता, लोकसंख्या एक्सपोजर आणि भेद्यता घटकावर आधारित आहे.`;

      return {
        id: `asst-${Date.now()}`,
        role: "assistant",
        text,
        timestamp: nowStr,
        citations: [{ sourceName: "UrbanSenseAI Priority Engine", timestamp: nowStr, type: "model_inference" }],
        options: ["Shivajinagar Heat Risk", "Bhayandar Weather"],
      };
    }

    if (lower.includes("urban") || lower.includes("urbansense") || lower.includes("platform") || lower.includes("about")) {
      let text = `UrbanSenseAI is an explainable, confidence-aware urban environmental risk intelligence platform designed for urban analysts and city administrators.`;
      if (lang === "hi") text = `UrbanSenseAI शहरी विश्लेषकों और प्रशासकों के लिए एक उन्नत शहरी पर्यावरण जोखिम बुद्धिमत्ता मंच है।`;
      if (lang === "mr") text = `UrbanSenseAI हे शहरी विश्लेषक आणि प्रशासकांसाठी एक प्रगत शहरी पर्यावरणीय जोखीम बुद्धिमत्ता प्लॅटफॉर्म आहे.`;

      return {
        id: `asst-${Date.now()}`,
        role: "assistant",
        text,
        timestamp: nowStr,
      };
    }

    let defaultText = `I'm here to answer questions about live weather and urban heat risk. Please specify a ward, area, or city (e.g., "Bhayandar", "Shivajinagar", "Mumbai").`;
    if (lang === "hi") defaultText = `मैं लाइव मौसम और शहरी गर्मी के जोखिम के बारे में प्रश्नों के उत्तर देने के लिए यहाँ हूँ। कृपया कोई वार्ड या शहर बताएं (जैसे "भायंदर", "मुंबई")।`;
    if (lang === "mr") defaultText = `मी लाईव्ह हवामान आणि शहरी उष्णतेच्या धोक्याबद्दलच्या प्रश्नांची उत्तरे देण्यासाठी येथे आहे. कृपया एखादा वॉर्ड किंवा शहर सांगा (उदा. "भाईंदर", "मुंबई").`;

    return {
      id: `asst-${Date.now()}`,
      role: "assistant",
      text: defaultText,
      timestamp: nowStr,
      options: ["Heat Risk in Bhayandar", "Temperature in Shivajinagar", "Priority Ranking"],
    };
  }

  private static extractLocationKeyword(text: string): string | null {
    const normalised = this.normalizeText(text);
    const lower = normalised.toLowerCase();

    const stopWords = new Set([
      "hi", "hello", "hey", "helo", "yo", "greetings", "help", "thanks", "thank", "thx",
      "ok", "okay", "yes", "no", "sure", "cool", "great", "who", "what", "why", "how",
      "where", "when", "is", "are", "test", "demo", "bye", "goodbye", "user", "admin",
      "analyst", "status", "data", "model", "system", "में", "का", "की", "के", "क्या",
      "कितना", "है", "मौसम", "हवामान", "उष्णता", "गर्मी", "धोका", "खतरा", "ते",
    ]);

    // Match patterns like "in Bhayandar", "भायंदर में", "भाईंदरमध्ये"
    const match = lower.match(/(?:in|at|near|for|around|में|में|के|मध्ये|त)\s+([a-zA-Z\u0900-\u097F0-9\s,-]+)/);
    if (match && match[1]) {
      const place = match[1]
        .replace(/(?:today|now|right now|currently|heat risk|temperature|weather|गर्मी का खतरा|उष्णतेचा धोका|तापमान|\?|!)+/gi, "")
        .trim();
      if (place.length >= 2 && !stopWords.has(place.toLowerCase())) return place;
    }

    const knownPlaces = [
      "bhayandar", "shivajinagar", "kothrud", "aundh", "hadapsar", "bhawani peth",
      "pune", "mumbai", "delhi", "bangalore", "london", "tokyo", "भायंदर", "भाईंदर",
      "मुंबई", "पुणे", "दिल्ली", "शिवजीनगर", "कोथरूड", "औंध",
    ];

    for (const p of knownPlaces) {
      if (lower.includes(p)) return p;
    }

    const words = normalised.replace(/[?!.,]/g, "").trim().split(/\s+/);
    if (words.length <= 3 && !stopWords.has(words[0].toLowerCase())) {
      return words.join(" ");
    }

    return null;
  }
}

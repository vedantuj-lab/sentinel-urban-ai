import { useState, useEffect, useMemo, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Brain,
  X,
  Send,
  Sparkles,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Trash2,
  MapPin,
  ExternalLink,
  Info,
  Loader2,
  Globe,
  Radio,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useLocation } from "@tanstack/react-router";
import { AssistantService, AssistantMessage } from "@/services/AssistantService";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export function Copilot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<AssistantMessage[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Speech Recognition (Voice Input)
  const [isListening, setIsListening] = useState(false);
  const [speechSupported, setSpeechSupported] = useState(false);
  const recognitionRef = useRef<any>(null);

  // Text-To-Speech (Voice Output)
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [autoSpeak, setAutoSpeak] = useState(false);

  const location = useLocation();
  const chatBottomRef = useRef<HTMLDivElement>(null);

  // Context label based on active route
  const pageContext = useMemo(() => {
    const path = location.pathname;
    if (path.includes("/analyst")) return "Urban Analyst Workspace";
    if (path.includes("/admin")) return "Administrator Command Centre";
    if (path.includes("/map")) return "Interactive SUHI Heat Risk Map";
    return "UrbanSense Intelligence Platform";
  }, [location.pathname]);

  // Initialise Speech Recognition & initial message
  useEffect(() => {
    if (typeof window !== "undefined") {
      const SpeechRecognition =
        (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        setSpeechSupported(true);
        const rec = new SpeechRecognition();
        rec.continuous = false;
        rec.interimResults = true;
        rec.lang = "en-US";

        rec.onresult = (event: any) => {
          let transcript = "";
          for (let i = event.resultIndex; i < event.results.length; i++) {
            transcript += event.results[i][0].transcript;
          }
          setInputValue(transcript);
        };

        rec.onerror = (event: any) => {
          console.warn("Speech recognition error:", event.error);
          setIsListening(false);
          if (event.error === "not-allowed") {
            toast.error("Microphone permission denied. Type your query instead.");
          }
        };

        rec.onend = () => {
          setIsListening(false);
        };

        recognitionRef.current = rec;
      }
    }

    if (messages.length === 0) {
      setMessages([
        {
          id: "init-1",
          role: "assistant",
          text: `👋 **UrbanSense Copilot Online** (${pageContext})

Ask me location-based heat risk or weather questions anywhere in the world:
• *"What is the heat risk in Shivajinagar?"*
• *"What is the current temperature in Bhayandar?"*
• *"What is the weather in London?"*`,
          timestamp: new Date().toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" }),
          citations: [
            {
              sourceName: "Open-Meteo Live API",
              timestamp: "Active",
              url: "https://open-meteo.com/",
              type: "live_weather",
            },
            {
              sourceName: "Pune SUHI Dataset v1.0.4",
              timestamp: "Active",
              type: "pune_suhi_dataset",
            },
          ],
          options: ["Heat Risk in Bhayandar", "Temperature in Pune", "Analyst Workspace"],
        },
      ]);
    }
  }, [pageContext]);

  // Scroll to bottom on new messages
  useEffect(() => {
    if (isOpen) {
      chatBottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isOpen, isLoading]);

  // Handle Speech Recognition Toggle
  const toggleListening = () => {
    if (!speechSupported) {
      toast.error("Speech recognition is not supported in this browser.");
      return;
    }

    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
    } else {
      try {
        setInputValue("");
        recognitionRef.current?.start();
        setIsListening(true);
        toast.info("Listening... Speak your location or question.");
      } catch (e) {
        console.error("Failed to start speech recognition", e);
        setIsListening(false);
      }
    }
  };

  // Text-To-Speech Read Aloud
  const speakText = (text: string) => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) {
      toast.error("Text-to-speech is not supported in this browser.");
      return;
    }

    window.speechSynthesis.cancel();

    // Clean markdown formatting for spoken text
    const clean = text
      .replace(/[*_#`]/g, "")
      .replace(/📍|🌡️|🔥|💡|📊|⚠️|👋/g, "")
      .replace(/https?:\/\/\S+/g, "");

    const utterance = new SpeechSynthesisUtterance(clean);
    utterance.rate = 1.0;
    utterance.pitch = 1.0;

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    window.speechSynthesis.speak(utterance);
  };

  const stopSpeaking = () => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  };

  // Handle Query Submission
  const handleSend = async (customQuery?: string) => {
    const query = (customQuery || inputValue).trim();
    if (!query || isLoading) return;

    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
    }

    const userMsg: AssistantMessage = {
      id: `usr-${Date.now()}`,
      role: "user",
      text: query,
      timestamp: new Date().toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputValue("");
    setIsLoading(true);

    try {
      const response = await AssistantService.processQuery(query);
      setMessages((prev) => [...prev, response]);

      if (autoSpeak) {
        speakText(response.text);
      }
    } catch (e: any) {
      toast.error("Failed to process query.");
      setMessages((prev) => [
        ...prev,
        {
          id: `err-${Date.now()}`,
          role: "assistant",
          text: `⚠️ Unable to complete request: ${e.message || "Network or service error"}. Please try again.`,
          timestamp: new Date().toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" }),
          isError: true,
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const clearChat = () => {
    stopSpeaking();
    setMessages([
      {
        id: `init-${Date.now()}`,
        role: "assistant",
        text: `Conversation cleared. Ask me about any location or urban heat risk area.`,
        timestamp: new Date().toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" }),
      },
    ]);
    toast.info("Conversation history reset.");
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ scale: 0, rotate: -45 }}
            animate={{ scale: 1, rotate: 0 }}
            exit={{ scale: 0, rotate: 45 }}
            onClick={() => setIsOpen(true)}
            className="h-16 w-16 rounded-[1.75rem] bg-gradient-to-tr from-[#7C3AED] via-[#9333EA] to-[#DB2777] text-white shadow-[0_0_30px_rgba(124,58,237,0.5)] flex items-center justify-center group hover:scale-105 transition-all border border-white/30"
            aria-label="Open AI Assistant"
          >
            <Brain className="h-8 w-8 group-hover:scale-110 transition-transform text-white" />
            <div className="absolute -top-1 -right-1 h-4 w-4 bg-emerald-400 rounded-full border-2 border-white animate-pulse" />
          </motion.button>
        )}

        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="w-[380px] sm:w-[440px] h-[620px] bg-slate-950 rounded-[2.5rem] shadow-[0_0_50px_rgba(0,0,0,0.8)] border border-white/20 overflow-hidden flex flex-col text-white"
          >
            {/* Assistant Header */}
            <div className="p-5 bg-slate-900 border-b border-white/10 relative overflow-hidden shrink-0">
              <div className="absolute inset-0 bg-gradient-to-r from-[#7C3AED]/20 to-[#DB2777]/20 pointer-events-none" />

              <div className="relative z-10 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-11 w-11 rounded-2xl bg-gradient-to-tr from-[#7C3AED] to-[#DB2777] text-white flex items-center justify-center shadow-lg border border-white/20">
                    <Brain className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-black uppercase tracking-wider editorial leading-tight text-white flex items-center gap-2">
                      UrbanSense AI Copilot
                    </h3>
                    <p className="text-[9px] font-mono text-emerald-400 flex items-center gap-1.5 mt-0.5">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                      Live Open-Meteo & SUHI Dataset
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-1">
                  {/* Speech output toggle */}
                  <button
                    type="button"
                    onClick={() => setAutoSpeak(!autoSpeak)}
                    className={cn(
                      "h-9 w-9 rounded-xl flex items-center justify-center transition-all border",
                      autoSpeak
                        ? "bg-[#7C3AED] text-white border-white/30"
                        : "bg-white/5 text-white/60 border-white/10 hover:text-white",
                    )}
                    title={autoSpeak ? "Auto-speech enabled" : "Enable auto-speech"}
                  >
                    {autoSpeak ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
                  </button>

                  {/* Clear chat */}
                  <button
                    type="button"
                    onClick={clearChat}
                    className="h-9 w-9 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-center text-white/60 hover:text-white transition-all"
                    title="Clear Conversation"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>

                  {/* Close button */}
                  <button
                    type="button"
                    onClick={() => setIsOpen(false)}
                    className="h-9 w-9 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-center text-white/60 hover:text-white transition-all"
                    title="Minimize Assistant"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Speaking Status Banner */}
            {isSpeaking && (
              <div className="px-5 py-2 bg-[#7C3AED]/30 border-b border-[#7C3AED]/40 flex items-center justify-between text-xs font-semibold text-purple-200">
                <span className="flex items-center gap-2">
                  <Radio className="h-3.5 w-3.5 text-purple-300 animate-pulse" />
                  Speaking response...
                </span>
                <button
                  onClick={stopSpeaking}
                  className="text-[10px] uppercase font-black tracking-widest px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-white"
                >
                  Stop
                </button>
              </div>
            )}

            {/* Chat Conversation History */}
            <div className="flex-1 overflow-y-auto p-5 space-y-5 scrollbar-thin scrollbar-thumb-white/10">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={cn(
                    "flex flex-col gap-2 max-w-[92%]",
                    msg.role === "user" ? "ml-auto items-end" : "mr-auto items-start",
                  )}
                >
                  <div
                    className={cn(
                      "p-4 rounded-2xl text-xs font-medium leading-relaxed shadow-md whitespace-pre-line",
                      msg.role === "user"
                        ? "bg-gradient-to-r from-[#7C3AED] to-[#9333EA] text-white rounded-tr-none font-semibold"
                        : msg.isError
                          ? "bg-rose-900/60 border border-rose-500/40 text-rose-100 rounded-tl-none"
                          : "bg-slate-900 border border-white/15 text-white/95 rounded-tl-none",
                    )}
                  >
                    {msg.text}
                  </div>

                  {/* Citations & Source Attribution */}
                  {msg.citations && msg.citations.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {msg.citations.map((c, i) => (
                        <span
                          key={i}
                          className="px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 text-[9px] font-mono font-semibold text-teal-300 flex items-center gap-1"
                        >
                          <Globe className="h-2.5 w-2.5" />
                          {c.sourceName} ({c.timestamp})
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Speak Aloud Control for Assistant Messages */}
                  {msg.role === "assistant" && !msg.isError && (
                    <button
                      onClick={() => speakText(msg.text)}
                      className="text-[10px] font-bold text-white/50 hover:text-white flex items-center gap-1 self-start ml-1 transition-colors"
                    >
                      <Volume2 className="h-3 w-3 text-[#7C3AED]" /> Read Aloud
                    </button>
                  )}

                  {/* Suggested Options */}
                  {msg.options && msg.options.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 pt-2">
                      {msg.options.map((opt) => (
                        <button
                          key={opt}
                          onClick={() => handleSend(opt)}
                          className="px-3 py-1.5 rounded-xl border border-white/15 bg-white/5 hover:bg-white/15 text-[10px] font-black uppercase tracking-wider text-purple-300 transition-all hover:scale-105"
                        >
                          {opt}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ))}

              {/* Loading Indicator */}
              {isLoading && (
                <div className="flex items-center gap-3 p-4 rounded-2xl bg-slate-900 border border-white/10 max-w-[80%]">
                  <Loader2 className="h-4 w-4 animate-spin text-[#7C3AED]" />
                  <span className="text-xs font-semibold text-white/70">
                    Resolving location & fetching live telemetry...
                  </span>
                </div>
              )}

              <div ref={chatBottomRef} />
            </div>

            {/* Input Bar & Controls */}
            <div className="p-4 border-t border-white/10 bg-slate-900/90">
              <div className="relative flex items-center gap-2">
                {/* Voice Input Microphone Button */}
                <button
                  type="button"
                  onClick={toggleListening}
                  className={cn(
                    "h-12 w-12 rounded-2xl border flex items-center justify-center shrink-0 transition-all",
                    isListening
                      ? "bg-rose-600 text-white border-rose-400 animate-pulse shadow-[0_0_15px_rgba(225,29,72,0.8)]"
                      : "bg-white/10 border-white/15 text-white/70 hover:text-white hover:bg-white/20",
                  )}
                  title={isListening ? "Stop Listening" : "Speak question"}
                >
                  {isListening ? <Mic className="h-5 w-5" /> : <MicOff className="h-5 w-5" />}
                </button>

                {/* Text Input Field */}
                <Input
                  id="assistant-query-input"
                  name="assistantQuery"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSend()}
                  placeholder={
                    isListening ? "Listening... speak now" : "Ask about Bhayandar, Shivajinagar..."
                  }
                  className="h-12 pl-4 pr-12 rounded-2xl border-white/20 bg-slate-950 text-white placeholder:text-white/40 text-xs font-medium focus-visible:ring-[#7C3AED]"
                />

                {/* Send Button */}
                <button
                  type="button"
                  onClick={() => handleSend()}
                  disabled={!inputValue.trim() || isLoading}
                  className="absolute right-2.5 h-8 w-8 rounded-xl bg-gradient-to-r from-[#7C3AED] to-[#DB2777] text-white flex items-center justify-center shadow-lg disabled:opacity-40 transition-all hover:scale-105"
                >
                  <Send className="h-3.5 w-3.5" />
                </button>
              </div>

              <div className="mt-2.5 flex items-center justify-between text-[9px] font-mono text-white/40 px-1">
                <span className="flex items-center gap-1">
                  <Sparkles className="h-3 w-3 text-[#7C3AED]" />
                  Global Geocoding & Open-Meteo Integration
                </span>
                <span>Context: {pageContext.split(" ")[0]}</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

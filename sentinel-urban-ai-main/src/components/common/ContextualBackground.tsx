import { useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLocation } from "@tanstack/react-router";

type Environment =
  "landing" | "heat" | "flood" | "air" | "analyst" | "field" | "admin" | "citizen" | "default";

const BACKGROUNDS: Record<Environment, string> = {
  landing:
    "https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?auto=format&fit=crop&q=80&w=2000",
  heat: "https://images.unsplash.com/photo-1523848309072-c081734f968a?auto=format&fit=crop&q=80&w=2000",
  flood:
    "https://images.unsplash.com/photo-1516912481808-34061f8bc9a2?auto=format&fit=crop&q=80&w=2000",
  air: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&q=80&w=2000",
  analyst:
    "https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?auto=format&fit=crop&q=80&w=2000",
  field:
    "https://images.unsplash.com/photo-1517733948473-efec927ec1be?auto=format&fit=crop&q=80&w=2000",
  admin:
    "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?auto=format&fit=crop&q=80&w=2000",
  citizen:
    "https://images.unsplash.com/photo-1518780664697-55e3ad937233?auto=format&fit=crop&q=80&w=2000",
  default:
    "https://images.unsplash.com/photo-1444723121867-7a241cacace9?auto=format&fit=crop&q=80&w=2000",
};

export function ContextualBackground() {
  const location = useLocation();

  const env = useMemo((): Environment => {
    const path = location.pathname;
    if (path === "/") return "landing";
    if (path.includes("/analyst")) return "analyst";
    if (path.includes("/admin")) return "admin";
    if (path.includes("/map")) return "analyst";
    return "default";
  }, [location.pathname]);

  return (
    <div className="fixed inset-0 -z-20 overflow-hidden pointer-events-none">
      <AnimatePresence mode="wait">
        <motion.div
          key={env}
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          className="absolute inset-0"
        >
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${BACKGROUNDS[env]})` }}
          />
          {/* Overlays for readability */}
          <div className="absolute inset-0 bg-background/80 backdrop-blur-[2px]" />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent" />

          {/* Grid Overlay */}
          <div className="absolute inset-0 grid-overlay opacity-20" />
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

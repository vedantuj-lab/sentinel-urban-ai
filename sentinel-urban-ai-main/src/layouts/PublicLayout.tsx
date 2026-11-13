import { Link } from "@tanstack/react-router";
import { Shield, Menu, X, ArrowRight, Sparkles } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface Props {
  children: React.ReactNode;
}

export function PublicLayout({ children }: Props) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { name: "About", href: "/about" },
    { name: "How It Works", href: "/how-it-works" },
    { name: "Risk Intelligence", href: "/risk-intelligence" },
  ];

  return (
    <div className="flex min-h-screen flex-col bg-[#0B0F19] text-white overflow-x-hidden selection:bg-[#7C3AED] selection:text-white">
      {/* Header Bar */}
      <header className="sticky top-0 z-50 border-b border-white/10 bg-[#0B0F19]/80 backdrop-blur-xl">
        <nav
          className="mx-auto flex max-w-7xl items-center justify-between p-4 lg:px-8"
          aria-label="Global"
        >
          <div className="flex lg:flex-1">
            <Link
              to="/"
              className="-m-1.5 flex items-center gap-3 p-1.5 transition-all hover:opacity-95 group"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-tr from-[#7C3AED] to-[#DB2777] text-white shadow-[0_0_20px_rgba(124,58,237,0.5)] transition-transform group-hover:scale-105">
                <Shield className="h-5 w-5 text-white" />
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-black tracking-tight text-white uppercase leading-none">
                  UrbanSense <span className="text-[#DB2777]">AI</span>
                </span>
                <span className="text-[8px] font-black uppercase tracking-[0.3em] text-white/40 block mt-0.5">
                  Urban Risk Intelligence
                </span>
              </div>
            </Link>
          </div>

          <div className="flex lg:hidden">
            <button
              type="button"
              className="-m-2.5 inline-flex items-center justify-center rounded-xl p-2.5 text-white hover:bg-white/10"
              onClick={() => setMobileMenuOpen(true)}
            >
              <span className="sr-only">Open main menu</span>
              <Menu className="h-6 w-6" aria-hidden="true" />
            </button>
          </div>

          <div className="hidden lg:flex lg:gap-x-10 items-center">
            {navLinks.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className="text-xs font-bold uppercase tracking-widest text-white/70 transition-colors hover:text-[#7C3AED]"
                activeProps={{ className: "text-[#7C3AED] font-black" }}
              >
                {item.name}
              </Link>
            ))}
          </div>

          <div className="hidden lg:flex lg:flex-1 lg:justify-end lg:items-center lg:gap-x-4">
            <Button
              variant="ghost"
              className="text-xs font-black uppercase tracking-widest text-white/80 hover:text-white hover:bg-white/10 rounded-xl px-5 h-11"
              asChild
            >
              <Link to="/login">Sign In</Link>
            </Button>
            <Button
              className="text-xs font-black uppercase tracking-[0.2em] bg-gradient-to-r from-[#7C3AED] via-[#9333EA] to-[#DB2777] text-white hover:opacity-95 shadow-[0_0_25px_rgba(124,58,237,0.4)] rounded-xl px-6 h-11 border border-white/20 transition-all hover:scale-105"
              asChild
            >
              <Link to="/map" className="flex items-center gap-2">
                Explore Map
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </Button>
          </div>
        </nav>

        {/* Mobile menu */}
        <div className={cn("lg:hidden", mobileMenuOpen ? "fixed inset-0 z-50" : "hidden")}>
          <div
            className="fixed inset-0 bg-[#0B0F19]/90 backdrop-blur-md"
            onClick={() => setMobileMenuOpen(false)}
          />
          <div className="fixed inset-y-0 right-0 z-50 w-full overflow-y-auto bg-[#111827] px-6 py-6 sm:max-w-sm border-l border-white/10">
            <div className="flex items-center justify-between">
              <Link to="/" className="-m-1.5 flex items-center gap-2.5 p-1.5">
                <Shield className="h-7 w-7 text-[#7C3AED]" />
                <span className="text-lg font-black text-white uppercase">UrbanSense AI</span>
              </Link>
              <button
                type="button"
                className="-m-2.5 rounded-xl p-2.5 text-white hover:bg-white/10"
                onClick={() => setMobileMenuOpen(false)}
                aria-label="Close menu"
              >
                <X className="h-6 w-6" aria-hidden="true" />
              </button>
            </div>
            <div className="mt-8 flow-root">
              <div className="-my-6 divide-y divide-white/10">
                <div className="space-y-3 py-6">
                  {navLinks.map((item) => (
                    <Link
                      key={item.name}
                      to={item.href}
                      className="block rounded-xl px-4 py-3 text-sm font-bold uppercase tracking-wider text-white/80 hover:bg-white/5 hover:text-white"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      {item.name}
                    </Link>
                  ))}
                </div>
                <div className="py-6 space-y-3">
                  <Link
                    to="/login"
                    className="block rounded-xl px-4 py-3 text-sm font-black uppercase tracking-wider text-white hover:bg-white/5"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Sign In
                  </Link>
                  <Button
                    className="w-full h-12 rounded-xl bg-gradient-to-r from-[#7C3AED] to-[#DB2777] text-white font-black uppercase tracking-widest"
                    asChild
                  >
                    <Link to="/map" onClick={() => setMobileMenuOpen(false)}>
                      Explore Risk Map
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-grow">{children}</main>

      {/* Futuristic Footer */}
      <footer className="border-t border-white/10 bg-[#070A12] py-16 text-white relative">
        <div className="absolute inset-0 grid-overlay opacity-10 pointer-events-none" />
        <div className="mx-auto max-w-7xl px-6 lg:px-8 relative z-10">
          <div className="flex flex-col items-center justify-between gap-8 md:flex-row">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-2xl bg-[#7C3AED]/20 border border-[#7C3AED]/40 flex items-center justify-center text-[#7C3AED]">
                <Shield className="h-5 w-5" />
              </div>
              <div>
                <span className="text-lg font-black tracking-tight text-white uppercase block">
                  UrbanSense <span className="text-[#DB2777]">AI</span>
                </span>
                <span className="text-[9px] font-black uppercase tracking-[0.3em] text-white/40 block">
                  Urban Risk Intelligence Platform
                </span>
              </div>
            </div>

            <div className="text-center md:text-left">
              <p className="text-xs font-semibold text-white/60">
                © 2026 UrbanSense AI Platform. Actionable Urban Environmental Risk Decision-Support.
              </p>
              <p className="text-[9px] font-black text-[#F59E0B] uppercase tracking-[0.25em] mt-1">
                Urban Heat Risk Model v1.0.4 • Confidential Research & Intelligence
              </p>
            </div>

            <div className="flex gap-6 text-xs font-bold uppercase tracking-wider text-white/60">
              <Link to="/archive" className="hover:text-[#7C3AED] transition-colors">
                Archive
              </Link>
              <Link to="/about" className="hover:text-[#7C3AED] transition-colors">
                Privacy
              </Link>
              <Link to="/about" className="hover:text-[#7C3AED] transition-colors">
                Terms
              </Link>
              <Link to="/about" className="hover:text-[#7C3AED] transition-colors">
                Contact
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import {
  useAuth,
  DEMO_ACCOUNTS,
  ROLE_LABEL,
  ROLE_HOME,
  type Role as UserRole,
} from "@/auth/auth-context";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { motion, AnimatePresence } from "framer-motion";
import { Shield, Loader2, BarChart3, Command, Lock, Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/login")({
  component: LoginPage,
});

const ROLE_CONFIG: Record<
  "analyst" | "admin",
  {
    title: string;
    desc: string;
    defaultEmail: string;
    icon: any;
    gradient: string;
  }
> = {
  analyst: {
    title: "Urban Analyst",
    desc: "Observe urban telemetry, analyze environmental heat risks, and evaluate priority decision frameworks.",
    defaultEmail: "analyst@urbansense.ai",
    icon: BarChart3,
    gradient: "from-purple-600 to-indigo-600",
  },
  admin: {
    title: "Administrator",
    desc: "Manage data sources, run dataset validation, configure regional weights, and audit model status.",
    defaultEmail: "admin@urbansense.ai",
    icon: Command,
    gradient: "from-pink-600 to-rose-600",
  },
};

function LoginPage() {
  const { signIn } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [selectedRole, setSelectedRole] = useState<"analyst" | "admin">("analyst");
  const [email, setEmail] = useState("analyst@urbansense.ai");
  const [password, setPassword] = useState("demo1234");
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    const account = DEMO_ACCOUNTS.find((a) => a.user.role === selectedRole);
    if (account) {
      setEmail(account.email);
      setPassword(account.password);
    }
  }, [selectedRole]);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const user = await signIn(email, password);
      toast.success(`Authenticated as ${user.name} (${ROLE_LABEL[user.role]})`);
      navigate({ to: ROLE_HOME[user.role] });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Authentication failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-[#111827] text-white overflow-hidden relative">
      {/* Background Futuristic Heat Visualization Glow */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-[#7C3AED]/20 via-[#DB2777]/10 to-[#111827] pointer-events-none" />
      <div className="absolute inset-0 grid-overlay opacity-10 pointer-events-none" />

      {/* Left Column: Form */}
      <div className="flex flex-1 flex-col justify-center px-6 py-12 lg:px-20 z-10 relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="sm:mx-auto sm:w-full sm:max-w-md relative"
        >
          <Link to="/" className="flex items-center gap-3 mb-10 group w-fit">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#7C3AED] text-white shadow-[0_0_20px_rgba(124,58,237,0.4)] transition-transform group-hover:scale-105">
              <Shield className="h-6 w-6" />
            </div>
            <div>
              <span className="text-xl font-black tracking-tight text-white uppercase block">
                UrbanSense <span className="text-[#DB2777]">AI</span>
              </span>
              <span className="text-[9px] font-black uppercase tracking-[0.3em] text-white/40 block">
                Urban Risk Intelligence
              </span>
            </div>
          </Link>

          <div className="space-y-2 mb-8">
            <h2 className="text-3xl font-black tracking-tight text-white uppercase editorial leading-tight">
              Platform Authentication
            </h2>
            <p className="text-xs font-semibold text-white/60">
              Select your role to access urban risk analytics or administrative controls.
            </p>
          </div>

          {/* Role Selector Tabs */}
          <div className="grid grid-cols-2 gap-3 mb-8 p-1.5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md">
            {(["analyst", "admin"] as const).map((r) => {
              const active = selectedRole === r;
              const cfg = ROLE_CONFIG[r];
              const Icon = cfg.icon;
              return (
                <button
                  key={r}
                  type="button"
                  onClick={() => setSelectedRole(r)}
                  className={`flex items-center justify-center gap-2.5 py-3.5 px-4 rounded-xl font-black text-xs uppercase tracking-wider transition-all ${
                    active
                      ? `bg-gradient-to-r ${cfg.gradient} text-white shadow-lg`
                      : "text-white/50 hover:text-white hover:bg-white/5"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {cfg.title}
                </button>
              );
            })}
          </div>

          {/* Form Card */}
          <div className="p-8 rounded-[2rem] bg-white/[0.03] border border-white/10 backdrop-blur-xl shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#7C3AED] to-[#DB2777]" />

            <form className="space-y-6" onSubmit={handleSignIn}>
              <div className="space-y-2">
                <Label
                  htmlFor="email"
                  className="text-[10px] font-black uppercase tracking-[0.25em] text-[#7C3AED]"
                >
                  Account Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="user@urbansense.ai"
                  className="h-12 rounded-xl border-white/10 bg-white/5 text-white placeholder:text-white/30 focus:border-[#7C3AED] focus:ring-[#7C3AED]/20 transition-all font-semibold text-xs"
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label
                    htmlFor="password"
                    className="text-[10px] font-black uppercase tracking-[0.25em] text-[#7C3AED]"
                  >
                    Password
                  </Label>
                  <button
                    type="button"
                    onClick={() => toast.info("Test password pre-filled: demo1234")}
                    className="text-[9px] font-black text-white/40 hover:text-[#DB2777] uppercase tracking-wider"
                  >
                    Forgot Password?
                  </button>
                </div>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="h-12 rounded-xl border-white/10 bg-white/5 text-white placeholder:text-white/30 focus:border-[#7C3AED] focus:ring-[#7C3AED]/20 transition-all font-semibold text-xs pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <Button
                type="submit"
                size="lg"
                className="w-full h-14 rounded-2xl text-xs font-black uppercase tracking-[0.3em] bg-gradient-to-r from-[#7C3AED] to-[#DB2777] hover:opacity-95 text-white shadow-[0_0_25px_rgba(124,58,237,0.4)] transition-all"
                disabled={loading}
              >
                {loading ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : "SIGN IN"}
              </Button>
            </form>

            <div className="mt-6 pt-6 border-t border-white/10 text-center">
              <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest">
                Active Role:{" "}
                <span className="text-white font-black">{ROLE_CONFIG[selectedRole].title}</span>
              </span>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Right Column: Immersive Visualization */}
      <div className="hidden lg:flex lg:flex-1 relative overflow-hidden bg-gradient-to-br from-[#111827] via-[#1F2937] to-[#111827]">
        <AnimatePresence mode="wait">
          <motion.div
            key={selectedRole}
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="absolute inset-0"
          >
            <div
              className="absolute inset-0 bg-cover bg-center opacity-40 mix-blend-luminosity scale-105 transition-transform duration-[10s]"
              style={{
                backgroundImage:
                  selectedRole === "analyst"
                    ? "url('https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?auto=format&fit=crop&q=80&w=2000')"
                    : "url('https://images.unsplash.com/photo-1449824913935-59a10b8d2000?auto=format&fit=crop&q=80&w=2000')",
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-r from-[#111827] via-transparent to-transparent opacity-90" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(124,58,237,0.25),transparent_70%)]" />

            {/* Context Details */}
            <div className="absolute bottom-20 left-20 right-20 z-20">
              <div className="max-w-lg space-y-6">
                <div className="h-16 w-16 rounded-3xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white shadow-2xl">
                  {(() => {
                    const Icon = ROLE_CONFIG[selectedRole].icon;
                    return <Icon className="h-8 w-8 text-[#7C3AED]" />;
                  })()}
                </div>
                <h3 className="text-4xl font-black text-white leading-tight uppercase editorial">
                  {ROLE_CONFIG[selectedRole].title} <span className="text-[#DB2777]">Portal</span>
                </h3>
                <p className="text-base text-white/70 font-medium leading-relaxed">
                  {ROLE_CONFIG[selectedRole].desc}
                </p>

                <div className="p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md flex items-center gap-4">
                  <Lock className="h-5 w-5 text-[#7C3AED] shrink-0" />
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-white/50">
                      Security Notice
                    </p>
                    <p className="text-xs font-semibold text-white/80">
                      Role-gated access with session verification and audit logging.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

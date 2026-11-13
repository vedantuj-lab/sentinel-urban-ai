import { Link, useNavigate, useLocation } from "@tanstack/react-router";
import {
  Shield,
  LayoutDashboard,
  BarChart3,
  Map as MapIcon,
  Settings,
  LogOut,
  User,
  Bell,
  Search,
  Menu,
  ChevronRight,
  ClipboardList,
  Activity,
  AlertTriangle,
  FileText,
  Database,
  CheckCircle2,
  Cpu,
  Sliders,
  Users,
  Layers,
  TrendingUp,
  Zap,
  Sparkles,
  Globe,
  Brain,
} from "lucide-react";
import { useAuth, ROLE_LABEL, ROLE_HOME, type Role } from "@/auth/auth-context";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ZoneSearch } from "@/components/common/ZoneSearch";

interface Props {
  children: React.ReactNode;
  title?: string;
}

export function AppLayout({ children, title }: Props) {
  const { user, signOut, switchRole } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const isMapRoute = location.pathname === "/map";

  if (!user) return null;

  const handleSignOut = () => {
    signOut();
    navigate({ to: "/" });
  };

  const handleQuickSwitch = (role: Role) => {
    switchRole(role);
    navigate({ to: ROLE_HOME[role] });
  };

  const menuItems = {
    admin: [
      { name: "Overview", href: "/admin", icon: LayoutDashboard },
      { name: "Data Management", href: "/admin/data", icon: Database },
      { name: "Model Management", href: "/admin/models", icon: Cpu },
      { name: "System Operations", href: "/admin/operations", icon: Activity },
      { name: "User Management", href: "/admin/users", icon: Users },
      { name: "Settings", href: "/settings", icon: Settings },
    ],
    analyst: [
      { name: "Overview", href: "/analyst", icon: LayoutDashboard },
      { name: "Heat Risk Map", href: "/map", icon: MapIcon },
      { name: "Zone Analysis", href: "/analyst/analysis", icon: BarChart3 },
      { name: "Priorities & Recommendations", href: "/analyst/priorities", icon: Activity },
      { name: "Intervention Planner", href: "/analyst/interventions", icon: ClipboardList },
      { name: "Scenarios", href: "/analyst/scenarios", icon: Search },
    ],
  };

  const items = menuItems[user.role] || [];
  const lastUpdated = new Date().toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
  });

  const getFeatureBg = (path: string) => {
    if (path.includes("/analyst/analysis")) return "bg-[#EEF2FF]";
    if (path.includes("/analyst/priorities")) return "bg-[#FFF1F2]";
    if (path.includes("/analyst/interventions")) return "bg-[#ECFEFF]";
    if (path.includes("/analyst/scenarios")) return "bg-[#FAF5FF]";
    if (path.includes("/map")) return "bg-[#F5F3FF]";
    if (path.includes("/analyst")) return "bg-[#ECFDF5]";
    if (path.includes("/admin/data")) return "bg-[#F1F5F9]";
    if (path.includes("/admin/models")) return "bg-[#ECFDF5]";
    if (path.includes("/admin")) return "bg-[#EFF6FF]";
    return "bg-[#FAFAF5]";
  };

  const featureBgClass = getFeatureBg(location.pathname);

  return (
    <div className="flex h-screen overflow-hidden bg-background font-sans">
      {/* Cinematic Scanning Line */}
      <div className="fixed top-0 left-0 w-full h-[1px] bg-primary/20 z-[100] animate-sweep pointer-events-none" />

      {/* Sidebar */}
      <aside
        className={cn(
          "relative z-40 flex flex-col border-r border-sidebar-border bg-gradient-to-b from-[#111827] via-[#112E2D] to-[#123B3A] text-slate-100 transition-all duration-300 ease-in-out shadow-raised",
          sidebarOpen ? "w-64" : "w-20",
        )}
      >
        <div className="flex h-16 items-center justify-between px-4">
          <Link to="/" className="flex items-center gap-3 overflow-hidden">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground shadow-sm">
              <Shield className="h-6 w-6" />
            </div>
            {sidebarOpen && (
              <span className="text-xl font-bold tracking-tight whitespace-nowrap">
                UrbanSense<span className="text-sidebar-primary">AI</span>
              </span>
            )}
          </Link>
        </div>

        <nav className="flex-grow space-y-1 px-3 py-4 overflow-y-auto">
          {items.map((item) => (
            <Link
              key={item.name}
              to={item.href}
              className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground group"
              activeProps={{
                className: "bg-sidebar-accent text-sidebar-accent-foreground font-semibold",
              }}
            >
              <item.icon className="h-5 w-5 shrink-0" />
              {sidebarOpen && <span className="truncate">{item.name}</span>}
              {!sidebarOpen && (
                <div className="absolute left-full ml-2 hidden rounded bg-sidebar px-2 py-1 text-xs whitespace-nowrap group-hover:block border border-border z-50">
                  {item.name}
                </div>
              )}
            </Link>
          ))}
        </nav>

        <div className="border-t border-sidebar-border p-3">
          <Button
            variant="ghost"
            className="w-full justify-start gap-3 text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
            onClick={handleSignOut}
          >
            <LogOut className="h-5 w-5 shrink-0" />
            {sidebarOpen && <span>Sign Out</span>}
          </Button>
        </div>

        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="absolute -right-3 top-20 flex h-6 w-6 items-center justify-center rounded-full border border-border bg-background text-foreground shadow-sm hover:bg-accent"
          aria-label={sidebarOpen ? "Collapse sidebar" : "Expand sidebar"}
        >
          <ChevronRight
            className={cn("h-4 w-4 transition-transform", sidebarOpen ? "rotate-180" : "rotate-0")}
          />
        </button>
      </aside>

      {/* Main Content */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Header */}
        <header className="flex h-16 items-center justify-between border-b border-border bg-background px-6 lg:px-8">
          <div className="flex items-center gap-4">
            <h1 className="text-lg font-semibold tracking-tight text-foreground sm:text-xl">
              {title || ROLE_LABEL[user.role]}
            </h1>
          </div>

          <div className="flex items-center gap-4">
            {!isMapRoute && (
              <div className="hidden sm:block">
                <ZoneSearch />
              </div>
            )}

            {/* Theme Selector Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  className="h-9 px-3 rounded-xl border-border text-xs font-bold gap-1.5"
                >
                  <Sparkles className="h-3.5 w-3.5 text-primary" />
                  <span className="hidden md:inline">Theme</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48 rounded-xl">
                <DropdownMenuLabel className="text-[10px] uppercase font-black tracking-wider text-muted-foreground">
                  Select Design Theme
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => document.documentElement.setAttribute("data-theme", "forest")}
                >
                  🌲 Urban Forest (Default)
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => document.documentElement.setAttribute("data-theme", "cyber")}
                >
                  ⚡ Cyber Midnight
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => document.documentElement.setAttribute("data-theme", "sunset")}
                >
                  🌅 Solar Sunset
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => document.documentElement.setAttribute("data-theme", "oceanic")}
                >
                  🌊 Oceanic Slate
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center gap-2 p-1 pl-2">
                  <div className="hidden text-right sm:block">
                    <p className="text-sm font-medium leading-none">{user.name}</p>
                    <p className="mt-1 text-xs text-muted-foreground capitalize">{user.role}</p>
                  </div>
                  <Avatar className="h-9 w-9 border border-border">
                    <AvatarFallback className="bg-primary/10 text-primary">
                      {user.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link to="/profile" className="flex w-full items-center">
                    <User className="mr-2 h-4 w-4" />
                    <span>Profile</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/settings" className="flex w-full items-center">
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Settings</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleSignOut} className="text-destructive">
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        {/* Content */}
        <main className={cn("flex-1 overflow-y-auto p-6 lg:p-8 transition-colors duration-500", featureBgClass)}>
          <div className="mx-auto max-w-7xl">{children}</div>
        </main>
      </div>
    </div>
  );
}

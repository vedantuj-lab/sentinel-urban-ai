import { createFileRoute, Link } from "@tanstack/react-router";
import { PublicLayout } from "@/layouts/PublicLayout";
import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Filter,
  Github,
  ExternalLink,
  Calendar,
  Tag,
  History,
  LayoutGrid,
  List as ListIcon,
  ChevronDown,
  ArrowUpDown,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuCheckboxItem,
} from "@/components/ui/dropdown-menu";
import type { Project, ProjectCategory, ProjectStatus } from "@/types/project";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/archive")({
  component: ProjectArchive,
});

function ProjectArchive() {
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<ProjectCategory | "All">("All");
  const [statusFilter, setStatusFilter] = useState<ProjectStatus | "All">("All");
  const [featuredOnly, setFeaturedOnly] = useState(false);
  const [sortBy, setSortBy] = useState<"name" | "updated">("updated");

  const { data: projects = [], isLoading } = useQuery<Project[]>({
    queryKey: ["projects"],
    queryFn: async () => {
      try {
        const res = await fetch("/api/projects");
        if (res.ok) {
          const contentType = res.headers.get("content-type") || "";
          if (contentType.includes("application/json")) {
            return await res.json();
          }
        }
      } catch {
        // Ignore fetch errors
      }
      return [];
    },
  });

  const filteredProjects = useMemo(() => {
    return projects
      .filter((p) => {
        const matchesSearch =
          p.name.toLowerCase().includes(search.toLowerCase()) ||
          p.description.toLowerCase().includes(search.toLowerCase()) ||
          p.primaryTech.toLowerCase().includes(search.toLowerCase());
        const matchesCategory = categoryFilter === "All" || p.category === categoryFilter;
        const matchesStatus = statusFilter === "All" || p.status === statusFilter;
        const matchesFeatured = !featuredOnly || p.featured;

        return matchesSearch && matchesCategory && matchesStatus && matchesFeatured;
      })
      .sort((a, b) => {
        if (sortBy === "name") return a.name.localeCompare(b.name);
        return new Date(b.lastUpdated).getTime() - new Date(a.lastUpdated).getTime();
      });
  }, [projects, search, categoryFilter, statusFilter, featuredOnly, sortBy]);

  const categories: (ProjectCategory | "All")[] = [
    "All",
    "Intelligence",
    "Infrastructure",
    "Environment",
    "Public Health",
    "Data Science",
    "Mobile",
  ];
  const statuses: (ProjectStatus | "All")[] = [
    "All",
    "Active",
    "Experimental",
    "Maintenance",
    "Archived",
  ];

  return (
    <PublicLayout>
      <div className="py-20 relative overflow-hidden min-h-screen">
        <div className="absolute inset-0 grid-overlay opacity-5 -z-10" />

        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="max-w-2xl mb-16">
            <span className="rounded-full bg-primary/5 px-4 py-1.5 text-[10px] font-black uppercase tracking-[0.3em] text-primary border border-primary/20 backdrop-blur-sm">
              Historical Registry
            </span>
            <h1 className="text-4xl font-black tracking-tight text-foreground sm:text-6xl mt-6 mb-4 editorial">
              Project <span className="text-primary">Archive.</span>
            </h1>
            <p className="text-lg text-muted-foreground font-medium">
              A complete collection of UrbanSense AI research, prototypes, and production
              repositories.
            </p>
          </div>

          {/* Controls */}
          <div className="flex flex-col lg:flex-row gap-6 mb-12 items-start lg:items-center">
            <div className="relative flex-grow max-w-md w-full">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by name, tech, or mission..."
                className="pl-11 h-12 rounded-2xl border-border/40 bg-white/50 backdrop-blur-sm shadow-sm focus:ring-primary"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    className="h-12 rounded-2xl border-border/40 gap-2 bg-white/50"
                  >
                    <Filter className="h-4 w-4" />
                    {categoryFilter === "All" ? "Categories" : categoryFilter}
                    <ChevronDown className="h-3 w-3 opacity-50" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56 rounded-xl">
                  {categories.map((c) => (
                    <DropdownMenuItem
                      key={c}
                      onClick={() => setCategoryFilter(c)}
                      className={cn(
                        "text-xs font-bold uppercase tracking-widest",
                        categoryFilter === c && "bg-primary/5 text-primary",
                      )}
                    >
                      {c}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    className="h-12 rounded-2xl border-border/40 gap-2 bg-white/50"
                  >
                    <History className="h-4 w-4" />
                    {statusFilter === "All" ? "Status" : statusFilter}
                    <ChevronDown className="h-3 w-3 opacity-50" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56 rounded-xl">
                  {statuses.map((s) => (
                    <DropdownMenuItem
                      key={s}
                      onClick={() => setStatusFilter(s)}
                      className={cn(
                        "text-xs font-bold uppercase tracking-widest",
                        statusFilter === s && "bg-primary/5 text-primary",
                      )}
                    >
                      {s}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>

              <Button
                variant="outline"
                className={cn(
                  "h-12 rounded-2xl border-border/40 gap-2 transition-all",
                  featuredOnly ? "bg-primary text-white border-primary" : "bg-white/50",
                )}
                onClick={() => setFeaturedOnly(!featuredOnly)}
              >
                <Tag className="h-4 w-4" />
                Featured Only
              </Button>

              <Button
                variant="ghost"
                size="icon"
                className="h-12 w-12 rounded-2xl border border-border/40"
                onClick={() => setSortBy(sortBy === "name" ? "updated" : "name")}
                title={sortBy === "name" ? "Sort by Last Updated" : "Sort by Name"}
              >
                <ArrowUpDown className="h-4 w-4 text-muted-foreground" />
              </Button>
            </div>
          </div>

          {/* Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <AnimatePresence mode="popLayout">
              {filteredProjects.map((project, i) => (
                <motion.div
                  key={project.id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ delay: i * 0.05 }}
                >
                  <Card className="h-full border-border/40 shadow-sm hover:shadow-premium hover:border-primary/20 transition-all duration-500 rounded-[2rem] overflow-hidden group bg-white/60 backdrop-blur-sm">
                    <CardHeader className="p-8 pb-4">
                      <div className="flex justify-between items-start mb-4">
                        <Badge
                          variant="outline"
                          className="text-[9px] font-black uppercase tracking-widest bg-primary/5 text-primary border-primary/10"
                        >
                          {project.category}
                        </Badge>
                        <div className="flex gap-2">
                          {project.featured && (
                            <Badge className="bg-amber-500 text-white border-none text-[8px] font-black uppercase tracking-tighter">
                              Featured
                            </Badge>
                          )}
                          <span
                            className={cn(
                              "h-2 w-2 rounded-full mt-1",
                              project.status === "Active"
                                ? "bg-green-500"
                                : project.status === "Experimental"
                                  ? "bg-blue-500"
                                  : project.status === "Maintenance"
                                    ? "bg-amber-500"
                                    : "bg-slate-400",
                            )}
                          />
                        </div>
                      </div>
                      <CardTitle className="text-2xl font-black tracking-tight group-hover:text-primary transition-colors">
                        {project.name}
                      </CardTitle>
                      <CardDescription className="text-xs font-mono font-bold text-muted-foreground uppercase tracking-widest mt-2">
                        {project.primaryTech}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="p-8 pt-0 flex flex-col justify-between h-[calc(100%-140px)]">
                      <p className="text-muted-foreground font-medium mb-8 leading-relaxed">
                        {project.description}
                      </p>

                      <div className="pt-6 border-t border-border/40 flex items-center justify-between">
                        <div className="flex items-center gap-2 text-[10px] font-black text-muted-foreground uppercase tracking-widest">
                          <Calendar className="h-3 w-3" />
                          {new Date(project.lastUpdated).toLocaleDateString("en-IN", {
                            month: "short",
                            year: "numeric",
                          })}
                        </div>

                        <a
                          href={project.githubUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="h-10 w-10 rounded-xl bg-sidebar text-white flex items-center justify-center hover:bg-primary transition-colors shadow-sm"
                        >
                          <Github className="h-5 w-5" />
                        </a>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </AnimatePresence>

            {filteredProjects.length === 0 && !isLoading && (
              <div className="col-span-full py-32 text-center">
                <div className="h-20 w-20 rounded-[2rem] bg-surface border border-border/40 flex items-center justify-center mx-auto mb-6">
                  <Search className="h-8 w-8 text-muted-foreground" />
                </div>
                <h3 className="text-xl font-black uppercase tracking-widest">No Projects Found</h3>
                <p className="text-muted-foreground mt-2">
                  Adjust your filters or search terms to explore the registry.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </PublicLayout>
  );
}

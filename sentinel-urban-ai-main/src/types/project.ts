export type ProjectCategory =
  "Intelligence" | "Infrastructure" | "Environment" | "Public Health" | "Data Science" | "Mobile";

export type ProjectStatus = "Active" | "Archived" | "Experimental" | "Maintenance";

export interface Project {
  id: string;
  name: string;
  category: ProjectCategory;
  primaryTech: string;
  description: string;
  status: ProjectStatus;
  lastUpdated: string;
  githubUrl: string;
  featured: boolean;
}

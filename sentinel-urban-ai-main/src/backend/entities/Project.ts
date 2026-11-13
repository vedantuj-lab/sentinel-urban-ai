import { ProjectCategory, ProjectStatus } from "@/types/project";

export interface ProjectEntity {
  id: string;
  name: string;
  category: ProjectCategory;
  primaryTech: string;
  description: string;
  status: ProjectStatus;
  lastUpdated: string;
  githubUrl: string;
  featured: boolean;
  createdAt: string;
  updatedAt: string;
}

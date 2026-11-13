import { TaskStatus } from "@/types/risk";

export interface InterventionEntity {
  id: string;
  zoneId: string;
  title: string;
  description: string;
  status: TaskStatus;
  priority: number;
  assigneeId?: string;
  deadline: string;
  evidence: string[];
  notes: { at: string; text: string; userId: string }[];
  createdAt: string;
  updatedAt: string;
}

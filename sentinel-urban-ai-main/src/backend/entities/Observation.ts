export interface ObservationEntity {
  id: string;
  userId: string;
  zoneId: string;
  category: string;
  description: string;
  imageUrl?: string;
  status: "Submitted" | "Under Review" | "Accepted" | "Rejected";
  createdAt: string;
  updatedAt: string;
}

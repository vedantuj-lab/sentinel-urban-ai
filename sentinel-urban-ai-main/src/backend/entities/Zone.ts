import { LandUse } from "@/types/risk";

export interface ZoneEntity {
  id: string;
  name: string;
  ward: string;
  lat: number;
  lng: number;
  mx: number;
  my: number;
  landUse: LandUse;
  population: number;
  populationDensity: number;
  vulnerabilityIndex: number;
  historicalRiskFrequency: number;
  createdAt: string;
  updatedAt: string;
}

import { defineEventHandler } from "h3";
import { ZoneRepository } from "../backend/repositories/ZoneRepository";
import { RiskService } from "../services/RiskService";

export default defineEventHandler(async (event) => {
  const zones = await ZoneRepository.getAll();
  // RiskService.assessAllSync handles the analytical pipeline
  return RiskService.assessAllSync(zones as any);
});

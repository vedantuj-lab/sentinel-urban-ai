import { defineEventHandler } from "h3";
import { InterventionRepository } from "../../backend/repositories/InterventionRepository";
import { requireRole } from "../auth/utils";

export default defineEventHandler(async (event) => {
  requireRole(event, ["analyst", "admin"]);
  return await InterventionRepository.getAll();
});

import { defineEventHandler } from "h3";
import { ZoneRepository } from "../backend/repositories/ZoneRepository";

export default defineEventHandler(async (event) => {
  return await ZoneRepository.getAll();
});

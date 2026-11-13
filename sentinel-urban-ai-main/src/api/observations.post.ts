import { defineEventHandler, readBody } from "h3";
import { ObservationRepository } from "../backend/repositories/ObservationRepository";
import { getSession } from "./auth/utils";

export default defineEventHandler(async (event) => {
  const rawBody = (await readBody(event)) || {};
  const body = rawBody as Record<string, string>;
  const user = getSession(event);

  const observation = await ObservationRepository.create({
    userId: user?.id || "anonymous",
    zoneId: body.zoneId || "Z-01",
    category: body.category || "General",
    description: body.description || "",
    imageUrl: body.imageUrl || body.imageName,
    status: "Submitted",
  });

  return observation;
});

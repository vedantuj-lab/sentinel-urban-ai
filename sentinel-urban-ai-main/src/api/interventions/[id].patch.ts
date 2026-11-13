import { defineEventHandler, readBody, createError } from "h3";
import { InterventionRepository } from "../../backend/repositories/InterventionRepository";
import { requireRole } from "../auth/utils";

export default defineEventHandler(async (event) => {
  requireRole(event, ["analyst", "admin"]);

  const id = event.context.params?.id;
  if (!id) {
    throw createError({
      statusCode: 400,
      statusMessage: "Missing intervention ID",
    });
  }

  const body = (await readBody(event)) || {};
  const updated = await InterventionRepository.update(id, body as any);

  if (!updated) {
    throw createError({
      statusCode: 404,
      statusMessage: "Intervention not found",
    });
  }

  return updated;
});

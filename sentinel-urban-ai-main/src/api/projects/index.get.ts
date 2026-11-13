import { defineEventHandler, getQuery } from "h3";
import { ProjectRepository } from "../../backend/repositories/ProjectRepository";

export default defineEventHandler(async (event) => {
  const query = getQuery(event);
  const featuredOnly = query.featured === "true";

  if (featuredOnly) {
    return await ProjectRepository.getFeatured();
  }

  return await ProjectRepository.getAll();
});

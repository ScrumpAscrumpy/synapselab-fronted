import { getApiClient } from "./apiClient";

export async function getProjects() {
  return getApiClient().listProjects();
}

export async function getProjectById(id) {
  return getApiClient().getProjectById(id);
}

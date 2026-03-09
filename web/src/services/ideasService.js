import { getApiClient } from "./apiClient";

export async function getIdeas() {
  return getApiClient().listIdeas();
}

export async function getIdeaById(id) {
  return getApiClient().getIdeaById(id);
}

export async function createIdea(payload) {
  return getApiClient().createIdea(payload);
}

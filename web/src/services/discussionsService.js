import { getApiClient } from "./apiClient";

export async function getProjectDiscussions(projectId) {
  return getApiClient().listProjectDiscussions(projectId);
}

export async function createProjectDiscussion(payload) {
  return getApiClient().createProjectDiscussion(payload);
}

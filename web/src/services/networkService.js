import { defaultScholarGraphData } from "../lib/scholarNetwork";
import { getApiClient } from "./apiClient";

export async function getScholarNetwork() {
  try {
    const client = getApiClient();
    if (typeof client.getScholarNetwork !== "function") {
      return defaultScholarGraphData;
    }

    const result = await client.getScholarNetwork();
    return result ?? defaultScholarGraphData;
  } catch (error) {
    return defaultScholarGraphData;
  }
}

export async function joinScholarNetwork(payload) {
  return getApiClient().joinScholarNetwork(payload);
}

export async function addScholarPaper(payload) {
  return getApiClient().addScholarPaper(payload);
}

export async function deleteScholarPaper(payload) {
  return getApiClient().deleteScholarPaper(payload);
}

export async function linkScholarProject(payload) {
  return getApiClient().linkScholarProject(payload);
}

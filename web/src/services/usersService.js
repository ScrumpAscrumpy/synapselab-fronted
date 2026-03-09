import { getApiClient } from "./apiClient";

export async function getCurrentUser() {
  return getApiClient().getCurrentUser();
}

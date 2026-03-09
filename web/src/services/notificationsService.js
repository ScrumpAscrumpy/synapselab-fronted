import { getApiClient } from "./apiClient";

export async function getNotifications() {
  return getApiClient().listNotifications();
}

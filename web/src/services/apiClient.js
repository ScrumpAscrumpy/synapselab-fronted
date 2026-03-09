import { appConfig } from "../constants/appConfig";
import { cloudbaseApi } from "./cloudbaseApi";
import { mockApi } from "./mockApi";

export function getApiClient() {
  return appConfig.apiMode === "cloudbase" ? cloudbaseApi : mockApi;
}

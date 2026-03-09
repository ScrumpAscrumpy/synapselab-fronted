import { getApiClient } from "./apiClient";

export async function getCommentsByTarget(targetType, targetId) {
  return getApiClient().listComments(targetType, targetId);
}

export async function createComment(payload) {
  return getApiClient().createComment(payload);
}

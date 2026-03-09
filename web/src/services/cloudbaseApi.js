import { getCloudbaseApp } from "../lib/cloudbase";

async function callFunction(name, data) {
  try {
    const app = await getCloudbaseApp();
    const result = await app.callFunction({
      name,
      data,
    });

    const payload = result?.result;

    if (!payload) {
      throw new Error(`云函数 ${name} 没有返回有效结果。`);
    }

    if (payload.code !== 0) {
      throw new Error(payload.message || `云函数 ${name} 执行失败。`);
    }

    return payload.data;
  } catch (error) {
    const message = error?.message || "未知错误";
    throw new Error(`云函数 ${name} 调用失败：${message}`);
  }
}

export const cloudbaseApi = {
  async listIdeas() {
    return callFunction("ideas", { action: "list" });
  },

  async getIdeaById(id) {
    return callFunction("ideas", { action: "detail", id });
  },

  async createIdea(payload) {
    return callFunction("ideas", { action: "create", ...payload });
  },

  async listProjects() {
    return callFunction("projects", { action: "list" });
  },

  async getProjectById(id) {
    return callFunction("projects", { action: "detail", id });
  },

  async getCurrentUser() {
    return callFunction("users", { action: "profile" });
  },

  async listComments(targetType, targetId) {
    return callFunction("comments", { action: "list", targetType, targetId });
  },

  async createComment(payload) {
    return callFunction("comments", { action: "create", ...payload });
  },

  async listProjectDiscussions(projectId) {
    return callFunction("project-discussions", { action: "list", projectId });
  },

  async createProjectDiscussion(payload) {
    return callFunction("project-discussions", { action: "create", ...payload });
  },

  async listNotifications() {
    return callFunction("notifications", { action: "list" });
  },

  async getScholarNetwork() {
    return callFunction("scholar-network", { action: "graph" });
  },

  async joinScholarNetwork(payload) {
    return callFunction("scholar-network", { action: "join", ...payload });
  },

  async addScholarPaper(payload) {
    return callFunction("scholar-network", { action: "add-paper", ...payload });
  },

  async deleteScholarPaper(payload) {
    return callFunction("scholar-network", { action: "delete-paper", ...payload });
  },

  async linkScholarProject(payload) {
    return callFunction("scholar-network", { action: "link-project", ...payload });
  },
};

import {
  comments,
  currentUserProfile,
  featuredIdeas,
  notifications,
  projectDiscussions,
  researchProjects,
  scholars,
} from "../mock/ideas";

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const clone = (value) => JSON.parse(JSON.stringify(value));
const scholarNetworkStore = {
  scholars: clone(scholars),
  projects: clone(researchProjects),
};

export const mockApi = {
  async listIdeas() {
    await delay(120);
    return featuredIdeas;
  },

  async getIdeaById(id) {
    await delay(120);
    return featuredIdeas.find((idea) => idea.id === id) ?? null;
  },

  async createIdea(payload) {
    await delay(120);
    return {
      id: `draft-${Date.now()}`,
      title: payload.title,
      summary: payload.summary,
      tags: payload.tags.length ? payload.tags : ["未分类"],
      challenge: payload.challenge,
      aiInsight: "草稿已生成。后续可接入 Lumina 云函数生成自动分析。",
      energy: 0,
      trend: "草稿",
      author: "当前用户",
      authorRole: "待接入登录系统",
      createdAt: "刚刚",
      opportunity: "该草稿尚未经过 AI 与社区验证，可在后续版本继续补充。",
      nextActions: ["完善摘要", "补充标签", "提交到真实数据库"],
      relatedDisciplines: payload.tags.length ? payload.tags : ["待分类"],
    };
  },

  async listProjects() {
    await delay(120);
    return researchProjects;
  },

  async getProjectById(id) {
    await delay(120);
    return researchProjects.find((project) => project.id === id) ?? null;
  },

  async getCurrentUser() {
    await delay(120);
    return currentUserProfile;
  },

  async listComments(targetType, targetId) {
    await delay(120);
    return comments.filter((item) => item.targetType === targetType && item.targetId === targetId);
  },

  async createComment(payload) {
    await delay(120);
    return {
      id: `comment-${Date.now()}`,
      targetType: payload.targetType,
      targetId: payload.targetId,
      authorName: "当前用户",
      authorRole: "待接入登录",
      content: payload.content,
      createdAt: "刚刚",
    };
  },

  async listProjectDiscussions(projectId) {
    await delay(120);
    return projectDiscussions.filter((item) => item.projectId === projectId);
  },

  async createProjectDiscussion(payload) {
    await delay(120);
    return {
      id: `discussion-${Date.now()}`,
      projectId: payload.projectId,
      authorName: "当前用户",
      authorRole: "待接入登录",
      content: payload.content,
      createdAt: "刚刚",
      helpfulVotes: 0,
    };
  },

  async listNotifications() {
    await delay(120);
    return notifications;
  },

  async getScholarNetwork() {
    await delay(120);
    return clone(scholarNetworkStore);
  },

  async joinScholarNetwork(payload) {
    await delay(120);
    const scholarsList = scholarNetworkStore.scholars;
    const index = scholarsList.findIndex(
      (item) =>
        (payload.profileKey && item.profileKey === payload.profileKey) ||
        (payload.name && item.name === payload.name),
    );

    if (index >= 0) {
      scholarsList[index] = {
        ...scholarsList[index],
        name: payload.name || scholarsList[index].name,
        profileKey: payload.profileKey || scholarsList[index].profileKey,
        discipline: payload.discipline || payload.role || scholarsList[index].discipline,
        relationName: payload.relationName || scholarsList[index].relationName || "",
        inviteCode: payload.inviteCode || scholarsList[index].inviteCode || "",
        verified: true,
        eligibleForGraph: true,
      };
    } else {
      scholarsList.push({
        id: `scholar-${Date.now()}`,
        profileKey: payload.profileKey || "",
        name: payload.name || "未命名学者",
        discipline: payload.discipline || payload.role || "跨学科研究者",
        tags: ["新加入网络"],
        verified: true,
        eligibleForGraph: true,
        relationName: payload.relationName || "",
        inviteCode: payload.inviteCode || "",
        projectIds: [],
        papers: [],
      });
    }

    return clone(scholarNetworkStore);
  },

  async addScholarPaper(payload) {
    await delay(120);
    const scholar = scholarNetworkStore.scholars.find(
      (item) =>
        (payload.profileKey && item.profileKey === payload.profileKey) ||
        (payload.name && item.name === payload.name),
    );

    if (!scholar) {
      throw new Error("未找到对应学者，请先加入学者网络。");
    }

    scholar.papers.push({
      id: `paper-${Date.now()}`,
      title: payload.title,
      summary: payload.summary || "该论文由当前用户上传，用于补充其在学者网络中的成果节点。",
      context: payload.context || "该论文作为研究成果节点挂接到当前学者身份之下。",
      url: payload.url || `https://example.org/papers/${Date.now()}`,
    });

    return clone(scholarNetworkStore);
  },

  async deleteScholarPaper(payload) {
    await delay(120);
    const scholar = scholarNetworkStore.scholars.find(
      (item) =>
        (payload.scholarId && item.id === payload.scholarId) ||
        (payload.profileKey && item.profileKey === payload.profileKey) ||
        (payload.name && item.name === payload.name),
    );

    if (!scholar) {
      throw new Error("未找到对应学者，无法删除论文。");
    }

    scholar.papers = scholar.papers.filter((paper) => paper.id !== payload.paperId);
    return clone(scholarNetworkStore);
  },

  async linkScholarProject(payload) {
    await delay(120);
    const scholar = scholarNetworkStore.scholars.find(
      (item) =>
        (payload.profileKey && item.profileKey === payload.profileKey) ||
        (payload.name && item.name === payload.name),
    );

    if (!scholar) {
      throw new Error("未找到对应学者，请先加入学者网络。");
    }

    if (payload.projectId && !scholar.projectIds.includes(payload.projectId)) {
      scholar.projectIds.push(payload.projectId);
    }

    if (payload.projectId && !scholarNetworkStore.projects.some((item) => item.id === payload.projectId)) {
      scholarNetworkStore.projects.push({
        id: payload.projectId,
        title: payload.projectTitle || "未命名项目",
        stage: payload.projectStage || "进行中",
        summary: payload.projectSummary || "",
      });
    }

    return clone(scholarNetworkStore);
  },
};

const { getDb } = require("./db");
const collections = require("./collections");
const {
  comments,
  ideas,
  notifications,
  projectDiscussions,
  projects,
  scholarNetwork,
  users,
} = require("./mockData");

function formatDateLike(value) {
  if (!value) {
    return "";
  }

  if (typeof value === "string") {
    return value;
  }

  if (value instanceof Date) {
    return value.toISOString();
  }

  return String(value);
}

function normalizeIdea(doc) {
  if (!doc) {
    return null;
  }

  return {
    ...doc,
    id: doc.id || doc._id,
    author: doc.author || doc.authorName || "未知用户",
    authorRole: doc.authorRole || "",
    createdAt: formatDateLike(doc.createdAt),
    updatedAt: formatDateLike(doc.updatedAt),
  };
}

function normalizeProject(doc) {
  if (!doc) {
    return null;
  }

  return {
    ...doc,
    id: doc.id || doc._id,
    members: doc.members || doc.memberIds || [],
    createdAt: formatDateLike(doc.createdAt),
    updatedAt: formatDateLike(doc.updatedAt),
  };
}

function normalizeUser(doc) {
  if (!doc) {
    return null;
  }

  return {
    ...doc,
    id: doc.id || doc._id,
    joinedAt: doc.joinedAt || formatDateLike(doc.createdAt).slice(0, 10),
    publishedIdeaCount: doc.publishedIdeaCount || 0,
    activeProjectCount: doc.activeProjectCount || 0,
  };
}

function normalizeComment(doc) {
  if (!doc) {
    return null;
  }

  return {
    ...doc,
    id: doc.id || doc._id,
    createdAt: formatDateLike(doc.createdAt),
  };
}

function normalizeDiscussion(doc) {
  if (!doc) {
    return null;
  }

  return {
    ...doc,
    id: doc.id || doc._id,
    createdAt: formatDateLike(doc.createdAt),
  };
}

function normalizeNotification(doc) {
  if (!doc) {
    return null;
  }

  return {
    ...doc,
    id: doc.id || doc._id,
    createdAt: formatDateLike(doc.createdAt),
  };
}

function normalizeScholarNetwork(doc) {
  if (!doc) {
    return null;
  }

  return {
    key: doc.key || "default",
    scholars: (doc.scholars || []).map((scholar) => ({
      id: scholar.id || scholar._id,
      profileKey: scholar.profileKey || "",
      name: scholar.name || "未命名学者",
      discipline: scholar.discipline || scholar.role || "未标注方向",
      tags: scholar.tags || [],
      verified: scholar.verified !== false,
      eligibleForGraph: scholar.eligibleForGraph !== false,
      relationName: scholar.relationName || "",
      inviteCode: scholar.inviteCode || "",
      projectIds: scholar.projectIds || [],
      papers: (scholar.papers || []).map((paper, index) => ({
        id: paper.id || `${scholar.id || scholar._id}-paper-${index + 1}`,
        title: paper.title || "未命名论文",
        summary: paper.summary || "",
        url: paper.url || "https://example.org/papers/placeholder",
      })),
    })),
    projects: (doc.projects || []).map((project) => ({
      id: project.id || project._id,
      title: project.title || "未命名项目",
      stage: project.stage || "进行中",
      summary: project.summary || "",
    })),
    updatedAt: formatDateLike(doc.updatedAt),
    __docId: doc._id || doc.__docId || "",
  };
}

async function getScholarNetworkDoc(db) {
  const byKey = await db
    .collection(collections.SCHOLAR_NETWORK)
    .where({ key: "default" })
    .limit(1)
    .get();

  if (byKey.data?.[0]) {
    return {
      ...byKey.data[0],
      __docId: byKey.data[0]._id,
    };
  }

  const firstDoc = await db.collection(collections.SCHOLAR_NETWORK).limit(1).get();
  if (firstDoc.data?.[0]) {
    return {
      ...firstDoc.data[0],
      __docId: firstDoc.data[0]._id,
    };
  }

  return null;
}

async function listIdeas() {
  const db = getDb();
  if (!db) {
    return ideas;
  }

  const result = await db.collection(collections.IDEAS).orderBy("createdAt", "desc").get();
  return (result.data || []).map(normalizeIdea);
}

async function getIdeaById(id) {
  const db = getDb();
  if (!db) {
    return ideas.find((item) => item.id === id || item._id === id) || null;
  }

  try {
    const result = await db.collection(collections.IDEAS).doc(id).get();
    if (result.data) {
      return normalizeIdea(result.data);
    }
  } catch (error) {
    // Fall through to alternate lookup when id is a business id rather than document id.
  }

  const fallback = await db
    .collection(collections.IDEAS)
    .where({ id })
    .limit(1)
    .get();

  return fallback.data?.[0] ? normalizeIdea(fallback.data[0]) : null;
}

async function createIdea(payload) {
  const db = getDb();
  const now = new Date();
  const created = {
    title: payload.title || "未命名猜想",
    summary: payload.summary || "",
    challenge: payload.challenge || "",
    opportunity: payload.opportunity || "",
    tags: payload.tags || [],
    trend: "草稿",
    energy: 0,
    authorId: payload.authorId || "user-demo-1",
    authorName: payload.authorName || "Synapse Founder",
    authorRole: payload.authorRole || "Platform Owner",
    aiInsight: "后续可由 Lumina 云函数生成。",
    nextActions: payload.nextActions || ["完善摘要", "补充标签", "提交到数据库"],
    relatedDisciplines: payload.tags || [],
    status: "draft",
    createdAt: now,
    updatedAt: now,
  };

  if (!db) {
    return {
      id: `idea-${Date.now()}`,
      ...created,
    };
  }

  const result = await db.collection(collections.IDEAS).add(created);
  return normalizeIdea({
    _id: result.id,
    ...created,
  });
}

async function listProjects() {
  const db = getDb();
  if (!db) {
    return projects;
  }

  const result = await db.collection(collections.PROJECTS).orderBy("createdAt", "desc").get();
  return (result.data || []).map(normalizeProject);
}

async function getProjectById(id) {
  const db = getDb();
  if (!db) {
    return projects.find((item) => item.id === id || item._id === id) || null;
  }

  try {
    const result = await db.collection(collections.PROJECTS).doc(id).get();
    if (result.data) {
      return normalizeProject(result.data);
    }
  } catch (error) {
    // Fall through to alternate lookup when id is a business id rather than document id.
  }

  const fallback = await db
    .collection(collections.PROJECTS)
    .where({ id })
    .limit(1)
    .get();

  return fallback.data?.[0] ? normalizeProject(fallback.data[0]) : null;
}

async function getCurrentUser() {
  const db = getDb();
  if (!db) {
    return users[0];
  }

  const byBusinessId = await db
    .collection(collections.USERS)
    .where({ id: "user-demo-1" })
    .limit(1)
    .get();

  if (byBusinessId.data?.[0]) {
    return normalizeUser(byBusinessId.data[0]);
  }

  const firstUser = await db.collection(collections.USERS).limit(1).get();
  return firstUser.data?.[0] ? normalizeUser(firstUser.data[0]) : null;
}

async function listComments(targetType, targetId) {
  const db = getDb();
  if (!db) {
    return comments.filter(
      (item) => item.targetType === targetType && item.targetId === targetId,
    );
  }

  const result = await db
    .collection(collections.COMMENTS)
    .where({
      targetType,
      targetId,
    })
    .orderBy("createdAt", "desc")
    .get();

  return (result.data || []).map(normalizeComment);
}

async function createComment(payload) {
  const db = getDb();
  const created = {
    targetType: payload.targetType,
    targetId: payload.targetId,
    authorId: payload.authorId || "user-demo-1",
    authorName: payload.authorName || "Synapse Founder",
    authorRole: payload.authorRole || "Platform Owner",
    content: payload.content || "",
    parentId: payload.parentId || "",
    createdAt: new Date(),
  };

  if (!db) {
    return {
      id: `comment-${Date.now()}`,
      ...created,
      createdAt: "刚刚",
    };
  }

  const result = await db.collection(collections.COMMENTS).add(created);
  return normalizeComment({
    _id: result.id,
    ...created,
  });
}

async function listProjectDiscussions(projectId) {
  const db = getDb();
  if (!db) {
    return projectDiscussions.filter((item) => item.projectId === projectId);
  }

  const result = await db
    .collection(collections.PROJECT_DISCUSSIONS)
    .where({ projectId })
    .orderBy("createdAt", "desc")
    .get();

  return (result.data || []).map(normalizeDiscussion);
}

async function createProjectDiscussion(payload) {
  const db = getDb();
  const created = {
    projectId: payload.projectId,
    authorId: payload.authorId || "user-demo-1",
    authorName: payload.authorName || "Synapse Founder",
    authorRole: payload.authorRole || "Platform Owner",
    content: payload.content || "",
    helpfulVotes: 0,
    createdAt: new Date(),
  };

  if (!db) {
    return {
      id: `discussion-${Date.now()}`,
      ...created,
      createdAt: "刚刚",
    };
  }

  const result = await db.collection(collections.PROJECT_DISCUSSIONS).add(created);
  return normalizeDiscussion({
    _id: result.id,
    ...created,
  });
}

async function listNotifications() {
  const db = getDb();
  if (!db) {
    return notifications;
  }

  const result = await db
    .collection(collections.NOTIFICATIONS)
    .orderBy("createdAt", "desc")
    .get();

  return (result.data || []).map(normalizeNotification);
}

async function getScholarNetwork() {
  const db = getDb();
  if (!db) {
    return scholarNetwork;
  }

  const networkDoc = await getScholarNetworkDoc(db);
  if (!networkDoc) {
    return scholarNetwork;
  }

  return normalizeScholarNetwork(networkDoc);
}

module.exports = {
  listIdeas,
  getIdeaById,
  createIdea,
  listProjects,
  getProjectById,
  getCurrentUser,
  listComments,
  createComment,
  listProjectDiscussions,
  createProjectDiscussion,
  listNotifications,
  getScholarNetwork,
};

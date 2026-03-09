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
        context: paper.context || "",
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

function makeScholarId() {
  return `scholar-${Date.now()}`;
}

function makePaperId() {
  return `paper-${Date.now()}`;
}

async function upsertScholarNetworkDoc(updater) {
  const db = getDb();
  if (!db) {
    const next = updater(JSON.parse(JSON.stringify(scholarNetwork)));
    Object.assign(scholarNetwork, next);
    return next;
  }

  const existing = await getScholarNetworkDoc(db);
  const baseDoc = existing || {
    key: "default",
    scholars: [],
    projects: [],
    updatedAt: new Date(),
  };

  const nextDoc = updater(JSON.parse(JSON.stringify(baseDoc)));
  nextDoc.key = nextDoc.key || "default";
  nextDoc.updatedAt = new Date();
  delete nextDoc.__docId;

  if (existing?.__docId) {
    await db.collection(collections.SCHOLAR_NETWORK).doc(existing.__docId).update({
      data: nextDoc,
    });
    return normalizeScholarNetwork({
      ...nextDoc,
      _id: existing.__docId,
    });
  }

  const result = await db.collection(collections.SCHOLAR_NETWORK).add({
    data: nextDoc,
  });
  return normalizeScholarNetwork({
    ...nextDoc,
    _id: result.id,
  });
}

function findScholarIndex(scholarsList, payload) {
  return scholarsList.findIndex(
    (item) =>
      (payload.scholarId && item.id === payload.scholarId) ||
      (payload.profileKey && item.profileKey === payload.profileKey) ||
      (payload.name && item.name === payload.name),
  );
}

async function joinScholarNetwork(payload) {
  const next = await upsertScholarNetworkDoc((doc) => {
    const scholarsList = Array.isArray(doc.scholars) ? doc.scholars : [];
    const index = findScholarIndex(scholarsList, payload);

    if (index >= 0) {
      const existing = scholarsList[index];
      scholarsList[index] = {
        ...existing,
        name: payload.name || existing.name,
        profileKey: payload.profileKey || existing.profileKey || "",
        discipline: payload.discipline || existing.discipline || payload.role || "跨学科研究者",
        relationName: payload.relationName || existing.relationName || "",
        inviteCode: payload.inviteCode || existing.inviteCode || "",
        tags: existing.tags || [],
        verified: true,
        eligibleForGraph: true,
        projectIds: existing.projectIds || [],
        papers: existing.papers || [],
      };
    } else {
      scholarsList.push({
        id: makeScholarId(),
        profileKey: payload.profileKey || "",
        name: payload.name || "未命名学者",
        discipline: payload.discipline || payload.role || "跨学科研究者",
        tags: payload.tags || ["新加入网络"],
        verified: true,
        eligibleForGraph: true,
        relationName: payload.relationName || "",
        inviteCode: payload.inviteCode || "",
        projectIds: [],
        papers: [],
      });
    }

    doc.scholars = scholarsList;
    return doc;
  });

  return next;
}

async function addScholarPaper(payload) {
  const next = await upsertScholarNetworkDoc((doc) => {
    const scholarsList = Array.isArray(doc.scholars) ? doc.scholars : [];
    let index = findScholarIndex(scholarsList, payload);

    if (index < 0) {
      scholarsList.push({
        id: makeScholarId(),
        profileKey: payload.profileKey || "",
        name: payload.name || "未命名学者",
        discipline: payload.discipline || payload.role || "跨学科研究者",
        tags: ["自动补建", "研究学者"],
        verified: true,
        eligibleForGraph: true,
        relationName: payload.relationName || "",
        inviteCode: payload.inviteCode || "",
        projectIds: [],
        papers: [],
      });
      index = scholarsList.length - 1;
    }

    const scholar = scholarsList[index];
    const papers = Array.isArray(scholar.papers) ? scholar.papers : [];
    papers.push({
      id: makePaperId(),
      title: payload.title || "未命名论文",
      summary: payload.summary || "该论文由当前用户上传，用于补充其在学者网络中的成果节点。",
      context: payload.context || "该论文作为研究成果节点挂接到当前学者身份之下。",
      url: payload.url || "https://example.org/papers/user-upload",
    });

    scholarsList[index] = {
      ...scholar,
      papers,
    };

    doc.scholars = scholarsList;
    return doc;
  });

  return next;
}

async function linkScholarProject(payload) {
  const next = await upsertScholarNetworkDoc((doc) => {
    const scholarsList = Array.isArray(doc.scholars) ? doc.scholars : [];
    const projectsList = Array.isArray(doc.projects) ? doc.projects : [];
    let index = findScholarIndex(scholarsList, payload);

    if (index < 0) {
      scholarsList.push({
        id: makeScholarId(),
        profileKey: payload.profileKey || "",
        name: payload.name || "未命名学者",
        discipline: payload.discipline || payload.role || "跨学科研究者",
        tags: ["自动补建", "研究学者"],
        verified: true,
        eligibleForGraph: true,
        relationName: payload.relationName || "",
        inviteCode: payload.inviteCode || "",
        projectIds: [],
        papers: [],
      });
      index = scholarsList.length - 1;
    }

    const scholar = scholarsList[index];
    const projectIds = Array.isArray(scholar.projectIds) ? scholar.projectIds : [];
    if (payload.projectId && !projectIds.includes(payload.projectId)) {
      projectIds.push(payload.projectId);
    }

    scholarsList[index] = {
      ...scholar,
      projectIds,
    };

    if (payload.projectId && !projectsList.some((item) => item.id === payload.projectId)) {
      projectsList.push({
        id: payload.projectId,
        title: payload.projectTitle || "未命名项目",
        stage: payload.projectStage || "进行中",
        summary: payload.projectSummary || "",
      });
    }

    doc.scholars = scholarsList;
    doc.projects = projectsList;
    return doc;
  });

  return next;
}

async function deleteScholarPaper(payload) {
  const next = await upsertScholarNetworkDoc((doc) => {
    const scholarsList = Array.isArray(doc.scholars) ? doc.scholars : [];
    const index = findScholarIndex(scholarsList, payload);

    if (index < 0) {
      throw new Error("未找到对应学者，无法删除论文。");
    }

    const scholar = scholarsList[index];
    const papers = Array.isArray(scholar.papers) ? scholar.papers : [];
    scholarsList[index] = {
      ...scholar,
      papers: papers.filter((paper) => paper.id !== payload.paperId),
    };

    doc.scholars = scholarsList;
    return doc;
  });

  return next;
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
  joinScholarNetwork,
  addScholarPaper,
  deleteScholarPaper,
  linkScholarProject,
};

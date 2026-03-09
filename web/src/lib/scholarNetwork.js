import {
  currentUserProfile,
  researchProjects,
  scholars,
} from "../mock/ideas";

const NETWORK_STORAGE_KEY = "synapselab.network.identity";
export const defaultScholarGraphData = {
  scholars,
  projects: researchProjects,
};

export function writeNetworkIdentity(identity) {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(NETWORK_STORAGE_KEY, JSON.stringify(identity));
}

export function readNetworkIdentity() {
  if (typeof window === "undefined") {
    return null;
  }
  const raw = window.localStorage.getItem(NETWORK_STORAGE_KEY);
  return raw ? JSON.parse(raw) : null;
}

export function updateNetworkIdentity(updater) {
  const current = readNetworkIdentity();
  const next = updater(current || {});
  writeNetworkIdentity(next);
  return next;
}

function buildPaperMeta(scholar, paper, index) {
  const title = typeof paper === "string" ? paper : paper.title;
  const summary =
    typeof paper === "string"
      ? `${title} 主要围绕 ${scholar.discipline} 与跨学科协作之间的结合展开，用于展示该学者的研究成果在关系网络中的辐射作用。`
      : paper.summary;
  const url =
    typeof paper === "string"
      ? `https://example.org/papers/${scholar.id}-${index + 1}`
      : paper.url;

  return {
    id: typeof paper === "string" ? `paper-${scholar.id}-${index + 1}` : paper.id || `paper-${scholar.id}-${index + 1}`,
    title,
    summary,
    url,
    authorLabel: scholar.name,
    context:
      typeof paper === "string"
        ? "该论文节点由学者节点向外扩展，用于说明其研究成果与学者身份之间的关联。"
        : paper.context || "该论文节点由学者节点向外扩展，用于说明其研究成果与学者身份之间的关联。",
  };
}

function getGraphData(graphData) {
  return graphData ?? defaultScholarGraphData;
}

function hasPersistedScholar(graphData, networkIdentity) {
  const { scholars: scholarsList } = getGraphData(graphData);
  if (!networkIdentity?.eligibleForGraph) {
    return false;
  }

  return scholarsList.some(
    (item) =>
      (networkIdentity.scholarId && item.id === networkIdentity.scholarId) ||
      (networkIdentity.email && item.profileKey === networkIdentity.email) ||
      item.name === networkIdentity.name,
  );
}

function buildBaseScholarNodes(scholarsList) {
  const total = Math.max(scholarsList.length, 1);
  const centerX = 320;
  const centerY = 170;
  const radiusX = total === 1 ? 0 : 210;
  const radiusY = total === 1 ? 0 : 108;

  return scholarsList.map((scholar, index) => {
    const angle = (-Math.PI / 2) + ((Math.PI * 2) / total) * index;
    return {
      id: scholar.id,
      type: "scholar",
      x: total === 1 ? centerX : centerX + Math.cos(angle) * radiusX,
      y: total === 1 ? centerY : centerY + Math.sin(angle) * radiusY,
      label: scholar.name,
      subtitle: scholar.discipline,
      verified: scholar.verified !== false,
    };
  });
}

function getProjectMemberLayout(total, centerX, centerY) {
  if (total <= 1) {
    return [{ x: centerX, y: centerY - 150 }];
  }

  if (total === 2) {
    return [
      { x: centerX - 124, y: centerY - 96 },
      { x: centerX + 124, y: centerY - 96 },
    ];
  }

  if (total === 3) {
    return [
      { x: centerX - 144, y: centerY - 94 },
      { x: centerX + 144, y: centerY - 94 },
      { x: centerX, y: centerY + 136 },
    ];
  }

  if (total === 4) {
    return [
      { x: centerX - 156, y: centerY - 104 },
      { x: centerX + 156, y: centerY - 104 },
      { x: centerX - 136, y: centerY + 132 },
      { x: centerX + 136, y: centerY + 132 },
    ];
  }

  return Array.from({ length: total }, (_, index) => {
    const angle = (-Math.PI / 2) + ((Math.PI * 2) / total) * index;
    return {
      x: centerX + Math.cos(angle) * 172,
      y: centerY + Math.sin(angle) * 144,
    };
  });
}

function getScholarPaperLayout(total, anchorX) {
  const safeTotal = Math.max(total, 1);
  return Array.from({ length: safeTotal }, (_, index) => {
    const columns = Math.min(safeTotal, 3);
    const row = Math.floor(index / columns);
    const column = index % columns;
    const rowWidth = (columns - 1) * 136;
    const startX = anchorX - rowWidth / 2;

    return {
      x: Math.max(72, Math.min(568, startX + column * 136)),
      y: 332 + row * 64,
    };
  });
}

export function findPaperDetailsById(graphData, paperId) {
  const { scholars: scholarsList } = getGraphData(graphData);

  for (const scholar of scholarsList) {
    const papers = Array.isArray(scholar.papers) ? scholar.papers : [];
    for (let index = 0; index < papers.length; index += 1) {
      const paperMeta = buildPaperMeta(scholar, papers[index], index);
      if (paperMeta.id === paperId) {
        return {
          id: paperMeta.id,
          title: paperMeta.title,
          subtitle: scholar.name,
          typeLabel: "论文节点",
          tags: ["论文", "知识沉淀"],
          papers: [],
          relatedProjects: [],
          relatedScholars: [scholar.name],
          description: paperMeta.summary,
          paperUrl: paperMeta.url,
          url: paperMeta.url,
          summary: paperMeta.summary,
          authorLabel: paperMeta.authorLabel,
          context: paperMeta.context,
        };
      }
    }
  }

  return null;
}

export function buildBaseDetails(graphData) {
  const { scholars: scholarsList, projects: projectsList } = getGraphData(graphData);

  const scholarDetails = scholarsList.flatMap((scholar) => [
    {
      id: scholar.id,
      title: scholar.name,
      subtitle: scholar.discipline,
      typeLabel: "认证学者",
      tags: scholar.tags,
      papers: scholar.papers.map((paper) => (typeof paper === "string" ? paper : paper.title)),
      relatedProjects: projectsList
        .filter((project) => scholar.projectIds.includes(project.id))
        .map((project) => project.title),
      description: "该节点代表已通过验证的学者身份，会随着项目参与和论文上传持续扩展连接边。",
    },
    ...scholar.papers.map((paper, index) => {
      const paperMeta = buildPaperMeta(scholar, paper, index);
      return {
        id: paperMeta.id,
        title: paperMeta.title,
        subtitle: scholar.name,
        typeLabel: "论文节点",
        tags: ["论文", "知识沉淀"],
        papers: [],
        relatedProjects: [],
        relatedScholars: [scholar.name],
        description: paperMeta.summary,
        paperUrl: paperMeta.url,
        authorLabel: paperMeta.authorLabel,
        context: paperMeta.context,
      };
    }),
  ]);

  const projectDetails = projectsList.map((project) => ({
    id: project.id,
    title: project.title,
    subtitle: project.stage,
    typeLabel: "项目节点",
    tags: ["项目", project.stage],
    papers: [],
    relatedProjects: [],
    relatedScholars: scholarsList
      .filter((scholar) => scholar.projectIds.includes(project.id))
      .map((scholar) => scholar.name),
    description: project.summary,
  }));

  return [...scholarDetails, ...projectDetails];
}

export function resolveNodeDetails(nodeId, dynamicNodes, detailMap) {
  if (dynamicNodes[nodeId]) {
    return dynamicNodes[nodeId];
  }

  if (nodeId === "self-user") {
    return {
      id: "self-user",
      title: currentUserProfile.name,
      subtitle: currentUserProfile.role,
      typeLabel: "当前用户",
      tags: currentUserProfile.skills,
      papers: [],
      relatedProjects: researchProjects.map((project) => project.title),
      description: "当前用户加入网络后，会以独立节点方式进入学者关系网。",
    };
  }

  return detailMap.get(nodeId) ?? null;
}

export function buildDynamicNodeDetails(networkIdentity, uploadedPapers) {
  const details = {};
  uploadedPapers.forEach((paper) => {
    details[paper.id] = {
      id: paper.id,
      title: paper.label,
      subtitle: "当前用户上传",
      typeLabel: "论文节点",
      tags: ["论文", "新上传"],
      papers: [],
      relatedProjects: [],
      relatedScholars: [networkIdentity?.name ?? currentUserProfile.name],
      description: "这是当前用户上传后自动加入网络的论文节点。",
      paperUrl: paper.url ?? "https://example.org/papers/self-upload",
      authorLabel: networkIdentity?.name ?? currentUserProfile.name,
      context: "该论文在上传后会以成果节点的形式挂接到当前学者节点上。",
    };
  });

  if (networkIdentity?.eligibleForGraph) {
    details["self-user"] = {
      id: "self-user",
      title: networkIdentity.name,
      subtitle: networkIdentity.role,
      typeLabel: "网络成员",
      tags: ["已加入网络", networkIdentity.inviteCode ? "邀请码关联" : "自主加入", "研究学者"],
      papers: uploadedPapers.map((paper) => paper.label),
      relatedProjects: [],
      relatedScholars: networkIdentity.relation ? [networkIdentity.relation] : [],
      description:
        "该成员已具备进入学者网络的资格。若加入项目或上传论文，将在图谱中继续扩展更多关系节点。",
    };
  }

  return details;
}

export function buildScholarGraph(graphData, networkIdentity, uploadedPapers, expandedNodeId = "scholar-2") {
  const { scholars: scholarsList, projects: projectsList } = getGraphData(graphData);
  const baseScholarNodes = buildBaseScholarNodes(scholarsList);
  const nodes = [...baseScholarNodes];
  const edges = [];
  const shouldShowSelfOverlay = networkIdentity?.eligibleForGraph && !hasPersistedScholar(graphData, networkIdentity);

  for (let index = 0; index < scholarsList.length; index += 1) {
    for (let compareIndex = index + 1; compareIndex < scholarsList.length; compareIndex += 1) {
      const current = scholarsList[index];
      const target = scholarsList[compareIndex];
      const sharedProjects = current.projectIds.filter((projectId) => target.projectIds.includes(projectId));
      if (sharedProjects.length > 0) {
        edges.push({
          source: current.id,
          target: target.id,
          relation: `共同项目 ${sharedProjects.length}`,
        });
      }
    }
  }

  if (shouldShowSelfOverlay) {
    nodes.push({
      id: "self-user",
      type: "self",
      x: 320,
      y: 196,
      label: networkIdentity.name,
      subtitle: "当前网络成员",
    });
  }

  if (expandedNodeId) {
    if (expandedNodeId === "self-user" && shouldShowSelfOverlay) {
      uploadedPapers.forEach((paper, index) => {
        const paperNode = {
          id: paper.id,
          type: "paper",
          x: 256 + index * 110,
          y: 94 + (index % 2) * 30,
          label: paper.label,
          subtitle: "上传论文",
          parentId: "self-user",
        };
        nodes.push(paperNode);
        edges.push({ source: "self-user", target: paper.id, relation: "上传成果" });
      });
    } else {
      const expandedProject = projectsList.find((item) => item.id === expandedNodeId);
      if (expandedProject) {
        const projectMembers = scholarsList.filter((scholar) => scholar.projectIds.includes(expandedProject.id));
        const projectFocusedNodes = [];

        const projectFocusedEdges = [];
        const centerX = 320;
        const centerY = 216;
        const memberPositions = getProjectMemberLayout(projectMembers.length, centerX, centerY);

        projectMembers.forEach((scholar, index) => {
          const position = memberPositions[index] ?? { x: centerX, y: centerY - 150 };

          projectFocusedNodes.push({
            id: scholar.id,
            type: "scholar",
            x: position.x,
            y: position.y,
            label: scholar.name,
            subtitle: scholar.discipline,
            parentId: expandedProject.id,
          });
        });

        nodes.push({
          id: expandedProject.id,
          type: "project",
          x: centerX,
          y: centerY,
          label: expandedProject.title.slice(0, 7),
          subtitle: "研究项目",
          labelPosition: "top",
        });

        projectMembers.forEach((scholar) => {
          projectFocusedEdges.push({ source: expandedProject.id, target: scholar.id, relation: "项目成员" });
        });

        if (shouldShowSelfOverlay) {
          projectFocusedNodes.push({
            id: "self-user",
            type: "self",
            x: centerX,
            y: 356,
            label: networkIdentity.name,
            subtitle: "当前网络成员",
          });
        }

        return {
          nodes: [...projectFocusedNodes, ...nodes.filter((node) => node.id === expandedProject.id)],
          edges: projectFocusedEdges,
        };
      }

      const scholar = scholarsList.find((item) => item.id === expandedNodeId);
      if (scholar) {
        const relatedProjects = projectsList.filter((project) => scholar.projectIds.includes(project.id));
        relatedProjects.forEach((project, index) => {
          const projectNode = {
            id: project.id,
            type: "project",
            x: 190 + index * 210,
            y: 262,
            label: project.title.slice(0, 7),
            subtitle: "研究项目",
            parentId: scholar.id,
          };
          if (!nodes.some((node) => node.id === project.id)) {
            nodes.push(projectNode);
          }
          edges.push({ source: scholar.id, target: project.id, relation: "参与项目" });
        });

        scholar.papers.forEach((paper, index) => {
          const paperMeta = buildPaperMeta(scholar, paper, index);
          const paperPosition = getScholarPaperLayout(scholar.papers.length, baseScholarNodes.find((node) => node.id === scholar.id)?.x ?? 320)[index];
          nodes.push({
            id: paperMeta.id,
            type: "paper",
            x: paperPosition.x,
            y: paperPosition.y,
            label: paperMeta.title.split(" ").slice(0, 2).join(" "),
            subtitle: "论文节点",
            parentId: scholar.id,
          });
          edges.push({ source: scholar.id, target: paperMeta.id, relation: "发表论文" });
        });
      }
    }
  }

  return { nodes, edges };
}

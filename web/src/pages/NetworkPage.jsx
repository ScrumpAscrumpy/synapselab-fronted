import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import ActionModal from "../components/ActionModal";
import EmptyState from "../components/EmptyState";
import ErrorState from "../components/ErrorState";
import LoadingState from "../components/LoadingState";
import PaperPreviewModal from "../components/PaperPreviewModal";
import SectionHeader from "../components/SectionHeader";
import useAsyncResource from "../hooks/useAsyncResource";
import ScholarNetworkExplorer from "../components/ScholarNetworkExplorer";
import {
  buildBaseDetails,
  buildDynamicNodeDetails,
  buildScholarGraph,
  findPaperDetailsById,
  readNetworkIdentity,
  resolveNodeDetails,
  updateNetworkIdentity,
} from "../lib/scholarNetwork";
import { addScholarPaper, deleteScholarPaper, getScholarNetwork } from "../services/networkService";

function NetworkPage() {
  const navigate = useNavigate();
  const networkIdentity = useMemo(() => {
    return readNetworkIdentity();
  }, []);
  const [paperOpen, setPaperOpen] = useState(false);
  const [applyOpen, setApplyOpen] = useState(false);
  const [paperPreview, setPaperPreview] = useState(null);
  const [paperTitle, setPaperTitle] = useState("");
  const [paperSummary, setPaperSummary] = useState("");
  const [paperContext, setPaperContext] = useState("");
  const [paperUrl, setPaperUrl] = useState("");
  const [uploadedPapers, setUploadedPapers] = useState([]);
  const [expandedNodeId, setExpandedNodeId] = useState(networkIdentity?.scholarId || "scholar-2");
  const [nodeOverrides, setNodeOverrides] = useState({});
  const [paperSubmitting, setPaperSubmitting] = useState(false);
  const {
    data: graphData,
    loading,
    error,
    setData: setGraphData,
  } = useAsyncResource(() => getScholarNetwork(), []);

  const detailMap = useMemo(
    () => new Map(buildBaseDetails(graphData).map((item) => [item.id, item])),
    [graphData],
  );

  const dynamicNodeDetails = useMemo(() => {
    return buildDynamicNodeDetails(networkIdentity, uploadedPapers);
  }, [networkIdentity, uploadedPapers]);

  const graph = useMemo(() => {
    return buildScholarGraph(graphData, networkIdentity, uploadedPapers, expandedNodeId);
  }, [expandedNodeId, graphData, networkIdentity, uploadedPapers]);
  const displayGraph = useMemo(
    () => ({
      ...graph,
      nodes: graph.nodes.map((node) => ({
        ...node,
        ...(nodeOverrides[node.id] ?? {}),
      })),
    }),
    [graph, nodeOverrides],
  );

  const [selectedNodeId, setSelectedNodeId] = useState(networkIdentity?.scholarId || "scholar-2");

  useEffect(() => {
    if (!graphData?.scholars?.length) {
      return;
    }

    const existingIds = new Set([
      ...graphData.scholars.map((item) => item.id),
      ...(graphData.projects?.map((item) => item.id) ?? []),
    ]);
    const preferredScholarId =
      graphData.scholars.find(
        (item) =>
          (networkIdentity?.scholarId && item.id === networkIdentity.scholarId) ||
          (networkIdentity?.email && item.profileKey === networkIdentity.email) ||
          item.name === networkIdentity?.name,
      )?.id ?? graphData.scholars[0].id;

    if (
      preferredScholarId &&
      (selectedNodeId !== preferredScholarId || selectedNodeId === "self-user") &&
      ((networkIdentity?.scholarId && graphData.scholars.some((item) => item.id === networkIdentity.scholarId)) ||
        !selectedNodeId ||
        (!existingIds.has(selectedNodeId) && selectedNodeId !== "self-user"))
    ) {
      setSelectedNodeId(preferredScholarId);
    }

    if (
      preferredScholarId &&
      (expandedNodeId !== preferredScholarId || expandedNodeId === "self-user") &&
      ((networkIdentity?.scholarId && graphData.scholars.some((item) => item.id === networkIdentity.scholarId)) ||
        !expandedNodeId ||
        (!existingIds.has(expandedNodeId) && expandedNodeId !== "self-user"))
    ) {
      setExpandedNodeId(preferredScholarId);
    }
  }, [expandedNodeId, graphData, networkIdentity?.email, networkIdentity?.name, networkIdentity?.scholarId, selectedNodeId]);

  const selectedNode = useMemo(
    () => resolveNodeDetails(selectedNodeId, dynamicNodeDetails, detailMap),
    [detailMap, dynamicNodeDetails, selectedNodeId],
  );
  const persistedCurrentScholar = useMemo(
    () =>
      graphData?.scholars?.find(
        (item) =>
          (networkIdentity?.scholarId && item.id === networkIdentity.scholarId) ||
          (networkIdentity?.email && item.profileKey === networkIdentity.email) ||
          item.name === networkIdentity?.name,
      ) ?? null,
    [graphData, networkIdentity?.email, networkIdentity?.name, networkIdentity?.scholarId],
  );

  if (loading) {
    return <LoadingState title="正在加载学者网络" description="当前正在从 CloudBase 读取图谱基础数据。" />;
  }

  if (error) {
    return <ErrorState title="学者网络加载失败" description={error} />;
  }

  const handleUploadPaper = () => {
    if (paperSubmitting) {
      return;
    }

    const cleanTitle = paperTitle.trim();
    if (!cleanTitle) {
      return;
    }

    if (!networkIdentity?.eligibleForGraph || !networkIdentity?.name) {
      setPaperOpen(false);
      setApplyOpen(true);
      return;
    }

    setPaperSubmitting(true);
    addScholarPaper({
      scholarId: networkIdentity.scholarId || "",
      profileKey: networkIdentity.email || "",
      name: networkIdentity.name,
      title: cleanTitle,
      summary: paperSummary.trim() || `${cleanTitle} 由当前用户上传，作为学者成果节点写入 SynapseLab 关系图谱。`,
      context: paperContext.trim() || "该论文作为当前研究学者的研究成果节点，向外连接其研究方向与项目关系。",
      url: paperUrl.trim() || `https://example.org/papers/self-${Date.now()}`,
    })
      .then((nextGraphData) => {
        setPaperSubmitting(false);
        setGraphData(nextGraphData);
        setUploadedPapers([]);
        setPaperTitle("");
        setPaperSummary("");
        setPaperContext("");
        setPaperUrl("");
        setPaperOpen(false);
        setNodeOverrides({});

        const nextScholar =
          nextGraphData?.scholars?.find(
            (item) =>
              (networkIdentity.scholarId && item.id === networkIdentity.scholarId) ||
              (networkIdentity.email && item.profileKey === networkIdentity.email) ||
              item.name === networkIdentity.name,
          ) ?? null;

        if (nextScholar?.id) {
          updateNetworkIdentity((current) => ({
            ...(current || {}),
            scholarId: nextScholar.id,
          }));
          setSelectedNodeId(nextScholar.id);
          setExpandedNodeId(nextScholar.id);
        }
      })
      .catch((uploadError) => {
        setPaperSubmitting(false);
        window.alert(uploadError?.message || "论文写入学者网络失败，请稍后再试。");
      });
  };

  const handleDeletePaper = () => {
    if (!paperPreview || !persistedCurrentScholar) {
      return;
    }

    deleteScholarPaper({
      scholarId: persistedCurrentScholar.id,
      profileKey: networkIdentity?.email || "",
      name: networkIdentity?.name || "",
      paperId: paperPreview.id,
    })
      .then((nextGraphData) => {
        setGraphData(nextGraphData);
        setPaperPreview(null);
        setSelectedNodeId(persistedCurrentScholar.id);
        setExpandedNodeId(persistedCurrentScholar.id);
      })
      .catch((deleteError) => {
        window.alert(deleteError?.message || "删除论文失败，请稍后再试。");
      });
  };

  const handleSelectNode = (node) => {
    setSelectedNodeId(node.id);
    if (node.type === "paper") {
      const paperDetails =
        findPaperDetailsById(graphData, node.id) || resolveNodeDetails(node.id, dynamicNodeDetails, detailMap);
      setPaperPreview(paperDetails);
    }
    if (node.type === "scholar" || node.type === "self" || node.type === "project") {
      setExpandedNodeId(node.id);
      return;
    }
    if (node.parentId) {
      setExpandedNodeId(node.parentId);
    }
  };

  const handleNodeMove = (nodeId, position) => {
    setNodeOverrides((current) => ({
      ...current,
      [nodeId]: position,
    }));
  };

  return (
    <div className="page-stack">
      <section className="page-banner">
        <div>
          <h2 className="page-banner__title">学者网络</h2>
          <p className="page-banner__description">
            以学者、项目和论文为节点构建动态知识关系网，加入项目或上传论文后会自动扩展连接。
          </p>
        </div>
        <div className="topbar__actions">
          <button
            className="ghost-button"
            type="button"
            onClick={() => {
              if (!networkIdentity?.eligibleForGraph) {
                setApplyOpen(true);
                return;
              }
              setPaperOpen(true);
            }}
          >
            上传论文
          </button>
        </div>
      </section>

      <section className="page-section">
        <SectionHeader
          eyebrow="Scholar Graph"
          title="关系网络"
          description="点击学者展开项目与论文，点击项目聚焦成员，点击论文查看详情。"
        />
        <ScholarNetworkExplorer
          graph={displayGraph}
          selectedNode={selectedNode}
          selectedNodeId={selectedNodeId}
          onSelectNode={handleSelectNode}
          onNodeMove={handleNodeMove}
          title="关系网络"
          description="支持拖拽节点，便于你手动整理阅读顺序。"
        />
      </section>

      <ActionModal
        open={paperOpen}
        title="上传论文并加入关系网"
        description="填写论文标题、简介、关联说明和原文地址。提交后会写入 CloudBase，并直接出现在你的学者节点周围。"
        confirmLabel={paperSubmitting ? "写入中..." : "上传论文"}
        onClose={() => setPaperOpen(false)}
        onConfirm={handleUploadPaper}
      >
        <label className="form-field">
          <span>论文标题</span>
          <input
            value={paperTitle}
            onChange={(event) => setPaperTitle(event.target.value)}
            placeholder="例如：Adaptive Collaboration Graphs for Interdisciplinary Discovery"
          />
        </label>
        <label className="form-field">
          <span>论文简介</span>
          <textarea
            value={paperSummary}
            onChange={(event) => setPaperSummary(event.target.value)}
            placeholder="简要说明这篇论文研究了什么。"
            rows={4}
          />
        </label>
        <label className="form-field">
          <span>关联说明</span>
          <textarea
            value={paperContext}
            onChange={(event) => setPaperContext(event.target.value)}
            placeholder="例如：该论文用于支撑我在跨学科协作网络中的材料模拟研究路径。"
            rows={3}
          />
        </label>
        <label className="form-field">
          <span>原论文地址</span>
          <input
            value={paperUrl}
            onChange={(event) => setPaperUrl(event.target.value)}
            placeholder="https://..."
          />
        </label>
      </ActionModal>
      <ActionModal
        open={applyOpen}
        title="请先认证研究学者身份"
        description="上传论文和写入学者图谱前，需要先完成研究学者身份认证。你可以先前往个人中心提交申请。"
        confirmLabel="前往认证"
        cancelLabel="关闭"
        onClose={() => setApplyOpen(false)}
        onConfirm={() => {
          setApplyOpen(false);
          navigate("/profile");
        }}
      >
        <div className="hint-panel">
          <strong>为什么需要认证</strong>
          <p>只有研究学者身份会被写入 CloudBase 学者图谱，后续才能关联项目、上传论文并参与真实网络关系。</p>
        </div>
      </ActionModal>
      <PaperPreviewModal
        open={Boolean(paperPreview)}
        paper={paperPreview}
        onClose={() => setPaperPreview(null)}
        onDelete={handleDeletePaper}
        canDelete={Boolean(
          paperPreview &&
            persistedCurrentScholar?.papers?.some((paper) => typeof paper !== "string" && paper.id === paperPreview.id),
        )}
      />
      {!networkIdentity?.eligibleForGraph ? (
        <section className="page-section">
          <EmptyState
            title="你还没有加入学者网络"
            description="浏览者可以使用平台，但不会自动进入学者图谱。只有研究学者身份或已有项目记录的用户才会成为网络节点。请从首页右上角加入网络，并选择研究学者身份。"
          />
        </section>
      ) : null}
      {networkIdentity?.eligibleForGraph && !(persistedCurrentScholar?.papers?.length > 0) && uploadedPapers.length === 0 ? (
        <section className="page-section">
          <EmptyState
            title="当前用户尚未上传论文"
            description="点击右上角“上传论文”后，会在图谱中生成新的论文节点，并与你的学者节点形成成果关联。"
          />
        </section>
      ) : null}
      <section className="page-section">
        <p className="network-page__hint">邀请会连接人，项目会连接协作者，论文会连接成果。</p>
      </section>
    </div>
  );
}

export default NetworkPage;

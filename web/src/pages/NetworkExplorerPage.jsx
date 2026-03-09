import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import ErrorState from "../components/ErrorState";
import LoadingState from "../components/LoadingState";
import PaperPreviewModal from "../components/PaperPreviewModal";
import useAsyncResource from "../hooks/useAsyncResource";
import ScholarNetworkExplorer from "../components/ScholarNetworkExplorer";
import {
  buildBaseDetails,
  buildDynamicNodeDetails,
  buildScholarGraph,
  findPaperDetailsById,
  readNetworkIdentity,
  resolveNodeDetails,
} from "../lib/scholarNetwork";
import { getScholarNetwork } from "../services/networkService";

function NetworkExplorerPage() {
  const [uploadedPapers] = useState([]);
  const [paperPreview, setPaperPreview] = useState(null);
  const [nodeOverrides, setNodeOverrides] = useState({});
  const networkIdentity = useMemo(() => readNetworkIdentity(), []);
  const { data: graphData, loading, error } = useAsyncResource(() => getScholarNetwork(), []);
  const detailMap = useMemo(
    () => new Map(buildBaseDetails(graphData).map((item) => [item.id, item])),
    [graphData],
  );
  const [expandedNodeId, setExpandedNodeId] = useState(
    networkIdentity?.scholarId || (networkIdentity?.eligibleForGraph ? "self-user" : "scholar-2"),
  );
  const dynamicNodeDetails = useMemo(
    () => buildDynamicNodeDetails(networkIdentity, uploadedPapers),
    [networkIdentity, uploadedPapers],
  );
  const graph = useMemo(
    () => buildScholarGraph(graphData, networkIdentity, uploadedPapers, expandedNodeId),
    [expandedNodeId, graphData, networkIdentity, uploadedPapers],
  );
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
  const [selectedNodeId, setSelectedNodeId] = useState(
    networkIdentity?.scholarId || (networkIdentity?.eligibleForGraph ? "self-user" : "scholar-2"),
  );
  const selectedNode = useMemo(
    () => resolveNodeDetails(selectedNodeId, dynamicNodeDetails, detailMap),
    [detailMap, dynamicNodeDetails, selectedNodeId],
  );

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

  if (loading) {
    return <LoadingState title="正在加载全屏图谱" description="当前正在从 CloudBase 读取图谱数据。" />;
  }

  if (error) {
    return <ErrorState title="全屏图谱加载失败" description={error} />;
  }

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
    <div className="network-explorer-page">
      <div className="network-explorer-page__topbar">
        <div>
          <p className="network-detail-card__eyebrow">SynapseLab Graph Mode</p>
          <h1>动态学者关系网</h1>
          <p>默认只呈现人与人之间的连接。点击学者再展开项目与论文，点击项目则只聚焦相关成员。</p>
        </div>
        <div className="topbar__actions">
          <Link className="ghost-button" to="/home">
            返回首页
          </Link>
          <Link className="primary-button" to="/network">
            进入学者网络
          </Link>
        </div>
      </div>

      <ScholarNetworkExplorer
        graph={displayGraph}
        selectedNode={selectedNode}
        selectedNodeId={selectedNodeId}
        onSelectNode={handleSelectNode}
        onNodeMove={handleNodeMove}
        title="全屏关系网络"
        description="该模式更适合作为欢迎页中的沉浸式图谱入口，也更适合答辩时演示学者、项目和论文之间的结构化关系。"
      />
      <PaperPreviewModal open={Boolean(paperPreview)} paper={paperPreview} onClose={() => setPaperPreview(null)} />
    </div>
  );
}

export default NetworkExplorerPage;

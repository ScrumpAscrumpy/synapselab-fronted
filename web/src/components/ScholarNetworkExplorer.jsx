import { useRef } from "react";
import EmptyState from "./EmptyState";

function getNodeRadius(node) {
  if (node.type === "project") {
    return 20;
  }
  if (node.type === "paper") {
    return 13;
  }
  if (node.type === "self") {
    return 25;
  }
  return 21;
}

function getLabelLayout(node, radius) {
  if (node.labelPosition === "top" || node.type === "project") {
    return {
      rectY: node.y - radius - 34,
      textY: node.y - radius - 18,
    };
  }

  return {
    rectY: node.y + radius + 8,
    textY: node.y + radius + 24,
  };
}

function ScholarNetworkExplorer({
  graph,
  selectedNode,
  selectedNodeId,
  onSelectNode,
  onNodeMove,
  compact = false,
  title = "关系网络",
  description = "学者、项目与论文在同一张动态图谱中持续扩展。",
}) {
  const svgRef = useRef(null);
  const dragStateRef = useRef(null);
  const suppressClickRef = useRef(false);

  const updateDragPosition = (event) => {
    if (!dragStateRef.current || !svgRef.current || typeof onNodeMove !== "function") {
      return;
    }

    const svg = svgRef.current;
    const rect = svg.getBoundingClientRect();
    const viewBox = svg.viewBox.baseVal;
    const nextX = ((event.clientX - rect.left) / rect.width) * viewBox.width;
    const nextY = ((event.clientY - rect.top) / rect.height) * viewBox.height;
    const deltaX = nextX - dragStateRef.current.startPointerX;
    const deltaY = nextY - dragStateRef.current.startPointerY;

    if (Math.abs(deltaX) > 2 || Math.abs(deltaY) > 2) {
      suppressClickRef.current = true;
    }

    onNodeMove(dragStateRef.current.nodeId, {
      x: Math.max(48, Math.min(viewBox.width - 48, dragStateRef.current.originX + deltaX)),
      y: Math.max(42, Math.min(viewBox.height - 42, dragStateRef.current.originY + deltaY)),
    });
  };

  const finishDrag = () => {
    dragStateRef.current = null;
    window.removeEventListener("pointermove", updateDragPosition);
    window.removeEventListener("pointerup", finishDrag);
  };

  const handlePointerDown = (event, node) => {
    if (typeof onNodeMove !== "function") {
      return;
    }

    const svg = svgRef.current;
    if (!svg) {
      return;
    }

    const rect = svg.getBoundingClientRect();
    const viewBox = svg.viewBox.baseVal;
    dragStateRef.current = {
      nodeId: node.id,
      originX: node.x,
      originY: node.y,
      startPointerX: ((event.clientX - rect.left) / rect.width) * viewBox.width,
      startPointerY: ((event.clientY - rect.top) / rect.height) * viewBox.height,
    };
    suppressClickRef.current = false;
    window.addEventListener("pointermove", updateDragPosition);
    window.addEventListener("pointerup", finishDrag);
  };

  const handleNodeClick = (node) => {
    if (suppressClickRef.current) {
      suppressClickRef.current = false;
      return;
    }

    onSelectNode(node);
  };

  return (
    <div className={compact ? "network-explorer network-explorer--compact" : "network-explorer"}>
      <div className="network-explorer__canvas-panel">
        {!compact ? (
          <div className="network-explorer__header">
            <p className="network-detail-card__eyebrow">Graph Explorer</p>
            <h3>{title}</h3>
            <p>{description} 可直接拖拽节点，手动调整展示位置。</p>
          </div>
        ) : null}
        <svg
          ref={svgRef}
          viewBox={compact ? "0 0 640 360" : "0 0 640 420"}
          className={compact ? "network-canvas network-canvas--compact" : "network-canvas"}
          aria-label="学者关系网络图"
        >
          <defs>
            <filter id="networkNodeGlow">
              <feGaussianBlur stdDeviation="5" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
            <linearGradient id="networkEdgeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="rgba(137, 209, 255, 0.18)" />
              <stop offset="100%" stopColor="rgba(18, 219, 114, 0.36)" />
            </linearGradient>
          </defs>

          <g className="network-canvas__constellation">
            {graph.nodes.map((node) => (
              <circle
                key={`constellation-${node.id}`}
                cx={node.x}
                cy={node.y}
                r={node.type === "project" ? 54 : node.type === "paper" ? 28 : 42}
                className={`network-canvas__halo network-canvas__halo--${node.type}`}
              />
            ))}
          </g>

          {graph.edges.map((edge) => {
            const source = graph.nodes.find((node) => node.id === edge.source);
            const target = graph.nodes.find((node) => node.id === edge.target);
            if (!source || !target) {
              return null;
            }
            return (
              <line
                key={`${edge.source}-${edge.target}-${edge.relation}`}
                x1={source.x}
                y1={source.y}
                x2={target.x}
                y2={target.y}
                className="network-canvas__edge"
              />
            );
          })}

          {graph.nodes.map((node) => {
            const radius = getNodeRadius(node);
            const isActive = selectedNodeId === node.id;
            const labelLayout = getLabelLayout(node, radius);
            return (
              <g
                key={node.id}
                className={isActive ? "network-canvas__group network-canvas__group--active" : "network-canvas__group"}
                onClick={() => handleNodeClick(node)}
                onPointerDown={(event) => handlePointerDown(event, node)}
              >
                {isActive ? (
                  <circle
                    cx={node.x}
                    cy={node.y}
                    r={radius + 11}
                    className="network-canvas__active-ring"
                  />
                ) : null}
                <circle
                  cx={node.x}
                  cy={node.y}
                  r={radius + 5}
                  className="network-canvas__node-core"
                  filter="url(#networkNodeGlow)"
                />
                <circle
                  cx={node.x}
                  cy={node.y}
                  r={radius}
                  className={`network-canvas__node network-canvas__node--${node.type}`}
                />
                <rect
                  x={node.x - 56}
                  y={labelLayout.rectY}
                  width="112"
                  height="24"
                  rx="12"
                  className="network-canvas__label-bg"
                />
                <text x={node.x} y={labelLayout.textY} textAnchor="middle">
                  {node.label}
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      {!compact ? (
        <aside className="network-side-panel">
          {selectedNode ? (
            <div className="network-detail-card">
              <p className="network-detail-card__eyebrow">{selectedNode.typeLabel}</p>
              <h3>{selectedNode.title}</h3>
              <p className="network-detail-card__subtitle">{selectedNode.subtitle}</p>
              <p className="network-detail-card__description">{selectedNode.description}</p>

              {selectedNode.tags?.length ? (
                <div className="scholar-card__tags">
                  {selectedNode.tags.map((tag) => (
                    <span key={tag} className="tag-pill tag-pill--subtle">
                      {tag}
                    </span>
                  ))}
                </div>
              ) : null}

              <div className="network-detail-card__metrics">
                <div className="network-detail-card__metric">
                  <span>关联学者</span>
                  <strong>{selectedNode.relatedScholars?.length ?? 0}</strong>
                </div>
                <div className="network-detail-card__metric">
                  <span>关联项目</span>
                  <strong>{selectedNode.relatedProjects?.length ?? 0}</strong>
                </div>
                <div className="network-detail-card__metric">
                  <span>关联论文</span>
                  <strong>{selectedNode.papers?.length ?? 0}</strong>
                </div>
              </div>

              <div className="network-detail-card__section">
                <strong>关联项目</strong>
                {selectedNode.relatedProjects?.length ? (
                  <ul className="network-detail-card__list">
                    {selectedNode.relatedProjects.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                ) : (
                  <EmptyState title="暂无关联项目" description="该节点当前还没有记录到相关项目。" />
                  )}
                </div>

              <div className="network-detail-card__section">
                <strong>关联学者</strong>
                {selectedNode.relatedScholars?.length ? (
                  <ul className="network-detail-card__list">
                    {selectedNode.relatedScholars.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                ) : (
                  <EmptyState title="暂无关联学者" description="当前节点还没有展开可展示的学者关系。" />
                )}
              </div>

              <div className="network-detail-card__section">
                <strong>关联论文</strong>
                {selectedNode.papers?.length ? (
                  <ul className="network-detail-card__list">
                    {selectedNode.papers.map((paper) => (
                      <li key={paper}>{paper}</li>
                    ))}
                  </ul>
                ) : (
                  <EmptyState title="暂无论文节点" description="上传论文后，该学者会向外扩展新的论文关联。" />
                )}
              </div>
            </div>
          ) : null}
        </aside>
      ) : null}
    </div>
  );
}

export default ScholarNetworkExplorer;

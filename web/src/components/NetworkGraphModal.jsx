const graphNodes = [
  { id: "hub", label: "SynapseLab", x: 320, y: 170, kind: "hub" },
  { id: "aurora", label: "Aurora Lin", x: 130, y: 90, kind: "scholar", meta: "计算生物学" },
  { id: "elon", label: "Elon M.", x: 520, y: 86, kind: "scholar", meta: "系统工程" },
  { id: "chen", label: "Prof. Chen", x: 172, y: 264, kind: "scholar", meta: "认知神经科学" },
  { id: "mars", label: "火星栖居体", x: 500, y: 258, kind: "idea", meta: "旗舰挑战" },
  { id: "studio", label: "研究工作室", x: 320, y: 56, kind: "cluster", meta: "项目协同" },
  { id: "ideation", label: "思想熔炉", x: 318, y: 302, kind: "cluster", meta: "科研猜想" },
];

const graphEdges = [
  ["hub", "aurora"],
  ["hub", "elon"],
  ["hub", "chen"],
  ["hub", "mars"],
  ["hub", "studio"],
  ["hub", "ideation"],
  ["aurora", "mars"],
  ["chen", "ideation"],
  ["elon", "studio"],
];

function getNodeById(id) {
  return graphNodes.find((node) => node.id === id);
}

function NetworkGraphModal({ open, onClose }) {
  if (!open) {
    return null;
  }

  return (
    <div className="modal-backdrop" role="presentation" onClick={onClose}>
      <div
        className="modal-panel modal-panel--graph"
        role="dialog"
        aria-modal="true"
        aria-label="探索图谱"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="modal-panel__header">
          <div>
            <p className="section-header__eyebrow">探索图谱</p>
            <h3 className="modal-panel__title">跨学科连接网络</h3>
            <p className="modal-panel__description">
              通过研究者、猜想与工作室之间的关系，快速理解平台中的协作脉络。
            </p>
          </div>
          <button className="ghost-button ghost-button--small" type="button" onClick={onClose}>
            关闭
          </button>
        </div>

        <div className="graph-modal">
          <div className="graph-canvas">
            <svg viewBox="0 0 640 360" className="graph-canvas__svg" aria-hidden="true">
              {graphEdges.map(([fromId, toId]) => {
                const from = getNodeById(fromId);
                const to = getNodeById(toId);
                return (
                  <line
                    key={`${fromId}-${toId}`}
                    x1={from.x}
                    y1={from.y}
                    x2={to.x}
                    y2={to.y}
                    className="graph-canvas__edge"
                  />
                );
              })}

              {graphNodes.map((node) => (
                <g key={node.id}>
                  <circle
                    cx={node.x}
                    cy={node.y}
                    r={node.kind === "hub" ? 32 : 16}
                    className={`graph-canvas__node graph-canvas__node--${node.kind}`}
                  />
                  <text x={node.x} y={node.y + (node.kind === "hub" ? 54 : 34)} textAnchor="middle">
                    {node.label}
                  </text>
                </g>
              ))}
            </svg>
          </div>

          <div className="graph-sidebar">
            <div className="graph-sidebar__card">
              <p className="graph-sidebar__label">当前视图</p>
              <strong>研究者 - 猜想 - 项目 三层关联</strong>
              <p>用于答辩展示网络式人际关系与课题连接结构。</p>
            </div>
            <div className="graph-sidebar__list">
              {graphNodes
                .filter((node) => node.kind !== "hub")
                .map((node) => (
                  <div key={node.id} className="graph-sidebar__item">
                    <strong>{node.label}</strong>
                    <span>{node.meta}</span>
                  </div>
                ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default NetworkGraphModal;

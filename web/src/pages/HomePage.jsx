import { useNavigate, useOutletContext } from "react-router-dom";
import { researchProjects, scholars } from "../mock/ideas";

function HomePage() {
  const { onPublishIdea, onOpenGraphMode } = useOutletContext();
  const navigate = useNavigate();

  const metrics = [
    { label: "新增猜想", value: "128", hint: "本周持续上升" },
    { label: "入驻学者", value: String(scholars.length).padStart(2, "0"), hint: "持续扩展网络" },
    {
      label: "学科热点项目",
      value: String(researchProjects.length).padStart(2, "0"),
      hint: "正在进行交叉研究",
    },
  ];

  return (
    <div className="home-page">
      <section className="home-stage">
        <div className="home-stage__veil" aria-hidden="true" />
        <div className="home-stage__content">
          <div className="home-stage__intro">
            <p className="hero-panel__eyebrow">连接孤岛，催化创新</p>
            <h2 className="home-stage__title">SynapseLab</h2>
            <p className="home-stage__description">
              构建一个以“问题”为原子、跨学科协作为化学键的动态知识网络，
              让每一个伟大的猜想都能找到其验证路径。
            </p>
            <div className="home-stage__actions">
              <button className="primary-button" type="button" onClick={onPublishIdea}>
                发布新猜想
              </button>
              <button className="ghost-button" type="button" onClick={() => navigate("/network")}>
                链接学者
              </button>
            </div>
          </div>

          <div className="home-stage__visual" aria-hidden="true">
            <button className="home-stage__graph-trigger" type="button" onClick={onOpenGraphMode}>
              <div className="network-globe">
                <div className="network-globe__core">SL</div>
                <span className="network-globe__orbit network-globe__orbit--one" />
                <span className="network-globe__orbit network-globe__orbit--two" />
                <span className="network-globe__orbit network-globe__orbit--three" />
                <span className="network-globe__node network-globe__node--a" />
                <span className="network-globe__node network-globe__node--b" />
                <span className="network-globe__node network-globe__node--c" />
                <span className="network-globe__node network-globe__node--d" />
              </div>
              <span className="home-stage__graph-caption">点击进入全屏图谱模式</span>
            </button>
          </div>
        </div>

        <div className="home-stage__metrics home-stage__metrics--board">
          {metrics.map((item) => (
            <div key={item.label} className="home-stage__metric home-stage__metric--minimal">
              <span>{item.label}</span>
              <strong>{item.value}</strong>
              <small>{item.hint}</small>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

export default HomePage;

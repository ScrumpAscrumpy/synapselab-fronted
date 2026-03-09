import { useState } from "react";
import { Link } from "react-router-dom";
import ActionModal from "./ActionModal";

function IdeaCard({ idea }) {
  const [open, setOpen] = useState(false);
  const [stake, setStake] = useState("100");
  const [submitted, setSubmitted] = useState(false);

  const tags = Array.isArray(idea.tags) ? idea.tags : [];

  const handleConfirm = () => {
    setSubmitted(true);
    setOpen(false);
  };

  return (
    <>
      <article className="idea-card">
        <div className="idea-card__tags">
          {tags.map((tag) => (
            <span key={tag} className="tag-pill">
              {tag}
            </span>
          ))}
          <span className="idea-card__trend">{idea.trend || "普通"}</span>
        </div>

        <h3 className="idea-card__title">{idea.title}</h3>
        <p className="idea-card__summary">{idea.summary || "当前没有摘要说明。"}</p>

        <div className="idea-card__insight">
          <div className="idea-card__insight-icon">AI</div>
          <div>
            <p className="idea-card__insight-title">Lumina 快速分析</p>
            <p className="idea-card__insight-text">{idea.aiInsight || "当前尚未生成 AI 分析。"}</p>
          </div>
        </div>

        {submitted ? (
          <p className="inline-feedback">已为该猜想登记一次积分下注意向，后续可接真实积分系统。</p>
        ) : null}

        <div className="idea-card__footer">
          <span className="idea-card__energy">⚡ {idea.energy ?? 0}</span>
          <div className="idea-card__actions">
            <Link className="ghost-button ghost-button--small button-link" to={`/ideation/${idea.id}`}>
              查看详情
            </Link>
            <button
              className="primary-button primary-button--small"
              type="button"
              onClick={() => setOpen(true)}
            >
              积分下注
            </button>
          </div>
        </div>
      </article>

      <ActionModal
        open={open}
        title="积分下注"
        description="记录你对这个猜想的支持强度。当前版本先保存为前端交互反馈。"
        confirmLabel="确认下注"
        onClose={() => setOpen(false)}
        onConfirm={handleConfirm}
      >
        <label className="form-field">
          <span>下注积分</span>
          <input value={stake} onChange={(event) => setStake(event.target.value)} />
        </label>
      </ActionModal>
    </>
  );
}

export default IdeaCard;

import { useState } from "react";
import ActionModal from "./ActionModal";

function ScholarCard({ scholar }) {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("希望邀请你参与一个跨学科协作项目。");
  const [submitted, setSubmitted] = useState(false);

  return (
    <>
      <article className="scholar-card">
        <div className="scholar-card__avatar">{scholar.name.slice(0, 1)}</div>
        <h3 className="scholar-card__name">{scholar.name}</h3>
        <p className="scholar-card__discipline">{scholar.discipline}</p>
        <div className="scholar-card__tags">
          {scholar.tags.map((tag) => (
            <span key={tag} className="tag-pill tag-pill--subtle">
              {tag}
            </span>
          ))}
        </div>
        {submitted ? <p className="inline-feedback">连接意向已记录，后续可接通知系统。</p> : null}
        <button className="ghost-button ghost-button--small" type="button" onClick={() => setOpen(true)}>
          发起连接
        </button>
      </article>

      <ActionModal
        open={open}
        title={`发起与 ${scholar.name} 的连接`}
        description="当前版本先记录连接消息，用于演示跨学科协作入口。"
        confirmLabel="发送连接"
        onClose={() => setOpen(false)}
        onConfirm={() => {
          setSubmitted(true);
          setOpen(false);
        }}
      >
        <label className="form-field">
          <span>连接消息</span>
          <textarea
            rows="4"
            value={message}
            onChange={(event) => setMessage(event.target.value)}
          />
        </label>
      </ActionModal>
    </>
  );
}

export default ScholarCard;

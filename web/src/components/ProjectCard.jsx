import { useState } from "react";
import { Link } from "react-router-dom";
import ActionModal from "./ActionModal";

function ProjectCard({ project }) {
  const [open, setOpen] = useState(false);
  const [invite, setInvite] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const members = Array.isArray(project.members)
    ? project.members
    : Array.isArray(project.memberIds)
      ? project.memberIds
      : [];

  return (
    <>
      <article className="project-card">
        <div className="project-card__header">
          <div>
            <p className="project-card__badge">{project.stage || "未设置"}</p>
            <h3 className="project-card__title">{project.title}</h3>
          </div>
          <div className="project-card__avatars">
            {members.map((member) => (
              <span key={member} className="project-card__avatar">
                {String(member).slice(0, 1)}
              </span>
            ))}
          </div>
        </div>

        <div className="project-card__progress-row">
          <span>项目进度</span>
          <strong>{project.progress ?? 0}%</strong>
        </div>
        <div className="progress-bar">
          <div className="progress-bar__value" style={{ width: `${project.progress ?? 0}%` }} />
        </div>

        <p className="project-card__next-step">{project.nextStep || "当前还没有下一步说明。"}</p>

        {submitted ? <p className="inline-feedback">邀请草稿已记录，后续可接通知与成员系统。</p> : null}

        <div className="project-card__footer">
          <Link className="primary-button button-link" to={`/studio/${project.id}`}>
            进入工作室
          </Link>
          <button className="ghost-button" type="button" onClick={() => setOpen(true)}>
            邀请成员
          </button>
        </div>
      </article>

      <ActionModal
        open={open}
        title="邀请成员"
        description="当前版本先登记邀请对象，用于演示协作流程。"
        confirmLabel="发送邀请"
        onClose={() => setOpen(false)}
        onConfirm={() => {
          setSubmitted(true);
          setOpen(false);
        }}
      >
        <label className="form-field">
          <span>成员姓名或邮箱</span>
          <input
            value={invite}
            onChange={(event) => setInvite(event.target.value)}
            placeholder="例如：aurora.lin@example.com"
          />
        </label>
      </ActionModal>
    </>
  );
}

export default ProjectCard;

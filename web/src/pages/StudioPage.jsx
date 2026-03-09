import { useState } from "react";
import ActionModal from "../components/ActionModal";
import ProjectCard from "../components/ProjectCard";
import SectionHeader from "../components/SectionHeader";
import { researchProjects } from "../mock/ideas";

function StudioPage() {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [created, setCreated] = useState(false);

  return (
    <div className="page-stack">
      <section className="page-banner">
        <div>
          <h2 className="page-banner__title">研究工作室</h2>
          <p className="page-banner__description">
            面向正式协作项目的严谨工作区，支持阶段推进、成员协作和过程记录。
          </p>
        </div>
        <button className="primary-button" type="button" onClick={() => setOpen(true)}>
          + 新建项目
        </button>
      </section>

      {created ? (
        <section className="status-panel">
          <h3>项目草稿已创建</h3>
          <p>当前版本先记录新建项目信息，后续可接真实项目创建接口。</p>
        </section>
      ) : null}

      <section className="page-section">
        <SectionHeader
          eyebrow="进行中的项目"
          title="当前工作室概览"
          description="先用静态示例数据建立整体体验，后续会接入真实的 CloudBase 项目数据。"
        />
        <div className="two-column-grid">
          {researchProjects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      </section>

      <section className="page-section">
        <div className="detail-card">
          <p className="section-header__eyebrow">协作方式</p>
          <h3>研究工作室后续会支持什么</h3>
          <div className="timeline-list">
            <div className="timeline-item">
              <span className="timeline-item__index">1</span>
              <p>项目阶段推进和条件校验</p>
            </div>
            <div className="timeline-item">
              <span className="timeline-item__index">2</span>
              <p>成员邀请、角色分配和协作记录</p>
            </div>
            <div className="timeline-item">
              <span className="timeline-item__index">3</span>
              <p>Lumina 自动生成会议摘要和待办事项</p>
            </div>
          </div>
        </div>
      </section>

      <ActionModal
        open={open}
        title="新建项目"
        description="当前版本先记录项目草稿，用于演示研究工作室入口。"
        confirmLabel="创建草稿"
        onClose={() => setOpen(false)}
        onConfirm={() => {
          setCreated(true);
          setOpen(false);
        }}
      >
        <label className="form-field">
          <span>项目标题</span>
          <input
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            placeholder="例如：跨模态药效协同研究"
          />
        </label>
      </ActionModal>
    </div>
  );
}

export default StudioPage;

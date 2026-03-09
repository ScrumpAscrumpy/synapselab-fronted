import { useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import DiscussionPanel from "../components/DiscussionPanel";
import ErrorState from "../components/ErrorState";
import LoadingState from "../components/LoadingState";
import useAsyncResource from "../hooks/useAsyncResource";
import { readNetworkIdentity } from "../lib/scholarNetwork";
import { linkScholarProject } from "../services/networkService";
import { getProjectById } from "../services/projectsService";

function ProjectDetailPage() {
  const { projectId } = useParams();
  const [linked, setLinked] = useState(false);
  const networkIdentity = useMemo(() => readNetworkIdentity(), []);
  const { data: project, loading, error } = useAsyncResource(
    () => getProjectById(projectId),
    [projectId],
  );

  if (loading) {
    return <LoadingState title="正在加载项目详情" description="项目内容正在读取。" />;
  }

  if (error) {
    return <ErrorState title="项目详情加载失败" description={error} />;
  }

  if (!project) {
    return (
      <section className="placeholder-panel">
        <h3>未找到对应项目</h3>
        <p>当前项目详情还在使用模拟数据，后续会接入 CloudBase 的真实项目表。</p>
        <Link className="primary-button detail-back-link" to="/studio">
          返回研究工作室
        </Link>
      </section>
    );
  }

  const members = Array.isArray(project.members)
    ? project.members
    : Array.isArray(project.memberIds)
      ? project.memberIds
      : [];
  const milestones = Array.isArray(project.milestones) ? project.milestones : [];
  const progress = typeof project.progress === "number" ? project.progress : 0;
  const summary = project.summary || "当前项目还没有补充摘要。";
  const objective = project.objective || "当前项目目标尚未填写。";
  const nextStep = project.nextStep || "当前还没有明确的下一步安排。";
  const discussionSummary = project.discussionSummary || "当前还没有讨论摘要。";

  const handleLinkProject = async () => {
    if (!networkIdentity?.eligibleForGraph || !networkIdentity?.name) {
      window.alert("请先以研究学者身份加入网络，再把项目关联到你的学者节点。");
      return;
    }

    try {
      await linkScholarProject({
        profileKey: networkIdentity.email || "",
        name: networkIdentity.name,
        projectId: project.id,
        projectTitle: project.title,
        projectStage: project.stage,
        projectSummary: summary,
      });
      setLinked(true);
    } catch (linkError) {
      window.alert(linkError?.message || "项目关联失败，请稍后再试。");
    }
  };

  return (
    <div className="page-stack">
      <section className="detail-hero">
        <div className="detail-hero__content">
          <p className="section-header__eyebrow">项目详情</p>
          <h2 className="detail-hero__title">{project.title}</h2>
          <p className="detail-hero__description">{summary}</p>
          <div className="detail-meta">
            <span>当前阶段：{project.stage || "未设置"}</span>
            <span>成员：{members.length > 0 ? members.join(" / ") : "暂无成员信息"}</span>
            <span>进度：{progress}%</span>
          </div>
        </div>
        <div className="detail-side-card">
          <p className="section-header__eyebrow">项目目标</p>
          <h3>当前要解决的问题</h3>
          <p>{objective}</p>
          <div className="topbar__actions">
            <button
              className="ghost-button"
              type="button"
              onClick={handleLinkProject}
            >
              {linked ? "已关联到我的图谱" : "关联到我的图谱"}
            </button>
          </div>
        </div>
      </section>

      <section className="detail-card">
        <p className="section-header__eyebrow">阶段推进</p>
        <h3>项目里程碑</h3>
        {milestones.length > 0 ? (
          <div className="milestone-grid">
            {milestones.map((milestone, index) => (
              <div
                key={milestone.label || `${index}`}
                className={milestone.done ? "milestone-card milestone-card--done" : "milestone-card"}
              >
                <span className="milestone-card__index">{index + 1}</span>
                <strong>{milestone.label || "未命名阶段"}</strong>
                <p>{milestone.done ? "已完成当前阶段准备" : "待推进"}</p>
              </div>
            ))}
          </div>
        ) : (
          <p className="detail-hero__description">当前还没有配置项目里程碑。</p>
        )}
      </section>

      <section className="detail-grid">
        <article className="detail-card">
          <p className="section-header__eyebrow">下一步</p>
          <h3>待办聚焦</h3>
          <p>{nextStep}</p>
        </article>
        <article className="detail-card">
          <p className="section-header__eyebrow">讨论摘要</p>
          <h3>Lumina 会议记录</h3>
          <p>{discussionSummary}</p>
        </article>
      </section>

      <DiscussionPanel projectId={project.id} />
    </div>
  );
}

export default ProjectDetailPage;

import { Link, useParams } from "react-router-dom";
import CommentSection from "../components/CommentSection";
import ErrorState from "../components/ErrorState";
import LoadingState from "../components/LoadingState";
import useAsyncResource from "../hooks/useAsyncResource";
import { getIdeaById } from "../services/ideasService";

function IdeaDetailPage() {
  const { ideaId } = useParams();
  const { data: idea, loading, error } = useAsyncResource(() => getIdeaById(ideaId), [ideaId]);

  if (loading) {
    return <LoadingState title="正在加载猜想详情" description="猜想内容正在读取。" />;
  }

  if (error) {
    return <ErrorState title="猜想详情加载失败" description={error} />;
  }

  if (!idea) {
    return (
      <section className="placeholder-panel">
        <h3>未找到对应猜想</h3>
        <p>当前 ID 没有匹配到数据，后续接入 CloudBase 后会从真实数据库中读取。</p>
        <Link className="primary-button detail-back-link" to="/ideation">
          返回思想熔炉
        </Link>
      </section>
    );
  }

  const tags = Array.isArray(idea.tags) ? idea.tags : [];
  const nextActions = Array.isArray(idea.nextActions) ? idea.nextActions : [];
  const relatedDisciplines = Array.isArray(idea.relatedDisciplines) ? idea.relatedDisciplines : [];
  const summary = idea.summary || "当前还没有补充摘要。";
  const challenge = idea.challenge || "当前还没有补充核心挑战。";
  const opportunity = idea.opportunity || "当前还没有补充潜在价值。";
  const author = idea.author || idea.authorName || "未知用户";
  const aiInsight = idea.aiInsight || "当前还没有 AI 分析结果。";

  return (
    <div className="page-stack">
      <section className="detail-hero">
        <div className="detail-hero__content">
          <div className="idea-card__tags">
            {tags.map((tag) => (
              <span key={tag} className="tag-pill">
                {tag}
              </span>
            ))}
            <span className="idea-card__trend">{idea.trend || "普通"}</span>
          </div>
          <h2 className="detail-hero__title">{idea.title}</h2>
          <p className="detail-hero__description">{summary}</p>
          <div className="detail-meta">
            <span>{author}</span>
            <span>{idea.authorRole || ""}</span>
            <span>{idea.createdAt || ""}</span>
            <span>⚡ {idea.energy ?? 0}</span>
          </div>
        </div>
        <div className="detail-side-card">
          <p className="section-header__eyebrow">Lumina 建议</p>
          <h3>初步可行性判断</h3>
          <p>{aiInsight}</p>
          <button className="primary-button" type="button">
            生成完整分析
          </button>
        </div>
      </section>

      <section className="detail-grid">
        <article className="detail-card">
          <p className="section-header__eyebrow">核心挑战</p>
          <h3>为什么这个问题值得做</h3>
          <p>{challenge}</p>
        </article>
        <article className="detail-card">
          <p className="section-header__eyebrow">潜在价值</p>
          <h3>如果成立，会产生什么影响</h3>
          <p>{opportunity}</p>
        </article>
      </section>

      <section className="detail-card">
        <p className="section-header__eyebrow">建议路径</p>
        <h3>下一步验证动作</h3>
        {nextActions.length > 0 ? (
          <div className="timeline-list">
            {nextActions.map((action, index) => (
              <div key={action} className="timeline-item">
                <span className="timeline-item__index">{index + 1}</span>
                <p>{action}</p>
              </div>
            ))}
          </div>
        ) : (
          <p className="detail-hero__description">当前还没有配置下一步验证动作。</p>
        )}
      </section>

      <section className="detail-card">
        <p className="section-header__eyebrow">跨学科连接</p>
        <h3>相关学科</h3>
        {relatedDisciplines.length > 0 ? (
          <div className="idea-card__tags">
            {relatedDisciplines.map((discipline) => (
              <span key={discipline} className="tag-pill tag-pill--subtle">
                {discipline}
              </span>
            ))}
          </div>
        ) : (
          <p className="detail-hero__description">当前还没有补充相关学科。</p>
        )}
      </section>

      <CommentSection targetType="idea" targetId={idea.id} title="针对这个猜想的评论" />
    </div>
  );
}

export default IdeaDetailPage;

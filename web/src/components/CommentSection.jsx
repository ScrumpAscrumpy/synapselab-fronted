import { useState } from "react";
import useAsyncResource from "../hooks/useAsyncResource";
import EmptyState from "./EmptyState";
import ErrorState from "./ErrorState";
import LoadingState from "./LoadingState";
import { createComment, getCommentsByTarget } from "../services/commentsService";

function CommentSection({ targetType, targetId, title = "评论区" }) {
  const [content, setContent] = useState("");
  const { data: items = [], loading, error, setData } = useAsyncResource(
    () => getCommentsByTarget(targetType, targetId),
    [targetId, targetType],
  );

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!content.trim()) {
      return;
    }

    const created = await createComment({
      targetType,
      targetId,
      content: content.trim(),
    });

    setData((current) => [created, ...(current || [])]);
    setContent("");
  };

  return (
    <section className="detail-card">
      <p className="section-header__eyebrow">互动反馈</p>
      <h3>{title}</h3>
      <form className="inline-form" onSubmit={handleSubmit}>
        <textarea
          value={content}
          onChange={(event) => setContent(event.target.value)}
          rows="3"
          placeholder="写下你的建议、质疑或协作想法。"
        />
        <button className="primary-button" type="submit">
          发布评论
        </button>
      </form>

      {loading ? <LoadingState title="正在加载评论" description="评论内容正在读取。" /> : null}
      {!loading && error ? (
        <ErrorState title="评论加载失败" description={error} />
      ) : null}
      {!loading && !error && items.length === 0 ? (
        <EmptyState title="还没有评论" description="你可以成为第一个参与讨论的人。" />
      ) : null}

      {!loading && !error && items.length > 0 ? (
        <div className="discussion-list">
          {items.map((item) => (
            <article key={item.id} className="discussion-card">
              <div className="discussion-card__meta">
                <strong>{item.authorName}</strong>
                <span>{item.authorRole}</span>
                <span>{item.createdAt}</span>
              </div>
              <p>{item.content}</p>
            </article>
          ))}
        </div>
      ) : null}
    </section>
  );
}

export default CommentSection;

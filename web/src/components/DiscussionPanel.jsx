import { useState } from "react";
import useAsyncResource from "../hooks/useAsyncResource";
import EmptyState from "./EmptyState";
import ErrorState from "./ErrorState";
import LoadingState from "./LoadingState";
import {
  createProjectDiscussion,
  getProjectDiscussions,
} from "../services/discussionsService";

function DiscussionPanel({ projectId }) {
  const [content, setContent] = useState("");
  const { data: items = [], loading, error, setData } = useAsyncResource(
    () => getProjectDiscussions(projectId),
    [projectId],
  );

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!content.trim()) {
      return;
    }

    const created = await createProjectDiscussion({
      projectId,
      content: content.trim(),
    });

    setData((current) => [created, ...(current || [])]);
    setContent("");
  };

  return (
    <section className="detail-card">
      <p className="section-header__eyebrow">圆桌讨论区</p>
      <h3>项目讨论与记录</h3>
      <form className="inline-form" onSubmit={handleSubmit}>
        <textarea
          value={content}
          onChange={(event) => setContent(event.target.value)}
          rows="4"
          placeholder="记录新的讨论观点、待办事项或实验疑问。"
        />
        <button className="primary-button" type="submit">
          发布讨论
        </button>
      </form>
      {loading ? <LoadingState title="正在加载讨论" description="项目讨论记录正在读取。" /> : null}
      {!loading && error ? (
        <ErrorState title="讨论加载失败" description={error} />
      ) : null}
      {!loading && !error && items.length === 0 ? (
        <EmptyState title="还没有讨论记录" description="你可以先发起第一条项目讨论。" />
      ) : null}

      {!loading && !error && items.length > 0 ? (
        <div className="discussion-list">
          {items.map((item) => (
            <article key={item.id} className="discussion-card">
              <div className="discussion-card__meta">
                <strong>{item.authorName}</strong>
                <span>{item.authorRole}</span>
                <span>{item.createdAt}</span>
                <span>有帮助 {item.helpfulVotes}</span>
              </div>
              <p>{item.content}</p>
            </article>
          ))}
        </div>
      ) : null}
    </section>
  );
}

export default DiscussionPanel;

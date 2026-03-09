function NotificationsPanel({ items }) {
  return (
    <section className="detail-card">
      <p className="section-header__eyebrow">通知流</p>
      <h3>最近动态</h3>
      <div className="discussion-list">
        {items.map((item) => (
          <article
            key={item.id}
            className={item.read ? "discussion-card" : "discussion-card discussion-card--unread"}
          >
            <div className="discussion-card__meta">
              <strong>{item.title}</strong>
              <span>{item.createdAt}</span>
              <span>{item.read ? "已读" : "未读"}</span>
            </div>
            <p>{item.description}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

export default NotificationsPanel;

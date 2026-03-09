function EmptyState({ title = "暂无内容", description = "当前还没有可展示的数据。" }) {
  return (
    <section className="status-panel">
      <h3>{title}</h3>
      <p>{description}</p>
    </section>
  );
}

export default EmptyState;

function LoadingState({ title = "正在加载", description = "请稍候，内容正在准备中。" }) {
  return (
    <section className="status-panel">
      <div className="status-spinner" aria-hidden="true" />
      <h3>{title}</h3>
      <p>{description}</p>
    </section>
  );
}

export default LoadingState;

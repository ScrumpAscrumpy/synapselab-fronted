function ErrorState({
  title = "加载失败",
  description = "当前内容暂时不可用，请稍后重试。",
  actionLabel,
  onAction,
}) {
  return (
    <section className="status-panel status-panel--error">
      <h3>{title}</h3>
      <p>{description}</p>
      {actionLabel && onAction ? (
        <button className="primary-button" type="button" onClick={onAction}>
          {actionLabel}
        </button>
      ) : null}
    </section>
  );
}

export default ErrorState;

function ActionModal({
  open,
  title,
  description,
  children,
  confirmLabel = "确认",
  cancelLabel = "取消",
  onClose,
  onConfirm,
}) {
  if (!open) {
    return null;
  }

  return (
    <div className="modal-backdrop" role="presentation" onClick={onClose}>
      <div
        className="modal-panel"
        role="dialog"
        aria-modal="true"
        aria-label={title}
        onClick={(event) => event.stopPropagation()}
      >
        <div className="modal-panel__header">
          <div>
            <p className="section-header__eyebrow">交互操作</p>
            <h3 className="modal-panel__title">{title}</h3>
            {description ? <p className="modal-panel__description">{description}</p> : null}
          </div>
          <button className="ghost-button ghost-button--small" type="button" onClick={onClose}>
            关闭
          </button>
        </div>
        <div className="form-grid">{children}</div>
        <div className="form-actions">
          <button className="ghost-button" type="button" onClick={onClose}>
            {cancelLabel}
          </button>
          <button className="primary-button" type="button" onClick={onConfirm}>
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ActionModal;

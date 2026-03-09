function PaperPreviewModal({ open, paper, onClose, onDelete, canDelete = false }) {
  if (!open || !paper) {
    return null;
  }

  return (
    <div className="modal-backdrop" role="presentation" onClick={onClose}>
      <div
        className="modal-panel modal-panel--join"
        role="dialog"
        aria-modal="true"
        aria-label={paper.title}
        onClick={(event) => event.stopPropagation()}
      >
        <div className="modal-panel__header paper-preview-modal__header">
          <div>
            <p className="section-header__eyebrow">论文预览</p>
            <h3 className="modal-panel__title">{paper.title}</h3>
            <p className="modal-panel__description">{paper.authorLabel}</p>
          </div>
          <button className="ghost-button ghost-button--small" type="button" onClick={onClose}>
            关闭
          </button>
        </div>

        <div className="form-grid paper-preview-modal__grid">
          <div className="hint-panel paper-preview-modal__panel">
            <strong>论文简介</strong>
            <p>{paper.summary}</p>
          </div>
          <div className="hint-panel paper-preview-modal__panel">
            <strong>关联说明</strong>
            <p>{paper.context}</p>
          </div>
          <div className="paper-preview-modal__meta">
            <span className="tag-pill tag-pill--subtle">成果节点</span>
            <span className="tag-pill">原文链接可追溯</span>
          </div>
          <div className="form-actions paper-preview-modal__actions">
            <button className="ghost-button" type="button" onClick={onClose}>
              关闭
            </button>
            {canDelete ? (
              <button className="ghost-button" type="button" onClick={onDelete}>
                删除论文
              </button>
            ) : null}
            <a
              className="primary-button"
              href={paper.url}
              target="_blank"
              rel="noreferrer"
            >
              查看原论文
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PaperPreviewModal;

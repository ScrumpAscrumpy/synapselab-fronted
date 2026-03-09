import { useEffect, useState } from "react";

const initialForm = {
  title: "",
  summary: "",
  tags: "",
  challenge: "",
};

function PublishIdeaModal({ open, onClose, onSubmit }) {
  const [form, setForm] = useState(initialForm);

  useEffect(() => {
    if (!open) {
      setForm(initialForm);
    }
  }, [open]);

  if (!open) {
    return null;
  }

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    onSubmit({
      ...form,
      tags: form.tags
        .split("、")
        .map((item) => item.trim())
        .filter(Boolean),
    });
  };

  return (
    <div className="modal-backdrop" role="presentation" onClick={onClose}>
      <div
        className="modal-panel"
        role="dialog"
        aria-modal="true"
        aria-label="发布新猜想"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="modal-panel__header">
          <div>
            <p className="section-header__eyebrow">新建内容</p>
            <h3 className="modal-panel__title">发布新猜想</h3>
          </div>
          <button className="ghost-button ghost-button--small" type="button" onClick={onClose}>
            关闭
          </button>
        </div>

        <form className="form-grid" onSubmit={handleSubmit}>
          <label className="form-field">
            <span>猜想标题</span>
            <input
              name="title"
              value={form.title}
              onChange={handleChange}
              placeholder="例如：微生物材料是否可以用于深海自修复结构？"
              required
            />
          </label>

          <label className="form-field">
            <span>一句话摘要</span>
            <textarea
              name="summary"
              value={form.summary}
              onChange={handleChange}
              rows="3"
              placeholder="用一段短文字说明你的核心思路。"
              required
            />
          </label>

          <label className="form-field">
            <span>标签</span>
            <input
              name="tags"
              value={form.tags}
              onChange={handleChange}
              placeholder="请用中文顿号分隔，例如：材料科学、海洋工程、合成生物学"
            />
          </label>

          <label className="form-field">
            <span>当前最大难点</span>
            <textarea
              name="challenge"
              value={form.challenge}
              onChange={handleChange}
              rows="4"
              placeholder="写清楚你最不确定、最需要他人协作的部分。"
              required
            />
          </label>

          <div className="form-actions">
            <button className="ghost-button" type="button" onClick={onClose}>
              取消
            </button>
            <button className="primary-button" type="submit">
              生成草稿
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default PublishIdeaModal;

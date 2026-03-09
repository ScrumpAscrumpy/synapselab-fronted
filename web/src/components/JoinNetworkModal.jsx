import { useEffect, useMemo, useState } from "react";

const inviteRelations = {
  "SYN-ELON": { name: "Elon M.", role: "系统工程 / 未来研究" },
  "SYN-AURORA": { name: "Dr. Aurora Lin", role: "计算生物学 / 协同招募" },
  "SYN-CHEN": { name: "Prof. Chen Yue", role: "认知神经科学 / 学术网络" },
};

const initialForm = {
  mode: "register",
  identityType: "viewer",
  name: "",
  email: "",
  password: "",
  inviteCode: "",
};

function JoinNetworkModal({ open, onClose, onJoin }) {
  const [form, setForm] = useState(initialForm);

  useEffect(() => {
    if (!open) {
      setForm(initialForm);
    }
  }, [open]);

  const relation = useMemo(() => inviteRelations[form.inviteCode.trim().toUpperCase()] ?? null, [form.inviteCode]);

  if (!open) {
    return null;
  }

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    onJoin({
      mode: form.mode,
      identityType: form.identityType,
      name: form.name || "Synapse Explorer",
      email: form.email,
      inviteCode: form.inviteCode.trim().toUpperCase(),
      relation,
    });
  };

  return (
    <div className="modal-backdrop" role="presentation" onClick={onClose}>
      <div
        className="modal-panel modal-panel--join"
        role="dialog"
        aria-modal="true"
        aria-label="加入网络"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="modal-panel__header">
          <div>
            <p className="section-header__eyebrow">加入网络</p>
            <h3 className="modal-panel__title">登录或注册 SynapseLab</h3>
            <p className="modal-panel__description">
              可选填写邀请码。填写后，系统会自动与你的邀请码提供者建立关联关系。
            </p>
          </div>
          <button className="ghost-button ghost-button--small" type="button" onClick={onClose}>
            关闭
          </button>
        </div>

        <form className="form-grid" onSubmit={handleSubmit}>
          <div className="segmented-control">
            <button
              className={form.mode === "login" ? "segmented-control__item segmented-control__item--active" : "segmented-control__item"}
              type="button"
              onClick={() => setForm((current) => ({ ...current, mode: "login" }))}
            >
              登录
            </button>
            <button
              className={form.mode === "register" ? "segmented-control__item segmented-control__item--active" : "segmented-control__item"}
              type="button"
              onClick={() => setForm((current) => ({ ...current, mode: "register" }))}
            >
              注册
            </button>
          </div>

          <div className="segmented-control">
            <button
              className={
                form.identityType === "viewer"
                  ? "segmented-control__item segmented-control__item--active"
                  : "segmented-control__item"
              }
              type="button"
              onClick={() => setForm((current) => ({ ...current, identityType: "viewer" }))}
            >
              浏览者
            </button>
            <button
              className={
                form.identityType === "scholar"
                  ? "segmented-control__item segmented-control__item--active"
                  : "segmented-control__item"
              }
              type="button"
              onClick={() => setForm((current) => ({ ...current, identityType: "scholar" }))}
            >
              研究学者
            </button>
          </div>

          {form.mode === "register" ? (
            <label className="form-field">
              <span>显示名称</span>
              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="例如：Lin A."
                required
              />
            </label>
          ) : null}

          <label className="form-field">
            <span>邮箱</span>
            <input
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              placeholder="researcher@synapselab.ai"
              required
            />
          </label>

          <label className="form-field">
            <span>密码</span>
            <input
              name="password"
              type="password"
              value={form.password}
              onChange={handleChange}
              placeholder="输入登录或注册密码"
              required
            />
          </label>

          <label className="form-field">
            <span>邀请码（选填）</span>
            <input
              name="inviteCode"
              value={form.inviteCode}
              onChange={handleChange}
              placeholder="例如：SYN-AURORA"
            />
          </label>

          <div className="hint-panel">
            {relation ? (
              <>
                <strong>已识别邀请码</strong>
                <p>提交后将自动与你和 {relation.name} 建立平台关联。</p>
              </>
            ) : (
              <>
                <strong>邀请码说明</strong>
                <p>不填写也可以继续。填写后会在你的网络关系中自动记录邀请来源。</p>
              </>
            )}
          </div>

          <div className="hint-panel">
            <strong>入网规则</strong>
            <p>普通浏览者可以使用平台，但不会自动出现在学者关系网中。只有研究学者身份或已发布项目的用户才会成为图谱节点。</p>
          </div>

          <div className="form-actions">
            <button className="ghost-button" type="button" onClick={onClose}>
              取消
            </button>
            <button className="primary-button" type="submit">
              {form.mode === "login" ? "进入平台" : "创建并加入"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default JoinNetworkModal;

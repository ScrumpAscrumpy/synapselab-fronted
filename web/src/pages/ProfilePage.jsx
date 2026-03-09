import { useEffect, useMemo, useState } from "react";
import { useOutletContext } from "react-router-dom";
import ActionModal from "../components/ActionModal";
import ErrorState from "../components/ErrorState";
import LoadingState from "../components/LoadingState";
import useAsyncResource from "../hooks/useAsyncResource";
import { readNetworkIdentity, updateNetworkIdentity } from "../lib/scholarNetwork";
import { getCurrentUser } from "../services/usersService";

function ProfilePage() {
  const outletContext = useOutletContext();
  const [networkIdentity, setNetworkIdentity] = useState(() => readNetworkIdentity());
  const [editOpen, setEditOpen] = useState(false);
  const [profileName, setProfileName] = useState("");
  const [profileBio, setProfileBio] = useState("");
  const [profileSkills, setProfileSkills] = useState("");
  const { data: user, loading, error } = useAsyncResource(() => getCurrentUser(), []);

  useEffect(() => {
    if (!user) {
      return;
    }

    setProfileName(networkIdentity?.name || user.name);
    setProfileBio(
      networkIdentity?.bio ||
        (networkIdentity?.eligibleForGraph
          ? "你当前已通过研究学者身份接入 SynapseLab 图谱，可继续上传论文并关联项目。"
          : user.bio),
    );
    setProfileSkills((networkIdentity?.skills || user.skills).join("，"));
  }, [networkIdentity?.bio, networkIdentity?.eligibleForGraph, networkIdentity?.name, networkIdentity?.skills, user]);

  const displayUser = useMemo(() => {
    if (!user) {
      return null;
    }

    return {
      ...user,
      name: networkIdentity?.name || user.name,
      role: networkIdentity?.role || user.role,
      bio:
        networkIdentity?.bio ||
        (networkIdentity?.eligibleForGraph
          ? "你当前已通过研究学者身份接入 SynapseLab 图谱，可继续上传论文并关联项目。"
          : user.bio),
      skills: networkIdentity?.skills || user.skills,
    };
  }, [networkIdentity?.bio, networkIdentity?.eligibleForGraph, networkIdentity?.name, networkIdentity?.role, networkIdentity?.skills, user]);

  const handleSaveProfile = () => {
    const nextSkills = profileSkills
      .split(/[,，]/)
      .map((item) => item.trim())
      .filter(Boolean);

    const nextIdentity = updateNetworkIdentity((current) => ({
      ...(current || {}),
      name: profileName.trim() || user?.name || "未命名用户",
      bio: profileBio.trim() || user?.bio || "",
      skills: nextSkills.length > 0 ? nextSkills : user?.skills || [],
    }));

    setNetworkIdentity(nextIdentity);
    setEditOpen(false);
  };

  if (loading) {
    return <LoadingState title="正在加载个人中心" description="当前正在读取用户信息。" />;
  }

  if (error) {
    return <ErrorState title="个人中心加载失败" description={error} />;
  }

  return (
    <div className="page-stack">
      <section className="detail-hero">
        <div className="detail-hero__content">
          <p className="section-header__eyebrow">个人中心</p>
          <h2 className="detail-hero__title">{displayUser.name}</h2>
          <p className="detail-hero__description">{displayUser.bio}</p>
          <div className="detail-meta">
            <span>角色：{displayUser.role}</span>
            <span>加入时间：{displayUser.joinedAt}</span>
          </div>
          <div className="topbar__actions">
            <button className="ghost-button" type="button" onClick={() => setEditOpen(true)}>
              编辑个人资料
            </button>
          </div>
        </div>
        <div className="detail-side-card">
          <p className="section-header__eyebrow">账户状态</p>
          <h3>当前用户画像</h3>
          <p>你可以在这里维护展示名称、简介和技能标签，并继续申请或确认研究学者身份。</p>
          <div className="topbar__actions">
            <button className="ghost-button" type="button" onClick={() => outletContext?.onJoinNetwork?.()}>
              {networkIdentity?.eligibleForGraph ? "已具备研究学者身份" : "申请研究学者身份"}
            </button>
          </div>
        </div>
      </section>

      <section className="detail-grid">
        <article className="detail-card">
          <p className="section-header__eyebrow">积分与信誉</p>
          <h3>平台贡献概览</h3>
          <div className="metric-inline-grid">
            <div className="metric-inline-card">
              <strong>{displayUser.points}</strong>
              <span>平台积分</span>
            </div>
            <div className="metric-inline-card">
              <strong>{displayUser.reputation}</strong>
              <span>信誉分</span>
            </div>
          </div>
        </article>

        <article className="detail-card">
          <p className="section-header__eyebrow">协作统计</p>
          <h3>当前参与情况</h3>
          <div className="metric-inline-grid">
            <div className="metric-inline-card">
              <strong>{displayUser.publishedIdeaCount}</strong>
              <span>已发布猜想</span>
            </div>
            <div className="metric-inline-card">
              <strong>{displayUser.activeProjectCount}</strong>
              <span>活跃项目</span>
            </div>
          </div>
        </article>
      </section>

      <section className="detail-card">
        <p className="section-header__eyebrow">技能标签</p>
        <h3>你的当前标签</h3>
        <div className="idea-card__tags">
          {displayUser.skills.map((skill) => (
            <span key={skill} className="tag-pill tag-pill--subtle">
              {skill}
            </span>
          ))}
        </div>
      </section>

      <ActionModal
        open={editOpen}
        title="编辑个人资料"
        description="这些信息会同步影响个人中心展示，以及学者网络中当前身份的默认显示内容。"
        confirmLabel="保存资料"
        onClose={() => setEditOpen(false)}
        onConfirm={handleSaveProfile}
      >
        <label className="form-field">
          <span>展示名称</span>
          <input value={profileName} onChange={(event) => setProfileName(event.target.value)} />
        </label>
        <label className="form-field">
          <span>个人简介</span>
          <textarea rows={4} value={profileBio} onChange={(event) => setProfileBio(event.target.value)} />
        </label>
        <label className="form-field">
          <span>技能标签</span>
          <input
            value={profileSkills}
            onChange={(event) => setProfileSkills(event.target.value)}
            placeholder="例如：量子计算，生物信息学，系统设计"
          />
        </label>
      </ActionModal>
    </div>
  );
}

export default ProfilePage;

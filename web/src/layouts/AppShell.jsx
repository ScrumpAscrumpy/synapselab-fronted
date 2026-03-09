import { useEffect, useMemo, useState } from "react";
import { NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";
import JoinNetworkModal from "../components/JoinNetworkModal";
import NetworkGraphModal from "../components/NetworkGraphModal";
import { navigationItems } from "../constants/navigation";
import { joinScholarNetwork } from "../services/networkService";
import { getNotifications } from "../services/notificationsService";
import { getCurrentUser } from "../services/usersService";
import { writeNetworkIdentity } from "../lib/scholarNetwork";

const SIDEBAR_STORAGE_KEY = "synapselab.sidebar.collapsed";
const NETWORK_STORAGE_KEY = "synapselab.network.identity";

function AppShell() {
  const location = useLocation();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [notificationCount, setNotificationCount] = useState(0);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(() => {
    if (typeof window === "undefined") {
      return false;
    }
    return window.localStorage.getItem(SIDEBAR_STORAGE_KEY) === "1";
  });
  const [networkIdentity, setNetworkIdentity] = useState(() => {
    if (typeof window === "undefined") {
      return null;
    }
    const raw = window.localStorage.getItem(NETWORK_STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  });
  const [graphOpen, setGraphOpen] = useState(false);
  const [joinOpen, setJoinOpen] = useState(false);

  const isHomePage = location.pathname === "/home";
  const displayUser = useMemo(() => networkIdentity ?? user, [networkIdentity, user]);

  useEffect(() => {
    let active = true;
    getCurrentUser()
      .then((result) => {
        if (active) {
          setUser(result);
        }
      })
      .catch(() => {
        if (active) {
          setUser(null);
        }
      });

    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    let active = true;
    getNotifications()
      .then((result) => {
        if (active) {
          setNotificationCount(result.filter((item) => !item.read).length);
        }
      })
      .catch(() => {
        if (active) {
          setNotificationCount(0);
        }
      });

    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined") {
      window.localStorage.setItem(SIDEBAR_STORAGE_KEY, sidebarCollapsed ? "1" : "0");
    }
  }, [sidebarCollapsed]);

  const handleJoinNetwork = async (payload) => {
    const eligibleForGraph = payload.identityType === "scholar";
    const nextIdentity = {
      name: payload.name,
      email: payload.email,
      role:
        payload.identityType === "scholar"
          ? payload.mode === "login"
            ? "已登录研究学者"
            : "新注册研究学者"
          : payload.mode === "login"
            ? "已登录浏览者"
            : "新注册浏览者",
      relation: payload.relation?.name ?? null,
      inviteCode: payload.inviteCode || null,
      identityType: payload.identityType,
      eligibleForGraph,
    };

    if (eligibleForGraph) {
      try {
        const graph = await joinScholarNetwork({
          scholarId: networkIdentity?.scholarId || "",
          profileKey: payload.email,
          name: payload.name,
          role: nextIdentity.role,
          discipline: nextIdentity.role,
          relationName: payload.relation?.name ?? "",
          inviteCode: payload.inviteCode || "",
        });
        const matchedScholar =
          graph?.scholars?.find(
            (item) =>
              (payload.email && item.profileKey === payload.email) ||
              item.name === payload.name,
          ) ?? null;
        if (matchedScholar?.id) {
          nextIdentity.scholarId = matchedScholar.id;
        }
      } catch (error) {
        window.alert(error?.message || "加入学者网络失败，请稍后再试。");
        return;
      }
    }

    setNetworkIdentity(nextIdentity);
    writeNetworkIdentity(nextIdentity);
    setJoinOpen(false);
  };

  const handlePublishIdea = () => {
    navigate("/ideation?compose=1");
  };

  const handleViewFlagshipChallenge = () => {
    navigate("/ideation?tab=热门");
  };

  const handleOpenProfile = () => {
    navigate("/profile");
  };

  const handleOpenGraphMode = () => {
    navigate("/graph");
  };

  return (
    <div className={sidebarCollapsed ? "app-shell app-shell--collapsed" : "app-shell"}>
      <aside className={sidebarCollapsed ? "sidebar sidebar--collapsed" : "sidebar"}>
        <div className="sidebar__brand">
          <div className="brand-mark">∿</div>
          <div className="sidebar__brand-copy">
            <p className="brand-name">Synapse Lab</p>
            <p className="brand-subtitle">Interdisciplinary OS</p>
          </div>
          <button
            className="sidebar__collapse"
            type="button"
            onClick={() => setSidebarCollapsed((current) => !current)}
            aria-label={sidebarCollapsed ? "展开侧边栏" : "收起侧边栏"}
          >
            {sidebarCollapsed ? "›" : "‹"}
          </button>
        </div>

        <nav className="sidebar__nav">
          {navigationItems.map((item) => (
            <NavLink
              key={item.path}
              className={({ isActive }) =>
                isActive ? "sidebar__link sidebar__link--active" : "sidebar__link"
              }
              to={item.path}
            >
              <span className="sidebar__icon" aria-hidden="true">
                {item.icon}
              </span>
              <span className="sidebar__link-label">{item.label}</span>
              {item.path === "/notifications" && notificationCount > 0 ? (
                <span className="nav-badge">{notificationCount}</span>
              ) : null}
            </NavLink>
          ))}
        </nav>

        <div className="sidebar__profile">
          <div className="sidebar__avatar">S</div>
          <div className="sidebar__profile-copy">
            <p className="sidebar__profile-name">{displayUser?.name ?? "访客用户"}</p>
            <p className="sidebar__profile-role">
              {displayUser?.eligibleForGraph
                ? "已具备图谱入网资格"
                : displayUser?.relation
                ? `已关联 ${displayUser.relation}`
                : displayUser?.role ?? "未连接 CloudBase"}
            </p>
          </div>
        </div>
      </aside>

      <main className="main-panel">
        <header className={isHomePage ? "topbar topbar--home" : "topbar"}>
          <div>
            <p className="topbar__eyebrow">跨学科科研协作平台</p>
            <h1 className="topbar__title">SynapseLab</h1>
          </div>

          <div className="topbar__actions">
            <button className="primary-button" type="button" onClick={() => setJoinOpen(true)}>
              {networkIdentity ? "网络已连接" : "加入网络"}
            </button>
            <button className="ghost-button" type="button" onClick={handleOpenProfile}>
              个人信息
            </button>
          </div>
        </header>

        <div className="page-content">
          <Outlet
            context={{
              onExploreGraph: () => setGraphOpen(true),
              onJoinNetwork: () => setJoinOpen(true),
              onPublishIdea: handlePublishIdea,
              onViewFlagshipChallenge: handleViewFlagshipChallenge,
              onOpenGraphMode: handleOpenGraphMode,
            }}
          />
        </div>
      </main>

      <NetworkGraphModal open={graphOpen} onClose={() => setGraphOpen(false)} />
      <JoinNetworkModal
        open={joinOpen}
        onClose={() => setJoinOpen(false)}
        onJoin={handleJoinNetwork}
      />
    </div>
  );
}

export default AppShell;

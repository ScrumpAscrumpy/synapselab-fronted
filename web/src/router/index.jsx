import { Suspense, lazy } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import LoadingState from "../components/LoadingState";
import AppShell from "../layouts/AppShell";

const HomePage = lazy(() => import("../pages/HomePage"));
const IdeaDetailPage = lazy(() => import("../pages/IdeaDetailPage"));
const IdeationPage = lazy(() => import("../pages/IdeationPage"));
const NetworkExplorerPage = lazy(() => import("../pages/NetworkExplorerPage"));
const NetworkPage = lazy(() => import("../pages/NetworkPage"));
const NotificationsPage = lazy(() => import("../pages/NotificationsPage"));
const ProfilePage = lazy(() => import("../pages/ProfilePage"));
const ProjectDetailPage = lazy(() => import("../pages/ProjectDetailPage"));
const StudioPage = lazy(() => import("../pages/StudioPage"));

function RouteFallback() {
  return (
    <LoadingState
      title="页面加载中"
      description="SynapseLab 正在按需加载当前页面资源。"
    />
  );
}

function AppRouter() {
  return (
    <Suspense fallback={<RouteFallback />}>
      <Routes>
        <Route path="/graph" element={<NetworkExplorerPage />} />
        <Route element={<AppShell />}>
          <Route index element={<Navigate to="/home" replace />} />
          <Route path="/home" element={<HomePage />} />
          <Route path="/ideation" element={<IdeationPage />} />
          <Route path="/ideation/:ideaId" element={<IdeaDetailPage />} />
          <Route path="/studio" element={<StudioPage />} />
          <Route path="/studio/:projectId" element={<ProjectDetailPage />} />
          <Route path="/network" element={<NetworkPage />} />
          <Route path="/notifications" element={<NotificationsPage />} />
          <Route path="/profile" element={<ProfilePage />} />
        </Route>
      </Routes>
    </Suspense>
  );
}

export default AppRouter;

import EmptyState from "../components/EmptyState";
import ErrorState from "../components/ErrorState";
import LoadingState from "../components/LoadingState";
import NotificationsPanel from "../components/NotificationsPanel";
import useAsyncResource from "../hooks/useAsyncResource";
import { getNotifications } from "../services/notificationsService";

function NotificationsPage() {
  const { data: items = [], loading, error } = useAsyncResource(() => getNotifications(), []);

  return (
    <div className="page-stack">
      <section className="page-banner">
        <div>
          <h2 className="page-banner__title">通知中心</h2>
          <p className="page-banner__description">
            查看评论、项目更新、协作邀请等和你相关的协作动态。
          </p>
        </div>
      </section>

      {loading ? <LoadingState title="正在加载通知" description="通知列表正在准备中。" /> : null}
      {!loading && error ? (
        <ErrorState title="通知加载失败" description={error} />
      ) : null}
      {!loading && !error && items.length === 0 ? (
        <EmptyState title="暂无通知" description="当前没有新的评论、邀请或项目提醒。" />
      ) : null}
      {!loading && !error && items.length > 0 ? <NotificationsPanel items={items} /> : null}
    </div>
  );
}

export default NotificationsPage;

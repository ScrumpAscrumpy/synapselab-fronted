import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import EmptyState from "../components/EmptyState";
import ErrorState from "../components/ErrorState";
import IdeaCard from "../components/IdeaCard";
import LoadingState from "../components/LoadingState";
import PublishIdeaModal from "../components/PublishIdeaModal";
import SectionHeader from "../components/SectionHeader";
import useAsyncResource from "../hooks/useAsyncResource";
import { createIdea, getIdeas } from "../services/ideasService";

const categoryTabs = ["全部", "热门", "最新", "AI 推荐", "太空探索", "生物科技", "能源", "AI"];

function IdeationPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialTab = categoryTabs.includes(searchParams.get("tab")) ? searchParams.get("tab") : "全部";
  const [activeTab, setActiveTab] = useState(initialTab);
  const [open, setOpen] = useState(false);
  const {
    data: ideasSource = [],
    loading,
    error,
    setData,
  } = useAsyncResource(() => getIdeas(), []);

  const ideas = useMemo(() => {
    const combined = ideasSource;
    if (activeTab === "全部") {
      return combined;
    }
    if (activeTab === "热门" || activeTab === "最新" || activeTab === "AI 推荐") {
      return combined;
    }
    return combined.filter((idea) => idea.tags.includes(activeTab));
  }, [activeTab, ideasSource]);

  const handleSubmitDraft = async (draft) => {
    const createdIdea = await createIdea(draft);
    setData((current) => [createdIdea, ...(current || [])]);
    setOpen(false);
    const nextParams = new URLSearchParams(searchParams);
    nextParams.delete("compose");
    setSearchParams(nextParams, { replace: true });
  };

  useEffect(() => {
    const compose = searchParams.get("compose");
    const tab = searchParams.get("tab");
    if (tab && categoryTabs.includes(tab) && tab !== activeTab) {
      setActiveTab(tab);
    }
    if (compose === "1") {
      setOpen(true);
    }
  }, [activeTab, searchParams]);

  const handleChangeTab = (tab) => {
    setActiveTab(tab);
    const nextParams = new URLSearchParams(searchParams);
    if (tab === "全部") {
      nextParams.delete("tab");
    } else {
      nextParams.set("tab", tab);
    }
    setSearchParams(nextParams, { replace: true });
  };

  const handleCloseModal = () => {
    setOpen(false);
    const nextParams = new URLSearchParams(searchParams);
    nextParams.delete("compose");
    setSearchParams(nextParams, { replace: true });
  };

  return (
    <div className="page-stack">
      <section className="page-banner">
        <div>
          <h2 className="page-banner__title">思想熔炉</h2>
          <p className="page-banner__description">
            The Ideation Crucible，为疯狂猜想提供诞生之地，用积分支持有潜力的想法。
          </p>
        </div>
        <button className="primary-button" type="button" onClick={() => setOpen(true)}>
          + 发布新猜想
        </button>
      </section>

      <section className="filter-panel">
        <div className="filter-panel__label">筛选</div>
        <div className="filter-panel__tabs">
          {categoryTabs.map((tab) => (
            <button
              key={tab}
              className={activeTab === tab ? "filter-pill filter-pill--active" : "filter-pill"}
              type="button"
              onClick={() => handleChangeTab(tab)}
            >
              {tab}
            </button>
          ))}
        </div>
      </section>

      <section className="page-section">
        <SectionHeader
          eyebrow="灵感热区"
          title="正在升温的跨学科猜想"
          description="每条卡片都展示 AI 初步分析、热度和后续可验证方向。"
        />
        {loading ? <LoadingState title="正在加载猜想列表" description="思想熔炉内容正在从云端读取。" /> : null}
        {!loading && error ? (
          <ErrorState title="猜想列表加载失败" description={error} />
        ) : null}
        {!loading && !error && ideas.length === 0 ? (
          <EmptyState title="当前没有猜想数据" description="可能是云端数据还未导入，或者云函数没有返回内容。" />
        ) : null}
        {!loading && !error && ideas.length > 0 ? (
          <div className="stack-list">
            {ideas.map((idea) => (
              <IdeaCard key={idea.id} idea={idea} />
            ))}
          </div>
        ) : null}
      </section>

      <PublishIdeaModal open={open} onClose={handleCloseModal} onSubmit={handleSubmitDraft} />
    </div>
  );
}

export default IdeationPage;

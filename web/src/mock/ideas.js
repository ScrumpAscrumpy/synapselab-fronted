export const featuredIdeas = [
  {
    id: "idea-1",
    tags: ["太空探索", "合成生物学"],
    title: "能否利用真菌菌丝体构建自修复火星栖息地？",
    summary:
      "利用基因编辑的菌丝体在高辐射环境下生长，构建自修复的生物建筑材料，并结合地外资源原位制造。",
    aiInsight:
      "可行性中等。建议优先验证低压、辐射和极端昼夜温差对菌丝生长的联合影响。",
    energy: 4500,
    trend: "热门",
    author: "Elon M.",
    authorRole: "系统工程 / 未来研究",
    createdAt: "2 小时前",
    challenge:
      "如何在火星低气压和强辐射条件下，让生物材料既能生长又能维持结构稳定性？",
    opportunity:
      "如果该方向成立，它既可服务地外栖息地，也可能反向推动地球极端环境建筑材料的创新。",
    nextActions: [
      "建立低压与辐射双变量模拟实验",
      "对比三类菌丝体在火星模拟土壤中的生长效率",
      "引入材料科学团队评估压缩强度和自修复能力",
    ],
    relatedDisciplines: ["合成生物学", "极端环境材料", "航天工程"],
  },
  {
    id: "idea-2",
    tags: ["神经科学", "语言学习"],
    title: "脑电波反馈是否能提升第二语言沉浸式习得效率？",
    summary:
      "结合脑电实时反馈、语音识别和自适应教学模型，探索语言输入与注意力波动的对应关系。",
    aiInsight:
      "适合拆成认知负荷监测与个体化反馈两个子课题，先做小样本原型实验。",
    energy: 2970,
    trend: "最新",
    author: "Dr. Aurora Lin",
    authorRole: "认知神经科学 / 教育技术",
    createdAt: "5 小时前",
    challenge:
      "如何证明注意力波动反馈能够对语言输入吸收效率产生稳定、可重复的提升？",
    opportunity:
      "该模型既能服务语言学习，也可能扩展到技能训练、康复训练和神经反馈教育系统。",
    nextActions: [
      "选取固定难度的双语输入材料作为基准任务",
      "建立脑电特征与词汇保持率之间的相关指标",
      "比较无反馈、延时反馈和实时反馈三组实验结果",
    ],
    relatedDisciplines: ["认知神经科学", "教育科技", "语音交互"],
  },
];

export const researchProjects = [
  {
    id: "project-1",
    title: "量子-生物界面能量传递机制研究",
    stage: "模拟验证",
    progress: 75,
    members: ["林", "陈", "赵"],
    nextStep: "进入实验设计，补齐样本方案与风险清单。",
    summary:
      "尝试在量子模型与生物体系之间寻找可解释的能量传递模式，验证是否存在跨尺度机制映射。",
    objective:
      "建立一套同时覆盖理论建模、模拟验证和实验可实施性的跨学科研究框架。",
    milestones: [
      { label: "理论构建", done: true },
      { label: "模拟验证", done: true },
      { label: "实验设计", done: false },
      { label: "数据分析", done: false },
    ],
    discussionSummary:
      "当前讨论焦点是模型参数与实验采样之间的对应关系，Lumina 建议先做低成本替代实验。",
  },
  {
    id: "project-2",
    title: "中药配伍分子协同效应的跨模态建模",
    stage: "资源整合",
    progress: 48,
    members: ["吴", "周", "李", "高"],
    nextStep: "补充化合物数据源，确定初版知识图谱结构。",
    summary:
      "通过知识图谱与机器学习方法描述多成分、多靶点的协同作用路径，支撑配伍规律分析。",
    objective:
      "构建一套兼具可解释性和可扩展性的配伍建模方案，为后续药效验证提供依据。",
    milestones: [
      { label: "问题定义", done: true },
      { label: "资源整合", done: true },
      { label: "模型设计", done: false },
      { label: "验证实验", done: false },
    ],
    discussionSummary:
      "当前缺口在于公开数据库字段不统一，需要先定义统一实体和关系命名规范。",
  },
];

export const scholars = [
  {
    id: "scholar-1",
    name: "Elon M.",
    discipline: "系统工程 / 创新策略",
    tags: ["复杂系统", "工程管理", "未来研究"],
    verified: true,
    papers: [
      "Resilient Systems for Extreme Environment Collaboration",
      "Human-Machine Decision Loops in Frontier Research",
    ],
    projectIds: ["project-1"],
  },
  {
    id: "scholar-2",
    name: "Dr. Aurora Lin",
    discipline: "计算生物学",
    tags: ["单细胞分析", "蛋白折叠", "实验设计"],
    verified: true,
    papers: [
      "Cross-Disciplinary Protein Folding Workflows",
      "Data Bridges Between Genomics and Material Simulation",
    ],
    projectIds: ["project-1", "project-2"],
  },
  {
    id: "scholar-3",
    name: "Prof. Chen Yue",
    discipline: "认知神经科学",
    tags: ["脑机接口", "认知实验", "信号处理"],
    verified: true,
    papers: [
      "Cognitive Signals in Cooperative Research Environments",
      "Attention Feedback Models for Human Learning Systems",
    ],
    projectIds: ["project-2"],
  },
];

export const scholarNetworkSeed = {
  nodes: [
    {
      id: "scholar-1",
      type: "scholar",
      x: 130,
      y: 110,
      label: "Elon M.",
      subtitle: "系统工程",
      verified: true,
    },
    {
      id: "scholar-2",
      type: "scholar",
      x: 320,
      y: 78,
      label: "Aurora Lin",
      subtitle: "计算生物学",
      verified: true,
    },
    {
      id: "scholar-3",
      type: "scholar",
      x: 520,
      y: 128,
      label: "Prof. Chen",
      subtitle: "认知神经科学",
      verified: true,
    },
    {
      id: "project-1",
      type: "project",
      x: 228,
      y: 244,
      label: "量子-生物界面",
      subtitle: "研究项目",
    },
    {
      id: "project-2",
      type: "project",
      x: 446,
      y: 248,
      label: "中药协同建模",
      subtitle: "研究项目",
    },
    {
      id: "paper-1",
      type: "paper",
      x: 84,
      y: 236,
      label: "Extreme Collaboration",
      subtitle: "论文节点",
    },
    {
      id: "paper-2",
      type: "paper",
      x: 314,
      y: 332,
      label: "Protein Folding Workflow",
      subtitle: "论文节点",
    },
    {
      id: "paper-3",
      type: "paper",
      x: 560,
      y: 304,
      label: "Cognitive Signals",
      subtitle: "论文节点",
    },
  ],
  edges: [
    { source: "scholar-1", target: "project-1", relation: "参与项目" },
    { source: "scholar-2", target: "project-1", relation: "共研" },
    { source: "scholar-2", target: "project-2", relation: "共研" },
    { source: "scholar-3", target: "project-2", relation: "参与项目" },
    { source: "scholar-1", target: "paper-1", relation: "发表论文" },
    { source: "scholar-2", target: "paper-2", relation: "发表论文" },
    { source: "scholar-3", target: "paper-3", relation: "发表论文" },
    { source: "scholar-1", target: "scholar-2", relation: "协作连接" },
    { source: "scholar-2", target: "scholar-3", relation: "协作连接" },
  ],
};

export const comments = [
  {
    id: "comment-1",
    targetType: "idea",
    targetId: "idea-1",
    authorName: "Dr. Aurora Lin",
    authorRole: "计算生物学",
    content: "这个方向很适合先做小型材料强度实验，再决定是否引入更复杂的火星环境变量。",
    createdAt: "36 分钟前",
  },
  {
    id: "comment-2",
    targetType: "idea",
    targetId: "idea-1",
    authorName: "Prof. Chen Yue",
    authorRole: "认知神经科学",
    content: "如果后续要做跨学科合作招募，建议把材料科学和航天工程需求拆成两个明确的参与入口。",
    createdAt: "18 分钟前",
  },
  {
    id: "comment-3",
    targetType: "idea",
    targetId: "idea-2",
    authorName: "Synapse Founder",
    authorRole: "Platform Owner",
    content: "这个课题后续可以很自然地接到研究工作室，先从 EEG 指标定义开始。",
    createdAt: "12 分钟前",
  },
];

export const projectDiscussions = [
  {
    id: "discussion-1",
    projectId: "project-1",
    authorName: "林",
    authorRole: "理论建模",
    content: "现阶段建议把实验样本规模控制在可验证区间，不要一开始就追求大而全。",
    createdAt: "1 小时前",
    helpfulVotes: 6,
  },
  {
    id: "discussion-2",
    projectId: "project-1",
    authorName: "陈",
    authorRole: "实验设计",
    content: "如果采用替代实验方案，材料获取速度会更快，但需要重新定义指标映射关系。",
    createdAt: "42 分钟前",
    helpfulVotes: 4,
  },
  {
    id: "discussion-3",
    projectId: "project-2",
    authorName: "周",
    authorRole: "知识图谱",
    content: "优先统一实体命名，后面模型训练和多源数据融合才不会反复返工。",
    createdAt: "27 分钟前",
    helpfulVotes: 5,
  },
];

export const notifications = [
  {
    id: "notification-1",
    type: "comment",
    title: "你的猜想收到了新评论",
    description: "Dr. Aurora Lin 评论了“能否利用真菌菌丝体构建自修复火星栖息地？”",
    createdAt: "8 分钟前",
    read: false,
  },
  {
    id: "notification-2",
    type: "invite",
    title: "你收到一个协作邀请",
    description: "中药配伍分子协同效应项目邀请你参与知识图谱结构设计。",
    createdAt: "26 分钟前",
    read: false,
  },
  {
    id: "notification-3",
    type: "project_update",
    title: "项目阶段已更新",
    description: "量子-生物界面能量传递机制研究 已进入实验设计准备阶段。",
    createdAt: "1 小时前",
    read: true,
  },
];

export const currentUserProfile = {
  id: "user-demo-1",
  name: "Synapse Founder",
  role: "Platform Owner",
  bio: "当前为本地模拟登录态，后续接入 CloudBase 匿名登录或正式用户系统。",
  skills: ["产品设计", "科研平台规划", "跨学科协作"],
  reputation: 88,
  points: 1200,
  joinedAt: "2026-03-07",
  publishedIdeaCount: 2,
  activeProjectCount: 2,
};

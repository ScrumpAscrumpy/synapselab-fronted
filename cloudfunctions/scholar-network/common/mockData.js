const ideas = [
  {
    id: "idea-1",
    title: "能否利用真菌菌丝体构建自修复火星栖息地？",
    summary: "利用基因编辑的菌丝体在高辐射环境下生长，构建自修复的生物建筑材料，并结合地外资源原位制造。",
    tags: ["太空探索", "合成生物学"],
    trend: "热门",
    authorId: "user-demo-1",
    authorName: "Synapse Founder",
    authorRole: "Platform Owner",
    energy: 4500,
  },
  {
    id: "idea-2",
    title: "脑电波反馈是否能提升第二语言沉浸式习得效率？",
    summary: "结合脑电实时反馈、语音识别和自适应教学模型，探索语言输入与注意力波动的对应关系。",
    tags: ["神经科学", "语言学习"],
    trend: "最新",
    authorId: "user-demo-1",
    authorName: "Synapse Founder",
    authorRole: "Platform Owner",
    energy: 2970,
  },
];

const projects = [
  {
    id: "project-1",
    title: "量子-生物界面能量传递机制研究",
    stage: "模拟验证",
    progress: 75,
    summary: "尝试在量子模型与生物体系之间寻找可解释的能量传递模式。",
    ownerId: "user-demo-1",
    memberIds: ["user-demo-1"],
  },
  {
    id: "project-2",
    title: "中药配伍分子协同效应的跨模态建模",
    stage: "资源整合",
    progress: 48,
    summary: "通过知识图谱与机器学习方法描述多成分、多靶点的协同作用路径。",
    ownerId: "user-demo-1",
    memberIds: ["user-demo-1"],
  },
];

const users = [
  {
    id: "user-demo-1",
    name: "Synapse Founder",
    role: "Platform Owner",
    bio: "当前为本地模拟登录态，后续接入 CloudBase 匿名登录或正式用户系统。",
  },
];

const comments = [
  {
    id: "comment-1",
    targetType: "idea",
    targetId: "idea-1",
    authorName: "Dr. Aurora Lin",
    authorRole: "计算生物学",
    content: "这个方向很适合先做小型材料强度实验，再决定是否引入更复杂的火星环境变量。",
    createdAt: "36 分钟前",
  },
];

const projectDiscussions = [
  {
    id: "discussion-1",
    projectId: "project-1",
    authorName: "林",
    authorRole: "理论建模",
    content: "现阶段建议把实验样本规模控制在可验证区间，不要一开始就追求大而全。",
    createdAt: "1 小时前",
    helpfulVotes: 6,
  },
];

const notifications = [
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
];

const scholarNetwork = {
  key: "default",
  scholars: [
    {
      id: "scholar-1",
      profileKey: "elon@synapse.lab",
      name: "Elon M.",
      discipline: "系统工程 / 创新策略",
      tags: ["复杂系统", "工程管理", "未来研究"],
      verified: true,
      eligibleForGraph: true,
      projectIds: ["project-1"],
      papers: [
        {
          id: "paper-scholar-1-1",
          title: "Resilient Systems for Extreme Environment Collaboration",
          summary: "围绕极端环境中的团队协作与系统韧性展开，为跨学科协作框架提供工程视角。",
          url: "https://example.org/papers/scholar-1-1",
        },
        {
          id: "paper-scholar-1-2",
          title: "Human-Machine Decision Loops in Frontier Research",
          summary: "讨论前沿研究环境下的人机决策回路设计，强调研究组织中的反馈机制。",
          url: "https://example.org/papers/scholar-1-2",
        },
      ],
    },
    {
      id: "scholar-2",
      profileKey: "aurora@synapse.lab",
      name: "Dr. Aurora Lin",
      discipline: "计算生物学",
      tags: ["单细胞分析", "蛋白折叠", "实验设计"],
      verified: true,
      eligibleForGraph: true,
      projectIds: ["project-1", "project-2"],
      papers: [
        {
          id: "paper-scholar-2-1",
          title: "Cross-Disciplinary Protein Folding Workflows",
          summary: "提出跨学科蛋白折叠研究工作流，用于衔接实验设计与高性能计算。",
          url: "https://example.org/papers/scholar-2-1",
        },
        {
          id: "paper-scholar-2-2",
          title: "Data Bridges Between Genomics and Material Simulation",
          summary: "探索基因组数据与材料模拟之间的桥接方式，支撑跨模态科研协作。",
          url: "https://example.org/papers/scholar-2-2",
        },
      ],
    },
    {
      id: "scholar-3",
      profileKey: "chen@synapse.lab",
      name: "Prof. Chen Yue",
      discipline: "认知神经科学",
      tags: ["脑机接口", "认知实验", "信号处理"],
      verified: true,
      eligibleForGraph: true,
      projectIds: ["project-2"],
      papers: [
        {
          id: "paper-scholar-3-1",
          title: "Cognitive Signals in Cooperative Research Environments",
          summary: "围绕协作研究环境中的认知信号采集与解释展开，强调团队研讨反馈。",
          url: "https://example.org/papers/scholar-3-1",
        },
        {
          id: "paper-scholar-3-2",
          title: "Attention Feedback Models for Human Learning Systems",
          summary: "研究注意力反馈模型在人类学习系统中的应用，为教育与科研训练提供基础。",
          url: "https://example.org/papers/scholar-3-2",
        },
      ],
    },
  ],
  projects: [
    {
      id: "project-1",
      title: "量子-生物界面能量传递机制研究",
      stage: "模拟验证",
      summary: "尝试在量子模型与生物体系之间寻找可解释的能量传递模式。",
    },
    {
      id: "project-2",
      title: "中药配伍分子协同效应的跨模态建模",
      stage: "资源整合",
      summary: "通过知识图谱与机器学习方法描述多成分、多靶点的协同作用路径。",
    },
  ],
};

module.exports = {
  ideas,
  projects,
  users,
  comments,
  projectDiscussions,
  notifications,
  scholarNetwork,
};

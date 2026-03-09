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

module.exports = {
  ideas,
  projects,
  users,
  comments,
  projectDiscussions,
  notifications,
};

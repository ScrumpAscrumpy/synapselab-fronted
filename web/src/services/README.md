# services

这里专门负责“和后端打交道”。

比如：

- 调用 CloudBase 云函数
- 获取猜想列表
- 创建项目
- 获取 AI 分析结果

## 当前状态

目前已经先放入了本地模拟服务：

- `ideasService.js`
- `projectsService.js`

这样做的好处是：

- 页面先能跑起来
- 后续接 CloudBase 时，只需要替换服务层，不需要大改页面组件

# CloudBase 部署指南

## 这份文档是干什么的

教你把 SynapseLab 从本地项目部署到腾讯云 CloudBase。

这份文档是按“小白第一次部署”的标准来写的，不默认你会：

- 云平台操作
- 数据库初始化
- 云函数部署
- 环境变量配置

## 先说结论

部署 SynapseLab 到 CloudBase，推荐按下面顺序来：

1. 准备腾讯云账号
2. 创建 CloudBase 环境
3. 创建数据库集合
4. 导入示例数据
5. 部署云函数
6. 配置前端环境变量
7. 将前端切换到 `cloudbase` 模式
8. 部署前端静态网站
9. 联调测试

## 你现在需要知道的核心概念

### CloudBase 是什么

你可以把 CloudBase 理解成腾讯云给你的一整套后端平台，它帮你提供：

- 网站托管
- 云函数
- 云数据库
- 文件存储
- 登录能力

### 在 SynapseLab 里分别对应什么

- 前端 React 页面：部署成静态网站
- `cloudfunctions/`：部署成云函数
- `database/`：部署成云数据库里的集合和数据

## 第 0 步：部署前你必须先准备好的东西

### 你自己要准备

1. 腾讯云账号
2. 能正常登录腾讯云控制台
3. 本地项目可以正常运行
4. 知道项目目录在哪里

### 当前项目目录

你的项目根目录是：

```bash
/Users/scrumpy/Documents/New project/SynapseLab
```

## 第 1 步：注册并登录腾讯云

### 你要做什么

1. 打开腾讯云官网
2. 注册账号
3. 完成实名认证
4. 登录控制台

### 你需要注意

- 如果没有实名认证，后面很多云资源不能正常创建
- 登录后最好记住你自己的账号归属，避免后面切错账号

## 第 2 步：进入 CloudBase 并创建环境

### 你要做什么

1. 在腾讯云控制台搜索 `CloudBase`
2. 进入 CloudBase 控制台
3. 点击“新建环境”
4. 填写环境名称，例如：`synapselab-prod`
5. 创建完成后，记下你的环境 ID

### 当前你的真实环境 ID

```bash
synapse-lab-1ghlp8bp8f847812
```

### 什么是环境 ID

环境 ID 就像这个项目在腾讯云上的“后端编号”。

后面前端和云函数都要通过它知道自己连的是哪个云环境。

### 这个 ID 后面会用在哪里

前端环境变量里：

```bash
VITE_CLOUDBASE_ENV_ID=你的环境ID
```

云函数环境变量里：

```bash
CLOUDBASE_ENV_ID=你的环境ID
```

## 第 3 步：创建数据库集合

### 你要创建哪些集合

第一版先创建这几个：

- `users`
- `ideas`
- `projects`
- `project_discussions`
- `comments`
- `notifications`
- `scholar_network`

### 这些集合的字段参考在哪

看这里：

- `database/models/users.schema.json`
- `database/models/ideas.schema.json`
- `database/models/projects.schema.json`
- `database/models/project_discussions.schema.json`
- `database/models/comments.schema.json`
- `database/models/notifications.schema.json`
- `database/models/scholar_network.schema.json`

### 给小白的理解

“集合”你可以理解成数据库里的表。

## 第 4 步：导入示例数据

### 当前可直接参考的示例数据

- `database/seed-data/users.json`
- `database/seed-data/ideas.json`
- `database/seed-data/projects.json`
- `database/seed-data/notifications.json`
- `database/seed-data/scholar_network.json`

### 更推荐你在 CloudBase 控制台导入的版本

- `database/seed-data/users-cloudbase-console.json`
- `database/seed-data/ideas-cloudbase-console.json`
- `database/seed-data/projects-cloudbase-console.json`

### 导入时一个关键注意事项

CloudBase 控制台导入时，不要自己添加 `_id` 字段，也不要导入以下划线开头的字段名。

原因：

- CloudBase 会自动生成文档主键
- 控制台导入对以下划线开头的字段有限制
- 如果你还希望文档本身带一个稳定业务 ID，请使用 `id` 字段，不要使用 `_id`

### 你要做什么

在 CloudBase 数据库控制台中，分别把这些 JSON 内容导入到对应集合。

### 为什么先导入示例数据

因为这样做之后：

- 页面更容易联调
- 云函数更容易验证
- 你能更快确认前后端是否打通

## 第 5 步：部署云函数

### 当前项目中需要优先部署的函数

- `ideas`
- `projects`
- `users`
- `comments`
- `project-discussions`
- `notifications`
- `scholar-network`

### 对应代码位置

- `cloudfunctions/ideas/index.js`
- `cloudfunctions/projects/index.js`
- `cloudfunctions/users/index.js`
- `cloudfunctions/comments/index.js`
- `cloudfunctions/project-discussions/index.js`
- `cloudfunctions/notifications/index.js`
- `cloudfunctions/scholar-network/index.js`

### 当前这些函数已经支持什么

#### `ideas`

- 获取列表
- 获取详情
- 创建猜想

#### `projects`

- 获取列表
- 获取详情

#### `users`

- 获取当前用户信息

### 你需要注意

云函数内部依赖了：

- `cloudfunctions/common/db.js`
- `cloudfunctions/common/repository.js`
- `cloudfunctions/common/response.js`

所以部署时不能只看单个 `index.js`，要按函数目录整体部署。

## 第 6 步：配置前端环境变量

### 当前参考文件

看这里：

`deploy/env.example`

### 前端正式接入 CloudBase 时建议使用

```bash
VITE_APP_NAME=SynapseLab
VITE_API_MODE=cloudbase
VITE_CLOUDBASE_ENV_ID=你的环境ID
```

### 当前如果还在本地演示

你也可以继续保留：

```bash
VITE_API_MODE=mock
```

## 第 7 步：前端切换为 CloudBase 模式

### 当前前端切换逻辑在哪

- `web/src/constants/appConfig.js`
- `web/src/services/apiClient.js`
- `web/src/services/cloudbaseApi.js`
- `web/src/lib/cloudbase.js`

### 切换原理

当前前端会根据：

```bash
VITE_API_MODE
```

来判断：

- 用本地模拟数据 `mock`
- 还是用真实 CloudBase `cloudbase`

## 第 8 步：静态网站托管上线

### 推荐方式

推荐采用“本地构建完成后直接上传 `web/dist` 内容”的方式，不要再让 CloudBase 重新构建前端。

原因：

- 本地已经验证过构建结果
- 云端重复构建容易出现路径不一致
- 直接上传更适合毕业设计项目

### 正确做法

1. 在本地执行：

```bash
cd "/Users/scrumpy/Documents/New project/SynapseLab/web"
npm run build
```

2. 进入 CloudBase 静态网站托管
3. 直接上传 `web/dist` 中的文件
4. 确认根目录存在：

- `index.html`
- `assets/`

### 错误做法

不要继续使用这类错误命令：

```bash
tcb hosting deploy ./dist /index_html -e synapse-lab-1ghlp8bp8f847812
```

因为在云端 ZIP 解压后的工作目录里，`./dist` 往往并不存在。

## 第 9 步：配置 SPA 回退

由于前端使用 React Router，线上环境必须为单页应用配置刷新回退。

请参考：

- `deploy/spa-fallback.md`

关键配置是：

- 索引文档：`index.html`
- 404 重定向到：`/index.html`

这样用户在刷新 `/studio/project-xxx` 或 `/ideation/idea-xxx` 这种地址时，才不会返回 404。

## 第 10 步：正式权限规则收口

当前联调阶段可以先采用较宽松的云函数权限规则，但答辩或长期保留时，建议切回更合理的正式策略。

请重点查看：

- `docs/08-权限与安全设计.md`
- `database/rules/cloudbase-production.rules.json`

建议至少做到：

- 公开浏览函数可匿名访问
- 评论、讨论、通知等写操作要求登录
- 数据库对用户私有数据设置本人访问限制

## 第 11 步：最终联调检查

上线完成后，至少检查以下页面：

- 首页
- 思想熔炉
- 猜想详情
- 研究工作室
- 项目详情
- 学者网络
- 通知中心
- 个人中心

并额外执行两个动作：

1. 在任意子路由刷新，确认不会 404
2. 打开浏览器控制台，确认没有持续红色错误

## 第 8 步：部署前端静态网站

### 你要做什么

1. 在前端目录执行打包
2. 生成 `dist/`
3. 将 `dist/` 里的内容直接上传到 CloudBase 静态托管

### 前端目录

```bash
/Users/scrumpy/Documents/New project/SynapseLab/web
```

### 打包命令

```bash
npm run build
```

### 打包产物

```bash
web/dist
```

### 推荐部署方式

当前项目最稳的方式是：

**直接在 CloudBase 静态网站托管页面上传 `web/dist` 里的内容**

也就是上传：

- `index.html`
- `assets/`

而不是把整个前端项目交给 CloudBase 再执行一次构建。

### 为什么不推荐 ZIP 构建 + 自定义命令

因为你已经遇到过这个错误：

```text
Path does not exist: /root/cloudbase-workspace/dist
```

这说明：

- 云端解压后的目录根部已经直接是静态产物
- 但自定义命令还在找 `./dist`
- 所以路径天然不匹配

### 如果你在控制台里看到自定义部署命令

请不要再使用这种命令：

```bash
tcb hosting deploy ./dist /index_html -e synapse-lab-1ghlp8bp8f847812
```

### 如果你必须保留自定义命令

只使用下面这种以当前目录为根的写法：

```bash
tcb hosting deploy . -e synapse-lab-1ghlp8bp8f847812
```

或：

```bash
tcb hosting deploy . / -e synapse-lab-1ghlp8bp8f847812
```

但默认仍然推荐：**直接上传静态产物，不走云端自定义构建**。

### 上传成功后的检查

上传完成后，你应该拿到一个 CloudBase 托管域名。

然后要验证：

1. 首页能打开
2. 思想熔炉能打开
3. 猜想详情能打开
4. 研究工作室详情能打开
5. 通知中心、个人中心能打开
6. 刷新子路由时不会直接 404

如果刷新子路由 404，就需要在静态托管中补 SPA 回退配置，让所有前端路由都回到 `index.html`。

## 第 9 步：联调测试

### 你要重点检查

1. 首页是否正常打开
2. 思想熔炉列表是否能读取真实数据
3. 猜想详情页是否能打开
4. 发布新猜想是否能成功写入数据库
5. 研究工作室列表和详情是否正常
6. 左下角用户信息是否从云端读取成功

## 当前代码里的 CloudBase 预留点

前端已经预留：

- `VITE_API_MODE`
- `VITE_CLOUDBASE_ENV_ID`
- `web/src/services/cloudbaseApi.js`
- `web/src/lib/cloudbase.js`

后端已经预留：

- `cloudfunctions/ideas/index.js`
- `cloudfunctions/projects/index.js`
- `cloudfunctions/users/index.js`
- `cloudfunctions/common/db.js`
- `cloudfunctions/common/repository.js`

## 我可以帮你做到什么

### 我可以直接帮你做的

- 检查项目结构是否适合部署
- 修改前端环境变量文件
- 调整前后端代码
- 继续补云函数逻辑
- 检查数据库模型是否合理
- 帮你排查部署报错
- 如果环境允许，也可以直接替你执行部署命令

### 必须你自己操作的

- 登录腾讯云控制台
- 创建 CloudBase 环境
- 查看和复制环境 ID
- 确认账号、实名认证、计费和控制台设置

## 建议的实际执行顺序

等我们准备正式部署时，你就按下面顺序和我配合：

1. 你登录腾讯云控制台
2. 你创建 CloudBase 环境
3. 你把环境 ID 发给我
4. 我帮你改前端和后端配置
5. 你按我写的步骤部署，或者在允许时由我直接操作
6. 我帮你做联调和报错修复

## 当前阶段建议

你现在还不需要立刻部署。

更稳妥的做法是：

1. 继续完善核心业务功能
2. 等评论、通知、登录占位再稳定一点
3. 再进入真实 CloudBase 部署

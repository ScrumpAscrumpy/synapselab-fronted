# CloudBase 静态托管 SPA 回退说明

## 为什么要做这件事

SynapseLab 前端使用的是 React 路由，页面地址不是单纯的静态文件路径，而是：

- `/home`
- `/ideation`
- `/ideation/:ideaId`
- `/studio/:projectId`

如果静态托管只认识真实文件路径，那么用户在子路由直接刷新时，CloudBase 可能会返回 404。

## CloudBase 官方能力依据

根据 CloudBase 官方静态托管文档：

- 静态托管支持“索引文档配置”
- 静态托管支持“错误码重定向”
- 当使用前端 history 模式时，需要在静态网站设置中配置错误页面为应用依赖页面

这正是单页应用 SPA 回退所需要的能力。

## SynapseLab 的推荐配置

### 1. 索引文档

- 根目录索引文档：`index.html`

### 2. 错误码重定向

在 CloudBase 静态网站托管控制台中，增加 404 重定向规则：

- 错误码：`404`
- 目标页面：`/index.html`

如果控制台支持 403 重定向，也建议补充：

- 错误码：`403`
- 目标页面：`/index.html`

### 3. 前缀匹配重定向

如果控制台支持前缀规则，可为前端路由增加兜底：

- `/home` -> `/index.html`
- `/ideation` -> `/index.html`
- `/studio` -> `/index.html`
- `/network` -> `/index.html`
- `/notifications` -> `/index.html`
- `/profile` -> `/index.html`

其中 404 错误页重定向通常已经足够，前缀规则属于加强版。

## 配置后的验证方法

完成配置后，依次打开并刷新以下页面：

1. `/home`
2. `/ideation`
3. `/ideation/idea-mars-mycelium`
4. `/studio/project-quantum-bioenergy`
5. `/notifications`
6. `/profile`

验证标准：

- 页面刷新后仍然正常显示前端内容
- 不出现 CloudBase 默认 404 页面
- 不出现空白页

## 当前项目建议

由于项目已经上线成功，建议将 SPA 回退配置作为正式环境固定项写入上线清单。后续每次重新部署前端时，都要确认该规则仍然存在。

## 当 CloudBase 重写规则不稳定时的替代方案

如果静态托管控制台中的前缀匹配与替换路径规则无法稳定生效，或者刷新后仍然出现 `NoSuchKey`，建议直接将前端路由切换为 `HashRouter`。

切换后的地址示例：

- `/#/home`
- `/#/ideation`
- `/#/profile`

这种方式的优点是：

- 不依赖服务器重写规则
- 刷新页面不会请求 `/profile` 这类静态路径
- 对毕业设计答辩演示更稳

本项目已切换为该方案，以降低 CloudBase 静态托管在子路由刷新时的风险。

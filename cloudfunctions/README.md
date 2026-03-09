# cloudfunctions

这里放 CloudBase 云函数，相当于后端代码。

## 你可以怎么理解

云函数就是“帮前端处理事情的后台程序”，比如：

- 保存用户发布的猜想
- 读取项目列表
- 写入评论
- 生成 AI 分析结果

## 子目录说明

- `auth/`：登录与身份相关
- `ideas/`：思想熔炉相关
- `projects/`：研究工作室相关
- `users/`：用户资料相关
- `ai-assistant/`：AI 助理相关
- `notifications/`：通知相关
- `common/`：公共方法

## 当前状态

目前已经补了第一批云函数骨架：

- `ideas/index.js`
- `projects/index.js`
- `users/index.js`
- `comments/index.js`
- `project-discussions/index.js`
- `common/response.js`
- `common/mockData.js`

这一层现在的作用是先把“后端函数怎么拆、返回格式怎么统一”固定下来。

## 控制台上传时的注意事项

如果你是在 CloudBase 控制台里逐个上传函数目录，那么每个函数目录里的 `common/` 子目录也必须一起上传。

当前仓库已经把需要的公共代码复制进以下函数目录：

- `ideas/common/`
- `projects/common/`
- `users/common/`
- `comments/common/`
- `project-discussions/common/`
- `notifications/common/`

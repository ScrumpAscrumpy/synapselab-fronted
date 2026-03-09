# 上线前检查清单

## 一、账号与平台准备

- 已注册腾讯云账号
- 已完成实名认证
- 已能正常登录 CloudBase 控制台
- 已创建 CloudBase 环境
- 已保存 CloudBase 环境 ID

## 二、项目本地状态

- 本地前端页面能正常打开
- `npm run build` 能成功执行
- 本地没有白屏或明显报错
- 首页、思想熔炉、研究工作室页面都能打开
- 发布新猜想功能能正常使用

## 三、数据库准备

- 已创建 `users` 集合
- 已创建 `ideas` 集合
- 已创建 `projects` 集合
- 已创建 `project_discussions` 集合
- 已创建 `comments` 集合
- 已创建 `notifications` 集合
- 已创建 `scholar_network` 集合
- 已导入示例数据

## 四、云函数准备

- 已部署 `ideas` 云函数
- 已部署 `projects` 云函数
- 已部署 `users` 云函数
- 已部署 `comments` 云函数
- 已部署 `project-discussions` 云函数
- 已部署 `notifications` 云函数
- 已部署 `scholar-network` 云函数
- 云函数环境变量已配置
- 云函数调用无明显报错

## 五、前端环境变量

- 已配置 `VITE_APP_NAME`
- 已配置 `VITE_API_MODE`
- 已配置 `VITE_CLOUDBASE_ENV_ID`
- 切换到 `cloudbase` 模式后前端仍能正常启动

## 六、联调结果

- 首页能读取真实数据
- 猜想列表能读取真实数据
- 猜想详情页能读取真实数据
- 发布新猜想能写入数据库
- 项目列表能读取真实数据
- 用户信息能从后端读取
- 学者网络图谱能从后端读取

## 七、上线前最终检查

- 桌面端检查完成
- 移动端检查完成
- 页面无明显错位
- 没有控制台红色报错
- 关键页面已截图，便于答辩和论文留档
- 静态托管使用的是 `web/dist` 直接上传方案
- 没有继续使用 `tcb hosting deploy ./dist /index_html ...`
- 刷新前端子路由不会 404
- 已配置 SPA 回退规则，404 会返回 `index.html`
- 已区分测试期权限与正式期权限
- 已保存线上访问地址，便于答辩演示

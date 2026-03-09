# seed-data

这里放数据库初始化示例数据。

作用是：

- 方便本地演示
- 方便测试页面
- 方便后续初始化云数据库

## 当前已有文件

- `users.json`
- `ideas.json`
- `projects.json`
- `comments.json`
- `project_discussions.json`
- `notifications.json`
- `users-cloudbase-console.json`
- `ideas-cloudbase-console.json`
- `projects-cloudbase-console.json`

## 导入 CloudBase 时的注意事项

- 这些文件已经去掉了 `_id`
- 建议直接导入，不要手动补 `_id`
- 文档主键交给 CloudBase 自动生成
- 如果你希望列表和详情使用稳定业务 ID，优先导入 `*-cloudbase-console.json` 版本

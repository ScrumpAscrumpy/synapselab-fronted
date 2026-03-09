# CloudBase 配置说明

## 当前环境信息

- 环境名称：`synapse-lab`
- 环境 ID：`synapse-lab-1ghlp8bp8f847812`

## 前端环境变量

前端后续切到真实 CloudBase 时，使用：

```bash
VITE_APP_NAME=SynapseLab
VITE_API_MODE=cloudbase
VITE_CLOUDBASE_ENV_ID=synapse-lab-1ghlp8bp8f847812
```

如果只是本地继续演示，可以先保留：

```bash
VITE_API_MODE=mock
```

## 云函数环境变量

云函数需要的环境变量：

```bash
CLOUDBASE_ENV_ID=synapse-lab-1ghlp8bp8f847812
```

## 当前接入点

前端：

- `web/src/lib/cloudbase.js`
- `web/src/services/cloudbaseApi.js`

后端：

- `cloudfunctions/common/db.js`
- `cloudfunctions/common/repository.js`

## 下一步操作建议

1. 在 CloudBase 控制台创建数据库集合
2. 导入 `database/seed-data/` 下的示例数据
3. 部署 `ideas`、`projects`、`users`、`comments`、`project-discussions`、`notifications` 云函数
4. 将前端从 `mock` 改成 `cloudbase`
5. 部署前端静态站点

## 静态站点部署方式

当前项目前端的推荐部署方式是：

**直接上传本地构建产物 `web/dist` 的内容到 CloudBase 静态托管**

不要再使用：

```bash
tcb hosting deploy ./dist /index_html -e synapse-lab-1ghlp8bp8f847812
```

原因：

- CloudBase 静态托管的 ZIP 构建环境会把上传内容直接解压到工作目录根部
- 当前上传包内本身就已经是 `index.html` 和 `assets/`
- 云端不存在 `./dist` 这个目录，所以会报路径不存在

## 推荐操作

1. 本地执行前端打包
2. 打开 `web/dist`
3. 在 CloudBase 静态托管中直接上传 `dist` 里的文件和文件夹

## 如果必须使用自定义部署命令

仅在你必须保留 ZIP 构建流时，才使用：

```bash
tcb hosting deploy . -e synapse-lab-1ghlp8bp8f847812
```

或：

```bash
tcb hosting deploy . / -e synapse-lab-1ghlp8bp8f847812
```

前提是：

- 云端当前工作目录根部已经直接有 `index.html`
- 云端当前工作目录根部已经直接有 `assets/`

## 不推荐的做法

- 不要把本地已经构建好的 `dist` 再交给云端重复构建
- 不要继续使用 `./dist /index_html` 这种路径写法

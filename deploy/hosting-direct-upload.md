# CloudBase 静态托管直接上传说明

这份文档专门说明 SynapseLab 前端应该如何上传到 CloudBase 静态网站托管。

## 正确做法

先在本地执行：

```bash
cd "/Users/scrumpy/Documents/New project/SynapseLab/web"
npm run build
```

然后进入：

```bash
/Users/scrumpy/Documents/New project/SynapseLab/web/dist
```

把这里面的内容直接上传到 CloudBase 静态托管：

- `index.html`
- `assets/`

## 错误做法

不要使用下面这种已经被验证会失败的路径：

```bash
tcb hosting deploy ./dist /index_html -e synapse-lab-1ghlp8bp8f847812
```

## 为什么会失败

因为 CloudBase 的 ZIP 构建环境在解压之后，当前工作目录根部已经直接是：

- `index.html`
- `assets/`

它并没有额外再包一层 `dist/`。

所以再执行 `./dist` 路径就一定会报：

```text
Path does not exist: /root/cloudbase-workspace/dist
```

## 什么时候才用命令部署

只有在你必须保留自定义命令时，才考虑：

```bash
tcb hosting deploy . -e synapse-lab-1ghlp8bp8f847812
```

但这个项目默认不推荐这么做。

## 当前项目默认结论

SynapseLab 前端默认采用：

**本地打包 -> 直接上传 `web/dist` 内容 -> CloudBase 静态托管**

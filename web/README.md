# web

这个文件夹放前端代码，也就是用户实际看到的界面。

## 你可以怎么理解

如果把平台比作一栋楼：

- `web/` 是门厅、房间、按钮、页面这些用户直接看到的部分
- 它负责显示内容、接收点击、发送请求

## 子目录说明

- `public/`：不需要经过编译的静态资源
- `src/`：前端核心源码

## 开发目标

第一版前端先完成：

1. 首页
2. 思想熔炉
3. 研究工作室
4. 学者网络
5. AI 助理入口

## 运行方式

如果已经安装好 Node.js 和 npm，在项目根目录执行：

```bash
npm install --prefix web
npm run dev
```

如果你更习惯直接进入前端目录：

```bash
cd "/Users/scrumpy/Documents/New project/SynapseLab/web"
npm install
npm run dev
```

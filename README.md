# 生活在林间 · 社会学导论（站点源码）

本书的静态站点源码。线上地址：https://living-in-forest.app.workbuddy.host/

## 目录结构

```
index.html          主页面（含全部 25 章内容，单文件）
css/style.css       样式
js/main.js          交互逻辑（含访问口令门、夜间模式、阅读进度等）
_workfiles/         工作文件（查证台账、脚本、PDF 等，已 gitignore，不上传）
REFERENCE-NOTES.md  参考笔记（已 gitignore）
```

> 说明：本书为「内测中」状态，入口设有访问口令（在 `js/main.js` 的 `ACCESS_PASSWORD`），并带 `noindex` 标签避免搜索引擎收录。

## 发布到 GitHub Pages（私有仓库 + 口令门）

### 一次性准备（首次）

1. 安装 Git：https://git-scm.com/download/win
2. 在 https://github.com 新建仓库，Owner 选 `WellCommu2F`，名称填 `living-in-forest`，选 **Private**，不要勾选任何初始化文件。

### 首次推送（在 Git Bash 中执行）

```bash
cd "/c/Users/Lt/WorkBuddy/2026-09-15-23-25-55/living-in-forest"

git init
git branch -M main
git add .
git commit -m "林间站 v1.6 首次提交"
git remote add origin https://github.com/WellCommu2F/living-in-forest.git
git push -u origin main
```

首次 push 会弹出浏览器要求登录 GitHub 授权（或输入用户名 + Personal Access Token）。

### 开启 Pages

仓库页面 → **Settings → Pages** → Source 选 **Deploy from a branch** → 分支 **main**、目录 **/ (root)** → Save。等 1–2 分钟即可访问：

```
https://WellCommu2F.github.io/living-in-forest/
```

### 后续更新

改完站点文件后，在站点目录里执行：

```bash
git add .
git commit -m "更新说明"
git push
```

Pages 会自动重新部署（约 1 分钟内生效）。

## 安全提醒

- 私有仓库只保护「源码」不可见；Pages 网址本身是公开可访问的。
- 真正的访问控制靠前端口令门（`js/main.js` 的 `ACCESS_PASSWORD`）。
- 不要在仓库里提交 `_workfiles/` 中的 PDF、台账等敏感/大文件（已通过 `.gitignore` 排除）。

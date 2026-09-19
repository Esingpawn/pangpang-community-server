# 失控进化 · 胖胖社区服

Node.js + Express 官网源码，包含静态官网、社区服务器 API、运营招募/举报/建议提交接口。

## 本地运行

```bash
npm install
npm start
```

打开 http://localhost:8765

## API

- `GET /api/health` 服务健康检查
- `GET /api/servers` 社区服务器列表
- `POST /api/submissions` 提交招募、举报或建议

提交格式示例：

```json
{"type":"recruit","role":"社区管理员","name":"玩家A","contact":"微信号","message":"我想参与社区活动"}
```

当前默认使用 `data/submissions.json` 保存提交内容，正式部署建议迁移到 SQLite/MySQL，并配置反向代理、HTTPS、备份和后台鉴权。

## 目录

- `index.html` 官网页面
- `styles.css` 视觉样式
- `script.js` 前端交互
- `server.js` Express 服务端
- `assets/` 壁纸与微信群/抖音群二维码
- `data/` 本地提交数据（已被 git 忽略）

# 失控进化 · 胖胖社区服

可部署的 Node.js + Express 社区官网源码。

## Docker 部署（推荐）

```bash
git clone https://github.com/Esingpawn/pangpang-community-server.git
cd pangpang-community-server
docker compose up -d --build
```

访问 `http://服务器IP:8765`。提交数据保存在 Docker volume `pangpang-data` 中。

```bash
docker compose ps
docker compose logs -f pangpang-web
docker compose down
```

## 直接 Node.js 部署

要求 Node.js 18+：

```bash
npm ci --omit=dev
npm start
```

生产环境可用 PM2：

```bash
npm install -g pm2
pm2 start server.js --name pangpang-community
pm2 save
pm2 startup
```

建议在 Nginx/Caddy 中配置域名、HTTPS 和反向代理。

## 配置

复制 `.env.example` 为 `.env`，可设置 `PORT` 与 `NODE_ENV`。

## API

- `GET /api/health` 健康检查
- `GET /api/servers` 社区服务器列表
- `POST /api/submissions` 招募、举报、建议提交

当前提交数据写入 `data/submissions.json`。正式运营时建议迁移到 SQLite/MySQL，并增加后台鉴权、限流、备份与审核后台。

## 蓝图库

打开 lueprints.html 查看社区建筑档案。两张预设蓝图卡片支持一键复制分享码，后续可接入真实蓝图文件、上传与审核接口。


## 查看网站提交

启动服务后打开：

```text
http://服务器IP:8765/admin.html
```

部署前必须设置 `ADMIN_TOKEN`：

```bash
ADMIN_TOKEN="你的长随机令牌" npm start
```

Docker Compose 中可在 `environment` 增加：

```yaml
ADMIN_TOKEN: "你的长随机令牌"
```

管理台支持查看招募、举报、建议，按状态筛选，修改为处理中/已完成/已归档以及删除记录。管理接口使用 Bearer Token，不要把令牌写入前端代码或提交到 GitHub。

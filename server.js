const express = require('express');
const helmet = require('helmet');
const morgan = require('morgan');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = Number(process.env.PORT || 8765);
const DATA_DIR = path.join(__dirname, 'data');
const DATA_FILE = path.join(DATA_DIR, 'submissions.json');
fs.mkdirSync(DATA_DIR, { recursive: true });
if (!fs.existsSync(DATA_FILE)) fs.writeFileSync(DATA_FILE, '[]', 'utf8');

app.use(helmet({ contentSecurityPolicy: false }));
app.use(morgan('tiny'));
app.use(express.json({ limit: '100kb' }));
app.use(express.urlencoded({ extended: false, limit: '100kb' }));
app.use(express.static(__dirname));

const servers = [
  { id: 'pangpang-3x', name: '失控进化 · 3X 公平社区服', description: '3x资源 / 矿多 / 18:00—24:00领地突袭', status: 'online', statusLabel: '运营中', players: '128 / 150', ping: 32, openedAt: '2026.09.20' },
  { id: 'build-lab', name: '胖胖 · 建造实验室', description: '建筑挑战 / 电路共创 / 和平模式', status: 'preparing', statusLabel: '筹备中', players: '—', ping: null, openedAt: '即将开放' },
  { id: 'weekend-arena', name: '胖胖 · 周末竞技场', description: '限时 PvP / 统一装备 / 社区比赛', status: 'event', statusLabel: '活动服', players: '—', ping: null, openedAt: '周六 20:00' }
];

app.get('/api/health', (_req, res) => res.json({ ok: true, service: 'pangpang-community' }));
app.get('/api/servers', (_req, res) => res.json({ updatedAt: new Date().toISOString(), servers }));
app.post('/api/submissions', (req, res) => {
  const { type = 'recruit', role = '', name = '', contact = '', message = '' } = req.body || {};
  if (!name.trim() || !contact.trim()) return res.status(400).json({ ok: false, message: '请填写称呼和联系方式' });
  if (!['recruit', 'report', 'suggestion'].includes(type)) return res.status(400).json({ ok: false, message: '提交类型无效' });
  const items = JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
  const item = { id: `sub_${Date.now()}`, type, role, name, contact, message, createdAt: new Date().toISOString() };
  items.push(item);
  fs.writeFileSync(DATA_FILE, JSON.stringify(items, null, 2), 'utf8');
  res.status(201).json({ ok: true, id: item.id, message: '提交成功，请添加微信 welink404' });
});
app.get('*', (_req, res) => res.sendFile(path.join(__dirname, 'index.html')));
app.listen(PORT, () => console.log(`Pangpang community running at http://localhost:${PORT}`));

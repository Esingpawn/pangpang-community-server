const express = require('express');
const helmet = require('helmet');
const morgan = require('morgan');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = Number(process.env.PORT || 8765);
const ADMIN_TOKEN = process.env.ADMIN_TOKEN || '';
const DATA_DIR = path.join(__dirname, 'data');
const DATA_FILE = path.join(DATA_DIR, 'submissions.json');
fs.mkdirSync(DATA_DIR, { recursive: true });
if (!fs.existsSync(DATA_FILE)) fs.writeFileSync(DATA_FILE, '[]', 'utf8');
const rate = new Map();
function readItems(){ try { return JSON.parse(fs.readFileSync(DATA_FILE, 'utf8')); } catch { return []; } }
function writeItems(items){ fs.writeFileSync(DATA_FILE, JSON.stringify(items, null, 2), 'utf8'); }
function adminOnly(req,res,next){ if(!ADMIN_TOKEN) return res.status(503).json({ok:false,message:'管理端未配置 ADMIN_TOKEN'}); const token=(req.get('authorization')||'').replace(/^Bearer\s+/i,''); if(token!==ADMIN_TOKEN)return res.status(401).json({ok:false,message:'管理令牌无效'}); next(); }
function limited(req,res,next){ const now=Date.now(), key=req.ip; const old=rate.get(key)||[]; const recent=old.filter(t=>now-t<60000); if(recent.length>=20)return res.status(429).json({ok:false,message:'提交过于频繁，请稍后再试'}); recent.push(now);rate.set(key,recent);next(); }
// 旧带后缀 URL 301 到无后缀版（必须放在 express.static 之前）
app.get(['/blueprints.html','/admin.html','/battle.html'],(req,res)=>res.redirect(301,req.path.replace(/.html$/,'')));
app.use(helmet({ contentSecurityPolicy:false })); app.use(morgan('tiny')); app.use(express.json({limit:'100kb'})); app.use(express.urlencoded({extended:false,limit:'100kb'})); app.use(express.static(__dirname));
const servers=[{id:'pangpang-100x',name:'失控进化 · 百倍三天极速战局',description:'四人服 / 40倍建材爆率 / 卡房冷却减半 / 严禁炸组 / 24小时轮班巡查',status:'online',statusLabel:'已重启',players:'4 人服',ping:null,openedAt:'2026.09.22'},{id:'build-lab',name:'胖胖 · 建造实验室',description:'建筑挑战 / 电路共创 / 和平模式',status:'preparing',statusLabel:'筹备中',players:'—',ping:null,openedAt:'即将开放'},{id:'weekend-arena',name:'胖胖 · 周末竞技场',description:'限时 PvP / 统一装备 / 社区比赛',status:'event',statusLabel:'活动服',players:'—',ping:null,openedAt:'周六 20:00'}];
app.get('/api/health',(_req,res)=>res.json({ok:true,service:'pangpang-community'}));
app.get('/api/servers',(_req,res)=>res.json({updatedAt:new Date().toISOString(),servers}));
app.post('/api/submissions',limited,(req,res)=>{const body=req.body||{};const type=String(body.type||'recruit');const name=String(body.name||'').trim();const contact=String(body.contact||'').trim();if(!name||!contact)return res.status(400).json({ok:false,message:'请填写称呼和联系方式'});if(!['recruit','report','suggestion'].includes(type))return res.status(400).json({ok:false,message:'提交类型无效'});const item={id:`sub_${Date.now()}_${Math.random().toString(36).slice(2,7)}`,type,role:String(body.role||''),name,contact,message:String(body.message||'').trim().slice(0,2000),createdAt:new Date().toISOString(),status:'new'};const items=readItems();items.unshift(item);writeItems(items);res.status(201).json({ok:true,id:item.id,message:'提交成功，请添加微信 welink404'});});
app.get('/api/admin/submissions',adminOnly,(req,res)=>{let items=readItems();if(req.query.status)items=items.filter(x=>x.status===req.query.status);res.json({ok:true,total:items.length,items});});
app.patch('/api/admin/submissions/:id',adminOnly,(req,res)=>{const items=readItems();const item=items.find(x=>x.id===req.params.id);if(!item)return res.status(404).json({ok:false,message:'记录不存在'});if(req.body.status&&!['new','processing','done','archived'].includes(req.body.status))return res.status(400).json({ok:false,message:'状态无效'});Object.assign(item,{status:req.body.status||item.status,adminNote:String(req.body.adminNote||item.adminNote||'').slice(0,1000),updatedAt:new Date().toISOString()});writeItems(items);res.json({ok:true,item});});
app.delete('/api/admin/submissions/:id',adminOnly,(req,res)=>{const items=readItems();const next=items.filter(x=>x.id!==req.params.id);if(next.length===items.length)return res.status(404).json({ok:false,message:'记录不存在'});writeItems(next);res.json({ok:true});});
// 无后缀页面路由: /blueprints -> blueprints.html, /admin -> admin.html
app.get(['/blueprints','/admin','/battle'],(req,res)=>res.sendFile(path.join(__dirname,req.path.slice(1)+'.html')));
app.get('*',(_req,res)=>res.sendFile(path.join(__dirname,'index.html')));
app.listen(PORT,()=>console.log(`Pangpang community running at http://localhost:${PORT}`));

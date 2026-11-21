# Cortex

个人知识库。前端 React + Vite + TypeScript + Tailwind，后端 Python + FastAPI，内置 AI 检索（Claude）。

## 结构

```
cortex/
├── backend/            FastAPI 后端
│   ├── app/
│   │   ├── main.py         入口，路由注册 + CORS + 建表
│   │   ├── config.py       配置（env 读取）
│   │   ├── database.py     SQLAlchemy async engine
│   │   ├── models.py        Entry 表
│   │   ├── schemas.py       Pydantic 入参 / 出参
│   │   ├── routes/
│   │   │   ├── entries.py   条目 CRUD
│   │   │   └── ai.py        AI 检索
│   │   └── services/
│   │       ├── entries.py   条目服务
│   │       └── ai.py        Claude 调用
│   ├── requirements.txt
│   └── .env.example
└── frontend/          React + Vite
    └── src/
        ├── App.tsx         主页：分区展示 + 筛选 + 搜索
        ├── api/            axios 封装
        ├── components/      Header / EntryCard / EntryModal / AskPanel
        ├── pages/          （预留）
        └── types/          TS 类型
```

## 启动

### 后端
```bash
cd cortex/backend
python -m venv .venv
.venv\Scripts\activate          # Windows
pip install -r requirements.txt
copy .env.example .env          # 填入 ANTHROPIC_API_KEY
uvicorn app.main:app --reload
```
后端跑在 http://localhost:8000，Swagger 文档在 /docs。

### 前端
```bash
cd cortex/frontend
npm install
npm run dev
```
前端跑在 http://localhost:5173，已配置代理转发 /api 到后端。

## 数据模型

`Entry` 字段：title、excerpt、content、source、category（`trade` / `en`）、tags、时间戳。

## AI 检索

`POST /api/ai/ask` 接收问题，把最近 60 条条目作为上下文喂给 Claude，返回答案和引用的条目 ID。前端用浮窗提问，被引用的条目会高亮标记。没有配置 API Key 时该接口会报错，但 CRUD 照常可用。

## 后续可加

- 全文向量检索（替换当前「全量塞 prompt」的简单做法）
- Markdown 渲染、导入导出
- 多用户 / 权限
- 部署到 GitHub Pages + Railway / Fly.io

# promptcache

A prompt caching proxy that sits between your app and LLM APIs (OpenAI, Anthropic, etc).
Hashes incoming prompts, serves cached responses, and forwards cache misses to the LLM — saving you money on repeat requests.

## Stack

| Layer     | Tech                          |
|-----------|-------------------------------|
| Frontend  | React + TypeScript + Tailwind |
| Backend   | Python + FastAPI              |
| Cache     | Redis                         |
| Database  | Supabase (Postgres)           |
| Hosting   | Railway (backend), Vercel (frontend) |

## Project structure

```
promptcache/
├── backend/
│   ├── app/
│   │   ├── api/routes/     # FastAPI route handlers
│   │   ├── cache/          # Redis cache logic
│   │   ├── core/           # Config, settings
│   │   └── db/             # Supabase client
│   ├── tests/
│   ├── Dockerfile
│   └── requirements.txt
└── frontend/               # Vite + React + TypeScript + Tailwind
```

## Getting started

### Backend

```bash
cd backend
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
cp .env.example .env   # fill in your values
uvicorn app.main:app --reload
```

Health check: `GET http://localhost:8000/health`

### Frontend

```bash
cd frontend
npm install
npm run dev
```

App runs at `http://localhost:5173`

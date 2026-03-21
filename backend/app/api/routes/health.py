import os
from fastapi import APIRouter

router = APIRouter()


@router.get("/health")
async def health_check():
    return {
        "status": "ok",
        "env": {
            "SUPABASE_URL": bool(os.environ.get("SUPABASE_URL")),
            "SUPABASE_KEY": bool(os.environ.get("SUPABASE_KEY")),
            "OPENAI_API_KEY": bool(os.environ.get("OPENAI_API_KEY")),
            "REDIS_URL": bool(os.environ.get("REDIS_URL")),
        }
    }

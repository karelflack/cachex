from fastapi import APIRouter, Header, HTTPException

from app.db.api_keys import validate_api_key
from app.db.client import get_supabase

router = APIRouter(prefix="/dashboard")


@router.get("/stats")
async def get_stats(x_api_key: str = Header(...)):
    validated = await validate_api_key(x_api_key)
    if not validated:
        raise HTTPException(status_code=401, detail="Invalid or inactive API key")

    db = get_supabase()
    logs = (
        db.table("usage_logs")
        .select("cached, prompt_tokens, completion_tokens")
        .eq("tenant_id", validated.tenant_id)
        .execute()
    ).data

    total = len(logs)
    cached = sum(1 for r in logs if r["cached"])
    live = total - cached
    prompt_tokens = sum(r["prompt_tokens"] or 0 for r in logs if not r["cached"])
    completion_tokens = sum(r["completion_tokens"] or 0 for r in logs if not r["cached"])

    # Rough cost estimate saved: cached requests * avg tokens * gpt-4o-mini price
    avg_tokens = (prompt_tokens + completion_tokens) / live if live > 0 else 0
    cost_per_token = 0.00000015  # $0.15 per 1M tokens (gpt-4o-mini blended)
    estimated_saved_usd = cached * avg_tokens * cost_per_token

    return {
        "total_requests": total,
        "cached_requests": cached,
        "live_requests": live,
        "cache_hit_rate": round(cached / total * 100, 1) if total > 0 else 0,
        "prompt_tokens_used": prompt_tokens,
        "completion_tokens_used": completion_tokens,
        "estimated_saved_usd": round(estimated_saved_usd, 4),
    }


@router.get("/usage")
async def get_usage(
    x_api_key: str = Header(...),
    limit: int = 50,
):
    validated = await validate_api_key(x_api_key)
    if not validated:
        raise HTTPException(status_code=401, detail="Invalid or inactive API key")

    db = get_supabase()
    logs = (
        db.table("usage_logs")
        .select("id, provider, model, cached, prompt_tokens, completion_tokens, created_at")
        .eq("tenant_id", validated.tenant_id)
        .order("created_at", desc=True)
        .limit(limit)
        .execute()
    ).data

    return logs

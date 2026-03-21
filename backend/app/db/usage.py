from app.db.client import get_supabase


async def log_usage(
    tenant_id: str,
    api_key_id: str,
    provider: str,
    model: str,
    cached: bool,
    prompt_hash: str,
    prompt_tokens: int | None = None,
    completion_tokens: int | None = None,
) -> None:
    db = get_supabase()
    db.table("usage_logs").insert({
        "tenant_id": tenant_id,
        "api_key_id": api_key_id,
        "provider": provider,
        "model": model,
        "cached": cached,
        "prompt_hash": prompt_hash,
        "prompt_tokens": prompt_tokens,
        "completion_tokens": completion_tokens,
    }).execute()

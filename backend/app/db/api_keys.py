import hashlib
from dataclasses import dataclass
from datetime import datetime, timezone

from app.db.client import get_supabase


@dataclass
class ValidatedKey:
    api_key_id: str
    tenant_id: str


def _hash_key(raw_key: str) -> str:
    return hashlib.sha256(raw_key.encode()).hexdigest()


async def validate_api_key(raw_key: str) -> ValidatedKey | None:
    """Returns ValidatedKey if the key exists and is active, else None."""
    db = get_supabase()
    result = (
        db.table("api_keys")
        .select("id, tenant_id")
        .eq("key_hash", _hash_key(raw_key))
        .eq("is_active", True)
        .single()
        .execute()
    )
    if not result.data:
        return None

    # Update last_used_at in the background (fire and forget)
    db.table("api_keys").update(
        {"last_used_at": datetime.now(timezone.utc).isoformat()}
    ).eq("id", result.data["id"]).execute()

    return ValidatedKey(
        api_key_id=result.data["id"],
        tenant_id=result.data["tenant_id"],
    )

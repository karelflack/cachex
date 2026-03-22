import hashlib
import secrets

from fastapi import APIRouter, Depends, HTTPException
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer

from app.db.client import get_supabase

router = APIRouter(prefix="/api/keys")
_bearer = HTTPBearer()


def _hash_key(raw_key: str) -> str:
    return hashlib.sha256(raw_key.encode()).hexdigest()


def _get_user_id(credentials: HTTPAuthorizationCredentials) -> str:
    """Verify Supabase JWT and return the user's UUID."""
    db = get_supabase()
    try:
        result = db.auth.get_user(credentials.credentials)
        return result.user.id
    except Exception:
        raise HTTPException(status_code=401, detail="Invalid or expired token")


def _get_or_create_tenant(user_id: str) -> str:
    """Return tenant_id for a user, creating a tenant if one doesn't exist yet."""
    db = get_supabase()
    result = db.table("tenants").select("id").eq("user_id", user_id).execute()
    if result.data:
        return result.data[0]["id"]

    new_tenant = (
        db.table("tenants")
        .insert({"user_id": user_id, "name": "default"})
        .execute()
    )
    return new_tenant.data[0]["id"]


@router.get("")
async def list_keys(credentials: HTTPAuthorizationCredentials = Depends(_bearer)):
    user_id = _get_user_id(credentials)
    tenant_id = _get_or_create_tenant(user_id)

    db = get_supabase()
    rows = (
        db.table("api_keys")
        .select("id, name, key_prefix, is_active, created_at, last_used_at")
        .eq("tenant_id", tenant_id)
        .order("created_at", desc=True)
        .execute()
    ).data

    return [
        {
            "id": r["id"],
            "name": r["name"],
            "key_prefix": r["key_prefix"],
            "status": "active" if r["is_active"] else "revoked",
            "created_at": r["created_at"],
            "last_used_at": r["last_used_at"],
        }
        for r in rows
    ]


@router.post("", status_code=201)
async def create_key(
    body: dict,
    credentials: HTTPAuthorizationCredentials = Depends(_bearer),
):
    user_id = _get_user_id(credentials)
    tenant_id = _get_or_create_tenant(user_id)

    name = (body.get("name") or "").strip() or "default"
    raw_key = "cxk_" + secrets.token_urlsafe(32)
    prefix = raw_key[:12]  # "cxk_" + 8 chars

    db = get_supabase()
    row = (
        db.table("api_keys")
        .insert(
            {
                "tenant_id": tenant_id,
                "key_hash": _hash_key(raw_key),
                "key_prefix": prefix,
                "name": name,
            }
        )
        .execute()
    ).data[0]

    return {
        "id": row["id"],
        "name": row["name"],
        "key": raw_key,
        "created_at": row["created_at"],
    }


@router.delete("/{key_id}", status_code=204)
async def revoke_key(
    key_id: str,
    credentials: HTTPAuthorizationCredentials = Depends(_bearer),
):
    user_id = _get_user_id(credentials)
    tenant_id = _get_or_create_tenant(user_id)

    db = get_supabase()
    result = (
        db.table("api_keys")
        .update({"is_active": False})
        .eq("id", key_id)
        .eq("tenant_id", tenant_id)  # ensures users can only revoke their own keys
        .execute()
    )
    if not result.data:
        raise HTTPException(status_code=404, detail="Key not found")

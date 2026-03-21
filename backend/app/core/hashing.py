import hashlib
import json


def hash_prompt(model: str, messages: list[dict]) -> str:
    """Deterministic SHA-256 hash of model + messages.
    Messages are sorted by role+content to normalize ordering."""
    payload = {"model": model, "messages": messages}
    serialized = json.dumps(payload, sort_keys=True, ensure_ascii=False)
    return hashlib.sha256(serialized.encode()).hexdigest()


def make_cache_key(tenant_id: str, prompt_hash: str) -> str:
    """Namespace cache keys by tenant so data never leaks across accounts."""
    return f"{tenant_id}:{prompt_hash}"

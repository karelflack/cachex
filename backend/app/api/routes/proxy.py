import httpx
from fastapi import APIRouter, Header, HTTPException
from pydantic import BaseModel

from app.cache.client import cache_get, cache_set
from app.core.config import settings
from app.core.hashing import hash_prompt, make_cache_key
from app.db.api_keys import validate_api_key
from app.db.usage import log_usage

router = APIRouter()

PROVIDER_URLS = {
    "openai": "https://api.openai.com/v1/chat/completions",
    "anthropic": "https://api.anthropic.com/v1/messages",
}

PROVIDER_KEYS = {
    "openai": lambda: settings.openai_api_key,
    "anthropic": lambda: settings.anthropic_api_key,
}


class ProxyRequest(BaseModel):
    provider: str = "openai"  # "openai" | "anthropic"
    model: str
    messages: list[dict]
    temperature: float | None = None
    max_tokens: int | None = None


def _extract_token_counts(provider: str, response: dict) -> tuple[int | None, int | None]:
    try:
        if provider == "openai":
            usage = response.get("usage", {})
            return usage.get("prompt_tokens"), usage.get("completion_tokens")
        elif provider == "anthropic":
            usage = response.get("usage", {})
            return usage.get("input_tokens"), usage.get("output_tokens")
    except Exception:
        pass
    return None, None


@router.post("/proxy")
async def proxy(
    request: ProxyRequest,
    x_api_key: str = Header(..., description="Tenant API key"),
):
    # Validate API key against database
    validated = await validate_api_key(x_api_key)
    if not validated:
        raise HTTPException(status_code=401, detail="Invalid or inactive API key")

    if request.provider not in PROVIDER_URLS:
        raise HTTPException(status_code=400, detail=f"Unsupported provider: {request.provider}")

    provider_key = PROVIDER_KEYS[request.provider]()
    if not provider_key:
        raise HTTPException(status_code=500, detail=f"{request.provider} API key not configured")

    # Check cache
    prompt_hash = hash_prompt(request.model, request.messages)
    cache_key = make_cache_key(validated.tenant_id, prompt_hash)
    cached = await cache_get(cache_key)

    if cached is not None:
        await log_usage(
            tenant_id=validated.tenant_id,
            api_key_id=validated.api_key_id,
            provider=request.provider,
            model=request.model,
            cached=True,
            prompt_hash=prompt_hash,
        )
        return {"cached": True, "response": cached}

    # Cache miss — forward to provider
    body = {"model": request.model, "messages": request.messages}
    if request.temperature is not None:
        body["temperature"] = request.temperature
    if request.max_tokens is not None:
        body["max_tokens"] = request.max_tokens

    if request.provider == "openai":
        headers = {"Authorization": f"Bearer {provider_key}"}
    else:  # anthropic
        headers = {"x-api-key": provider_key, "anthropic-version": "2023-06-01"}

    async with httpx.AsyncClient(timeout=60) as client:
        resp = await client.post(PROVIDER_URLS[request.provider], json=body, headers=headers)

    if resp.status_code != 200:
        raise HTTPException(status_code=resp.status_code, detail=resp.text)

    result = resp.json()
    prompt_tokens, completion_tokens = _extract_token_counts(request.provider, result)

    await cache_set(cache_key, result)
    await log_usage(
        tenant_id=validated.tenant_id,
        api_key_id=validated.api_key_id,
        provider=request.provider,
        model=request.model,
        cached=False,
        prompt_hash=prompt_hash,
        prompt_tokens=prompt_tokens,
        completion_tokens=completion_tokens,
    )

    return {"cached": False, "response": result}

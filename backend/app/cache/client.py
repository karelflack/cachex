import json
import redis.asyncio as redis
from app.core.config import settings

_redis: redis.Redis | None = None


def get_redis() -> redis.Redis:
    global _redis
    if _redis is None:
        _redis = redis.from_url(settings.redis_url, decode_responses=True)
    return _redis


async def cache_get(key: str) -> dict | None:
    client = get_redis()
    value = await client.get(key)
    if value is None:
        return None
    return json.loads(value)


async def cache_set(key: str, value: dict, ttl: int = None) -> None:
    client = get_redis()
    ttl = ttl or settings.cache_ttl
    await client.setex(key, ttl, json.dumps(value))

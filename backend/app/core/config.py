from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    app_name: str = "promptcache"
    debug: bool = False

    # Redis
    redis_url: str = "redis://localhost:6379"
    cache_ttl: int = 60 * 60 * 24 * 7  # 7 days in seconds

    # LLM providers
    openai_api_key: str = ""
    anthropic_api_key: str = ""

    # Supabase
    supabase_url: str = ""
    supabase_key: str = ""

    # CORS
    frontend_url: str = "http://localhost:5173"

    class Config:
        env_file = ".env"


settings = Settings()

from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    app_name: str = "promptcache"
    debug: bool = False

    # Redis
    redis_url: str = "redis://localhost:6379"

    # Supabase
    supabase_url: str = ""
    supabase_key: str = ""

    class Config:
        env_file = ".env"


settings = Settings()

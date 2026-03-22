import os
import logging
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.routes import health, proxy, dashboard, keys
from app.core.config import settings

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)
logger.info(f"SUPABASE_URL from env: {bool(os.environ.get('SUPABASE_URL'))}")
logger.info(f"SUPABASE_URL from settings: {bool(settings.supabase_url)}")

app = FastAPI(
    title=settings.app_name,
    debug=settings.debug,
)

_frontend_url = os.environ.get("FRONTEND_URL", settings.frontend_url)
app.add_middleware(
    CORSMiddleware,
    allow_origins=[_frontend_url, "http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(health.router)
app.include_router(proxy.router)
app.include_router(dashboard.router)
app.include_router(keys.router)

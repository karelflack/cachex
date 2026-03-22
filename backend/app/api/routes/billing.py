import os

import stripe
from fastapi import APIRouter, Depends, HTTPException, Request
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer

from app.db.client import get_supabase

router = APIRouter(prefix="/billing")
_bearer = HTTPBearer(auto_error=False)

stripe.api_key = os.environ.get("STRIPE_SECRET_KEY", "")

PRICE_IDS = {
    "starter": "price_1TDju96VgLStgFZ0TF3JKpiI",
    "growth": "price_1TDjuX6VgLStgFZ0EdhcMsBS",
    "scale": "price_1TDjuz6VgLStgFZ0DhY53C1J",
}

PLAN_LIMITS = {
    "free": 50_000,
    "starter": 1_000_000,
    "growth": 10_000_000,
    "scale": 50_000_000,
}

FRONTEND_URL = os.environ.get("FRONTEND_URL", "http://localhost:5173")


def _get_user_and_tenant(credentials: HTTPAuthorizationCredentials):
    db = get_supabase()
    try:
        result = db.auth.get_user(credentials.credentials)
        user_id = result.user.id
        email = result.user.email
    except Exception:
        raise HTTPException(status_code=401, detail="Invalid or expired token")

    rows = db.table("tenants").select("id, stripe_customer_id, plan").eq("user_id", user_id).execute()
    if not rows.data:
        raise HTTPException(status_code=404, detail="No tenant found")
    tenant = rows.data[0]
    return user_id, email, tenant


@router.post("/checkout")
async def create_checkout(
    body: dict,
    credentials: HTTPAuthorizationCredentials = Depends(_bearer),
):
    plan = body.get("plan", "").lower()
    if plan not in PRICE_IDS:
        raise HTTPException(status_code=400, detail=f"Invalid plan: {plan}")

    _, email, tenant = _get_user_and_tenant(credentials)
    tenant_id = tenant["id"]

    # Reuse existing Stripe customer or create new one
    customer_id = tenant.get("stripe_customer_id")
    if not customer_id:
        customer = stripe.Customer.create(email=email, metadata={"tenant_id": tenant_id})
        customer_id = customer.id
        get_supabase().table("tenants").update({"stripe_customer_id": customer_id}).eq("id", tenant_id).execute()

    session = stripe.checkout.Session.create(
        customer=customer_id,
        payment_method_types=["card"],
        line_items=[{"price": PRICE_IDS[plan], "quantity": 1}],
        mode="subscription",
        success_url=f"{FRONTEND_URL}/dashboard?upgraded=true",
        cancel_url=f"{FRONTEND_URL}/dashboard",
        metadata={"tenant_id": tenant_id, "plan": plan},
    )
    return {"url": session.url}


@router.post("/webhook")
async def stripe_webhook(request: Request):
    payload = await request.body()
    sig = request.headers.get("stripe-signature", "")
    webhook_secret = os.environ.get("STRIPE_WEBHOOK_SECRET", "")

    try:
        event = stripe.Webhook.construct_event(payload, sig, webhook_secret)
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid webhook signature")

    db = get_supabase()

    if event["type"] == "checkout.session.completed":
        session = event["data"]["object"]
        tenant_id = session["metadata"]["tenant_id"]
        plan = session["metadata"]["plan"]
        subscription_id = session.get("subscription")
        db.table("tenants").update({
            "plan": plan,
            "stripe_subscription_id": subscription_id,
        }).eq("id", tenant_id).execute()

    elif event["type"] in ("customer.subscription.deleted", "customer.subscription.paused"):
        sub = event["data"]["object"]
        db.table("tenants").update({"plan": "free"}).eq("stripe_subscription_id", sub["id"]).execute()

    return {"ok": True}

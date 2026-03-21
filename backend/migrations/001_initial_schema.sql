-- Tenants: one row per company using the proxy
create table tenants (
    id          uuid primary key default gen_random_uuid(),
    name        text not null,
    created_at  timestamptz not null default now()
);

-- API keys: tenants can have multiple keys (rotate, revoke, label per env)
-- We store a SHA-256 hash of the key — never the plaintext
create table api_keys (
    id           uuid primary key default gen_random_uuid(),
    tenant_id    uuid not null references tenants(id) on delete cascade,
    key_hash     text not null unique,
    name         text not null,             -- e.g. "production", "staging"
    is_active    boolean not null default true,
    created_at   timestamptz not null default now(),
    last_used_at timestamptz
);

-- Usage logs: every proxy request, cached or not
create table usage_logs (
    id                 uuid primary key default gen_random_uuid(),
    tenant_id          uuid not null references tenants(id) on delete cascade,
    api_key_id         uuid not null references api_keys(id) on delete cascade,
    provider           text not null,       -- "openai" | "anthropic"
    model              text not null,
    cached             boolean not null,
    prompt_hash        text not null,
    prompt_tokens      int,
    completion_tokens  int,
    created_at         timestamptz not null default now()
);

-- Indexes for dashboard queries
create index on usage_logs (tenant_id, created_at desc);
create index on usage_logs (tenant_id, cached);
create index on api_keys (key_hash) where is_active = true;

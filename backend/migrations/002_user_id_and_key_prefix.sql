-- Link tenants to Supabase auth users
alter table tenants add column user_id uuid unique;

-- Store key prefix for display (e.g. "cxk_abc12345")
alter table api_keys add column key_prefix text not null default '';

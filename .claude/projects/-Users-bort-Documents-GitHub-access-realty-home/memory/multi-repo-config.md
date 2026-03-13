# Multi-Repo Architecture & Staging

## Domain Architecture

| Environment | Marketing | App | CRM |
|-------------|-----------|-----|-----|
| **Production** | `access.realty` | `access.realty/app` | `access.realty/crm` |
| **Staging** | `staging.access.realty` | `staging.access.realty/app` | `staging.access.realty/crm` |
| **Local** | `localhost:4000` | `localhost:3000` | `localhost:3000/?subdomain=crm` |

## DNS (Namecheap)

`access.realty` nameservers at Namecheap (not Vercel). All subdomains use CNAMEs:

| Host | Value | Project |
|------|-------|---------|
| `@` | `216.198.79.1` (A record) | marketing prod |
| `www` | `cname.vercel-dns.com` | marketing prod |
| `app` | `dc849e24065395d8.vercel-dns-017.com` | app prod |
| `app.staging` | `18287db4b2bd8542.vercel-dns-017.com` | app staging |
| `crm` | `18287db4b2bd8542.vercel-dns-017.com` | CRM prod |
| `crm.staging` | `18287db4b2bd8542.vercel-dns-017.com` | CRM staging |
| `staging` | `18287db4b2bd8542.vercel-dns-017.com` | marketing staging |

Note: `18287db...` is used across multiple projects/envs — it's a team-level CNAME, not project-specific.

## Vercel Projects

| Repo | Vercel Project | Production Domain | Staging Domain |
|------|---------------|-------------------|----------------|
| access-realty-home | `access-realty-home` (prj_l5Am...) | `access.realty` | `staging.access.realty` → branch `staging/test-stripe-e2e` |
| access-realty-app | `access-realty-app` | `access.realty/app` | `staging.access.realty/app` |

## Staging Env Vars (Marketing Site - Preview)

Preview env vars on Vercel `access-realty-home` project:
- `STRIPE_SECRET_KEY` — test mode (`sk_test_51SNJm...`)
- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` — test mode (`pk_test_51SNJm...`)
- `STRIPE_PRICE_DIRECT_LIST` — test price ID
- `STRIPE_PRICE_DIRECT_LIST_PLUS` — test price ID
- `NEXT_PUBLIC_APP_URL` — `https://staging.access.realty/app`
- `NEXT_PUBLIC_SUPABASE_URL` — staging Supabase
- `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` — same key as production

## Staging Supabase (App Repo)

- Branch: `staging` (single persistent branch shared by all PRs)
- Project ref: `efjwophipckazsgulmgn`
- URL: `https://efjwophipckazsgulmgn.supabase.co`

## Deployment Protection

Preview deployments on `access-realty-home` are SSO-protected by default.
`staging.access.realty` must be added as a **Deployment Protection Exception**
in Vercel Dashboard → Settings → Deployment Protection to be publicly accessible.

## Cross-Repo Stripe Flow

Both repos use the same Stripe account (`51SNJm`). Marketing site creates checkout sessions,
app verifies them. Both must use the same account so session IDs are valid across repos.

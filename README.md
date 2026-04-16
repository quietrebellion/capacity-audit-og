# Capacity Audit OG Image Service

Dynamic Open Graph image generator for the C.H.E.A.T. Code™ Capacity Audit share links. When someone shares their results on LinkedIn, X, or iMessage, the preview card shows their actual score and dimension breakdown instead of a generic image.

## How it works

Two endpoints:

- **`/api/og?r=5544336287`** — Returns a 1200×630 PNG image with the score, label, and dimension bars rendered dynamically from the encoded scores.
- **`/api/share?r=5544336287`** — Returns a minimal HTML page with the correct `og:image` meta tag pointing at `/api/og`, then instantly redirects the user to `capacityaudit.rebellioncollective.com/?r=...`. Crawlers read the meta tags; humans get redirected in milliseconds.

## Deploy to Vercel

1. Push this folder to a new GitHub repo (e.g., `quietrebellion/capacity-audit-og`)
2. Go to [vercel.com](https://vercel.com) and sign up / sign in with GitHub
3. Click **"Add New Project"** → Import the `capacity-audit-og` repo
4. Leave all settings as default → Click **Deploy**
5. Vercel gives you a URL like `capacity-audit-og.vercel.app`
6. Update the `OG_HOST` variable in `cheat-code-diagnostic/index.html` to match your Vercel URL

## Optional: Custom subdomain

If you want `share.rebellioncollective.com` instead of the Vercel URL:
1. In Vercel project settings → Domains → Add `share.rebellioncollective.com`
2. In Squarespace DNS → Add a CNAME record: `share` → `cname.vercel-dns.com`
3. Update `OG_HOST` in index.html to `https://share.rebellioncollective.com`

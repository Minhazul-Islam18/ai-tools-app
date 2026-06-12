# GenKit — Deploy to aaPanel server via GitHub Actions CI/CD

**Target server:** `185.194.141.86` (aaPanel). **Trigger:** push to `main` →
GitHub Action SSHes in → `deploy/deploy.sh` runs build-on-server:
`git pull → wasp build → docker compose up (server + postgres) → migrate →
vite build client → copy static to aaPanel docroot`.

- Client: `https://scribegem.com` (static, served by aaPanel site)
- API:    `https://api.scribegem.com` (aaPanel **reverse proxy** → `127.0.0.1:3001`)
- Postgres: docker container (volume `genkit_db`)
- Server container binds `127.0.0.1:3001` (localhost only; aaPanel proxies in)

> Reverse-proxy + SSL are managed in the **aaPanel UI**, not by the script.
> The script only runs containers + drops client files into the site docroot.

============================================================
## ONE-TIME SETUP (on the aaPanel server)
============================================================

### 1. DNS
At your DNS host, both → server IP:
```
scribegem.com        A   185.194.141.86
api.scribegem.com    A   185.194.141.86
```
Verify: `ping scribegem.com` and `ping api.scribegem.com` show that IP.

### 2. Install Docker (aaPanel App Store → Docker Manager)
Or via SSH on the server:
```bash
curl -fsSL https://get.docker.com | sh
usermod -aG docker <deploy-user>     # so deploy runs docker without sudo
# log out/in
docker --version && docker compose version
```

### 3. Install Node + Wasp CLI (server needs them for build-on-server)
```bash
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.1/install.sh | bash
. ~/.nvm/nvm.sh && nvm install 22 && nvm alias default 22
curl -sSL https://get.wasp.sh/installer.sh | sh      # installs `wasp`
wasp version
```

### 4. Clone the repo on the server
```bash
git clone git@github.com:Minhazul-Islam18/ai-tools-app.git /www/wwwroot/ai-tools-app
cd /www/wwwroot/ai-tools-app
```
(If using a deploy key, add it to the repo's Deploy Keys on GitHub.)

### 5. Create secret env files ON THE SERVER (never committed)
```bash
cd /www/wwwroot/ai-tools-app/deploy
cp prod.env.example prod.env   # fill every CHANGE_ME / placeholder
cp db.env.example  db.env      # set POSTGRES_PASSWORD
```
**Password in `db.env` (`POSTGRES_PASSWORD`) MUST equal the password in `prod.env`
`DATABASE_URL`.** Host stays `db`. Fill Stripe / SendGrid / OpenAI / Groq keys.
(Stripe & SendGrid keys must be NON-EMPTY or the server throws at boot.)

### 6. SendGrid — real email (app uses SendGrid, sender no-reply@scribegem.com)
Verify the sender (or domain) in SendGrid → put the API key in `prod.env`.

### 7. aaPanel — create 2 sites
**a) Client `scribegem.com`** — Website → Add site:
- Document root: `/www/wwwroot/scribegem.com`
- Pure static (no PHP).
- SPA fallback: in the site's URL Rewrite / config, route unknown paths to `/200.html`
  (Nginx: `try_files $uri /200.html;`  ·  Apache: `FallbackResource /200.html`).
  Note: the client build has **`200.html`, not `index.html`** — set it as the index.
- SSL tab → Let's Encrypt → issue + Force HTTPS.

**b) API `api.scribegem.com`** — Website → Add site → then use aaPanel's
**Reverse Proxy** feature:
- Target URL: `http://127.0.0.1:3001`
- Send Domain / Host: `api.scribegem.com`, enable WebSocket.
- SSL tab → Let's Encrypt → issue + Force HTTPS.

### 8. Permissions for the deploy user
The deploy (SSH) user must be able to write the docroot:
```bash
chown -R <deploy-user>:<deploy-user> /www/wwwroot/scribegem.com
```

### 9. First deploy (manual, to verify before CI/CD)
```bash
cd /www/wwwroot/ai-tools-app
export APP_DIR=/www/wwwroot/ai-tools-app CLIENT_WEBROOT=/www/wwwroot/scribegem.com API_URL=https://api.scribegem.com
bash deploy/deploy.sh
docker compose ps                 # db healthy, server up
docker compose logs -f server     # "Server listening on port 3001"
```
Visit https://scribegem.com.

### 10. GitHub Actions secrets (enable auto-deploy)
On the server make a deploy key:
```bash
ssh-keygen -t ed25519 -f ~/.ssh/gh_deploy -N ""
cat ~/.ssh/gh_deploy.pub >> ~/.ssh/authorized_keys
cat ~/.ssh/gh_deploy        # copy PRIVATE key
```
GitHub repo → Settings → Secrets and variables → Actions:
| Secret | Value |
|--------|-------|
| `SSH_HOST` | `185.194.141.86` |
| `SSH_USER` | the deploy user |
| `SSH_PORT` | `22` (or custom) |
| `SSH_KEY`  | the **private** key from `~/.ssh/gh_deploy` |

> If your aaPanel server paths differ from the defaults, edit the `export` lines
> in `.github/workflows/deploy.yml`.

### 11. Stripe webhook
Stripe → Developers → Webhooks → add `https://api.scribegem.com/payments-webhook`
→ copy signing secret → `STRIPE_WEBHOOK_SECRET` in `prod.env` → `docker compose up -d`.

============================================================
## EVERY DEPLOY AFTER SETUP
============================================================
```bash
git push origin main      # GitHub Action runs deploy.sh on the server
```
Manual: GitHub → Actions → Deploy → Run workflow, OR on server `bash deploy/deploy.sh`.

============================================================
## OPERATIONS (on the server)
============================================================
```bash
docker compose ps
docker compose logs -f server
docker compose restart server                # after env change
docker compose exec -T db pg_dump -U genkit_user genkit > backup_$(date +%F).sql
```

============================================================
## NOTE — local laptop test deploy
============================================================
The first run happened on the local Pop!_OS laptop (192.168.0.197) for testing —
containers + Apache vhosts there are NOT production. Stop them when done:
`docker compose down` in the laptop's project dir.

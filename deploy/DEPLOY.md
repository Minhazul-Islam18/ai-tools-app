# GenKit — aaPanel deploy

Wasp 0.23 · Postgres · Stripe · email-auth. Files in this `deploy/` dir.

## 0. Pre-build fix (do once)
`main.wasp:58` has `provider: Dummy` — Dummy = no real emails = broken prod auth.
Switch to SendGrid (you have `SENDGRID_API_KEY`):

```wasp
emailSender: {
  provider: SendGrid,
  defaultFrom: {
    name: "GenKit",
    email: "no-reply@scribegem.com",   // must be a SendGrid-verified sender
  },
}
```

## 1. aaPanel installs
App Store → Node.js 20 (PM2 Manager), PostgreSQL, Nginx, Docker Manager (Docker path).

## 2. Database
aaPanel → Databases → PostgreSQL → create db `genkit` + user. Put creds in `deploy/prod.env` `DATABASE_URL`.

## 3. Build
```bash
cd /var/www/minhazul.site/ai-tools-app
wasp build                 # outputs .wasp/build/
```

## 4. Server (Docker path — recommended)
```bash
cd .wasp/build
docker build -t genkit-server .
docker run -d --name genkit-server --restart unless-stopped \
  -p 127.0.0.1:3001:3001 \
  --env-file /var/www/minhazul.site/ai-tools-app/deploy/prod.env \
  genkit-server
docker exec genkit-server npx prisma migrate deploy
docker logs -f genkit-server     # verify boot
```
Server path (PM2 instead of Docker): `cd .wasp/build && npm install && npx prisma migrate deploy`, then add as PM2 app, entry `npm run start-production`, env from prod.env, port 3001.

## 5. Client (static)
```bash
cd .wasp/build/web-app
npm install
REACT_APP_API_URL=https://api.scribegem.com npm run build
cp -r build/* /www/wwwroot/scribegem.com/    # aaPanel client site root
```

## 6. Nginx (2 aaPanel sites)
- `scribegem.com`  → paste `nginx-client.conf` location blocks, root = client build dir.
- `api.scribegem.com` → paste `nginx-api.conf` (reverse proxy 127.0.0.1:3001).
- Enable Let's Encrypt SSL on both (aaPanel SSL tab).

## 7. Stripe webhook
Stripe dashboard → Developers → Webhooks → add endpoint:
`https://api.scribegem.com/payments-webhook`
Copy signing secret → `STRIPE_WEBHOOK_SECRET` in prod.env → restart server.

## Redeploy (after code change)
```bash
wasp build
cd .wasp/build && docker build -t genkit-server . \
  && docker stop genkit-server && docker rm genkit-server \
  && docker run -d --name genkit-server --restart unless-stopped \
     -p 127.0.0.1:3001:3001 --env-file ../../deploy/prod.env genkit-server \
  && docker exec genkit-server npx prisma migrate deploy
# client
cd web-app && npm install && REACT_APP_API_URL=https://api.scribegem.com npm run build \
  && cp -r build/* /www/wwwroot/scribegem.com/
```

## Checklist
- [ ] Dummy → SendGrid done before build
- [ ] real DATABASE_URL (not dev localhost creds)
- [ ] JWT_SECRET set (rotate the one in prod.env)
- [ ] WASP_WEB_CLIENT_URL / WASP_SERVER_URL = real domains
- [ ] migrate deploy ran (tables exist)
- [ ] Stripe webhook registered + secret set
- [ ] SSL on both domains
- [ ] ADMIN_EMAILS = your email (admin dashboard access)

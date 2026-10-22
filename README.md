# Orbit live chat

A Vite support dashboard and embeddable website chat with a small Node API.

## Local development

```sh
npm install
npm run dev
```

The dashboard runs at Vite's local URL and the API runs on port `3001`. The Vite proxy connects `/api` requests to the API server. Use **Website widget** in the left navigation to add an allowed hostname and copy the embed snippet. On another local page, or a deployed site, paste the snippet before `</body>`.

The API checks the visitor page's `Origin` against the domain list saved by the dashboard. Visitor conversations are stored in `data/chat-store.json`, appear in the inbox, and agent replies are polled by the widget.

## Production

Build and start the Node server:

```sh
npm run build
npm start
```

For Vercel, the app includes a serverless catch-all API in `api/[...path].js`. Add an Upstash Redis database to the Vercel project so domains and conversations persist across serverless requests. The integration must provide `UPSTASH_REDIS_REST_URL` and `UPSTASH_REDIS_REST_TOKEN`; then redeploy. The API returns a clear setup error until both values are configured.

For a traditional Node host, `npm start` runs the file-backed API in `server.js`. Put the server behind HTTPS and a public hostname before embedding it on other sites. If a reverse proxy changes the public hostname, set `APP_ORIGIN` to the dashboard's public origin (for example, `https://chat.example.com`). Set `PORT` if the host assigns the listening port.

This is a single-workspace MVP. It does not include user accounts, billing, team permissions, spam controls, or multi-tenant controls. Add authentication and tenant-level authorization before offering public customer accounts.

import http from 'node:http'
import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { createHash, randomBytes, randomUUID } from 'node:crypto'

const root = path.dirname(fileURLToPath(import.meta.url))
const dataFile = path.join(root, 'data', 'chat-store.json')
const port = Number(process.env.PORT || 3001)
const clients = new Set()
let store = { sites: {}, conversations: {} }

async function loadStore() {
  try { store = JSON.parse(await fs.readFile(dataFile, 'utf8')) } catch { await saveStore() }
}

async function saveStore() {
  await fs.mkdir(path.dirname(dataFile), { recursive: true })
  const temporaryFile = `${dataFile}.tmp`
  await fs.writeFile(temporaryFile, JSON.stringify(store, null, 2))
  await fs.rename(temporaryFile, dataFile)
}

function json(response, status, body, origin = '*') {
  response.writeHead(status, { 'content-type': 'application/json; charset=utf-8', 'access-control-allow-origin': origin, 'access-control-allow-methods': 'GET,POST,PUT,OPTIONS', 'access-control-allow-headers': 'content-type' })
  response.end(JSON.stringify(body))
}

function readBody(request) {
  return new Promise((resolve, reject) => {
    let body = ''
    request.on('data', chunk => { body += chunk; if (body.length > 1_000_000) reject(new Error('Request body too large')) })
    request.on('end', () => { try { resolve(JSON.parse(body || '{}')) } catch { reject(new Error('Invalid JSON')) } })
    request.on('error', reject)
  })
}

function originHost(request) {
  try { return new URL(request.headers.origin).hostname.toLowerCase() } catch { return '' }
}

function isDashboardRequest(request) {
  try {
    const origin = new URL(request.headers.origin)
    if (process.env.APP_ORIGIN && origin.origin !== process.env.APP_ORIGIN) return false
    const requestHost = new URL(`http://${request.headers.host}`).hostname.toLowerCase()
    return origin.hostname === requestHost || origin.hostname === 'localhost' || origin.hostname === '127.0.0.1'
  } catch { return false }
}

function tokenHash(token) { return createHash('sha256').update(token).digest('hex') }

function findSiteForRequest(request, siteId) {
  const site = store.sites[siteId]
  if (!site) return null
  const host = originHost(request)
  // Visitor access is open to any website. The public site ID still identifies
  // the workspace, and visitor tokens protect access to each conversation.
  return host ? site : null
}

function publish(siteId, event) {
  const payload = `data: ${JSON.stringify(event)}\n\n`
  for (const client of clients) if (client.siteId === siteId) client.response.write(payload)
}

function safeConversation(conversation) {
  return { id: conversation.id, siteId: conversation.siteId, name: conversation.name, email: conversation.email, domain: conversation.domain, status: conversation.status, updatedAt: conversation.updatedAt, messages: conversation.messages }
}

async function api(request, response, url) {
  const origin = request.headers.origin || '*'
  const pathParts = url.pathname.split('/').filter(Boolean)
  if (request.method === 'OPTIONS') { response.writeHead(204, { 'access-control-allow-origin': origin, 'access-control-allow-methods': 'GET,POST,PUT,OPTIONS', 'access-control-allow-headers': 'content-type' }); response.end(); return true }

  if (pathParts[1] === 'sites' && pathParts.length === 2 && request.method === 'POST') {
    if (!isDashboardRequest(request)) { json(response, 403, { error: 'Dashboard access required.' }, origin); return true }
    const body = await readBody(request)
    const id = String(body.id || randomUUID().slice(0, 8))
    if (!store.sites[id]) store.sites[id] = { id, domains: [], createdAt: new Date().toISOString() }
    await saveStore()
    json(response, 200, store.sites[id], origin)
    return true
  }

  if (pathParts[1] === 'sites' && pathParts.length === 3) {
    const siteId = pathParts[2]
    if (request.method === 'GET') {
      if (!isDashboardRequest(request)) { json(response, 403, { error: 'Dashboard access required.' }, origin); return true }
      const site = store.sites[siteId]
      if (!site) { json(response, 404, { error: 'Site not found' }, origin); return true }
      json(response, 200, site, origin)
      return true
    }
    if (request.method === 'PUT') {
      if (!isDashboardRequest(request)) { json(response, 403, { error: 'Dashboard access required.' }, origin); return true }
      const body = await readBody(request)
      const domains = Array.isArray(body.domains) ? body.domains : []
      if (!store.sites[siteId]) { json(response, 404, { error: 'Site not found' }, origin); return true }
      store.sites[siteId].domains = [...new Set(domains.map(domain => String(domain).toLowerCase()))]
      await saveStore()
      json(response, 200, store.sites[siteId], origin)
      return true
    }
  }

  if (url.pathname === '/api/conversations' && request.method === 'GET') {
    if (!isDashboardRequest(request)) { json(response, 403, { error: 'Dashboard access required.' }, origin); return true }
    const siteId = url.searchParams.get('siteId')
    const site = store.sites[siteId]
    if (!site) { json(response, 404, { error: 'Site not found' }, origin); return true }
    json(response, 200, Object.values(store.conversations).filter(conversation => conversation.siteId === siteId).sort((a, b) => b.updatedAt.localeCompare(a.updatedAt)).map(safeConversation), origin)
    return true
  }

  if (url.pathname === '/api/conversations' && request.method === 'POST') {
    const body = await readBody(request)
    const site = findSiteForRequest(request, String(body.siteId || ''))
    if (!site) { json(response, 403, { error: 'This website domain is not enabled for this chat.' }, origin); return true }
    const message = String(body.message || '').trim().slice(0, 4000)
    if (!message) { json(response, 400, { error: 'A message is required.' }, origin); return true }
    const now = new Date().toISOString()
    const visitorToken = randomBytes(24).toString('hex')
    const conversation = { id: randomUUID(), siteId: site.id, name: String(body.name || 'Website visitor').slice(0, 100), email: '', domain: originHost(request), visitorTokenHash: tokenHash(visitorToken), status: 'open', updatedAt: now, messages: [{ id: randomUUID(), from: 'visitor', text: message, createdAt: now }] }
    store.conversations[conversation.id] = conversation
    await saveStore()
    publish(site.id, { type: 'conversation', conversation: safeConversation(conversation) })
    json(response, 201, { ...safeConversation(conversation), visitorToken }, origin)
    return true
  }

  if (pathParts[1] === 'conversations' && pathParts[2] && pathParts.length === 3 && request.method === 'POST') {
    if (!isDashboardRequest(request)) { json(response, 403, { error: 'Dashboard access required.' }, origin); return true }
    const conversation = store.conversations[pathParts[2]]
    if (!conversation) { json(response, 404, { error: 'Conversation not found' }, origin); return true }
    const body = await readBody(request)
    const text = String(body.text || '').trim().slice(0, 4000)
    if (!text) { json(response, 400, { error: 'A message is required.' }, origin); return true }
    const now = new Date().toISOString()
    const message = { id: randomUUID(), from: 'agent', text, createdAt: now }
    conversation.messages.push(message)
    conversation.updatedAt = now
    await saveStore()
    publish(conversation.siteId, { type: 'message', conversationId: conversation.id, message })
    json(response, 201, message, origin)
    return true
  }

  if (pathParts[1] === 'conversations' && pathParts[2] && pathParts[3] === 'visitor-messages' && request.method === 'POST') {
    const conversation = store.conversations[pathParts[2]]
    if (!conversation || !findSiteForRequest(request, conversation.siteId)) { json(response, 403, { error: 'This website domain is not enabled.' }, origin); return true }
    const body = await readBody(request)
    if (tokenHash(String(body.token || '')) !== conversation.visitorTokenHash) { json(response, 403, { error: 'Visitor access denied.' }, origin); return true }
    const text = String(body.text || '').trim().slice(0, 4000)
    if (!text) { json(response, 400, { error: 'A message is required.' }, origin); return true }
    const now = new Date().toISOString()
    const message = { id: randomUUID(), from: 'visitor', text, createdAt: now }
    conversation.messages.push(message)
    conversation.updatedAt = now
    await saveStore()
    publish(conversation.siteId, { type: 'message', conversationId: conversation.id, message })
    json(response, 201, message, origin)
    return true
  }

  if (pathParts[1] === 'conversations' && pathParts[2] && pathParts.length === 3 && request.method === 'GET') {
    const conversation = store.conversations[pathParts[2]]
    if (!conversation) { json(response, 404, { error: 'Conversation not found' }, origin); return true }
    if (!isDashboardRequest(request)) {
      const suppliedToken = url.searchParams.get('token') || ''
      if (!findSiteForRequest(request, conversation.siteId) || tokenHash(suppliedToken) !== conversation.visitorTokenHash) { json(response, 403, { error: 'Visitor access denied.' }, origin); return true }
    }
    json(response, 200, safeConversation(conversation), origin)
    return true
  }

  if (url.pathname === '/api/events' && request.method === 'GET') {
    if (!isDashboardRequest(request)) { json(response, 403, { error: 'Dashboard access required.' }, origin); return true }
    const siteId = url.searchParams.get('siteId')
    if (!store.sites[siteId]) { json(response, 404, { error: 'Site not found' }, origin); return true }
    response.writeHead(200, { 'content-type': 'text/event-stream', 'cache-control': 'no-cache', connection: 'keep-alive', 'access-control-allow-origin': origin })
    response.write(': connected\n\n')
    const client = { siteId, response }
    clients.add(client)
    response.on('close', () => clients.delete(client))
    return true
  }

  return false
}

async function serveStatic(request, response, url) {
  let filePath
  if (url.pathname === '/widget.js') filePath = path.join(root, 'public', 'widget.js')
  else {
    const builtPath = path.join(root, 'dist', decodeURIComponent(url.pathname).replace(/^\/+/, ''))
    try { if ((await fs.stat(builtPath)).isFile()) filePath = builtPath } catch { /* SPA route fallback below. */ }
    if (!filePath) filePath = path.join(root, 'dist', 'index.html')
  }
  try {
    const contents = await fs.readFile(filePath)
    const ext = path.extname(filePath)
    const contentType = ext === '.js' ? 'text/javascript; charset=utf-8' : ext === '.css' ? 'text/css; charset=utf-8' : ext === '.svg' ? 'image/svg+xml' : 'text/html; charset=utf-8'
    response.writeHead(200, { 'content-type': contentType, 'access-control-allow-origin': '*' })
    response.end(contents)
  } catch {
    response.writeHead(404, { 'content-type': 'text/plain' }); response.end('Build the app with npm run build first.')
  }
}

await loadStore()
http.createServer(async (request, response) => {
  const url = new URL(request.url, `http://${request.headers.host || 'localhost'}`)
  try {
    if (url.pathname.startsWith('/api/')) {
      if (!await api(request, response, url)) json(response, 404, { error: 'Not found' })
      return
    }
    await serveStatic(request, response, url)
  } catch (error) {
    console.error(error)
    if (!response.headersSent) json(response, 500, { error: 'The chat server encountered an error.' })
    else response.end()
  }
}).listen(port, '0.0.0.0', () => console.log(`Orbit chat server listening on http://localhost:${port}`))

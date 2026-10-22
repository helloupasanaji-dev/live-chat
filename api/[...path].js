import { createHash, randomBytes, randomUUID } from 'node:crypto'
import { Redis } from '@upstash/redis'

const json = (body, status = 200, origin = '*') => new Response(JSON.stringify(body), {
  status,
  headers: {
    'content-type': 'application/json; charset=utf-8',
    'access-control-allow-origin': origin,
    'access-control-allow-methods': 'GET,POST,PUT,OPTIONS',
    'access-control-allow-headers': 'content-type',
    'vary': 'Origin',
  },
})

const hash = token => createHash('sha256').update(token).digest('hex')
const hostFrom = value => { try { return new URL(value).hostname.toLowerCase() } catch { return '' } }
const originFrom = request => request.headers.get('origin') || ''

function isDashboardRequest(request) {
  const origin = originFrom(request)
  if (!origin) return false
  if (process.env.APP_ORIGIN) return origin === process.env.APP_ORIGIN
  const originHost = hostFrom(origin)
  const requestHost = (request.headers.get('x-forwarded-host') || request.headers.get('host') || '').split(':')[0].toLowerCase()
  return originHost === requestHost
}

function allowedSiteOrigin(request, site) {
  const host = hostFrom(originFrom(request))
  // Visitor access is open to any website. The public site ID still identifies
  // the workspace, and visitor tokens protect access to each conversation.
  return Boolean(host)
}

async function body(request) {
  try { return await request.json() } catch { return null }
}

function publicConversation(conversation) {
  const { visitorTokenHash, ...publicData } = conversation
  return publicData
}

async function getSite(redis, siteId) { return await redis.get(`orbit:site:${siteId}`) }
async function getConversation(redis, conversationId) { return await redis.get(`orbit:conversation:${conversationId}`) }
async function saveConversation(redis, conversation) { await redis.set(`orbit:conversation:${conversation.id}`, conversation) }

async function handleRequest(request) {
  const origin = originFrom(request) || '*'
  if (request.method === 'OPTIONS') return new Response(null, { status: 204, headers: { 'access-control-allow-origin': origin, 'access-control-allow-methods': 'GET,POST,PUT,OPTIONS', 'access-control-allow-headers': 'content-type', 'vary': 'Origin' } })

  if (!process.env.UPSTASH_REDIS_REST_URL || !process.env.UPSTASH_REDIS_REST_TOKEN) {
    return json({ error: 'Chat storage is not configured. Connect Upstash Redis to this Vercel project.' }, 503, origin)
  }

  const redis = Redis.fromEnv()
  const url = new URL(request.url)
  const parts = url.pathname.split('/').filter(Boolean)
  const now = () => new Date().toISOString()

  try {
    if (parts[1] === 'sites' && parts.length === 2 && request.method === 'POST') {
      if (!isDashboardRequest(request)) return json({ error: 'Dashboard access required.' }, 403, origin)
      const data = await body(request)
      if (!data || typeof data.id !== 'string' || !/^[a-zA-Z0-9-]{4,80}$/.test(data.id)) return json({ error: 'Invalid site id.' }, 400, origin)
      let site = await getSite(redis, data.id)
      if (!site) {
        site = { id: data.id, domains: [], createdAt: now() }
        await redis.set(`orbit:site:${data.id}`, site)
      }
      return json(site, 200, origin)
    }

    if (parts[1] === 'sites' && parts.length === 3) {
      if (!isDashboardRequest(request)) return json({ error: 'Dashboard access required.' }, 403, origin)
      const siteId = parts[2]
      if (request.method === 'GET') {
        const site = await getSite(redis, siteId)
        return site ? json(site, 200, origin) : json({ error: 'Site not found.' }, 404, origin)
      }
      if (request.method === 'PUT') {
        const site = await getSite(redis, siteId)
        if (!site) return json({ error: 'Site not found.' }, 404, origin)
        const data = await body(request)
        if (!data || !Array.isArray(data.domains)) return json({ error: 'Domains must be an array.' }, 400, origin)
        site.domains = [...new Set(data.domains.map(value => String(value).trim().toLowerCase()).filter(Boolean))]
        await redis.set(`orbit:site:${siteId}`, site)
        return json(site, 200, origin)
      }
    }

    if (url.pathname === '/api/conversations' && request.method === 'GET') {
      if (!isDashboardRequest(request)) return json({ error: 'Dashboard access required.' }, 403, origin)
      const siteId = url.searchParams.get('siteId') || ''
      if (!await getSite(redis, siteId)) return json({ error: 'Site not found.' }, 404, origin)
      const ids = await redis.lrange(`orbit:site:${siteId}:conversations`, 0, -1)
      const conversations = await Promise.all(ids.map(id => getConversation(redis, id)))
      return json(conversations.filter(Boolean).sort((a, b) => b.updatedAt.localeCompare(a.updatedAt)).map(publicConversation), 200, origin)
    }

    if (url.pathname === '/api/conversations' && request.method === 'POST') {
      const data = await body(request)
      const siteId = String(data?.siteId || '')
      const site = await getSite(redis, siteId)
      if (!site || !allowedSiteOrigin(request, site)) return json({ error: 'This website domain is not enabled for this chat.' }, 403, origin)
      const text = String(data?.message || '').trim().slice(0, 4000)
      if (!text) return json({ error: 'A message is required.' }, 400, origin)
      const visitorToken = randomBytes(24).toString('hex')
      const conversation = { id: randomUUID(), siteId, name: String(data?.name || 'Website visitor').slice(0, 100), email: '', domain: hostFrom(origin), status: 'open', updatedAt: now(), visitorTokenHash: hash(visitorToken), messages: [{ id: randomUUID(), from: 'visitor', text, createdAt: now() }] }
      await saveConversation(redis, conversation)
      await redis.lpush(`orbit:site:${siteId}:conversations`, conversation.id)
      return json({ ...publicConversation(conversation), visitorToken }, 201, origin)
    }

    if (parts[1] === 'conversations' && parts[2] && parts[3] === 'visitor-messages' && request.method === 'POST') {
      const conversation = await getConversation(redis, parts[2])
      if (!conversation) return json({ error: 'Conversation not found.' }, 404, origin)
      const site = await getSite(redis, conversation.siteId)
      if (!site || !allowedSiteOrigin(request, site)) return json({ error: 'This website domain is not enabled.' }, 403, origin)
      const data = await body(request)
      if (hash(String(data?.token || '')) !== conversation.visitorTokenHash) return json({ error: 'Visitor access denied.' }, 403, origin)
      const text = String(data?.text || '').trim().slice(0, 4000)
      if (!text) return json({ error: 'A message is required.' }, 400, origin)
      const message = { id: randomUUID(), from: 'visitor', text, createdAt: now() }
      conversation.messages.push(message)
      conversation.updatedAt = message.createdAt
      await saveConversation(redis, conversation)
      return json(message, 201, origin)
    }

    if (parts[1] === 'conversations' && parts[2] && parts.length === 3 && request.method === 'GET') {
      const conversation = await getConversation(redis, parts[2])
      if (!conversation) return json({ error: 'Conversation not found.' }, 404, origin)
      if (!isDashboardRequest(request)) {
        const site = await getSite(redis, conversation.siteId)
        const token = url.searchParams.get('token') || ''
        if (!site || !allowedSiteOrigin(request, site) || hash(token) !== conversation.visitorTokenHash) return json({ error: 'Visitor access denied.' }, 403, origin)
      }
      return json(publicConversation(conversation), 200, origin)
    }

    if (parts[1] === 'conversations' && parts[2] && parts.length === 3 && request.method === 'POST') {
      if (!isDashboardRequest(request)) return json({ error: 'Dashboard access required.' }, 403, origin)
      const conversation = await getConversation(redis, parts[2])
      if (!conversation) return json({ error: 'Conversation not found.' }, 404, origin)
      const data = await body(request)
      const text = String(data?.text || '').trim().slice(0, 4000)
      if (!text) return json({ error: 'A message is required.' }, 400, origin)
      const message = { id: randomUUID(), from: 'agent', text, createdAt: now() }
      conversation.messages.push(message)
      conversation.updatedAt = message.createdAt
      await saveConversation(redis, conversation)
      return json(message, 201, origin)
    }

    return json({ error: 'Not found.' }, 404, origin)
  } catch (error) {
    console.error('[orbit-api]', error)
    return json({ error: 'Chat API request failed.' }, 500, origin)
  }
}

export default { fetch: handleRequest }

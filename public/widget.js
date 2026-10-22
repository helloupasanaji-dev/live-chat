(() => {
  const currentScript = document.currentScript
  if (!currentScript || document.getElementById('orbit-chat-root')) return
  const siteId = currentScript.dataset.siteId
  const apiBase = new URL(currentScript.src).origin
  if (!siteId) { console.error('[Orbit chat] Missing data-site-id in the widget snippet.'); return }

  const root = document.createElement('div')
  root.id = 'orbit-chat-root'
  root.style.cssText = 'all:initial;position:fixed;z-index:2147483000;right:24px;bottom:24px;font-family:Inter,ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;color:#252538;'
  const shadow = root.attachShadow({ mode: 'open' })
  shadow.innerHTML = `
    <style>
      *{box-sizing:border-box}button,input{font:inherit}.launcher{width:58px;height:58px;border:0;border-radius:50%;background:#655ddd;color:white;box-shadow:0 7px 24px #28234b35;display:grid;place-items:center;cursor:pointer;transition:transform .2s,box-shadow .2s}.launcher:hover{transform:translateY(-2px);box-shadow:0 10px 28px #28234b4a}.launcher svg{width:25px;height:25px}.panel{position:absolute;right:0;bottom:72px;width:min(360px,calc(100vw - 32px));height:490px;max-height:calc(100vh - 110px);background:white;border:1px solid #eeeef3;border-radius:16px;box-shadow:0 16px 55px #24233b30;overflow:hidden;display:none;flex-direction:column;animation:rise .2s ease}.panel.open{display:flex}@keyframes rise{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}}.head{background:#655ddd;color:white;padding:20px 19px 18px}.head-row{display:flex;align-items:center;justify-content:space-between}.brand{font-size:11px;opacity:.8;letter-spacing:.3px}.close{color:white;background:transparent;border:0;width:30px;height:30px;border-radius:7px;cursor:pointer;font-size:23px;line-height:1}.close:hover{background:#ffffff22}.title{font-size:20px;font-weight:700;margin:11px 0 5px;letter-spacing:-.4px}.subtitle{font-size:12px;opacity:.82}.agent{display:flex;align-items:center;gap:9px;margin-top:17px;font-size:11px}.agent-avatar{width:29px;height:29px;border-radius:50%;background:#eeeaff;color:#6159ce;display:grid;place-items:center;font-weight:700}.online{width:7px;height:7px;background:#48d49a;border-radius:50%;display:inline-block;margin-right:5px}.messages{padding:17px 14px;flex:1;overflow:auto;display:flex;flex-direction:column;gap:11px}.hello{font-size:11px;color:#8b8b99;line-height:1.6;margin:0 4px 4px}.bubble{max-width:84%;padding:10px 12px;border-radius:4px 13px 13px;background:#f3f4f8;color:#41414f;font-size:12px;line-height:1.55;overflow-wrap:anywhere}.bubble.mine{align-self:flex-end;background:#f0efff;border-radius:13px 4px 13px 13px}.time{font-size:9px;color:#a2a3ae;margin:4px 2px 0}.row.mine{align-self:flex-end}.compose{border-top:1px solid #eeeef3;padding:10px 11px;display:flex;gap:8px;align-items:center}.compose input{border:0;outline:0;flex:1;min-width:0;font-size:12px;color:#333;background:transparent}.compose input::placeholder{color:#a1a2ad}.send{border:0;border-radius:8px;background:#655ddd;color:#fff;width:34px;height:34px;display:grid;place-items:center;cursor:pointer}.send:hover{background:#554cca}.foot{text-align:center;font-size:9px;color:#aaa9b5;padding:0 0 9px}.foot b{color:#777585;font-weight:600}.error{font-size:10px;color:#be5b61;text-align:center;padding:5px 10px;min-height:20px}@media(max-width:480px){:host{right:16px!important;bottom:16px!important}.panel{height:min(490px,calc(100vh - 95px))}
    </style>
    <section class="panel" aria-label="Chat with our team">
      <header class="head"><div class="head-row"><span class="brand">ACME STUDIO</span><button class="close" aria-label="Close chat">×</button></div><div class="title">Hey there 👋</div><div class="subtitle">We’re here to help. Ask us anything!</div><div class="agent"><span class="agent-avatar">A</span><span><span class="online"></span>Our team is online</span></div></header>
      <div class="messages"><p class="hello">Welcome! Send us a message and we’ll get back to you shortly.</p></div><div class="error" role="status"></div>
      <form class="compose"><input aria-label="Your message" placeholder="Write a message…" autocomplete="off" required /><button class="send" aria-label="Send message"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m22 2-7 20-4-9-9-4Z"/><path d="M22 2 11 13"/></svg></button></form>
      <div class="foot">Powered by <b>Orbit</b></div>
    </section>
    <button class="launcher" aria-label="Open live chat"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M21 11.5a8.4 8.4 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.4 8.4 0 0 1-3.8-.9L3 21l1.9-5.7a8.4 8.4 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.4 8.4 0 0 1 3.8-.9h.5a8.5 8.5 0 0 1 8 8z"/></svg></button>`
  document.body.append(root)

  const panel = shadow.querySelector('.panel')
  const messages = shadow.querySelector('.messages')
  const launcher = shadow.querySelector('.launcher')
  const storageKey = `orbit-widget-${siteId}-${location.hostname}`
  let conversation = null
  let stored = null
  try { stored = JSON.parse(localStorage.getItem(storageKey) || 'null') } catch { stored = null }

  function escapeHtml(text) { return String(text).replace(/[&<>"']/g, character => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[character]) }
  function renderMessages() {
    const items = conversation?.messages || []
    messages.innerHTML = '<p class="hello">Welcome! Send us a message and we’ll get back to you shortly.</p>' + items.map(message => {
      const mine = message.from === 'visitor'
      const time = new Date(message.createdAt).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })
      return `<div class="row ${mine ? 'mine' : ''}"><div class="bubble ${mine ? 'mine' : ''}">${escapeHtml(message.text)}<div class="time">${escapeHtml(time)}</div></div></div>`
    }).join('')
    messages.scrollTop = messages.scrollHeight
  }
  async function syncConversation() {
    if (!stored?.id || !stored?.token) return
    try {
      const response = await fetch(`${apiBase}/api/conversations/${encodeURIComponent(stored.id)}?token=${encodeURIComponent(stored.token)}`)
      if (!response.ok) { stored = null; localStorage.removeItem(storageKey); return }
      conversation = await response.json()
      renderMessages()
    } catch { /* Retain the last messages while offline. */ }
  }
  async function toggle(open) {
    panel.classList.toggle('open', open)
    launcher.style.display = open ? 'none' : 'grid'
    if (open) { shadow.querySelector('input').focus(); await syncConversation() }
  }
  launcher.addEventListener('click', () => toggle(true))
  shadow.querySelector('.close').addEventListener('click', () => toggle(false))
  shadow.querySelector('.compose').addEventListener('submit', async event => {
    event.preventDefault()
    const input = shadow.querySelector('input')
    const text = input.value.trim()
    const status = shadow.querySelector('.error')
    if (!text) return
    status.textContent = ''
    try {
      let response
      if (stored?.id && stored?.token) {
        response = await fetch(`${apiBase}/api/conversations/${encodeURIComponent(stored.id)}/visitor-messages`, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ token: stored.token, text }) })
      } else {
        response = await fetch(`${apiBase}/api/conversations`, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ siteId, message: text }) })
      }
      const result = await response.json()
      if (!response.ok) throw new Error(result.error || 'Could not send your message.')
      if (!stored) {
        stored = { id: result.id, token: result.visitorToken }
        localStorage.setItem(storageKey, JSON.stringify(stored))
      }
      input.value = ''
      await syncConversation()
    } catch (error) { status.textContent = error.message || 'Chat is temporarily unavailable.' }
  })
  renderMessages()
  if (stored?.id) syncConversation()
  setInterval(() => { if (panel.classList.contains('open')) syncConversation() }, 3000)
})()

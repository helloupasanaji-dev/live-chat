import './style.css'

const icon = (name, size = 18) => {
  const paths = {
    grid: '<rect x="3" y="3" width="7" height="7" rx="2"/><rect x="14" y="3" width="7" height="7" rx="2"/><rect x="3" y="14" width="7" height="7" rx="2"/><rect x="14" y="14" width="7" height="7" rx="2"/>',
    inbox: '<rect x="3" y="4" width="18" height="16" rx="3"/><path d="M3 13h5l2 3h4l2-3h5"/>',
    users: '<path d="M16 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="10" cy="7" r="4"/><path d="M20 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/>',
    chart: '<path d="M3 3v18h18"/><path d="m19 9-5 5-4-4-5 5"/>',
    bot: '<rect x="3" y="7" width="18" height="14" rx="4"/><path d="M12 3v4M8 13h.01M16 13h.01M9 17h6"/>',
    settings: '<circle cx="12" cy="12" r="3"/><path d="m19.4 15 .1.1 1.4 1.1-1.4 2.4-1.7-.6a8 8 0 0 1-1.6.9l-.3 1.8h-2.8l-.3-1.8a8 8 0 0 1-1.6-.9l-1.7.6-1.4-2.4L7.5 15a8 8 0 0 1 0-1.9L6.1 12l1.4-2.4 1.7.6a8 8 0 0 1 1.6-.9l.3-1.8h2.8l.3 1.8a8 8 0 0 1 1.6.9l1.7-.6 1.4 2.4-1.4 1.1a8 8 0 0 1-.1 1.9Z"/>',
    search: '<circle cx="11" cy="11" r="7"/><path d="m20 20-4-4"/>',
    plus: '<path d="M12 5v14M5 12h14"/>',
    more: '<circle cx="5" cy="12" r="1"/><circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/>',
    smile: '<circle cx="12" cy="12" r="10"/><path d="M8 14s1.5 2 4 2 4-2 4-2M9 9h.01M15 9h.01"/>',
    paperclip: '<path d="m21.4 11.1-8.5 8.5a6 6 0 0 1-8.5-8.5l9.2-9.2a4 4 0 0 1 5.7 5.7l-9.2 9.2a2 2 0 0 1-2.8-2.8l8.5-8.5"/>',
    send: '<path d="m22 2-7 20-4-9-9-4Z"/><path d="M22 2 11 13"/>',
    chevron: '<path d="m9 18 6-6-6-6"/>',
    check: '<path d="m5 12 4 4L19 6"/>',
    clock: '<circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/>',
    tag: '<path d="M20.6 13.4 13.4 20.6a2 2 0 0 1-2.8 0L3 13V3h10l7.6 7.6a2 2 0 0 1 0 2.8Z"/><circle cx="7.5" cy="7.5" r=".5"/>',
    link: '<path d="M10 13a5 5 0 0 0 7.1 0l3-3A5 5 0 0 0 13 2.9l-1.7 1.7"/><path d="M14 11a5 5 0 0 0-7.1 0l-3 3A5 5 0 0 0 11 21.1l1.7-1.7"/>',
    arrow: '<path d="M7 17 17 7M7 7h10v10"/>',
    close: '<path d="m18 6-12 12M6 6l12 12"/>',
    menu: '<path d="M4 6h16M4 12h16M4 18h16"/>',
  }
  return `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${paths[name] || ''}</svg>`
}

const conversations = [
  { id: 1, name: 'Sophie Chen', initials: 'SC', color: 'peach', preview: 'That fixed it, thank you so much!', time: '2m', unread: 0, online: true, email: 'sophie.chen@gmail.com', location: 'San Francisco, US', plan: 'Pro plan', source: 'Website chat', topic: 'Billing question', messages: [
    { from: 'them', text: 'Hi! I upgraded to the Pro plan this morning but my account is still showing the Free plan. Could you check what’s going on?', time: '10:42 AM' },
    { from: 'me', text: 'Hey Sophie! Let me take a look at your account. What email did you use when upgrading?', time: '10:44 AM' },
    { from: 'them', text: 'That would be this one — sophie.chen@gmail.com', time: '10:45 AM' },
    { from: 'me', text: 'Found it! Your payment went through, but it looks like the plan change got stuck. I’ve refreshed your account — could you try reloading?', time: '10:47 AM' },
    { from: 'them', text: 'That fixed it, thank you so much!', time: '10:49 AM' },
  ] },
  { id: 2, name: 'Marcus Johnson', initials: 'MJ', color: 'blue', preview: 'Do you ship to Canada?', time: '8m', unread: 2, online: true, email: 'marcus.j@email.com', location: 'Toronto, Canada', plan: 'Free plan', source: 'Website chat', topic: 'Shipping', messages: [{ from: 'them', text: 'Hey there, I was wondering if you ship to Canada?', time: '10:43 AM' }, { from: 'them', text: 'And if so, how long does delivery usually take?', time: '10:44 AM' }] },
  { id: 3, name: 'Olivia Martinez', initials: 'OM', color: 'lilac', preview: 'Perfect, I’ll give that a try.', time: '16m', unread: 0, online: false, email: 'olivia.m@email.com', location: 'Austin, US', plan: 'Pro plan', source: 'Website chat', topic: 'Getting started', messages: [{ from: 'them', text: 'I can’t seem to connect my Instagram account.', time: '10:32 AM' }, { from: 'me', text: 'Try reconnecting it from Settings → Integrations. That usually clears it up!', time: '10:35 AM' }, { from: 'them', text: 'Perfect, I’ll give that a try.', time: '10:36 AM' }] },
  { id: 4, name: 'Ethan Brooks', initials: 'EB', color: 'mint', preview: 'Thanks for the quick reply!', time: '31m', unread: 0, online: false, email: 'ethan.b@email.com', location: 'London, UK', plan: 'Pro plan', source: 'Website chat', topic: 'Product question', messages: [{ from: 'them', text: 'Do you have this available in forest green?', time: '10:17 AM' }, { from: 'me', text: 'We do! It’s available in all sizes right now.', time: '10:20 AM' }, { from: 'them', text: 'Thanks for the quick reply!', time: '10:21 AM' }] },
  { id: 5, name: 'Ava Patel', initials: 'AP', color: 'yellow', preview: 'I’ll send that over today.', time: '1h', unread: 0, online: false, email: 'ava.patel@email.com', location: 'New York, US', plan: 'Free plan', source: 'Website chat', topic: 'Partnership', messages: [{ from: 'them', text: 'Hi, who should I contact about a potential partnership?', time: '9:12 AM' }] },
  { id: 6, name: 'Noah Williams', initials: 'NW', color: 'rose', preview: 'Got it, appreciate it!', time: '2h', unread: 0, online: false, email: 'noah.w@email.com', location: 'Chicago, US', plan: 'Pro plan', source: 'Website chat', topic: 'Account access', messages: [{ from: 'them', text: 'I’m locked out of my account.', time: '8:04 AM' }] },
]

const state = { selectedId: '1', filter: 'all', search: '', resolved: false, mobilePanel: 'inbox', installOpen: false, domains: JSON.parse(localStorage.getItem('orbit-domains') || '[]'), siteId: localStorage.getItem('orbit-site-id') || crypto.randomUUID().slice(0, 8), liveConversations: [] }
localStorage.setItem('orbit-site-id', state.siteId)
const app = document.querySelector('#app')

function avatar(c, size = '') { return `<div class="avatar ${c.color} ${size}">${c.initials}${c.online ? '<span class="online-dot"></span>' : ''}</div>` }

function mapLiveConversation(conversation) {
  const messages = conversation.messages.map(message => ({ from: message.from === 'agent' ? 'me' : 'them', text: message.text, time: new Date(message.createdAt).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' }) }))
  const last = messages[messages.length - 1]
  const name = conversation.name || 'Website visitor'
  return { id: conversation.id, name, initials: name.split(/\s+/).map(part => part[0]).join('').slice(0, 2).toUpperCase() || 'WV', color: 'blue', preview: last?.text || 'New conversation', time: conversation.updatedAt ? new Date(conversation.updatedAt).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' }) : 'now', unread: 0, online: false, email: conversation.email || 'Website visitor', location: conversation.domain || 'Website', plan: 'Website visitor', source: 'Website chat', topic: 'New chat', messages }
}

async function refreshLiveConversations() {
  try {
    const response = await fetch(`/api/conversations?siteId=${encodeURIComponent(state.siteId)}`)
    if (!response.ok) return
    state.liveConversations = (await response.json()).map(mapLiveConversation)
    if (!conversations.some(item => String(item.id) === String(state.selectedId)) && !state.liveConversations.some(item => String(item.id) === String(state.selectedId))) state.selectedId = String(state.liveConversations[0]?.id || conversations[0].id)
    render()
  } catch { /* Keep the sample inbox available while the API is offline. */ }
}

async function initializeBackend() {
  try {
    const created = await fetch('/api/sites', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ id: state.siteId }) })
    if (!created.ok) return
    const site = await created.json()
    if (!site.domains?.length && state.domains.length) {
      const saved = await fetch(`/api/sites/${encodeURIComponent(state.siteId)}`, { method: 'PUT', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ domains: state.domains }) })
      if (saved.ok) state.domains = (await saved.json()).domains
    } else state.domains = site.domains || []
    localStorage.setItem('orbit-domains', JSON.stringify(state.domains))
    await refreshLiveConversations()
    const events = new EventSource(`/api/events?siteId=${encodeURIComponent(state.siteId)}`)
    events.onmessage = () => refreshLiveConversations()
  } catch { /* Keep the sample inbox available while the API is offline. */ }
}

function render() {
  const allConversations = [...state.liveConversations, ...conversations]
  const selected = allConversations.find(c => String(c.id) === String(state.selectedId)) || conversations[0]
  const filtered = allConversations.filter(c => {
    const matchesSearch = `${c.name} ${c.preview}`.toLowerCase().includes(state.search.toLowerCase())
    const matchesFilter = state.filter === 'all' || (state.filter === 'unread' && c.unread > 0) || (state.filter === 'mine' && [1, 3, 4].includes(c.id))
    return matchesSearch && matchesFilter
  })
  app.innerHTML = `
    <aside class="rail">
      <a class="brand" href="#" aria-label="Orbit home"><span class="brand-mark">${icon('inbox', 21)}</span></a>
      <div class="rail-menu">
        <button class="rail-item" title="Overview">${icon('grid')}<span>Overview</span></button>
        <button class="rail-item active" title="Inbox">${icon('inbox')}<span>Inbox</span><i class="rail-count">4</i></button>
        <button class="rail-item" title="Contacts">${icon('users')}<span>Contacts</span></button>
        <button class="rail-item" title="Analytics">${icon('chart')}<span>Analytics</span></button>
        <button class="rail-item" title="Automations">${icon('bot')}<span>Automations</span></button>
      </div>
      <div class="rail-bottom"><button class="rail-item" id="open-install" title="Website widget">${icon('settings')}<span>Website widget</span></button><button class="profile-avatar" title="Your profile">JD<span class="profile-status"></span></button></div>
    </aside>
    <main class="workspace ${state.mobilePanel === 'conversation' ? 'show-conversation' : ''}">
      <section class="inbox-panel">
        <header class="inbox-header"><div><div class="eyebrow">WORKSPACE</div><button class="workspace-switch">Acme Studio <span class="switch-chevron">⌄</span></button></div><button class="icon-button" title="More options">${icon('more')}</button></header>
        <div class="inbox-title-row"><div><h1>Inbox <span class="total-count">12</span></h1><p>Your conversations, all in one place.</p></div><button class="new-chat" title="Start a conversation">${icon('plus', 16)}<span>New</span></button></div>
        <div class="inbox-search">${icon('search', 17)}<input id="search" placeholder="Search conversations" value="${state.search}" /><kbd>⌘ K</kbd></div>
        <div class="filter-tabs"><button data-filter="all" class="${state.filter === 'all' ? 'selected' : ''}">All <span>12</span></button><button data-filter="mine" class="${state.filter === 'mine' ? 'selected' : ''}">Assigned to me <span>5</span></button><button data-filter="unread" class="${state.filter === 'unread' ? 'selected' : ''}">Unread <span>3</span></button></div>
        <div class="conversation-list">${filtered.length ? filtered.map(c => `<button class="conversation ${String(c.id) === String(state.selectedId) ? 'selected' : ''}" data-id="${c.id}">${avatar(c)}<span class="conversation-main"><span class="conversation-name">${escapeHtml(c.name)}</span><span class="conversation-preview">${escapeHtml(c.preview)}</span></span><span class="conversation-meta"><span>${c.time}</span>${c.unread ? `<i class="unread-dot"></i>` : ''}</span></button>`).join('') : '<div class="empty-state">No conversations found.</div>'}</div>
        <div class="inbox-footer"><span class="live-indicator"></span> You’re online <button class="footer-caret">⌄</button><span class="footer-spacer"></span><span>Avg. response</span><b>2m 14s</b></div>
      </section>
      <section class="chat-panel">
        <header class="chat-header"><button class="mobile-back" id="back">${icon('chevron', 18)}</button><div class="chat-person">${avatar(selected)}<div><div class="chat-name">${selected.name}<span class="verified">✓</span></div><div class="chat-subtitle">${selected.online ? '<span class="online-text">Online</span> · ' : ''}Visitor · ${selected.location}</div></div></div><div class="chat-actions"><button class="assign-button">${avatar({ initials: 'JD', color: 'self' }, 'tiny')}<span>Assign to me</span><span class="assign-arrow">⌄</span></button><span class="header-divider"></span><button class="icon-button" title="Snooze">${icon('clock')}</button><button class="icon-button" title="More options">${icon('more')}</button><button class="resolve-button" id="resolve">${state.resolved ? icon('check', 15) : icon('check', 15)}<span>${state.resolved ? 'Resolved' : 'Resolve'}</span></button></div></header>
        <div class="thread-label"><span>${selected.topic}</span><span class="label-line"></span><span class="thread-date">Today, October 22</span></div>
        <div class="messages" id="messages">${selected.messages.map(m => `<div class="message-row ${m.from === 'me' ? 'mine' : ''}">${m.from === 'them' ? avatar(selected, 'message-avatar') : ''}<div class="message-content"><div class="bubble ${m.from === 'me' ? 'outgoing' : ''}">${escapeHtml(m.text)}</div><div class="message-time">${m.from === 'me' ? 'You' : selected.name.split(' ')[0]} · ${m.time} ${m.from === 'me' ? '<span class="read-check">✓✓</span>' : ''}</div></div></div>`).join('')}</div>
        <div class="reply-suggestion"><span class="sparkle">✳</span><span>Suggested reply:</span><button class="suggestion-text" id="suggestion">“You’re very welcome! Let me know if there’s anything else I can help with.”</button><button class="suggestion-add" id="add-suggestion">Add</button><button class="suggestion-close" title="Dismiss">${icon('close', 14)}</button></div>
        <form class="composer" id="composer"><div class="composer-top"><textarea id="message-input" rows="1" placeholder="Write a reply…" aria-label="Write a reply"></textarea><div class="composer-shortcut"><span>Replying to ${selected.name.split(' ')[0]}</span><span>↵ to send</span></div></div><div class="composer-tools"><div class="tool-group"><button type="button" class="icon-button tool" title="Attach a file">${icon('paperclip', 18)}</button><button type="button" class="icon-button tool" title="Emoji">${icon('smile', 18)}</button><button type="button" class="tool text-tool">GIF</button><span class="tool-divider"></span><button type="button" class="tool text-tool">Aa</button><button type="button" class="icon-button tool" title="Insert link">${icon('link', 17)}</button></div><button class="send-button" type="submit">Send ${icon('send', 14)}</button></div></form>
      </section>
      <aside class="details-panel"><div class="details-heading"><span>Contact details</span><button class="icon-button" title="More details">${icon('more', 17)}</button></div><div class="contact-profile">${avatar(selected, 'large')}<h2>${escapeHtml(selected.name)}</h2><span class="contact-email">${escapeHtml(selected.email)}</span><button class="view-profile">View profile ${icon('arrow', 13)}</button></div><div class="detail-divider"></div><div class="detail-section"><div class="detail-section-title">ABOUT <button class="tiny-plus" title="Add detail">${icon('plus', 14)}</button></div><div class="detail-row"><span>${icon('link', 15)} Source</span><b>${escapeHtml(selected.source)}</b></div><div class="detail-row"><span>${icon('tag', 15)} Plan</span><b class="plan-badge">${escapeHtml(selected.plan)}</b></div><div class="detail-row"><span>${icon('users', 15)} Location</span><b>${escapeHtml(selected.location.split(',')[0])}</b></div></div><div class="detail-divider"></div><div class="detail-section"><div class="detail-section-title">CONVERSATION TAGS <button class="tiny-plus" title="Add tag">${icon('plus', 14)}</button></div><div class="tag-list"><span class="tag-item purple-tag">${escapeHtml(selected.topic)}</span><span class="tag-item green-tag">Returning customer</span></div></div><div class="detail-divider"></div><div class="detail-section recent-section"><div class="detail-section-title">RECENT CONVERSATIONS <button class="view-all">View all</button></div><div class="recent-item"><span class="recent-icon">${icon('inbox', 14)}</span><span><b>${escapeHtml(selected.topic)}</b><small>Oct 18 · Resolved</small></span>${icon('chevron', 14)}</div><div class="recent-item"><span class="recent-icon">${icon('inbox', 14)}</span><span><b>General question</b><small>Sep 29 · Resolved</small></span>${icon('chevron', 14)}</div></div><div class="profile-note"><div class="note-icon">✳</div><div><b>Know your customer</b><p>See more context and deliver a personal touch.</p><button>Explore customer profiles ${icon('arrow', 12)}</button></div></div></aside>
    </main>
    ${state.installOpen ? installDialog() : ''}`
  bindEvents()
  const messageBox = document.querySelector('#messages')
  messageBox.scrollTop = messageBox.scrollHeight
}

function installDialog() {
  const scriptUrl = `${location.origin}/widget.js`
  const closeScriptTag = '<' + '/script>'
  const embed = `<script src="${scriptUrl}" data-site-id="${state.siteId}" async>${closeScriptTag}`
  return `<div class="install-overlay" id="install-overlay"><section class="install-dialog" role="dialog" aria-modal="true" aria-labelledby="install-title"><header class="install-header"><div><div class="eyebrow">WEBSITE WIDGET</div><h2 id="install-title">Add live chat to your website</h2><p>Connect a domain, then paste one line of code into your site.</p></div><button class="icon-button" id="close-install" aria-label="Close">${icon('close')}</button></header><div class="install-content"><div class="install-step"><span class="step-number">1</span><div class="step-body"><h3>Allow your website domain</h3><p>Only the domains listed here can show this chat widget.</p><form id="domain-form" class="domain-form"><span class="domain-prefix">https://</span><input id="domain-input" placeholder="yourwebsite.com" aria-label="Website domain" required /><button type="submit">Add domain</button></form><div class="domain-list">${state.domains.length ? state.domains.map((domain, index) => `<div class="domain-entry"><span class="domain-check">✓</span><span>${escapeHtml(domain)}</span><span class="domain-enabled">Allowed</span><button type="button" class="remove-domain" data-remove-domain="${index}" aria-label="Remove ${escapeHtml(domain)}">${icon('close', 14)}</button></div>`).join('') : '<div class="domain-empty">No domains yet. Add one to enable installation.</div>'}</div></div></div><div class="install-step"><span class="step-number">2</span><div class="step-body"><h3>Install your chat widget</h3><p>Paste this snippet before the closing <code>&lt;/body&gt;</code> tag on your website.</p><div class="snippet-box"><code>${escapeHtml(embed)}</code><button id="copy-embed" class="copy-embed">${icon('link', 14)} Copy code</button></div><div class="install-note"><span>✳</span><span>The widget will appear on <b>${state.domains.length ? state.domains.map(escapeHtml).join(', ') : 'your allowed domains'}</b> after you publish your website.</span></div></div></div></div><footer class="install-footer"><span>Site ID <code>${state.siteId}</code> · Domains are saved on the chat server</span><button class="done-button" id="done-install">Done</button></footer></section></div>`
}

function escapeHtml(text) { return text.replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]) }

function bindEvents() {
  document.querySelector('#search').addEventListener('input', e => { state.search = e.target.value; const pos = e.target.selectionStart; render(); const input = document.querySelector('#search'); input.focus(); input.setSelectionRange(pos, pos) })
  document.querySelectorAll('[data-filter]').forEach(button => button.addEventListener('click', () => { state.filter = button.dataset.filter; render() }))
  document.querySelectorAll('[data-id]').forEach(button => button.addEventListener('click', () => { state.selectedId = button.dataset.id; state.resolved = false; state.mobilePanel = 'conversation'; render() }))
  document.querySelector('#back').addEventListener('click', () => { state.mobilePanel = 'inbox'; render() })
  document.querySelector('#resolve').addEventListener('click', () => { state.resolved = !state.resolved; render() })
  document.querySelector('#composer').addEventListener('submit', async e => {
    e.preventDefault()
    const input = document.querySelector('#message-input')
    const text = input.value.trim()
    if (!text) return
    const now = new Date()
    const time = now.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })
    const convo = [...state.liveConversations, ...conversations].find(c => String(c.id) === String(state.selectedId))
    if (state.liveConversations.some(c => String(c.id) === String(state.selectedId))) {
      const response = await fetch(`/api/conversations/${encodeURIComponent(state.selectedId)}`, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ text }) })
      if (!response.ok) { showToast('Could not send reply. Check that the chat server is running.'); return }
      await refreshLiveConversations()
    } else {
      convo.messages.push({ from: 'me', text, time })
      convo.preview = text
      render()
    }
    state.resolved = false
    document.querySelector('#message-input')?.focus()
  })
  document.querySelector('#message-input').addEventListener('keydown', e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); document.querySelector('#composer').requestSubmit() } })
  document.querySelector('#add-suggestion').addEventListener('click', () => { document.querySelector('#message-input').value = document.querySelector('#suggestion').textContent.replace(/^“|”$/g, ''); document.querySelector('#message-input').focus() })
  document.querySelector('.suggestion-close').addEventListener('click', e => e.currentTarget.closest('.reply-suggestion').remove())
  document.querySelectorAll('.rail-item:not(.active):not(#open-install)').forEach(button => button.addEventListener('click', () => showToast(`${button.title} is coming soon`)))
  document.querySelector('#open-install').addEventListener('click', () => { state.installOpen = true; render() })
  document.querySelector('#close-install')?.addEventListener('click', () => { state.installOpen = false; render() })
  document.querySelector('#done-install')?.addEventListener('click', () => { state.installOpen = false; render() })
  document.querySelector('#install-overlay')?.addEventListener('click', e => { if (e.target.id === 'install-overlay') { state.installOpen = false; render() } })
  document.querySelector('#domain-form')?.addEventListener('submit', async e => {
    e.preventDefault()
    const input = document.querySelector('#domain-input')
    const raw = input.value.trim().replace(/^https?:\/\//i, '').replace(/\/$/, '').toLowerCase()
    const host = raw.split('/')[0].split(':')[0]
    if (!/^(localhost|([a-z0-9]+(-[a-z0-9]+)*\.)+[a-z]{2,})$/i.test(host)) { input.setCustomValidity('Enter a valid domain, such as yourwebsite.com'); input.reportValidity(); return }
    input.setCustomValidity('')
    const updatedDomains = state.domains.includes(host) ? state.domains : [...state.domains, host]
    const response = await fetch(`/api/sites/${encodeURIComponent(state.siteId)}`, { method: 'PUT', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ domains: updatedDomains }) })
    if (!response.ok) { showToast('Could not save the domain. Is the chat server running?'); return }
    state.domains = (await response.json()).domains
    localStorage.setItem('orbit-domains', JSON.stringify(state.domains))
    render()
  })
  document.querySelectorAll('[data-remove-domain]').forEach(button => button.addEventListener('click', async () => { const updatedDomains = state.domains.filter((_, index) => index !== Number(button.dataset.removeDomain)); const response = await fetch(`/api/sites/${encodeURIComponent(state.siteId)}`, { method: 'PUT', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ domains: updatedDomains }) }); if (!response.ok) { showToast('Could not remove the domain.'); return }; state.domains = (await response.json()).domains; localStorage.setItem('orbit-domains', JSON.stringify(state.domains)); render() }))
  document.querySelector('#copy-embed')?.addEventListener('click', async e => { const script = `<script src="${location.origin}/widget.js" data-site-id="${state.siteId}" async>${'<' + '/script>'}`; try { await navigator.clipboard.writeText(script); e.currentTarget.innerHTML = `${icon('check', 14)} Copied`; setTimeout(() => { if (e.currentTarget.isConnected) e.currentTarget.innerHTML = `${icon('link', 14)} Copy code` }, 1500) } catch { showToast('Clipboard access is unavailable in this context') } })
  document.querySelector('.new-chat').addEventListener('click', () => showToast('New conversation started'))
  document.querySelector('.assign-button').addEventListener('click', e => { e.currentTarget.classList.toggle('assigned'); e.currentTarget.querySelector('span:nth-child(2)').textContent = e.currentTarget.classList.contains('assigned') ? 'Assigned to you' : 'Assign to me' })
}

function showToast(message) { const existing = document.querySelector('.toast'); existing?.remove(); const toast = document.createElement('div'); toast.className = 'toast'; toast.textContent = message; document.body.append(toast); setTimeout(() => toast.remove(), 2200) }

render()
initializeBackend()


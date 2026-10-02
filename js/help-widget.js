/* ==========================================================
   Garage Rooms – single help button (v2)
   One launcher → menu → "Chat with us" or "Call us now".
   Each GHL widget only loads when chosen. If GHL is blocked or
   slow, visitors get WhatsApp / phone links instead of nothing.
   ========================================================== */
(function () {
  var CHAT_ID  = '6abc9400d2e8beb1e4f9beb8'; // Conversation AI chat widget
  var VOICE_ID = '6abc976dd2e8beb1e4fa55e8'; // Voice AI widget
  var ICON     = 'assets/apple-touch-icon';     // Official emblem (no white border)
  var PHONE    = '07907 663772';
  var TEL      = 'tel:+447907663772';
  var WA       = 'https://wa.me/447907663772';
  var LOADER   = 'https://widgets.leadconnectorhq.com/loader.js';
  var RES      = 'https://widgets.leadconnectorhq.com/chat-widget/loader.js';
  var KEY      = 'gr-help-open';
  var TIMEOUT  = 10000; // ms to wait for GHL before showing fallback links

  // Built-in copy of the emblem, used only if ICON fails to load
  var EMBLEM =
    '<svg class="grh__logo" viewBox="50 48 1155 1155" aria-hidden="true">' +
      '<defs><clipPath id="grh-clip"><rect x="0" y="316" width="1254" height="940"/></clipPath></defs>' +
      '<rect x="50" y="48" width="1155" height="1155" rx="228" fill="#0AAF0F"/>' +
      '<path clip-path="url(#grh-clip)" d="M529.5 693V886.5H301.5V612L537 362L761.5 630V886.5H950V614L640 250" fill="none" stroke="#fff" stroke-width="90" stroke-linejoin="round"/>' +
    '</svg>';

  var loaded = null;       // 'chat' | 'call' | null
  var widgetOpen = false;
  var isMobile = function () { return window.matchMedia('(max-width: 600px)').matches; };
  var log = function (m) { if (window.console) console.warn('[Garage Rooms help] ' + m); };

  /* ---------- Styles ---------- */
  var css = [
    '.grh{position:fixed;right:22px;bottom:22px;z-index:2147483646;font-family:Outfit,system-ui,-apple-system,sans-serif}',
    '.grh.is-hidden{display:none}',
    '.grh__btn{position:relative;width:64px;height:64px;border:0;padding:0;border-radius:16px;cursor:pointer;background:transparent;box-shadow:0 12px 30px rgba(0,0,0,.35);display:grid;place-items:center;transition:transform .2s ease,box-shadow .2s ease}',
    '.grh__btn:hover{transform:translateY(-2px) scale(1.04);box-shadow:0 16px 36px rgba(20,184,20,.35)}',
    '.grh__btn:focus-visible{outline:3px solid #fff;outline-offset:3px}',
    '.grh__logo{width:100%;height:100%;border-radius:16px;display:block;object-fit:cover;transition:opacity .2s,transform .2s}',
    '.grh__x{position:absolute;inset:0;display:grid;place-items:center;color:#fff;background:#14B814;border-radius:16px;opacity:0;transform:rotate(-90deg);transition:opacity .2s,transform .2s}',
    '.grh__x svg{width:26px;height:26px;stroke:currentColor;stroke-width:2.4;stroke-linecap:round;fill:none}',
    '.grh.is-open .grh__logo,.grh.is-live .grh__logo{opacity:0;transform:scale(.6)}',
    '.grh.is-open .grh__x,.grh.is-live .grh__x{opacity:1;transform:none}',
    '.grh__pulse{position:absolute;inset:-6px;border-radius:20px;border:2px solid rgba(20,184,20,.55);animation:grhPulse 2.4s ease-out infinite;pointer-events:none}',
    '.grh.is-open .grh__pulse,.grh.is-live .grh__pulse,.grh.is-loading .grh__pulse{display:none}',
    '@keyframes grhPulse{0%{transform:scale(.92);opacity:.9}80%,100%{transform:scale(1.18);opacity:0}}',
    '.grh__spin{position:absolute;inset:-7px;border-radius:50%;border:3px solid rgba(20,184,20,.2);border-top-color:#14B814;display:none;animation:grhSpin .8s linear infinite;pointer-events:none}',
    '.grh.is-loading .grh__spin{display:block}',
    '@keyframes grhSpin{to{transform:rotate(360deg)}}',
    '.grh__menu{position:absolute;right:0;bottom:80px;width:280px;background:rgba(14,19,15,.97);border:1px solid rgba(255,255,255,.1);border-radius:18px;padding:14px;box-shadow:0 24px 60px rgba(0,0,0,.5);opacity:0;transform:translateY(10px) scale(.98);transform-origin:bottom right;pointer-events:none;transition:opacity .2s ease,transform .2s ease;-webkit-backdrop-filter:blur(12px);backdrop-filter:blur(12px)}',
    '.grh.is-open .grh__menu{opacity:1;transform:none;pointer-events:auto}',
    '.grh__panel[hidden]{display:none}',
    '.grh__title{margin:4px 10px 10px;font-size:11px;letter-spacing:.16em;text-transform:uppercase;color:rgba(255,255,255,.55);font-weight:600}',
    '.grh__note{margin:0 10px 10px;font-size:13px;line-height:1.45;color:rgba(255,255,255,.7)}',
    '.grh__opt{display:flex;align-items:center;gap:14px;width:100%;padding:12px 10px;border:0;border-radius:12px;background:transparent;color:#fff;text-align:left;cursor:pointer;font:inherit;text-decoration:none;transition:background .15s}',
    '.grh__opt+.grh__opt{margin-top:4px}',
    '.grh__opt:hover,.grh__opt:focus-visible{background:rgba(20,184,20,.14);outline:none}',
    '.grh__ico{flex:none;width:40px;height:40px;border-radius:50%;border:1px solid rgba(20,184,20,.55);display:grid;place-items:center;color:#35d635}',
    '.grh__ico svg{width:18px;height:18px;fill:none;stroke:currentColor;stroke-width:1.8;stroke-linecap:round;stroke-linejoin:round}',
    '.grh__txt strong{display:block;font-size:15.5px;font-weight:600;line-height:1.2}',
    '.grh__txt span{display:block;font-size:12.5px;color:rgba(255,255,255,.6);margin-top:3px}',
    '.grh__opt:hover strong{color:#35d635}',
    '@media (max-width:760px){.grh{bottom:84px}}', // sit above the mobile Call/Free survey bar
    '@media (max-width:600px){.grh{right:14px}.grh__btn{width:58px;height:58px}.grh__menu{bottom:72px;width:calc(100vw - 28px);max-width:340px}}',
    '@media (prefers-reduced-motion:reduce){.grh__pulse{display:none}.grh *{transition:none!important}}'
  ].join('');

  var style = document.createElement('style');
  style.textContent = css;
  document.head.appendChild(style);

  /* ---------- Markup ---------- */
  var ICO_CHAT = '<svg viewBox="0 0 24 24"><path d="M21 11.5a8.4 8.4 0 0 1-12.4 7.4L3 21l2.1-5.6A8.4 8.4 0 1 1 21 11.5z"/></svg>';
  var ICO_CALL = '<svg viewBox="0 0 24 24"><path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 1.9.7 2.8a2 2 0 0 1-.5 2.1L8 9.9a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.8.7a2 2 0 0 1 1.7 2z"/></svg>';

  var wrap = document.createElement('div');
  wrap.className = 'grh';
  wrap.innerHTML =
    '<div class="grh__menu" id="grh-menu" role="menu" aria-label="How can we help?">' +
      '<div class="grh__panel" data-panel="main">' +
        '<p class="grh__title">How can we help?</p>' +
        '<button class="grh__opt" type="button" role="menuitem" data-grh="chat">' +
          '<span class="grh__ico">' + ICO_CHAT + '</span>' +
          '<span class="grh__txt"><strong>Chat with us</strong><span>Typically replies in a minute</span></span>' +
        '</button>' +
        '<button class="grh__opt" type="button" role="menuitem" data-grh="call">' +
          '<span class="grh__ico">' + ICO_CALL + '</span>' +
          '<span class="grh__txt"><strong>Call us now</strong><span>Talk to us instantly, free</span></span>' +
        '</button>' +
      '</div>' +
      '<div class="grh__panel" data-panel="fallback" hidden>' +
        '<p class="grh__title">Get in touch</p>' +
        '<p class="grh__note">Our live chat couldn\'t load just now. You can still reach us directly:</p>' +
        '<a class="grh__opt" role="menuitem" href="' + WA + '" target="_blank" rel="noopener">' +
          '<span class="grh__ico">' + ICO_CHAT + '</span>' +
          '<span class="grh__txt"><strong>Message us on WhatsApp</strong><span>We reply as soon as we can</span></span>' +
        '</a>' +
        '<a class="grh__opt" role="menuitem" href="' + TEL + '">' +
          '<span class="grh__ico">' + ICO_CALL + '</span>' +
          '<span class="grh__txt"><strong>Call ' + PHONE + '</strong><span>Mon–Sat, 8am–6pm</span></span>' +
        '</a>' +
      '</div>' +
    '</div>' +
    '<button class="grh__btn" type="button" aria-label="Contact Garage Rooms" aria-haspopup="true" aria-expanded="false" aria-controls="grh-menu">' +
      '<span class="grh__pulse" aria-hidden="true"></span>' +
      '<span class="grh__spin" aria-hidden="true"></span>' +
      (ICON ? '<img class="grh__logo" src="' + ICON + '" alt="" width="64" height="64">' : EMBLEM) +
      '<span class="grh__x" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M6 6l12 12M18 6L6 18"/></svg></span>' +
    '</button>';

  var btn = wrap.querySelector('.grh__btn');
  var panelMain = wrap.querySelector('[data-panel="main"]');
  var panelFb = wrap.querySelector('[data-panel="fallback"]');

  // If the icon file is missing, swap in the built-in emblem
  var img = wrap.querySelector('img.grh__logo');
  if (img) img.addEventListener('error', function () { img.outerHTML = EMBLEM; });

  /* ---------- Helpers ---------- */
  function lc() { return window.leadConnector && window.leadConnector.chatWidget; }

  function setPanel(name) {
    panelMain.hidden = name !== 'main';
    panelFb.hidden = name !== 'fallback';
  }

  function setMenu(open) {
    wrap.classList.toggle('is-open', open);
    btn.setAttribute('aria-expanded', open ? 'true' : 'false');
    if (open) { var first = wrap.querySelector('.grh__panel:not([hidden]) .grh__opt'); if (first) first.focus(); }
    else setTimeout(function () { setPanel('main'); }, 250);
  }

  function setLoading(on) { wrap.classList.toggle('is-loading', on); }

  function setLive(open) {
    widgetOpen = open;
    wrap.classList.toggle('is-live', open);
    wrap.classList.toggle('is-hidden', open && isMobile()); // GHL goes full-screen on mobile
    btn.setAttribute('aria-label', open ? 'Close chat' : 'Contact Garage Rooms');
  }

  function showFallback(reason) {
    log(reason + ' Showing WhatsApp / phone links instead.');
    setLoading(false);
    setLive(false);
    setPanel('fallback');
    setMenu(true);
  }

  // Detect when the visitor closes the GHL window with its own close button
  var watcher = null;
  function watchClose() {
    var w = lc();
    if (!w || typeof w.isActive !== 'function' || watcher) return;
    watcher = setInterval(function () {
      try { if (widgetOpen && !w.isActive()) setLive(false); } catch (e) {}
    }, 800);
  }

  function tryOpen() {
    var w = lc();
    if (!w || typeof w.openWidget !== 'function') return false;
    try { w.openWidget(); } catch (e) { log('openWidget() threw: ' + e.message); return false; }
    setLoading(false);
    setLive(true);
    watchClose();
    return true;
  }

  function openWhenReady() {
    var done = false;
    var finish = function (ok) {
      if (done) return;
      done = true;
      clearInterval(iv);
      if (!ok) showFallback('GHL widget did not become ready within ' + (TIMEOUT / 1000) + 's (blocked, not published, or domain not allowed?).');
    };
    // GHL fires this event when the widget is ready
    window.addEventListener('LC_chatWidgetLoaded', function () {
      setTimeout(function () { if (tryOpen()) finish(true); }, 60);
    }, { once: true });
    // Polling backup in case the event was missed
    var waited = 0;
    var iv = setInterval(function () {
      if (tryOpen()) return finish(true);
      if ((waited += 250) >= TIMEOUT) finish(false);
    }, 250);
    return finish;
  }

  function loadWidget(type) {
    if (location.protocol === 'file:') {
      return showFallback('Page opened from a local file (file://). GHL widgets only load on the live website.');
    }
    loaded = type;
    setLoading(true);
    var finish = openWhenReady();
    var s = document.createElement('script');
    s.src = LOADER;
    s.async = true;
    s.setAttribute('data-resources-url', RES);
    s.setAttribute('data-widget-id', type === 'chat' ? CHAT_ID : VOICE_ID);
    s.onerror = function () { finish(false); showFallback('GHL loader script was blocked or failed to download (ad blocker / privacy browser?).'); };
    document.body.appendChild(s);
  }

  function choose(type) {
    setMenu(false);
    if (!loaded) return loadWidget(type);
    if (loaded === type) {
      if (!tryOpen()) showFallback('Widget was loaded earlier but is not responding.');
      return;
    }
    // Switching between chat and voice: GHL only allows one per page, so reload once
    try { sessionStorage.setItem(KEY, type); } catch (e) {}
    location.reload();
  }

  /* ---------- Events ---------- */
  btn.addEventListener('click', function (e) {
    e.stopPropagation();
    if (wrap.classList.contains('is-loading')) return;
    if (widgetOpen) {
      var w = lc();
      try { if (w) w.closeWidget(); } catch (err) {}
      setLive(false);
      return;
    }
    setMenu(!wrap.classList.contains('is-open'));
  });

  wrap.querySelectorAll('[data-grh]').forEach(function (el) {
    el.addEventListener('click', function (e) { e.stopPropagation(); choose(el.getAttribute('data-grh')); });
  });

  document.addEventListener('click', function (e) { if (!wrap.contains(e.target)) setMenu(false); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') { setMenu(false); btn.focus(); } });

  /* ---------- Init ---------- */
  function init() {
    document.body.appendChild(wrap);
    var pending = null;
    try { pending = sessionStorage.getItem(KEY); sessionStorage.removeItem(KEY); } catch (e) {}
    if (pending === 'chat' || pending === 'call') loadWidget(pending);
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
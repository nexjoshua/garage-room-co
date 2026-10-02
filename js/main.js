/* =========================================================
   GARAGE ROOMS — main.js
   Shared header/footer + all interactions
   ========================================================= */
(() => {
  'use strict';

  /* ---------- 1. SITE CONFIG — edit once, updates every page ---------- */
  const SITE = {
    phoneDisplay: '07907 663772',
    phoneHref: 'tel:+447907663772',
    whatsapp: 'https://wa.me/447907663772',
    email: 'info@garagerooms.co.uk',
    intro: 'Specialist garage conversions across Sussex from our Hassocks base. Designed, signed off and built by one team.',
    hours: 'Mon–Sat 8:00–18:00',
    legalName: 'Garage Rooms is a trading name of J. P. G. Builder and Contractors Limited',
    companyNo: 'Company No. 11365802',
    vatNo: 'VAT No. GB 299 0347 65',
    socials: [
      { label: 'Instagram',      short: 'Ig', href: 'https://www.instagram.com/garageroomsuk/' },
      { label: 'Google reviews', short: 'G',  href: 'https://share.google/9yXThXQ27IXvyP2yR' }
    ],
    badges: ['8 Years Trading', 'Building Control Sign-off', 'Registered Waste Carrier', 'VAT Registered', 'Free Surveys', 'Finance Available'],
    // Postcode areas you cover (flags out-of-area quote requests). Empty = accept all.
    coveredAreas: ['BN', 'RH', 'TN'],
    // Where main.js POSTs the form as JSON. Leave blank: contact.html already sends to the LeadConnector webhook.
    formEndpoint: ''
  };

  const NAV = [
    { id: 'services', label: 'Services', href: 'services.html' },
    { id: 'projects', label: 'Projects', href: 'projects.html' },
    { id: 'about',    label: 'About',    href: 'about.html' },
    { id: 'areas',    label: 'Areas',    href: 'areas.html' },
    { id: 'contact',  label: 'Contact',  href: 'contact.html' }
  ];

  const page = document.body.dataset.page || '';
  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => [...c.querySelectorAll(s)];

  /* ---------- 2. Header ---------- */
  function renderHeader() {
    const el = $('#site-header');
    if (!el) return;
    const links = NAV.map(n =>
      `<li><a href="${n.href}"${n.id === page ? ' class="is-active" aria-current="page"' : ''}>${n.label}</a></li>`
    ).join('');

    el.innerHTML = `
      <div class="container header__inner">
        <a href="index.html" class="brand" aria-label="Garage Rooms — home">
          <img src="assets/logo.png" alt="Garage Rooms" width="170" height="26">
        </a>
        <nav class="nav" aria-label="Primary"><ul>${links}</ul></nav>
        <div class="header__cta">
          <a class="header__phone" href="${SITE.phoneHref}">${SITE.phoneDisplay}</a>
          <a class="btn btn--primary btn--sm" href="contact.html">Free survey <span class="arrow">→</span></a>
          <button class="burger" aria-expanded="false" aria-controls="mobile-menu" aria-label="Open menu"><span></span><span></span></button>
        </div>
      </div>`;

    const menu = document.createElement('div');
    menu.className = 'mobile-menu';
    menu.id = 'mobile-menu';
    menu.hidden = true;
    menu.innerHTML = `
      <ul><li><a href="index.html"${page === 'home' ? ' class="is-active"' : ''}>Home</a></li>${links}</ul>
      <div class="mobile-menu__foot">
        <a class="btn btn--primary btn--block" href="contact.html">Book a free survey <span class="arrow">→</span></a>
        <a class="btn btn--ghost btn--block" href="${SITE.phoneHref}">Call ${SITE.phoneDisplay}</a>
      </div>`;
    document.body.appendChild(menu);
  }

  function initHeader() {
    const header = $('#site-header');
    if (!header) return;
    const onScroll = () => header.classList.toggle('is-scrolled', window.scrollY > 30);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });

    const burger = $('.burger');
    const menu = $('#mobile-menu');
    if (!burger || !menu) return;
    const toggle = (open) => {
      burger.setAttribute('aria-expanded', String(open));
      burger.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
      menu.hidden = !open;
      document.body.classList.toggle('menu-open', open);
    };
    burger.addEventListener('click', () => toggle(menu.hidden));
    $$('a', menu).forEach(a => a.addEventListener('click', () => toggle(false)));
    document.addEventListener('keydown', e => { if (e.key === 'Escape' && !menu.hidden) toggle(false); });
  }

  /* ---------- 3. Footer + mobile bar ---------- */
  function renderFooter() {
    const el = $('#site-footer');
    if (!el) return;
    const socials = SITE.socials.map(s =>
      `<a href="${s.href}" target="_blank" rel="noopener" aria-label="${s.label}">${s.short}</a>`
    ).join('');

    el.innerHTML = `
      <div class="container">
        <div class="footer__top">
          <div class="footer__brand">
            <a href="index.html" class="brand"><img src="assets/logo.png" alt="Garage Rooms" width="170" height="26"></a>
            <p>${SITE.intro}</p>
            <div class="socials">${socials}</div>
          </div>
          <div><h4>Explore</h4><ul><li><a href="index.html">Home</a></li>${NAV.map(n => `<li><a href="${n.href}">${n.label}</a></li>`).join('')}</ul></div>
          <div><h4>Conversions</h4><ul>
            <li><a href="services.html#office">Home offices</a></li>
            <li><a href="services.html#clinic">Home clinics &amp; salons</a></li>
            <li><a href="services.html#bedroom">Bedrooms &amp; ensuites</a></li>
            <li><a href="services.html#gym">Home gyms</a></li>
            <li><a href="services.html#annex">Annexes</a></li>
            <li><a href="services.html#kitchen">Kitchen-diners</a></li>
          </ul></div>
          <div><h4>Get in touch</h4><ul>
            <li><a href="${SITE.phoneHref}">${SITE.phoneDisplay}</a></li>
            <li><a href="mailto:${SITE.email}">${SITE.email}</a></li>
            <li><a href="${SITE.whatsapp}" target="_blank" rel="noopener">WhatsApp us</a></li>
            <li>${SITE.hours}</li>
          </ul></div>
        </div>
        <div class="footer__badges">${SITE.badges.map(b => `<span>${b}</span>`).join('')}</div>
        <p class="footer__word" aria-hidden="true">Garage Rooms</p>
        <div class="footer__bottom">
          <p>© <span data-year></span> ${SITE.legalName}. ${SITE.companyNo} · ${SITE.vatNo}. Registered in England &amp; Wales.</p>
          <p><a href="privacy.html">Privacy</a> · <a href="privacy.html#cookies">Cookies</a></p>
        </div>
      </div>`;

    if (page !== 'contact') {
      const bar = document.createElement('div');
      bar.className = 'mobile-bar';
      bar.innerHTML = `
        <a class="btn btn--ghost" href="${SITE.phoneHref}">Call</a>
        <a class="btn btn--primary" href="contact.html">Free survey <span class="arrow">→</span></a>`;
      document.body.appendChild(bar);
      const onScroll = () => bar.classList.toggle('is-visible', window.scrollY > window.innerHeight * 0.6);
      window.addEventListener('scroll', onScroll, { passive: true });
    }
  }

  /* ---------- 4. Reveal on scroll ---------- */
  function initReveal() {
    const items = $$('.reveal');
    const groups = new Map();
    items.forEach(el => {
      const g = groups.get(el.parentElement) || [];
      g.push(el); groups.set(el.parentElement, g);
    });
    groups.forEach(g => g.forEach((el, i) => { el.style.transitionDelay = `${Math.min(i, 5) * 90}ms`; }));

    if (!('IntersectionObserver' in window)) { items.forEach(el => el.classList.add('is-in')); return; }
    const io = new IntersectionObserver((entries) => {
      entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('is-in'); io.unobserve(e.target); } });
    }, { threshold: 0.12, rootMargin: '0px 0px -6% 0px' });
    items.forEach(el => io.observe(el));
  }

  /* ---------- 5. Counters ---------- */
  function initCounters() {
    const nums = $$('[data-count]');
    if (!nums.length) return;
    const run = (el) => {
      const target = parseFloat(el.dataset.count);
      const suffix = el.dataset.suffix || '';
      const dur = 1600; const t0 = performance.now();
      const tick = (t) => {
        const p = Math.min((t - t0) / dur, 1);
        const eased = 1 - Math.pow(1 - p, 3);
        el.textContent = Math.round(target * eased).toLocaleString('en-GB') + suffix;
        if (p < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    };
    const io = new IntersectionObserver((entries) => {
      entries.forEach(e => { if (e.isIntersecting) { run(e.target); io.unobserve(e.target); } });
    }, { threshold: 0.6 });
    nums.forEach(n => io.observe(n));
  }

  /* ---------- 6. Marquee (seamless loop) ---------- */
  function initMarquee() {
    $$('.marquee').forEach(m => {
      const track = $('.marquee__track', m);
      if (!track) return;
      const clone = track.cloneNode(true);
      clone.setAttribute('aria-hidden', 'true');
      m.appendChild(clone);
    });
  }

  /* ---------- 7. Missing-image placeholders ---------- */
  function initMedia() {
    $$('.media img').forEach(img => {
      const mark = () => img.closest('.media').classList.add('is-missing');
      if (img.complete && img.naturalWidth === 0) mark();
      img.addEventListener('error', mark);
    });
  }

  /* ---------- 8. Before / after slider ---------- */
  function initBeforeAfter() {
    $$('.ba').forEach(ba => {
      const range = $('.ba__range', ba);
      if (!range) return;
      const set = () => ba.style.setProperty('--pos', range.value + '%');
      range.addEventListener('input', set);
      set();
    });
  }

  /* ---------- 9. Project filters ---------- */
  function initFilters() {
    const chips = $$('.chip[data-filter]');
    if (!chips.length) return;
    const items = $$('.project[data-cat]');
    chips.forEach(chip => chip.addEventListener('click', () => {
      const f = chip.dataset.filter;
      chips.forEach(c => c.setAttribute('aria-pressed', String(c === chip)));
      items.forEach(it => it.classList.toggle('is-hidden', f !== 'all' && !it.dataset.cat.split(' ').includes(f)));
    }));
  }

  /* ---------- 10. Multi-step quote form ---------- */
  function initQuoteForm() {
    const form = $('#quote-form');
    if (!form) return;
    const steps = $$('.qstep', form);
    const bar = $('.qform__progress span', form);
    const counter = $('[data-step-count]', form);
    const back = $('[data-back]', form);
    const next = $('[data-next]', form);
    const submit = $('[data-submit]', form);
    const success = $('#quote-success');
    let i = 0;

    const show = (n) => {
      i = n;
      steps.forEach((s, k) => s.classList.toggle('is-active', k === n));
      bar.style.width = ((n + 1) / steps.length * 100) + '%';
      counter.textContent = `Step ${n + 1} of ${steps.length}`;
      back.hidden = n === 0;
      next.hidden = n === steps.length - 1;
      submit.hidden = n !== steps.length - 1;
      const first = $('input, select, textarea', steps[n]);
      if (first && n > 0) first.focus({ preventScroll: true });
    };

    const validStep = () => {
      for (const f of $$('input, select, textarea', steps[i])) {
        if (!f.checkValidity()) { f.reportValidity(); return false; }
      }
      return true;
    };

    next.addEventListener('click', () => { if (validStep()) show(i + 1); });
    back.addEventListener('click', () => show(i - 1));

    // Enter moves forward instead of submitting early
    form.addEventListener('keydown', e => {
      if (e.key === 'Enter' && e.target.tagName !== 'TEXTAREA' && i < steps.length - 1) {
        e.preventDefault(); next.click();
      }
    });

    // Pre-select service from ?service=office
    const svc = new URLSearchParams(location.search).get('service');
    if (svc) { const r = $(`input[name="service"][value="${svc}"]`, form); if (r) r.checked = true; }

    // Out-of-area postcode notice (checks the letters at the start, e.g. BN, RH, TN)
    const pc = $('input[name="postcode"]', form);
    const note = $('#postcode-note', form);
    if (pc && note && SITE.coveredAreas.length) {
      pc.addEventListener('blur', () => {
        const m = pc.value.trim().toUpperCase().match(/^[A-Z]{1,2}/);
        note.hidden = !m || SITE.coveredAreas.includes(m[0]);
      });
    }

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      if (!validStep()) return;
      const data = Object.fromEntries(new FormData(form));
      data.source = 'website-quote-form';
      data.submittedAt = new Date().toISOString();
      submit.disabled = true;
      submit.textContent = 'Sending…';
      try {
        if (SITE.formEndpoint) {
          await fetch(SITE.formEndpoint, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
          });
        }
        form.hidden = true;
        success.hidden = false;
      } catch (err) {
        console.error(err);
        submit.disabled = false;
        submit.textContent = 'Try again';
      }
    });

    show(0);
  }

  /* ---------- 11. Misc ---------- */
  function initYear() { $$('[data-year]').forEach(el => { el.textContent = new Date().getFullYear(); }); }

  /* ---------- 12. Play videos only while on screen ---------- */
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  function playInView(target, videos, canPlay = () => true) {
    if (reduceMotion || !('IntersectionObserver' in window)) return;
    const io = new IntersectionObserver(([e]) => {
      videos.forEach(v => (e.isIntersecting && canPlay()) ? v.play().catch(() => {}) : v.pause());
    }, { threshold: 0.35 });
    io.observe(target);
  }

  /* ---------- 13. Before/after VIDEO (synced) ---------- */
  function initVideoCompare() {
    $$('[data-ba-video]').forEach(ba => {
      const before = $('video[data-role="before"]', ba);
      const after = $('video[data-role="after"]', ba);
      const range = $('.ba__range', ba);
      if (!before || !after || !range) return;

      after.addEventListener('timeupdate', () => {
        if (Math.abs(before.currentTime - after.currentTime) > 0.2) before.currentTime = after.currentTime;
      });
      playInView(ba, [after, before]);

      const section = ba.closest('section');
      const buttons = $$('[data-ba-jump]', section);
      const animateTo = (target) => {
        const start = +range.value, t0 = performance.now(), dur = 650;
        const step = (t) => {
          const p = Math.min((t - t0) / dur, 1);
          const eased = 1 - Math.pow(1 - p, 3);
          range.value = start + (target - start) * eased;
          range.dispatchEvent(new Event('input'));
          if (p < 1) requestAnimationFrame(step);
        };
        requestAnimationFrame(step);
      };
      buttons.forEach(b => b.addEventListener('click', () => {
        buttons.forEach(x => x.classList.toggle('is-active', x === b));
        animateTo(+b.dataset.baJump);
      }));
      range.addEventListener('pointerdown', () => buttons.forEach(x => x.classList.remove('is-active')));
    });
  }

  /* ---------- 14. 3D in motion ---------- */
  function initMotion() {
    $$('.motion').forEach(sec => {
      const v = $('.motion__video', sec);
      if (!v) return;
      const bar = $('.motion__bar span', sec);
      const btn = $('.motion__toggle', sec);
      const steps = $$('.motion__steps li', sec);
      const times = steps.map(s => parseFloat(s.dataset.at) || 0);
      let userPaused = false;

      v.addEventListener('timeupdate', () => {
        if (v.duration) bar.style.width = (v.currentTime / v.duration * 100) + '%';
        let idx = 0;
        times.forEach((t, k) => { if (v.currentTime >= t) idx = k; });
        steps.forEach((s, k) => s.classList.toggle('is-active', k === idx));
      });

      steps.forEach((s, k) => s.addEventListener('click', () => {
        v.currentTime = times[k];
        userPaused = false;
        v.play().catch(() => {});
      }));

      const syncBtn = () => {
        btn.textContent = v.paused ? '▶' : '❚❚';
        btn.setAttribute('aria-label', v.paused ? 'Play video' : 'Pause video');
      };
      v.addEventListener('play', syncBtn);
      v.addEventListener('pause', syncBtn);
      btn.addEventListener('click', () => {
        if (v.paused) { userPaused = false; v.play().catch(() => {}); }
        else { userPaused = true; v.pause(); }
      });
      syncBtn();

      playInView(sec, [v], () => !userPaused);
    });
  }

  /* ---------- Boot ---------- */
  renderHeader();
  renderFooter();
  initHeader();
  initReveal();
  initCounters();
  initMarquee();
  initMedia();
  initBeforeAfter();
  initFilters();
  initQuoteForm();
  initYear();
  initVideoCompare();
  initMotion();
})();
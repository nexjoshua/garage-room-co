/* Garage Rooms – replaces footer/header placeholders rendered by main.js */
(function () {
  var PHONE  = '07907 663772';
  var TEL    = 'tel:+447907663772';
  var WA     = 'https://wa.me/447907663772';
  var EMAIL  = 'info@garagerooms.co.uk';
  var IG     = 'https://www.instagram.com/garageroomsuk/';
  var GOOGLE = 'https://share.google/9yXThXQ27IXvyP2yR';
  var INTRO  = 'Premium garage conversions from our Hassocks base, across Sussex. Designed, signed off and built by one team.';
  var HOURS  = 'Mon–Sat 8:00–18:00';
  var LEGAL  = '© ' + new Date().getFullYear() + ' Garage Rooms is a trading name of J. P. G. Builder and Contractors Limited. Company No. 11365802 · VAT No. GB 299 0347 65. Registered in England & Wales.';
  var BADGES = [
    [/trustmark/i, '8 Years Trading'],
    [/fmb|master builders/i, 'Registered Waste Carrier'],
    [/checkatrade/i, 'VAT Registered'],
    [/liability/i, 'Free Surveys'],
    [/guarantee/i, 'Finance Available']
  ];

  function fix() {
    var roots = [document.getElementById('site-header'), document.getElementById('site-footer')].filter(Boolean);

    roots.forEach(function (root) {
      // 1. Placeholder spans
      root.querySelectorAll('.ph').forEach(function (ph) {
        if (!ph.isConnected) return;
        var t = ph.textContent;
        var p = ph.parentElement;
        var pt = p ? p.textContent : '';

        if (/0XXXX/i.test(t))                   { ph.replaceWith(PHONE); return; }
        if (/@/.test(t))                        { ph.replaceWith(EMAIL); return; }
        if (/base town|surrounding/i.test(t))   { p.textContent = INTRO; return; }
        if (/\d{1,2}:\d{2}/.test(t))            { p.textContent = HOURS; return; }
        if (/company no|vat no/i.test(pt))      { p.textContent = LEGAL; return; }
        for (var i = 0; i < BADGES.length; i++) {
          if (BADGES[i][0].test(pt)) { p.textContent = BADGES[i][1]; return; }
        }
        ph.replaceWith(t.replace(/^\[|\]$/g, '')); // any leftover: drop brackets and dashed box
      });

      // 2. Links and social icons
      root.querySelectorAll('a').forEach(function (a) {
        var h = a.getAttribute('href') || '';
        var label = (a.getAttribute('aria-label') || a.textContent || '').trim();

        if (h.indexOf('tel:') === 0) a.href = TEL;
        else if (h.indexOf('wa.me') > -1) a.href = WA;
        else if (h.indexOf('mailto:') === 0) a.href = 'mailto:' + EMAIL;

        if (/^(fb|facebook)$/i.test(label) || /^ct$|checkatrade/i.test(label)) {
          a.remove();
        } else if (/^ig$|instagram/i.test(label)) {
          a.href = IG; a.target = '_blank'; a.rel = 'noopener'; a.setAttribute('aria-label', 'Instagram');
        } else if (/^g$/i.test(label)) {
          a.href = GOOGLE; a.target = '_blank'; a.rel = 'noopener'; a.setAttribute('aria-label', 'Google reviews');
        }
      });
    });
  }

  fix();
  document.addEventListener('DOMContentLoaded', fix);
  window.addEventListener('load', fix);
})();
/* === OndamSoft Shared JS === */

// Base translations (shared across all pages)
var LANG = {
  ko: {
    'nav.products': '제품',
    'nav.blog': '블로그',
    'nav.donate': '후원',
    'nav.contact': '문의',
    'donate.title': '☕ 후원하기',
    'donate.desc': '온담소프트는 광고와 후원으로 운영됩니다.',
    'donate.kakao': '💛 카카오페이',
    'footer.desc': '문의: <a href="mailto:ondamsoft@gmail.com">ondamsoft@gmail.com</a>',
    'footer.privacy': '개인정보처리방침',
    'footer.terms': '이용약관'
  },
  en: {
    'nav.products': 'Products',
    'nav.blog': 'Blog',
    'nav.donate': 'Donate',
    'nav.contact': 'Contact',
    'donate.title': '☕ Support Us',
    'donate.desc': 'OndamSoft is funded by ads and donations.',
    'donate.kakao': '💛 KakaoPay',
    'footer.desc': 'Contact: <a href="mailto:ondamsoft@gmail.com">ondamsoft@gmail.com</a>',
    'footer.privacy': 'Privacy Policy',
    'footer.terms': 'Terms of Service'
  }
};

// Merge page-specific translations
if (typeof PAGE_LANG !== 'undefined') {
  if (PAGE_LANG.ko) Object.assign(LANG.ko, PAGE_LANG.ko);
  if (PAGE_LANG.en) Object.assign(LANG.en, PAGE_LANG.en);
}

function switchLang(lang) {
  localStorage.setItem('lang', lang);
  document.documentElement.lang = lang;
  document.querySelectorAll('[data-i18n]').forEach(function(el) {
    var key = el.getAttribute('data-i18n');
    if (LANG[lang] && LANG[lang][key]) el.textContent = LANG[lang][key];
  });
  document.querySelectorAll('[data-i18n-html]').forEach(function(el) {
    var key = el.getAttribute('data-i18n-html');
    if (LANG[lang] && LANG[lang][key]) el.innerHTML = LANG[lang][key];
  });
  var sel = document.getElementById('lang-select');
  if (sel) sel.value = lang;
}

function initLang() {
  var saved = localStorage.getItem('lang');
  var browserLang = navigator.language.startsWith('ko') ? 'ko' : 'en';
  switchLang(saved || browserLang);
}

// GitHub download count fetcher
function fetchDownloadCounts(repo, callback) {
  fetch('https://api.github.com/repos/' + repo + '/releases', { cache: 'no-cache' })
    .then(function(r) { return r.ok ? r.json() : [] })
    .then(function(releases) {
      var win = 0, mac = 0;
      releases.forEach(function(rel) {
        (rel.assets || []).forEach(function(a) {
          if (a.name.indexOf('.exe') !== -1) win += a.download_count;
          if (a.name.indexOf('.dmg') !== -1) mac += a.download_count;
        });
      });
      callback(win, mac);
    })
    .catch(function() {});
}

// Hamburger menu
function toggleMenu() {
  document.querySelector('.nav-wrap').classList.toggle('open');
}
function closeMenu() {
  var nw = document.querySelector('.nav-wrap');
  if (nw) nw.classList.remove('open');
}

// Init
document.addEventListener('DOMContentLoaded', function() {
  initLang();
});

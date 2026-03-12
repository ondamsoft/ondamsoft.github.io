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
    'donate.crypto_title': '🪙 암호화폐 후원',
    'donate.crypto_note': '주소를 클릭하면 복사됩니다 · RedotPay',
    'donate.copied': '복사됨!',
    'footer.desc': '문의: <a href="mailto:ondamsoft@gmail.com">ondamsoft@gmail.com</a>',
    'footer.privacy': '개인정보처리방침',
    'footer.terms': '이용약관',
    'footer.blog': '블로그',
    'footer.donate': '후원',
    'blog.title': '블로그',
    'blog.subtitle': '압축, PDF, 개발에 관한 유용한 이야기',
    'blog.breadcrumb': '블로그',
    'blog.cat.compress': '압축',
    'blog.cat.review': '비교/리뷰',
    'blog.cat.pdf': 'PDF',
    'blog.cat.dev': '개발 이야기',
    'blog.related': '관련 글'
  },
  en: {
    'nav.products': 'Products',
    'nav.blog': 'Blog',
    'nav.donate': 'Donate',
    'nav.contact': 'Contact',
    'donate.title': '☕ Support Us',
    'donate.desc': 'OndamSoft is funded by ads and donations.',
    'donate.kakao': '💛 KakaoPay',
    'donate.crypto_title': '🪙 Crypto Donations',
    'donate.crypto_note': 'Click address to copy · RedotPay',
    'donate.copied': 'Copied!',
    'footer.desc': 'Contact: <a href="mailto:ondamsoft@gmail.com">ondamsoft@gmail.com</a>',
    'footer.privacy': 'Privacy Policy',
    'footer.terms': 'Terms of Service',
    'footer.blog': 'Blog',
    'footer.donate': 'Donate',
    'blog.title': 'Blog',
    'blog.subtitle': 'Useful stories about compression, PDF, and development',
    'blog.breadcrumb': 'Blog',
    'blog.cat.compress': 'Compression',
    'blog.cat.review': 'Reviews',
    'blog.cat.pdf': 'PDF',
    'blog.cat.dev': 'Dev Stories',
    'blog.related': 'Related Posts'
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

// Copy crypto address
function copyCrypto(el) {
  var text = el.textContent;
  navigator.clipboard.writeText(text).then(function() {
    var badge = el.parentElement.querySelector('.crypto-copied');
    if (badge) {
      badge.classList.add('show');
      setTimeout(function() { badge.classList.remove('show'); }, 1500);
    }
  });
}

// Init
document.addEventListener('DOMContentLoaded', function() {
  initLang();
});

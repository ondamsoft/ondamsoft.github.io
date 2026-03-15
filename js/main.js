/* === OndamSoft Shared JS === */

// Base translations (shared across all pages)
var LANG = {
  ko: {
    'nav.products': '제품',
    'nav.blog': '블로그',
    'nav.donate': '후원',
    'nav.developer': '개발자',
    'nav.characters': '캐릭터',
    'nav.contact': '문의',
    'dev.name': '정재훈',
    'dev.role': '대한민국 · 소프트웨어 개발자',
    'dev.philosophy_title': '만드는 마음',
    'dev.quote': '弘益人間(홍익인간) — 널리 사람을 이롭게 하라.',
    'dev.text1': '평생을 독학으로 전산 현장을 누비며 쌓아온 기술들을 혼자만 간직하기에는 아쉬움이 컸습니다. 대한민국 IT 발전에 작은 보탬이 되고자, 현장에서 정제된 저의 기술을 기꺼운 마음으로 나눕니다.',
    'dev.text2': '언제까지 이 길을 걸을 수 있을지 모르나, 닿는 데까지 최선을 다하겠습니다. 누구나 제약 없이 편리하게 사용할 수 있는 소프트웨어를 세상에 남기는 것이 저의 마지막 소명입니다.',
    'dev.sign': '— OndamSoft 대표 정재훈',
    'donate.title': '커피 한 잔 쏘기',
    'donate.desc': '좋은 소프트웨어를 만드는 데<br>커피 한 잔의 응원이 큰 힘이 됩니다',
    'donate.kakao': '☕ 커피 한 잔 보내기',
    'donate.crypto_title': '💲 암호화폐로 후원',
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
    'nav.developer': 'Developer',
    'nav.characters': 'Characters',
    'nav.contact': 'Contact',
    'dev.name': 'Jaehun Jeong',
    'dev.role': 'South Korea · Software Developer',
    'dev.philosophy_title': 'The Heart of Making',
    'dev.quote': '弘益人間 (Hongik Ingan) — Benefit all of humanity.',
    'dev.text1': 'Having spent a lifetime self-teaching and honing my skills across the IT industry, I felt it was too precious to keep these skills to myself. To contribute even a small part to the advancement of IT in Korea, I gladly share the expertise refined through years of hands-on experience.',
    'dev.text2': 'I don\'t know how long I can walk this path, but I will do my best as far as I can reach. Leaving behind software that anyone can use freely and conveniently is my final calling.',
    'dev.sign': '— Jaehun Jeong, CEO of OndamSoft',
    'donate.title': 'Buy Me a Coffee',
    'donate.desc': 'A cup of coffee goes a long way<br>in helping us build great software',
    'donate.kakao': '☕ Buy a Coffee',
    'donate.crypto_title': '💲 Crypto',
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
// filter: 제품명 필터 (예: 'OndamZip', 'OndamPDF') - 같은 repo에 여러 제품이 있을 때 구분
function fetchDownloadCounts(repo, callback, filter) {
  fetch('https://api.github.com/repos/' + repo + '/releases', { cache: 'no-cache' })
    .then(function(r) { return r.ok ? r.json() : [] })
    .then(function(releases) {
      var win = 0, mac = 0;
      releases.forEach(function(rel) {
        (rel.assets || []).forEach(function(a) {
          if (filter && a.name.indexOf(filter) === -1) return;
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

// Toggle crypto addresses
function toggleCrypto() {
  var list = document.getElementById('cryptoList');
  var note = document.getElementById('cryptoNote');
  if (list) list.classList.toggle('open');
  if (note) note.classList.toggle('open');
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

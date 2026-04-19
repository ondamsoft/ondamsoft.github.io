/* === OndamSoft Shared JS === */

// Base translations (shared across all pages)
var LANG = {
  ko: {
    'nav.products': '제품',
    'nav.developer': '개발자',
    'nav.contact': '문의',
    'dev.name': '정재훈',
    'dev.role': '대한민국 · 소프트웨어 개발자',
    'dev.philosophy_title': '온담 패밀리를 만든 이유',
    'dev.text1': '저는 아직 전산 현업 개발자로 근무하고 있습니다. 모든 기업이 마찬가지이지만, 원가절감을 외치고 있죠. 실제로 소프트웨어 사용료를 감당하지 못하는 기업들이 많습니다.',
    'dev.text2': '그래서 생각했습니다, 작은 것부터 시작해보며 무료이면서 불편하지 않은 프로그램을 만들 수 있지 않을까? 퇴근 후 틈틈이 만들기 시작한 것이 온담 패밀리의 시작입니다. 물론 저도 모든 소프트웨어를 무료화하는 것은 한계가 분명히 존재할 것입니다. 더 좋은 유료 프로그램도 개발해서 판매할 계획도 있으니 많은 사랑 부탁드립니다.',
    'dev.text3': '\'온담\'이라는 이름은 \'따뜻한 이야기, 온전하게 담다\'라는 뜻이에요. 사용자가 매일 마주치는 작은 불편을 줄이는 도구를 정성껏 만듭니다.',
    'dev.text4': '사용자가 매일 맞닥뜨리는 불편을 줄이는 도구를 만듭니다. 광고 없는 무료 소프트웨어, 정직한 카피, 오래 쓸 수 있는 품질을 추구합니다.',
    'dev.text5': '제가 언제까지 이 길을 걸을 수 있을지 모르지만, 닿는 데까지 최선을 다하겠습니다.',
    'dev.sharing_title': '🐾 나눔 약속',
    'dev.sharing_content': '만약 후원금이나 광고 수익이 실제로 발생한다면, 유기동물 보호 단체와 소외 계층을 위한 일부는 실제 기부에 사용할 계획입니다. 온담 패밀리처럼, 따뜻한 집을 찾는 모든 존재를 응원합니다.',
    'dev.sign': '— OndamSoft 개발자 정재훈',
    'footer.desc': '문의: <a href="mailto:ondamsoft@gmail.com">ondamsoft@gmail.com</a>',
    'footer.privacy': '개인정보처리방침',
    'footer.terms': '이용약관',
    'footer.business': '상호: 온담소프트 | 사업자등록번호: 180-18-02712 | 대표: 정재훈'
  },
  en: {
    'nav.products': 'Products',
    'nav.developer': 'Developer',
    'nav.contact': 'Contact',
    'dev.name': 'Jaehun Jeong',
    'dev.role': 'South Korea · Software Developer',
    'dev.philosophy_title': 'Why I Created the Ondam Family',
    'dev.text1': 'I\'m still working as a developer in the IT field. Like every company, we\'re always talking about cutting costs. Many businesses genuinely struggle to afford software licensing fees.',
    'dev.text2': 'So I thought — starting small, could I build programs that are free but not inconvenient? I started building after work, bit by bit. That\'s how the Ondam Family began. Of course, making all software free has its limits. I also plan to develop and sell better premium software, so please show your support.',
    'dev.text3': '\'Ondam\' means \'warm stories, embracing completely\' in Korean. I personally love cats, so four cats have joined the Ondam Family.',
    'dev.text4': 'Ondami the cheese tabby, Ondoki the mackerel tabby, Onnuni the black cat, and Oncapi the calico. Someday, when I can afford it, I\'d love to have a real cat too.',
    'dev.text5': 'I don\'t know how long I can walk this path, but I\'ll do my best as far as I can reach.',
    'dev.sharing_title': '🐾 Sharing Promise',
    'dev.sharing_content': 'If donations or advertising revenue become available, I plan to donate a portion to animal protection organizations and those in need. Like the Ondam Family, I support all beings seeking a warm home.',
    'dev.sign': '— Jaehun Jeong, Developer at OndamSoft',
    'footer.desc': 'Contact: <a href="mailto:ondamsoft@gmail.com">ondamsoft@gmail.com</a>',
    'footer.privacy': 'Privacy Policy',
    'footer.terms': 'Terms of Service',
    'footer.business': 'OndamSoft | Business No: 180-18-02712 | CEO: Jaehun Jeong'
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

// Init
document.addEventListener('DOMContentLoaded', function() {
  initLang();
});

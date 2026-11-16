// 언어 결정: ?lang= → 직접 고른 값(localStorage) → 브라우저 언어(한국어면 ko, 아니면 en).
// 정적 사이트라 접속 국가는 알 수 없어서 브라우저 언어 설정으로 판단한다.
(function () {
  var KEY = 'hn.lang', q = new URLSearchParams(location.search).get('lang'), saved = null, lang;
  try { saved = localStorage.getItem(KEY); } catch (e) {}
  if (q === 'ko' || q === 'en') { lang = q; try { localStorage.setItem(KEY, q); } catch (e) {} }
  else if (saved === 'ko' || saved === 'en') lang = saved;
  else {
    var list = navigator.languages && navigator.languages.length ? navigator.languages : [navigator.language || ''];
    lang = list.some(function (l) { return /^ko\b/i.test(l); }) ? 'ko' : 'en';
  }
  document.documentElement.lang = lang;
  window.HN_LANG = lang;
  window.hnSetLang = function (to) {
    try { localStorage.setItem(KEY, to); } catch (e) {}
    if (window.hn) window.hn('language_changed', {to: to}, true);
    var u = new URL(location.href); u.searchParams.delete('lang');
    setTimeout(function () { location.replace(u); }, 120);
  };
})();

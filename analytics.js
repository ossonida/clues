// 히든노트 이용 분석 (GA4). 스코어카운터와 같은 속성(G-NFEYJ27K5H)을 쓰고 content_group으로 구분한다.
// 페이지에서는 window.hn('이벤트', {파라미터})로 부른다. 이 모듈이 뜨기 전에 부른 것도 큐에 쌓였다가 전송된다.
// 원칙: 입력한 글(후기 등)·이메일·UID는 절대 보내지 않는다. 아래 스키마에 없는 이벤트·값은 버린다.
// 내 방문 제외: 주소 끝에 ?analytics=off 를 한 번 붙여 열면 이 기기에서 계속 제외(스코어카운터와 같은 설정을 공유).
const MEASUREMENT_ID = 'G-NFEYJ27K5H';
const EXCLUDE_KEY = 'score.analytics.exclude.v1', OPTOUT_KEY = 'score.analytics.optout.v1', NOTICE_KEY = 'hn.analytics.notice.v1';
const disableKey = 'ga-disable-' + MEASUREMENT_ID;

const id = {re: /^[a-zA-Z][a-zA-Z0-9_]{0,39}$/};
const note = {re: /^note[0-9]{2}$/};
const yesno = {in: ['yes', 'no']};
const int = (min, max) => ({int: [min, max]});
const common = {note, lang: {in: ['ko', 'en']}};
const SCHEMA = {
  // 메인
  case_link_clicked: {place: {in: ['folder', 'ledger']}},
  review_opened: {},
  review_submitted: {outcome: {in: ['saved', 'login_cancelled', 'failed']}},
  language_changed: {to: {in: ['ko', 'en']}},
  // 사건 진행
  case_intro_viewed: {},
  case_started: {},
  help_opened: {},
  location_opened: {location: id, minutes_used: int(0, 999)},
  hotspot_checked: {hotspot: id, location: id, outcome: {in: ['found', 'nothing_new', 'blocked', 'revisit']}, step: int(0, 20), minutes_used: int(0, 999)},
  clue_found: {clue: id, source: {in: ['scene', 'phone', 'interrogation']}, clue_count: int(0, 200), minutes_used: int(0, 999)},
  puzzle_tried: {puzzle: id, outcome: {in: ['wrong', 'solved']}, attempt: int(1, 999), minutes_used: int(0, 999)},
  phone_app_opened: {app: id, minutes_used: int(0, 999)},
  statement_heard: {suspect: id, minutes_used: int(0, 999)},
  evidence_shown: {suspect: id, clue: id, outcome: {in: ['new_clue', 'reaction', 'no_reaction']}, minutes_used: int(0, 999)},
  time_ran_out: {clue_count: int(0, 200)},
  accuse_started: {forced: yesno, clue_count: int(0, 200), minutes_used: int(0, 999), play_minutes: int(0, 9999)},
  accuse_cancelled: {step: int(1, 3)},
  case_finished: {grade: {in: ['solved', 'almost', 'culprit_only', 'unsolved']}, points: int(0, 3), accused: id,
    culprit_correct: yesno, time_correct: yesno, evidence_correct: yesno, evidence_count: int(0, 3),
    forced: yesno, clue_count: int(0, 200), clue_total: int(0, 200), minutes_used: int(0, 999), play_minutes: int(0, 9999)},
  case_restarted: {},
  case_left: {stage: {in: ['intro', 'investigating', 'accusing']}, location: id, clue_count: int(0, 200), minutes_used: int(0, 999), play_minutes: int(0, 9999)},
};

function clean(name, params = {}) {
  const schema = SCHEMA[name];
  if (!schema) return null;
  const out = {};
  for (const [key, rule] of Object.entries({...common, ...schema})) {
    let v = params[key];
    if (v === undefined || v === null) continue;
    if (rule.in && rule.in.includes(v)) out[key] = v;
    else if (rule.re && typeof v === 'string' && rule.re.test(v)) out[key] = v;
    else if (rule.int && Number.isFinite(v = Math.round(Number(v))) && v >= rule.int[0] && v <= rule.int[1]) out[key] = v;
  }
  return out;
}

const store = {
  get(k) { try { return localStorage.getItem(k); } catch { return null; } },
  set(k, v) { try { localStorage.setItem(k, v); } catch {} },
};
if (new URLSearchParams(location.search).get('analytics') === 'off') store.set(EXCLUDE_KEY, '1');
const excluded = () => store.get(EXCLUDE_KEY) === '1';
const optedOut = () => store.get(OPTOUT_KEY) === '1';
const enabled = () => !excluded() && !optedOut();

let started = false;
function start() {
  if (started || !enabled()) return;
  started = true;
  window[disableKey] = false;
  window.dataLayer = window.dataLayer || [];
  window.gtag = function () { window.dataLayer.push(arguments); };
  window.gtag('js', new Date());
  window.gtag('config', MEASUREMENT_ID, {content_group: 'hidden_note'});
  const s = document.createElement('script');
  s.async = true;
  s.src = 'https://www.googletagmanager.com/gtag/js?id=' + MEASUREMENT_ID;
  document.head.append(s);
}

// 모든 이벤트에 붙는 공통값: <html lang>과 <html data-note>
const defaults = () => ({lang: document.documentElement.lang === 'en' ? 'en' : 'ko', note: document.documentElement.dataset.note});

function send(name, params, beacon) {
  const p = clean(name, {...defaults(), ...params});
  if (p === null) { console.warn('[hn] unknown event', name); return; }
  if (window.hnDebug) console.log('[hn]', name, p);
  if (!enabled() || window[disableKey] || typeof window.gtag !== 'function') return;
  window.gtag('event', name, beacon ? {...p, transport_type: 'beacon'} : p);
}

// 큐 비우고 실제 함수로 교체
const queued = (window.hn && window.hn.q) || [];
window.hn = (name, params, beacon) => send(name, params, beacon);
window.hn.enabled = enabled;
window.hn.setEnabled = on => { store.set(OPTOUT_KEY, on ? '0' : '1'); window[disableKey] = !on; if (on) start(); };
start();
queued.forEach(args => send(...args));

// 처음 한 번만 화면 아래 안내
(() => {
  if (!enabled() || store.get(NOTICE_KEY) === '1') return;
  const en = document.documentElement.lang === 'en';
  const bar = document.createElement('div');
  bar.className = 'hn-notice';
  bar.innerHTML = `<p>${en ? 'We use Google Analytics to see how people play. Nothing you type is sent.' : '어떻게 플레이하는지 보려고 Google Analytics로 이용 통계를 모아요. 입력한 글은 보내지 않아요.'}</p>
    <div><button data-on="0">${en ? 'Turn off' : '끄기'}</button><button data-on="1">${en ? 'OK' : '확인'}</button></div>`;
  const css = document.createElement('style');
  css.textContent = `.hn-notice{position:fixed;left:12px;right:12px;bottom:12px;max-width:560px;margin:0 auto;z-index:70;background:#1f1c18;color:#f7f3ea;display:flex;gap:12px;align-items:center;padding:10px 12px;font-size:13px;line-height:1.45;box-shadow:4px 4px 0 rgba(0,0,0,.2)}
.hn-notice p{margin:0;flex:1}.hn-notice div{display:flex;gap:6px}.hn-notice button{font:inherit;font-weight:700;border:1px solid #f7f3ea;background:none;color:inherit;padding:4px 10px;cursor:pointer;white-space:nowrap}
.hn-notice button[data-on="1"]{background:#f7f3ea;color:#1f1c18}`;
  document.head.append(css);
  bar.addEventListener('click', e => {
    const b = e.target.closest('button'); if (!b) return;
    store.set(NOTICE_KEY, '1');
    if (b.dataset.on === '0') window.hn.setEnabled(false);
    bar.remove();
  });
  const show = () => document.body.append(bar);
  document.body ? show() : addEventListener('DOMContentLoaded', show);
})();

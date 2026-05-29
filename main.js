// ===================================================================
// main.js - 메인(프로젝터) 화면 로직
// Firebase Realtime Database로 참여자 디바이스와 실시간 동기화
// ===================================================================

firebase.initializeApp(firebaseConfig);
const db = firebase.database();
const gameRef = db.ref('game');
const playersRef = db.ref('players');

// ---- 참여자 접속 URL (play.html) ----
const PLAY_URL = location.href.replace(/index\.html.*$/, '').replace(/\/$/, '') + '/play.html';

// QR 코드 생성
function makeQR(elId, url) {
  const el = document.getElementById(elId);
  if (!el || !window.QRCode) return;
  el.innerHTML = '';
  new QRCode(el, { text: url, width: 280, height: 280, colorDark: '#000', colorLight: '#fff' });
}
makeQR('qr-lobby', PLAY_URL);

// ---- 화면 전환 ----
const views = ['lobby', 'question', 'reveal', 'rank', 'final'];
function showView(name) {
  views.forEach(v => {
    const el = document.getElementById('view-' + v);
    if (el) el.classList.toggle('hidden', v !== name);
  });
}

// ---- 타이머 ----
let timerInterval = null;
function startTimer(seconds, endTime) {
  clearInterval(timerInterval);
  const fill = document.getElementById('timer-fill');
  const num = document.getElementById('timer-num');
  function tick() {
    const remain = Math.max(0, Math.ceil((endTime - Date.now()) / 1000));
    num.textContent = remain;
    fill.style.width = (remain / seconds * 100) + '%';
    if (remain <= 0) clearInterval(timerInterval);
  }
  tick();
  timerInterval = setInterval(tick, 200);
}

// ---- 게임 상태 렌더링 ----
let optionTimeout = null;
function renderState(state) {
  if (!state) { showView('lobby'); return; }
  document.getElementById('qnum').textContent =
    (state.phase === 'lobby' || state.phase === 'final') ? '' :
    ('문제 ' + (state.index + 1) + ' / ' + QUESTIONS.length);

  if (state.phase === 'lobby') {
    showView('lobby');
    clearInterval(timerInterval);
  } else if (state.phase === 'question') {
    showView('question');
    const q = QUESTIONS[state.index];
    document.getElementById('q-text').textContent = q.q;
    const optBox = document.getElementById('options');
    optBox.innerHTML = '';
    optBox.classList.remove('show');
    clearTimeout(optionTimeout);
    // 보기는 호스트가 '보기 공개'를 누르거나, showOptions=true일 때 표시
    if (state.showOptions) {
      renderOptions(q, optBox);
    }
    const sec = q.time || 30;
    if (state.endTime) startTimer(sec, state.endTime);
    else { document.getElementById('timer-num').textContent = sec; document.getElementById('timer-fill').style.width = '100%'; }
  } else if (state.phase === 'reveal') {
    showView('reveal');
    clearInterval(timerInterval);
    const q = QUESTIONS[state.index];
    document.getElementById('reveal-answer').innerHTML =
      '정답: <b>' + String.fromCharCode(65 + q.answer) + '. ' + q.options[q.answer] + '</b>';
    // 응답 통계
    playersRef.once('value', snap => {
      const players = snap.val() || {};
      let correct = 0, total = 0;
      Object.values(players).forEach(p => {
        const ans = p.answers && p.answers[state.index];
        if (ans !== undefined && ans !== null) { total++; if (ans === q.answer) correct++; }
      });
      document.getElementById('reveal-stat').textContent =
        total + '명 중 ' + correct + '명 정답! (+' + q.points + '점)';
    });
  } else if (state.phase === 'rank') {
    showView('rank');
    renderRank('rank-list');
  } else if (state.phase === 'final') {
    showView('final');
    document.getElementById('qnum').textContent = '';
    renderRank('final-list');
  }
}

function renderOptions(q, optBox) {
  optBox.innerHTML = '';
  q.options.forEach((opt, i) => {
    const div = document.createElement('div');
    div.className = 'opt opt-' + i;
    div.innerHTML = '<span class="opt-label">' + String.fromCharCode(65 + i) + '</span><span class="opt-text">' + opt + '</span>';
    optBox.appendChild(div);
  });
  // 약간의 지연 후 애니메이션
  setTimeout(() => optBox.classList.add('show'), 50);
}

function renderRank(listId) {
  playersRef.once('value', snap => {
    const players = snap.val() || {};
    const arr = Object.values(players).map(p => ({ name: p.name, score: p.score || 0 }));
    arr.sort((a, b) => b.score - a.score);
    const ol = document.getElementById(listId);
    ol.innerHTML = '';
    arr.slice(0, 10).forEach((p, i) => {
      const li = document.createElement('li');
      const medal = i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : (i + 1) + '위';
      li.innerHTML = '<span class="rk-pos">' + medal + '</span><span class="rk-name">' + p.name + '</span><span class="rk-score">' + p.score + '점</span>';
      ol.appendChild(li);
    });
    if (arr.length === 0) ol.innerHTML = '<li class="rk-empty">아직 참여자가 없습니다</li>';
  });
}

// ---- Firebase 구독 ----
gameRef.on('value', snap => renderState(snap.val()));
playersRef.on('value', snap => {
  const players = snap.val() || {};
  const n = Object.keys(players).length;
  const lp = document.getElementById('lobby-players');
  if (lp) lp.textContent = '참여자 ' + n + '명';
});

// ===================================================================
// 진행자(호스트) 컨트롤
// ===================================================================
function getState(cb) { gameRef.once('value', s => cb(s.val() || { phase: 'lobby', index: 0 })); }

document.getElementById('btn-start').onclick = () => {
  if (!confirm('대회를 처음부터 시작(리셋)합니다. 모든 점수가 초기화됩니다.')) return;
  // 점수 초기화하되 참여자 명단은 유지
  playersRef.once('value', snap => {
    const players = snap.val() || {};
    const updates = {};
    Object.keys(players).forEach(k => { updates[k + '/score'] = 0; updates[k + '/answers'] = null; });
    playersRef.update(updates);
  });
  gameRef.set({ phase: 'question', index: 0, showOptions: false, endTime: null });
};

document.getElementById('btn-show-q').onclick = () => {
  getState(st => gameRef.update({ phase: 'question', showOptions: false, endTime: null }));
};

document.getElementById('btn-show-opt').onclick = () => {
  getState(st => {
    const q = QUESTIONS[st.index];
    const sec = q.time || 30;
    gameRef.update({ phase: 'question', showOptions: true, endTime: Date.now() + sec * 1000 });
  });
};

document.getElementById('btn-reveal').onclick = () => {
  getState(st => {
    // 점수 정산
    const q = QUESTIONS[st.index];
    playersRef.once('value', snap => {
      const players = snap.val() || {};
      const updates = {};
      Object.keys(players).forEach(k => {
        const p = players[k];
        const ans = p.answers && p.answers[st.index];
        if (ans === q.answer && !p['scored_' + st.index]) {
          updates[k + '/score'] = (p.score || 0) + q.points;
          updates[k + '/scored_' + st.index] = true;
        }
      });
      if (Object.keys(updates).length) playersRef.update(updates);
    });
    gameRef.update({ phase: 'reveal' });
  });
};

document.getElementById('btn-rank').onclick = () => gameRef.update({ phase: 'rank' });

document.getElementById('btn-next').onclick = () => {
  getState(st => {
    const next = (st.index || 0) + 1;
    if (next >= QUESTIONS.length) { gameRef.update({ phase: 'final' }); return; }
    gameRef.set({ phase: 'question', index: next, showOptions: false, endTime: null });
  });
};

document.getElementById('btn-final').onclick = () => gameRef.update({ phase: 'final' });

// 진행 패널 접기/펼치기
const hostBody = document.getElementById('host-body');
document.getElementById('btn-host-toggle').onclick = () => {
  hostBody.classList.toggle('collapsed');
};

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

// ---- 답변 완료 인원 표시 (문제 화면 중) ----
let _answerWatcher = null;
function watchAnswerCount(questionIndex) {
if (_answerWatcher) { playersRef.off('value', _answerWatcher); _answerWatcher = null; }
const el = document.getElementById('answer-count');
if (!el) return;
_answerWatcher = snap => {
const players = snap.val() || {};
const total = Object.keys(players).length;
let answered = 0;
Object.values(players).forEach(p => {
const ans = p.answers && p.answers[questionIndex];
if (ans !== undefined && ans !== null) answered++;
});
el.textContent = answered + ' / ' + total + '명 답변 완료';
el.classList.toggle('all-answered', total > 0 && answered >= total);
};
playersRef.on('value', _answerWatcher);
}
function stopWatchAnswerCount() {
if (_answerWatcher) { playersRef.off('value', _answerWatcher); _answerWatcher = null; }
const el = document.getElementById('answer-count');
if (el) { el.textContent = ''; el.classList.remove('all-answered'); }
}

// ===================================================================
// 참여자 이름 랜덤 배치 (로비 화면 좌우 영역)
// ===================================================================

// 각 참여자의 고정 포지션 저장 (name -> {side, x, y, rotation})
const playerPositions = {};

function placePlayerName(name, side) {
// 랜덤 회전 (-45 ~ 45도)
const rotation = Math.floor(Math.random() * 91) - 45;

// 영역 내 랜덤 위치 (5~85% 범위)
let x, y;
let attempts = 0;
const maxAttempts = 50;
const placedOnSide = Object.values(playerPositions).filter(p => p.side === side);

// 이름 태그 예상 크기 (%)
const tagW = 40; // 퍼센트
const tagH = 12;

do {
x = 5 + Math.random() * 55; // 5% ~ 60%
y = 5 + Math.random() * 80; // 5% ~ 85%
attempts++;
} while (
attempts < maxAttempts &&
placedOnSide.some(p => {
const dx = Math.abs(p.x - x);
const dy = Math.abs(p.y - y);
return dx < tagW && dy < tagH;
})
);

return { side, x, y, rotation };
}

function renderPlayerNames(players) {
const leftEl = document.getElementById('player-names-left');
const rightEl = document.getElementById('player-names-right');
if (!leftEl || !rightEl) return;

const names = Object.values(players).map(p => p.name).filter(Boolean);

// 새 참여자만 포지션 배정
names.forEach(name => {
if (!playerPositions[name]) {
// 좌우 균형을 위해 현재 적은 쪽에 배치
const leftCount = Object.values(playerPositions).filter(p => p.side === 'left').length;
const rightCount = Object.values(playerPositions).filter(p => p.side === 'right').length;
const side = leftCount <= rightCount ? 'left' : 'right';
playerPositions[name] = placePlayerName(name, side);
}
});

// 삭제된 참여자 제거
Object.keys(playerPositions).forEach(name => {
if (!names.includes(name)) delete playerPositions[name];
});

// 렌더링
leftEl.innerHTML = '';
rightEl.innerHTML = '';

Object.entries(playerPositions).forEach(([name, pos]) => {
const span = document.createElement('span');
span.className = 'player-name-tag';
span.textContent = name;
span.style.left = pos.x + '%';
span.style.top = pos.y + '%';
span.style.transform = 'rotate(' + pos.rotation + 'deg)';
if (pos.side === 'left') {
leftEl.appendChild(span);
} else {
rightEl.appendChild(span);
}
});
}

// ---- 게임 상태 렌더링 ----
function renderState(state) {
if (!state) { showView('lobby'); return; }
document.getElementById('qnum').textContent =
(state.phase === 'lobby' || state.phase === 'final') ? '' :
('문제 ' + (state.index + 1) + ' / ' + QUESTIONS.length);

if (state.phase === 'lobby') {
showView('lobby');
clearInterval(timerInterval);
stopWatchAnswerCount();
} else if (state.phase === 'question') {
showView('question');
const q = QUESTIONS[state.index];
document.getElementById('q-text').textContent = q.q;
const optBox = document.getElementById('options');
optBox.innerHTML = '';
optBox.classList.remove('show');
if (state.showOptions) {
renderOptions(q, optBox);
watchAnswerCount(state.index);
} else {
stopWatchAnswerCount();
}
const sec = q.time || 30;
if (state.endTime) startTimer(sec, state.endTime);
else { document.getElementById('timer-num').textContent = sec; document.getElementById('timer-fill').style.width = '100%'; }
} else if (state.phase === 'reveal') {
showView('reveal');
clearInterval(timerInterval);
stopWatchAnswerCount();
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
// 성경 말씀 표시
const verseEl = document.getElementById('reveal-verse');
if (verseEl) {
if (q.verseRef || q.verseText) {
verseEl.innerHTML =
(q.verseRef ? '<span class="verse-ref">' + q.verseRef + '</span>' : '') +
(q.verseText ? '<span class="verse-body">' + q.verseText + '</span>' : '');
verseEl.classList.remove('hidden');
} else {
verseEl.innerHTML = '';
verseEl.classList.add('hidden');
}
}
} else if (state.phase === 'rank') {
showView('rank');
stopWatchAnswerCount();
renderRank('rank-list');
} else if (state.phase === 'final') {
showView('final');
stopWatchAnswerCount();
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
li.innerHTML = '<span class="rk-pos">' + medal + '</span><span class="rk-name">' + p.name + '</span><span class="rk-score">' + p.score + '점 </span>';
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
// 로비 화면일 때만 이름 렌더링
renderPlayerNames(players);
});

// ===================================================================
// 진행자(호스트) 컨트롤
// ===================================================================
function getState(cb) { gameRef.once('value', s => cb(s.val() || { phase: 'lobby', index: 0 })); }

document.getElementById('btn-reset').onclick = () => {
if (!confirm('대회를 리셋합니다.\n모든 참여자와 점수가 삭제되고 로비 화면으로 돌아갑니다.')) return;
Promise.all([
playersRef.set(null),
gameRef.set({ phase: 'lobby', index: 0, showOptions: false, endTime: null })
]);
};

document.getElementById('btn-start').onclick = () => {
if (!confirm('퀴즈를 시작합니다.\n첫 번째 문제로 넘어갑니다.')) return;
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

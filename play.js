// ===================================================================
// play.js - 참여자(모바일) 화면 로직
// ===================================================================

firebase.initializeApp(firebaseConfig);
const db = firebase.database();
const gameRef = db.ref('game');
const playersRef = db.ref('players');

let myId = localStorage.getItem('davidquiz_id') || null;
let myName = localStorage.getItem('davidquiz_name') || '';
let myAnswers = {};
let heartbeatInterval = null;

const pViews = ['join', 'wait', 'question', 'reveal', 'rank'];
function pShow(name) {
    pViews.forEach(v => {
          const el = document.getElementById('p-' + v);
          if (el) el.classList.toggle('hidden', v !== name);
    });
}

// ---- heartbeat: 페이지가 열려있는 동안 10초마다 lastSeen 갱신 ----
function startHeartbeat() {
    stopHeartbeat();
    function beat() {
          if (myId) playersRef.child(myId).update({ lastSeen: Date.now() });
    }
    beat();
    heartbeatInterval = setInterval(beat, 10000);
}

function stopHeartbeat() {
    if (heartbeatInterval) { clearInterval(heartbeatInterval); heartbeatInterval = null; }
}

// 탭 전환 / 화면 끄기 처리
document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
          stopHeartbeat();
    } else {
          if (myId && myName) startHeartbeat();
    }
});

// ---- 참여하기 ----
document.getElementById('p-join-btn').onclick = joinGame;
document.getElementById('p-name').addEventListener('keydown', e => { if (e.key === 'Enter') joinGame(); });

function joinGame() {
    const name = document.getElementById('p-name').value.trim();
    if (!name) { alert('이름을 입력해 주세요.'); return; }
    myName = name;
    if (!myId) {
          myId = playersRef.push().key;
          localStorage.setItem('davidquiz_id', myId);
    }
    localStorage.setItem('davidquiz_name', myName);
    playersRef.child(myId).update({ name: myName, score: 0, joinedAt: Date.now(), lastSeen: Date.now() });
    document.getElementById('p-myname').textContent = myName;
    startHeartbeat();
    startListening();
    pShow('wait');
}

// 이미 참여한 적이 있으면 바로 진행
if (myId && myName) {
    playersRef.child(myId).once('value', snap => {
          if (snap.exists()) {
                  document.getElementById('p-myname').textContent = myName;
                  playersRef.child(myId).update({ lastSeen: Date.now() });
                  startHeartbeat();
                  startListening();
                  pShow('wait');
          }
    });
}

// ---- 내 점수 추적 ----
function trackScore() {
    playersRef.child(myId).on('value', snap => {
          const p = snap.val() || {};
          myAnswers = p.answers || {};
          const sc = p.score || 0;
          ['p-score', 'p-score2', 'p-score3'].forEach(id => {
                  const el = document.getElementById(id); if (el) el.textContent = sc;
          });
    });
}

// ---- 게임 상태 따라가기 ----
function startListening() {
    trackScore();
    gameRef.on('value', snap => {
          const st = snap.val();
          if (!st || st.phase === 'lobby') { pShow('wait'); return; }
          renderPlay(st);
    });
}

function renderPlay(st) {
    if (st.phase === 'question') {
          pShow('question');
          const q = QUESTIONS[st.index];
          document.getElementById('p-qnum').textContent = '문제 ' + (st.index + 1) + ' / ' + QUESTIONS.length;
          document.getElementById('p-qtext').textContent = q.q;
          const box = document.getElementById('p-options');
          const answered = (myAnswers[st.index] !== undefined && myAnswers[st.index] !== null);
          if (!st.showOptions) {
                  box.innerHTML = '<p class="p-wait-opt">잠시 후 보기가 나타납니다...</p>';
                  document.getElementById('p-answered').classList.add('hidden');
                  return;
          }
          box.innerHTML = '';
          q.options.forEach((opt, i) => {
                  const btn = document.createElement('button');
                  btn.className = 'p-opt p-opt-' + i + (answered && myAnswers[st.index] === i ? ' selected' : '');
                  btn.innerHTML = '<span class="p-opt-label">' + String.fromCharCode(65 + i) + '</span>' + opt;
                  btn.disabled = answered;
                  btn.onclick = () => submitAnswer(st.index, i);
                  box.appendChild(btn);
          });
          document.getElementById('p-answered').classList.toggle('hidden', !answered);
    } else if (st.phase === 'reveal') {
          pShow('reveal');
          const q = QUESTIONS[st.index];
          const myAns = myAnswers[st.index];
          const correct = (myAns === q.answer);
          const icon = document.getElementById('p-result-icon');
          const txt = document.getElementById('p-result-text');
          if (myAns === undefined || myAns === null) {
                  icon.textContent = '⏰'; icon.className = 'p-result-icon miss';
                  txt.innerHTML = '미응답<br/><small>정답: ' + String.fromCharCode(65 + q.answer) + '. ' + q.options[q.answer] + '</small>';
          } else if (correct) {
                  icon.textContent = '⭕'; icon.className = 'p-result-icon ok';
                  txt.innerHTML = '정답입니다! <b>+' + q.points + '점</b>';
          } else {
                  icon.textContent = '❌'; icon.className = 'p-result-icon no';
                  txt.innerHTML = '아쉬워요<br/><small>정답: ' + String.fromCharCode(65 + q.answer) + '. ' + q.options[q.answer] + '</small>';
          }
    } else if (st.phase === 'rank' || st.phase === 'final') {
          pShow('rank');
          document.querySelector('#p-rank .p-title').textContent = (st.phase === 'final') ? '🏆 최종 순위' : '현재 순위';
          renderPlayerRank();
    }
}

function submitAnswer(qIndex, optIndex) {
    playersRef.child(myId).child('answers').child(qIndex).set(optIndex);
    document.getElementById('p-answered').classList.remove('hidden');
    document.querySelectorAll('#p-options .p-opt').forEach((b, i) => {
          b.disabled = true;
          b.classList.toggle('selected', i === optIndex);
    });
}

function renderPlayerRank() {
    playersRef.once('value', snap => {
          const players = snap.val() || {};
          const arr = Object.entries(players).map(([k, p]) => ({ id: k, name: p.name, score: p.score || 0 }));
          arr.sort((a, b) => b.score - a.score);
          const myPos = arr.findIndex(p => p.id === myId);
          const myEl = document.getElementById('p-myrank');
          if (myPos >= 0) myEl.innerHTML = '나의 순위: <b>' + (myPos + 1) + '위</b> / ' + arr.length + '명 (' + arr[myPos].score + '점)';
          const ol = document.getElementById('p-ranklist');
          ol.innerHTML = '';
          arr.slice(0, 10).forEach((p, i) => {
                  const li = document.createElement('li');
                  const medal = i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : (i + 1) + '위';
                  li.className = (p.id === myId) ? 'me' : '';
                  li.innerHTML = '<span>' + medal + '</span><span>' + p.name + '</span><span>' + p.score + '점</span>';
                  ol.appendChild(li);
          });
    });
}

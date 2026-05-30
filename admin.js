// admin.js — 문제 편집기 (새 admin.html UI 전용)

let editing = [];
let currentIdx = 0;

function blankQ() {
  return { q: '', options: ['', '', '', ''], answer: 0, points: 100, time: 30, verseRef: '', verseText: '' };
}

function renderList() {
  const list = document.getElementById('q-list-items');
  if (!list) return;
  list.innerHTML = '';
  editing.forEach((q, idx) => {
    const d = document.createElement('div');
    d.className = 'q-item' + (idx === currentIdx ? ' active' : '');
    d.textContent = (idx + 1) + '. ' + (q.q ? q.q.substring(0, 24) + (q.q.length > 24 ? '...' : '') : '(빈 문제)');
    d.onclick = () => selectQ(idx);
    list.appendChild(d);
  });
}

function selectQ(idx) {
  currentIdx = idx;
  const q = editing[idx];
  document.getElementById('f-q').value = q.q || '';
  document.getElementById('f-o0').value = (q.options && q.options[0]) || '';
  document.getElementById('f-o1').value = (q.options && q.options[1]) || '';
  document.getElementById('f-o2').value = (q.options && q.options[2]) || '';
  document.getElementById('f-o3').value = (q.options && q.options[3]) || '';
  document.querySelectorAll('input[name=answer]').forEach(r => {
    r.checked = (parseInt(r.value) === (q.answer || 0));
  });
  document.getElementById('f-points').value = q.points || 100;
  document.getElementById('f-time').value = q.time || 30;
  document.getElementById('f-verse-ref').value = q.verseRef || '';
  document.getElementById('f-verse-text').value = q.verseText || '';
  renderList();
}

function saveQuestion() {
  if (!editing[currentIdx]) return;
  const q = editing[currentIdx];
  q.q = document.getElementById('f-q').value.trim();
  q.options = [
    document.getElementById('f-o0').value.trim(),
    document.getElementById('f-o1').value.trim(),
    document.getElementById('f-o2').value.trim(),
    document.getElementById('f-o3').value.trim()
  ];
  const checked = document.querySelector('input[name=answer]:checked');
  q.answer = checked ? parseInt(checked.value) : 0;
  q.points = parseInt(document.getElementById('f-points').value) || 100;
  q.time = parseInt(document.getElementById('f-time').value) || 30;
  q.verseRef = document.getElementById('f-verse-ref').value.trim();
  q.verseText = document.getElementById('f-verse-text').value.trim();
  renderList();
  const msg = document.getElementById('saved-msg');
  if (msg) { msg.style.display = 'inline'; setTimeout(() => { msg.style.display = 'none'; }, 2000); }
}

function addQuestion() {
  editing.push(blankQ());
  currentIdx = editing.length - 1;
  renderList();
  selectQ(currentIdx);
}

function escJs(s) {
  if (!s) return '';
  return s.replace(/\\/g, '\\\\').replace(/'/g, "\\'").replace(/\n/g, '\\n');
}

function generateCode() {
  saveQuestion();
  let lines = [];
  lines.push('const QUIZ_TITLE = "다윗 성경 퀴즈 대회";');
  lines.push('const QUIZ_SUBTITLE = "말씀을 알고, 믿음을 세우는 시간!";');
  lines.push('');
  lines.push('const QUESTIONS = [');
  editing.forEach((q, i) => {
    const opts = q.options.map(o => "'" + escJs(o) + "'").join(', ');
    const vRef = escJs(q.verseRef || '');
    const vTxt = escJs(q.verseText || '');
    lines.push('  { q: ' + "'" + escJs(q.q) + "'" +
      ', options: [' + opts + ']' +
      ', answer: ' + (q.answer || 0) +
      ', points: ' + (q.points || 100) +
      ', time: ' + (q.time || 30) +
      ', verseRef: ' + "'" + vRef + "'" +
      ', verseText: ' + "'" + vTxt + "'" +
      ' }' + (i < editing.length - 1 ? ',' : ''));
  });
  lines.push('];');
  document.getElementById('output-code').value = lines.join('\n');
}

function copyCode() {
  const ta = document.getElementById('output-code');
  ta.select();
  document.execCommand('copy');
  alert('코드가 복사되었습니다! GitHub에서 questions.js 파일에 붙여넣으세요.');
}

window.addEventListener('DOMContentLoaded', () => {
  if (typeof QUESTIONS !== 'undefined' && QUESTIONS.length > 0) {
    editing = QUESTIONS.map(q => ({
      q: q.q || '',
      options: q.options ? [...q.options] : ['', '', '', ''],
      answer: q.answer || 0,
      points: q.points || 100,
      time: q.time || 30,
      verseRef: q.verseRef || '',
      verseText: q.verseText || ''
    }));
  } else {
    editing = [blankQ()];
  }
  renderList();
  if (editing.length > 0) selectQ(0);
});

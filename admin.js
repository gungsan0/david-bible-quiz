admin.js// ===================================================================
// admin.js - 문제 편집기
// 문제를 화면에서 편집하고 questions.js 코드를 생성합니다.
// ===================================================================

let editing = [];

function blankQ() {
  return { q: '', options: ['', '', '', ''], answer: 0, points: 100, time: 30 };
}

function render() {
  const list = document.getElementById('q-list');
  list.innerHTML = '';
  editing.forEach((q, idx) => {
    const card = document.createElement('div');
    card.className = 'q-card';
    let optsHtml = '';
    for (let i = 0; i < 4; i++) {
      const checked = q.answer === i ? 'checked' : '';
      optsHtml +=
        '<div class="q-opts-row">' +
          '<span class="lbl">' + String.fromCharCode(65 + i) + '</span>' +
          '<input type="text" data-idx="' + idx + '" data-opt="' + i + '" class="opt-in" value="' + escapeAttr(q.options[i] || '') + '" placeholder="보기 ' + (i + 1) + '" />' +
          '<label><input type="radio" name="ans-' + idx + '" data-idx="' + idx + '" data-ans="' + i + '" ' + checked + ' /> 정답</label>' +
        '</div>';
    }
    card.innerHTML =
      '<button class="q-del" data-del="' + idx + '">삭제</button>' +
      '<h3>문제 ' + (idx + 1) + '</h3>' +
      '<label>문제 내용</label>' +
      '<input type="text" class="q-in" data-idx="' + idx + '" value="' + escapeAttr(q.q) + '" placeholder="문제를 입력하세요" />' +
      '<label style="margin-top:10px">보기 (4개) / 정답 선택</label>' +
      optsHtml +
      '<div class="q-meta">' +
        '<div><label>배점</label><input type="number" class="pt-in" data-idx="' + idx + '" value="' + (q.points || 100) + '" /></div>' +
        '<div><label>제한시간(초)</label><input type="number" class="tm-in" data-idx="' + idx + '" value="' + (q.time || 30) + '" /></div>' +
      '</div>';
    list.appendChild(card);
  });
  bindInputs();
  document.getElementById('status').textContent = '총 ' + editing.length + '문제';
}

function escapeAttr(s) { return (s || '').replace(/&/g, '&amp;').replace(/"/g, '&quot;'); }

function bindInputs() {
  document.querySelectorAll('.q-in').forEach(el => el.oninput = e => { editing[+e.target.dataset.idx].q = e.target.value; });
  document.querySelectorAll('.opt-in').forEach(el => el.oninput = e => { editing[+e.target.dataset.idx].options[+e.target.dataset.opt] = e.target.value; });
  document.querySelectorAll('input[type=radio]').forEach(el => el.onchange = e => { editing[+e.target.dataset.idx].answer = +e.target.dataset.ans; });
  document.querySelectorAll('.pt-in').forEach(el => el.oninput = e => { editing[+e.target.dataset.idx].points = +e.target.value || 0; });
  document.querySelectorAll('.tm-in').forEach(el => el.oninput = e => { editing[+e.target.dataset.idx].time = +e.target.value || 30; });
  document.querySelectorAll('.q-del').forEach(el => el.onclick = e => {
    if (confirm('이 문제를 삭제할까요?')) { editing.splice(+e.target.dataset.del, 1); render(); }
  });
}

function loadFromQuestions() {
  editing = JSON.parse(JSON.stringify(typeof QUESTIONS !== 'undefined' ? QUESTIONS : []));
  render();
}

function generateCode() {
  let out = '';
  out += '// questions.js - 아래 전체를 복사하여 GitHub questions.js 에 붙여넣으세요\n\n';
  out += 'const QUIZ_TITLE = ' + JSON.stringify(typeof QUIZ_TITLE !== 'undefined' ? QUIZ_TITLE : '다윗 성경 퀴즈 대회') + ';\n';
  out += 'const QUIZ_SUBTITLE = ' + JSON.stringify(typeof QUIZ_SUBTITLE !== 'undefined' ? QUIZ_SUBTITLE : '말씀을 알고, 믿음을 세우는 시간!') + ';\n\n';
  out += 'const QUESTIONS = [\n';
  editing.forEach(q => {
    out += '  { q: ' + JSON.stringify(q.q) +
      ', options: ' + JSON.stringify(q.options) +
      ', answer: ' + q.answer +
      ', points: ' + (q.points || 100) +
      ', time: ' + (q.time || 30) + ' },\n';
  });
  out += '];\n';
  const ta = document.getElementById('code-out');
  ta.classList.remove('hidden');
  ta.value = out;
  ta.select();
  try { document.execCommand('copy'); document.getElementById('status').textContent = '코드 생성 완료! (클립보드에 복사됨) questions.js 에 붙여넣으세요'; }
  catch (e) { document.getElementById('status').textContent = '코드 생성 완료! 아래 코드를 복사하세요'; }
  ta.scrollIntoView({ behavior: 'smooth' });
}

document.getElementById('btn-add').onclick = document.getElementById('btn-add2').onclick = () => { editing.push(blankQ()); render(); };
document.getElementById('btn-gen').onclick = document.getElementById('btn-gen2').onclick = generateCode;
document.getElementById('btn-load').onclick = loadFromQuestions;

// 시작 시 현재 문제 불러오기
loadFromQuestions();

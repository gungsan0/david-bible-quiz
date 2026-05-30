// ===================================================================
// admin.js - 관리자 페이지 로직
// GitHub Contents API를 통해 questions.js 직접 수정
// ===================================================================

const REPO = 'gungsan0/david-bible-quiz';
const FILE_PATH = 'questions.js';
const BRANCH = 'main';

function getToken() { return localStorage.getItem('gh_token') || ''; }
function setToken(t) { localStorage.setItem('gh_token', t); }

function setStatus(msg, color) {
  const el = document.getElementById('admin-status');
  el.textContent = msg;
  el.style.color = color || '#7ed957';
}

// ---- 테이블 렌더링 ----
function buildTable(questions) {
  const tbody = document.getElementById('question-tbody');
  tbody.innerHTML = '';
  questions.forEach((q, i) => addRow(q, i));
}

function addRow(q, idx) {
  const tbody = document.getElementById('question-tbody');
  const tr = document.createElement('tr');
  tr.dataset.idx = idx;

  const answerOpts = ['A','B','C','D'].map((l, i) =>
    `<option value="${i}" ${(q.answer === i) ? 'selected' : ''}>${l}</option>`
  ).join('');

  tr.innerHTML = `
    <td class="at-num">${idx + 1}</td>
    <td><textarea class="at-inp q-q" rows="2" style="min-width:200px">${escHtml(q.q || '')}</textarea></td>
    <td><textarea class="at-inp q-opt0" rows="2">${escHtml((q.options && q.options[0]) || '')}</textarea></td>
    <td><textarea class="at-inp q-opt1" rows="2">${escHtml((q.options && q.options[1]) || '')}</textarea></td>
    <td><textarea class="at-inp q-opt2" rows="2">${escHtml((q.options && q.options[2]) || '')}</textarea></td>
    <td><textarea class="at-inp q-opt3" rows="2">${escHtml((q.options && q.options[3]) || '')}</textarea></td>
    <td style="text-align:center"><select class="at-sel q-answer">${answerOpts}</select></td>
    <td style="text-align:center"><input class="at-num-inp q-points" type="number" min="0" value="${q.points || 10}"/></td>
    <td style="text-align:center"><input class="at-num-inp q-time" type="number" min="5" max="120" value="${q.time || 30}" style="width:60px"/></td>
    <td>
      <textarea class="at-inp q-verseRef" rows="1" placeholder="예: 사무엘상 16:1">${escHtml(q.verseRef || '')}</textarea>
      <textarea class="at-inp q-verseText" rows="2" placeholder="말씀 내용">${escHtml(q.verseText || '')}</textarea>
    </td>
    <td style="text-align:center"><button class="at-del btn-del-row">🗑 삭제</button></td>
  `;

  tr.querySelector('.btn-del-row').onclick = () => {
    if (confirm((idx + 1) + '번 문제를 삭제할까요?')) {
      tr.remove();
      renumberRows();
    }
  };

  tbody.appendChild(tr);
}

function renumberRows() {
  const rows = document.querySelectorAll('#question-tbody tr');
  rows.forEach((tr, i) => {
    tr.dataset.idx = i;
    const num = tr.querySelector('.at-num');
    if (num) num.textContent = i + 1;
  });
}

function escHtml(s) {
  return String(s)
    .replace(/&/g,'&amp;')
    .replace(/</g,'&lt;')
    .replace(/>/g,'&gt;')
    .replace(/"/g,'&quot;');
}

// ---- 테이블에서 데이터 읽기 ----
function readTableData() {
  const rows = document.querySelectorAll('#question-tbody tr');
  const questions = [];
  rows.forEach(tr => {
    questions.push({
      q: tr.querySelector('.q-q')?.value.trim() || '',
      options: [
        tr.querySelector('.q-opt0')?.value.trim() || '',
        tr.querySelector('.q-opt1')?.value.trim() || '',
        tr.querySelector('.q-opt2')?.value.trim() || '',
        tr.querySelector('.q-opt3')?.value.trim() || ''
      ],
      answer: parseInt(tr.querySelector('.q-answer')?.value || '0'),
      points: parseInt(tr.querySelector('.q-points')?.value || '10'),
      time: parseInt(tr.querySelector('.q-time')?.value || '30'),
      verseRef: tr.querySelector('.q-verseRef')?.value.trim() || '',
      verseText: tr.querySelector('.q-verseText')?.value.trim() || ''
    });
  });
  return questions;
}

// ---- questions.js 코드 생성 ----
function generateQuestionsJs(questions) {
  const title = (typeof QUIZ_TITLE !== 'undefined') ? QUIZ_TITLE : '다윗 성경 퀴즈 대회';
  let js = 'const QUIZ_TITLE = ' + JSON.stringify(title) + ';\n\nconst QUESTIONS = [';
  questions.forEach((q, i) => {
    js += '\n  {\n';
    js += '    q: ' + JSON.stringify(q.q) + ',\n';
    js += '    options: [' + q.options.map(o => JSON.stringify(o)).join(', ') + '],\n';
    js += '    answer: ' + q.answer + ',\n';
    js += '    points: ' + q.points + ',\n';
    js += '    time: ' + q.time + ',\n';
    js += '    verseRef: ' + JSON.stringify(q.verseRef) + ',\n';
    js += '    verseText: ' + JSON.stringify(q.verseText) + '\n';
    js += '  }' + (i < questions.length - 1 ? ',' : '') + '\n';
  });
  js += '];\n';
  return js;
}

// ---- GitHub API ----
async function getFileSha(token) {
  const resp = await fetch(
    'https://api.github.com/repos/' + REPO + '/contents/' + FILE_PATH + '?ref=' + BRANCH,
    { headers: { Authorization: 'token ' + token, Accept: 'application/vnd.github.v3+json' } }
  );
  if (!resp.ok) throw new Error('파일 정보를 가져올 수 없습니다: ' + resp.status);
  return (await resp.json()).sha;
}

async function updateFile(token, content, sha) {
  const encoded = btoa(unescape(encodeURIComponent(content)));
  const resp = await fetch(
    'https://api.github.com/repos/' + REPO + '/contents/' + FILE_PATH,
    {
      method: 'PUT',
      headers: {
        Authorization: 'token ' + token,
        Accept: 'application/vnd.github.v3+json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        message: 'Update questions.js via admin page',
        content: encoded,
        sha: sha,
        branch: BRANCH
      })
    }
  );
  if (!resp.ok) {
    const err = await resp.json();
    throw new Error(err.message || '저장 실패: ' + resp.status);
  }
  return await resp.json();
}

// ---- 저장 버튼 ----
document.getElementById('btn-save').onclick = async () => {
  const token = getToken();
  if (!token) {
    document.getElementById('token-modal').classList.remove('hidden');
    return;
  }
  const btn = document.getElementById('btn-save');
  btn.disabled = true;
  setStatus('저장 중...', '#f6c945');
  try {
    const questions = readTableData();
    if (questions.length === 0) { setStatus('문제가 없습니다.', '#ff9b9b'); btn.disabled=false; return; }
    const jsContent = generateQuestionsJs(questions);
    const sha = await getFileSha(token);
    await updateFile(token, jsContent, sha);
    setStatus('✅ 저장 완료! GitHub Pages 반영까지 1~3분 소요됩니다.', '#7ed957');
  } catch (e) {
    setStatus('❌ 오류: ' + e.message, '#ff9b9b');
    if (e.message.includes('401') || e.message.includes('Bad credentials')) {
      localStorage.removeItem('gh_token');
      document.getElementById('token-modal').classList.remove('hidden');
    }
  }
  btn.disabled = false;
};

// ---- 문제 추가 ----
document.getElementById('btn-add-row').onclick = () => {
  const idx = document.querySelectorAll('#question-tbody tr').length;
  addRow({ q: '', options: ['', '', '', ''], answer: 0, points: 10, time: 30, verseRef: '', verseText: '' }, idx);
};

// ---- 토큰 모달 ----
document.getElementById('btn-token').onclick = () => {
  document.getElementById('token-input').value = getToken();
  document.getElementById('token-modal').classList.remove('hidden');
};
document.getElementById('btn-token-save').onclick = () => {
  const t = document.getElementById('token-input').value.trim();
  if (t) { setToken(t); setStatus('토큰이 저장되었습니다.', '#7ed957'); }
  document.getElementById('token-modal').classList.add('hidden');
};
document.getElementById('btn-token-cancel').onclick = () => {
  document.getElementById('token-modal').classList.add('hidden');
};

// ---- 초기화 ----
buildTable(QUESTIONS);
setStatus(getToken() ? '토큰 설정됨 ✓' : '⚠️ 저장하려면 GitHub 토큰이 필요합니다.', getToken() ? '#7ed957' : '#f6c945');

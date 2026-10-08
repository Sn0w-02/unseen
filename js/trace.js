const combineButton = document.querySelector('#combine');

combineButton.addEventListener('click', () => {
    const open = combineButton.getAttribute('aria-expanded') !== 'true';
    combineButton.setAttribute('aria-expanded', String(open));
    document.querySelector('#digital-profile').hidden = !open;
    document.querySelector('.profile-demo').classList.toggle('is-combined', open);
    combineButton.textContent = open ? '단서 연결 닫기 ↑' : '단서 연결하기 ↓';
});

/* 0~1 SAFE / 2~3 CAUTION / 4~5 DANGER: 기획상의 임의 기준 */
function getHabitLevel(count) {
    return count <= 1 ? 'SAFE' : count <= 3 ? 'CAUTION' : 'DANGER';
}

const form = document.querySelector('#trace-form');
const result = document.querySelector('#trace-result');

form.addEventListener('submit', event => {
    event.preventDefault();
    const count = form.querySelectorAll('input:checked').length;
    const level = getHabitLevel(count);
    const message = { SAFE: '선택된 항목이 적어요. 공개범위와 계정 설정도 꾸준히 확인해요.', CAUTION: '몇 가지 습관을 돌아볼 때예요. 오늘 한 가지 설정부터 확인해요.', DANGER: '돌아볼 항목이 많아요. 보호 행동을 하나씩 시작해 봐요.' };
    // 입력 문자열을 사용하지 않고 정해진 텍스트/숫자만 출력합니다.
    result.innerHTML = `${level === 'SAFE' ? '<img class="result-shield" src="assets/shield.svg" alt="">' : ''}<strong>${level} · ${{ SAFE: '습관 유지', CAUTION: '돌아보기', DANGER: '개선 시작' }[level]}</strong><p>5개 중 ${count}개 선택</p><p>${message[level]}</p><p class="note">선택 개수에 따른 캠페인 표시이며 실제 유출 위험 판정이 아닙니다.</p><a href="action.html">ACTION · 실천 방법 알아보기 ↗</a>`;
    result.dataset.level = level; result.hidden = false;
});

form.addEventListener('reset', () => { result.hidden = true; result.textContent = ''; });

form.addEventListener('change', () => { result.hidden = true; });

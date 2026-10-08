const checks = [...document.querySelectorAll('.action-check')];
const saveOption = document.querySelector('#save-actions');
const actionKey = 'leaveLess.actions.v1';
const saved = storage.get(actionKey);
if (saved) {
    try {
        const values = JSON.parse(saved);
        if (Array.isArray(values)) { checks.forEach(check => { check.checked = values.includes(check.value); }); saveOption.checked = true; }
    } catch { storage.remove(actionKey); }
}
function updateActions() {
    const selected = checks.filter(check => check.checked).map(check => check.value);
    document.querySelector('#action-percent').textContent = `${selected.length * 25}%`;
    document.querySelector('#action-progress').value = selected.length;
    document.querySelector('#action-count').textContent = `4개 중 ${selected.length}개 실천`;
    if (saveOption.checked && !storage.set(actionKey, JSON.stringify(selected))) {
        saveOption.checked = false;
    }
    document.querySelector('#pledge-message').textContent = selected.length === checks.length ? '네 가지 실천을 모두 확인했어요. 오늘의 습관을 내일도 이어가요.' : selected.length ? `${selected.length}가지 실천을 확인했어요. 작은 습관을 계속 이어가요.` : '아직 체크한 항목이 없어요. 확인한 설정부터 표시해보세요.';
}
checks.forEach(check => check.addEventListener('change', updateActions));
saveOption.addEventListener('change', () => { if (!saveOption.checked) storage.remove(actionKey); updateActions(); });
document.querySelector('#clear-actions').addEventListener('click', () => {
    checks.forEach(check => { check.checked = false; }); saveOption.checked = false; storage.remove(actionKey); updateActions();
});
updateActions();

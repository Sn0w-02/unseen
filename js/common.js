const storage = {
    get(key) { try { return localStorage.getItem(key); } catch { return null; } },
    set(key, value) { try { localStorage.setItem(key, value); return true; } catch { return false; } },
    remove(key) { try { localStorage.removeItem(key); } catch { } }
};
const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
const poster = document.querySelector('#campaign-poster');

function todayKey() { const d = new Date(); return `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`; }
function openPoster() {
    if (poster && typeof poster.showModal === 'function' && storage.get('leaveLess.hideDate') !== todayKey()) {
        poster.showModal(); document.body.classList.add('modal-open');
    }
}

if (poster) {
    document.querySelectorAll('[data-close-poster]').forEach(button => button.addEventListener('click', () => poster.close()));
    const savePosterDate = () => { if (document.querySelector('#hide-today').checked) storage.set('leaveLess.hideDate', todayKey()); };
    poster.querySelectorAll('a').forEach(link => link.addEventListener('click', savePosterDate));
    poster.addEventListener('close', () => { savePosterDate(); document.body.classList.remove('modal-open'); document.querySelector('.logo')?.focus(); });
}
document.querySelectorAll('[data-year]').forEach(el => { el.textContent = new Date().getFullYear(); });

const intro = document.querySelector('#intro-overlay');
const introVideo = document.querySelector('#intro-video');

if (intro && introVideo && !reducedMotion.matches) {
    intro.hidden = false; document.body.classList.add('intro-open');
    const blocked = [...document.querySelectorAll('header, main > section, footer, .skip')];
    blocked.forEach(el => { el.inert = true; });
    let finished = false;
    const finishIntro = () => {
        if (finished) return; finished = true; clearTimeout(fallback);
        intro.classList.add('is-leaving');
        setTimeout(() => {
            intro.hidden = true; introVideo.pause(); document.body.classList.remove('intro-open');
            blocked.forEach(el => { el.inert = false; });
            // Hero가 먼저 드러난 뒤 기존 캠페인 포스터를 표시합니다.
            setTimeout(openPoster, 1200);
        }, reducedMotion.matches ? 0 : 800);
    };
    const fallback = setTimeout(finishIntro, 10000);
    introVideo.loop = false; introVideo.muted = true;
    introVideo.addEventListener('ended', finishIntro, { once: true });
    introVideo.addEventListener('error', finishIntro, { once: true });
    reducedMotion.addEventListener('change', e => { if (e.matches) finishIntro(); });
    introVideo.play().catch(finishIntro); // 자동 재생이 차단되면 본문으로 넘어갑니다.
} else { openPoster(); }

/* UNIQUE VISIT COUNTER — shared across all pages */
(function () {
    const wrap = document.getElementById('footerVisits');
    const countEl = document.getElementById('visitCount');
    if (!wrap || !countEl) return;

    fetch('/api/visits', { method: 'POST' })
        .then(res => res.ok ? res.json() : null)
        .then(data => {
            if (!data || data.total == null) return;
            countEl.textContent = Number(data.total).toLocaleString('en-IN');
            wrap.hidden = false;
        })
        .catch(() => {});
})();

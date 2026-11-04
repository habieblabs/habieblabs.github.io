(() => {
  'use strict';
  const root = document.querySelector('[data-pasar-modal-chart]');
  const data = window.PASAR_MODAL_CHART_DATA;
  if (!root || !data) return;

  const number = value => Number(value).toLocaleString('id-ID', {minimumFractionDigits: 2, maximumFractionDigits: 2});
  const esc = value => String(value).replace(/[&<>"']/g, ch => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
  const pctWidth = (value, max) => Math.max(0, Math.min(100, (value / max) * 100));

  const macroRows = data.macro.map((item, index) => `
    <button class="pmc-macro-row${index === 1 ? ' is-active' : ''}" type="button" data-pmc-key="${esc(item.id)}" aria-pressed="${index === 1 ? 'true' : 'false'}">
      <span class="pmc-row-label">${esc(item.label)}</span>
      <span class="pmc-row-value">${esc(item.display)}</span>
      <span class="pmc-track" aria-hidden="true"><span class="pmc-fill" style="width:${pctWidth(item.value, data.macroMax)}%"></span></span>
    </button>`).join('');

  const segments = data.survey.household.distribution.map((seg, index) => `
    <button class="pmc-segment pmc-segment-${index+1}" type="button" data-pmc-key="${index === 0 ? 'household-worse' : `distribution-${index}`}" aria-label="${esc(seg.label)}: ${seg.value} persen" title="${esc(seg.label)}: ${seg.value}%" style="width:${seg.value}%"></button>`).join('');

  const sources = data.sources.map(source => `<a href="${esc(source.url)}" target="_blank" rel="noopener noreferrer">${esc(source.label)}</a>`).join('<span class="pmc-source-sep">·</span>');

  root.innerHTML = `
    <div class="pmc-frame">
      <header class="pmc-head">
        <div>
          <p class="pmc-kicker">ANGKA MAKRO <span> / </span> PENGALAMAN RUMAH TANGGA</p>
          <h2>${esc(data.title)}</h2>
        </div>
        <p class="pmc-period">${esc(data.period)}</p>
      </header>

      <div class="pmc-panels">
        <section class="pmc-panel pmc-macro-panel" aria-labelledby="pmc-macro-title">
          <div class="pmc-section-head">
            <h3 id="pmc-macro-title">Pertumbuhan ekonomi</h3>
            <span>YOY · %</span>
          </div>
          <div class="pmc-scale-label"><span>0</span><span>${esc(data.macroMax)}%</span></div>
          <div class="pmc-macro-list" role="group" aria-label="Pilih indikator pertumbuhan ekonomi">${macroRows}</div>
          <p class="pmc-panel-foot">Triwulan II 2026 dibandingkan triwulan II 2025.</p>
        </section>

        <section class="pmc-panel pmc-household-panel" aria-labelledby="pmc-household-title">
          <div class="pmc-section-head">
            <h3 id="pmc-household-title">Pengalaman responden</h3>
            <span>CELIOS · N=${esc(data.survey.n.toLocaleString('id-ID'))}</span>
          </div>
          <div class="pmc-survey-main">
            <button class="pmc-stat-button is-active" type="button" data-pmc-key="household-worse" aria-pressed="true">
              <span class="pmc-stat-number">${esc(data.survey.household.headline)}</span>
              <span class="pmc-stat-caption">${esc(data.survey.household.description)}</span>
            </button>
            <div class="pmc-basket-art" aria-hidden="true">
              <svg viewBox="0 0 174 128" role="presentation">
                <g fill="none" stroke="currentColor" stroke-width="5" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M48 48 C54 8 117 8 126 48"/>
                  <path d="M22 49 H151 L136 111 Q134 119 124 119 H49 Q39 119 36 111 Z"/>
                  <path d="M37 70 H140 M32 91 H135 M57 51 L62 117 M88 51 V117 M119 51 L111 117" stroke-width="3"/>
                  <path d="M62 48 C52 23 65 12 78 13 C86 29 77 42 73 49 Z" fill="currentColor" stroke="none"/>
                  <path d="M88 48 C84 24 98 11 111 17 C116 34 105 44 99 49 Z" fill="currentColor" stroke="none"/>
                  <path d="M112 49 C114 29 129 22 141 29 C139 45 126 51 118 53 Z" fill="currentColor" stroke="none"/>
                </g>
              </svg>
              <span>KERANJANG BELANJA</span>
            </div>
          </div>
          <div class="pmc-distribution" aria-label="Komposisi jawaban kondisi ekonomi rumah tangga">
            <div class="pmc-stacked" role="group" aria-label="Pilih kategori jawaban kondisi rumah tangga">${segments}</div>
            <div class="pmc-stack-legend">${data.survey.household.distribution.map((seg, index) => `<span><i class="pmc-legend-dot pmc-dot-${index+1}"></i>${esc(seg.label)} <b>${seg.value}%</b></span>`).join('')}</div>
          </div>
          <button class="pmc-priority-button" type="button" data-pmc-key="basic-prices" aria-pressed="false">
            <span class="pmc-priority-number">${esc(data.survey.priorities.headline)}</span>
            <span class="pmc-priority-copy"><b>Harga kebutuhan pokok</b><small>${esc(data.survey.priorities.description)}</small></span>
            <span class="pmc-priority-track"><i style="width:${data.survey.priorities.headline}"></i></span>
          </button>
        </section>
      </div>

      <div class="pmc-detail" aria-live="polite" aria-atomic="true">
        <div class="pmc-detail-title"><span>CATATAN DATA</span><b data-pmc-detail-value>5,06%</b></div>
        <p data-pmc-detail-text>${esc(data.macro[1].note)}</p>
        <small data-pmc-detail-source>${esc(data.macro[1].source)}</small>
      </div>

      <footer class="pmc-footer">
        <p>${esc(data.methodology)}</p>
        <details>
          <summary>Sumber data</summary>
          <div class="pmc-source-list">${sources}</div>
        </details>
      </footer>
    </div>`;

  const detailValue = root.querySelector('[data-pmc-detail-value]');
  const detailText = root.querySelector('[data-pmc-detail-text]');
  const detailSource = root.querySelector('[data-pmc-detail-source]');
  const buttons = Array.from(root.querySelectorAll('[data-pmc-key]'));

  const getDetail = key => {
    const macro = data.macro.find(item => item.id === key);
    if (macro) return {value: macro.display, text: macro.note, source: macro.source};
    if (key === 'household-worse') return {value: data.survey.household.headline, text: data.survey.household.note, source: data.survey.household.source};
    if (key === 'basic-prices') return {value: data.survey.priorities.headline, text: data.survey.priorities.note, source: data.survey.priorities.source};
    if (key.startsWith('distribution-')) {
      const i = Number(key.split('-')[1]);
      const seg = data.survey.household.distribution[i];
      if (seg) return {value: `${seg.value}%`, text: `${seg.label} menurut jawaban responden survei CELIOS.`, source: data.survey.household.source};
    }
    return null;
  };

  const activate = key => {
    const detail = getDetail(key);
    if (!detail) return;
    detailValue.textContent = detail.value;
    detailText.textContent = detail.text;
    detailSource.textContent = detail.source;
    buttons.forEach(button => {
      const active = button.dataset.pmcKey === key;
      button.classList.toggle('is-active', active);
      button.setAttribute('aria-pressed', String(active));
    });
  };

  buttons.forEach(button => {
    button.addEventListener('click', () => activate(button.dataset.pmcKey));
  });
  activate('household-consumption');
})();

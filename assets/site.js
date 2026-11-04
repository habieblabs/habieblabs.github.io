(() => {
  'use strict';

  const year = document.querySelector('[data-year]');
  if (year) year.textContent = String(new Date().getFullYear());

  const progress = document.getElementById('reading-progress-fill');
  if (progress) {
    let ticking = false;
    const update = () => {
      const doc = document.documentElement;
      const maxScroll = doc.scrollHeight - window.innerHeight;
      const percent = maxScroll > 0 ? Math.max(0, Math.min(100, (window.scrollY / maxScroll) * 100)) : 0;
      progress.style.width = `${percent}%`;
      ticking = false;
    };
    window.addEventListener('scroll', () => {
      if (!ticking) { window.requestAnimationFrame(update); ticking = true; }
    }, { passive: true });
    update();
  }

  document.querySelectorAll('[data-share]').forEach(button => {
    button.addEventListener('click', async () => {
      const shareData = { title: document.title, url: window.location.href };
      try {
        if (navigator.share) await navigator.share(shareData);
        else if (navigator.clipboard && window.isSecureContext) {
          await navigator.clipboard.writeText(window.location.href);
          const original = button.innerHTML;
          button.textContent = 'Tautan tersalin ✓';
          window.setTimeout(() => { button.innerHTML = original; }, 1800);
        } else window.prompt('Salin tautan tulisan ini:', window.location.href);
      } catch (err) {
        if (err && err.name !== 'AbortError') window.prompt('Salin tautan tulisan ini:', window.location.href);
      }
    });
  });

  // Fig. 01: inspect the reported daily traffic value by month.
  const trafficViz = document.querySelector('[data-viz="traffic"]');
  if (trafficViz) {
    const trafficData = [
      { month: 'Juni 2025', value: 7978, note: 'Tarif belum diberlakukan.' },
      { month: 'Juli 2025', value: 8121, note: 'Angka tertinggi dalam empat bulan yang ditampilkan; tarif belum berlaku.' },
      { month: 'Agustus 2025', value: 3815, note: 'Tarif mulai berlaku 2 Agustus. LHR sekitar 53,0% di bawah Juli; penyebab tunggal belum dapat dipastikan.' },
      { month: 'September 2025', value: 2895, note: 'LHR sekitar 64,4% di bawah Juli. Data ini belum cukup untuk memastikan penyebabnya.' }
    ];
    const period = trafficViz.querySelector('#traffic-detail-period');
    const value = trafficViz.querySelector('#traffic-detail-value');
    const note = trafficViz.querySelector('#traffic-detail-note');
    const points = Array.from(trafficViz.querySelectorAll('[data-traffic-index]'));
    const fmt = new Intl.NumberFormat('id-ID');
    const selectTrafficPoint = index => {
      const item = trafficData[index];
      if (!item || !period || !value || !note) return;
      period.textContent = item.month;
      value.textContent = `${fmt.format(item.value)} kendaraan / hari`;
      note.textContent = item.note;
      points.forEach((point, i) => {
        const active = i === index;
        point.classList.toggle('is-active', active);
        point.setAttribute('aria-pressed', String(active));
      });
    };
    points.forEach(point => {
      const index = Number(point.dataset.trafficIndex);
      point.addEventListener('click', () => selectTrafficPoint(index));
      point.addEventListener('focus', () => selectTrafficPoint(index));
      point.addEventListener('pointerenter', () => selectTrafficPoint(index));
    });
  }

  // Disclosure for source tables and notes.
  document.querySelectorAll('[data-toggle-viz-table]').forEach(button => {
    button.addEventListener('click', () => {
      const target = document.getElementById(button.getAttribute('data-toggle-viz-table'));
      if (!target) return;
      const willShow = target.hidden;
      target.hidden = !willShow;
      button.setAttribute('aria-expanded', String(willShow));
      button.innerHTML = willShow ? 'Sembunyikan angka <span aria-hidden="true">−</span>' : 'Lihat angka <span aria-hidden="true">＋</span>';
    });
  });

  // Fig. 02: recalculate the scenario as travel frequency changes.
  const burdenViz = document.querySelector('[data-viz="burden"]');
  if (burdenViz) {
    const slider = burdenViz.querySelector('#burden-frequency');
    const frequencyOutput = burdenViz.querySelector('#burden-frequency-output');
    const totalCostOutput = burdenViz.querySelector('#burden-total-cost');
    const sumbarRatioOutput = burdenViz.querySelector('#burden-sumbar-ratio');
    const rows = Array.from(burdenViz.querySelectorAll('[data-burden-row]'));
    const currency = new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 });
    const percent = number => `${number.toLocaleString('id-ID', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}%`;
    const updateBurden = () => {
      if (!slider) return;
      const trips = Math.max(1, Math.min(8, Number(slider.value) || 1));
      const total = trips * 101000;
      if (frequencyOutput) frequencyOutput.textContent = `${trips} kali`;
      if (totalCostOutput) totalCostOutput.textContent = currency.format(total);
      slider.setAttribute('aria-valuetext', `${trips} kali pulang-pergi per bulan`);
      rows.forEach(row => {
        const expenditure = Number(row.dataset.expenditure);
        const ratio = expenditure > 0 ? total / expenditure * 100 : 0;
        const fill = row.querySelector('.burden-fill');
        const label = row.querySelector('.burden-value');
        if (fill) fill.style.width = `${Math.min(100, ratio / 60 * 100)}%`;
        if (label) label.textContent = percent(ratio);
        row.setAttribute('aria-label', `${row.querySelector('.burden-name strong')?.textContent || 'Wilayah'}: ${percent(ratio)} dari pengeluaran konsumsi per kapita bulanan`);
        if (row.dataset.expenditure === '1542109' && sumbarRatioOutput) sumbarRatioOutput.textContent = percent(ratio);
      });
    };
    if (slider) {
      slider.addEventListener('input', updateBurden);
      slider.addEventListener('change', updateBurden);
      updateBurden();
    }
  }

  // Fig. 03: select a node in the five-part distributional map.
  const frameworkViz = document.querySelector('[data-viz="framework"]');
  if (frameworkViz) {
    const prompts = {
      use: 'USE — Siapa yang melintas, dan untuk keperluan apa?',
      access: 'ACCESS — Siapa yang dapat mencapai gerbang dengan mudah?',
      opportunity: 'OPPORTUNITY — Di mana peluang ekonomi terkumpul?',
      capture: 'CAPTURE — Siapa yang punya posisi untuk menangkap peluang?',
      cost: 'COST — Siapa yang membayar dan menanggung biaya ruang?'
    };
    const nodes = Array.from(frameworkViz.querySelectorAll('[data-lens]'));
    const focusLine = frameworkViz.querySelector('#framework-focus');
    const selectLens = (key, moveFocus = false) => {
      if (!prompts[key]) return;
      if (focusLine) focusLine.textContent = prompts[key];
      nodes.forEach(node => {
        const active = node.dataset.lens === key;
        node.classList.toggle('is-active', active);
        node.setAttribute('aria-pressed', String(active));
      });
      if (moveFocus) nodes.find(node => node.dataset.lens === key)?.focus();
    };
    nodes.forEach((node, index) => {
      node.addEventListener('click', () => selectLens(node.dataset.lens));
      node.addEventListener('keydown', event => {
        let next = index;
        if (event.key === 'ArrowRight' || event.key === 'ArrowDown') next = (index + 1) % nodes.length;
        else if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') next = (index - 1 + nodes.length) % nodes.length;
        else if (event.key === 'Home') next = 0;
        else if (event.key === 'End') next = nodes.length - 1;
        else return;
        event.preventDefault();
        selectLens(nodes[next].dataset.lens, true);
      });
    });
  }
})();

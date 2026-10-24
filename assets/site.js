(() => {
  'use strict';
  const year = document.querySelector('[data-year]');
  if (year) year.textContent = String(new Date().getFullYear());

  // Accessible, dependency-free SVG chart. Values are transcribed from the essay.
  const chart = document.getElementById('traffic-chart');
  if (chart && chart.childElementCount === 0) {
    const data = [
      {label:'Jun 2025', value:7978, color:'#415e50'},
      {label:'Jul 2025', value:8121, color:'#b9573c'},
      {label:'Agu 2025', value:3815, color:'#415e50'},
      {label:'Sep 2025', value:2895, color:'#415e50'}
    ];
    const width = 720, height = 340, left = 58, right = 18, top = 26, bottom = 58;
    const plotH = height - top - bottom, plotW = width - left - right, max = 10000;
    const fmt = n => new Intl.NumberFormat('id-ID').format(n);
    let svg = '';
    [0, 2500, 5000, 7500, 10000].forEach(tick => {
      const y = top + plotH - (tick/max)*plotH;
      svg += `<line x1="${left}" y1="${y}" x2="${width-right}" y2="${y}" stroke="#d7d8ce" stroke-width="1"/>`;
      svg += `<text x="${left-10}" y="${y+4}" fill="#65726b" font-size="10" text-anchor="end">${tick===0?'0':(tick/1000)+'k'}</text>`;
    });
    const slot = plotW/data.length, barW = Math.min(74, slot*0.52);
    data.forEach((d,i) => {
      const barH = (d.value/max)*plotH;
      const x = left + i*slot + (slot-barW)/2;
      const y = top + plotH - barH;
      svg += `<g class="chart-bar" tabindex="0" role="img" aria-label="${d.label}: ${fmt(d.value)} kendaraan per hari"><title>${d.label}: ${fmt(d.value)} kendaraan per hari</title>`;
      svg += `<rect x="${x}" y="${y}" width="${barW}" height="${barH}" rx="2" fill="${d.color}"/>`;
      svg += `<text x="${x+barW/2}" y="${y-10}" fill="#26352f" font-size="11" font-weight="700" text-anchor="middle">${fmt(d.value)}</text>`;
      svg += `<text x="${x+barW/2}" y="${height-28}" fill="#65726b" font-size="11" text-anchor="middle">${d.label}</text></g>`;
    });
    chart.innerHTML = svg;
  }

  const toggle = document.getElementById('toggle-data');
  const table = document.getElementById('traffic-data');
  if (toggle && table) {
    toggle.addEventListener('click', () => {
      const willShow = table.hidden;
      table.hidden = !willShow;
      toggle.setAttribute('aria-expanded', String(willShow));
      toggle.textContent = willShow ? 'Sembunyikan tabel −' : 'Lihat tabel angka +';
    });
  }

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
    window.addEventListener('scroll', () => { if (!ticking) { window.requestAnimationFrame(update); ticking = true; } }, {passive:true});
    update();
  }

  document.querySelectorAll('[data-share]').forEach(button => {
    button.addEventListener('click', async () => {
      const shareData = {title: document.title, url: window.location.href};
      try {
        if (navigator.share) await navigator.share(shareData);
        else if (navigator.clipboard && window.isSecureContext) {
          await navigator.clipboard.writeText(window.location.href);
          const original = button.innerHTML;
          button.textContent = 'Tautan tersalin ✓';
          window.setTimeout(() => { button.innerHTML = original; }, 1800);
        } else {
          window.prompt('Salin tautan tulisan ini:', window.location.href);
        }
      } catch (err) {
        if (err && err.name !== 'AbortError') window.prompt('Salin tautan tulisan ini:', window.location.href);
      }
    });
  });
})();

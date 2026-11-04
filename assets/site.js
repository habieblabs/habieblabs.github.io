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

  // Interactive Fig. 01: select a month to inspect the reported LHR value.
  const trafficViz = document.querySelector('[data-viz="traffic"]');
  if (trafficViz) {
    const trafficData = [
      {month:'Juni 2025', value:7978, note:'Tarif belum diberlakukan. Angka ini menunjukkan volume, bukan profil pengguna.'},
      {month:'Juli 2025', value:8121, note:'Angka tertinggi dalam rentang ini. Tarif belum diberlakukan.'},
      {month:'Agustus 2025', value:3815, note:'Tarif mulai berlaku 2 Agustus. LHR sekitar 53,0% di bawah Juli; penyebab tunggal belum dapat dipastikan.'},
      {month:'September 2025', value:2895, note:'LHR sekitar 64,4% di bawah Juli. Data bulanan ini belum cukup untuk memastikan penyebabnya.'}
    ];
    const period = trafficViz.querySelector('#traffic-detail-period');
    const value = trafficViz.querySelector('#traffic-detail-value');
    const note = trafficViz.querySelector('#traffic-detail-note');
    const points = Array.from(trafficViz.querySelectorAll('[data-traffic-index]'));
    const numberFormat = new Intl.NumberFormat('id-ID');
    const selectTrafficPoint = (index) => {
      const item = trafficData[index];
      if (!item || !period || !value || !note) return;
      period.textContent = item.month;
      value.textContent = `${numberFormat.format(item.value)} kendaraan per hari`;
      note.textContent = item.note;
      points.forEach((point, pointIndex) => {
        const active = pointIndex === index;
        point.classList.toggle('is-active', active);
        point.setAttribute('aria-pressed', String(active));
      });
    };
    points.forEach((point) => {
      const index = Number(point.dataset.trafficIndex);
      point.addEventListener('click', () => selectTrafficPoint(index));
      point.addEventListener('focus', () => selectTrafficPoint(index));
      point.addEventListener('pointerenter', () => selectTrafficPoint(index));
    });
  }

  // Generic data-table disclosure used by Fig. 01.
  document.querySelectorAll('[data-toggle-viz-table]').forEach((button) => {
    button.addEventListener('click', () => {
      const targetId = button.getAttribute('data-toggle-viz-table');
      const target = targetId ? document.getElementById(targetId) : null;
      if (!target) return;
      const willShow = target.hidden;
      target.hidden = !willShow;
      button.setAttribute('aria-expanded', String(willShow));
      button.innerHTML = willShow ? 'Sembunyikan tabel <span aria-hidden="true">−</span>' : 'Lihat tabel angka <span aria-hidden="true">＋</span>';
    });
  });

  // Interactive Fig. 02: scenario slider recalculates cumulative toll cost.
  const burdenViz = document.querySelector('[data-viz="burden"]');
  if (burdenViz) {
    const slider = burdenViz.querySelector('#burden-frequency');
    const frequencyOutput = burdenViz.querySelector('#burden-frequency-output');
    const totalCostOutput = burdenViz.querySelector('#burden-total-cost');
    const sumbarRatioOutput = burdenViz.querySelector('#burden-sumbar-ratio');
    const rows = Array.from(burdenViz.querySelectorAll('[data-burden-row]'));
    const currency = new Intl.NumberFormat('id-ID', {style:'currency', currency:'IDR', maximumFractionDigits:0});
    const percent = (number) => `${number.toLocaleString('id-ID', {minimumFractionDigits:2, maximumFractionDigits:2})}%`;
    const updateBurden = () => {
      if (!slider) return;
      const trips = Math.max(1, Math.min(8, Number(slider.value) || 1));
      const total = trips * 101000;
      if (frequencyOutput) frequencyOutput.textContent = `${trips} ${trips === 1 ? 'kali' : 'kali'}`;
      if (totalCostOutput) totalCostOutput.textContent = currency.format(total);
      slider.setAttribute('aria-valuetext', `${trips} kali pulang-pergi per bulan`);
      rows.forEach((row) => {
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

  // Interactive Fig. 03: five analytical lenses, not a quantitative scorecard.
  const frameworkViz = document.querySelector('[data-viz="framework"]');
  if (frameworkViz) {
    const lensContent = {
      use: {
        label:'01 / USE', title:'Siapa yang benar-benar menggunakan tol?',
        evidence:'LHR yang dilaporkan: 7.978 (Juni), 8.121 (Juli), 3.815 (Agustus), dan 2.895 (September 2025). Volume tidak menunjukkan profil atau tujuan perjalanan.',
        data:'Golongan kendaraan, asal–tujuan, pola harian, frekuensi penggunaan, dan alasan memilih tol.'
      },
      access: {
        label:'02 / ACCESS', title:'Siapa yang bisa mencapai tol secara praktis?',
        evidence:'Operator menyebut Gerbang Padang dan Kapalo Hilalang sebagai gerbang aktif pada Juni 2025. Rilis 19 Mei 2026 mencatat akses Lubuk Alung sepanjang 2,4 km masih dibangun; status lebih baru belum terkonfirmasi dalam bahan naskah.',
        data:'Waktu tempuh jaringan ke gerbang aktif, kondisi jalan penghubung, moda, biaya akses, dan status akses lokal.'
      },
      opportunity: {
        label:'03 / OPPORTUNITY', title:'Di mana peluang ekonomi terkonsentrasi?',
        evidence:'Batang Anai/Pasar Usang, Lubuk Alung, 2 X 11 Kayu Tanam, dan rest area KM 23 ditandai sebagai simpul peluang. Ini menunjukkan potensi, bukan kenaikan omzet yang telah terbukti.',
        data:'Jumlah dan omzet usaha, investasi, tenant dan pemasok, kunjungan, pekerjaan, serta transaksi lahan.'
      },
      capture: {
        label:'04 / CAPTURE', title:'Siapa yang punya posisi untuk menangkap peluang?',
        evidence:'Pelaku usaha mapan, operator logistik, pemilik lahan strategis, usaha wisata/jasa, serta tenant dan pemasok mungkin lebih siap secara struktural. Keuntungan aktual belum terbukti.',
        data:'Skala usaha, perubahan omzet, investasi, aset, sewa, pekerjaan, pengadaan lokal, dan hubungan usaha dengan arus tol.'
      },
      cost: {
        label:'05 / COST', title:'Siapa yang membayar dan menanggung biaya ruang?',
        evidence:'Tarif pulang-pergi Golongan I dihitung Rp101.000. Biaya ruang juga mencakup tanah, penghidupan, akses lokal, dan lingkungan; datanya belum cukup untuk dijumlahkan.',
        data:'Beban menurut kelompok pengguna, bidang tanah, penerima kompensasi, penggarap/penyewa/buruh terdampak, penghidupan, dan lingkungan.'
      }
    };
    const tabs = Array.from(frameworkViz.querySelectorAll('[data-lens]'));
    const panel = frameworkViz.querySelector('#framework-detail');
    const label = frameworkViz.querySelector('#framework-detail-label');
    const title = frameworkViz.querySelector('#framework-detail-title');
    const evidence = frameworkViz.querySelector('#framework-detail-evidence');
    const data = frameworkViz.querySelector('#framework-detail-data');
    const selectLens = (key, moveFocus = false) => {
      const item = lensContent[key];
      if (!item || !panel || !label || !title || !evidence || !data) return;
      label.textContent = item.label;
      title.textContent = item.title;
      evidence.textContent = item.evidence;
      data.textContent = item.data;
      const activeTab = tabs.find(tab => tab.dataset.lens === key);
      panel.setAttribute('aria-labelledby', activeTab?.id || 'lens-tab-use');
      tabs.forEach((tab) => {
        const active = tab.dataset.lens === key;
        tab.classList.toggle('is-active', active);
        tab.setAttribute('aria-selected', String(active));
        tab.tabIndex = active ? 0 : -1;
      });
      if (moveFocus && activeTab) activeTab.focus();
    };
    tabs.forEach((tab, index) => {
      tab.addEventListener('click', () => selectLens(tab.dataset.lens));
      tab.addEventListener('keydown', (event) => {
        let nextIndex = index;
        if (event.key === 'ArrowRight' || event.key === 'ArrowDown') nextIndex = (index + 1) % tabs.length;
        else if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') nextIndex = (index - 1 + tabs.length) % tabs.length;
        else if (event.key === 'Home') nextIndex = 0;
        else if (event.key === 'End') nextIndex = tabs.length - 1;
        else return;
        event.preventDefault();
        selectLens(tabs[nextIndex].dataset.lens, true);
      });
    });
  }

})();

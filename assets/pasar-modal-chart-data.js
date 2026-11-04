/*
  DATA CHART — Dari Pasar Modal ke Pasar Raya
  Untuk memperbarui angka, ubah nilai di objek ini.
  Macro: pertumbuhan tahunan (y-on-y), triwulan II 2026.
  Survey: persentase dari 1.142 responden survei masyarakat umum CELIOS.
*/
window.PASAR_MODAL_CHART_DATA = {
  title: "Pertumbuhan tercatat. Tekanan rumah tangga juga terasa.",
  period: "TRIWULAN II 2026 / SURVEI SEPT–OKT 2026",
  macroMax: 18,
  macro: [
    {
      id: "gdp",
      label: "PDB Indonesia",
      value: 5.29,
      display: "5,29%",
      note: "Ekonomi Indonesia tumbuh 5,29% dibandingkan triwulan II 2025 (y-on-y). Ini angka pertumbuhan output nasional, bukan ukuran langsung kesejahteraan setiap rumah tangga.",
      source: "BPS, 5 Agustus 2026"
    },
    {
      id: "household-consumption",
      label: "Konsumsi rumah tangga",
      value: 5.06,
      display: "5,06%",
      note: "Konsumsi rumah tangga tumbuh 5,06% (y-on-y), lebih lambat dibanding 5,52% pada triwulan I 2026.",
      source: "Bank Indonesia, 5 Agustus 2026"
    },
    {
      id: "government-consumption",
      label: "Konsumsi pemerintah",
      value: 15.97,
      display: "15,97%",
      note: "Konsumsi pemerintah tumbuh 15,97% (y-on-y). Bank Indonesia menyebut kenaikan belanja pegawai, pembayaran gaji ke-13, serta belanja barang dan jasa terkait MBG sebagai faktor pendukung.",
      source: "Bank Indonesia, 5 Agustus 2026"
    }
  ],
  survey: {
    n: 1142,
    fieldDates: "15 September–9 Oktober 2026",
    household: {
      id: "household-worse",
      label: "Kondisi ekonomi rumah tangga",
      headline: "53%",
      description: "responden menilai kondisi ekonomi rumah tangganya lebih buruk dibandingkan setahun sebelumnya.",
      distribution: [
        { label: "Lebih buruk", value: 53 },
        { label: "Sama saja", value: 31 },
        { label: "Lebih baik", value: 16 }
      ],
      note: "Dalam pertanyaan survei yang sama, 31% menyatakan tidak ada perubahan dan 16% menyatakan kondisi rumah tangganya lebih baik.",
      source: "CELIOS & Kabinet Bayangan, Gambar 26"
    },
    priorities: {
      id: "basic-prices",
      label: "Harga kebutuhan pokok",
      headline: "78%",
      description: "responden memasukkan harga kebutuhan pokok ke dalam tiga persoalan yang paling mendesak untuk segera ditangani pemerintah.",
      note: "Pertanyaan meminta responden memilih tiga hal utama yang perlu segera diperbaiki. Karena itu, persentase ini bukan ukuran inflasi atau perubahan harga.",
      source: "CELIOS & Kabinet Bayangan, Gambar 27"
    }
  },
  methodology: "Survei masyarakat umum menggunakan non-probability sampling melalui Meta Ads dengan pembobotan (weighting). Persentase adalah jawaban responden, bukan estimasi dari sampel acak nasional.",
  sources: [
    { label: "BPS · Pertumbuhan ekonomi triwulan II 2026", url: "https://www.bps.go.id/id/pressrelease/2026/08/05/2605/ekonomi-indonesia-triwulan-ii-2026-tumbuh-5-29-persen--y-on-y-.html" },
    { label: "Bank Indonesia · Siaran Pers 5 Agustus 2026", url: "https://www.bi.go.id/id/publikasi/ruang-media/news-release/Pages/sp_2815026.aspx" },
    { label: "CELIOS & Kabinet Bayangan · Rapor Kinerja 2 Tahun", url: "https://celios.co.id/api/media/file/Rapor-2-Tahun-Pemerintahan-Prabowo%E2%80%93Gibran-1.pdf" }
  ]
};

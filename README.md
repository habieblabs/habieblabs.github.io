# habieblabs.github.io

Website esai dan catatan independen oleh Habieb Aulia Sufi. Dibangun sebagai situs statis, tanpa framework build atau dependensi runtime, agar mudah dirawat dan gratis di GitHub Pages.

## Struktur

- `index.html`: beranda
- `tulisan/index.html`: arsip tulisan
- `tulisan/kalau-tol-membawa-kemajuan.html`: esai pertama
- `assets/styles.css`: seluruh gaya visual dan responsive layout
- `assets/site.js`: grafik interaktif, tombol tabel, indikator baca, dan fungsi berbagi tautan
- `assets/cover-tol.svg`: ilustrasi orisinal
- `sitemap.xml`, `robots.txt`: dasar SEO

## Publikasikan melalui GitHub Pages

1. Login ke GitHub dan buat repository **public** bernama persis `habieblabs.github.io`.
2. Unggah isi folder ini ke root repository. Pastikan `index.html` ada di root, bukan di dalam subfolder `habieblabs-site`.
3. Buka **Settings → Pages**.
4. Pada **Build and deployment**, pilih **Deploy from a branch**, branch `main`, folder `/(root)`, lalu **Save**.
5. Tunggu proses deployment selesai. Situs akan tersedia di `https://habieblabs.github.io/` setelah GitHub Pages menerbitkannya.

## Cara menambah esai

1. Salin `tulisan/kalau-tol-membawa-kemajuan.html` menjadi file HTML baru dengan slug yang mudah dibaca.
2. Ubah judul, deskripsi, canonical URL, Open Graph URL/image, dan isi esainya.
3. Tambahkan kartu baru di `index.html` dan `tulisan/index.html`.
4. Tambahkan URL baru ke `sitemap.xml`.
5. Gunakan nama file gambar yang deskriptif dan optimalkan ukuran file sebelum diunggah.

## Peta dan visualisasi berikutnya

Saat layer peta telah tervalidasi, peta interaktif dapat ditambahkan ke halaman esai menggunakan Leaflet atau komponen JavaScript lain. Untuk sementara, halaman pertama memakai grafik SVG mandiri tanpa dependency eksternal. Grafik LHR menjelaskan secara eksplisit bahwa angka yang divisualkan berasal dari panel proyek yang disebutkan dalam naskah, bukan data primer yang diverifikasi langsung dari operator.

## Catatan publikasi

- Semua file dalam repository public dapat dilihat publik. Jangan unggah data rahasia, kredensial, atau dokumentasi kasus yang belum boleh diterbitkan.
- Teks esai pada versi pertama disalin dari naskah DOCX yang diberikan, tanpa penyuntingan substantif atau pemeriksaan ulang fakta.
- GitHub Pages meng-host berkas statis; Python analisis berjalan secara lokal/terpisah lalu hasil visualnya diekspor untuk web.

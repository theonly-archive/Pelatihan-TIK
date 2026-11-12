# Masukanfilenya - Konverter File Gratis

Masukanfilenya adalah aplikasi web *client-side* murni yang memungkinkan pengguna mengonversi gambar antar format (JPG, PNG, WebP) dan menggabungkan banyak gambar menjadi satu dokumen PDF. Proyek ini dibangun sebagai bagian dari workshop pemrograman berbasis GitHub.

## Fitur Utama
* **100% Pemrosesan Lokal (Client-Side):** Tidak ada file yang diunggah ke server backend. Seluruh konversi dieksekusi oleh peramban pengguna, sehingga privasi dan keamanan terjamin.
* **Seret & Lepas (Drag & Drop):** Antarmuka ramah pengguna untuk memasukkan file gambar.
* **Unggah Banyak File (Multiple Upload):** Mendukung pemilihan beberapa gambar secara bersamaan.
* **Konversi Antar Gambar:** Konversi cepat ke JPG, PNG, atau WebP menggunakan API Canvas HTML5.
* **Penggabungan PDF:** Menggabungkan banyak gambar menjadi satu file PDF yang rapi menggunakan pustaka `jsPDF`.
* **Desain Ultra-Minimalis:** Tampilan bersih, warna solid datar, dan bebas dari elemen dekoratif tidak perlu (tanpa gradasi, tanpa emoji).

## Teknologi yang Digunakan
* HTML5
* CSS3 (Flexbox & CSS Grid, Variabel CSS)
* JavaScript (ES6+, DOM Manipulation, File API, HTML Canvas)
* [jsPDF](https://github.com/parallax/jsPDF) (Pustaka untuk generasi dokumen PDF)

## Cara Menggunakan
1. Buka halaman utama website.
2. Seret dan lepas file gambar ke area yang telah disediakan, atau klik untuk memilih dari komputer.
3. Lihat pratinjau gambar yang sudah diunggah.
4. Pilih format tujuan dari kotak pilihan.
5. Klik tombol "Konversi & Unduh".
6. Browser akan otomatis mengunduh file hasil konversi.

## Profil Pengembang
Proyek ini dikembangkan oleh **Pandu Bittama Nurindra**, seorang pelajar SMA yang bersemangat menciptakan solusi berbasis teknologi. 

## Menjalankan Proyek Secara Lokal
Karena proyek ini 100% berbasis *client-side*, Anda cukup melakukan klon repositori ini dan membuka file `index.html` di web browser apa pun tanpa memerlukan server lokal (Localhost).

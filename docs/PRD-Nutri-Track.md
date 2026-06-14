# PRD Nutri Track

## 1. Ringkasan Produk
Nutri Track adalah aplikasi pendamping gizi berbasis AI untuk pengguna Indonesia. Aplikasi ini membantu pengguna memindai makanan, mendapatkan penilaian risiko berdasarkan diagnosis medis, menyimpan riwayat konsumsi, memantau tren harian, dan menyusun rencana makan mingguan yang sesuai kondisi kesehatan dan dapat membatu untuk diet.

Produk ini saat ini dirancang sebagai aplikasi mobile-first Android. Pengalaman utamanya adalah layar penuh dengan navigasi bawah, kartu-kartu informatif, dan alur onboarding yang sederhana. Data pengguna disimpan secara lokal terlebih dahulu agar aplikasi tetap bisa dipakai tanpa backend penuh.

## 2. Tujuan Produk
Tujuan utama produk ini adalah:
- Membantu pengguna memahami risiko makanan terhadap kondisi medisnya.
- Memberikan alternatif menu lokal yang lebih aman dan realistis.
- Menyediakan pengalaman yang cocok untuk Android melalui PWA atau wrapper mobile.
- Menyimpan data utama di perangkat pengguna terlebih dahulu.
- Menampilkan informasi kesehatan dengan cara yang mudah dibaca, cepat dipindai, dan terasa modern.

## 3. Target Platform
Prioritas platform:
- Android smartphone sebagai target utama.
- Web mobile sebagai basis implementasi.
- PWA installable agar pengguna bisa menambahkan aplikasi ke home screen.
- Jika dibutuhkan versi APK native, proyek ini dapat dibungkus ulang menggunakan Capacitor atau Flutter wrapper, tetapi PRD ini tetap menganggap basis utama adalah web app mobile-first.

Implikasi desain untuk Android:
- Semua layar harus nyaman pada lebar sekitar 360 px sampai 430 px.
- Tombol harus cukup besar untuk sentuhan jari.
- Navigasi utama berada di bawah.
- Interaksi penting harus bisa dipakai satu tangan.
- Mode instalasi aplikasi ke home screen harus didukung.

## 4. Pengguna Sasaran
Pengguna utama:
- Orang dewasa dengan kondisi diabetes, kolesterol tinggi, asam urat, atau obesitas.
- Pengguna yang sering makan di warteg, rumah makan Padang, atau tempat makan lokal.
- Pengguna yang ingin panduan cepat tanpa membaca informasi medis panjang.
- Pengguna yang ingin menyimpan riwayat makan secara privat di perangkatnya.

## 5. Proposition Nilai
Nilai utama Nutri Track adalah:
- Scan cepat makanan dan dapatkan kesimpulan risiko.
- Rekomendasi yang relevan dengan diagnosis medis.
- Rencana makan lokal yang tidak terasa asing.
- Semua data utama bisa berjalan lokal terlebih dahulu.
- Tampilan yang tenang, bersih, dan terasa seperti aplikasi kesehatan premium.

## 6. Tone and Personality
Aplikasi harus terasa:
- Cerdas tetapi tidak rumit.
- Medis tetapi tetap ramah.
- Modern tetapi tidak dingin.
- Lokal Indonesia dan kontekstual terhadap kebiasaan makan pengguna.
- Meyakinkan, informatif, dan praktis.

## 7. Arah Visual
### 7.1 Prinsip Visual
Gaya visual proyek ini adalah:
- Bersih, putih, dan ringan.
- Banyak ruang kosong.
- Kartu berlapis dengan efek glassmorphism lembut.
- Aksen merah sebagai warna peringatan dan fokus utama.
- Hijau untuk aman, kuning untuk hati-hati, merah untuk risiko tinggi.
- Typography modern dan tegas.

### 7.2 Palet Warna
Warna yang terlihat dominan pada implementasi saat ini:
- Putih dan abu-abu sangat muda sebagai latar utama.
- Slate untuk teks utama dan elemen netral.
- Merah aksen utama: `#eb4d4b`.
- Hijau untuk status aman.
- Kuning/amber untuk status waspada.
- Merah/rose untuk kondisi berisiko tinggi.

Rekomendasi sistem warna untuk replikasi:
- Background utama: putih atau abu-abu sangat terang.
- Surface kartu: putih dengan transparansi ringan.
- Primary action: merah aksen.
- Success: hijau emerald.
- Warning: amber.
- Danger: merah.
- Border: slate muda dengan opacity rendah.

### 7.3 Tipografi
Sistem huruf yang digunakan:
- Sans utama: Inter.
- Display heading: Plus Jakarta Sans.
- Mono: JetBrains Mono.

Aturan pemakaian:
- Heading memakai font display agar terasa lebih premium.
- Label kecil, status, dan timestamp memakai mono atau uppercase tracking lebar.
- Body text memakai Inter agar mudah dibaca di mobile.

### 7.4 Bentuk dan Radius
Karakter bentuk yang dominan:
- Sudut membulat kuat pada kartu dan tombol.
- Radius besar untuk komponen utama seperti 24 px sampai 32 px.
- Chip/pill untuk status dan filter.
- Tombol bulat untuk aksi kecil dan checklist.

### 7.5 Efek dan Atmosfer
Efek yang dipakai:
- Glass blur ringan pada kartu.
- Bayangan lembut.
- Gradient tipis pada beberapa hero card.
- Animasi halus pada loading, splash, dan transisi tab.

## 8. Layout Dasar
### 8.1 Struktur Layar
Aplikasi ini memakai struktur seperti smartphone di dalam desktop preview:
- Frame perangkat pada desktop.
- Header atas yang sticky.
- Area konten yang bisa di-scroll.
- Navigation bar bawah tetap.

### 8.2 Layout Mobile
Layout mobile mengikuti pola:
- Full height.
- Header singkat di atas.
- Konten di tengah dengan padding horizontal kecil.
- Bottom navigation tetap terlihat.
- Content area scroll tanpa scrollbar yang terlihat.

### 8.3 Hirarki Informasi
Prioritas informasi visual:
1. Status atau risiko makanan.
2. Tindakan utama seperti scan, simpan, atau ganti menu.
3. Diagnosis aktif dan target medis.
4. Riwayat dan tren.
5. Detail pendukung seperti XAI, makro, dan catatan.

## 9. Struktur Navigasi
Navigasi utama terdiri dari lima tab:
- Beranda.
- Grafik Tren.
- Scan Gizi.
- Planner.
- Profil.

Ciri navigasi:
- Scan Gizi ditaruh paling menonjol di tengah.
- Tab aktif diberi warna merah aksen dan penanda underline kecil.
- Tab nonaktif menggunakan abu-abu lembut.

## 10. Alur Aplikasi
### 10.1 Alur Utama
Urutan alur aplikasi:
1. Splash screen.
2. Onboarding 3 langkah.
3. Login atau register.
4. Masuk ke layar utama.
5. Pengguna scan makanan atau melihat beranda.
6. Riwayat, grafik, planner, dan profil dapat diakses lewat navigasi bawah.

### 10.2 Splash Screen
Tujuan:
- Memberi identitas aplikasi.
- Menampilkan slogan singkat.
- Menjalankan transisi masuk yang lembut.

Komponen:
- Logo utama.
- Judul singkat.
- Deskripsi singkat.
- Dots animasi.
- Tombol lewati.

### 10.3 Onboarding
Onboarding berisi 3 layar:
- Deteksi gizi cepat dari foto makanan.
- Personalisasi berdasarkan diagnosis medis.
- Rekomendasi menu alternatif yang lebih bijak.

Setiap langkah menampilkan:
- Ilustrasi gambar.
- Judul.
- Subtitle.
- Deskripsi singkat.
- Tombol lanjut.
- Tombol kembali pada langkah kedua dan ketiga.

### 10.4 Login dan Register
Login/register memakai tab terpisah:
- Login sederhana dengan username dan password.
- Register bertahap 3 langkah.
- Langkah 1: identitas akun.
- Langkah 2: alergi.
- Langkah 3: diagnosis medis.

Karakter form:
- Input rounded.
- Label kecil tebal.
- Feedback error dan success yang jelas.
- CTA merah sebagai aksi utama.

## 11. Spesifikasi Layar
### 11.1 Home
Fungsi layar Home:
- Menyapa pengguna sesuai waktu.
- Menampilkan ringkasan kalori harian.
- Menampilkan checklist sarapan, siang, malam.
- Menampilkan rekomendasi menu lokal sesuai diagnosis.
- Menampilkan warning medis singkat.

Isi utama:
- Hero greeting card.
- Progress kalori dan makro.
- Checklist meal slot.
- Rekomendasi makanan.
- Notice proteksi medis.

### 11.2 Scan Gizi
Fungsi layar Scan:
- Mengunggah foto makanan dari kamera atau galeri.
- Memicu analisis makanan.
- Menampilkan status risiko.
- Menampilkan makro, bahan terdeteksi, dan XAI.
- Menyimpan hasil ke riwayat.

Isi utama:
- Badge diagnosis aktif.
- Area upload foto.
- Loading state analisis.
- Hasil scan dalam kartu terstruktur.
- Mini history widget.

### 11.3 Dashboard / Grafik Tren
Fungsi layar Dashboard:
- Menunjukkan tren menu aman vs berisiko.
- Menyajikan data 7 hari terakhir.
- Menampilkan kartu statistik ringkas.
- Menampilkan alternatif menu lokal berdasarkan diagnosis.

Isi utama:
- Scorecard total, aman, dan konsistensi.
- Grafik garis aman vs berisiko.
- Daftar swap menu lokal.

### 11.4 Planner
Fungsi layar Planner:
- Menyusun rencana makan mingguan.
- Menandai makanan yang sudah dimakan.
- Mengubah menu ke alternatif yang lebih aman.
- Menyimpan status planner ke storage lokal.

Isi utama:
- Skor diet mingguan.
- Pilihan hari dalam bentuk pill.
- Kartu sarapan, siang, malam.
- Modal untuk ganti menu.
- Reset ke default klinis.

### 11.5 Profil
Fungsi layar Profil:
- Mengelola data akun dan profil kesehatan.
- Mengubah diagnosis, target berat badan, obat rutin, alergi, email, dan nama.
- Menyimpan perubahan ke local storage.

Isi utama:
- Hero card profil.
- Form pengaturan medis.
- Toast sukses simpan.
- Kartu panduan singkat.

## 12. Komponen UI Utama
Komponen yang harus ada bila project direplikasi:
- App shell mobile.
- Header sticky.
- Bottom navigation.
- Glass card.
- Risk badge.
- Progress bar.
- Circular progress meter.
- Onboarding step bar.
- Tab switcher.
- File upload area.
- Result analysis card.
- History list.
- Chart container.
- Weekly planner card.
- Modal dialog.
- Confirm dialog.

## 13. Aturan Konten dan Microcopy
Gaya bahasa yang dipakai:
- Bahasa Indonesia.
- Nada akrab dan informatif.
- Istilah medis dijelaskan dengan bahasa sederhana.
- Label singkat dan jelas.
- Kalimat CTA ringkas.

Prinsip microcopy:
- Hindari bahasa terlalu teknis tanpa penjelasan.
- Gunakan istilah lokal seperti warteg, Padang, dan menu lokal lain.
- Beri penekanan pada keamanan dan alternatif yang realistis.

## 14. Sistem Status Risiko
Status yang wajib didukung:
- Aman.
- Hati-hati.
- Berisiko Tinggi.

Aturan tampilan:
- Aman memakai hijau.
- Hati-hati memakai amber.
- Berisiko Tinggi memakai merah.
- Semua status harus jelas di badge, progress, dan hasil analisis.

## 15. Data Model Lokal
Aplikasi harus local-first. Data awal disimpan di browser storage atau storage lokal perangkat sebelum ada sinkronisasi backend.

### 15.1 Key Storage yang Dipakai
Rekomendasi key yang ada pada implementasi sekarang:
- `nutri_track_current_user_v1`
- `nutri_track_onboarding_done_v2`
- `nutri_track_users_db_v1`
- `nutri_track_scans_v1`
- `nutri_track_diet_planner_v1`

### 15.2 Entitas Data
#### UserAccount
- username
- fullName
- password
- profile
- email
- allergies

#### HealthProfile
- diagnosis
- targetWeight
- routineMedication

#### ScanHistoryItem
- id
- food_name
- detected_ingredients
- risk_status
- risk_score
- xai_explanation
- alternative_suggestion
- calories_est
- carbs_est
- protein_est
- fat_est
- timestamp
- imageUrl

#### DietPlanDay
- day
- pagi
- siang
- malam

#### PlanMeal
- name
- isAman
- isEaten

## 16. Local-First Behavior
Saat aplikasi dibuka:
- Splash dan onboarding dibaca dari storage lokal.
- Akun aktif dibaca dari storage lokal.
- Riwayat scan dibaca dari storage lokal.
- Planner mingguan dibaca dari storage lokal.
- Profil user di-update langsung di storage lokal.

Perilaku yang harus dipertahankan:
- Jika local storage kosong, aplikasi harus tetap bisa jalan dengan default seed data.
- Jika user login/register, sesi tersimpan lokal.
- Jika user mengubah profil, data akun dan profil harus ikut tersimpan.
- Jika user memindai makanan, hasil scan harus masuk riwayat lokal.
- Jika user menandai menu planner, data planner harus tetap ada setelah reload.

## 17. Android-First Requirement
Jika tujuan akhirnya adalah aplikasi Android, maka desain dan implementasi harus memenuhi:
- Mobile-first layout.
- Splash yang terasa seperti app native.
- PWA manifest aktif.
- Support install to home screen.
- Ikon aplikasi 192 dan 512.
- Camera permission request.
- UX one-hand friendly.

Jika ingin menghasilkan APK asli, gunakan tahap berikut setelah PWA stabil:
- Bungkus web app dengan Capacitor.
- Pertahankan local-first storage sebagai sumber data utama.
- Sinkronisasi backend menjadi opsional, bukan keharusan.

## 18. Alur Data Scan
Saat user mengunggah foto makanan:
1. Gambar dibaca dari kamera atau file input.
2. Gambar dikirim ke endpoint analisis.
3. Sistem mengembalikan nama makanan, bahan, status risiko, skor, penjelasan, alternatif, dan estimasi makro.
4. Hasil ditampilkan di kartu hasil.
5. User dapat menyimpan hasil ke riwayat.
6. Riwayat tersimpan lokal.

## 19. Alur Data Planner
Saat user menandai makanan dimakan:
1. Status meal slot diubah.
2. Data planner diperbarui.
3. Item sinkron ke riwayat bila perlu.
4. Persentase harian dan grafik ikut terupdate.
5. Data disimpan di storage lokal.

## 20. Alur Data Profil
Saat user memperbarui profil:
1. Form disubmit.
2. Profil aktif diperbarui.
3. Sesi user diperbarui.
4. Database akun lokal ikut disinkronkan.
5. Tampilan lain membaca profil baru otomatis.

## 21. Backend dan AI
Implementasi saat ini menggunakan server Node/Express sebagai lapisan API.

Fungsi server:
- Menyediakan endpoint scan makanan.
- Mengirim prompt dan schema ke Gemini.
- Mengembalikan JSON terstruktur.
- Menyediakan fallback simulasi bila API key belum tersedia.

Catatan produk:
- Jika target utama adalah local-first dan Android, backend AI boleh dianggap tahap berikutnya.
- Sistem tetap harus bisa berjalan tanpa data eksternal untuk mode demo atau offline terbatas.

## 22. PWA dan Instalasi
Karakter aplikasi harus mendukung:
- Manifest PWA.
- Ikon aplikasi.
- Display standalone.
- Background putih.
- Theme color putih.
- Register service worker.

Tujuannya agar aplikasi terasa seperti app Android walaupun dibangun dengan web stack.

## 23. Animasi dan Interaksi
Animasi yang digunakan sebaiknya ringan dan fungsional:
- Splash dot pulse.
- Transisi tab halus.
- Loading spinner saat scan.
- Progress bar yang bergerak.
- Success toast.
- Modal fade in.

Aturan animasi:
- Jangan berlebihan.
- Fokus pada penegasan state, bukan dekorasi.

## 24. Non-Functional Requirements
### 24.1 Performance
- Konten utama harus terasa cepat di mobile.
- Scroll harus halus.
- Gambar harus terkompresi dan tidak menghambat rendering.

### 24.2 Reliability
- Aplikasi tetap bisa digunakan jika storage kosong.
- Error scan harus tampil jelas.
- Data local storage yang gagal dibaca harus ditangani tanpa crash.

### 24.3 Privacy
- Data medis disimpan lokal terlebih dahulu.
- Tidak ada ketergantungan wajib pada akun cloud untuk penggunaan dasar.
- Riwayat dan profil adalah data sensitif, sehingga local-first adalah prioritas.

### 24.4 Accessibility
- Ukuran tombol cukup besar.
- Kontras teks dan latar harus jelas.
- Label form harus eksplisit.
- Tidak hanya mengandalkan warna untuk status.

## 25. Acceptance Criteria
Project dianggap berhasil bila:
- Tampilan mengikuti karakter visual white, glass, slate, dan aksen merah.
- Ada alur splash, onboarding, login/register, dan layar utama.
- Navigasi bawah berisi Home, Dashboard, Scan, Planner, dan Profil.
- Scan makanan menghasilkan hasil terstruktur.
- Riwayat, profil, dan planner tersimpan lokal.
- Aplikasi bisa diinstall sebagai PWA dan terasa seperti Android app.
- Orang lain dapat membangun ulang project serupa hanya dengan dokumen ini.

## 26. Rekomendasi Implementasi Replikasi
Kalau ingin membangun ulang proyek ini dari nol, urutan implementasi yang disarankan:
1. Buat shell aplikasi mobile dengan layout seperti phone frame.
2. Implementasikan tema visual dan typography.
3. Bangun splash dan onboarding.
4. Tambahkan login/register local-first.
5. Buat home dashboard dan planner.
6. Tambahkan scan flow dan history.
7. Tambahkan profile editor.
8. Aktifkan PWA installability.
9. Baru tambahkan backend AI bila diperlukan.

## 27. Catatan Referensi Produk
Dokumen ini didasarkan pada implementasi Nutri Track yang ada saat ini, dengan karakter utama:
- Mobile-first.
- Local-first.
- AI-assisted.
- Relevan untuk makanan lokal Indonesia.
- Cocok sebagai dasar aplikasi Android berbasis PWA.

---

Dokumen ini sengaja ditulis agar pihak lain dapat meniru struktur, rasa visual, dan pola interaksi Nutri Track tanpa harus membuka source code asli satu per satu.

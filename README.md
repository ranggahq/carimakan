# CariMakan - Platform Food Discovery Lengkap & Profesional

Selamat datang di **CariMakan**, sebuah aplikasi pencarian kuliner (Food Discovery) berskala industri yang dinamis, andal, dan siap rilis ke lingkungan produksi (*production ready*). Sistem dibangun menggunakan **React.js** pada sisi Frontend, dan **Express.js (Node.js)** di sisi Backend (*Full-stack architecture*). Pengolahan bahan baku menu makanan diperoleh secara real-time dari basis data kuliner luar negeri **TheMealDB** melalui proxy server-side yang aman.

Aplikasi ini dirancang dengan kriteria **Clean Architecture**, pola **MVC**, pemisahan layer layanan (*Service Layer Pattern*), pemanfaatan komponen yang dapat digunakan kembali (*Reusable Components*), penanganan error terperinci, state memuat (*loading state*), state kosong (*empty state*), serta pengelolaan keranjang belanja belanja dengan sinkronisasi basis data di server.

---

## DAFTAR ISI

1. [Ringkasan Proyek](#1-ringkasan-proyek)
2. [Analisis Kebutuhan Sistem](#2-analisis-kebutuhan-sistem)
3. [Identifikasi Aktor](#3-identifikasi-aktor)
4. [Identifikasi Fitur](#4-identifikasi-fitur)
5. [Functional \& Non-Functional Requirements](#5-functional--non-functional-requirements)
6. [Use Case Diagram (Teks)](#6-use-case-diagram-teks)
7. [Activity Diagram (Teks)](#7-activity-diagram-teks)
8. [ERD & Desain Database](#8-erd--desain-database)
9. [Desain REST API](#9-desain-rest-api)
10. [Struktur Folder & Deskripsi Fail](#10-struktur-folder--deskripsi-fail)
11. [Desain UI/UX & Alur Navigasi](#11-desain-uiux--alur-navigasi)
12. [Arsitektur Deployment dan Dokumen Konfigurasi](#12-arsitektur-deployment-dan-dokumen-konfigurasi)
13. [Petunjuk Menjalankan Aplikasi](#13-petunjuk-menjalankan-aplikasi)

---

## 1. RINGKASAN PROYEK

Aplikasi **CariMakan** bertujuan untuk memudahkan pecinta kuliner mengeksplorasi ribuan menu makanan global langsung melalui antarmuka bahasa Indonesia yang intuitif dan cepat. Dengan memanfaatkan standardisasi komponen React, aplikasi mendukung kestabilan performa (*scalability*), keterbacaan kode (*readability*), dan fungsionalitas keranjang belanja belanja terintegrasi. Backend bertindak sebagai proxy aman yang menyembunyikan API eksternal dan menjaga agar API keys tetap terisolasi dari browser, sekaligus mengelola basis data persisten lokal untuk menyimpan item keranjang belanja belanja pengguna secara aman.

---

## 2. ANALISIS KEBUTUHAN SISTEM

Sistem membutuhkan integrasi yang erat antara komponen visual yang reaktif dan backend yang cepat. Diperlukan penanganan status asynchronous, caching transien yang ramah performa, dan validasi data yang ketat. 

*   **Sisi Klien (Frontend)**: Harus reaktif saat mengetik kueri pencarian, menerapkan teknik pembatasan pemanggilan API (*Debouncing*), menampilkan animasi halus pada transisi halaman dan interaksi, serta secara berkala menyinkronkan status keranjang belanja belanja dengan backend.
*   **Sisi Server (Backend)**: Berfungsi sebagai router API utama yang memproses kueri pencarian dari browser, melakukan pemetaan data instan (*mapping/transforming*) dari struktur data TheMealDB, dan mengelola database file JSON untuk menjaga item keranjang belanja belanja tetap awet (*durable*) selama sesi berjalan.

---

## 3. IDENTIFIKASI AKTOR

1.  **Pengamat/Pengunjung (Guest User)**:
    *   Mengeksplorasi rekomendasi menu populer hari ini.
    *   Melakukan pencarian menu makanan berdasarkan kata kunci.
    *   Melihat detail lengkap resep masakan, kategori makanan, asal negara, dan bahan-bahan pendukung.
2.  **Pelanggan Aktif (Shopping User)**:
    *   Melakukan semua aktivitas Pengamat.
    *   Menambahkan menu ke keranjang belanja belanja dengan pilihan jumlah porsi (*Portions*).
    *   Mengatur porsi atau menghapus item dari dalam keranjang belanja belanja.
    *   Mengosongkan isi keranjang belanja belanja.
    *   Memproses transaksi pemesanan makanan (*checkout*).

---

## 4. IDENTIFIKASI FITUR

*   **Fitur Pencarian Debounced**: Melakukan lookup otomatis saat pengguna mengetik kata kunci pada *SearchBar* tanpa membebani server dengan panggilan API berlebih.
*   **Bento Food Grid**: Menyajikan daftar menu dalam formasi grid yang responsif, lengkap dengan kategori, negara asal, dan harga perkiraan dalam format rupiah.
*   **Detail Kuliner Komprehensif**: Menampilkan foto resolusi tinggi, ringkasan komposisi bahan dengan ukuran takaran, instruksi langkah-demi-langkah, dan video tutorial memasak di YouTube (jika tersedia).
*   **Keranjang Belanja Tersinkronisasi**: Menghitung secara real-time total barang belanja, harga gabungan, potongan kupon hemat, dan update kuantitas di tab header.
*   **Simulated Checkout System**: Menjalankan simulasi pembayaran aman di backend dengan respons kesuksesan visual yang mengesankan.

---

## 5. FUNCTIONAL & NON-FUNCTIONAL REQUIREMENTS

### Functional Requirements
*   **FR-01**: Mengambil resep makanan acak/populer secara default jika pengguna tidak memasukkan kata kunci pencarian.
*   **FR-02**: Melakukan filter daftar makanan di backend berdasarkan kueri pengguna (`GET /api/meals/search?q=`).
*   **FR-03**: Menampilkan spesifikasi resep, takaran bahan, dan video tutorial berdasarkan ID makanan unik (`GET /api/meals/:id`).
*   **FR-04**: Menambahkan item makanan baru ke keranjang belanja atau menambah jumlah kuantitas jika item sejenis sudah ada (`POST /api/cart`).
*   **FR-05**: Mengambil seluruh makanan terpilih dari keranjang belanja persisten (`GET /api/cart`).
*   **FR-06**: Menghapus item tertentu dari keranjang belanja berdasarkan ID unik (`DELETE /api/cart/:id`).
*   **FR-07**: Mengosongkan keranjang belanja secara menyeluruh (`DELETE /api/cart`).

### Non-Functional Requirements
*   **NFR-01 (Kinerja)**: Respons API proxy harus disajikan di bawah 500ms dalam kondisi jaringan normal.
*   **NFR-02 (Responsivitas)**: UI harus *full-responsive* dan berjalan dengan lancar tanpa pecah pada Android, iPhone, Tablet, Laptop, serta Desktop.
*   **NFR-03 (Desain Visual)**: Menerapkan skema warna modern berwibawa berwarna jingga (*orange marketing design vibe*) dipadukan latar belakng off-white bersih dan tipografi berkelas dari *Inter* & *JetBrains Mono*.
*   **NFR-04 (Keamanan)**: Backend bertindak sebagai tameng API eksternal, melarang browser mengakses TheMealDB secara langsung demi mematuhi standardisasi keamanan korporat.

---

## 6. USE CASE DIAGRAM (TEKS)

```
========================================================================
                      USE CASE DIAGRAM: CARIMAKAN APP
========================================================================

   +-----------------+.
   |  Pengunjung /   |
   | Pelanggan Aktif |
   +--------+--------+
            |
            +-------------> [ UC-01: Melihat Beranda & Daftar Rekomendasi ]
            |
            +-------------> [ UC-02: Mencari Makanan via SearchBar (Debounced) ]
            |
            +-------------> [ UC-03: Melihat Detail Makanan & Resep Masak ]
            |
            +-------------> [ UC-04: Menambahkan Menu Makanan ke Keranjang ]
            |
            +-------------> [ UC-05: Mengatur Porsi & Menghapus Item Keranjang ]
            |
            +-------------> [ UC-06: Mengosongkan Seluruh Isi Keranjang ]
            |
            +-------------> [ UC-07: Selesaikan Pemesanan (Checkout Simulation) ]

========================================================================
```

---

## 7. ACTIVITY DIAGRAM (TEKS)

Alur aktivitas pengguna mencari makanan, memasukkan ke keranjang, dan melakukan pembelian:

```
[Masyarakat/User] ──> Buka Aplikasi CariMakan 
                          │
                          ▼
               Tampilkan Beranda Utama 
               (Mengambil default menu via GET /api/meals)
                          │
         ┌────────────────┴────────────────┐
         ▼                                 ▼
   Ketik Kata Kunci                 Klik Menu Makanan
   (Pencarian Debounced)            (Ambil Detail via GET /api/meals/:id)
         │                                 │
         ▼                                 ▼
   Tampilkan Hasil                 Tampilkan Spesifikasi Menu, 
   (GET /api/meals/search?q=)      Bahan-Bahan, & Langkah Memasak
         │                                 │
         │                                 ▼
         │                         Atur Jumlah Porsi (Quantity)
         │                                 │
         ▼                                 ▼
   Pilih "Pesan Sekarang" ───────> Klik "Tambah ke Keranjang"
                                           │
                                           ▼
                                 Simpan di Backend DB (POST /api/cart)
                                           │
                                           ▼
                                   Buka Halaman Keranjang
                                           │
                                           ▼
                                 Atur atau Hapus Item jika Ada
                                           │
                                           ▼
                                 Klik "Selesaikan Pemesanan"
                                           │
                                           ▼
                                 Simulasi Checkout Berhasil
                                 (Database Cart dikosongkan & Kembali ke Home)
```

---

## 8. ERD & DESAIN DATABASE

### Mengapa menggunakan Database File JSON daripada Akses Langsung API Eksternal?
1.  **Isolasi API**: Menyembunyikan tautan eksternal ke TheMealDB dari end-user (client) demi keamanan data dan audit kepatuhan.
2.  **Persistensi Durabel Tanpa Overhead**: Menyimpan item keranjang belanja belanja secara persisten pada disk server, sehingga jika browser pengguna mengalami pengosongan cache (*clearing cache*), data pesanan belanja mereka tidak akan hilang.
3.  **Kemandirian Portbilitas**: Menggunakan file JSON asinkron yang aman menghindari dependensi pengemasan native SQL (seperti sqlite3 yang rentan rusak di container Cloud virtual), namun tetap memberikan performa baca-tulis luar biasa cepat untuk data keranjang berstruktur ringan.

### Skema Struktur Tabel Database (Logis)

#### Tabel: `meals` (Representasi API)
| Nama Kolom | Tipe Data | Kunci | Keterangan |
| :--- | :--- | :--- | :--- |
| `id` | VARCHAR(50) | PK | ID unik makanan dari TheMealDB (strIdMeal) |
| `name` | VARCHAR(255) | - | Nama resep makanan (strMeal) |
| `category` | VARCHAR(100) | - | Kategori makanan (strCategory) |
| `area` | VARCHAR(100) | - | Negara asal hidangan (strArea) |
| `instructions` | TEXT | - | Langkah-langkah memasak (strInstructions) |
| `thumbnail` | TEXT | - | Tautan URL gambar makanan (strMealThumb) |
| `youtube` | TEXT | - | Tautan video memasak YouTube (strYoutube) |

#### Tabel: `cart_items` (Persisten di Server via JSON)
| Nama Kolom | Tipe Data | Kunci | Keterangan |
| :--- | :--- | :--- | :--- |
| `id` | VARCHAR(50) | PK | Menggunakan ID makanan (mealId) sebagai identifier unik dalam keranjang |
| `mealId` | VARCHAR(50) | FK | Relasi merujuk ke tabel Makanan |
| `name` | VARCHAR(255) | - | Nama menu makanan untuk rujukan instan |
| `thumbnail` | TEXT | - | Thumbnail gambar makanan untuk efisiensi render |
| `category` | VARCHAR(100) | - | Kategori menu makanan |
| `area` | VARCHAR(100) | - | Asal wilayah kuliner makanan |
| `quantity` | INTEGER | - | Jumlah porsi yang dipesan oleh pengguna (min: 1) |
| `price` | INTEGER | - | Penetapan harga rupiah stabil berdasarkan mealId |

---

## 9. DESAIN REST API

Seluruh komunikasi antara Frontend (React) dan Backend (Express) diatur melalui endpoint standar industri berikut:

| No | Metode | Endpoint | Query / Body Parameters | Keterangan |
| :--- | :--- | :--- | :--- | :--- |
| 1 | **GET** | `/api/meals` | - | Mengambil 25 rekomendasi makanan populer hari ini. |
| 2 | **GET** | `/api/meals/search` | `?q={query}` | Mencari menu makanan berdasarkan kata kunci pencarian. |
| 3 | **GET** | `/api/meals/:id` | - | Membaca detail makanan komprehensif berdasarkan ID unik. |
| 4 | **GET** | `/api/cart` | - | Memperoleh daftar barang belanja yang tersimpan di keranjang. |
| 5 | **POST** | `/api/cart` | `{ mealId, name, thumbnail, category, area, quantity }` | Menambahkan menu makanan atau menambah porsi ke dalam keranjang. |
| 6 | **DELETE**| `/api/cart/:id` | - | Menghapus item makanan tertentu dari keranjang belanja. |
| 7 | **DELETE**| `/api/cart` | - | Mengosongkan keranjang belanja secara menyeluruh (untuk tombol bersihkan & checkout). |

---

## 10. STRUKTUR FOLDER & DESKRIPSI FAIL

Berikut adalah bagan struktur folder lengkap yang rapi dan terorganisir sesuai kaidah Clean Architecture:

```
/
├── .env.example                # Dokumentasi variabel lingkungan (Port, APP_URL, dll.)
├── .gitignore                  # Berkas instruksi pengabaian unggahan log/dist ke Git
├── index.html                  # Berkas masuk HTML utama untuk SPA browser
├── metadata.json               # Berkas metadata sistem (nama aplikasi & izin)
├── package.json                # Pusat konfigurasi instalasi modul & npm scripts
├── server.ts                   # Berkas server backend Express & integrasi routing utama
├── tsconfig.json               # Konfigurasi TypeScript compiler
├── vite.config.ts              # Konfigurasi bundler build aset frontend oleh Vite
├── data/
│   └── cart.json               # File database persisten lokal penyimpan data keranjang
├── src/
│   ├── App.tsx                 # Poin masuk komponen React, Routing, & Provider utama
│   ├── main.tsx                # Berkas bootsraping React untuk me-mounting ke DOM index.html
│   ├── index.css               # Pusat stylesheet global Tailwind CSS & deklarasi font
│   ├── types.ts                # Deklarasi tipe TypeScript terpadu (Meal, CartItem, dll.)
│   ├── utils.ts                # Logika utilitas (Format Rupiah & kalkulator harga rupiah)
│   ├── components/             # Kumpulan reusable react components
│   │   ├── Header.tsx          # Baris navigasi atas, dengan logo dan keranjang badge
│   │   ├── Footer.tsx          # Baris informasi hak cipta dan deskripsi aplikasi bawah
│   │   ├── SearchBar.tsx       # Komponen pencari makanan responsif
│   │   └── FoodCard.tsx        # Blueprint kartu makanan interaktif bertenaga animasi
│   ├── context/                # Pengelolaan global state manager
│   │   ├── AuthContext.tsx     # Context API untuk melayani status autentikasi aktif
│   │   └── CartContext.tsx     # Context API untuk sinkronisasi antarmuka keranjang
│   ├── data/                   # File mock data statis
│   │   └── mockUsers.ts        # Kumpulan data akun demo terstruktur (Admin & User)
│   ├── db/                     # Lapisan manipulasi database
│   │   └── cartDb.ts           # Helper CRUD asinkron membaca/menulis ke data/cart.json
│   ├── services/               # Penanganan fungsionalitas dan logika bisnis eksternal
│   │   └── authService.ts      # Layanan Autentikasi (login, register, session, dll.)
│   ├── pages/                  # Halaman tampilan alur navigasi SPA
│   │   ├── Landing.tsx         # Halaman penyambutan awal (promo, fitur utama, & panduan penggunaan)
│   │   ├── Login.tsx           # Halaman masuk kredensial terpadu
│   │   ├── Register.tsx        # Halaman pendaftaran akun user mandiri
│   │   ├── Home.tsx            # Halaman beranda utama dengan grid menu makanan lengkap
│   │   ├── FoodDetail.tsx      # Tampilan detail bahan, porsi, video, dan instruksi masak
│   │   └── Cart.tsx            # Halaman keranjang belanja dengan rincian biaya & promo
```

---

## 11. DESAIN UI/UX & ALUR NAVIGASI

### Alur Navigasi
1.  **Halaman Beranda (`/`)**:
    *   Pengguna dihadapkan pada spanduk Hero "CariMakan" nan mewah.
    *   Di bagian atas terpampang *SearchBar*. Mengetik "Chicken" akan langsung menyaring grid di bawah dalam hitungan milidetik secara asinkron.
    *   Setiap kartu makanan (*FoodCard*) menampilkan visual menarik, kategori, harga rupiah, tombol penjelajahan detail, serta tombol cepat memesan makanan.
2.  **Halaman Detail Makanan (`/detail/:id`)**:
    *   Menampilkan visualisasi makanan secara memukau dalam frame modular bento.
    *   Di sisi kanan menyajikan lencana kategori, lencana negara asal, list bahan masakan secara rapi, rincian instruksi langkah demi langkah, dan sebuah tombol video YouTube.
    *   Pengguna dapat menaikkan porsi belanja menggunakan selector porsi asinkron lalu mengklik "Tambah ke Keranjang".
3.  **Halaman Keranjang Belanja (`/cart`)**:
    *   Menampilkan daftar item kuantitas pesanan Anda secara mendalam.
    *   Memungkinkan Anda menghapus item, memperlihatkan rincian subtotal, biaya layanan (Gratis!), kode kupon hemat, dan tombol "Selesaikan Pemesanan" yang interaktif.

---

## 12. ARSITEKTUR DEPLOYMENT DAN DOKUMEN KONFIGURASI

Sistem ini didesain sepenuhnya agar siap di-deploy secara instan ke platform cloud modern, seperti **Railway**, **Vercel**, atau **Heroku** dengan mengikuti standar kontainerisasi terpadu.

*   **Proses Build**: Berjalan di lingkungan produksi aman dengan menjalankan perintah `npm run build`. Proses ini secara sekuensial akan meluncurkan Vite untuk mem-bundle aplikasi web statis klien ke folder `/dist`, dilanjutkan dengan `esbuild` yang mengompilasi fail TypeScript server backend `/server.ts` menjadi satu berkas mandiri CommonJS `/dist/server.cjs`.
*   **Proses Start**: Cloud Run atau Container Railway akan mengeksekusi script startup yang ditunjuk: `npm run start` (menjalankan `node dist/server.cjs`). Berkas gabungan ini secara cerdas bertindak melayani API routers di bawah `/api/*` dan sekaligus menyajikan fail frontend di rute wildcard `*` agar terhindar dari kendala routing SPA 404.

---

## 13. PETUNJUK MENJALANKAN APLIKASI

### Variabel Lingkungan (.env)
Buat berkas `.env` di direktori utama Anda (sudah dicontohkan di `.env.example`):
```env
# Port default aplikasi berjalan
PORT=3000

# URL dasar aplikasi
APP_URL="http://localhost:3000"
```

### Langkah Menjalankan di Lingkungan Lokal (Development)

1.  **Lakukan Clening & Bersihkan Cache (Opsional)**:
    ```bash
    npm run clean
    ```
2.  **Jalankan Server Development-Full stack**:
    ```bash
    npm run dev
    ```
    Aplikasi akan berjalan di alamat `http://localhost:3000`. Anda bisa membuka tab browser Anda untuk langsung berselancar mencari makanan nikmat!

### Langkah Menjalankan untuk Uji Coba Produksi (Production Build)

1.  **Lompati Pengompilan & Kompilasi Kode**:
    ```bash
    npm run build
    ```
2.  **Jalankan Hasil Kompilasi Server**:
    ```bash
    npm run start
    ```
    Melalui perintah ini, basis data lokal `/data/cart.json` akan dibuat otomatis secara dinamis, dan aplikasi berjalan dengan efisiensi tinggi serta konsumsi memori minimum.

---

---

## Akun Demo

Aplikasi ini menggunakan akun demo berikut untuk memudahkan proses pengujian dan presentasi:

### Admin
* **Email**: admin@carimakan.id
* **Password**: admin123
* **Role**: Admin (Dapat mengakses Dashboard Admin)

### User
* **Email**: user@carimakan.id
* **Password**: user123
* **Role**: User (Dapat mengakses fitur Cari Makanan, Detail Resep, Favorit, Keranjang, dll.)

---

Dibuat dengan dedikasi penuh untuk **CariMakan App** sebagai percontohan perangkat lunak modern andal, terstruktur rapi, elegan secara UI/UX, dan aman untuk pengoperasian bisnis kuliner digital Anda!

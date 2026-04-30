# 📢 LaporYu - Platform Pelaporan Warga Modern

**LaporYu** adalah platform aspirasi dan pelaporan warga berbasis web yang dirancang dengan antarmuka modern, interaktif, dan responsif. Memungkinkan warga untuk melaporkan masalah infrastruktur, layanan publik, hingga kebersihan secara real-time langsung ke instansi pemerintah terkait.

---

## 🚀 Fitur Utama
- **Pelaporan Visual**: Unggah foto kejadian dan lokasi otomatis (Geolocation).
- **Interaksi Sosial**: Warga bisa saling follow, upvote laporan, dan berdiskusi di kolom komentar.
- **Dasbor Instansi (Admin)**: Manajemen laporan per wilayah (Pemkot) dengan pelacakan status (Baru, Diproses, Selesai).
- **Messaging System**: Fitur chat antara warga dan instansi pemerintah.
- **Modern UI/UX**: Dibuat dengan React, Tailwind CSS, dan animasi Framer Motion yang premium.

---

## 🛠️ Tech Stack
- **Frontend**: React (Vite), TypeScript, Tailwind CSS, TanStack Query, Zustand, Lucide Icons.
- **Backend**: Laravel 11, PHP 8.2+, MySQL, Laravel Sanctum (Auth).

---

## 📦 Panduan Instalasi

Pastikan Anda sudah menginstal **PHP (8.2+)**, **Composer**, **Node.js**, dan **MySQL** di komputer Anda.

### 1. Persiapan Backend (Laravel)
```bash
# Pindah ke direktori backend
cd backend

# Instal dependensi PHP
composer install

# Salin file environment
cp .env.example .env

# Generate aplikasi key
php artisan key:generate

# Konfigurasi Database di file .env
# DB_DATABASE=laporyu
# DB_USERNAME=root
# DB_PASSWORD=

# Jalankan migrasi dan seeding data awal
php artisan migrate --seed

# Jalankan server backend
php artisan serve
```

### 2. Persiapan Frontend (React/Vite)
```bash
# Buka terminal baru, pindah ke direktori frontend
cd frontend

# Instal dependensi Node.js
npm install

# Jalankan server development
npm run dev
```

---

## 🔑 Akun Uji Coba (Testing)

Gunakan akun berikut untuk mencoba fitur di platform:

### **A. Akun Warga (User)**
- **Email**: `test@example.com`
- **Password**: `password` (Default dari factory)

### **B. Akun Admin (Pemkot Jakarta)**
- **Email**: `pemkot.jakarta@laporyu.id`
- **Password**: `password123`

---

## 📸 Struktur Folder
- `/frontend`: Aplikasi React (Client-side)
- `/backend`: API Laravel (Server-side)

---

## 🤝 Kontribusi
Dibuat dengan ❤️ untuk layanan publik yang lebih baik.

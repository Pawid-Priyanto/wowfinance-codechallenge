# 📱 Pokémon Explorer

> **React Native Mobile App Assessment** > Aplikasi penjelajah Pokémon yang dibangun dengan **React Native CLI (Bare Workflow)**. Project ini mendemonstrasikan implementasi autentikasi (Mock JWT), integrasi REST API, dan manajemen sesi otomatis.

---

## 🔐 Test Credentials (Dummy User)
Gunakan akun di bawah ini untuk menguji fitur Login:

| Field | Value |
| :--- | :--- |
| **Email** | `pawitanto27@gmail.com` |
| **Password** | `Password123!` |



---

## ✨ Fitur Utama
- **Mock JWT Authentication:** Simulasi pembuatan token Base64 dan penyimpanan sesi menggunakan `AsyncStorage`.
- **PokéAPI Integration:** Mengambil dan menampilkan daftar Pokémon secara real-time dari REST API.
- **Global Session Guard:** Pengecekan validitas token secara otomatis di level root aplikasi (App.tsx).
- **Auto-Logout System:** Aplikasi otomatis mendeteksi token expired dan mengarahkan user kembali ke halaman Login.
- **Theme Support:** Manajemen tema (Light/Dark) yang terintegrasi melalui Context API.

---

## 🛠 Tech Stack
* **Framework:** React Native CLI (v0.7x)
* **Navigation:** React Navigation (Native Stack)
* **Networking:** Axios
* **Storage:** AsyncStorage
* **Context:** ThemeContext API

---

## 📂 Project Architecture
Struktur folder yang digunakan dalam project ini:

```text
src/
 ┣ components/     # UI Elements (PokemonCard)
 ┣ context/        # Global State (ThemeContext)
 ┣ screens/        # Main Screens (Splash, Login, Home, Detail)
 ┗ App.tsx         # Root Entry Point, Navigation & Session Logic
```
 ### 🚀 Instalasi & Menjalankan App

#### 1. Setup
Clone repository dan install dependencies:

```bash
git clone <your-repo-url>
cd PokemonApp
npm install
```

#### 2. Jalankan di Emulator
```bash
# Terminal 1
npm start

# Terminal 2
npx react-native run-android  # Untuk Android
npx react-native run-ios      # Untuk iOS (Mac only)
```

#### 3. Build APK (Release)
Untuk mendapatkan file instalasi Android:

```bash
cd android
./gradlew assembleRelease
```
*Lokasi file:* `android/app/build/outputs/apk/release/app-release.apk`

---

### 📝 Catatan Implementasi (Key Highlights)

* **Security Logic:** Menggunakan `Buffer` untuk melakukan decode payload JWT (Base64) secara aman guna memvalidasi waktu kadaluarsa (`exp`).
* **DRY Principle:** Implementasi komponen `PokemonCard` yang *reusable* untuk efisiensi kode pada halaman Home dan Detail.
* **Performance:** Optimasi `FlatList` dengan *loading states* dan *pull-to-refresh* untuk memberikan pengalaman pengguna yang mulus saat memuat data dari API.

---
Built with ⚡️ for **Mobile Developer Assessment**.
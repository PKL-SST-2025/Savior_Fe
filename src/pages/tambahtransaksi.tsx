import { Component, createSignal } from 'solid-js';
import tambahTransaksiIcon from '../assets/tambah.png';
import riwayatIcon from '../assets/riwayat.png';
import dashboardIcon from '../assets/dashboard.png';
import budgetIcon from '../assets/budget.png';
import kategoriIcon from '../assets/kategori.png';
import statistikIcon from '../assets/statistik.png';
import profileIcon from '../assets/profile.png';

const TambahTransaksi: Component = () => {
  const [jumlah, setJumlah] = createSignal('');
  const [deskripsi, setDeskripsi] = createSignal('');
  const [kategori, setKategori] = createSignal('');
  const [tanggal, setTanggal] = createSignal('');
  const [bulan, setBulan] = createSignal('');
  const [tahun, setTahun] = createSignal('');
  const [foto, setFoto] = createSignal('');

  const handleSave = () => {
    const data = {
      jumlah: jumlah(),
      deskripsi: deskripsi(),
      kategori: kategori(),
      tanggal: `${tahun()}-${bulan()}-${tanggal()}`,
      foto: foto()
    };
    console.log('Data Tersimpan:', data);
    // Tambahkan logic submit ke backend di sini
  };

  return (
    <div class="flex flex-col md:flex-row min-h-screen bg-gray-100">
      {/* Sidebar */}
      <aside class="w-full md:w-60 bg-[#1b2b59] text-white flex flex-row md:flex-col items-center md:items-stretch shrink-0">
        <div class="p-4 md:p-6 text-xl font-bold w-full text-center md:text-left">Savior</div>
        <nav class="flex-1 w-full">
          <ul class="space-y-0 md:space-y-2 flex md:block w-full px-2 md:px-4 overflow-x-auto">
            <li class="py-2 rounded px-4 cursor-pointer whitespace-nowrap flex items-center gap-3 bg-blue-600">
              <img src={tambahTransaksiIcon} alt="Tambah Transaksi" class="w-5 h-5" />
              <a href="/TambahTransaksi">Tambah Transaksi</a>
            </li>
            <li class="py-2 rounded px-4 cursor-pointer whitespace-nowrap flex items-center gap-3 hover:bg-[#314574]">
              <img src={riwayatIcon} alt="Riwayat" class="w-5 h-5" />
              <a href="/History">Riwayat</a>
            </li>
            <li class="py-2 rounded px-4 cursor-pointer whitespace-nowrap flex items-center gap-3 hover:bg-[#314574]">
              <img src={dashboardIcon} alt="Dashboard" class="w-5 h-5" />
              <a href="/dashboard">Dashboard</a>
            </li>
            <li class="pt-6 text-sm text-gray-400 uppercase hidden md:block">Other Information</li>
            <li class="py-2 rounded px-4 cursor-pointer whitespace-nowrap flex items-center gap-3 hover:bg-[#314574]">
              <img src={budgetIcon} alt="Budget" class="w-5 h-5" />
              <a href="/Budget">Budget</a>
            </li>
            <li class="py-2 rounded px-4 cursor-pointer whitespace-nowrap flex items-center gap-3 hover:bg-[#314574]">
              <img src={kategoriIcon} alt="Kategori" class="w-5 h-5" />
              <a href="/Kategori">Kategori</a>
            </li>
            <li class="py-2 rounded px-4 cursor-pointer whitespace-nowrap flex items-center gap-3 hover:bg-[#314574]">
              <img src={statistikIcon} alt="Statistik" class="w-5 h-5" />
              <a href="/Statistik">Statistik</a>
            </li>
            <li class="pt-6 text-sm text-gray-400 uppercase hidden md:block">Settings</li>
            <li class="py-2 rounded px-4 cursor-pointer whitespace-nowrap flex items-center gap-3 hover:bg-[#314574]">
              <img src={profileIcon} alt="Profile" class="w-5 h-5" />
              <a href="/Profile">Profile</a>
            </li>
          </ul>
        </nav>
      </aside>

      {/* Main Content */}
      <div class="flex-1 flex flex-col min-h-screen">
        {/* Header */}
        <header class="flex flex-col md:flex-row items-center justify-between mb-6 bg-white px-4 md:px-8 py-2 shadow-sm h-auto md:h-16 gap-4">
          <div class="flex items-center gap-2"></div>
          <div class="flex items-center gap-4 w-full md:w-auto justify-end">
            <div class="relative w-full max-w-xs">
              <span class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-4-4m0 0A7 7 0 104 4a7 7 0 0013 13z" />
                </svg>
              </span>
              <input type="text" placeholder="Search" class="pl-10 pr-4 py-2 rounded-full bg-[#f6f7fb] text-gray-500 focus:outline-none w-full" />
            </div>
            <div class="relative">
              <button class="focus:outline-none">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-[#8b8fa7]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
                <span class="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full px-1.5 py-0.5 font-bold">9</span>
              </button>
            </div>
            <div class="w-8 h-8 rounded-full bg-blue-400 flex items-center justify-center text-white font-bold text-lg">N</div>
          </div>
        </header>

        {/* Main Form */}
        <main class="flex-1 p-2 md:p-10 overflow-auto">
          <div class="bg-white p-4 md:p-8 rounded shadow-md w-full max-w-4xl mx-auto">
            <h2 class="text-xl font-bold mb-6 text-center md:text-left">TAMBAH TRANSAKSI</h2>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
              <input
                type="text"
                placeholder="Jumlah"
                class="border px-4 py-2 rounded w-full"
                value={jumlah()}
                onInput={(e) => setJumlah(e.currentTarget.value)}
              />
              <input
                type="text"
                placeholder="Deskripsi"
                class="border px-4 py-2 rounded w-full"
                value={deskripsi()}
                onInput={(e) => setDeskripsi(e.currentTarget.value)}
              />

              <select
                class="border px-4 py-2 rounded w-full"
                value={kategori()}
                onChange={(e) => setKategori(e.currentTarget.value)}
              >
                <option value="">Please select</option>
                <option value="Makanan">Makanan</option>
                <option value="Transportasi">Transportasi</option>
                <option value="Lainnya">Lainnya</option>
              </select>

              <div class="flex gap-2 w-full">
                <select class="border px-2 py-2 rounded w-1/3" onChange={(e) => setTanggal(e.currentTarget.value)}>
                  <option>DD</option>
                  {[...Array(31)].map((_, i) => (
                    <option value={String(i + 1).padStart(2, '0')}>{i + 1}</option>
                  ))}
                </select>
                <select class="border px-2 py-2 rounded w-1/3" onChange={(e) => setBulan(e.currentTarget.value)}>
                  <option>MM</option>
                  {[...Array(12)].map((_, i) => (
                    <option value={String(i + 1).padStart(2, '0')}>{i + 1}</option>
                  ))}
                </select>
                <select class="border px-2 py-2 rounded w-1/3" onChange={(e) => setTahun(e.currentTarget.value)}>
                  <option>YYYY</option>
                  {[2023, 2024, 2025].map((year) => (
                    <option value={year}>{year}</option>
                  ))}
                </select>
              </div>
            </div>

            <div class="mt-6">
              <select
                class="border px-4 py-2 rounded w-full"
                value={foto()}
                onChange={(e) => setFoto(e.currentTarget.value)}
              >
                <option value="">Pilih Foto</option>
                <option value="foto1">Foto 1</option>
                <option value="foto2">Foto 2</option>
              </select>
            </div>

            <div class="flex flex-col md:flex-row items-center gap-4 mt-8">
              <button
                onClick={handleSave}
                class="w-full md:w-1/2 bg-gradient-to-r from-blue-500 to-indigo-500 text-white py-2 rounded-full shadow hover:opacity-90"
              >
                Save
              </button>
              <button class="w-full md:w-1/2 bg-gradient-to-r from-red-500 to-pink-500 text-white py-2 rounded-full shadow hover:opacity-90">
                Cancel
              </button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default TambahTransaksi;

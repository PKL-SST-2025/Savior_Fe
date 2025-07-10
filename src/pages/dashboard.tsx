import { Component } from 'solid-js';
import tambahTransaksiIcon from '../assets/tambah.png';
import riwayatIcon from '../assets/riwayat.png';
import dashboardIcon from '../assets/dashboard.png';
import budgetIcon from '../assets/budget.png';
import kategoriIcon from '../assets/kategori.png';
import statistikIcon from '../assets/statistik.png';
import profileIcon from '../assets/profile.png';

const Dashboard: Component = () => {
  const chartData = [30, 50, 80, 70, 60, 40, 50];
  const transactions = Array(10).fill('- LOREM IPSUM DOLOR S');

  return (
    <div class="flex flex-col md:flex-row min-h-screen bg-[#f8f9fc]">
      {/* Sidebar */}
      <aside class="w-full md:w-60 bg-[#1b2b59] text-white flex flex-row md:flex-col items-center md:items-stretch shrink-0">
        <div class="p-4 md:p-6 text-xl font-bold w-full text-center md:text-left">Savior</div>
        <nav class="flex-1 w-full">
          <ul class="space-y-0 md:space-y-2 flex md:block w-full px-2 md:px-4 overflow-x-auto">
            <li class="py-2 rounded px-4 cursor-pointer whitespace-nowrap flex items-center gap-3 hover:bg-[#314574]">
              <img src={tambahTransaksiIcon} alt="Tambah Transaksi" class="w-5 h-5" />
              <a href="/TambahTransaksi">Tambah Transaksi</a>
            </li>
            <li class="py-2 rounded px-4 cursor-pointer whitespace-nowrap flex items-center gap-3 hover:bg-[#314574]">
              <img src={riwayatIcon} alt="Riwayat" class="w-5 h-5" />
              <a href="/History">Riwayat</a>
            </li>
            <li class="py-2 rounded px-4 cursor-pointer whitespace-nowrap flex items-center gap-3 bg-blue-600">
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

        {/* Welcome Card */}
        <div class="bg-white shadow rounded p-4 mb-6 mx-2 md:mx-0">
          <p class="text-xl">
            Selamat Pagi, <strong>Albert</strong>
          </p>
          <p>
            Pengeluaran Bulan ini : <span class="text-red-600 font-bold">100 JT</span>
          </p>
        </div>

        {/* Chart & Transactions */}
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6 px-2 md:px-0">
          <div class="bg-white shadow rounded p-4 col-span-2">
            <h2 class="text-center font-bold mb-4">
              GRAFIK PENGELUARAN MINGGUAN 100JT
            </h2>
            <div class="flex items-end h-48 sm:h-60 md:h-80 justify-center gap-0 overflow-x-auto">
              {chartData.map((value, index) => (
                <div
                  class={`w-8 sm:w-12 md:w-20 rounded ${index === 2 ? 'bg-blue-500' : 'bg-blue-100'}`}
                  style={{ height: `${value}%`, 'margin-left': index === 0 ? '0' : '12px' }}
                />
              ))}
            </div>
          </div>

          <div class="bg-white shadow rounded p-4">
            <h2 class="font-bold mb-2">TRANSAKSI TERAKHIR</h2>
            <ul class="text-xs space-y-1 break-words">
              {transactions.map((item) => (
                <li>{item}</li>
              ))}
            </ul>
          </div>
        </div>

        {/* Statistik Section */}
        <div class="bg-white shadow rounded p-4 mx-2 md:mx-0 mb-4">
          <h2 class="text-center font-bold mb-4">STATISTIK</h2>
          <div class="overflow-x-auto">
            <table class="w-full text-center text-xs md:text-sm">
              <thead>
                <tr>
                  <th class="py-2">STATISTIK</th>
                  <th>Harian</th>
                  <th>Bulan ini</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td class="py-2">Total</td>
                  <td>$ 0.00</td>
                  <td>$ 0.00</td>
                </tr>
                <tr>
                  <td class="py-2">Tertinggi</td>
                  <td>$ 0.00</td>
                  <td>$ 0.00</td>
                </tr>
                <tr>
                  <td class="py-2">Terendah</td>
                  <td>$ 0.00</td>
                  <td>$ 0.00</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

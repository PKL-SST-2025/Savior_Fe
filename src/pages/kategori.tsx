import { createSignal } from "solid-js";
import { For } from "solid-js";
import tambahTransaksiIcon from '../assets/tambah.png';
import riwayatIcon from '../assets/riwayat.png';
import dashboardIcon from '../assets/dashboard.png';
import budgetIcon from '../assets/budget.png';
import kategoriIcon from '../assets/kategori.png';
import statistikIcon from '../assets/statistik.png';
import profileIcon from '../assets/profile.png';

const Kategori = () => {
  const [kategoriList, setKategoriList] = createSignal<string[]>([
    "Makanan",
    "Tertinggi",
    "Terendah",
  ]);
  const [inputValue, setInputValue] = createSignal("");
  const [editIndex, setEditIndex] = createSignal<number | null>(null);

  const handleSave = () => {
    if (inputValue().trim() === "") return;

    if (editIndex() !== null) {
      const newList = [...kategoriList()];
      newList[editIndex()!] = inputValue();
      setKategoriList(newList);
      setEditIndex(null);
    } else {
      setKategoriList([...kategoriList(), inputValue()]);
    }

    setInputValue("");
  };

  const handleEdit = (index: number) => {
    setEditIndex(index);
    setInputValue(kategoriList()[index]);
  };

  const handleDelete = (index: number) => {
    const newList = kategoriList().filter((_, i) => i !== index);
    setKategoriList(newList);
  };

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
            <li class="py-2 rounded px-4 cursor-pointer whitespace-nowrap flex items-center gap-3 hover:bg-[#314574]">
              <img src={dashboardIcon} alt="Dashboard" class="w-5 h-5" />
              <a href="/dashboard">Dashboard</a>
            </li>
            <li class="pt-6 text-sm text-gray-400 uppercase hidden md:block">Other Information</li>
            <li class="py-2 rounded px-4 cursor-pointer whitespace-nowrap flex items-center gap-3 hover:bg-[#314574]">
              <img src={budgetIcon} alt="Budget" class="w-5 h-5" />
              <a href="/Budget">Budget</a>
            </li>
            <li class="py-2 rounded px-4 cursor-pointer whitespace-nowrap flex items-center gap-3 bg-blue-600">
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

        {/* Body */}
        <div class="flex-1 p-2 md:p-10 overflow-auto">
          <h1 class="text-2xl font-bold text-center text-[#2f2f4f] mb-8">KATEGORI PENGELUARAN</h1>

          <div class="bg-white rounded-lg shadow p-4 md:p-6 w-full max-w-2xl mx-auto">
            <div class="overflow-x-auto">
              <table class="w-full text-left border-collapse text-xs md:text-sm">
                <tbody>
                  <For each={kategoriList()}>
                    {(kategori, index) => (
                      <tr class="border-b border-gray-200">
                        <td class="py-4 text-gray-700">{kategori}</td>
                        <td
                          class="py-4 text-center font-bold text-[#2f2f4f] cursor-pointer"
                          onClick={() => handleEdit(index())}
                        >
                          Edit
                        </td>
                        <td
                          class="py-4 text-center font-bold text-red-500 cursor-pointer"
                          onClick={() => handleDelete(index())}
                        >
                          Delete
                        </td>
                      </tr>
                    )}
                  </For>
                </tbody>
              </table>
            </div>

            <div class="mt-8">
              <label class="block text-sm mb-1 text-gray-700">Tambah Kategori</label>
              <input
                type="text"
                value={inputValue()}
                onInput={(e) => setInputValue(e.currentTarget.value)}
                class="w-full px-4 py-2 border border-gray-300 rounded"
              />
              <button
                onClick={handleSave}
                class="mt-4 w-full sm:w-40 h-10 text-base bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-full font-semibold shadow flex items-center justify-center mx-auto active:scale-95 transition-transform duration-100"
                type="button"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Kategori;

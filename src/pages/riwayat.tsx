import { createSignal, For } from "solid-js";
import tambahTransaksiIcon from '../assets/tambah.png';
import riwayatIcon from '../assets/riwayat.png';
import dashboardIcon from '../assets/dashboard.png';
import budgetIcon from '../assets/budget.png';
import kategoriIcon from '../assets/kategori.png';
import statistikIcon from '../assets/statistik.png';
import profileIcon from '../assets/profile.png';

const data = [
	{
		name: "Wayne Kelley",
		description:
			"In hac habitasse platea dictumst. Vivamus adipiscing fermentum quam voluptat aliqui...",
		date: "12-11-2020",
		type: "News",
	},
	{
		name: "Joan Richardson",
		description:
			"elit eget elit facilisis tristique. Nam vel laculis mauris. Sed ullamcorper tellus erat, non...",
		date: "12-11-2020",
		type: "Notion",
	},
	{
		name: "Lauren Kennedy",
		description:
			"Quisque justo turpis, vestibulum non enim nec, tempor mollis mi. Sed vel tristique...",
		date: "10-11-2020",
		type: "News",
	},
	{
		name: "Kelly Moreno",
		description:
			"Nam porttitor blandit accusan. Ut vel dictum sem, a pretium dui. In malesuada enim...",
		date: "09-11-2020",
		type: "News",
	},
	{
		name: "Lauren Peters",
		description:
			"Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed non dignissim Maecenas jio...",
		date: "09-11-2020",
		type: "Notion",
	},
	{
		name: "Jordan Day",
		description:
			"Quisque justo turpis, vestibulum non enim nec, tempor mollis mi. Sed vel tristique quam...",
		date: "09-11-2020",
		type: "Notion",
	},
	{
		name: "Dorothy Baker",
		description:
			"Fusce lorem leo, vehicula at nibh quis, facilisis accumsan porttitor velit turpi. Maecen...",
		date: "09-11-2020",
		type: "News",
	},
	{
		name: "Timothy Garrett",
		description:
			"Vestibulum interdum vestibulum felis ac molestie. Praesent aliquet quam et libero dictum...",
		date: "09-11-2020",
		type: "News",
	},
	{
		name: "Bruce Myers",
		description:
			"elit eget elit facilisis tristique. Nam vel laculis mauris. Sed ullamcorper tellus erat, non...",
		date: "09-11-2020",
		type: "News",
	},
	{
		name: "Juan Long",
		description:
			"Quisque justo turpis, vestibulum non enim nec, tempor mollis mi. Sed vel tristique quam...",
		date: "02-11-2020",
		type: "News",
	},
	{
		name: "Janet Palmer",
		description:
			"Nam porttitor blandit accusan. Ut vel dictum sem, a pretium dui. In malesuada enim in...",
		date: "02-11-2020",
		type: "Notion",
	},
	{
		name: "Austin Hopkins",
		description:
			"Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed non dignissim Maecenas jio...",
		date: "01-11-2020",
		type: "Notion",
	},
	{
		name: "Emma Wilson",
		description:
			"In hac habitasse platea dictumst. Vivamus adipiscing fermentum quam voluptat aliqui...",
		date: "01-11-2020",
		type: "Notion",
	},
];

const Riwayat = () => {
	const [currentPage, setCurrentPage] = createSignal(1);
	const itemsPerPage = 10;

	const totalPages = Math.ceil(data.length / itemsPerPage);
	const paginatedData = () =>
		data.slice(
			(currentPage() - 1) * itemsPerPage,
			currentPage() * itemsPerPage
		);

	const handlePageChange = (page: number) => {
		if (page > 0 && page <= totalPages) setCurrentPage(page);
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
            <li class="py-2 rounded px-4 cursor-pointer whitespace-nowrap flex items-center gap-3 bg-blue-600">
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
          {/* Logo & Title */}
          <div class="flex items-center gap-2">
          </div>
          {/* Search, Notification, Avatar */}
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
				{/* RIWAYAT Title */}
				<div class="px-4 md:px-8 mb-2">
          <h1 class="text-2xl font-bold mt-2">RIWAYAT</h1>
        </div>
				{/* Content */}
				<main class="flex-1 p-2 md:p-8 bg-[#f8f9fc]">
          <div class="bg-white rounded-lg shadow p-2 md:p-6">
            {/* Filter Dropdown */}
            <div class="flex flex-col sm:flex-row justify-between items-center mb-4 gap-2">
              <select class="border border-gray-300 rounded px-4 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-200 w-full sm:w-auto">
                <option>Filter</option>
                <option>Makanan</option>
                <option>Transportasi</option>
                <option>Hiburan</option>
              </select>
              <button class="bg-white p-2 rounded-full hover:bg-gray-100 text-gray-400">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <circle cx="12" cy="12" r="1.5" />
                  <circle cx="19.5" cy="12" r="1.5" />
                  <circle cx="4.5" cy="12" r="1.5" />
                </svg>
              </button>
            </div>
            {/* Table */}
            <div class="overflow-x-auto">
              <table class="min-w-full text-xs md:text-sm">
                <thead>
                  <tr class="text-gray-400 border-b">
                    <th class="py-2 text-left font-semibold whitespace-nowrap">Tanggal</th>
                    <th class="py-2 text-left font-semibold whitespace-nowrap">Kategori</th>
                    <th class="py-2 text-left font-semibold whitespace-nowrap">Tanggal Input</th>
                    <th class="py-2 text-right font-semibold whitespace-nowrap"></th>
                  </tr>
                </thead>
                <tbody>
                  <For each={paginatedData()}>
                    {(item) => (
                      <tr class="border-b hover:bg-gray-50">
                        <td class="py-3 font-medium whitespace-nowrap">{item.date}</td>
                        <td class="py-3 text-gray-600 max-w-xs truncate">{item.type}</td>
                        <td class="py-3 text-gray-500 whitespace-nowrap">{item.date}</td>
                        <td class="py-3 text-right flex gap-2 justify-end">
                          <button class="bg-[#23243A] text-white px-4 md:px-6 py-1.5 rounded-full font-semibold shadow hover:opacity-90 text-xs md:text-sm">
                            Edit
                          </button>
                          <button class="bg-[#FF4B4B] text-white px-4 md:px-6 py-1.5 rounded-full font-semibold shadow hover:opacity-90 text-xs md:text-sm">
                            Delete
                          </button>
                        </td>
                      </tr>
                    )}
                  </For>
                </tbody>
              </table>
            </div>
            {/* Pagination */}
            <div class="flex flex-col sm:flex-row justify-between items-center mt-4 gap-2">
              <div class="text-gray-600 text-xs md:text-sm">
                Page {currentPage()} of {totalPages}
              </div>
              <div class="flex gap-2">
                <button
                  class="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300 text-gray-700 text-xs md:text-sm"
                  onClick={() => handlePageChange(currentPage() - 1)}
                  disabled={currentPage() === 1}
                >
                  Prev
                </button>
                <button
                  class="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300 text-gray-700 text-xs md:text-sm"
                  onClick={() => handlePageChange(currentPage() + 1)}
                  disabled={currentPage() === totalPages}
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
	);
};

export default Riwayat;
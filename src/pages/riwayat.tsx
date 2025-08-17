import { createSignal, onMount, For } from "solid-js";
import tambahTransaksiIcon from '../assets/tambah.png';
import riwayatIcon from '../assets/riwayat.png';
import dashboardIcon from '../assets/dashboard.png';
import budgetIcon from '../assets/budget.png';
import kategoriIcon from '../assets/kategori.png';
import statistikIcon from '../assets/statistik.png';
import profileIcon from '../assets/profile.png';
import saviorLogo from '../assets/Savior Putih.png';

interface TransaksiItem {
  id: number;
  user_id: string;
  kategori_id: number;
  kategori_nama: string;
  jumlah: number;
  deskripsi: string;
  tanggal: string;
  created_at?: string;
  updated_at?: string;
}

interface KategoriItem {
  id: number;
  nama: string;
}

const Riwayat = () => {
  const [currentPage, setCurrentPage] = createSignal(1);
  const [transaksiList, setTransaksiList] = createSignal<TransaksiItem[]>([]);
  const [categories, setCategories] = createSignal<KategoriItem[]>([]);
  const [selectedCategory, setSelectedCategory] = createSignal("");
  const [loading, setLoading] = createSignal(false);
  const [error, setError] = createSignal("");
  const [sidebarOpen, setSidebarOpen] = createSignal(true);
  const [user] = createSignal<any>(null);

  // Function to get username
  const getUserName = () => {
    // First check if user data is in signal
    if (user() && user().username) {
      return user().username;
    }
    
    // Then check localStorage for user data
    try {
      const storedUserData = localStorage.getItem('user');
      if (storedUserData) {
        const parsedUser = JSON.parse(storedUserData);
        if (parsedUser && parsedUser.username) {
          return parsedUser.username;
        }
      }
    } catch (error) {
      console.error('Error parsing user data:', error);
    }
    
    return 'User';
  };

  const logout = () => {
    localStorage.removeItem('user_id');
    localStorage.removeItem('user');
    window.location.href = '/SignIn';
  };
  
  const itemsPerPage = 10;
  const BASE_URL = 'https://hosting-albertus-production.up.railway.app/api';
  const userId = localStorage.getItem('user_id') || '';

  // Calculate pagination
  const totalPages = () => Math.ceil(transaksiList().length / itemsPerPage);
  const paginatedData = () =>
    transaksiList().slice(
      (currentPage() - 1) * itemsPerPage,
      currentPage() * itemsPerPage
    );

  // Fetch categories for filter dropdown
  const fetchCategories = async () => {
    try {
      const response = await fetch(`${BASE_URL}/kategori`);
      if (response.ok) {
        const data = await response.json();
        setCategories(Array.isArray(data) ? data : []);
      } else {
        const errorData = await response.json();
        console.error('Failed to fetch categories:', errorData.message);
      }
    } catch (err) {
      console.error('Network error:', err);
    }
  };

  // Fetch transactions
  const fetchTransaksi = async () => {
    if (!userId) {
      setError('Please login first');
      return;
    }
    
    setLoading(true);
    setError("");

    try {
      let url = `${BASE_URL}/transaksi/${userId}`;
      
      // Add category filter if selected
      const params = new URLSearchParams();
      if (selectedCategory()) {
        params.append('kategori_id', selectedCategory());
      }
      
      if (params.toString()) {
        url += `?${params.toString()}`;
      }

      const response = await fetch(url);
      
      if (response.ok) {
        const data = await response.json();
        // Backend returns { status: "success", transaksi: [...] }
        setTransaksiList(data.transaksi || []);
        setCurrentPage(1); // Reset to first page when data changes
      } else {
        const errorData = await response.json();
        setError(errorData.message || 'Failed to fetch transactions');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      setError(`Network error: ${errorMessage}`);
    } finally {
      setLoading(false);
    }
  };

  // Delete transaction
  const handleDelete = async (transaksiId: number) => {
    if (!confirm('Are you sure you want to delete this transaction?')) return;

    setLoading(true);
    setError("");

    try {
      const response = await fetch(`${BASE_URL}/transaksi/${userId}/${transaksiId}`, {
        method: 'DELETE',
      });

      const data = await response.json();

      if (response.ok && data.status === 'success') {
        await fetchTransaksi(); // Refresh the list
      } else {
        setError(data.message || 'Failed to delete transaction');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      setError(`Failed to connect to server: ${errorMessage}`);
    } finally {
      setLoading(false);
    }
  };

  // Handle page change
  const handlePageChange = (page: number) => {
    if (page > 0 && page <= totalPages()) setCurrentPage(page);
  };

  // Handle category filter change
  const handleCategoryFilter = (categoryId: string) => {
    setSelectedCategory(categoryId);
    fetchTransaksi(); // Refetch with filter
  };

  // Format currency
  const formatCurrency = (amount: number) => {
    return `Rp ${amount.toLocaleString()}`;
  };

  // Format date
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('id-ID');
    } catch {
      return dateString;
    }
  };

  // Clear error
  const clearError = () => setError("");

  onMount(() => {
    if (userId) {
      fetchCategories();
      fetchTransaksi();
    } else {
      setError('Please login first');
    }
  });

  return (
    <div class="flex min-h-screen bg-[#f8f9fc]">
      {/* Sidebar */}
      <aside class={`${sidebarOpen() ? 'w-60' : 'w-20'} bg-[#1b2b59] text-white flex flex-col shrink-0 transition-all duration-300 ease-in-out fixed left-0 top-0 h-screen z-40`}>
        <div class={`${sidebarOpen() ? 'p-6 -ml-2' : 'p-3'} flex items-center ${sidebarOpen() ? '' : 'justify-center'}`}>
          <div class={`${sidebarOpen() ? 'w-20 h-20' : 'w-16 h-16'} flex items-center justify-center`}>
            <img src={saviorLogo} alt="SAVIOR Logo" class={`${sidebarOpen() ? 'w-20 h-20' : 'w-16 h-16'} object-contain`} />
          </div>
          {sidebarOpen() && <span class="text-xl font-bold -ml-2">SAVIOR</span>}
        </div>

        <nav class={`flex-1 ${sidebarOpen() ? 'px-4' : 'px-2'}`}>
          <ul class="space-y-2">
            <li>
              <a href="/TambahTransaksi" class={`flex items-center ${sidebarOpen() ? 'gap-3 px-4' : 'justify-center px-2'} py-3 rounded-lg hover:bg-[#314574] transition-colors group relative`}>
                <img src={tambahTransaksiIcon} alt="Tambah Transaksi" class="w-5 h-5 flex-shrink-0" />
                {sidebarOpen() && <span>Tambah Transaksi</span>}
                {!sidebarOpen() && (
                  <div class="absolute left-full ml-2 bg-gray-800 text-white px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity z-50 whitespace-nowrap pointer-events-none">
                    Tambah Transaksi
                  </div>
                )}
              </a>
            </li>
            <li>
              <a href="/History" class={`flex items-center ${sidebarOpen() ? 'gap-3 px-4' : 'justify-center px-2'} py-3 rounded-lg bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow-lg group relative`}>
                <img src={riwayatIcon} alt="Riwayat" class="w-5 h-5 flex-shrink-0" />
                {sidebarOpen() && <span>Riwayat</span>}
                {!sidebarOpen() && (
                  <div class="absolute left-full ml-2 bg-gray-800 text-white px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity z-50 whitespace-nowrap pointer-events-none">
                    Riwayat
                  </div>
                )}
              </a>
            </li>
            <li>
              <a href="/dashboard" class={`flex items-center ${sidebarOpen() ? 'gap-3 px-4' : 'justify-center px-2'} py-3 rounded-lg hover:bg-[#314574] transition-colors group relative`}>
                <img src={dashboardIcon} alt="Dashboard" class="w-5 h-5 flex-shrink-0" />
                {sidebarOpen() && <span>Dashboard</span>}
                {!sidebarOpen() && (
                  <div class="absolute left-full ml-2 bg-gray-800 text-white px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity z-50 whitespace-nowrap pointer-events-none">
                    Dashboard
                  </div>
                )}
              </a>
            </li>
            {sidebarOpen() && (
              <li class="pt-6">
                <div class="text-xs text-gray-400 uppercase font-semibold mb-3 px-4">Other Information</div>
              </li>
            )}
            <li>
              <a href="/Budget" class={`flex items-center ${sidebarOpen() ? 'gap-3 px-4' : 'justify-center px-2'} py-3 rounded-lg hover:bg-[#314574] transition-colors group relative`}>
                <img src={budgetIcon} alt="Budget" class="w-5 h-5 flex-shrink-0" />
                {sidebarOpen() && <span>Budget</span>}
                {!sidebarOpen() && (
                  <div class="absolute left-full ml-2 bg-gray-800 text-white px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity z-50 whitespace-nowrap pointer-events-none">
                    Budget
                  </div>
                )}
              </a>
            </li>
            <li>
              <a href="/Kategori" class={`flex items-center ${sidebarOpen() ? 'gap-3 px-4' : 'justify-center px-2'} py-3 rounded-lg hover:bg-[#314574] transition-colors group relative`}>
                <img src={kategoriIcon} alt="Kategori" class="w-5 h-5 flex-shrink-0" />
                {sidebarOpen() && <span>Kategori</span>}
                {!sidebarOpen() && (
                  <div class="absolute left-full ml-2 bg-gray-800 text-white px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity z-50 whitespace-nowrap pointer-events-none">
                    Kategori
                  </div>
                )}
              </a>
            </li>
            <li>
              <a href="/Statistik" class={`flex items-center ${sidebarOpen() ? 'gap-3 px-4' : 'justify-center px-2'} py-3 rounded-lg hover:bg-[#314574] transition-colors group relative`}>
                <img src={statistikIcon} alt="Statistik" class="w-5 h-5 flex-shrink-0" />
                {sidebarOpen() && <span>Statistik</span>}
                {!sidebarOpen() && (
                  <div class="absolute left-full ml-2 bg-gray-800 text-white px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity z-50 whitespace-nowrap pointer-events-none">
                    Statistik
                  </div>
                )}
              </a>
            </li>
            {sidebarOpen() && (
              <li class="pt-6">
                <div class="text-xs text-gray-400 uppercase font-semibold mb-3 px-4">Settings</div>
              </li>
            )}
            <li>
              <a href="/Profile" class={`flex items-center ${sidebarOpen() ? 'gap-3 px-4' : 'justify-center px-2'} py-3 rounded-lg hover:bg-[#314574] transition-colors group relative`}>
                <img src={profileIcon} alt="Profile" class="w-5 h-5 flex-shrink-0" />
                {sidebarOpen() && <span>Profile</span>}
                {!sidebarOpen() && (
                  <div class="absolute left-full ml-2 bg-gray-800 text-white px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity z-50 whitespace-nowrap pointer-events-none">
                    Profile
                  </div>
                )}
              </a>
            </li>
          </ul>
        </nav>
      </aside>

      {/* Main Content */}
      <div class={`flex-1 flex flex-col min-h-screen transition-all duration-300 ${sidebarOpen() ? 'ml-60' : 'ml-20'}`}>
        {/* Header */}
        <header class="flex flex-col md:flex-row items-center justify-between mb-6 bg-white px-4 md:px-8 py-2 shadow-sm h-auto md:h-16 gap-4">
          <div class="flex items-center gap-2">
            {/* Hamburger Menu Button */}
            <button 
              onClick={() => setSidebarOpen(!sidebarOpen())}
              class="p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <svg class="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
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
            <div class="relative group">
              <div class="w-8 h-8 rounded-full bg-blue-400 flex items-center justify-center text-white font-bold text-lg cursor-pointer">
                {getUserName().charAt(0).toUpperCase()}
              </div>
              {/* Dropdown menu */}
              <div class="absolute right-0 top-full mt-2 w-48 bg-white rounded-lg shadow-lg border opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                <div class="py-2">
                  <div class="px-4 py-2 text-sm text-gray-700 border-b">
                    <div class="font-medium">{getUserName()}</div>
                    <div class="text-gray-500">User Account</div>
                  </div>
                  <button
                    onClick={logout}
                    class="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                  >
                    Sign Out
                  </button>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* RIWAYAT Title */}
        <div class="px-4 md:px-8 mb-2">
          <h1 class="text-2xl font-bold mt-2">RIWAYAT</h1>
        </div>

        {/* Content */}
        <main class="flex-1 p-2 md:p-8 bg-[#f8f9fc]">
          <div class="bg-white rounded-lg shadow p-2 md:p-6">
            {/* Error Message */}
            {error() && (
              <div class="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                <div class="flex justify-between items-center">
                  <span>{error()}</span>
                  <button onClick={clearError} class="text-red-500 hover:text-red-700 font-bold">×</button>
                </div>
              </div>
            )}

            {/* Filter Dropdown */}
            <div class="flex flex-col sm:flex-row justify-between items-center mb-4 gap-2">
              <select 
                class="border border-gray-300 rounded px-4 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-200 w-full sm:w-auto"
                value={selectedCategory()}
                onChange={(e) => handleCategoryFilter(e.currentTarget.value)}
                disabled={loading()}
              >
                <option value="">All Categories</option>
                <For each={categories()}>
                  {(category) => (
                    <option value={category.id}>{category.nama}</option>
                  )}
                </For>
              </select>
              <button 
                class="bg-white p-2 rounded-full hover:bg-gray-100 text-gray-400"
                onClick={() => fetchTransaksi()}
                disabled={loading()}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              </button>
            </div>

            {/* Loading Indicator */}
            {loading() && (
              <div class="text-center py-8">
                <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <p class="text-gray-500">Loading transactions...</p>
              </div>
            )}

            {/* Table */}
            {!loading() && (
              <div class="overflow-x-auto">
                <table class="min-w-full text-xs md:text-sm">
                  <thead>
                    <tr class="text-gray-400 border-b">
                      <th class="py-2 text-left font-semibold whitespace-nowrap">Tanggal</th>
                      <th class="py-2 text-left font-semibold whitespace-nowrap">Kategori</th>
                      <th class="py-2 text-left font-semibold whitespace-nowrap">Deskripsi</th>
                      <th class="py-2 text-left font-semibold whitespace-nowrap">Jumlah</th>
                      <th class="py-2 text-left font-semibold whitespace-nowrap">Tanggal Input</th>
                      <th class="py-2 text-right font-semibold whitespace-nowrap">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {transaksiList().length === 0 ? (
                      <tr>
                        <td colspan="6" class="py-8 text-center text-gray-500">
                          No transactions found. Start by adding your first transaction.
                        </td>
                      </tr>
                    ) : (
                      <For each={paginatedData()}>
                        {(item) => (
                          <tr class="border-b hover:bg-gray-50">
                            <td class="py-3 font-medium whitespace-nowrap">{formatDate(item.tanggal)}</td>
                            <td class="py-3 text-gray-600 max-w-xs truncate">{item.kategori_nama}</td>
                            <td class="py-3 text-gray-600 max-w-xs truncate">{item.deskripsi}</td>
                            <td class="py-3 font-medium text-green-600">{formatCurrency(item.jumlah)}</td>
                            <td class="py-3 text-gray-500 whitespace-nowrap">{formatDate(item.created_at || item.tanggal)}</td>
                            <td class="py-3 text-right flex gap-2 justify-end">
                              <button 
                                class="bg-[#23243A] text-white px-4 md:px-6 py-1.5 rounded-full font-semibold shadow hover:opacity-90 text-xs md:text-sm disabled:opacity-50"
                                disabled={loading()}
                                onClick={() => {
                                  // You can implement edit functionality here
                                  // For now, we'll just show an alert
                                  alert('Edit functionality can be implemented based on your needs');
                                }}
                              >
                                Edit
                              </button>
                              <button 
                                class="bg-[#FF4B4B] text-white px-4 md:px-6 py-1.5 rounded-full font-semibold shadow hover:opacity-90 text-xs md:text-sm disabled:opacity-50"
                                disabled={loading()}
                                onClick={() => handleDelete(item.id)}
                              >
                                Delete
                              </button>
                            </td>
                          </tr>
                        )}
                      </For>
                    )}
                  </tbody>
                </table>
              </div>
            )}

            {/* Pagination */}
            {!loading() && transaksiList().length > 0 && (
              <div class="flex flex-col sm:flex-row justify-between items-center mt-4 gap-2">
                <div class="text-gray-600 text-xs md:text-sm">
                  Page {currentPage()} of {totalPages()} ({transaksiList().length} total transactions)
                </div>
                <div class="flex gap-2">
                  <button
                    class="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300 text-gray-700 text-xs md:text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                    onClick={() => handlePageChange(currentPage() - 1)}
                    disabled={currentPage() === 1}
                  >
                    Prev
                  </button>
                  <button
                    class="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300 text-gray-700 text-xs md:text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                    onClick={() => handlePageChange(currentPage() + 1)}
                    disabled={currentPage() === totalPages()}
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Riwayat;
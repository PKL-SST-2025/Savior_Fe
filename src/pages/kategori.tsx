import { createSignal, onMount } from "solid-js";
import { For } from "solid-js";
import tambahTransaksiIcon from '../assets/tambah.png';
import riwayatIcon from '../assets/riwayat.png';
import dashboardIcon from '../assets/dashboard.png';
import budgetIcon from '../assets/budget.png';
import kategoriIcon from '../assets/kategori.png';
import statistikIcon from '../assets/statistik.png';
import profileIcon from '../assets/profile.png';
import saviorLogo from '../assets/Savior Putih.png';

interface KategoriItem {
  id: number;
  nama: string;
  created_at?: string;
  updated_at?: string;
}

const Kategori = () => {
  const [kategoriList, setKategoriList] = createSignal<KategoriItem[]>([]);
  const [inputValue, setInputValue] = createSignal("");
  const [editingId, setEditingId] = createSignal<number | null>(null);
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

  const BASE_URL = 'hosting-albertus-production.up.railway.app/api';

  // Fetch categories from backend
  const fetchKategori = async () => {
    setLoading(true);
    setError("");
    
    try {
      const response = await fetch(`${BASE_URL}/kategori`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      // Backend mengembalikan array langsung, bukan dalam wrapper object
      setKategoriList(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Error fetching categories:', err);
      setError('Failed to connect to server');
    } finally {
      setLoading(false);
    }
  };

  // Create new category
  const createKategori = async (nama: string) => {
    setLoading(true);
    setError("");

    try {
      const response = await fetch(`${BASE_URL}/kategori`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ nama }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      
      if (result.status === 'success') {
        await fetchKategori(); // Refresh the list
        return true;
      } else {
        setError(result.message || 'Failed to create category');
        return false;
      }
    } catch (err: any) {
      console.error('Error creating category:', err);
      setError(err.message || 'Failed to connect to server');
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Update category
  const updateKategori = async (id: number, nama: string) => {
    setLoading(true);
    setError("");

    try {
      const response = await fetch(`${BASE_URL}/kategori/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ nama }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      
      if (result.status === 'success') {
        await fetchKategori(); // Refresh the list
        return true;
      } else {
        setError(result.message || 'Failed to update category');
        return false;
      }
    } catch (err: any) {
      console.error('Error updating category:', err);
      setError(err.message || 'Failed to connect to server');
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Delete category
  const deleteKategori = async (id: number) => {
    setLoading(true);
    setError("");

    try {
      const response = await fetch(`${BASE_URL}/kategori/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      
      if (result.status === 'success') {
        await fetchKategori(); // Refresh the list
        return true;
      } else {
        setError(result.message || 'Failed to delete category');
        return false;
      }
    } catch (err: any) {
      console.error('Error deleting category:', err);
      setError(err.message || 'Failed to connect to server');
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Handle delete with confirmation
  const handleDelete = async (index: number) => {
    const kategori = kategoriList()[index];
    const confirmDelete = confirm(`Are you sure you want to delete "${kategori.nama}"?`);
    
    if (confirmDelete) {
      const success = await deleteKategori(kategori.id);
      if (success) {
        setError("");
      }
    }
  };

  // Handle edit
  const handleEdit = (index: number) => {
    const kategori = kategoriList()[index];
    setEditingId(kategori.id);
    setInputValue(kategori.nama);
    setError("");
  };

  // Cancel edit
  const handleCancel = () => {
    setEditingId(null);
    setInputValue("");
    setError("");
  };

  // Handle save
  const handleSave = async () => {
    if (inputValue().trim() === "") {
      setError("Category name cannot be empty");
      return;
    }

    let success = false;

    if (editingId() !== null) {
      success = await updateKategori(editingId()!, inputValue().trim());
      if (success) {
        setEditingId(null);
      }
    } else {
      success = await createKategori(inputValue().trim());
    }

    if (success) {
      setInputValue("");
      setError("");
    }
  };

  // Load categories on component mount
  onMount(() => {
    fetchKategori();
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
              <a href="/History" class={`flex items-center ${sidebarOpen() ? 'gap-3 px-4' : 'justify-center px-2'} py-3 rounded-lg hover:bg-[#314574] transition-colors group relative`}>
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
              <a href="/Kategori" class={`flex items-center ${sidebarOpen() ? 'gap-3 px-4' : 'justify-center px-2'} py-3 rounded-lg bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow-lg group relative`}>
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
            <h1 class="text-xl font-bold text-gray-800">KATEGORI</h1>
          </div>
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

        {/* Body */}
        <div class="flex-1 p-2 md:p-10 overflow-auto">
          <h1 class="text-2xl font-bold text-center text-[#2f2f4f] mb-8">KATEGORI PENGELUARAN</h1>

          <div class="bg-white rounded-lg shadow p-4 md:p-6 w-full max-w-2xl mx-auto">
            {/* Error Message */}
            {error() && (
              <div class="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                {error()}
              </div>
            )}

            {/* Loading Indicator */}
            {loading() && (
              <div class="mb-4 p-3 bg-blue-100 border border-blue-400 text-blue-700 rounded">
                Loading...
              </div>
            )}

            <div class="overflow-x-auto">
              <table class="w-full text-left border-collapse text-xs md:text-sm">
                <tbody>
                  {kategoriList().length === 0 && !loading() ? (
                    <tr>
                      <td colspan="3" class="py-8 text-center text-gray-500">
                        No categories found. Add your first category below.
                      </td>
                    </tr>
                  ) : (
                    <For each={kategoriList()}>
                      {(kategori, index) => (
                        <tr class="border-b border-gray-200">
                          <td class="py-4 text-gray-700">{kategori.nama}</td>
                          <td
                            class="py-4 text-center font-bold text-[#2f2f4f] cursor-pointer hover:text-blue-600 transition-colors"
                            onClick={() => handleEdit(index())}
                          >
                            Edit
                          </td>
                          <td
                            class="py-4 text-center font-bold text-red-500 cursor-pointer hover:text-red-700 transition-colors"
                            onClick={() => handleDelete(index())}
                          >
                            Delete
                          </td>
                        </tr>
                      )}
                    </For>
                  )}
                </tbody>
              </table>
            </div>

            <div class="mt-8">
              <label class="block text-sm mb-1 text-gray-700">
                {editingId() ? "Edit Kategori" : "Tambah Kategori"}
              </label>
              <input
                type="text"
                value={inputValue()}
                onInput={(e) => setInputValue(e.currentTarget.value)}
                placeholder="Enter category name"
                class="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                disabled={loading()}
              />
              <div class="mt-4 flex gap-2 justify-center">
                <button
                  onClick={handleSave}
                  disabled={loading() || inputValue().trim() === ""}
                  class="w-full sm:w-40 h-10 text-base bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-full font-semibold shadow flex items-center justify-center active:scale-95 transition-transform duration-100 disabled:opacity-50 disabled:cursor-not-allowed"
                  type="button"
                >
                  {loading() ? "Saving..." : editingId() ? "Update" : "Save"}
                </button>
                {editingId() && (
                  <button
                    onClick={handleCancel}
                    disabled={loading()}
                    class="w-full sm:w-40 h-10 text-base bg-gray-500 text-white rounded-full font-semibold shadow flex items-center justify-center active:scale-95 transition-transform duration-100 disabled:opacity-50 disabled:cursor-not-allowed"
                    type="button"
                  >
                    Cancel
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Kategori;
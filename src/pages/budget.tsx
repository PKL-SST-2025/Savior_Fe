import { createSignal, onMount, For } from "solid-js";
import tambahTransaksiIcon from '../assets/tambah.png';
import riwayatIcon from '../assets/riwayat.png';
import dashboardIcon from '../assets/dashboard.png';
import budgetIcon from '../assets/budget.png';
import kategoriIcon from '../assets/kategori.png';
import statistikIcon from '../assets/statistik.png';
import profileIcon from '../assets/profile.png';
import saviorLogo from '../assets/Savior Putih.png';

interface BudgetItem {
  id: number;
  user_id: string;
  kategori_id: number;
  kategori_nama: string;
  amount: number;
  spent: number;
  percentage: number;
}

interface KategoriItem {
  id: number;
  nama: string;
}

const Budget = () => {
  const [budgets, setBudgets] = createSignal<BudgetItem[]>([]);
  const [categories, setCategories] = createSignal<KategoriItem[]>([]);
  const [newCategory, setNewCategory] = createSignal("");
  const [newAmount, setNewAmount] = createSignal("");
  const [loading, setLoading] = createSignal(false);
  const [error, setError] = createSignal("");
  const [message, setMessage] = createSignal("");
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

  const BASE_URL = 'https://hosting-albertus-production.up.railway.app/api';
  const userId = localStorage.getItem('user_id') || '';

  // Fetch categories for dropdown
  const fetchCategories = async () => {
    try {
      const response = await fetch(`${BASE_URL}/kategori`);
      if (response.ok) {
        const data = await response.json();
        setCategories(Array.isArray(data) ? data : []);
      } else {
        const errorData = await response.json();
        setError(errorData.message || `Failed to fetch categories: ${response.status}`);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      setError(`Network error: ${errorMessage}`);
    }
  };

  // Fetch budgets
  const fetchBudgets = async () => {
    if (!userId) {
      setError('No user ID found. Please login first.');
      return;
    }
    
    setLoading(true);
    setError("");

    try {
      const response = await fetch(`${BASE_URL}/budget/${userId}`);
      if (response.ok) {
        const data = await response.json();
        // Backend returns { status: "success", budgets: [...] }
        setBudgets(data.budgets || []);
      } else {
        const errorData = await response.json();
        setError(errorData.message || `Failed to fetch budgets: ${response.status}`);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      setError(`Network error: ${errorMessage}`);
    } finally {
      setLoading(false);
    }
  };

  // Add new budget
  const handleAddBudget = async () => {
    if (!newCategory() || !newAmount() || !userId) {
      setError("Please fill all fields");
      return;
    }

    const amount = parseInt(newAmount(), 10);
    if (isNaN(amount) || amount <= 0) {
      setError("Please enter a valid amount");
      return;
    }

    setLoading(true);
    setError("");
    setMessage("");

    try {
      const response = await fetch(`${BASE_URL}/budget/${userId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          kategori_id: parseInt(newCategory()),
          amount: amount,
        }),
      });

      const data = await response.json();

      if (response.ok && data.status === 'success') {
        setMessage(data.message || "Budget added successfully");
        setNewCategory("");
        setNewAmount("");
        await fetchBudgets();
      } else {
        setError(data.message || 'Failed to add budget');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      setError(`Failed to connect to server: ${errorMessage}`);
    } finally {
      setLoading(false);
    }
  };

  // Delete budget
  const handleDeleteBudget = async (budgetId: number) => {
    if (!confirm('Are you sure you want to delete this budget?')) return;

    setLoading(true);
    setError("");
    setMessage("");

    try {
      const response = await fetch(`${BASE_URL}/budget/${userId}/${budgetId}`, {
        method: 'DELETE',
      });

      const data = await response.json();

      if (response.ok && data.status === 'success') {
        setMessage(data.message || "Budget deleted successfully");
        await fetchBudgets();
      } else {
        setError(data.message || 'Failed to delete budget');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      setError(`Failed to connect to server: ${errorMessage}`);
    } finally {
      setLoading(false);
    }
  };

  // Clear messages
  const clearMessages = () => {
    setError("");
    setMessage("");
  };

  // Format currency
  const formatCurrency = (amount: number) => {
    return `RP ${amount.toLocaleString()}K`;
  };

  onMount(() => {
    if (userId) {
      fetchCategories();
      fetchBudgets();
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
              <a href="/Budget" class={`flex items-center ${sidebarOpen() ? 'gap-3 px-4' : 'justify-center px-2'} py-3 rounded-lg bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow-lg group relative`}>
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
            <h1 class="text-xl font-bold text-gray-800">BUDGET PLANNER</h1>
          </div>
          <div class="flex items-center gap-4 w-full md:w-auto justify-end">
            <div class="relative w-full max-w-xs">
              <span class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-4-4m0 0A7 7 0 104 4a7 7 0 0113 13z" />
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

        {/* Content */}
        <main class="flex-1 p-4 md:p-8">
          <div class="max-w-4xl mx-auto">
            {/* Messages */}
            {error() && (
              <div class="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg">
                <div class="flex justify-between items-center">
                  <span>{error()}</span>
                  <button onClick={clearMessages} class="text-red-500 hover:text-red-700 font-bold">×</button>
                </div>
              </div>
            )}

            {message() && (
              <div class="mb-6 p-4 bg-green-50 border border-green-200 text-green-700 rounded-lg">
                <div class="flex justify-between items-center">
                  <span>{message()}</span>
                  <button onClick={clearMessages} class="text-green-500 hover:text-green-700 font-bold">×</button>
                </div>
              </div>
            )}

            {/* Budget Display */}
            <div class="bg-white rounded-xl shadow-sm p-8 mb-8">
              {loading() && budgets().length === 0 ? (
                <div class="text-center py-8">
                  <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
                  <p class="text-gray-500">Loading budgets...</p>
                </div>
              ) : budgets().length === 0 ? (
                <div class="text-center py-8 text-gray-500">
                  <p class="text-lg mb-2">No budgets found</p>
                  <p>Create your first budget below.</p>
                </div>
              ) : (
                <div class="space-y-8">
                  <For each={budgets()}>
                    {(budget) => (
                      <div class="space-y-4">
                        <div class="flex justify-between items-center">
                          <h3 class="text-lg font-bold text-gray-800 uppercase">
                            {budget.kategori_nama} :
                          </h3>
                          <div class="flex items-center gap-4">
                            <span class="text-lg font-bold text-gray-800">
                              {formatCurrency(budget.amount)} | {budget.percentage.toFixed(0)}%
                            </span>
                            <button
                              onClick={() => handleDeleteBudget(budget.id)}
                              class="text-red-500 hover:text-red-700 text-sm"
                              disabled={loading()}
                            >
                              Delete
                            </button>
                          </div>
                        </div>
                        
                        {/* Progress Bar */}
                        <div class="w-full bg-gray-200 rounded-full h-4">
                          <div
                            class={`h-4 rounded-full ${
                              budget.percentage >= 100 ? 'bg-red-500' : 
                              budget.percentage >= 75 ? 'bg-yellow-500' : 'bg-blue-500'
                            }`}
                            style={{ width: `${Math.min(budget.percentage, 100)}%` }}
                          ></div>
                        </div>
                      </div>
                    )}
                  </For>
                </div>
              )}
            </div>

            {/* Add New Budget */}
            <div class="bg-white rounded-xl shadow-sm p-8">
              <h2 class="text-2xl font-bold text-center text-gray-800 mb-8">ATUR ANGGARAN BARU</h2>
              
              <div class="max-w-md mx-auto space-y-6">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Kategori</label>
                  <select
                    class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    value={newCategory()}
                    onChange={(e) => setNewCategory(e.target.value)}
                    disabled={loading()}
                  >
                    <option value="">Please select</option>
                    <For each={categories()}>
                      {(category) => (
                        <option value={category.id}>{category.nama}</option>
                      )}
                    </For>
                  </select>
                </div>
                
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Jumlah</label>
                  <input
                    type="number"
                    class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter amount"
                    value={newAmount()}
                    onInput={(e) => setNewAmount(e.target.value)}
                    disabled={loading()}
                    min="0"
                  />
                </div>
                
                <button
                  class="w-full bg-blue-500 hover:bg-blue-600 text-white p-3 rounded-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  onClick={handleAddBudget}
                  disabled={loading() || !newCategory() || !newAmount()}
                >
                  {loading() ? 'Saving...' : 'Save'}
                </button>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Budget;
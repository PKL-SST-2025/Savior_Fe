import { createSignal, onMount, onCleanup, createEffect } from "solid-js";
import * as am5 from "@amcharts/amcharts5";
import * as am5percent from "@amcharts/amcharts5/percent";
import am5themes_Animated from "@amcharts/amcharts5/themes/Animated";
import tambahTransaksiIcon from '../assets/tambah.png';
import riwayatIcon from '../assets/riwayat.png';
import dashboardIcon from '../assets/dashboard.png';
import budgetIcon from '../assets/budget.png';
import kategoriIcon from '../assets/kategori.png';
import statistikIcon from '../assets/statistik.png';
import profileIcon from '../assets/profile.png';
import saviorLogo from '../assets/Savior Putih.png';

interface PengeluaranKategori {
  kategori_nama: string;
  total_pengeluaran: number;
  persentase: number;
}

interface RingkasanPengeluaran {
  total_pengeluaran: number;
  rata_rata_harian: number;
  total_transaksi: number;
}

interface StatistikResponse {
  pengeluaran_per_kategori: PengeluaranKategori[];
  ringkasan: RingkasanPengeluaran;
}

interface ApiResponse<T> {
  status: string;
  data: T;
  message?: string;
  filter_applied?: {
    start_date: string;
    end_date: string;
    filter_type: string;
    year?: number;
    month?: number;
  };
}

const CATEGORY_COLORS = [
  '#2563eb', '#4ade80', '#f472b6', '#facc15', '#8b5cf6',
  '#f97316', '#ef4444', '#06b6d4', '#84cc16', '#d946ef',
];

const MONTH_NAMES = [
  "Januari", "Februari", "Maret", "April", "Mei", "Juni",
  "Juli", "Agustus", "September", "Oktober", "November", "Desember"
];

const Statistik = () => {
  const [filter, setFilter] = createSignal("monthly");
  const [selectedYear, setSelectedYear] = createSignal(new Date().getFullYear());
  const [selectedMonth, setSelectedMonth] = createSignal(new Date().getMonth() + 1);
  const [statistikData, setStatistikData] = createSignal<StatistikResponse | null>(null);
  const [loading, setLoading] = createSignal(true);
  const [error, setError] = createSignal("");
  const [debugInfo, setDebugInfo] = createSignal("");
  const [filterApplied, setFilterApplied] = createSignal<any>(null);
  const [currentUserId, setCurrentUserId] = createSignal<string | null>(null);
  const [chartCreated, setChartCreated] = createSignal(false);
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

  let chartDiv: HTMLDivElement | undefined;
  let root: am5.Root | undefined;

  const getYearOptions = () => {
    const currentYear = new Date().getFullYear();
    const years = [];
    for (let year = 2020; year <= currentYear + 2; year++) {
      years.push(year);
    }
    return years;
  };

  const getUserId = () => {
    if (currentUserId()) {
      return currentUserId();
    }

    const possibleKeys = [
      'user_id', 'userId', 'currentUserId', 'authUserId',
      'user', 'currentUser', 'userData', 'authUser', 'loginData'
    ];
    
    for (const key of possibleKeys) {
      const value = localStorage.getItem(key);
      if (value) {
        try {
          const parsed = JSON.parse(value);
          if (parsed.id || parsed.user_id || parsed.userId) {
            const id = parsed.id || parsed.user_id || parsed.userId;
            setCurrentUserId(id);
            return id;
          }
        } catch {
          if (value.length > 10 && value.includes('-')) {
            setCurrentUserId(value);
            return value;
          }
        }
      }
    }

    const fallbackUserId = "8787368b-3437-4440-9d99-0675386f1626";
    setCurrentUserId(fallbackUserId);
    return fallbackUserId;
  };

  const simulateLogin = async () => {
    try {
      setDebugInfo("🔄 Attempting login simulation...");
      
      const response = await fetch('hosting-albertus-production.up.railway.app/signin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: 'user@example.com',
          password: 'password123'
        })
      });

      if (response.ok) {
        const loginData = await response.json();
        localStorage.setItem('user_id', loginData.user_id);
        localStorage.setItem('userId', loginData.user_id);
        setCurrentUserId(loginData.user_id);
        setDebugInfo(`✅ Login successful, saved user_id: ${loginData.user_id}`);
        
        setTimeout(() => fetchStatistik(), 500);
        return loginData.user_id;
      }
    } catch (error) {
      setDebugInfo(`❌ Login simulation failed: ${error}`);
    }
    return null;
  };

  const buildApiUrl = (userId: string) => {
    const baseUrl = `hosting-albertus-production.up.railway.app/api/statistik/${userId}`;
    const params = new URLSearchParams();
    
    params.append('filter', filter());
    
    if (filter() === 'monthly' && selectedYear() && selectedMonth()) {
      params.append('year', selectedYear().toString());
      params.append('month', selectedMonth().toString());
    }
    
    return `${baseUrl}?${params.toString()}`;
  };

  const fetchStatistik = async () => {
    setLoading(true);
    setError("");
    
    try {
      let userId = getUserId();
      if (!userId) {
        userId = await simulateLogin();
      }

      if (!userId) {
        throw new Error("Tidak dapat mendapatkan user ID. Silakan login kembali.");
      }

      const apiUrl = buildApiUrl(userId);
      setDebugInfo(`📊 Fetching data for user: ${userId}`);
      
      const statsResponse = await fetch(apiUrl, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      });
      
      if (!statsResponse.ok) {
        const errorText = await statsResponse.text();
        throw new Error(`HTTP ${statsResponse.status}: ${errorText}`);
      }

      const statsResult: ApiResponse<StatistikResponse> = await statsResponse.json();
      
      if (statsResult.status === "success") {
        setStatistikData(statsResult.data);
        setFilterApplied(statsResult.filter_applied);
        
        const categoryCount = statsResult.data.pengeluaran_per_kategori?.length || 0;
        const totalSpending = statsResult.data.ringkasan?.total_pengeluaran || 0;
        
        setDebugInfo(`✅ Data loaded: ${categoryCount} categories, Total: Rp ${totalSpending.toLocaleString()}, Period: ${statsResult.filter_applied?.start_date} to ${statsResult.filter_applied?.end_date}`);
        setError("");
      } else {
        throw new Error(statsResult.message || "Failed to fetch statistics");
      }

    } catch (err) {
      console.error('❌ Error fetching statistics:', err);
      if (err instanceof Error) {
        if (err.name === 'AbortError') {
          setError("Request timeout. Periksa koneksi server dan coba lagi.");
        } else if (err.message.includes('Failed to fetch')) {
          setError("Tidak dapat terhubung ke server. Pastikan backend berjalan di hosting-albertus-production.up.railway.app");
        } else {
          setError(`Error: ${err.message}`);
        }
      } else {
        setError("Terjadi kesalahan yang tidak terduga");
      }
      setDebugInfo(`❌ Fetch failed: ${err}`);
    } finally {
      setLoading(false);
    }
  };

  // ✅ FIXED: Fungsi createChart yang diperbaiki
  const createChart = () => {
    const data = statistikData();
    
    // Pastikan chartDiv ada dan data sudah dimuat
    if (!chartDiv || loading() || !data) {
      console.log('📊 Chart conditions not met:', { 
        hasChartDiv: !!chartDiv, 
        loading: loading(), 
        hasData: !!data 
      });
      return;
    }

    console.log('📊 Creating chart with data:', data);

    // Dispose previous chart
    if (root) {
      root.dispose();
      root = undefined;
    }

    try {
      // Create root
      root = am5.Root.new(chartDiv);
      root.setThemes([am5themes_Animated.new(root)]);
      
      // Create chart
      const chart = root.container.children.push(
        am5percent.PieChart.new(root, {
          layout: root.verticalLayout,
          radius: am5.percent(90),
        })
      );
      
      // Create series
      const series = chart.series.push(
        am5percent.PieSeries.new(root, {
          name: "Categories",
          categoryField: "kategori_nama",
          valueField: "value",
          radius: am5.percent(90),
          innerRadius: am5.percent(50),
        })
      );

      // Configure labels
      series.labels.template.setAll({
        fontSize: "12px",
        fontWeight: "500",
        textType: "regular",
      });

      // Configure slices
      series.slices.template.setAll({
        strokeWidth: 2,
        stroke: am5.color("#ffffff"),
        cornerRadius: 4,
      });

      // ✅ FIXED: Prepare chart data - SIMPLIFIED
      let chartData = [];
      
      if (data.pengeluaran_per_kategori && data.pengeluaran_per_kategori.length > 0) {
        // Filter kategori yang memiliki pengeluaran > 0
        const validCategories = data.pengeluaran_per_kategori.filter(item => item.total_pengeluaran > 0);
        
        if (validCategories.length > 0) {
          chartData = validCategories.map((item) => ({
            kategori_nama: item.kategori_nama,
            value: item.total_pengeluaran,
            persentase: item.persentase
          }));
        } else {
          // Jika semua kategori 0, tampilkan placeholder
          chartData = [{
            kategori_nama: "Tidak Ada Pengeluaran",
            value: 1,
            persentase: 100
          }];
        }
      } else {
        // Jika tidak ada data sama sekali
        chartData = [{
          kategori_nama: "Tidak Ada Data",
          value: 1,
          persentase: 100
        }];
      }

      console.log('📊 Final chart data:', chartData);

      // Set data to series
      series.data.setAll(chartData);

      // Set colors
      const colorSet = am5.ColorSet.new(root, {
        colors: CATEGORY_COLORS.map(color => am5.color(color))
      });
      series.set("colors", colorSet);

      // Add tooltip
      series.slices.template.set("tooltipText", 
        chartData[0]?.kategori_nama === "Tidak Ada Data" || chartData[0]?.kategori_nama === "Tidak Ada Pengeluaran" 
          ? "{kategori_nama}"
          : "{kategori_nama}: Rp {value.formatNumber('#,###')}\n({persentase.formatNumber('#.1')}%)"
      );

      // Add legend
      const legend = chart.children.push(
        am5.Legend.new(root, {
          centerX: am5.percent(50),
          x: am5.percent(50),
          marginTop: 15,
          layout: root.gridLayout,
        })
      );

      legend.data.setAll(series.dataItems);

      // Animate
      series.appear(1000, 100);
      chart.appear(1000, 100);
      
      setChartCreated(true);
      console.log('✅ Chart created successfully');
      
    } catch (err) {
      console.error('❌ Error creating chart:', err);
      setDebugInfo(`Chart creation error: ${err}`);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const handleFilterChange = (newFilter: string) => {
    setFilter(newFilter);
    if (newFilter === 'monthly') {
      setSelectedYear(new Date().getFullYear());
      setSelectedMonth(new Date().getMonth() + 1);
    }
    setTimeout(() => fetchStatistik(), 300);
  };

  const handleYearChange = (newYear: number) => {
    setSelectedYear(newYear);
    setTimeout(() => fetchStatistik(), 300);
  };

  const handleMonthChange = (newMonth: number) => {
    setSelectedMonth(newMonth);
    setTimeout(() => fetchStatistik(), 300);
  };

  const getPeriodDisplay = () => {
    const appliedFilter = filterApplied();
    if (!appliedFilter) return "";
    
    if (filter() === 'monthly' && appliedFilter.year && appliedFilter.month) {
      return `${MONTH_NAMES[appliedFilter.month - 1]} ${appliedFilter.year}`;
    }
    
    return `${appliedFilter.start_date} - ${appliedFilter.end_date}`;
  };

  const hasActualData = () => {
    const data = statistikData();
    return data && (
      data.ringkasan.total_pengeluaran > 0 ||
      (data.pengeluaran_per_kategori && data.pengeluaran_per_kategori.some(item => item.total_pengeluaran > 0))
    );
  };

  // ✅ FIXED: onMount yang lebih sederhana
  onMount(() => {
    console.log('🔄 Component mounted');
    fetchStatistik();
  });

  // ✅ FIXED: createEffect untuk chart creation
  createEffect(() => {
    const data = statistikData();
    const isLoading = loading();
    
    // Hanya buat chart jika data sudah ada dan tidak loading
    if (data && !isLoading && chartDiv) {
      console.log('📊 Creating chart - data available');
      // Tunggu sedikit untuk memastikan DOM ready
      setTimeout(() => {
        createChart();
      }, 50);
    }
  });

  onCleanup(() => {
    if (root) {
      root.dispose();
      root = undefined;
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
              <a href="/Statistik" class={`flex items-center ${sidebarOpen() ? 'gap-3 px-4' : 'justify-center px-2'} py-3 rounded-lg bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow-lg group relative`}>
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
            <h1 class="text-xl font-bold text-gray-800">STATISTIK</h1>
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

        <main class="flex-1 px-4 md:px-8">
          <div class="max-w-6xl mx-auto">
            <div class="mb-8">
              <h1 class="text-2xl md:text-3xl font-bold text-[#2f2f4f] mb-2">Statistik Pengeluaran</h1>
              <p class="text-gray-600">Analisis pola pengeluaran Anda berdasarkan kategori</p>
            </div>

            <div class="bg-white rounded-lg shadow p-4 md:p-6 mb-6">
              <div class="flex flex-col gap-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Periode Analisis</label>
                  <div class="flex gap-2 flex-wrap">
                    {["daily", "weekly", "monthly"].map((filterType) => (
                      <button
                        class={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                          filter() === filterType
                            ? "bg-blue-600 text-white"
                            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                        }`}
                        onClick={() => handleFilterChange(filterType)}
                      >
                        {filterType === "daily" ? "Harian" : filterType === "weekly" ? "Mingguan" : "Bulanan"}
                      </button>
                    ))}
                  </div>
                </div>

                <div class="flex gap-4 flex-wrap items-end">
                  {filter() === 'monthly' && (
                    <div class="flex gap-4">
                      <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">Tahun</label>
                        <select
                          class="px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                          value={selectedYear()}
                          onChange={(e) => handleYearChange(parseInt(e.target.value))}
                        >
                          {getYearOptions().map((year) => (
                            <option value={year}>{year}</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">Bulan</label>
                        <select
                          class="px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                          value={selectedMonth()}
                          onChange={(e) => handleMonthChange(parseInt(e.target.value))}
                        >
                          {MONTH_NAMES.map((month, index) => (
                            <option value={index + 1}>{month}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                  )}
                </div>
              </div>
              
              {getPeriodDisplay() && (
                <div class="text-center mt-4">
                  <span class="inline-block bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                    Periode: {getPeriodDisplay()}
                  </span>
                </div>
              )}
            </div>

            {debugInfo() && (
              <div class="bg-blue-100 border border-blue-400 text-blue-700 px-4 py-3 rounded mb-4 text-sm">
                <strong>Debug Info:</strong> {debugInfo()}
                {chartCreated() && <span class="ml-2 text-green-600">📊 Chart: Created</span>}
              </div>
            )}

            {loading() ? (
              <div class="flex justify-center items-center py-8">
                <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                <span class="ml-4 text-gray-600">Memuat statistik...</span>
              </div>
            ) : error() ? (
              <div class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                <div class="flex items-center">
                  <svg class="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd" />
                  </svg>
                  <div><strong>Error:</strong> {error()}</div>
                </div>
                <div class="mt-3 space-x-2">
                  <button 
                    class="bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700"
                    onClick={fetchStatistik}
                  >
                    Coba Lagi
                  </button>
                  <button 
                    class="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700"
                    onClick={simulateLogin}
                  >
                    Login Test
                  </button>
                </div>
              </div>
            ) : (
              <div class="flex flex-col gap-8">
                {/* ✅ FIXED: Chart Container */}
                <div class="bg-white rounded-lg shadow p-4 md:p-6">
                  <h3 class="text-lg font-bold text-[#2f2f4f] mb-4">Distribusi Pengeluaran per Kategori</h3>
                  <div class="flex justify-center">
                    <div class="w-full max-w-md">
                      <div
                        ref={chartDiv}
                        style="width:100%;height:400px;min-height:400px;"
                        class="bg-white"
                      ></div>
                      
                      {!hasActualData() && (
                        <div class="text-center mt-4">
                          <p class="text-gray-500 text-sm">
                            Belum ada data pengeluaran untuk periode {filter() === 'daily' ? 'hari ini' : filter() === 'weekly' ? 'minggu ini' : 'bulan ini'}
                          </p>
                          <p class="text-gray-400 text-xs mt-1">
                            Mulai dengan menambahkan transaksi baru
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {statistikData() && (
                  <div class="space-y-6">
                    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div class="bg-white rounded-lg shadow p-6 text-center">
                        <h4 class="text-sm font-medium text-gray-500 mb-2">Total Pengeluaran</h4>
                        <p class="text-2xl font-bold text-blue-600">
                          {formatCurrency(statistikData()!.ringkasan.total_pengeluaran)}
                        </p>
                      </div>
                      <div class="bg-white rounded-lg shadow p-6 text-center">
                        <h4 class="text-sm font-medium text-gray-500 mb-2">Rata-rata Harian</h4>
                        <p class="text-2xl font-bold text-green-600">
                          {formatCurrency(Math.round(statistikData()!.ringkasan.rata_rata_harian))}
                        </p>
                      </div>
                      <div class="bg-white rounded-lg shadow p-6 text-center">
                        <h4 class="text-sm font-medium text-gray-500 mb-2">Total Transaksi</h4>
                        <p class="text-2xl font-bold text-purple-600">
                          {statistikData()!.ringkasan.total_transaksi}
                        </p>
                      </div>
                    </div>

                    {statistikData()!.pengeluaran_per_kategori && statistikData()!.pengeluaran_per_kategori.length > 0 ? (
                      <div class="bg-white rounded-lg shadow p-4 md:p-6">
                        <h3 class="text-lg font-bold text-[#2f2f4f] mb-4">Rincian per Kategori</h3>
                        <div class="space-y-3">
                          {statistikData()!.pengeluaran_per_kategori.map((item, index) => (
                            <div class="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                              <div class="flex items-center gap-3">
                                <span
                                  class="w-4 h-4 rounded-full flex-shrink-0"
                                  style={`background-color: ${CATEGORY_COLORS[index % CATEGORY_COLORS.length]};`}
                                ></span>
                                <span class="font-medium text-gray-700">{item.kategori_nama}</span>
                              </div>
                              <div class="text-right">
                                <div class="font-bold text-gray-900">{formatCurrency(item.total_pengeluaran)}</div>
                                <div class="text-sm text-gray-500">({item.persentase.toFixed(1)}%)</div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <div class="bg-gray-50 rounded-lg p-8 text-center">
                        <div class="text-gray-400 mb-2">
                          <svg class="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                          </svg>
                        </div>
                        <h3 class="text-lg font-medium text-gray-600 mb-2">Belum Ada Data Pengeluaran</h3>
                        <p class="text-gray-500 mb-4">
                          Mulai mencatat pengeluaran Anda untuk melihat analisis statistik yang berguna.
                        </p>
                        <a 
                          href="/TambahTransaksi" 
                          class="inline-block bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                        >
                          Tambah Transaksi Pertama
                        </a>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Statistik;
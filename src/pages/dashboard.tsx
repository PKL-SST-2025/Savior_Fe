import { Component, createSignal, onMount, For, createEffect, batch, onCleanup } from 'solid-js';
import tambahTransaksiIcon from '../assets/tambah.png';
import riwayatIcon from '../assets/riwayat.png';
import dashboardIcon from '../assets/dashboard.png';
import budgetIcon from '../assets/budget.png';
import kategoriIcon from '../assets/kategori.png';
import statistikIcon from '../assets/statistik.png';
import profileIcon from '../assets/profile.png';
import saviorLogo from '../assets/Savior Putih.png';

// Import AmCharts
import * as am5 from '@amcharts/amcharts5';
import * as am5xy from '@amcharts/amcharts5/xy';
import am5themes_Animated from '@amcharts/amcharts5/themes/Animated';

interface ChartDataPoint {
  hari: string;
  jumlah: number;
}

interface TransaksiTerakhir {
  id: number;
  deskripsi: string;
  jumlah: number;
  tanggal: string;
  kategori_nama: string;
}

interface DashboardData {
  total_bulan_ini: number;
  total_hari_ini: number;
  tertinggi_bulan_ini: number;
  tertinggi_hari_ini: number;
  terendah_bulan_ini: number;
  terendah_hari_ini: number;
  pengeluaran_mingguan: ChartDataPoint[];
  transaksi_terakhir: TransaksiTerakhir[];
}

// ✅ FIXED: Interface disesuaikan dengan API response
interface UserData {
  id: string;
  username: string;  // ✅ Changed from 'nama' to 'username'
  email: string;
  created_at: string;
}

interface ApiResponse<T> {
  status: string;
  data?: T;
  message?: string;
  debug?: any;
}

const Dashboard: Component = () => {
  const [dashboardData, setDashboardData] = createSignal<DashboardData | null>(null);
  const [userData, setUserData] = createSignal<UserData | null>(null);
  const [loading, setLoading] = createSignal(true);
  const [error, setError] = createSignal("");
  const [forceUpdate, setForceUpdate] = createSignal(0);
  const [sidebarOpen, setSidebarOpen] = createSignal(true);
  
  // Reference untuk chart AmCharts
  let chartDiv: HTMLElement | undefined;
  let root: am5.Root | undefined;
  let chart: am5xy.XYChart | undefined;

  // Get user ID
  const getUserId = () => {
    // Ambil user_id dari localStorage jika ada
    const storedId = localStorage.getItem('user_id');
    if (storedId) return storedId;
    // Fallback jika tidak ada
    return "8787368b-3437-4440-9d99-0675386f1626";
  };

  // Function to get username
  const getUserName = () => {
    // Ambil dari state userData (hasil fetch dari backend)
    const user = userData();
    if (user) {
      // Cek field nama atau username
      if (user.username) return user.username;
      if ((user as any).nama) return (user as any).nama;
    }

    // Coba ambil dari localStorage 'user'
    try {
      const storedUserData = localStorage.getItem('user');
      if (storedUserData) {
        const parsedUser = JSON.parse(storedUserData);
        if (parsedUser) {
          if (parsedUser.username) return parsedUser.username;
          if (parsedUser.nama) return parsedUser.nama;
        }
      }
    } catch (error) {
      // Handle error silently
    }

    // Fallback
    return 'Test User';
  };

  // Fetch user data
  const fetchUserData = async () => {
    try {
      const userId = getUserId();
      
      const response = await fetch(`https://hosting-albertus-production.up.railway.app/api/user/${userId}`);
      
      if (response.ok) {
        const result = await response.json();
        
        if (result.status === "success" && result.data) {
          setUserData(result.data);
          localStorage.setItem('user', JSON.stringify(result.data));
          
          // Force reactivity update
          setForceUpdate(prev => prev + 1);
        }
      }
    } catch (err) {
      // Handle error silently
    }
  };

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  // Format currency to millions
  const formatToMillions = (amount: number) => {
    if (amount >= 1000000) {
      return `${(amount / 1000000).toFixed(1)} JT`;
    } else if (amount >= 1000) {
      return `${(amount / 1000).toFixed(0)} RB`;
    }
    return formatCurrency(amount);
  };

  // Placeholder untuk fungsi tambahan di masa mendatang

  // Fungsi untuk membuat dan memperbarui chart menggunakan AmCharts 5
  const createAmChart = (data: ChartDataPoint[]) => {
    try {
      // Pastikan kontainer chart telah dibuat dalam DOM
      if (!chartDiv) {
        // Coba cari container dengan ID sebagai fallback
        const containerElement = document.getElementById('chartdiv');
        if (containerElement) {
          chartDiv = containerElement;
        } else {
          return null;
        }
      }
      
      // Pastikan data valid
      if (!data || data.length === 0) {
        return null;
      }

      // Hapus chart sebelumnya jika ada
      if (root) {
        root.dispose();
      }

      // Buat root element dengan visibilitas eksplisit
      root = am5.Root.new(chartDiv);
      
      // Force set visibility untuk root container
      if (root) {
        // Dapatkan elemen DOM langsung dari div container yang sudah kita buat
        if (chartDiv) {
          chartDiv.style.visibility = "visible";
          chartDiv.style.display = "block";
          chartDiv.style.zIndex = "1"; // Pastikan chart di atas layer lain
        }
      }

      // Atur tema
      root.setThemes([am5themes_Animated.new(root)]);

      // Buat chart dengan padding yang lebih baik
      chart = root.container.children.push(
        am5xy.XYChart.new(root, {
          panX: false,
          panY: false,
          wheelX: "none",
          wheelY: "none",
          paddingLeft: 20,
          paddingRight: 20,
          paddingTop: 40,
          paddingBottom: 30,
          layout: root.verticalLayout
        })
      );
      
      // Set background untuk chart agar terlihat jelas
      chart.set("background", am5.Rectangle.new(root, {
        fill: am5.color(0xffffff),
        fillOpacity: 1
      }));

      // Buat data
      const chartData = data.map(item => ({
        hari: item.hari,
        jumlah: item.jumlah
      }));

      // Buat sumbu X (kategori)
      const xAxis = chart.xAxes.push(
        am5xy.CategoryAxis.new(root, {
          categoryField: "hari",
          renderer: am5xy.AxisRendererX.new(root, {
            minGridDistance: 30,
            cellStartLocation: 0.1,
            cellEndLocation: 0.9
          }),
          tooltip: am5.Tooltip.new(root, {})
        })
      );
      
      // Set data untuk sumbu X
      xAxis.data.setAll(chartData);

      // Buat sumbu Y (nilai)
      const yAxis = chart.yAxes.push(
        am5xy.ValueAxis.new(root, {
          min: 0,
          // Buat sumbu Y visible
          renderer: am5xy.AxisRendererY.new(root, {})
        })
      );

      // Buat series
      const series = chart.series.push(
        am5xy.ColumnSeries.new(root, {
          name: "Pengeluaran",
          xAxis: xAxis,
          yAxis: yAxis,
          valueYField: "jumlah",
          categoryXField: "hari",
          tooltip: am5.Tooltip.new(root, {
            pointerOrientation: "horizontal",
            labelText: "{valueY}",
            getFillFromSprite: false,
            getLabelFillFromSprite: false,
            // Gunakan formatter untuk format nilai ke rupiah
            labelHTML: `<div style="text-align:center; font-weight:bold; color:#2563EB; padding:8px; background:white; border-radius:4px; box-shadow:0 2px 5px rgba(0,0,0,0.1);">
              <div style="font-size:14px;">{hari}</div>
              <div style="font-size:16px; margin-top:4px;">${formatCurrency(0).replace('0', '{valueY}')}</div>
            </div>`
          })
        })
      );

      // Atur warna bar berdasarkan nilai
      series.columns.template.adapters.add("fill", (fill, target) => {
        const dataItem = target.dataItem as any;
        if (dataItem) {
          const value = dataItem.get("valueY");
          if (value >= 500000) {
            return am5.color(0x2563EB); // bg-blue-600
          } else if (value >= 100000) {
            return am5.color(0x3B82F6); // bg-blue-500
          } else if (value >= 20000) {
            return am5.color(0x60A5FA); // bg-blue-400
          } else {
            return am5.color(0x93C5FD); // bg-blue-300
          }
        }
        return fill;
      });

      // Customization untuk columns
      series.columns.template.setAll({
        cornerRadiusTL: 3,
        cornerRadiusTR: 3,
        strokeWidth: 0,
        strokeOpacity: 0,
        fillOpacity: 0.9,
        width: am5.percent(70)
      });

      // Atur efek hover pada bar
      series.columns.template.states.create("hover", {
        scale: 1.05,
        fillOpacity: 1,
        stroke: am5.color(0x2563EB),
        strokeWidth: 2
      });

      // Isi data
      series.data.setAll(chartData);
      
      // Tambahkan cursor
      chart.set("cursor", am5xy.XYCursor.new(root, {
        behavior: "none",
        xAxis: xAxis,
        yAxis: yAxis
      }));
      
      // Tambahkan label
      chart.plotContainer.children.push(
        am5.Label.new(root, {
          text: "Pengeluaran Seminggu Terakhir",
          fontSize: 12,
          fontWeight: "500",
          textAlign: "center",
          x: am5.percent(50),
          centerX: am5.percent(50),
          paddingTop: 0,
          paddingBottom: 15,
          fill: am5.color(0x64748b)
        })
      );

      // Tambahkan animasi
      series.appear(1000);
      chart.appear(1000, 100);

      return chart;
    } catch (error) {
      return null;
    }
  };

  // Fungsi untuk update chart dengan data baru
  const updateAmChart = (data: ChartDataPoint[]) => {
    // Pastikan container sudah ada
    if (!chartDiv) {
      // Coba cari container dengan ID
      const containerElement = document.getElementById('chartdiv');
      if (containerElement) {
        chartDiv = containerElement;
      } else {
        return;
      }
    }
    
    if (chart && root) {
      try {
        const chartData = data.map(item => ({
          hari: item.hari,
          jumlah: item.jumlah
        }));
        
        // Update data
        if (chart.series.length > 0) {
          chart.series.getIndex(0)?.data.setAll(chartData);
          chart.xAxes.getIndex(0)?.data.setAll(chartData);
        }
      } catch (err) {
        // Jika terjadi error, coba buat chart baru
        root.dispose();
        root = undefined;
        chart = undefined;
        createAmChart(data);
      }
    } else {
      createAmChart(data);
    }
  };

  // Fetch dashboard data
  const fetchDashboardData = async () => {
    setLoading(true);
    setError("");
    
    try {
      const userId = getUserId();
      
      const response = await fetch(`https://hosting-albertus-production.up.railway.app/api/dashboard/${userId}`, {
        method: 'GET',
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP ${response.status}: ${errorText}`);
      }

      const responseText = await response.text();
      
      let result: ApiResponse<DashboardData>;
      try {
        result = JSON.parse(responseText);
      } catch (parseError) {
        throw new Error(`Gagal memproses data dari server`);
      }
      
      if (!result || result.status !== "success" || !result.data) {
        throw new Error(result?.message || "Respons tidak valid");
      }
      
      const data = result.data;
      
      if (typeof data.total_bulan_ini !== 'number') {
        throw new Error(`Data tidak valid`);
      }
      
      if (!Array.isArray(data.pengeluaran_mingguan)) {
        throw new Error('Data mingguan tidak valid');
      }
      
      if (!Array.isArray(data.transaksi_terakhir)) {
        throw new Error('Data transaksi tidak valid');
      }
      
      // Use batch to update all signals together
      batch(() => {
        setDashboardData(data);
        setForceUpdate(prev => prev + 1);
        setError("");
      });
      
      // Update AmCharts dengan data baru
      updateAmChart(data.pengeluaran_mingguan);

    } catch (err) {
      let errorMessage = "Terjadi kesalahan";
      if (err instanceof Error) {
        errorMessage = err.message;
        if (err.message.includes('Failed to fetch')) {
          errorMessage = "Tidak dapat terhubung ke server";
        }
      }
      
      batch(() => {
        setError(errorMessage);
        setDashboardData(null);
        setForceUpdate(prev => prev + 1);
      });
      
    } finally {
      setLoading(false);
    }
  };

  // Get greeting based on time
  const logout = () => {
    localStorage.removeItem('user_id');
    localStorage.removeItem('user');
    window.location.href = '/SignIn';
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Selamat Pagi";
    if (hour < 15) return "Selamat Siang";
    if (hour < 18) return "Selamat Sore";
    return "Selamat Malam";
  };

  // Truncate transaction description
  const truncateDescription = (text: string, maxLength: number = 30) => {
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
  };

  // Initialize on mount with proper user data fetching
  onMount(async () => {
    // Pastikan am5 diinisialisasi dengan benar
    if (typeof am5 === 'undefined') {
      return; // Berhenti jika library tidak tersedia
    }
    
    // Fetch user data first, then dashboard data
    await fetchUserData();
    await fetchDashboardData();
    
    // Pastikan DOM benar-benar siap dengan menunggu lebih lama
    let retryCount = 0;
    const maxRetries = 5;
    
    const initializeChart = () => {
      // Cek apakah container tersedia dan data tersedia
      if (chartDiv && data() && data()!.pengeluaran_mingguan && data()!.pengeluaran_mingguan.length > 0) {
        // Buat chart baru dari awal
        if (root) {
          root.dispose();
          root = undefined;
          chart = undefined;
        }
        
        // Gunakan createAmChart untuk membuat chart baru
        setTimeout(() => {
          createAmChart(data()!.pengeluaran_mingguan);
        }, 100);
        
        return true; // Berhasil
      }
      
      // Periksa kemungkinan penyebab kegagalan
      if (!chartDiv) {
        // Coba cari container dengan ID
        const containerElement = document.getElementById('chartdiv');
        if (containerElement) {
          chartDiv = containerElement;
        }
      }
      
      return false; // Gagal
    };
    
    // Coba inisialisasi chart beberapa kali
    const tryInitialize = () => {
      if (retryCount >= maxRetries) {
        return;
      }
      
      if (!initializeChart()) {
        retryCount++;
        setTimeout(tryInitialize, 500);
      }
    };
    
    // Mulai proses inisialisasi
    setTimeout(tryInitialize, 500);
  });
  
  // Cleanup AmCharts pada unmount
  onCleanup(() => {
    // Dispose root untuk membersihkan resources AmCharts
    if (root) {
      root.dispose();
    }
  });

  // Monitor state changes
  createEffect(() => {
    const data = dashboardData();
    
    if (data) {
      // Update chart ketika data berubah
      if (data.pengeluaran_mingguan && data.pengeluaran_mingguan.length > 0 && chartDiv) {
        updateAmChart(data.pengeluaran_mingguan);
      }
    }
  });

  // Reactive data
  const data = () => {
    void forceUpdate();
    const currentData = dashboardData();
    return currentData;
  };
  
  // Render component

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
              <a href="/dashboard" class={`flex items-center ${sidebarOpen() ? 'gap-3 px-4' : 'justify-center px-2'} py-3 rounded-lg bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow-lg group relative`}>
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

        {/* Status Messages - Only errors shown */}
        {error() && (
          <div class="bg-red-100 border-l-4 border-red-500 text-red-700 px-4 py-3 rounded mb-4 mx-4 shadow-sm">
            <div class="flex items-center">
              <svg class="w-5 h-5 mr-3" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd" />
              </svg>
              <div>
                <p class="font-bold">Error</p>
                <p class="text-sm">{error()}</p>
              </div>
            </div>
            <div class="mt-3 space-x-2">
              <button 
                class="bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700 transition-colors"
                onClick={fetchDashboardData}
              >
                Coba Lagi
              </button>
            </div>
          </div>
        )}

        {loading() ? (
          <div class="flex justify-center items-center py-8">
            <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            <span class="ml-4 text-gray-600">Memuat dashboard...</span>
          </div>
        ) : (
          <>
            {/* ✅ FIXED: Welcome Card with reactive username */}
            <div class="bg-white shadow rounded p-4 mb-6 mx-4">
              <p class="text-xl">
                {getGreeting()}, <strong>{getUserName()}</strong>
              </p>
              <p>
                Pengeluaran Bulan ini : <span class="text-red-600 font-bold">
                  {data() ? formatCurrency(data()!.total_bulan_ini) : 'Rp 0'}
                </span>
              </p>
              {/* Debug info removed for production */}
            </div>

            {/* Chart & Transactions */}
            <div class="grid grid-cols-1 lg:grid-cols-5 gap-6 mb-6 mx-4">
              {/* Chart */}
              <div class="bg-white shadow rounded p-6 lg:col-span-3">
                <h2 class="text-center font-bold mb-6 text-lg">
                  GRAFIK PENGELUARAN MINGGUAN
                </h2>
                {/* AmCharts 5 Chart Container */}
                <div 
                  ref={el => {
                    chartDiv = el;
                    
                    if (el) {
                      // Pastikan container memiliki dimensi yang jelas
                      el.style.height = "400px";
                      el.style.width = "100%";
                      el.style.position = "relative";
                      el.style.overflow = "visible";
                      
                      // Jika data sudah ada tapi chart belum dibuat, buat chart di sini
                      if (data() && data()!.pengeluaran_mingguan && data()!.pengeluaran_mingguan.length > 0) {
                        // Beri waktu DOM untuk benar-benar siap
                        setTimeout(() => {
                          updateAmChart(data()!.pengeluaran_mingguan);
                        }, 200);
                      }
                    }
                  }} 
                  class="w-full h-96 border border-gray-200 rounded bg-white"
                  id="chartdiv"
                  style="min-height: 380px; position: relative;"
                >
                  {!data() || !data()!.pengeluaran_mingguan || data()!.pengeluaran_mingguan.length === 0 ? (
                    <div class="flex items-center justify-center h-full w-full">
                      <div class="text-center text-gray-500">
                        <svg class="mx-auto h-12 w-12 text-gray-400 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                        </svg>
                        <p>Chart tidak tersedia</p>
                        <p class="text-xs mt-1">Tidak ada data pengeluaran</p>
                      </div>
                    </div>
                  ) : null}
                </div>
              </div>

              {/* Transactions */}
              <div class="bg-white shadow rounded p-6 lg:col-span-2">
                <div class="flex justify-between items-center mb-4">
                  <h2 class="font-bold text-lg">TRANSAKSI TERAKHIR</h2>
                  <span class="text-xs text-gray-500">
                    {data()?.transaksi_terakhir?.length || 0} transaksi
                  </span>
                </div>
                <div class="space-y-3 max-h-80 overflow-y-auto">
                  {data()?.transaksi_terakhir && data()!.transaksi_terakhir.length > 0 ? (
                    <For each={data()!.transaksi_terakhir}>
                      {(transaksi) => (
                        <div class="border-b border-gray-100 pb-2 hover:bg-gray-50 px-2 py-1 rounded">
                          <div class="flex justify-between items-start">
                            <div class="flex-1 min-w-0">
                              <div class="font-semibold text-gray-800 text-sm truncate">
                                {truncateDescription(transaksi.deskripsi, 25)}
                              </div>
                              <div class="text-xs text-gray-600 mt-1">
                                <span class="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs">
                                  {transaksi.kategori_nama}
                                </span>
                              </div>
                              <div class="text-xs text-gray-500 mt-1">
                                {new Date(transaksi.tanggal).toLocaleDateString('id-ID')}
                              </div>
                            </div>
                            <div class="text-right">
                              <div class="font-bold text-red-600 text-sm">
                                {formatCurrency(transaksi.jumlah)}
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </For>
                  ) : (
                    <div class="text-center text-gray-500 py-8">
                      <svg class="mx-auto h-12 w-12 text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      <p>Belum ada transaksi</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Statistics Section */}
            <div class="bg-white shadow rounded p-6 mx-4 mb-4">
              <h2 class="text-center font-bold mb-6 text-lg">STATISTIK PENGELUARAN</h2>
              <div class="overflow-x-auto">
                <table class="w-full text-center border-collapse">
                  <thead>
                    <tr class="border-b-2 border-gray-200">
                      <th class="py-3 px-4 font-bold text-gray-700">KATEGORI</th>
                      <th class="py-3 px-4 font-bold text-gray-700">HARIAN</th>
                      <th class="py-3 px-4 font-bold text-gray-700">BULANAN</th>
                    </tr>
                  </thead>
                  <tbody class="divide-y divide-gray-100">
                    <tr class="hover:bg-gray-50">
                      <td class="py-3 px-4 font-semibold text-gray-800">Total</td>
                      <td class="py-3 px-4 text-blue-600 font-bold">
                        {data() ? formatCurrency(data()!.total_hari_ini) : 'Rp 0'}
                      </td>
                      <td class="py-3 px-4 text-blue-600 font-bold">
                        {data() ? formatCurrency(data()!.total_bulan_ini) : 'Rp 0'}
                      </td>
                    </tr>
                    <tr class="hover:bg-gray-50">
                      <td class="py-3 px-4 font-semibold text-gray-800">Tertinggi</td>
                      <td class="py-3 px-4 text-green-600 font-bold">
                        {data() ? formatCurrency(data()!.tertinggi_hari_ini) : 'Rp 0'}
                      </td>
                      <td class="py-3 px-4 text-green-600 font-bold">
                        {data() ? formatCurrency(data()!.tertinggi_bulan_ini) : 'Rp 0'}
                      </td>
                    </tr>
                    <tr class="hover:bg-gray-50">
                      <td class="py-3 px-4 font-semibold text-gray-800">Terendah</td>
                      <td class="py-3 px-4 text-orange-600 font-bold">
                        {data() ? formatCurrency(data()!.terendah_hari_ini) : 'Rp 0'}
                      </td>
                      <td class="py-3 px-4 text-orange-600 font-bold">
                        {data() ? formatCurrency(data()!.terendah_bulan_ini) : 'Rp 0'}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              
              {/* Quick stats cards */}
              <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
                <div class="bg-blue-50 p-4 rounded-lg text-center">
                  <div class="text-xs text-gray-600 uppercase">Rata-rata Harian</div>
                  <div class="text-lg font-bold text-blue-600">
                    {data() && data()!.total_bulan_ini > 0 ? formatToMillions(data()!.total_bulan_ini / 30) : '0'}
                  </div>
                </div>
                <div class="bg-green-50 p-4 rounded-lg text-center">
                  <div class="text-xs text-gray-600 uppercase">Proyeksi 30 Hari</div>
                  <div class="text-lg font-bold text-green-600">
                    {data() && data()!.total_hari_ini > 0 ? formatToMillions(data()!.total_hari_ini * 30) : '0'}
                  </div>
                  <div class="text-xs text-gray-500 mt-1">Berdasarkan hari ini</div>
                </div>
                <div class="bg-yellow-50 p-4 rounded-lg text-center">
                  <div class="text-xs text-gray-600 uppercase">Sisa Bulan</div>
                  <div class="text-lg font-bold text-yellow-600">
                    {30 - new Date().getDate()} hari
                  </div>
                </div>
                <div class="bg-purple-50 p-4 rounded-lg text-center">
                  <div class="text-xs text-gray-600 uppercase">Transaksi</div>
                  <div class="text-lg font-bold text-purple-600">
                    {data()?.transaksi_terakhir?.length || 0}
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
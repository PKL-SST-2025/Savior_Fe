import { createSignal, onMount, onCleanup } from "solid-js";
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

const Statistik = () => {
  const [filter, setFilter] = createSignal("Please select");
  const [legendColors, setLegendColors] = createSignal<string[]>([]);

  let chartDiv: HTMLDivElement | undefined;

  // Data chart
  const chartData = [
    { category: "$ 0 - $ 20,000", value: 20, color: am5.color(0x2563eb) }, // blue-600
    { category: "$ 20,000 - $ 30,000", value: 25, color: am5.color(0x4ade80) }, // green-400
    { category: "$ 30,000 - $ 60,000", value: 40, color: am5.color(0xf472b6) }, // pink-400
    { category: "more than $ 60,000", value: 15, color: am5.color(0xfacc15) }, // yellow-400
  ];

  onMount(() => {
    let root = am5.Root.new(chartDiv!);
    root.setThemes([am5themes_Animated.new(root)]);
    let chart = root.container.children.push(
      am5percent.PieChart.new(root, {
        layout: root.horizontalLayout,
      })
    );
    let series = chart.series.push(
      am5percent.PieSeries.new(root, {
        name: "Expenditure",
        categoryField: "category",
        valueField: "value",
        radius: am5.percent(70),
        innerRadius: am5.percent(20),
      })
    );
    series.data.setAll(chartData);

    // Set custom colors for each slice based on chartData.color
    series.slices.template.adapters.add("fill", (fill, target) => {
      const dataContext = target.dataItem?.dataContext as any;
      if (!dataContext) return fill;
      return dataContext.color ?? fill;
    });
    series.slices.template.adapters.add("stroke", (stroke, target) => {
      const dataContext = target.dataItem?.dataContext as any;
      if (!dataContext) return stroke;
      return dataContext.color ?? stroke;
    });

    // Ambil warna slice donut setelah chart valid
    series.events.on("datavalidated", () => {
      const colors = series.slices.values.map(slice =>
        slice.get("fill")?.toCSSHex() ?? "#ccc"
      );
      setLegendColors(colors);
    });

    series.appear(1000, 100);

    onCleanup(() => {
      root.dispose();
    });
  });

  // Data legend (label dan persentase)
  const legendLabels = [
    { label: "$ 0 - $ 20,000", percent: "20%" },
    { label: "$ 20,000 - $ 30,000", percent: "25%" },
    { label: "$ 30,000 - $ 60,000", percent: "40%" },
    { label: "more than $ 60,000", percent: "15%" },
  ];

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
            <li class="py-2 rounded px-4 cursor-pointer whitespace-nowrap flex items-center gap-3 hover:bg-[#314574]">
              <img src={kategoriIcon} alt="Kategori" class="w-5 h-5" />
              <a href="/Kategori">Kategori</a>
            </li>
            <li class="py-2 rounded px-4 cursor-pointer whitespace-nowrap flex items-center gap-3 bg-blue-600">
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
          <div class="flex items-center gap-2"></div>
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
        {/* Content */}
        <main class="flex-1 flex flex-col items-center justify-center p-2 md:p-10">
          <div class="bg-white rounded-lg shadow p-2 md:p-8 w-full max-w-3xl">
            <div class="mb-8 flex flex-col md:flex-row items-center justify-between gap-4 bg-white rounded-full shadow p-4 md:p-6">
              <h2 class="text-xl font-bold text-[#2f2f4f] text-center md:text-left mb-2 md:mb-0">
                STATISTIK PENGELUARAN
              </h2>
              <div class="flex items-center gap-2">
                <span class="text-gray-600 font-semibold">FILTER:</span>
                <select
                  class="p-2 border rounded bg-white"
                  value={filter()}
                  onChange={(e) => setFilter(e.target.value)}
                >
                  <option value="Please select">Please select</option>
                  <option value="Daily">Daily</option>
                  <option value="Weekly">Weekly</option>
                  <option value="Monthly">Monthly</option>
                </select>
              </div>
            </div>
            <div class="flex flex-col gap-8">
              <div class="flex items-center justify-center w-full bg-white rounded-3xl shadow p-2 md:p-8">
               <div
  ref={chartDiv}
  style="width:100%;max-width:320px;height:220px;min-height:180px;margin:0 auto;"
  class="bg-white"
></div>
</div>
            </div>
            <div class="flex flex-col gap-8">
              <div class="flex flex-col items-center">
                <div class="bg-white rounded-3xl shadow p-4 md:p-8 flex flex-col items-center w-full">
                  <div class="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-8 w-full">
                    <div class="flex items-center justify-center w-full bg-white rounded-3xl shadow p-4 md:p-8">
                      <div class="flex flex-col md:flex-row items-center justify-center w-full gap-4 md:gap-8">
                        {/* Legend */}
                        <div class="flex flex-col gap-4 md:ml-8">
                          {legendLabels.map((item, i) => (
                            <div class="flex items-center gap-2">
                              <span
                                class="w-3 h-3 inline-block rounded-full"
                                style={`background-color: ${legendColors()[i] || "#ccc"};`}
                              ></span>
                              <span class="text-[#2f2f4f] text-xs md:text-base">
                                {item.label}
                              </span>
                              <span class="text-[#2f2f4f] font-bold ml-4 md:ml-8 text-xs md:text-base">
                                {item.percent}
                              </span>
                            </div>
                          ))}
                        </div>
                        {/* End Legend */}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div class="bg-white rounded-lg shadow p-4 md:p-6 w-full max-w-lg text-center mx-auto">
                <p class="text-gray-800 font-bold text-base md:text-lg">
                  TOTAL PENGELUARAN: 1,5JT
                </p>
                <p class="text-gray-800 font-bold text-base md:text-lg">
                  RATA RATA HARIAN: RP 50K
                </p>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Statistik;
import { createSignal, onMount } from "solid-js";
import { useNavigate } from "@solidjs/router";
import tambahTransaksiIcon from "../assets/tambah.png";
import riwayatIcon from "../assets/riwayat.png";
import dashboardIcon from "../assets/dashboard.png";
import budgetIcon from "../assets/budget.png";
import kategoriIcon from "../assets/kategori.png";
import statistikIcon from "../assets/statistik.png";
import profileIcon from "../assets/profile.png";
import saviorLogo from '../assets/Savior Putih.png';

const Profile = () => {
  const navigate = useNavigate();
  
  // Profile state
  const [firstName, setFirstName] = createSignal("");
  const [lastName, setLastName] = createSignal("");
  const [email, setEmail] = createSignal("");
  const [userId, setUserId] = createSignal("");
  
  // Loading and error states
  const [loading, setLoading] = createSignal(false);
  const [saving, setSaving] = createSignal(false);
  const [error, setError] = createSignal("");
  const [success, setSuccess] = createSignal("");

  // Email/Password update states
  const [showEmailModal, setShowEmailModal] = createSignal(false);
  const [showPasswordModal, setShowPasswordModal] = createSignal(false);
  const [newEmail, setNewEmail] = createSignal("");
  const [currentPassword, setCurrentPassword] = createSignal("");
  const [newPassword, setNewPassword] = createSignal("");
  const [confirmPassword, setConfirmPassword] = createSignal("");
  const [sidebarOpen, setSidebarOpen] = createSignal(true);

  // Function to get username for avatar
  const getUserName = () => {
    // Use first name if available, otherwise fallback to 'User'
    return firstName() || 'User';
  };

  // Load profile data on mount
  onMount(async () => {
    const storedUserId = localStorage.getItem('user_id');
    
    if (!storedUserId) {
      navigate('/SignIn');
      return;
    }
    
    setUserId(storedUserId);
    setLoading(true);
    await loadProfile(storedUserId);
  });

  const loadProfile = async (userIdParam: string) => {
    try {
      const response = await fetch(`https://hosting-albertus-production.up.railway.app/api/profile/${userIdParam}`);
      const data = await response.json();
      
      if (response.ok && data.profile) {
        setFirstName(data.profile.first_name || "");
        setLastName(data.profile.last_name || "");
        setEmail(data.profile.email || "");
        setError("");
      } else {
        setError("Failed to load profile: " + (data.message || "Unknown error"));
      }
    } catch (err) {
      setError("Failed to connect to server");
      console.error('Profile load error:', err);
    }
    
    setLoading(false);
  };

  const updateProfile = async () => {
    if (!userId()) return;
    
    try {
      setSaving(true);
      setError("");

      const response = await fetch(`https://hosting-albertus-production.up.railway.app/api/profile/${userId()}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          first_name: firstName(),
          last_name: lastName()
        })
      });
      
      const data = await response.json();
      
      if (response.ok) {
        setSuccess("Profile updated successfully!");
        setTimeout(() => setSuccess(""), 3000);
      } else {
        setError(data.message || "Failed to update profile");
      }
    } catch (err) {
      setError("Failed to connect to server");
      console.error('Profile update error:', err);
    } finally {
      setSaving(false);
    }
  };

  const updateEmail = async () => {
    if (!userId() || !newEmail() || !currentPassword()) {
      setError("Please fill all required fields");
      return;
    }
    
    try {
      setSaving(true);
      setError("");

      const response = await fetch(`https://hosting-albertus-production.up.railway.app/api/profile/${userId()}/email`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          new_email: newEmail(),
          password: currentPassword()
        })
      });
      
      const data = await response.json();
      
      if (response.ok) {
        setEmail(newEmail());
        setSuccess("Email updated successfully!");
        setShowEmailModal(false);
        setNewEmail("");
        setCurrentPassword("");
        setTimeout(() => setSuccess(""), 3000);
      } else {
        setError(data.message || "Failed to update email");
      }
    } catch (err) {
      setError("Failed to connect to server");
      console.error('Email update error:', err);
    } finally {
      setSaving(false);
    }
  };

  const updatePassword = async () => {
    if (!userId() || !currentPassword() || !newPassword() || !confirmPassword()) {
      setError("Please fill all required fields");
      return;
    }

    if (newPassword() !== confirmPassword()) {
      setError("New passwords do not match");
      return;
    }

    if (newPassword().length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }
    
    try {
      setSaving(true);
      setError("");
      
      const response = await fetch(`https://hosting-albertus-production.up.railway.app/api/profile/${userId()}/password`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          current_password: currentPassword(),
          new_password: newPassword()
        })
      });
      
      const data = await response.json();
      
      if (response.ok) {
        setSuccess("Password updated successfully!");
        setShowPasswordModal(false);
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
        setTimeout(() => setSuccess(""), 3000);
      } else {
        setError(data.message || "Failed to update password");
      }
    } catch (err) {
      setError("Failed to connect to server");
      console.error('Password update error:', err);
    } finally {
      setSaving(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('user_id');
    navigate('/SignIn');
  };

  if (loading()) {
    return (
      <div class="flex items-center justify-center min-h-screen bg-[#f8f9fc]">
        <div class="text-center">
          <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p class="text-gray-500">Loading profile...</p>
        </div>
      </div>
    );
  }

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
              <a href="/Profile" class={`flex items-center ${sidebarOpen() ? 'gap-3 px-4' : 'justify-center px-2'} py-3 rounded-lg bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow-lg group relative`}>
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
            <h1 class="text-xl font-bold text-gray-800">PROFILE SETTINGS</h1>
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
                    <div class="font-medium">{firstName()} {lastName()}</div>
                    <div class="text-gray-500">{email()}</div>
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
            {/* Error/Success Messages */}
            {error() && (
              <div class="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg">
                {error()}
              </div>
            )}

            {success() && (
              <div class="mb-6 p-4 bg-green-50 border border-green-200 text-green-700 rounded-lg">
                {success()}
              </div>
            )}

            {/* Profile Details */}
            <div class="bg-white rounded-xl shadow-sm p-8 mb-8">
              <h2 class="text-xl font-bold text-gray-800 mb-6">PROFILE DETAILS</h2>
              
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">First Name</label>
                  <input
                    type="text"
                    value={firstName()}
                    onInput={(e) => setFirstName(e.target.value)}
                    class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter first name"
                  />
                </div>
                
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Last Name</label>
                  <input
                    type="text"
                    value={lastName()}
                    onInput={(e) => setLastName(e.target.value)}
                    class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter last name"
                  />
                </div>
              </div>
            </div>

            {/* Privacy & Security */}
            <div class="bg-white rounded-xl shadow-sm p-8">
              <h2 class="text-xl font-bold text-gray-800 mb-6">PRIVACY & SECURITY</h2>
              
              <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Email Section */}
                <div>
                  <div class="flex justify-between items-center mb-3">
                    <h3 class="text-sm font-medium text-gray-700 uppercase">EMAIL ADDRESS</h3>
                    <button 
                      onClick={() => setShowEmailModal(true)}
                      class="px-4 py-2 text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-50 transition-colors"
                    >
                      Edit
                    </button>
                  </div>
                  <div class="p-3 bg-gray-50 rounded-lg">
                    <span class="text-gray-800">{email()}</span>
                  </div>
                </div>

                {/* Password Section */}
                <div>
                  <div class="flex justify-between items-center mb-3">
                    <h3 class="text-sm font-medium text-gray-700 uppercase">PASSWORD</h3>
                    <button 
                      onClick={() => setShowPasswordModal(true)}
                      class="px-4 py-2 text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-50 transition-colors"
                    >
                      Edit
                    </button>
                  </div>
                  <div class="p-3 bg-gray-50 rounded-lg">
                    <span class="text-gray-800">••••••••</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div class="flex flex-col sm:flex-row gap-4 mt-8 justify-end">
                <button
                  onClick={() => {
                    setFirstName("");
                    setLastName("");
                    loadProfile(userId());
                  }}
                  class="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={updateProfile}
                  disabled={saving()}
                  class="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {saving() ? "Saving..." : "Save"}
                </button>
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Email Update Modal */}
      {showEmailModal() && (
        <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div class="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <h3 class="text-lg font-bold mb-4">Update Email Address</h3>
            
            <div class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">New Email</label>
                <input
                  type="email"
                  value={newEmail()}
                  onInput={(e) => setNewEmail(e.target.value)}
                  class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter new email"
                />
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Current Password</label>
                <input
                  type="password"
                  value={currentPassword()}
                  onInput={(e) => setCurrentPassword(e.target.value)}
                  class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter current password"
                />
              </div>
            </div>
            
            <div class="flex gap-3 mt-6">
              <button
                onClick={() => {
                  setShowEmailModal(false);
                  setNewEmail("");
                  setCurrentPassword("");
                  setError("");
                }}
                class="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={updateEmail}
                disabled={saving()}
                class="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
              >
                {saving() ? "Updating..." : "Update Email"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Password Update Modal */}
      {showPasswordModal() && (
        <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div class="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <h3 class="text-lg font-bold mb-4">Update Password</h3>
            
            <div class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Current Password</label>
                <input
                  type="password"
                  value={currentPassword()}
                  onInput={(e) => setCurrentPassword(e.target.value)}
                  class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter current password"
                />
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">New Password</label>
                <input
                  type="password"
                  value={newPassword()}
                  onInput={(e) => setNewPassword(e.target.value)}
                  class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter new password"
                />
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Confirm New Password</label>
                <input
                  type="password"
                  value={confirmPassword()}
                  onInput={(e) => setConfirmPassword(e.target.value)}
                  class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Confirm new password"
                />
              </div>
            </div>
            
            <div class="flex gap-3 mt-6">
              <button
                onClick={() => {
                  setShowPasswordModal(false);
                  setCurrentPassword("");
                  setNewPassword("");
                  setConfirmPassword("");
                  setError("");
                }}
                class="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={updatePassword}
                disabled={saving()}
                class="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
              >
                {saving() ? "Updating..." : "Update Password"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;

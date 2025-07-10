import { Component, createSignal } from 'solid-js';
import bannerImg from '../assets/banner.png';

export default function ForgotPassword() {
  const [password, setPassword] = createSignal("");
  const [confirmPassword, setConfirmPassword] = createSignal("");

  const handleSend = () => {
    // Logika reset password
    if (password() !== confirmPassword()) {
      alert("Password tidak sama!");
      return;
    }
    console.log("Password reset to:", password());
  };

  return (
    <div class="flex min-h-screen">
      {/* Left side */}
      <div
        class="hidden md:flex w-1/2 relative flex-col justify-between"
        style={`background-image: url(${bannerImg}); background-size: cover; background-position: bottom;`}
      >
        {/* Overlay gradient */}
        <div class="absolute inset-0 bg-[#111E5A]/80" />
        {/* Top Centered text */}
        <div class="absolute top-0 left-0 w-full flex flex-col items-center pt-16 z-10">
          <h1 class="text-3xl md:text-4xl font-bold text-white text-center w-full max-w-xs">
            DO IT <span class="text-blue-300">NOW</span>
          </h1>
          <h2 class="text-2xl md:text-3xl font-bold text-white text-center w-full max-w-xs mt-2">
            SOMTIMES <span class="text-blue-300">LATER</span>
          </h2>
          <h3 class="text-xl md:text-2xl font-bold text-white text-center w-full max-w-xs mt-2">
            BECOMES <span class="text-blue-300">NEVER</span>
          </h3>
        </div>
        {/* Terms & Conditions */}
        <div class="absolute bottom-4 left-8 z-10 text-xs text-gray-300">
          Terms & Conditions | Privacy Policy
        </div>
      </div>
      {/* Right side */}
      <div class="w-full md:w-1/2 flex flex-col justify-center items-center p-8">
        <div class="absolute top-6 right-10 text-sm">
          Don’t have an account?
          <a href="/signup" class="ml-1 text-blue-600 font-semibold">Get started</a>
        </div>

        <div class="w-full max-w-md">
          <h2 class="text-2xl font-bold mb-2 text-center">RESET PASSWORD</h2>
          <p class="text-gray-600 text-center mb-6">
            Don’t worry! Enter your new password to reset password.
          </p>

          <input
            type="password"
            placeholder="New password"
            class="w-full border rounded px-4 py-2 mb-4"
            value={password()}
            onInput={(e) => setPassword(e.currentTarget.value)}
          />
          <input
            type="password"
            placeholder="Confirm new password"
            class="w-full border rounded px-4 py-2 mb-4"
            value={confirmPassword()}
            onInput={(e) => setConfirmPassword(e.currentTarget.value)}
          />

          <button
            onClick={handleSend}
            class="w-full bg-gradient-to-r from-blue-500 to-indigo-500 text-white font-semibold py-2 rounded-full shadow hover:opacity-90 text-base"
          >
            Reset Password
          </button>

          <div class="mt-6 text-sm text-center text-gray-600">
            Remember your password?
            <a href="/signin" class="ml-2 text-blue-600 font-medium">← Sign in</a>
          </div>
        </div>
      </div>
    </div>
  );
}

import { createSignal } from 'solid-js';
import bannerImg from '../assets/Banner.png';

export default function ForgotPassword() {
  const [password, setPassword] = createSignal('');
  const [confirmPassword, setConfirmPassword] = createSignal('');
  const [error, setError] = createSignal('');
  const [success, setSuccess] = createSignal(false);

  const handleSend = () => {
    if (!password() || !confirmPassword()) {
      setError('Silakan isi kedua kolom password.');
      return;
    }
    if (password() !== confirmPassword()) {
      setError('Password tidak sama!');
      return;
    }

    // Reset berhasil (simulasi)
    console.log('Password reset to:', password());
    setError('');
    setSuccess(true);
  };

  return (
    <div class="flex flex-col md:flex-row min-h-screen overflow-y-auto">
      {/* LEFT SIDE */}
      <div
        class="hidden md:flex md:w-1/2 relative bg-cover bg-bottom"
        style={{
          'background-image': `url(${bannerImg})`,
        }}
      >
        <div class="absolute inset-0 bg-[#111E5A]/80" />
        <div class="absolute top-0 left-0 w-full flex flex-col items-center pt-16 z-10 text-center px-4">
          <h1 class="text-3xl md:text-4xl font-bold text-white">
            DO IT <span class="text-blue-300">NOW</span>
          </h1>
          <h2 class="text-2xl md:text-3xl font-bold text-white mt-2">
            SOMETIMES <span class="text-blue-300">LATER</span>
          </h2>
          <h3 class="text-xl md:text-2xl font-bold text-white mt-2">
            BECOMES <span class="text-blue-300">NEVER</span>
          </h3>
        </div>
        <div class="absolute bottom-4 left-8 z-10 text-xs text-gray-300">
          Terms & Conditions | Privacy Policy
        </div>
      </div>

      {/* RIGHT SIDE */}
      <div class="w-full md:w-1/2 flex flex-col justify-center items-center p-6 md:p-10">
        <div class="w-full max-w-md">
          <div class="mb-6 text-right text-sm">
            Don’t have an account?
            <a href="/signup" class="ml-1 text-blue-600 font-semibold hover:underline">Get started</a>
          </div>

          <h2 class="text-2xl font-bold text-center mb-2">RESET PASSWORD</h2>
          <p class="text-gray-600 text-center mb-6">
            Don’t worry! Enter your new password to reset it.
          </p>

          <input
            type="password"
            placeholder="New password"
            class="w-full border border-gray-300 px-4 py-2 rounded mb-4"
            value={password()}
            onInput={(e) => setPassword(e.currentTarget.value)}
          />
          <input
            type="password"
            placeholder="Confirm new password"
            class="w-full border border-gray-300 px-4 py-2 rounded mb-4"
            value={confirmPassword()}
            onInput={(e) => setConfirmPassword(e.currentTarget.value)}
          />

          {error() && <div class="text-red-500 text-sm mb-3">{error()}</div>}
          {success() && (
            <div class="text-green-600 text-sm mb-3">Password berhasil direset!</div>
          )}

          <button
            onClick={handleSend}
            class="w-full bg-gradient-to-r from-blue-500 to-indigo-500 text-white font-semibold py-2 rounded-full shadow hover:opacity-90 transition"
          >
            Reset Password
          </button>

          <div class="mt-6 text-sm text-center text-gray-600">
            Remember your password?
            <a href="/signin" class="ml-2 text-blue-600 font-medium hover:underline">← Sign in</a>
          </div>
        </div>
      </div>
    </div>
  );
}

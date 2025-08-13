import { Component, createSignal } from 'solid-js';
import { useNavigate } from '@solidjs/router';
import bannerImg from '../assets/Banner.png';

const SignupPage: Component = () => {
  const [email, setEmail] = createSignal('');
  const [password, setPassword] = createSignal('');
  const [error, setError] = createSignal('');
  const [loading, setLoading] = createSignal(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: Event) => {
    e.preventDefault();
    if (!email() || !password()) {
      setError('Email dan password wajib diisi.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await fetch('hosting-albertus-production.up.railway.app/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email(), password: password() })
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || 'Terjadi kesalahan.');
        return;
      }

      // Jika sukses, tampilkan pesan sukses dan redirect ke sign in
      alert('Akun berhasil dibuat! Silakan login.');
      navigate('/SignIn');
    } catch (err) {
      console.error('Signup error:', err);
      setError('Gagal terhubung ke server.');
    } finally {
      setLoading(false);
    }
  };


  return (
    <div class="flex flex-col md:flex-row min-h-screen overflow-y-auto">
      {/* Left Side - Banner */}
      <div
        class="hidden md:flex md:w-1/2 relative flex-col justify-between bg-cover bg-center bg-no-repeat"
        style={{
          'background-image': `url(${bannerImg})`,
        }}
      >
        {/* Overlay */}
        <div class="absolute inset-0 bg-[#111E5A]/80" />
        {/* Text Content */}
        <div class="absolute top-0 left-0 w-full flex flex-col items-center pt-16 z-10 text-center px-4">
          <h1 class="text-2xl sm:text-3xl md:text-4xl font-bold text-white">
            DO IT <span class="text-blue-300">NOW</span>
          </h1>
          <h2 class="text-xl sm:text-2xl md:text-3xl font-bold text-white mt-2">
            SOMETIMES <span class="text-blue-300">LATER</span>
          </h2>
          <h3 class="text-lg sm:text-xl md:text-2xl font-bold text-white mt-2">
            BECOMES <span class="text-blue-300">NEVER</span>
          </h3>
        </div>
        {/* Footer Terms */}
        <div class="absolute bottom-4 left-8 z-10 text-xs text-gray-300">
          Terms & Conditions | Privacy Policy
        </div>
      </div>

      {/* Right Side - Form */}
      <div class="flex flex-col justify-center items-center w-full md:w-1/2 px-4 py-8 md:py-0">
        <div class="w-full max-w-sm sm:max-w-md md:max-w-lg">
          {/* Sign In Link */}
          <div class="text-right mb-4">
            <span class="text-sm text-gray-500">Already have an account?</span>
            <button
              class="ml-2 text-sm text-blue-600 border border-blue-600 px-3 py-1 rounded-full hover:bg-blue-600 hover:text-white transition"
              onClick={() => navigate('/SignIn')}
            >
              Sign in
            </button>
          </div>

          {/* Heading */}
          <h2 class="text-2xl font-bold mb-2">CREATE AN ACCOUNT</h2>
          <p class="text-sm text-gray-500 mb-6">
            Create your account to start managing your wealth.
          </p>

          {/* Form */}
          <form class="space-y-4" onSubmit={handleSubmit}>
            <div>
              <label class="block text-sm font-medium mb-1">Email address</label>
              <input
                type="email"
                placeholder="sample@gmail.com"
                class="w-full border border-gray-300 px-4 py-2 rounded"
                value={email()}
                onInput={e => setEmail(e.currentTarget.value)}
              />
            </div>
            <div>
              <label class="block text-sm font-medium mb-1">Password</label>
              <input
                type="password"
                class="w-full border border-gray-300 px-4 py-2 rounded"
                value={password()}
                onInput={e => setPassword(e.currentTarget.value)}
              />
            </div>
            {error() && (
              <div class="text-red-500 text-sm">{error()}</div>
            )}
            <p class="text-xs text-gray-500">
              By creating account, you agree to our{' '}
              <span class="text-blue-600 font-semibold">Terms & Conditions</span>
            </p>
            <button
              type="submit"
              class="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
              disabled={loading()}
            >
              {loading() ? 'Creating account...' : 'Create an account'}
            </button>
          </form>

          {/* Social Media */}
          <div class="my-4 text-center text-sm text-gray-400">Or create an account using:</div>
          <div class="flex flex-col sm:flex-row justify-center gap-3 sm:space-x-4">
            <button class="px-4 py-2 border rounded hover:bg-gray-100 w-full sm:w-auto">
              Facebook
            </button>
            <button class="px-4 py-2 border rounded hover:bg-gray-100 w-full sm:w-auto">
              Google
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;

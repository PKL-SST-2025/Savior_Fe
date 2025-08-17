import { Component, createSignal } from 'solid-js';
import { useNavigate } from '@solidjs/router';
import bannerImg from '../assets/Banner.png';

const SignIn: Component = () => {
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
      const response = await fetch('https://hosting-albertus-production.up.railway.app/signin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email(), password: password() })
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || 'Email atau password salah.');
        return;
      }

      // Simpan user_id ke localStorage jika diperlukan
      if (data.user_id) {
        localStorage.setItem('user_id', data.user_id);
      }

      // Jika sukses, arahkan ke dashboard
      setError('');
      navigate('/dashboard');
    } catch (err) {
      console.error('Login error:', err);
      setError('Gagal terhubung ke server.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div class="flex flex-col md:flex-row min-h-screen overflow-y-auto">
      {/* Left side - Banner */}
      <div
        class="hidden md:flex md:w-1/2 relative flex-col justify-between bg-cover bg-center"
        style={{
          'background-image': `url(${bannerImg})`,
        }}
      >
        {/* Overlay gradient */}
        <div class="absolute inset-0 bg-[#111E5A]/80" />
        {/* Centered Text */}
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

      {/* Right side - Form */}
      <div class="flex flex-col justify-center items-center w-full md:w-1/2 px-4 py-8 md:py-0">
        <div class="w-full max-w-sm sm:max-w-md md:max-w-lg">
          {/* Sign up prompt */}
          <div class="text-right mb-4">
            <span class="text-sm text-gray-500">Don’t have an account?</span>
            <button
              class="ml-2 text-sm text-blue-600 border border-blue-600 px-3 py-1 rounded-full hover:bg-blue-600 hover:text-white transition"
              type="button"
              onClick={() => navigate('/SignUp')}
            >
              Get started
            </button>
          </div>

          {/* Header */}
          <h2 class="text-2xl font-bold mb-2">WELCOME TO SAVIOR!</h2>
          <p class="text-sm text-gray-500 mb-6">
            Sign in and start managing your wealth account.
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
            <div class="flex items-center justify-between text-sm">
              <label class="flex items-center">
                <input type="checkbox" class="mr-2" />
                Remember me
              </label>
              <a
                href="/ForgotPassword"
                class="text-blue-600 hover:underline"
                onClick={(e) => {
                  e.preventDefault();
                  navigate('/ForgotPassword');
                }}
              >
                Forgot Password?
              </a>
            </div>
            <button
              class="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
              type="submit"
              disabled={loading()}
            >
              {loading() ? 'Signing in...' : 'Sign in'}
            </button>
          </form>

          {/* Social login */}
          <div class="my-4 text-center text-sm text-gray-400">Or sign in using:</div>
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

export default SignIn;

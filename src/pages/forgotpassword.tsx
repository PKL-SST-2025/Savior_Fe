import { createSignal } from "solid-js";
import { useNavigate } from "@solidjs/router";
import bannerImg from '../assets/Banner.png';

const ForgotPassword = () => {
  const [email, setEmail] = createSignal("");
  const [newPassword, setNewPassword] = createSignal("");
  const [confirmPassword, setConfirmPassword] = createSignal("");
  const [loading, setLoading] = createSignal(false);
  const [message, setMessage] = createSignal("");
  const [error, setError] = createSignal("");

  const navigate = useNavigate();
  const BASE_URL = 'hosting-albertus-production.up.railway.app';

  const handleSubmit = async (e: Event) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setMessage("");

    // Client-side validation
    if (newPassword() !== confirmPassword()) {
      setError("Passwords don't match");
      setLoading(false);
      return;
    }

    if (newPassword().length < 6) {
      setError("Password must be at least 6 characters long");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(`${BASE_URL}/forgot-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email(),
          new_password: newPassword(),
          confirm_password: confirmPassword(),
        }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setMessage("Password reset successfully! Redirecting to sign in...");
        setTimeout(() => {
          navigate('/signin');
        }, 2000);
      } else {
        setError(data.message || 'Failed to reset password');
      }
    } catch (err) {
      setError('Failed to connect to server');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div class="min-h-screen flex">
      {/* Left Side - Design */}
      <div class="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-blue-900 via-blue-800 to-blue-900 relative overflow-hidden">
        {/* Background Image */}
        <div class="absolute inset-0">
          <img 
            src={bannerImg} 
            alt="Banner" 
            class="w-full h-full object-cover"
          />
          <div class="absolute inset-0 bg-black/40"></div>
        </div>
        
        {/* Content Overlay */}
        <div class="relative z-10 flex flex-col justify-center items-start p-12 text-white">
          <h1 class="text-5xl font-bold mb-4 leading-tight">
            DO IT <span class="text-blue-300">NOW</span><br/>
            SOMETIMES <span class="text-blue-300">LATER</span><br/>
            BECOMES <span class="text-blue-300">NEVER</span>
          </h1>
        </div>
        
        {/* Geometric Pattern - Optional, can be removed if not needed */}
        <div class="absolute bottom-0 right-0 w-96 h-96 opacity-10">
          <div class="w-full h-full bg-gradient-to-tr from-transparent via-blue-400 to-blue-300 transform rotate-45 translate-x-1/2 translate-y-1/2"></div>
        </div>
      </div>

      {/* Right Side - Form */}
      <div class="w-full lg:w-1/2 flex items-center justify-center p-8 bg-gray-50">
        <div class="w-full max-w-md">
          {/* Header */}
          <div class="text-right mb-8">
            <span class="text-gray-500 text-sm">Don't have an account? </span>
            <a href="/signup" class="text-blue-600 hover:text-blue-700 font-medium">
              Get started
            </a>
          </div>

          {/* Form */}
          <div class="bg-white rounded-lg shadow-lg p-8">
            <h2 class="text-2xl font-bold text-center text-gray-800 mb-2">
              FORGOT PASSWORD?
            </h2>
            <p class="text-center text-gray-600 mb-8">
              Don't worry! Enter your new password to reset password.
            </p>

            {/* Success/Error Messages */}
            {message() && (
              <div class="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                <p class="text-green-700 text-sm text-center">{message()}</p>
              </div>
            )}

            {error() && (
              <div class="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                <p class="text-red-700 text-sm text-center">{error()}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} class="space-y-6">
              {/* Email */}
              <div>
                <input
                  type="email"
                  value={email()}
                  onInput={(e) => setEmail(e.currentTarget.value)}
                  required
                  class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                  placeholder="Your Email"
                  disabled={loading()}
                />
              </div>

              {/* New Password */}
              <div>
                <input
                  type="password"
                  value={newPassword()}
                  onInput={(e) => setNewPassword(e.currentTarget.value)}
                  required
                  minLength={6}
                  class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                  placeholder="New Password"
                  disabled={loading()}
                />
              </div>

              {/* Confirm New Password */}
              <div>
                <input
                  type="password"
                  value={confirmPassword()}
                  onInput={(e) => setConfirmPassword(e.currentTarget.value)}
                  required
                  minLength={6}
                  class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                  placeholder="Confirm New Password"
                  disabled={loading()}
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading()}
                class="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading() ? "Resetting..." : "Send"}
              </button>

              {/* Back to Sign In */}
              <div class="text-center">
                <span class="text-gray-600 text-sm">Remember your password? </span>
                <a href="/signin" class="text-blue-600 hover:text-blue-700 font-medium text-sm">
                  Sign In
                </a>
              </div>
            </form>
          </div>

          {/* Footer */}
          <div class="text-center mt-8 text-gray-500 text-xs">
            <a href="#" class="hover:text-gray-700">Terms & Conditions</a>
            <span class="mx-2">|</span>
            <a href="#" class="hover:text-gray-700">Privacy Policy</a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
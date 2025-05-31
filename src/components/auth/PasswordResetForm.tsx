
import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '@/services/auth/authService';

export function PasswordResetForm() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [rateLimitMsg, setRateLimitMsg] = useState<string | null>(null);
  const lastSubmitRef = useRef<number>(0);
  const RATE_LIMIT_MS = 3000;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setRateLimitMsg(null);
    const now = Date.now();
    if (now - lastSubmitRef.current < RATE_LIMIT_MS) {
      setRateLimitMsg('Aguarde alguns segundos antes de tentar novamente.');
      return;
    }
    lastSubmitRef.current = now;
    setIsLoading(true);

    try {
      await authService.requestPasswordReset(email);
      setIsSuccess(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to request password reset');
    } finally {
      setIsLoading(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div>
            <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
              Check your email
            </h2>
            <p className="mt-2 text-center text-sm text-gray-600">
              We have sent you an email with instructions to reset your password.
            </p>
          </div>
          <div className="mt-6">
            <button
              type="button"
              onClick={() => navigate('/login')}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Return to login
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Reset your password
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Enter your email address and we'll send you a link to reset your password.
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="email" className="sr-only">
              Email address
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              className="appearance-none rounded relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          {error && (
            <div className="text-red-500 text-sm text-center">{error}</div>
          )}
          {rateLimitMsg && (
            <div className="text-yellow-600 text-sm text-center">{rateLimitMsg}</div>
          )}

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Sending...' : 'Send reset link'}
            </button>
          </div>

          <div className="text-sm text-center">
            <button
              type="button"
              onClick={() => navigate('/login')}
              className="font-medium text-indigo-600 hover:text-indigo-500"
            >
              Back to login
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

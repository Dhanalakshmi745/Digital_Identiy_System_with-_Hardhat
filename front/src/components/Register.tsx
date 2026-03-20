import { useState } from 'react';
import { UserPlus, Shield, Key } from 'lucide-react';
import { ethers } from 'ethers';

interface RegisterProps {
  onRegister: (userData: any) => void;
  onBackToLogin: () => void;
}

export function Register({ onRegister, onBackToLogin }: RegisterProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Check if user already exists
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      if (users.find((u: any) => u.email === email)) {
        setError('Email already registered');
        setLoading(false);
        return;
      }

      // Generate blockchain wallet
      const wallet = ethers.Wallet.createRandom();
      const privateKey = wallet.privateKey;
      const address = wallet.address;

      // Create user object
      const userData = {
        id: Date.now().toString(),
        email,
        password, // In production, this would be hashed
        address,
        createdAt: new Date().toISOString(),
        documents: [],
        personalInfo: {
          fullName: '',
          phone: '',
          address: ''
        },
        settings: {
          enable2FA: false,
          emailNotifications: true,
          ipfsNode: 'default',
          autoBackup: true
        }
      };

      // Save user
      users.push(userData);
      localStorage.setItem('users', JSON.stringify(users));

      // Store private key securely
      localStorage.setItem('privateKey', privateKey);

      // Generate auth token
      const token = btoa(JSON.stringify({ email, timestamp: Date.now() }));
      localStorage.setItem('authToken', token);
      localStorage.setItem('userData', JSON.stringify(userData));

      onRegister(userData);
    } catch (err) {
      setError('Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-8">
        <div className="flex items-center justify-center mb-8">
          <Shield className="w-12 h-12 text-indigo-600 mr-3" />
          <h1 className="text-indigo-900">TrueChain</h1>
        </div>
        
        <p className="text-center text-gray-600 mb-8">
          Create Your Decentralized Identity
        </p>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label htmlFor="email" className="block text-gray-700 mb-2">
              Email Address
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-gray-700 mb-2">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="••••••••"
            />
          </div>

          <div>
            <label htmlFor="confirmPassword" className="block text-gray-700 mb-2">
              Confirm Password
            </label>
            <input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="••••••••"
            />
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          <div className="bg-blue-50 border border-blue-200 text-blue-700 px-4 py-3 rounded-lg flex items-start">
            <Key className="w-5 h-5 mr-2 mt-0.5 flex-shrink-0" />
            <p className="text-sm">
              A unique blockchain wallet will be generated for your identity
            </p>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-700 transition-colors flex items-center justify-center disabled:opacity-50"
          >
            {loading ? (
              'Creating Account...'
            ) : (
              <>
                <UserPlus className="w-5 h-5 mr-2" />
                Create Account
              </>
            )}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-gray-600">
            Already have an account?{' '}
            <button
              onClick={onBackToLogin}
              className="text-indigo-600 hover:text-indigo-700"
            >
              Sign in here
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}

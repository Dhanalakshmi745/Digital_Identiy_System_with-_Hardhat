import { useState, useEffect, useRef } from 'react';
import { Eye, EyeOff, Copy, Key, AlertTriangle, CheckCircle } from 'lucide-react';

interface PrivateKeyViewProps {
  user: any;
}

export function PrivateKeyView({ user }: PrivateKeyViewProps) {
  const [showKey, setShowKey] = useState(false);
  const [copied, setCopied] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const privateKey = localStorage.getItem('privateKey') || '';

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setShowKey(false);
      }
    };

    if (showKey) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showKey]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(privateKey);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const handleToggleVisibility = () => {
    setShowKey(!showKey);
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-lg shadow-sm p-8">
        <div className="flex items-center mb-4">
          <Key className="w-8 h-8 text-indigo-600 mr-3" />
          <div>
            <h2 className="text-gray-900">Private Key Management</h2>
            <p className="text-gray-600">
              Your blockchain wallet private key
            </p>
          </div>
        </div>

        {/* Warning Box */}
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <div className="flex items-start">
            <AlertTriangle className="w-5 h-5 text-red-600 mr-3 mt-0.5 flex-shrink-0" />
            <div>
              <h4 className="text-red-900 mb-2">Security Warning</h4>
              <ul className="text-sm text-red-700 space-y-1">
                <li>• Never share your private key with anyone</li>
                <li>• Store it in a secure location offline</li>
                <li>• Anyone with your private key has full control of your identity</li>
                <li>• TrueChain will never ask for your private key</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Private Key Display */}
        <div ref={containerRef}>
          <label className="block text-gray-700 mb-2">
            Your Private Key
          </label>
          <div className="relative">
            <div className="bg-gray-50 border border-gray-300 rounded-lg p-4 pr-24">
              {showKey ? (
                <p className="font-mono text-sm text-gray-900 break-all select-all">
                  {privateKey}
                </p>
              ) : (
                <p className="font-mono text-sm text-gray-400">
                  {'•'.repeat(64)}
                </p>
              )}
            </div>
            
            <div className="absolute right-2 top-2 flex space-x-2">
              <button
                onClick={handleToggleVisibility}
                className="p-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                title={showKey ? 'Hide' : 'Show'}
              >
                {showKey ? (
                  <EyeOff className="w-4 h-4 text-gray-600" />
                ) : (
                  <Eye className="w-4 h-4 text-gray-600" />
                )}
              </button>
              
              <button
                onClick={handleCopy}
                className="p-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                title="Copy"
              >
                <Copy className="w-4 h-4 text-gray-600" />
              </button>
            </div>
          </div>

          {copied && (
            <div className="mt-3 bg-green-50 border border-green-200 text-green-700 px-4 py-2 rounded-lg flex items-center">
              <CheckCircle className="w-4 h-4 mr-2" />
              Private key copied to clipboard
            </div>
          )}

          {showKey && (
            <p className="mt-2 text-sm text-gray-600">
              Click outside this area to hide the private key
            </p>
          )}
        </div>

        {/* Public Address */}
        <div className="mt-6">
          <label className="block text-gray-700 mb-2">
            Your Public Address (Safe to Share)
          </label>
          <div className="bg-green-50 border border-green-300 rounded-lg p-4">
            <p className="font-mono text-sm text-gray-900 break-all">
              {user.address}
            </p>
          </div>
        </div>

        {/* Info Box */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-6">
          <h4 className="text-blue-900 mb-2">Understanding Your Keys</h4>
          <div className="text-sm text-blue-700 space-y-2">
            <p>
              <strong>Private Key:</strong> Your secret key that proves ownership of your identity. 
              Keep this extremely secure and never share it.
            </p>
            <p>
              <strong>Public Address:</strong> Your blockchain identity address. You can safely 
              share this with others for verification purposes.
            </p>
          </div>
        </div>

        {/* Backup Recommendation */}
        <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <h4 className="text-yellow-900 mb-2">Backup Recommendation</h4>
          <p className="text-sm text-yellow-700">
            Write down your private key on paper and store it in a secure location. 
            Consider using a hardware wallet or encrypted storage for additional security.
          </p>
        </div>
      </div>
    </div>
  );
}

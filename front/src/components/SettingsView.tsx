import { useState } from 'react';
import { Save, CheckCircle, Bell, Shield, Database, Cloud } from 'lucide-react';

interface SettingsViewProps {
  user: any;
  onUpdate: (data: any) => void;
}

export function SettingsView({ user, onUpdate }: SettingsViewProps) {
  const [settings, setSettings] = useState(user.settings || {
    enable2FA: false,
    emailNotifications: true,
    ipfsNode: 'default',
    autoBackup: true
  });
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleToggle = (key: string) => {
    setSettings({
      ...settings,
      [key]: !settings[key]
    });
  };

  const handleIPFSChange = (value: string) => {
    setSettings({
      ...settings,
      ipfsNode: value
    });
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));

    onUpdate({ settings });

    setSaving(false);
    setSaved(true);

    // Clear saved message after 3 seconds
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-lg shadow-sm p-8">
        <h2 className="text-gray-900 mb-2">Settings & Preferences</h2>
        <p className="text-gray-600 mb-6">
          Configure your TrueChain application settings
        </p>

        <form onSubmit={handleSave} className="space-y-6">
          {/* Security Settings */}
          <div>
            <h3 className="text-gray-900 mb-4 flex items-center">
              <Shield className="w-5 h-5 mr-2 text-indigo-600" />
              Security
            </h3>
            
            <div className="space-y-4">
              <label className="flex items-center justify-between p-4 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors">
                <div>
                  <p className="text-gray-900">Enable Two-Factor Authentication</p>
                  <p className="text-sm text-gray-600">
                    Add an extra layer of security to your account
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={settings.enable2FA}
                  onChange={() => handleToggle('enable2FA')}
                  className="w-5 h-5 text-indigo-600 rounded focus:ring-2 focus:ring-indigo-500"
                />
              </label>
            </div>
          </div>

          {/* Notification Settings */}
          <div>
            <h3 className="text-gray-900 mb-4 flex items-center">
              <Bell className="w-5 h-5 mr-2 text-indigo-600" />
              Notifications
            </h3>
            
            <div className="space-y-4">
              <label className="flex items-center justify-between p-4 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors">
                <div>
                  <p className="text-gray-900">Email Notifications</p>
                  <p className="text-sm text-gray-600">
                    Receive updates about document verification
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={settings.emailNotifications}
                  onChange={() => handleToggle('emailNotifications')}
                  className="w-5 h-5 text-indigo-600 rounded focus:ring-2 focus:ring-indigo-500"
                />
              </label>
            </div>
          </div>

          {/* IPFS Settings */}
          <div>
            <h3 className="text-gray-900 mb-4 flex items-center">
              <Database className="w-5 h-5 mr-2 text-indigo-600" />
              IPFS Configuration
            </h3>
            
            <div>
              <label htmlFor="ipfsNode" className="block text-gray-700 mb-2">
                IPFS Node Selection
              </label>
              <select
                id="ipfsNode"
                value={settings.ipfsNode}
                onChange={(e) => handleIPFSChange(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="default">Default IPFS Gateway</option>
                <option value="infura">Infura IPFS</option>
                <option value="pinata">Pinata</option>
                <option value="custom">Custom Node</option>
              </select>
              <p className="text-sm text-gray-600 mt-2">
                Choose your preferred IPFS gateway for document storage
              </p>
            </div>
          </div>

          {/* Backup Settings */}
          <div>
            <h3 className="text-gray-900 mb-4 flex items-center">
              <Cloud className="w-5 h-5 mr-2 text-indigo-600" />
              Backup & Recovery
            </h3>
            
            <div className="space-y-4">
              <label className="flex items-center justify-between p-4 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors">
                <div>
                  <p className="text-gray-900">Automatic Backups</p>
                  <p className="text-sm text-gray-600">
                    Automatically backup your document metadata
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={settings.autoBackup}
                  onChange={() => handleToggle('autoBackup')}
                  className="w-5 h-5 text-indigo-600 rounded focus:ring-2 focus:ring-indigo-500"
                />
              </label>
            </div>
          </div>

          {/* Info Box */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="text-blue-900 mb-2">About Your Data</h4>
            <p className="text-sm text-blue-700">
              All settings are stored locally and synchronized with your blockchain identity. 
              Your preferences are encrypted and only accessible with your private key.
            </p>
          </div>

          {/* Success Message */}
          {saved && (
            <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg flex items-center">
              <CheckCircle className="w-5 h-5 mr-2 flex-shrink-0" />
              Settings saved successfully!
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={saving}
            className="w-full bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50 flex items-center justify-center"
          >
            {saving ? (
              'Saving...'
            ) : (
              <>
                <Save className="w-5 h-5 mr-2" />
                Save Settings
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}

import { useState } from 'react';
import { Save, User, Phone, MapPin, CheckCircle } from 'lucide-react';

interface PersonalInfoProps {
  user: any;
  onUpdate: (data: any) => void;
}

export function PersonalInfo({ user, onUpdate }: PersonalInfoProps) {
  const [fullName, setFullName] = useState(user.personalInfo?.fullName || '');
  const [phone, setPhone] = useState(user.personalInfo?.phone || '');
  const [address, setAddress] = useState(user.personalInfo?.address || '');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));

    onUpdate({
      personalInfo: {
        fullName,
        phone,
        address
      }
    });

    setSaving(false);
    setSaved(true);

    // Clear saved message after 3 seconds
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-lg shadow-sm p-8">
        <h2 className="text-gray-900 mb-2">Personal Information</h2>
        <p className="text-gray-600 mb-6">
          Manage your self-sovereign identity profile
        </p>

        <form onSubmit={handleSave} className="space-y-6">
          {/* Full Name */}
          <div>
            <label htmlFor="fullName" className="block text-gray-700 mb-2">
              <div className="flex items-center">
                <User className="w-4 h-4 mr-2" />
                Full Name
              </div>
            </label>
            <input
              id="fullName"
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Enter your full name"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* Phone Number */}
          <div>
            <label htmlFor="phone" className="block text-gray-700 mb-2">
              <div className="flex items-center">
                <Phone className="w-4 h-4 mr-2" />
                Phone Number
              </div>
            </label>
            <input
              id="phone"
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+1 (555) 000-0000"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* Address */}
          <div>
            <label htmlFor="address" className="block text-gray-700 mb-2">
              <div className="flex items-center">
                <MapPin className="w-4 h-4 mr-2" />
                Address
              </div>
            </label>
            <textarea
              id="address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              rows={3}
              placeholder="Enter your full address"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* Info Box */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="text-blue-900 mb-2">Self-Sovereign Identity</h4>
            <p className="text-sm text-blue-700">
              Your personal information is stored locally and linked to your blockchain identity. 
              You have full control over your data and who can access it.
            </p>
          </div>

          {/* Success Message */}
          {saved && (
            <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg flex items-center">
              <CheckCircle className="w-5 h-5 mr-2 flex-shrink-0" />
              Personal information saved successfully!
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
                Save Information
              </>
            )}
          </button>
        </form>
      </div>

      {/* Blockchain Address Card */}
      <div className="bg-white rounded-lg shadow-sm p-6 mt-6">
        <h3 className="text-gray-900 mb-3">Your Blockchain Identity</h3>
        <div className="bg-gray-50 rounded-lg p-4">
          <p className="text-sm text-gray-600 mb-2">Ethereum Address</p>
          <p className="font-mono text-sm text-gray-900 break-all">
            {user.address}
          </p>
        </div>
        <p className="text-sm text-gray-600 mt-3">
          This address is cryptographically linked to your identity and ensures 
          immutability of your verification records.
        </p>
      </div>
    </div>
  );
}

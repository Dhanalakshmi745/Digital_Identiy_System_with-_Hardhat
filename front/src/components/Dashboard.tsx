import { useState, useEffect } from 'react';
import { 
  FileText, 
  Upload, 
  User, 
  Settings, 
  Key, 
  LogOut,
  Shield
} from 'lucide-react';
import { DocumentsView } from './DocumentsView';
import { UploadDocument } from './UploadDocument';
import { PersonalInfo } from './PersonalInfo';
import { SettingsView } from './SettingsView';
import { PrivateKeyView } from './PrivateKeyView';

interface DashboardProps {
  user: any;
  onLogout: () => void;
}

type TabType = 'documents' | 'upload' | 'personal' | 'settings' | 'privateKey';

export function Dashboard({ user, onLogout }: DashboardProps) {
  const [activeTab, setActiveTab] = useState<TabType>('documents');
  const [userData, setUserData] = useState(user);

  useEffect(() => {
    // Sync with localStorage on mount and updates
    const storedData = localStorage.getItem('userData');
    if (storedData) {
      setUserData(JSON.parse(storedData));
    }
  }, []);

  const updateUserData = (newData: any) => {
    const updatedUser = { ...userData, ...newData };
    setUserData(updatedUser);
    localStorage.setItem('userData', JSON.stringify(updatedUser));

    // Update users array
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const userIndex = users.findIndex((u: any) => u.id === updatedUser.id);
    if (userIndex !== -1) {
      users[userIndex] = updatedUser;
      localStorage.setItem('users', JSON.stringify(users));
    }
  };

  const handleLogout = () => {
    if (confirm('Are you sure you want to logout?')) {
      onLogout();
    }
  };

  const tabs = [
    { id: 'documents' as TabType, label: 'Documents', icon: FileText },
    { id: 'upload' as TabType, label: 'Upload', icon: Upload },
    { id: 'personal' as TabType, label: 'Personal Info', icon: User },
    { id: 'privateKey' as TabType, label: 'Private Key', icon: Key },
    { id: 'settings' as TabType, label: 'Settings', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Shield className="w-8 h-8 text-indigo-600 mr-3" />
              <div>
                <h1 className="text-indigo-900">TrueChain</h1>
                <p className="text-gray-600 text-sm">Decentralized Identity System</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="text-right hidden sm:block">
                <p className="text-gray-900">{userData.email}</p>
                <p className="text-sm text-gray-500">
                  {userData.address?.slice(0, 6)}...{userData.address?.slice(-4)}
                </p>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-1 overflow-x-auto">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center px-4 py-3 border-b-2 transition-colors whitespace-nowrap ${
                    activeTab === tab.id
                      ? 'border-indigo-600 text-indigo-600'
                      : 'border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300'
                  }`}
                >
                  <Icon className="w-4 h-4 mr-2" />
                  {tab.label}
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'documents' && (
          <DocumentsView user={userData} onUpdate={updateUserData} />
        )}
        {activeTab === 'upload' && (
          <UploadDocument user={userData} onUpdate={updateUserData} />
        )}
        {activeTab === 'personal' && (
          <PersonalInfo user={userData} onUpdate={updateUserData} />
        )}
        {activeTab === 'privateKey' && (
          <PrivateKeyView user={userData} />
        )}
        {activeTab === 'settings' && (
          <SettingsView user={userData} onUpdate={updateUserData} />
        )}
      </main>
    </div>
  );
}

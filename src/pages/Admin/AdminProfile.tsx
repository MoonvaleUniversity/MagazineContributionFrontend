// MvStudentProfileEdit.tsx
import React, { useState } from 'react';
import { MvProfileEdit } from '../../components/Student/MvProfileEdit';
import { getUserData } from '../../services/AuthService';
import { IUser } from '../../app/Types/objects/user';
import AdminLayout from '../../layout/AdminLayout';

export const AdminProfileEdit: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'profile' | 'contributions'>('profile');
  const userData:IUser |null = getUserData();
  // Mock data - replace with actual API calls
  const savedContributions = [
    {
      id: 1,
      title: "AI in Modern Education",
      date: "2024-03-15",
      status: "Draft",
      faculty: "Computer Science"
    },
    {
      id: 2,
      title: "Sustainable Campus Initiatives",
      date: "2024-03-10",
      status: "Submitted",
      faculty: "Environmental Science"
    }
  ];

  return (
    <AdminLayout>
      {/* ... existing header code ... */}
      <div className="relative bg-gradient-to-r from-purple-50 to-blue-50 dark:from-gray-800 dark:to-gray-900 rounded-2xl shadow-lg mb-8 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-100/20 to-blue-100/20 dark:from-gray-900/50 dark:to-gray-900/50" />
        
        <div className="relative p-8 flex flex-col md:flex-row items-start gap-6">
          {/* Avatar Section */}
          <div className="flex-shrink-0">
            <div className="w-24 h-24 rounded-2xl bg-white dark:bg-gray-700 flex items-center justify-center shadow-md">
              <span className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                BB
              </span>
            </div>
          </div>

          {/* Profile Info */}
          <div className="flex-1 space-y-2">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{userData?.name}</h1>
            <p className="text-purple-600 dark:text-purple-400 font-medium">{userData?.role}</p>
            
            {/* Info Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-4">
              <div className="space-y-1">
                <label className="text-xs font-medium text-gray-500 dark:text-gray-400">Faculty</label>
                <p className="text-sm text-gray-900 dark:text-white">{userData?.faculty_id}</p>
              </div>
              <div className="space-y-1">
                <label className="text-xs font-medium text-gray-500 dark:text-gray-400">Academic Year</label>
                <p className="text-sm text-gray-900 dark:text-white">2023-2024</p>
              </div>
              <div className="space-y-1">
                <label className="text-xs font-medium text-gray-500 dark:text-gray-400">Email</label>
                <p className="text-sm text-gray-900 dark:text-white break-all">{userData?.email}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Tabs Navigation */}
      <div className="border-b border-gray-200 dark:border-gray-700 mb-8">
        <nav className="flex space-x-8">
          <button
            onClick={() => setActiveTab('profile')}
            className={`pb-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'profile'
                ? 'border-purple-500 text-purple-600 dark:text-purple-400'
                : 'border-transparent text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
            }`}
          >
            Profile Settings
          </button>
          <button
            onClick={() => setActiveTab('contributions')}
            className={`pb-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'contributions'
                ? 'border-purple-500 text-purple-600 dark:text-purple-400'
                : 'border-transparent text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
            }`}
          >
            Saved Contributions ({savedContributions.length})
          </button>
        </nav>
      </div>

      {/* Tab Content */}
      {activeTab === 'profile' ? (
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-md p-6">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Account Settings</h2>
            <MvProfileEdit />
          </div>
        </div>
      ) : (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
          <h3 className="text-xl font-semibold mb-6 text-gray-800 dark:text-gray-200">
            Saved Contributions
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {savedContributions.length > 0 ? (
              savedContributions.map(contribution => (
                <ContributionCard key={contribution.id} contribution={contribution} />
              ))
            ) : (
              <div className="col-span-full text-center py-12">
                <p className="text-gray-500 dark:text-gray-400">
                  No saved contributions yet. Start writing!
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </AdminLayout>
  );
};

// Contribution Card Component
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const ContributionCard: React.FC<{ contribution: any }> = ({ contribution }) => {
  return (
    <div className="bg-white dark:bg-gray-700 rounded-lg shadow-sm hover:shadow-md transition-shadow p-4">
      <div className="flex items-center justify-between mb-2">
        <span className={`text-xs font-medium px-2 py-1 rounded-full ${
          contribution.status === 'Submitted' 
            ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
            : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400'
        }`}>
          {contribution.status}
        </span>
        <span className="text-xs text-gray-500 dark:text-gray-400">
          {contribution.date}
        </span>
      </div>
      
      <h4 className="font-medium text-gray-800 dark:text-gray-200 mb-2">
        {contribution.title}
      </h4>
      
      <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
        <svg 
          className="w-4 h-4 mr-1" 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={2} 
            d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" 
          />
        </svg>
        {contribution.faculty}
      </div>
    </div>
  );
};
// MvStudentProfileEdit.tsx
import React, { useState } from 'react';
import { MvProfileEdit } from '../../components/Student/MvProfileEdit';
import { getUserData } from '../../services/AuthService';
import { Contribution, IUser } from '../../app/Types/objects/user';

import { useNavigate } from 'react-router-dom';
import MvHomeLayout from '../../layout/MvHomeLayout';

export const GuestEdit: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'profile' | 'contributions'>('profile');
     const userData:IUser |null = getUserData();
   const savedContributions = userData?.saved_contributions || [];

  return (
    <MvHomeLayout>
      {/* ... existing header code ... */}
      <div className="relative bg-gradient-to-r from-purple-50 to-purple-50 dark:from-gray-800 dark:to-gray-900 rounded-2xl shadow-lg mb-8 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-100/20 to-purple-100/20 dark:from-gray-900/50 dark:to-gray-900/50" />
        
        <div className="relative p-8 flex flex-col md:flex-row items-start gap-6">
          {/* Avatar Section */}
          <div className="flex-shrink-0">
            <div className="w-24 h-24 rounded-2xl bg-white dark:bg-gray-700 flex items-center justify-center shadow-md">
              <span className="text-2xl font-bold text-purple-600 dark:text-purple-400">
              MV
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
    </MvHomeLayout>
  );
};

const ContributionCard: React.FC<{ contribution: Contribution }> = ({ contribution }) => {
  const navigate = useNavigate();

  return (
    <div 
      className="bg-white dark:bg-gray-700 rounded-lg shadow-sm hover:shadow-md transition-shadow p-4 relative cursor-pointer"
      onClick={() => navigate(`/contributions/${contribution.id}`)}
      role="button"
      tabIndex={0}
     
    >
      {/* Saved Icon */}
      <div className="absolute top-2 right-2" onClick={(e) => e.stopPropagation()}>
        <svg
          className="w-5 h-5 text-purple-500 hover:text-purple-600 dark:text-purple-400"
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M5 4a2 2 0 012-2h6a2 2 0 012 2v14l-5-2.5L5 18V4z" />
        </svg>
      </div>

      <div className="flex items-center justify-between mb-2">
        <span className="text-xs text-gray-500 dark:text-gray-400">
          {new Date(contribution.created_at).toLocaleDateString()}
        </span>
      </div>
      
      <h4 className="font-medium text-gray-800 dark:text-gray-200 mb-4">
        {contribution.name}
      </h4>

      <div className="flex justify-end">
        <a
          href={contribution.doc_url}
          download
          onClick={(e) => e.stopPropagation()}
          className="flex items-center px-3 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors dark:bg-purple-600 dark:hover:bg-purple-700 text-sm"
        >
          <svg
            className="w-4 h-4 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
            />
          </svg>
          Download
        </a>
      </div>
    </div>
  );
};
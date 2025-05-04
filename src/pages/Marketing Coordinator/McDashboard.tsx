// pages/MarketingCoordinatorDashboard.tsx
import { useEffect, useState } from 'react';
import MarketingCoordinatorLayout from '../../layout/MarketingCoordinatorLayout';
import { MvStats } from '../../components/MvStats/MvStats';
import { MvButton } from '../../components/MvButton';
import { MvLoader } from '../../components/MvLoader';
import { MvContributionServices } from '../../services/ContributionService';
import { IContribution } from '../../app/Types/objects/contribution';
import { getAllUsers } from '../../services/userService';
import { User } from '../../app/MvObjects/user';
import { useNavigate } from 'react-router-dom';

import { detect } from "detect-browser";
import { createBrowser } from "../../services/userService";
import { getUserData } from "../../services/AuthService";

export const McDashboard = () => {

  const browser = detect();
  const users = getUserData();

  useEffect(() => {
    // Check if we've already recorded this browser info
    const storageKey = "browserTracked";
    const alreadyTracked = sessionStorage.getItem(storageKey);

    if (browser && users?.id && !alreadyTracked) {
      createBrowser({
        user_id: users?.id,
        browser_name: browser?.name,
        browser_version: browser?.version,
        os: browser?.os,
      })
        .then((res) => {
          console.log("View recorded successfully:", res);
          // Set a flag in localStorage to indicate we've tracked this browser
          sessionStorage.setItem(storageKey, "true");
        })
        .catch((err) => {
          console.error("Failed to record view:", err);
        });
    } else if (alreadyTracked) {
      console.log("Browser already tracked for this user");
    } else {
      console.log("Could not detect browser.");
    }
  }, [browser, users?.id]);


  const [stats, setStats] = useState({
    totalSubmissions: 0,
    pending: 0,
    approved: 0,
    guests: 0
  });
  const [recentSubmissions, setRecentSubmissions] = useState<IContribution[]>([]);
  const [pendingGuests, setPendingGuests] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const userData = JSON.parse(localStorage.getItem('userData') || '{}');
        const facultyId = userData.faculty_id;

        // Fetch contributions
        const contributions = await MvContributionServices.getContributions({ facultyId });
        const pending = contributions.filter(c => c.is_selected_for_publication === 0).length;
        
        // Fetch users
        const users = await getAllUsers();
        const guests = users.filter(u => u.role === 'Guest' && u.faculty_id === facultyId);
        const pendingGuests = users.filter(u => u.role === 'Guest' && u.faculty_id === facultyId);

        setStats({
          totalSubmissions: contributions.length,
          pending,
          approved: contributions.length - pending,
          guests: guests.length
        });

        setRecentSubmissions(contributions.slice(0, 5));
        setPendingGuests(pendingGuests);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const handleApproveGuest = async () => {
    // Implement approval logic
  };

  return (
    <MarketingCoordinatorLayout>
      <div className="p-6 max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Marketing Coordinator Dashboard</h1>
        
        {loading && <MvLoader />}
        {error && <div className="text-red-500 mb-4">{error}</div>}

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <MvStats 
            title="Total Submissions" 
            value={stats.totalSubmissions}
            trend="neutral"
            onClick={()=>{navigate("/mc/submissions")}}
          />
          <MvStats
            title="Pending Review"
            value={stats.pending}
            trend="negative"
            onClick={()=>{navigate("/mc/submissions")}}
          />
          <MvStats
            title="Approved Publications"
            value={stats.approved}
            trend="positive"
            onClick={()=>{navigate("/mc/submissions")}}
          />
          <MvStats
            title="Registered Guests"
            value={stats.guests}
            trend="neutral"
            onClick={()=>{navigate("/mc/guest")}}
          />
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <MvButton variant="primary" >
            Review New Submissions
          </MvButton>
          <MvButton variant="secondary" >
            Manage Students
          </MvButton>
          <MvButton variant="accent" >
            Manage Guest Accounts
          </MvButton>
          <MvButton variant="accent" >
            Update Profile
          </MvButton>
        </div>

        {/* Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Pending Submissions */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Recent Submissions</h2>
            <ul className="space-y-3">
              {recentSubmissions.map(submission => (
                <li key={submission.id} className="flex justify-between items-center p-3 hover:bg-gray-50 dark:hover:bg-gray-700 rounded">
                  <div>
                    <h3 className="font-medium">{submission.name}</h3>
                    <p className="text-sm text-gray-500">{new Date(submission.created_at).toLocaleDateString()}</p>
                  </div>
                  <MvButton size="sm">
                    Review
                  </MvButton>
                </li>
              ))}
            </ul>
          </div>

          {/* Pending Guest Approvals */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Guest Approvals ({pendingGuests.length})</h2>
            {pendingGuests.length > 0 ? (
              <ul className="space-y-3">
                {pendingGuests.map(guest => (
                  <li key={guest.id} className="flex justify-between items-center p-3 hover:bg-gray-50 dark:hover:bg-gray-700 rounded">
                    <div>
                      <h3 className="font-medium">{guest.name}</h3>
                      <p className="text-sm text-gray-500">{guest.email}</p>
                    </div>
                    <div className="flex gap-2">
                      <MvButton size="sm" onClick={() => handleApproveGuest()}>
                        Approve
                      </MvButton>
                      <MvButton size="sm" >
                        Reject
                      </MvButton>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500">No pending guest approvals</p>
            )}
          </div>
        </div>

        {/* Deadline Reminder */}
        <div className="mt-8 p-6 bg-blue-50 dark:bg-blue-900 rounded-lg">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-xl font-semibold">Next Closure Date</h2>
              <p className="text-gray-600 dark:text-gray-300">March 15, 2024</p>
            </div>
            <MvButton >
              View All Deadlines
            </MvButton>
          </div>
        </div>
      </div>
    </MarketingCoordinatorLayout>
  );
};
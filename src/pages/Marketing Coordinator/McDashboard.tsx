// pages/MarketingCoordinatorDashboard.tsx
import { useEffect, useState } from 'react';
import MarketingCoordinatorLayout from '../../layout/MarketingCoordinatorLayout';
import { MvStats } from '../../components/MvStats/MvStats';
import { MvButton } from '../../components/MvButton';
import { MvLoader } from '../../components/MvLoader';
import { MvContributionServices } from '../../services/ContributionService';
import { IContribution } from '../../app/Types/objects/contribution';
import { User } from '../../app/MvObjects/user';
import { useNavigate } from 'react-router-dom';
import { getAllGuest } from '../../services/GuestService';
import MvRoutes from '../../app/MvRoutes';
import { ResponsiveContainer, LineChart, CartesianGrid, XAxis, YAxis, Tooltip, Line, PieChart, Pie, Cell, Legend } from 'recharts';

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
    guests: 0,
    trendData: [] as Array<{ date: string, count: number }>
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
        const users = await getAllGuest({ facultyId: facultyId });
        const guests = users;
        const pendingGuests = users.filter(u =>  u.isApproved === 0);
        console.log("Pending Guests", guests);
      
        // Process data for trend chart
        const dailyCounts = contributions.reduce((acc, curr) => {
          const date = new Date(curr.created_at).toLocaleDateString();
          acc[date] = (acc[date] || 0) + 1;
          return acc;
        }, {} as Record<string, number>);

        const trendData = Object.entries(dailyCounts).map(([date, count]) => ({
          date,
          count
        }));
        setStats({
          totalSubmissions: contributions.length,
          pending,
          approved: contributions.length - pending,
          guests: guests.length,
          trendData: trendData 
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
          <MvButton variant="primary" onClick={()=>navigate(MvRoutes.MARKET_COORDINATOR.CONTRIBUTIONS)} >
           Students Submissions
          </MvButton>
          <MvButton variant="secondary" onClick={()=>navigate(MvRoutes.MARKET_COORDINATOR.STUDENTS)} >
            Manage Student Account
          </MvButton>
          <MvButton variant="accent" onClick={()=>navigate(MvRoutes.MARKET_COORDINATOR.GUEST)} >
            Manage Guest Accounts
          </MvButton>
          <MvButton variant="accent" onClick={()=>navigate(MvRoutes.MARKET_COORDINATOR.PROFILE_EDIT)}>
            Update Profile
          </MvButton>
        </div>
     <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <SubmissionTrendChart data={stats.trendData || []} />
        <SubmissionStatusChart approved={stats.approved} pending={stats.pending} />
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
                      
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500">No pending guest approvals</p>
            )}
          </div>
        </div>

      
      </div>
    </MarketingCoordinatorLayout>

  );




  
};

// Add these new components inside the McDashboard component

// Submission Trend Chart
const SubmissionTrendChart = ({ data }: { data: Array<{ date: string, count: number }> }) => (
  <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow h-80">
    <h3 className="text-lg font-semibold mb-4">Submission Trends</h3>
    <ResponsiveContainer width="100%" height="90%">
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="date" />
        <YAxis />
        <Tooltip />
        <Line 
          type="monotone" 
          dataKey="count" 
          stroke="#6366f1" 
          strokeWidth={2}
          dot={{ fill: '#6366f1' }}
        />
      </LineChart>
    </ResponsiveContainer>
  </div>
);
const SubmissionStatusChart = ({ approved, pending }: { approved: number, pending: number }) => {
  const data = [
    { name: 'Approved', value: approved },
    { name: 'Pending', value: pending },
  ];
  
  const COLORS = ['#10b981', '#f59e0b'];

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow h-80">
      <h3 className="text-lg font-semibold mb-4">Status Distribution</h3>
      <ResponsiveContainer width="100%" height="90%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={80}
            paddingAngle={5}
            dataKey="value"
            label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
            labelLine={false}
          >
            {data.map((entry, index) => (
              <Cell 
                key={`cell-${index}`} 
                fill={COLORS[index % COLORS.length]}
              />
            ))}
          </Pie>
          <Tooltip 
            contentStyle={{ 
              background: '#fff',
              border: 'none',
              borderRadius: '8px',
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
            }}
            formatter={(value: number, name: string) => [
              value, 
              name,
              `${((value / (approved + pending)) * 100).toFixed(1)}%`
            ]}
          />
          {/* Add legend */}
          <Legend 
            verticalAlign="bottom" 
            height={36}
            formatter={(value) => (
              <span className="text-sm text-gray-700 dark:text-gray-300">
                {value}
              </span>
            )}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};
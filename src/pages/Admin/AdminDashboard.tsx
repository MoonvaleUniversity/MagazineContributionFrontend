import { useState, useEffect } from "react";
import { ResponsiveContainer, LineChart, CartesianGrid, XAxis, YAxis, Tooltip, Legend, Line, BarChart, Bar, Cell, Pie, PieChart,} from "recharts";

import { MvLoader } from "../../components/MvLoader";
import { MvStats } from "../../components/MvStats/MvStats";
import AdminLayout from "../../layout/AdminLayout";
import { MvContributionServices } from "../../services/ContributionService";
import { getAllUsers } from "../../services/userService";
import { getAllFaculties } from "../../services/FacultyService";

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

interface ProcessedData {
  totalUsers: number;
  totalContributions: number;
  approvalRate: number;
  pendingReviews: number;
  activeGuests: number;
  facultyContributions: Array<{ 
    faculty: string; 
    total: number;
    approved: number;
    pending: number;
  }>;
  monthlyTrends: Array<{ 
    month: string; 
    contributions: number;
    approvals: number;
  }>;
  browserUsage: Array<{ name: string; value: number }>;
  activeUsers: Array<{ month: string; activeUsers: number }>;
}

export const AdminDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [processedData, setProcessedData] = useState<ProcessedData>({
    totalUsers: 0,
    totalContributions: 0,
    approvalRate: 0,
    pendingReviews: 0,
    activeGuests: 0,
    facultyContributions: [],
    monthlyTrends: [],
    browserUsage: [],
    activeUsers: []
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [contributions, users, faculties] = await Promise.all([
          MvContributionServices.getContributions(),
          getAllUsers(),
          getAllFaculties()
        ]);

        // Calculate basic stats
        const approvedContributions = contributions.filter(c => c.is_selected_for_publication).length;
        const totalContributions = contributions.length;
        
        // Process faculty data
        const facultyStats = faculties.map(faculty => {
          const facultyContribs = contributions.filter(c => 
            c.user.faculty.id === faculty.id
          );
          
          return {
            faculty: faculty.name,
            total: facultyContribs.length,
            approved: facultyContribs.filter(c => c.is_selected_for_publication).length,
            pending: facultyContribs.filter(c => !c.is_selected_for_publication).length
          };
        });

        // Process monthly trends
        const monthlyData = Array.from({ length: 6 }, (_, i) => {
          const date = new Date();
          date.setMonth(date.getMonth() - i);
          return {
            month: `${date.toLocaleString('default', { month: 'short' })} ${date.getFullYear()}`,
            contributions: 0,
            approvals: 0
          };
        }).reverse();

        contributions.forEach(contrib => {
          const contribDate = new Date(contrib.created_at);
          const monthStr = `${contribDate.toLocaleString('default', { month: 'short' })} ${contribDate.getFullYear()}`;
          const monthEntry = monthlyData.find(m => m.month === monthStr);
          
          if (monthEntry) {
            monthEntry.contributions++;
            if (contrib.is_selected_for_publication) monthEntry.approvals++;
          }
        });
            // Static browser usage data
    const browserUsage = [
      { name: 'Chrome', value: 65 },
      { name: 'Safari', value: 15 },
      { name: 'Firefox', value: 10 },
      { name: 'Edge', value: 10 },
    ];

    // Static active users data (last 6 months)
    const activeUsers = [
      { month: 'Jan 2024', activeUsers: 45 },
      { month: 'Feb 2024', activeUsers: 52 },
      { month: 'Mar 2024', activeUsers: 68 },
      { month: 'Apr 2024', activeUsers: 71 },
      { month: 'May 2024', activeUsers: 63 },
      { month: 'Jun 2024', activeUsers: 59 },
    ];
        setProcessedData({
          totalUsers: users.length,
          totalContributions,
          approvalRate: totalContributions > 0 
            ? Math.round((approvedContributions / totalContributions) * 100)
            : 0,
          pendingReviews: totalContributions - approvedContributions,
          activeGuests: users.filter(user => user.role === 'Guest').length,
          facultyContributions: facultyStats,
          monthlyTrends: monthlyData,
          browserUsage: browserUsage,
          activeUsers
        });

      } catch (error) {
        console.error("Error loading data:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);

  if (loading) return <MvLoader />;

  return (
    <AdminLayout>
      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
          <MvStats title="Total Users" value={processedData.totalUsers} trend="neutral" />
          <MvStats title="Total Contributions" value={processedData.totalContributions} trend="neutral" />
          <MvStats title="Approval Rate" value={`${processedData.approvalRate}%`} trend="positive" />
          <MvStats title="Pending Reviews" value={processedData.pendingReviews} trend="negative" />
          <MvStats title="Active Guests" value={processedData.activeGuests} trend="neutral" />
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Contribution Trends */}
          <div className="bg-white p-4 rounded-lg shadow dark:bg-gray-800">
            <h3 className="text-lg font-semibold mb-4 dark:text-white">Monthly Contribution Trends</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={processedData.monthlyTrends}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="contributions" 
                  name="Total Contributions"
                  stroke="#8884d8" 
                  strokeWidth={2}
                />
                <Line 
                  type="monotone" 
                  dataKey="approvals" 
                  name="Approved Contributions"
                  stroke="#82ca9d" 
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Faculty Contributions */}
          <div className="bg-white p-4 rounded-lg shadow dark:bg-gray-800">
            <h3 className="text-lg font-semibold mb-4 dark:text-white">Faculty Contributions</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={processedData.facultyContributions}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="faculty" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="total" name="Total Contributions" fill="#8884d8" />
                <Bar dataKey="approved" name="Approved Contributions" fill="#82ca9d" />
                <Bar dataKey="pending" name="Pending Contributions" fill="#ffc658" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Faculty Contribution Table */}
        <div className="my-8 bg-white rounded-lg shadow dark:bg-gray-800">
          <h3 className="text-lg font-semibold p-4 border-b dark:border-gray-700 text-center">
            Faculty Contribution Details
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse border border-gray-200 dark:border-gray-700">
              <thead className="bg-gray-100 dark:bg-gray-700">
          <tr>
            <th className="px-6 py-3 text-left text-sm font-medium text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700">
              Faculty
            </th>
            <th className="px-6 py-3 text-center text-sm font-medium text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700">
              Total Contributions
            </th>
            <th className="px-6 py-3 text-center text-sm font-medium text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700">
              Approved Contributions
            </th>
            <th className="px-6 py-3 text-center text-sm font-medium text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700">
              Pending Contributions
            </th>
            <th className="px-6 py-3 text-center text-sm font-medium text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700">
              Approval Rate
            </th>
          </tr>
              </thead>
              <tbody>
          {processedData.facultyContributions.map((faculty, index) => (
            <tr
              key={index}
              className={`hover:bg-gray-50 dark:hover:bg-gray-700 ${
                index % 2 === 0
            ? "bg-gray-50 dark:bg-gray-800"
            : "bg-white dark:bg-gray-900"
              }`}
            >
              <td className="px-6 py-4 text-sm text-gray-800 dark:text-gray-300 border border-gray-200 dark:border-gray-700">
                {faculty.faculty}
              </td>
              <td className="px-6 py-4 text-center text-sm text-gray-800 dark:text-gray-300 border border-gray-200 dark:border-gray-700">
                {faculty.total}
              </td>
              <td className="px-6 py-4 text-center text-sm text-green-600 dark:text-green-400 border border-gray-200 dark:border-gray-700">
                {faculty.approved}
              </td>
              <td className="px-6 py-4 text-center text-sm text-yellow-600 dark:text-yellow-400 border border-gray-200 dark:border-gray-700">
                {faculty.pending}
              </td>
              <td className="px-6 py-4 text-center text-sm text-gray-800 dark:text-gray-300 border border-gray-200 dark:border-gray-700">
                {faculty.total > 0
            ? `${Math.round((faculty.approved / faculty.total) * 100)}%`
            : "N/A"}
              </td>
            </tr>
          ))}
              </tbody>
            </table>
          </div>
        </div>
                   {/* Charts Grid */}
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
               {/* Browser Usage Pie Chart */}
         <div className="bg-white p-4 rounded-lg shadow dark:bg-gray-800">
            <h3 className="text-lg font-semibold mb-4 dark:text-white">Browser Usage</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={processedData.browserUsage}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  innerRadius={60}
                  paddingAngle={5}
                  dataKey="value"
                  label
                >
                  {processedData.browserUsage.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} /> 
                  ))} 
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
         </div>
     
         

          {/* Active Users Chart */}
          <div className="bg-white p-4 rounded-lg shadow dark:bg-gray-800">
            <h3 className="text-lg font-semibold mb-4 dark:text-white">Active Users</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={processedData.activeUsers} >
              
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="activeUsers" name="Active Users" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        {/* Faculty Table - Keep previous table implementation */}

        {/* Static System Health Charts */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
          <div className="bg-white p-4 rounded-lg shadow dark:bg-gray-800">
            <h3 className="text-lg font-semibold mb-4 dark:text-white">Storage Usage</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={[
                    { name: 'Used', value: 75 },
                    { name: 'Free', value: 25 }
                  ]}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  innerRadius={60}
                  paddingAngle={5}
                  dataKey="value"
                  label
                >
                  <Cell fill="#0088FE" />
                  <Cell fill="#00C49F" />
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-white p-4 rounded-lg shadow dark:bg-gray-800">
            <h3 className="text-lg font-semibold mb-4 dark:text-white">API Response Times</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={[
                { day: 'Mon', time: 200 },
                { day: 'Tue', time: 180 },
                { day: 'Wed', time: 220 },
                { day: 'Thu', time: 150 },
                { day: 'Fri', time: 190 }
              ]}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />
                <Line 
                  type="monotone" 
                  dataKey="time" 
                  stroke="#8884d8" 
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};
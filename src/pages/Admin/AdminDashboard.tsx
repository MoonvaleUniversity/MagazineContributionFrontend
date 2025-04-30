import { useState, useEffect } from "react";
import { ResponsiveContainer, LineChart, CartesianGrid, XAxis, YAxis, Tooltip, Legend, Line, BarChart, Bar,} from "recharts";

import { MvLoader } from "../../components/MvLoader";
import { MvStats } from "../../components/MvStats/MvStats";
import AdminLayout from "../../layout/AdminLayout";
import { MvContributionServices } from "../../services/ContributionService";
import { getAllUsers } from "../../services/userService";
import { getAllFaculties } from "../../services/FacultyService";

// const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

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
    monthlyTrends: []
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

        setProcessedData({
          totalUsers: users.length,
          totalContributions,
          approvalRate: totalContributions > 0 
            ? Math.round((approvedContributions / totalContributions) * 100)
            : 0,
          pendingReviews: totalContributions - approvedContributions,
          activeGuests: users.filter(user => user.role === 'Guest').length,
          facultyContributions: facultyStats,
          monthlyTrends: monthlyData
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
        <div className="mt-8 bg-white rounded-lg shadow dark:bg-gray-800">
          <h3 className="text-lg font-semibold p-4 border-b dark:border-gray-700">
            Detailed Faculty Statistics
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-4 py-2 text-left">Faculty</th>
                  <th className="px-4 py-2 text-center">Total</th>
                  <th className="px-4 py-2 text-center">Approved</th>
                  <th className="px-4 py-2 text-center">Pending</th>
                  <th className="px-4 py-2 text-center">Approval Rate</th>
                </tr>
              </thead>
              <tbody>
                {processedData.facultyContributions.map((faculty, index) => (
                  <tr key={index} className="border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700">
                    <td className="px-4 py-2">{faculty.faculty}</td>
                    <td className="px-4 py-2 text-center">{faculty.total}</td>
                    <td className="px-4 py-2 text-center text-green-600 dark:text-green-400">
                      {faculty.approved}
                    </td>
                    <td className="px-4 py-2 text-center text-yellow-600 dark:text-yellow-400">
                      {faculty.pending}
                    </td>
                    <td className="px-4 py-2 text-center">
                      {faculty.total > 0 
                        ? `${Math.round((faculty.approved / faculty.total) * 100)}%`
                        : 'N/A'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};
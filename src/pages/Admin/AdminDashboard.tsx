// pages/AdminDashboard.tsx
import AdminLayout from "../../layout/AdminLayout";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, PieChart, Pie, Cell, LineChart, Line, ResponsiveContainer } from "recharts";
import { MvStats } from "../../components/MvStats/MvStats";
// import { MvLoader } from "../../components/MvLoader";
// import SearchFilter from "../../components/MvSearchFilter/MvSearchFIlter";

// Mock data
const mockData = {
  systemUsage: {
    pageViews: [
      { page: 'Submissions', views: 2345 },
      { page: 'Publications', views: 1800 },
      { page: 'Dashboard', views: 1500 },
    ],
    activeUsers: [
      { user: 'John Doe', activities: 42 },
      { user: 'Jane Smith', activities: 38 },
      { user: 'Mike Johnson', activities: 29 },
    ],
    browserUsage: [
      { name: 'Chrome', value: 65 },
      { name: 'Safari', value: 15 },
      { name: 'Firefox', value: 10 },
      { name: 'Edge', value: 10 },
    ]
  },
  contributions: [
    { faculty: 'Business', submissions: 45, approved: 35 },
    { faculty: 'Computing', submissions: 38, approved: 28 },
    { faculty: 'Engineering', submissions: 52, approved: 40 },
  ],
  trends: [
    { month: 'Jan', submissions: 65 },
    { month: 'Feb', submissions: 59 },
    { month: 'Mar', submissions: 80 },
    { month: 'Apr', submissions: 81 },
  ]
};

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

export const AdminDashboard = () => {
//   const [academicYears, setAcademicYears] = useState<IAcademicYear[]>([]);
//   const [faculties, setFaculties] = useState<IFaculty[]>([]);
//   const [searchQuery, setSearchQuery] = useState('');
//   const [selectedYear, setSelectedYear] = useState('');
//   const [selectedFaculty, setSelectedFaculty] = useState('');
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const [years, faculties] = await Promise.all([
//           getAllAcademicYears(),
//           getAllFaculties()
//         ]);
//         setAcademicYears(years);
//         setFaculties(faculties);
//       } catch (error) {
//         console.error("Error loading data:", error);
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchData();
//   }, []);

//   const handleSearch = (query: string) => {
//     setSearchQuery(query);
//     // Add your search logic here
//   };

//   const handleFilterChange = (filterName: string, value: string) => {
//     if (filterName === 'year') {
//       setSelectedYear(value);
//     }
//     if (filterName === 'faculty') {
//       setSelectedFaculty(value);
//     }
//   };

  

//   if (loading) return <MvLoader />;

  return (
    <AdminLayout>
      <div className="max-w-7xl mx-auto px-4 py-6">
        

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
          <MvStats title="Total Users" value="1,234" trend="positive" />
          <MvStats title="Total Contributions" value="589" trend="neutral" />
          <MvStats title="Approval Rate" value="82%" trend="positive" />
          <MvStats title="Pending Reviews" value="45" trend="negative" />
          <MvStats title="Active Guests" value="89" trend="neutral" />
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Contribution Trends */}
          <div className="bg-white p-4 rounded-lg shadow dark:bg-gray-800">
            <h3 className="text-lg font-semibold mb-4 dark:text-white">Contribution Trends</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={mockData.trends}>
                <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
                <XAxis dataKey="month" stroke="#666" />
                <YAxis stroke="#666" />
                <Tooltip />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="submissions" 
                  stroke="#8884d8" 
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Faculty Comparison */}
          <div className="bg-white p-4 rounded-lg shadow dark:bg-gray-800">
            <h3 className="text-lg font-semibold mb-4 dark:text-white">Faculty Contributions</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={mockData.contributions}>
                <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
                <XAxis dataKey="faculty" stroke="#666" />
                <YAxis stroke="#666" />
                <Tooltip />
                <Legend />
                <Bar dataKey="submissions" fill="#8884d8" />
                <Bar dataKey="approved" fill="#82ca9d" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Browser Usage */}
          <div className="bg-white p-4 rounded-lg shadow dark:bg-gray-800">
            <h3 className="text-lg font-semibold mb-4 dark:text-white">Browser Usage</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={mockData.systemUsage.browserUsage}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  dataKey="value"
                  label
                >
                  {mockData.systemUsage.browserUsage.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Active Users */}
          <div className="bg-white p-4 rounded-lg shadow dark:bg-gray-800">
            <h3 className="text-lg font-semibold mb-4 dark:text-white">Most Active Users</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={mockData.systemUsage.activeUsers}>
                <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
                <XAxis dataKey="user" stroke="#666" />
                <YAxis stroke="#666" />
                <Tooltip />
                <Legend />
                <Bar dataKey="activities" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Exception Reports */}
        <div className="mt-8 bg-white p-4 rounded-lg shadow dark:bg-gray-800">
          <h3 className="text-lg font-semibold mb-4 dark:text-white">Exception Reports</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="font-medium mb-2 dark:text-gray-300">Contributions Without Comments (14+ Days)</h4>
              <ul className="list-disc pl-5 dark:text-gray-400">
                <li className="py-2">Business Faculty: 5 contributions</li>
                <li className="py-2">Computing Faculty: 3 contributions</li>
                <li className="py-2">Engineering Faculty: 2 contributions</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-2 dark:text-gray-300">Most Viewed Pages</h4>
              <ul className="list-disc pl-5 dark:text-gray-400">
                {mockData.systemUsage.pageViews.map((page) => (
                  <li key={page.page} className="py-2">
                    {page.page}: {page.views.toLocaleString()} views
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};
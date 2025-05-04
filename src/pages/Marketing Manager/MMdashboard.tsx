import { useState, useEffect } from "react";
import { MvButton } from "../../components/MvButton";
import MarketingManagerLayout from "../../layout/MarketingManagerLayout";
import { MvStats } from "../../components/MvStats/MvStats";
import { MvContributionServices } from "../../services/ContributionService";
import { IContribution } from "../../app/Types/objects/contribution";
import { IFaculty } from "../../app/MvObjects/faculty";
import { getAllFaculties } from "../../services/FacultyService";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { MvLoader } from "../../components/MvLoader";
import { FiUsers, FiFileText } from "react-icons/fi";
import MvRoutes from "../../app/MvRoutes";
import { getAllStudents } from "../../services/StudentServices";
import { getAllCoordinators } from "../../services/CoordinatorServices";
import { User } from "../../app/MvObjects/user";

const getFacultyContributions = (
  contributions: IContribution[],
  students: User[],
  faculties: IFaculty[]
) => {
  return faculties.map(faculty => {
    const facultyStudents = students.filter(s => 
      s.faculty_id?.toString() === faculty.id.toString()
    );
    
    const facultyContributions = contributions.filter(c =>
      facultyStudents.some(s => s.id.toString() === c.user_id.toString())
    );

    return {
      name: faculty.name,
      contributions: facultyContributions.length,
      image: faculty.image_url
    };
  });
};

export const MmDashboard = () => {
  const [contributions, setContributions] = useState<IContribution[]>([]);
  const [faculties, setFaculties] = useState<IFaculty[]>([]);
  const [students, setStudents] = useState<User[]>([]);
  const [coordinators, setCoordinators] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [contribs, facultiesData, studentsData, coordsData] = await Promise.all([
          MvContributionServices.getContributions(),
          getAllFaculties(),
          getAllStudents(),
          getAllCoordinators()
        ]);

        setContributions(contribs);
        setFaculties(facultiesData);
        setStudents(studentsData);
        setCoordinators(coordsData);
      } catch (error) {
        console.error("Error loading dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  // Calculate statistics
  const totalContributions = contributions.length;
  const approvedContributions = contributions.filter(c => c.is_selected_for_publication).length;
  const totalFaculties = faculties.length;
  const totalCoordinators = coordinators.length;
  const countFacultyStudents = (facultyId: number | string, students: User[]) => {
    const id = facultyId.toString();
    return students.filter(s => s.faculty_id?.toString() === id).length;
  };
  
  
  // Recent activities (last 5 contributions)
  const recentActivities = [...contributions]
    .sort((a, b) => new Date(b.created_at!).getTime() - new Date(a.created_at!).getTime())
    .slice(0, 5);

  // Faculty contribution data for chart
  const facultyStats = getFacultyContributions(contributions, students, faculties);

  if (loading) return <MarketingManagerLayout> <MvLoader /></MarketingManagerLayout>;

  return (
    <MarketingManagerLayout>
      <div className="max-w-7xl mx-auto p-4 space-y-6">
        {/* Quick Stats Row */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <MvStats 
            title="Total Contributions" 
            value={totalContributions}
            icon={FiFileText}
          />
          <MvStats 
            title="Approved" 
            value={approvedContributions}
            icon={FiFileText}
          />
          <MvStats 
            title="Faculties" 
            value={totalFaculties}
            icon={FiUsers}
          />
          <MvStats 
            title="Coordinators" 
            value={totalCoordinators}
            icon={FiUsers}
          />
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Contributions Chart */}
          <div className="lg:col-span-2 bg-white dark:bg-primary-800 p-4 rounded-lg shadow">
            <h3 className="text-lg font-semibold mb-4">Contributions by Faculty</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={facultyStats}>
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar 
                    dataKey="contributions" 
                    fill="#6366f1"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="space-y-4">
            <div className="bg-white h-full dark:bg-primary-800 p-4 rounded-lg shadow">
              <h3 className="text-lg text-center pb-5 font-semibold mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <MvButton 
                  onClick={() => window.location.href = MvRoutes.MARKET_MANAGER.FACULTY}
                  className="w-full"
                  
                >
                  Manage Faculties
                </MvButton>
                <MvButton 
                  onClick={() => window.location.href = MvRoutes.MARKET_MANAGER.USERS}
                   className="w-full"
                  
                >
                  Manage Coordinators
                </MvButton>
                <MvButton 
                  onClick={() => window.location.href = MvRoutes.MARKET_MANAGER.SELECTED_CONTRIBUTIONS}
                   className="w-full"
                  
                >
                  View All Submissions
                </MvButton>
                <MvButton 
                  onClick={() => console.log("Download ZIP")}
                   className="w-full justify-center"
                  variant="accent"
                >
                
                <div className="inline-block"> Go to File management system</div>
                </MvButton>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Activities */}
        <div className="bg-white dark:bg-primary-800 p-4 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4">Recent Activities</h3>
          <div className="space-y-3">
            {recentActivities.map(activity => {
              const faculty = faculties.find(f => 
                students.some(s => 
                  s.id.toString() === activity.user_id && 
                  s.faculty_id?.toString() === f.id.toString()
                )
              );

              return (
                <div 
                  key={activity.id}
                  className="flex items-center justify-between p-3 bg-gray-50 dark:bg-primary-700 rounded"
                >
                  <div>
                    <p className="font-medium">{activity.name}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {faculty?.name} • {new Date(activity.created_at!).toLocaleDateString()}
                    </p>
                  </div>
                  <span className={`px-2 py-1 text-sm rounded-xl ${
                    activity.is_selected_for_publication 
                      ? "bg-green-400 text-black font-bold" 
                      : "bg-yellow-200  text-black font-bold"
                  }`}>
                    {activity.is_selected_for_publication ? "Approved" : "Pending"}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Faculty Overview */}
        <div className="bg-white dark:bg-primary-800 p-4 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4">Faculty Overview</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {faculties.map(faculty => {
              const facultyCoordinators = coordinators.filter(c => 
                c.faculty_id?.toString() === faculty.id.toString()
              );
              const facultyContributions = facultyStats.find(f => f.name === faculty.name)?.contributions || 0;

              return (
                <div 
                  key={faculty.id}
                  className="p-4 bg-gray-50 dark:bg-primary-700 rounded-lg"
                >
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-medium">{faculty.name}</h4>
                    <img 
                        src={
                            typeof faculty.image_url === "string" 
                              ? faculty.image_url 
                              : ""
                          } 
                      alt={faculty.name}
                      className="w-10 h-10 rounded-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = '/src/Assets/images/404.jpeg';
                      }}
                    />
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm">
                      Coordinators: {facultyCoordinators.length}
                    </p>
                    <p className="text-sm">
                    Students: {countFacultyStudents(faculty.id, students)}

                    </p>
                    <p className="text-sm">
                      Contributions: {facultyContributions}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </MarketingManagerLayout>
  );
};
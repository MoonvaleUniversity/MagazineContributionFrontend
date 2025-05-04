import { useEffect, useState } from "react";
import { getMostPageViews } from "../../services/userService";
import AdminLayout from "../../layout/AdminLayout";
import { IPage } from "../../app/Types/objects/PageView";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";


const MostPageView = () => {
  const [pages, setPage] = useState<IPage[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  useEffect(() => {
    getMostPageViews()
      .then((data) => setPage(data))
      .catch((err) => console.error("Error fetching active users:", err));
  }, []);

  // Pagination logic
  const totalPages = Math.ceil(pages.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentItems = pages.slice(startIndex, startIndex + itemsPerPage);

  // Function to truncate page name if it exceeds 15 characters
  const truncateText = (text: string) => {
    return text.length > 15 ? text.substring(0, 15) + "..." : text;
  };
  
  return (
    <AdminLayout>
      <div className="bg-white dark:bg-secondary-dark-500 p-6 rounded-xl shadow mt-6">
        <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-white">
          Most Page Views
        </h2>
        <p className="text-gray-600 dark:text-gray-300 mb-6">
          Top Contributions! Keep engaging to reach the top
        </p>

        {/* Leaderboard */}
        <ul className="mb-8 space-y-3">
          {currentItems.map((page, index) => (
            <li
              key={index}
              className={`flex items-center justify-between p-3 rounded-lg ${
                index === 0
                  ? "bg-yellow-50 dark:bg-yellow-900"
                  : "bg-gray-100 dark:bg-gray-700"
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center space-y-1 sm:space-y-0 sm:space-x-3 text-gray-800 dark:text-gray-200">
                <div>
                  <p className="font-semibold">{page.page_name}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-semibold text-indigo-600 dark:text-indigo-400">
                  {page.total_views} Views
                </p>
                <div className="w-40 bg-gray-300 rounded-full h-2 mt-1 dark:bg-gray-600">
                  <div
                    className="bg-indigo-500 h-2 rounded-full"
                    style={{
                      width: `${
                        (page.total_views / (pages[0]?.total_views || 1)) * 100
                      }%`,
                    }}
                  ></div>
                </div>
              </div>
            </li>
          ))}
        </ul>

        {/* Pagination controls */}
        <div className="flex justify-center space-x-2 mb-6">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="px-3 py-1 bg-gray-200 dark:bg-gray-600 rounded hover:bg-gray-300 dark:hover:bg-gray-500 disabled:opacity-50"
          >
            Prev
          </button>
          {[...Array(totalPages)].map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentPage(i + 1)}
              className={`px-3 py-1 rounded ${
                currentPage === i + 1
                  ? "bg-indigo-500 text-white"
                  : "bg-gray-200 dark:bg-gray-600 hover:bg-gray-300 dark:hover:bg-gray-500"
              }`}
            >
              {i + 1}
            </button>
          ))}
          <button
            onClick={() =>
              setCurrentPage((prev) => Math.min(prev + 1, totalPages))
            }
            disabled={currentPage === totalPages}
            className="px-3 py-1 bg-gray-200 dark:bg-gray-600 rounded hover:bg-gray-300 dark:hover:bg-gray-500 disabled:opacity-50"
          >
            Next
          </button>
        </div>

        {/* Bar Chart */}
        <div style={{ width: "100%", height: 300 }}>
          <ResponsiveContainer>
            <BarChart data={currentItems}> {/* Use currentItems for paginated data */}
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="page_name"
                tickFormatter={(tick) => truncateText(tick)}
                angle={-60} // Rotate labels vertically
                textAnchor="end"
                height={60}
                fontSize={13}
              />
              <YAxis />
              <Tooltip />
              <Bar dataKey="total_views" fill="#6366F1" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="mt-6 text-center">
          <p className="text-gray-700 dark:text-gray-300">
            Want to see your name here? Start engaging more today!
          </p>
        </div>
      </div>
    </AdminLayout>
  );
};

export default MostPageView;

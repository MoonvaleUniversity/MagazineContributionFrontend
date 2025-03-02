import { useState } from "react";
import { FaFileAlt, FaCommentDots, FaCheckCircle, FaClock } from "react-icons/fa";
import StudentLayout from "../../layout/StudentLayout";

interface Submission {
  id: number;
  title: string;
  status: "Under Review" | "Accepted" | "Pending";
}

export const MvStudentDashboard: React.FC = () => {
  const [submissions] = useState<Submission[]>([
    { id: 1, title: "AI in Education", status: "Under Review" },
    { id: 2, title: "Climate Change and Tech", status: "Accepted" },
    { id: 3, title: "The Future of Web3", status: "Pending" },
  ]);

  return (
    <StudentLayout>
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Your Submissions</h2>
          <button
            className="px-4 py-2 bg-blue-500 text-white rounded-4xl hover:bg-blue-600"
            onClick={() => alert("You pressed it")}
          >
            Create Submission
          </button>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Submissions Overview */}
          <div className="lg:col-span-2 bg-white dark:bg-gray-800 shadow-lg rounded-4xl p-6">
            <div className="space-y-4">
              {submissions.map((submission) => (
                <div
                  key={submission.id}
                  className="flex justify-between items-center bg-gray-100 dark:bg-gray-700 p-4 rounded-4xl"
                >
                  <div className="flex items-center space-x-3">
                    <FaFileAlt className="text-gray-600 dark:text-gray-300" />
                    <span className="text-gray-800 dark:text-white font-medium">
                      {submission.title}
                    </span>
                  </div>
                  <span
                    className={`text-sm font-medium px-3 py-1 rounded-4xl ${
                      submission.status === "Accepted"
                        ? "bg-green-500 text-white"
                        : "bg-yellow-500 text-gray-900"
                    }`}
                  >
                    {submission.status}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white dark:bg-gray-800 shadow-lg rounded-4xl p-6">
            <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">
              Quick Actions
            </h2>
            <div className="space-y-3">
              <button className="flex items-center w-full p-3 bg-blue-500 text-white rounded-4xl hover:bg-blue-600">
                <FaCommentDots className="mr-2" /> Check Feedback
              </button>
              <button className="flex items-center w-full p-3 bg-green-500 text-white rounded-4xl hover:bg-green-600">
                <FaCheckCircle className="mr-2" /> View Accepted Submissions
              </button>
              <button className="flex items-center w-full p-3 bg-yellow-500 text-white rounded-4xl hover:bg-yellow-600">
                <FaClock className="mr-2" /> View Pending Submissions
              </button>
            </div>
          </div>
        </div>
      </div>
    </StudentLayout>
  );
};

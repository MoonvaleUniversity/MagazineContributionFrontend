import React, { useEffect, useRef } from "react";
import { FiArrowLeft } from "react-icons/fi";
import { AiOutlineLike, AiOutlineDislike, AiOutlineMessage } from "react-icons/ai";
import { FaBookmark } from "react-icons/fa";
import { Link } from "react-router-dom";
import { renderAsync } from "docx-preview"; // Make sure to import docx-preview
import StudentLayout from "../../layout/StudentLayout";

const MvContributionDetailsPage: React.FC = () => {
  const docxContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Fetch the DOCX file as an ArrayBuffer
    fetch("/src/Assets/RM.docx")
      .then((response) => response.arrayBuffer())
      .then((arrayBuffer) => {
        // Ensure the docxContainerRef exists
        if (docxContainerRef.current) {
          // Render the document using docx-preview
          renderAsync(arrayBuffer, docxContainerRef.current).catch((error) => {
            console.error("Error rendering document:", error);
          });
        }
      })
      .catch((error) => {
        console.error("Error loading document:", error);
      });
  }, []);

  return (
    <StudentLayout>
      {/* Header / Back Navigation */}
      <header className="mb-6">
        <Link to="/contributions" className="flex items-center text-purple-600 hover:text-purple-700 dark:text-purple-300 hover:underline">
          <FiArrowLeft className="mr-2" />
          Back to Contributions
        </Link>
      </header>

      {/* Main Details Card */}
      <div className="max-w-4xl mx-auto bg-white dark:bg-secondary-dark-500 rounded-2xl shadow-lg p-4">
        {/* Title & Description */}
        <div className="mb-4">
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
            Document Title Here
          </h1>
          <p className="text-sm text-gray-600 dark:text-background-600 mt-1">
            This is a brief description of the contribution. It includes context about the document and the images shown.
          </p>
        </div>

        {/* Images Section */}
        <div className="flex flex-col md:flex-row gap-4 mb-4">
          {/* Main Thumbnail Image */}
          <div className="md:w-1/2">
            <img
              src="/src/Assets/images/thumbnail.jpg"
              alt="Main Thumbnail"
              className="w-full h-64 object-cover rounded-xl transition-transform duration-300 hover:scale-105"
            />
          </div>
          {/* Additional Images Grid */}
          <div className="md:w-1/2 grid grid-cols-2 gap-2">
            <img
              src="/src/Assets/images/image1.jpg"
              alt="Additional Image 1"
              className="w-full h-32 object-cover rounded-lg transition-transform duration-300 hover:scale-105"
            />
            <img
              src="/src/Assets/images/image2.jpg"
              alt="Additional Image 2"
              className="w-full h-32 object-cover rounded-lg transition-transform duration-300 hover:scale-105"
            />
            <img
              src="/src/Assets/images/image3.jpg"
              alt="Additional Image 3"
              className="w-full h-32 object-cover rounded-lg transition-transform duration-300 hover:scale-105"
            />
            <img
              src="/src/Assets/images/image4.jpg"
              alt="Additional Image 4"
              className="w-full h-32 object-cover rounded-lg transition-transform duration-300 hover:scale-105"
            />
          </div>
        </div>

        {/* Document Preview Section */}
        <div className="mb-4">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">
            Document Preview
          </h2>
          <div
            ref={docxContainerRef}
            className="overflow-auto rounded-lg shadow p-4"
            style={{
              background: "transparent",
              minHeight: "20px",
              borderRadius: "20px",
            }}
          >
            {/* The DOCX content will be rendered here by docx-preview */}
          </div>
        </div>

        {/* Engagement Section with React Icons */}
        <div className="flex justify-between items-center text-gray-500 dark:text-white text-sm">
          <div className="flex items-center gap-1">
            <AiOutlineLike className="w-5 h-5 text-purple-600 dark:text-purple-300 hover:text-purple-800" />
            <span className="text-gray-800 dark:text-white">100</span>
          </div>
          <div className="flex items-center gap-1">
            <AiOutlineDislike className="w-5 h-5 text-red-500 dark:text-red-300 hover:text-red-700" />
            <span className="text-gray-800 dark:text-white">20</span>
          </div>
          <div className="flex items-center gap-1">
            <AiOutlineMessage className="w-5 h-5 text-blue-500 dark:text-blue-300 hover:text-blue-700" />
            <span className="text-gray-800 dark:text-white">10</span>
          </div>
          <div>
            <FaBookmark className="w-5 h-5 text-yellow-500 dark:text-yellow-300 hover:text-yellow-700" />
          </div>
        </div>
      </div>
   
    </StudentLayout>
  );
};

export default MvContributionDetailsPage;

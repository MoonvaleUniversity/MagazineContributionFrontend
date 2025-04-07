import React, { useEffect, useRef, useState } from "react";
import { FiArrowLeft } from "react-icons/fi";
import { Link, useParams } from "react-router-dom";
import { renderAsync } from "docx-preview";
import StudentLayout from "../../layout/StudentLayout";
import { IContribution } from "../../app/Types/objects/contribution";
import { MvContributionServices } from "../../services/ContributionService";

import MvRoutes from "../../app/MvRoutes";

const MvContributionDetailsPage: React.FC = () => {
  const docxContainerRef = useRef<HTMLDivElement>(null);
  const { id } = useParams<{ id: string }>();
  const [contribution, setContribution] = useState<IContribution | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    
    const fetchContribution = async () => {
      try {
        const data = await MvContributionServices.getContributionById(id);
        setContribution(data);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load contribution");
      } finally {
        setLoading(false);
      }
    };

    fetchContribution();
  }, [id]);

  useEffect(() => {
    if (contribution?.doc_url) {
      fetch(contribution.doc_url)
        .then((response) => response.arrayBuffer())
        .then((arrayBuffer) => {
          renderAsync(arrayBuffer, docxContainerRef.current!);
        })
        .catch((error) => {
          console.error("Error rendering document:", error);
        });
    }
  }, [contribution]);

  if (loading) {
    return (
      <StudentLayout>
        <div className="text-center p-8">
          <span className="loading loading-spinner loading-lg"></span>
          <p>Loading contribution details...</p>
        </div>
      </StudentLayout>
    );
  }

  if (error) {
    return (
      <StudentLayout>
        <div className="alert alert-error max-w-2xl mx-auto mt-8">
          <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>{error}</span>
        </div>
      </StudentLayout>
    );
  }

  return (
    <StudentLayout>
      <header className="mb-6 px-4">
        <Link
          to={MvRoutes.STUDENTS.SUBMISSIONS}
          className="btn btn-ghost text-primary"
        >
          <FiArrowLeft className="mr-2" />
          Back to Contributions
        </Link>
      </header>

      <div className="max-w-4xl mx-auto p-4">
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <h1 className="card-title text-3xl mb-4">
              {contribution?.name}
            </h1>
            
            <div className="text-sm text-gray-500 mb-6">
              <p>Submitted by: User #{contribution?.user_id}</p>
              <p>Submitted at: {contribution?.created_at}</p>
            </div>

            {contribution?.image_url && contribution.image_url.length > 0 && (
              <div className="grid grid-cols-2 gap-4 mb-8">
                {contribution.image_url.map((img, index) => (
                  <div key={index} className="aspect-square overflow-hidden rounded-lg">
                    <img
                      src={img}
                      alt={`Contribution image ${index + 1}`}
                      className="w-full h-full object-cover hover:scale-105 transition-transform"
                    />
                  </div>
                ))}
              </div>
            )}

            <div className="border rounded-lg overflow-hidden">
              <div className="p-4 bg-base-200">
                <h2 className="text-lg font-semibold mb-2">Document Preview</h2>
              </div>
              <div
                ref={docxContainerRef}
                className="p-4 min-h-[500px] docx-container"
              />
            </div>
          </div>
        </div>
      </div>
    </StudentLayout>
  );
};

export default MvContributionDetailsPage;
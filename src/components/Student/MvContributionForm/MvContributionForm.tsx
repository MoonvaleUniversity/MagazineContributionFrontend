import React, { useState, useRef, useEffect } from "react";
import { MvButton } from "../../MvButton";
import { MvInput, MvFileUpload, MvCheckbox } from "../../MvInput";
import { MvModal } from "../../MvModal";
import { MvContributionServices } from "../../../services/ContributionService";
import { getUserData } from "../../../services/AuthService";
import { MvLoader } from "../../MvLoader";
import { MvTermsAndConditions } from "../../MvToC";
import { getClosureDatebyAcademicYear } from "../../../services/ClosureDateService";
import { useParams, useNavigate } from "react-router-dom";

export const MvContributionForm: React.FC = () => {
  const [title, setTitle] = useState("");
  const [document, setDocument] = useState<File | null>(null);
  const [images, setImages] = useState<File[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showTermsModal, setShowTermsModal] = useState(false);
  const [isDocModalOpen, setIsDocModalOpen] = useState(false);
  const [docPreviewContent, setDocPreviewContent] = useState<string | null>(null);
  const [existingDocUrl, setExistingDocUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditMode = !!id;

  const [existingImages, setExistingImages] = useState<Array<{id: number, url: string}>>([]);
  const [imagesToDelete, setImagesToDelete] = useState<number[]>([]);

  useEffect(() => {
    const loadContributionData = async () => {
      if (isEditMode && id) {
        try {
          const contribution = await MvContributionServices.getContributionById(id);
          setTitle(contribution.name);
          setExistingDocUrl(contribution.doc_url);
          // Store both ID and URL for existing images
          setExistingImages(contribution.image_url.map(img => ({
            id: img.id,
            url: img.image_url
          })) || []);
        } catch (error) {
          console.error("Failed to load contribution:", error);
        
        }
      }
    };
    loadContributionData();
  }, [id, isEditMode, navigate]);

  const handleFilesSelect = (selectedFiles: File[]) => {
    const newImages: File[] = [];
    let newDocument: File | null = null;
    let errorMessage: string | null = null;

    for (const file of selectedFiles) {
      if (file.type.startsWith("image/")) {
        if (newImages.length >= 5) {
          errorMessage = "Maximum 5 images allowed";
          break;
        }
        newImages.push(file);
      } else if (file.type === "application/pdf" || 
                 file.type === "application/msword" || 
                 file.type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document") {
        if (newDocument) {
          errorMessage = "Only one document allowed";
          break;
        }
        newDocument = file;
      }
    }

    if (errorMessage) {
      setError(errorMessage);
      return;
    }

    setError(null);
    if (newDocument) setDocument(newDocument);
    if (newImages.length > 0) setImages(prev => [...prev, ...newImages]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!title.trim()) {
      setError("Please enter a title.");
      return;
    }

    if (!isEditMode && !document) {
      setError("Please upload a document.");
      return;
    }

    if (!isEditMode && images.length === 0) {
      setError("Please upload at least one image.");
      return;
    }

    if (!termsAccepted) {
      setError("Please accept the Terms and Conditions.");
      return;
    }

    setIsSubmitting(true);
    const userData = getUserData();
    if (!userData) throw new Error("Authentication required");
    
    const academicId = userData.academic_year_id || 0;
    const closureData = await getClosureDatebyAcademicYear(academicId.toString());
    const closureDateId = closureData[0]?.id || 0;
    try {
      if (isEditMode && id) {
        await MvContributionServices.updateContribution(
          Number(id),
          {
            name: title,
            delete_images: imagesToDelete, // Send only IDs of images to delete
            closure_date_id: closureDateId,
            user_id: userData.id
          },
          {
            doc: document || undefined,
            images: images.length > 0 ? images : undefined
          }
        );
        alert("Contribution updated successfully!");
      } else {
        // Create new contribution
        const academicId = userData.academic_year_id || 0;
        const closureData = await getClosureDatebyAcademicYear(academicId.toString());
        const closureDateId = closureData[0]?.id || 0;

        await MvContributionServices.createContribution(
          userData.id,
          closureDateId,
          title,
          document!,
          images
        );
        alert("Contribution submitted successfully!");
      }

      // Reset form and redirect
      resetForm();
      navigate("/students/submissions");
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      handleSubmissionError(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setTitle("");
    setDocument(null);
    setImages([]);
    setExistingDocUrl(null);
    setExistingImages([]);
    setTermsAccepted(false);
  };
  const handleDeleteExistingImage = (imageId: number) => {
    setImagesToDelete(prev => [...prev, imageId]);
    setExistingImages(prev => prev.filter(img => img.id !== imageId));
  };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleSubmissionError = (error: any) => {
    const errorMessage = error.response?.data?.message || 
      (isEditMode ? "Failed to update contribution" : "Failed to submit contribution");
    
    if (errorMessage.includes("already created")) {
      setError("You already have a contribution with this title");
    } else {
      setError(errorMessage);
    }
  };

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="max-w-2xl mx-auto p-4">
      <form
        onSubmit={handleSubmit}
        className="space-y-6 bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg"
      >
        <h2 className="text-2xl font-bold text-center">
          {isEditMode ? "Edit Contribution" : "New Contribution"}
        </h2>

        {isSubmitting && <MvLoader />}

        <MvInput
          label="Contribution Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />

        {existingDocUrl && (
          <div className="mb-4">
            <p className="text-sm text-gray-600 dark:text-gray-300">
              Current document:{" "}
              <a
                href={existingDocUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
              >
                View current document
              </a>
            </p>
          </div>
        )}

        <MvFileUpload
          onFilesSelect={handleFilesSelect}
          onDocumentClick={(preview) => {
            setDocPreviewContent(preview);
            setIsDocModalOpen(true);
          }}
          ref={fileInputRef}
          multiple={true}
          accept=".pdf,.doc,.docx,image/*"
        />

        <div className="grid grid-cols-3 gap-2">
        {existingImages.map((image, index) => (
        <div key={`existing-${image.id}`} className="relative group">
          <img
            src={image.url}
            alt={`Existing ${index + 1}`}
            className="h-32 w-full object-cover rounded border border-gray-200"
          />
          <button
            type="button"
            onClick={() => handleDeleteExistingImage(image.id)}
            className="absolute top-1 right-1 text-red-500 hover:text-red-700"
          >
            ×
          </button>
          <span className="absolute top-1 left-1 text-xs bg-gray-800 text-white px-2 py-1 rounded">
            Existing
          </span>
        </div>
      ))}
          {images.map((file, index) => (
            <div key={`new-${index}`} className="relative group">
              <img
                src={URL.createObjectURL(file)}
                alt={`New ${index + 1}`}
                className="h-32 w-full object-cover rounded border border-blue-200"
              />
              <button
                type="button"
                onClick={() => removeImage(index)}
                className="absolute top-1 right-1 text-red-500 hover:text-red-700"
              >
                ×
              </button>
              <span className="absolute bottom-1 left-1 text-xs bg-blue-600 text-white px-2 py-1 rounded">
                New
              </span>
            </div>
          ))}
        </div>

        {error && <p className="text-red-500 text-sm">{error}</p>}

        <div className="flex items-center gap-2">
          <MvCheckbox
            id="terms"
            checked={termsAccepted}
            onChange={(e) => setTermsAccepted(e.target.checked)}
            label="I agree to"
          />
          <button
            type="button"
            onClick={() => setShowTermsModal(true)}
            className="text-blue-600 dark:text-blue-400 hover:underline"
          >
            Terms and Conditions
          </button>
        </div>

        <MvButton
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Processing..." : isEditMode ? "Update Contribution" : "Submit Contribution"}
        </MvButton>
      </form>

      <MvTermsAndConditions
        isOpen={showTermsModal}
        onClose={() => setShowTermsModal(false)}
        onAccept={() => {
          setTermsAccepted(true);
          setShowTermsModal(false);
        }}
      />

      <MvModal
        isOpen={isDocModalOpen}
        onClose={() => setIsDocModalOpen(false)}
        title="Document Preview"
        className="max-w-3xl"
      >
        {docPreviewContent ? (
          <iframe 
            src={docPreviewContent}
            className="w-full h-96 border-none rounded-lg"
            title="Document preview"
          />
        ) : (
          <p className="text-gray-500">No preview available</p>
        )}
      </MvModal>
    </div>
  );
};
import React, { useState, useRef } from "react";
import { MvButton } from "../../MvButton";
import { MvInput, MvFileUpload, MvCheckbox } from "../../MvInput";
import { MvModal } from "../../MvModal";
import { MvContributionServices } from "../../../services/ContributionService";
import { getUserData } from "../../../services/AuthService";
import { MvLoader } from "../../MvLoader";
import { MvTermsAndConditions } from "../../MvToC";

export const MvContributionForm: React.FC = () => {
  const [title, setTitle] = useState("");

  const [document, setDocument] = useState<File | null>(null);
  const [images, setImages] = useState<File[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showTermsModal, setShowTermsModal] = useState(false);
  // Document preview modal state
  const [isDocModalOpen, setIsDocModalOpen] = useState(false);
  const [docPreviewContent, setDocPreviewContent] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

 
const handleFilesSelect = (selectedFiles: File[]) => {
  // Process all files to separate images and document
  const newImages: File[] = [];
  let newDocument: File | null = null;
  let errorMessage: string | null = null;

  // First pass: Validate files
  for (const file of selectedFiles) {
    if (file.type.startsWith("image/")) {
      if (newImages.length >= 5) {
        errorMessage = "Maximum 5 images allowed";
        break;
      }
      newImages.push(file);
    } else if (file.type.startsWith("application/")) {
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

  // Update states with complete list
  setError(null);
  setDocument(newDocument);
  setImages(newImages);
};
   
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log(images);

    if (!title.trim()) {
      setError("Please enter a title.");
      return;
    }
    if (!document) {
      setError("Please upload a document.");
      return;
    }
    if (images.length === 0) {
      setError("Please upload at least one image.");
      return;
    }
    if (!termsAccepted) {
      setError("Please accept the Terms and Conditions.");
      return;
    }

    setError(null);
    setIsSubmitting(true);
    try {
      
      const closureDateId = 1;
      let userId = 0;
      let academicId = 0;
      const userData = getUserData();
      
      if (userData) {
        try {
          
          userId = userData?.id || 0;
          academicId = userData?.academic_year_id|| 0;
          console.log(academicId);
        } catch (error) {
          console.error('Error parsing userData:', error);
        }
      }

      await MvContributionServices.createContribution(
        userId,
        closureDateId,
        title,
        document,
        images
      );

      alert("Contribution submitted successfully!");

      // Reset form
      setTitle("");
    
      setDocument(null);
      setImages([]);
      setTermsAccepted(false);
      setIsSubmitting(false);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error : any) {
      console.log(error?.response.data.message );
      if( error?.response.data.message   === "You already created this contribution.") {
        setError("You have already created contribution with the same title");
        setIsSubmitting(false);
        
        return
        
      }
      console.error("Error submitting contribution:", error);
      setError("An error occurred while submitting your contribution.");
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <form
        onSubmit={handleSubmit}
        className="w-11/12 max-sm/w-11/12 p-6 mx-auto space-y-4 shadow-lg bg-background-100/40 dark:bg-primary-700 rounded-2xl"
        encType="multipart/form-data"
      >
        {isSubmitting ? <MvLoader/> : ""}
        <h2 className="text-xl text-center font-semibold ">
          Submit Your Magazine Contribution
        </h2>
        {error && <p className="text-sm text-red-500">{error}</p>}
        
        <MvInput
          label="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        
       
        
        <MvFileUpload
          onFilesSelect={handleFilesSelect}
          onDocumentClick={(preview) => {
            setDocPreviewContent(preview);
            setIsDocModalOpen(true);
          }}
          ref={fileInputRef}
          multiple={true}
          accept="image/*,application/*"
        />
        <div className="text-sm text-gray-500">
          Upload requirements: 
          <ul className="list-disc pl-4">
            <li>1 document file (PDF, Word, etc.)</li>
            <li>Up to 5 images</li>
          </ul>
        </div>
        
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
            className="text-primary-600 hover:underline"
          >
            Terms and Conditions
          </button>
        </div>


        <MvButton type="submit" className="w-full bg-purple-600 hover:bg-purple-700 hover:dark:bg-purple-400 dark:bg-purple-500 dark:text-white" disabled={isSubmitting}>
          {isSubmitting ? "Submitting..." : "Submit"}
        </MvButton>
      </form>
       {/* Terms and Conditions Modal */}
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
      >
        {docPreviewContent ? (
          <div
            className="document-preview"
            dangerouslySetInnerHTML={{ __html: docPreviewContent }}
          />
        ) : (
          <p>No preview available.</p>
        )}
      </MvModal>
    </>
  );
};
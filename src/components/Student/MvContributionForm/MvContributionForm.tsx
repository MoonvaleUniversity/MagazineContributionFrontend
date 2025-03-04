import React, { useState, useRef } from "react";
import { MvButton } from "../../MvButton";
import { MvInput, MvTextarea, MvFileUpload, MvCheckbox } from "../../MvInput";
import { MvModal } from "../../MvModal";
import { MvContributionServices } from "../../../services/ContributionService";

export const MvContributionForm: React.FC = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [document, setDocument] = useState<File | null>(null);
  const [images, setImages] = useState<File[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Document preview modal state
  const [isDocModalOpen, setIsDocModalOpen] = useState(false);
  const [docPreviewContent, setDocPreviewContent] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Function to handle file selection
  const handleFilesSelect = (selectedFiles: File[]) => {
    const newImages: File[] = [];
    let newDocument: File | null = null;

    selectedFiles.forEach((file) => {
      if (file.type.startsWith("image/")) {
        newImages.push(file);
      } else if (file.type.startsWith("application/")) {
        if (!newDocument) {
          newDocument = file;
        } else {
          setError("Only one document file is allowed.");
        }
      }
    });

    if (newDocument) {
      setDocument(newDocument);
    }
    setImages(newImages);
    setError(null);
  };

  // Document preview function
  const handleDocumentPreview = (preview: string | null) => {
    setDocPreviewContent(preview);
    setIsDocModalOpen(true);
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Basic validation
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
      // Assume closureDateId is fetched from somewhere; using a dummy value here
      const closureDateId = 3;
      const userId = 1;

      // Submit contribution: Pass title as 'name', document as 'doc', and images as 'images'
      await MvContributionServices.createContribution(
        userId,
        closureDateId,
        title,
        document,
        images
      );

      alert("Contribution submitted successfully!");

      // Reset form after successful submission
      setTitle("");
      setDescription("");
      setDocument(null);
      setImages([]);
      setTermsAccepted(false);
      setIsSubmitting(false);
    } catch (error) {
      console.error("Error submitting contribution:", error);
      setError("An error occurred while submitting your contribution.");
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <form
        onSubmit={handleSubmit}
        className="w-11/12 max-sm:w-11/12 p-6 mx-auto space-y-4 shadow-lg bg-background-100/40 dark:bg-secondary-dark-700 rounded-2xl"
        encType="multipart/form-data"
      >
        <h2 className="text-xl text-center font-semibold text-primary-600 dark:text-primary-dark-200">
          Submit Your Magazine Contribution
        </h2>
        {error && <p className="text-sm text-red-500">{error}</p>}
        <MvInput
          label="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <MvTextarea
          label="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <MvFileUpload
          onFilesSelect={handleFilesSelect}
          onDocumentClick={handleDocumentPreview}
          ref={fileInputRef}
        />
        <div className="flex items-center space-x-2">
          <MvCheckbox
            id="terms"
            label="I agree to the Terms and Conditions"
            checked={termsAccepted}
            onChange={(e) => setTermsAccepted(e.target.checked)}
            className="w-4 h-4 border-gray-300 rounded text-primary-600 focus:ring-primary-500"
          />
        </div>

        <MvButton type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? "Submitting..." : "Submit"}
        </MvButton>
      </form>

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

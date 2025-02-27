import React, { useState, useRef } from "react";
import { MvCheckbox, MvFileUpload, MvInput, MvTextarea } from "../MvInput";
import { MvButton } from "../MvButton";
import { MvModal } from "../MvModal";

export const MvContributionForm: React.FC = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [termsAccepted, setTermsAccepted] = useState(false);
  // Document preview modal state
  const [isDocModalOpen, setIsDocModalOpen] = useState(false);
  const [docPreviewContent, setDocPreviewContent] = useState<string | null>(null); 
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  
  const handleFilesSelect = (selectedFiles: File[]) => {
    setFiles((prev) => [...prev, ...selectedFiles]);
  };

  const handleDocumentPreview = (preview: string | null) => {
    setDocPreviewContent(preview);
    setIsDocModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !description) {
      setError("Please fill in all required fields.");
      return;
    }
    if (files.length === 0) {
      setError("Please upload at least one file.");
      return;
    }
    if (!termsAccepted) {
      setError("Please accept the Terms and Conditions.");
      return;
    }
    setError(null);
    console.log({ title, description, files });
    alert("Submission successful!");
  };


  return (
    <>
      <form 
        onSubmit={handleSubmit} 
        className="max-w-lg p-6 mx-auto space-y-4 shadow-lg bg-background-50 dark:bg-secondary-dark-500 rounded-4xl"
      >
        <h2 className="text-xl font-semibold text-primary-600 dark:text-primary-dark-200">
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
          required
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
       
        <MvButton type="submit" className="w-full">
          Submit
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

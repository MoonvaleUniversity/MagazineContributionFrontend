import React, { useState } from "react";
import { MvFileUpload, MvInput, MvTextarea } from "../MvInput";
import { MvButton } from "../MvButton";


export const MvContributionForm: React.FC = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const [error, setError] = useState<string | null>(null);

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

    setError(null);
    console.log({ title, description, files });
    alert("Submission successful!");
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-lg p-6 mx-auto space-y-4 shadow-lg bg-background-50 dark:bg-secondary-dark-500 rounded-4xl">
      <h2 className="text-xl font-semibold text-primary-600 dark:text-primary-dark-200">Submit Your Magazine Contribution</h2>

      {error && <p className="text-sm text-red-500">{error}</p>}

      {/* Title Input */}
      <MvInput label="Title" value={title} onChange={(e) => setTitle(e.target.value)} required />

      {/* Description Textarea */}
      <MvTextarea label="Description" value={description} onChange={(e) => setDescription(e.target.value)} required />

      {/* File Upload */}
      <MvFileUpload onFilesSelect={setFiles} />

      {/* Submit Button */}
      <MvButton type="submit" className="w-full">Submit</MvButton>
    </form>
  );
};

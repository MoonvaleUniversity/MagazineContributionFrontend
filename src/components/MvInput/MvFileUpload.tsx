import React, { useState } from "react";
import clsx from "clsx";

interface FileUploadProps extends React.InputHTMLAttributes<HTMLInputElement> {
  onFilesSelect?: (files: File[]) => void;
}

export const MvFileUpload: React.FC<FileUploadProps> = ({ onFilesSelect, className, ...props }) => {
  const [files, setFiles] = useState<File[]>([]);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = event.target.files ? Array.from(event.target.files) : [];

    const validFiles = selectedFiles.filter(file => file.size <= 5 * 1024 * 1024); // 5MB limit
    const invalidFiles = selectedFiles.filter(file => file.size > 5 * 1024 * 1024);

    if (invalidFiles.length > 0) {
      setError("Some files exceed 5 MB and were not uploaded.");
    } else {
      setError(null);
    }

    setFiles(validFiles);
    if (onFilesSelect) onFilesSelect(validFiles);
  };

  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-3">
      <label
        className={clsx(
          "flex flex-col items-center justify-center w-full p-6 border-2 border-dashed rounded-4xl cursor-pointer transition duration-150",
          "bg-background-50 border-primary-600 text-primary-600 dark:bg-secondary-dark-500 dark:border-primary-dark-50 dark:text-primary-dark-200",
          className
        )}
      >
        {/* <Upload className="w-10 h-10 mb-2 text-primary-600" /> */}
        <span className="font-semibold text-primary-600 dark:text-primary-dark-200">
          Drag and drop or Click here to upload an image
        </span>
        <span className="mt-1 text-xs text-primary-400 dark:text-primary-dark-300">
          Image size must be less than 5 MB
        </span>
        {error && <span className="mt-1 text-sm text-red-500">{error}</span>}
        <input type="file" accept="image/*" multiple className="hidden" onChange={handleFileChange} {...props} />
      </label>

      {files.length > 0 && (
        <div className="flex flex-wrap gap-3">
          {files.map((file, index) => (
            <div key={index} className="relative w-24 h-24">
              <img src={URL.createObjectURL(file)} alt={file.name} className="object-cover w-full h-full rounded-lg" />
              <button
                className="absolute p-1 text-white transition bg-red-500 rounded-full top-1 right-1 hover:bg-red-700"
                onClick={() => removeFile(index)}
              >
                {/* <X size={16} /> */}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

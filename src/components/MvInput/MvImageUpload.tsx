import React, { useState, forwardRef } from "react";
import clsx from "clsx";
import { FaUpload, FaTimes } from "react-icons/fa";

interface MvImageUploadProps extends React.InputHTMLAttributes<HTMLInputElement> {
  onUpload?: (Blob: File | null) => void;
}

export const MvImageUpload = forwardRef<HTMLInputElement, MvImageUploadProps>(
  ({ onUpload, className, ...props }, ref) => {
    const [image, setImage] = useState<File | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [isDragOver, setIsDragOver] = useState(false);

    const validImageTypes = ["image/jpeg", "image/png"];

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      const selectedFile = event.target.files?.[0] || null;
      processFile(selectedFile);
      event.target.value = "";
    };

    const handleDrop = (event: React.DragEvent<HTMLLabelElement>) => {
      event.preventDefault();
      setIsDragOver(false);
      const droppedFile = event.dataTransfer.files?.[0] || null;
      processFile(droppedFile);
    };

    const handleDragOver = (event: React.DragEvent<HTMLLabelElement>) => {
      event.preventDefault();
      setIsDragOver(true);
    };

    const handleDragLeave = (event: React.DragEvent<HTMLLabelElement>) => {
      event.preventDefault();
      setIsDragOver(false);
    };

    const processFile = (file: File | null) => {
      if (!file) return;
      if (!validImageTypes.includes(file.type)) {
        setError("Invalid file type. Only JPG and PNG are allowed.");
        return;
      }
      setImage(file);
      setError(null);
      if (onUpload) onUpload(file);
    };

    const removeImage = () => {
      setImage(null);
      if (onUpload) onUpload(null);
    };

    return (
      <div className="space-y-3">
        <label
          className={clsx(
            "flex flex-col items-center justify-center w-full p-6 border-2 border-dashed rounded-4xl cursor-pointer transition duration-150",
            "bg-background-50 border-primary-600 text-primary-600 dark:bg-secondary-dark-500 dark:border-primary-dark-50 dark:text-primary-dark-200",
            isDragOver ? "border-blue-500" : "",
            className
          )}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
        >
          <FaUpload className="w-10 h-10 mb-2 text-primary-600 dark:text-primary-dark-200" />
          <span className="font-semibold">Drag & drop an image or click to upload</span>
          <input type="file" accept=".jpg,.jpeg,.png" onChange={handleFileChange} className="hidden" ref={ref} {...props} />
        </label>

        {error && <div className="text-red-500">{error}</div>}

        {image && (
          <div className="relative w-32 h-32">
            <img src={URL.createObjectURL(image)} alt="Uploaded preview" className="object-cover w-full h-full rounded-lg" />
            <button
              className="absolute p-1 text-white transition bg-red-500 rounded-full top-1 right-1 hover:bg-red-700"
              onClick={removeImage}
            >
              <FaTimes size={16} />
            </button>
          </div>
        )}
      </div>
    );
  }
);

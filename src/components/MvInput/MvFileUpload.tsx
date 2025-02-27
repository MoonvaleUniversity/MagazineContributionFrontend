import React, { useState, forwardRef } from "react";
import clsx from "clsx";
import { FaUpload, FaTimes, FaFileAlt } from "react-icons/fa";
import { renderAsync } from "docx-preview";

interface FileUploadProps extends React.InputHTMLAttributes<HTMLInputElement> {
  onFilesSelect?: (files: File[]) => void;
  onDocumentClick?: (preview: string | null) => void;
}

export const MvFileUpload = forwardRef<HTMLInputElement, FileUploadProps>(
  ({ onFilesSelect, onDocumentClick, className, ...props }, ref) => {
    const [images, setImages] = useState<File[]>([]);
    const [documents, setDocuments] = useState<File[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [isDragOver, setIsDragOver] = useState(false);

    const validImageTypes = ["image/jpeg", "image/png"];
    const validDocumentTypes = [
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    ];

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      const selectedFiles = event.target.files ? Array.from(event.target.files) : [];
      processFiles(selectedFiles);
      event.target.value = "";
    };

    const handleDrop = (event: React.DragEvent<HTMLLabelElement>) => {
      event.preventDefault();
      event.stopPropagation();
      setIsDragOver(false);
      const droppedFiles = event.dataTransfer.files ? Array.from(event.dataTransfer.files) : [];
      processFiles(droppedFiles);
    };

    const handleDragOver = (event: React.DragEvent<HTMLLabelElement>) => {
      event.preventDefault();
      event.stopPropagation();
      setIsDragOver(true);
    };

    const handleDragLeave = (event: React.DragEvent<HTMLLabelElement>) => {
      event.preventDefault();
      event.stopPropagation();
      setIsDragOver(false);
    };

    const processFiles = (selectedFiles: File[]) => {
      const newImages = selectedFiles.filter(file => validImageTypes.includes(file.type));
      const newDocuments = selectedFiles.filter(file => validDocumentTypes.includes(file.type));
      
      const duplicateFiles = selectedFiles.filter(file => 
        [...images, ...documents].some(existingFile => existingFile.name === file.name)
      );

      if (duplicateFiles.length > 0) {
        setError("Duplicate files are not allowed.");
        return;
      }
      
      if (newImages.length === 0 && newDocuments.length === 0) {
        setError("Invalid file type. Only JPG, PNG, DOC, and DOCX are allowed.");
        return;
      }
      
      setImages(prev => [...prev, ...newImages]);
      setDocuments(prev => [...prev, ...newDocuments]);
      setError(null);
      
      if (onFilesSelect) onFilesSelect([...newImages, ...newDocuments]);
    };

    const removeFile = (index: number, type: "image" | "document") => {
      if (type === "image") {
        setImages(prev => prev.filter((_, i) => i !== index));
      } else {
        setDocuments(prev => prev.filter((_, i) => i !== index));
      }
    };

    const handleDocumentClickLocal = (file: File) => {
      const reader = new FileReader();
      reader.onload = async (e) => {
        const arrayBuffer = e.target?.result;
        if (arrayBuffer && typeof arrayBuffer !== "string") {
          const container = document.createElement("div");
          try {
            await renderAsync(arrayBuffer, container);
            if (onDocumentClick) {
              onDocumentClick(container.innerHTML);
            }
          } catch (err) {
            console.error("Error rendering document:", err);
            if (onDocumentClick) {
              onDocumentClick(null);
            }
          }
        }
      };
      reader.readAsArrayBuffer(file);
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
          <span className="font-semibold">Drag & drop files here or click to upload</span>
          <input type="file" accept=".jpg,.jpeg,.png,.doc,.docx" onChange={handleFileChange} className="hidden" ref={ref} {...props} />
        </label>

        {error && <div className="text-red-500">{error}</div>}

        {images.length > 0 && (
          <div>
            <h3 className="text-lg font-semibold">Image Previews</h3>
            <div className="flex flex-wrap gap-3">
              {images.map((file, index) => (
                <div key={index} className="relative w-24 h-24">
                  <img src={URL.createObjectURL(file)} alt="Uploaded preview" className="object-cover w-full h-full rounded-lg" />
                  <button className="absolute p-1 text-white transition bg-red-500 rounded-full top-1 right-1 hover:bg-red-700" onClick={() => removeFile(index, "image")}>
                    <FaTimes size={16} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {documents.length > 0 && (
          <div>
            <h3 className="text-lg font-semibold">Documents</h3>
            <div className="flex flex-col gap-2">
              {documents.map((file, index) => (
                <div key={index} className="flex items-center justify-between p-2 bg-gray-100 rounded-lg dark:bg-gray-800">
                  <div className="flex items-center gap-2 cursor-pointer text-primary-600 dark:text-primary-dark-200" onClick={() => handleDocumentClickLocal(file)}>
                    <FaFileAlt size={20} />
                    <span>{file.name}</span>
                  </div>
                  <button className="p-1 text-white transition bg-red-500 rounded-full hover:bg-red-700" onClick={() => removeFile(index, "document")}>
                    <FaTimes size={16} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }
);

// MvFileUpload.tsx
import React, { useState, forwardRef, useCallback } from "react";
import clsx from "clsx";
import { FaUpload, FaTimes, FaFileAlt } from "react-icons/fa";
import { renderAsync } from "docx-preview";

interface FileUploadProps extends React.InputHTMLAttributes<HTMLInputElement> {
  onFilesSelect?: (files: File[]) => void;
  onDocumentClick?: (preview: string | null) => void;
}

export const MvFileUpload = forwardRef<HTMLInputElement, FileUploadProps>(
  ({ onFilesSelect, onDocumentClick,  ...props }, ref) => {
    const [images, setImages] = useState<File[]>([]);
    const [documents, setDocuments] = useState<File[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [isDragOver, setIsDragOver] = useState(false);

    const maxImages = 5;
    const validImageTypes = ["image/jpeg", "image/png"];
    const validDocumentTypes = [
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    ];

    const processFiles = useCallback((selectedFiles: File[]) => {
      const newImages: File[] = [];
      const newDocuments: File[] = [];
      let errorMessage: string | null = null;

      const currentImages = [...images];
      const currentDocs = [...documents];

      // Validate new files
      for (const file of selectedFiles) {
        if (validImageTypes.includes(file.type)) {
          if (currentImages.length + newImages.length >= maxImages) {
            errorMessage = `Maximum ${maxImages} images allowed`;
            break;
          }
          newImages.push(file);
        } else if (validDocumentTypes.includes(file.type)) {
          if (currentDocs.length + newDocuments.length >= 1) {
            errorMessage = "Only one document allowed";
            break;
          }
          newDocuments.push(file);
        } else {
          errorMessage = "Invalid file type. Only JPG, PNG, DOC, and DOCX are allowed.";
          break;
        }
      }

      // Check duplicates
      if (!errorMessage) {
        const allExisting = [...currentImages, ...currentDocs];
        const duplicates = selectedFiles.some(newFile => 
          allExisting.some(existing => 
            existing.name === newFile.name && 
            existing.size === newFile.size
          )
        );
        if (duplicates) errorMessage = "Duplicate files not allowed";
      }

      if (errorMessage) {
        setError(errorMessage);
        return;
      }

      setError(null);
      const updatedImages = [...currentImages, ...newImages];
      const updatedDocs = [...currentDocs, ...newDocuments];
      
      setImages(updatedImages);
      setDocuments(updatedDocs);
      onFilesSelect?.([...updatedImages, ...updatedDocs]);
    }, [images, documents, onFilesSelect]);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = e.target.files ? Array.from(e.target.files) : [];
      processFiles(files);
      e.target.value = "";
    };

    const handleDrop = (e: React.DragEvent<HTMLLabelElement>) => {
      e.preventDefault();
      setIsDragOver(false);
      const files = e.dataTransfer.files ? Array.from(e.dataTransfer.files) : [];
      processFiles(files);
    };

    const removeFile = useCallback((file: File) => {
      setImages(prev => prev.filter(f => !isSameFile(f, file)));
      setDocuments(prev => prev.filter(f => !isSameFile(f, file)));
      onFilesSelect?.([...images, ...documents].filter(f => !isSameFile(f, file)));
    }, [images, documents, onFilesSelect]);

    const handleDocumentPreview = useCallback(async (file: File) => {
      const reader = new FileReader();
      reader.onload = async (e) => {
        const arrayBuffer = e.target?.result;
        if (arrayBuffer instanceof ArrayBuffer) {
          const container = document.createElement("div");
          try {
            await renderAsync(arrayBuffer, container);
            onDocumentClick?.(container.innerHTML);
          } catch (er) {
            console.error(er);
            onDocumentClick?.(null);
          }
        }
      };
      reader.readAsArrayBuffer(file);
    }, [onDocumentClick]);

    return (
      <div className="space-y-3">
        <label
          className={clsx(
            "flex flex-col items-center justify-center w-full p-6 border-2 border-dashed rounded-4xl cursor-pointer",
            "bg-background-50 border-primary-600 text-primary-600 dark:bg-secondary-dark-500",
            isDragOver && "border-blue-500"
          )}
          onDrop={handleDrop}
          onDragOver={e => { e.preventDefault(); setIsDragOver(true); }}
          onDragLeave={() => setIsDragOver(false)}
        >
          <FaUpload className="w-10 h-10 mb-2" />
          <span className="font-semibold">Drag & drop files or click to upload</span>
          <input
            type="file"
            accept=".jpg,.jpeg,.png,.doc,.docx"
            onChange={handleFileChange}
            className="hidden"
            ref={ref}
            {...props}
          />
        </label>

        {error && <div className="text-red-500">{error}</div>}

        {images.length > 0 && (
          <div>
            <h3 className="text-lg font-semibold mb-2">Images</h3>
            <div className="flex flex-wrap gap-3">
              {images.map((file, i) => (
                <div key={i} className="relative w-24 h-24">
                  <img
                    src={URL.createObjectURL(file)}
                    alt="Preview"
                    className="w-full h-full object-cover rounded-lg"
                  />
                  <button
                    onClick={() => removeFile(file)}
                    className="absolute top-1 right-1 p-1 bg-red-500 rounded-full text-white hover:bg-red-600"
                  >
                    <FaTimes size={14} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {documents.length > 0 && (
          <div>
            <h3 className="text-lg font-semibold mb-2">Documents</h3>
            <div className="space-y-2">
              {documents.map((file, i) => (
                <div key={i} className="flex items-center justify-between p-2 bg-gray-100 dark:bg-gray-800 rounded-lg">
                  <div className="flex items-center gap-2 cursor-pointer" onClick={() => handleDocumentPreview(file)}>
                    <FaFileAlt className="text-primary-600 dark:text-primary-200" />
                    <span className="text-sm">{file.name}</span>
                  </div>
                  <button
                    onClick={() => removeFile(file)}
                    className="p-1 text-white bg-red-500 rounded-full hover:bg-red-600"
                  >
                    <FaTimes size={14} />
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

const isSameFile = (a: File, b: File) => a.name === b.name && a.size === b.size && a.type === b.type;
import React, { useState } from "react";
import { renderAsync } from "docx-preview";
import { MvModal } from "../MvModal";

interface DocumentPreviewProps {
  file: File;
  isOpen: boolean;
  onClose: () => void;
}

export const DocumentPreview: React.FC<DocumentPreviewProps> = ({ file, isOpen, onClose }) => {
  const [documentContent, setDocumentContent] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // Render the document content using the docx-preview library
  const renderDocument = (file: File) => {
    const reader = new FileReader();
    reader.onload = async (e) => {
      const arrayBuffer = e.target?.result;
      if (arrayBuffer && typeof arrayBuffer !== "string") {
        const container = document.createElement("div");
        try {
          setLoading(true);
          await renderAsync(arrayBuffer, container);
          setDocumentContent(container.innerHTML);
        } catch (err) {
          console.error("Error rendering document:", err);
          setDocumentContent(null);
        } finally {
          setLoading(false);
        }
      }
    };
    reader.readAsArrayBuffer(file);
  };

  // Trigger document rendering when file changes or modal opens
  React.useEffect(() => {
    if (isOpen && file) {
      renderDocument(file);
    }
  }, [isOpen, file]);

  if (!isOpen || !file) return null;

  return (
    <MvModal isOpen={isOpen} onClose={onClose} title="Document Preview">
      <div className="w-full">
        {loading ? (
          <div className="text-center">Loading document preview...</div>
        ) : documentContent ? (
          <div dangerouslySetInnerHTML={{ __html: documentContent }} />
        ) : (
          <div className="text-red-500">Failed to load document preview.</div>
        )}
      </div>
    </MvModal>
  );
};

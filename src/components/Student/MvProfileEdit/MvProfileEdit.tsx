import React, { useState, useRef } from "react";
import { MvButton } from "../../MvButton";
import { MvInput, MvTextarea, MvFileUpload, MvCheckbox } from "../../MvInput";
import { MvModal } from "../../MvModal";

export const MvProfileEdit: React.FC = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [bio, setBio] = useState("");
  const [isProfilePublic, setIsProfilePublic] = useState(false);
  const [profilePicture, setProfilePicture] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Modal state for image preview
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleFileSelect = (selectedFiles: File[]) => {
    if (selectedFiles.length > 0) {
      const file = selectedFiles[0];
      setProfilePicture(file);
      const url = URL.createObjectURL(file);
      setImagePreviewUrl(url);
    }
  };

  const handleImagePreview = () => {
    if (imagePreviewUrl) {
      setIsImageModalOpen(true);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!name || !email) {
      setError("Please fill in your name and email.");
      return;
    }

    setError(null);
    // Simulate profile update process
    console.log({ name, email, bio, isProfilePublic, profilePicture });
    alert("Profile updated successfully!");
  };

  return (
    <>
      <form
        onSubmit={handleSubmit}
        className="w-11/12 max-sm:w-11/12 p-6 mx-auto space-y-4 shadow-lg bg-background-100/40 dark:bg-secondary-dark-700 rounded-2xl"
      >
        <h2 className="text-xl text-center font-semibold text-primary-600 dark:text-primary-dark-200">
          Edit Profile
        </h2>
        {error && <p className="text-sm text-red-500">{error}</p>}
        <MvInput
          label="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <MvInput
          label="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <MvTextarea
          label="Bio"
          value={bio}
          onChange={(e) => setBio(e.target.value)}
        />
        <div className="flex flex-col space-y-2">
          <label className="text-sm text-gray-600 dark:text-primary-dark-200">
            Profile Picture
          </label>
          <MvFileUpload
            onFilesSelect={handleFileSelect}
            onDocumentClick={handleImagePreview}
            ref={fileInputRef}
          />
        </div>
        <div className="flex items-center space-x-2">
          <MvCheckbox
            id="profilePublic"
            label="Make Profile Public"
            checked={isProfilePublic}
            onChange={(e) => setIsProfilePublic(e.target.checked)}
            className="w-4 h-4 border-gray-300 rounded text-primary-600 focus:ring-primary-500"
          />
        </div>
        <MvButton type="submit" className="w-full">
          Save Changes
        </MvButton>
      </form>

      <MvModal
        isOpen={isImageModalOpen}
        onClose={() => setIsImageModalOpen(false)}
        title="Profile Picture Preview"
      >
        {imagePreviewUrl ? (
          <div className="image-preview">
            <img src={imagePreviewUrl} alt="Profile Preview" className="w-full h-auto" />
          </div>
        ) : (
          <p>No preview available.</p>
        )}
      </MvModal>
    </>
  );
};

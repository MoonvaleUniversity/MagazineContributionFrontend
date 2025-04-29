
import { useState, useEffect } from "react";
import { getAllFaculties } from "../../../services/FacultyService";
import { MvButton } from "../../MvButton";
import { MvDropdown, MvInput } from "../../MvInput";
import { IUser } from "../../../app/Types/objects/user";
import { getUserData } from "../../../services/AuthService";
import { updateUser } from "../../../services/userService";



export const MvProfileEdit: React.FC = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [facultyId, setFacultyId] = useState<string|number>();
 
  const [error, setError] = useState<string | null>(null);
  const [faculties, setFaculties] = useState<Array<{ id: number ; name: string }>>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
   
  useEffect(() => {
   
    const loadFaculties = async () => {
      try {
        const facultiesData = await getAllFaculties();
        setFaculties(facultiesData);
      } catch (error) {
        console.error("Failed to load faculties:", error);
      }
    };
    const loadUserData = async () => {
      const userData:IUser|null = getUserData();
      if (userData) {
      setName(userData.name);
      setEmail(userData.email);
      // eslint-disable-next-line @typescript-eslint/no-unused-expressions
      userData.faculty_id?  setFacultyId(userData.faculty_id)  : setFacultyId("");
      
      }
    }
    loadUserData();
    loadFaculties();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      // Basic validation
      if (!name || !email || !facultyId) {
        setError("Please fill in all required fields.");
      }

      if (password !== confirmPassword) {
        setError("Passwords do not match.");
      }

      // Prepare data for API
      const userData = {
        name,   
        password,
        password_confirmation: confirmPassword, // Match backend validation rule
      
      };

      let userId = 0;
      const storedUserData = localStorage.getItem('userData') || sessionStorage.getItem('userData');
      
      if (storedUserData) {
        try {
          const userData = JSON.parse(storedUserData);
          userId = userData?.id || 0;
        } catch (error) {
          console.error('Error parsing userData:', error);
        }
      }
      
      // Call update service
      const response = await updateUser(userId, userData);
      
      // Handle success
      alert("Profile updated successfully!");
      console.log("Update response:", response);
      
    } catch (error) {
      let errorMessage = "Failed to update profile";
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      setError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };
  return (
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
      disabled  
        label="Email"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      
      <MvDropdown
        
        options={faculties.map(f => ({ value: f.id, label: f.name }))}
        value={facultyId}
        onChange={(e) => setFacultyId(e.target.value)}
        required
      />
      
      <MvInput
        label="Password"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
       
      />
      
      <MvInput
        label="Confirm Password"
        type="password"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
      
      />
      
      <MvButton type="submit" className="w-full"   disabled={isSubmitting}>
      {isSubmitting ? "Saving..." : "Save Changes"}
      </MvButton>
    </form>
  );
};
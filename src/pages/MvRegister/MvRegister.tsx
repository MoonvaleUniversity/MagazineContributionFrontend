import { useState,  ChangeEvent, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { logo_dark, logo_light } from "../../app/MvConstants";
import MvRoutes from "../../app/MvRoutes";
import { MvButton } from "../../components/MvButton";
import { MvInput, MvPasswordInput, MvCheckbox } from "../../components/MvInput";
import { MvLoader } from "../../components/MvLoader";
import { MvThemeToggle } from "../../components/MvThemeToggle";
import { createGuest } from "../../services/GuestService";
import { getAllFaculties } from "../../services/FacultyService";
import { ResponseFaculty } from "../../app/MvObjects/faculty";

interface RegisterFormData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  facultyId: number | null;
  termsAccepted: boolean;
}

const RegisterGuest: React.FC = () => {
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [faculties, setFaculties] = useState<ResponseFaculty[]>([]);
  const [formData, setFormData] = useState<RegisterFormData>({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    facultyId: null,
    termsAccepted: false,
  });
  
  const navigate = useNavigate();
  useEffect(() => {
    const fetchFaculties = async () => {
      try {
        const faculties = await getAllFaculties();
        setFaculties(faculties);
      } catch (error) {
        console.log(error);
        setError("Failed to load faculties. Please refresh the page.");
      }
    };
    fetchFaculties();
  }, []);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === "facultyId" ? parseInt(value) : value
    }));
  };

  const handleCheckboxChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      termsAccepted: e.target.checked
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
  
    // Frontend validation
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    if (!formData.termsAccepted) {
      setError("You must accept the terms and conditions");
      return;
    }
    
   
    if (!formData.facultyId) {
      setError("Please select a faculty");
      return;
    }
    try {
      setLoading(true);
      
      await createGuest({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        password_confirmation: formData.confirmPassword, // Add confirmation
        faculty_id: formData.facultyId, // Add faculty ID
      });
  
    } catch (error) {
      console.error(error);
      const backendError = "Registration failed. Please try again.";
      setError(backendError);
    } finally {
      navigate(MvRoutes.LOGIN, { 
        state: { 
          registrationSuccess: true,
          message: "Guest registration successful! Please check your email."
        } 
      });
      setLoading(false);
    }
  };
  return (
    <>
      {loading && <MvLoader />}
      <div className="flex items-center justify-center min-h-screen">
        <form
          onSubmit={handleSubmit}
          className="flex flex-col justify-center w-full max-w-md gap-5 p-4 max-sm:w-11/12"
        >
          <img
            src={logo_dark}
            alt="logo"
            className="block w-3/4 mx-auto dark:hidden"
          />
          <img
            src={logo_light}
            alt="logo"
            className="hidden w-3/4 mx-auto dark:block"
          />

          <MvInput
            label="Full Name"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            required
          />

          <MvInput
            label="Email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleInputChange}
            required
          />

          <MvPasswordInput
            label="Password"
            name="password"
            value={formData.password}
            onChange={handleInputChange}
            required
          />

          <MvPasswordInput
            label="Confirm Password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleInputChange}
            required
          />

<div className="flex items-center gap-2 min-w-[200px]">
            <label className="text-sm dark:text-white">Faculty</label>
            <select
              name="facultyId"
              value={formData.facultyId || ""}
              onChange={handleInputChange}
              className="border-2 rounded-2xl p-2 border-primary-400 dark:border-primary-dark-500 bg-white dark:bg-secondary-dark-500 flex-1"
              required
            >
              <option value="">Select Faculty</option>
              {faculties.map(faculty => (
                <option key={faculty.id} value={faculty.id}>
                  {faculty.name}
                </option>
              ))}
            </select>
          </div>


          <MvCheckbox
            id="terms"
            label="I accept the terms and conditions"
            checked={formData.termsAccepted}
            onChange={handleCheckboxChange}
          />

          {error && <p className="text-center text-red-500">{error}</p>}

          <MvButton type="submit" className="w-1/2 mx-auto" disabled={loading}>
            {loading ? "Registering..." : "Register"}
          </MvButton>

          <p className="self-center dark:text-primary-50">
            Already have an account?{" "}
            <Link to={MvRoutes.LOGIN} className="text-primary-600 dark:text-primary-400">
              Login here
            </Link>
          </p>
        </form>
        <MvThemeToggle />
      </div>
    </>
  );
};

export default RegisterGuest;
// components/MvAccountCreation/MvAccountCreation.tsx
import { useState, FormEvent, useEffect } from "react";
import { MvDropdown, MvInput, MvPasswordInput } from "../../components/MvInput";
import { MvButton } from "../../components/MvButton";
import { getAllFaculties } from "../../services/FacultyService";
import { getAllAcademicYears } from "../../services/AcademicYearService";
import { IAcademicYear } from "../../app/MvObjects/academicyear";

interface AccountCreationFormProps {
  fixedRole: string;
  isSubmitting?: boolean;
  isFaculty?: boolean;
  isAcademicYear?: boolean;
  error?: string;
  onSubmit: (data: {
    name: string;
    email: string;
    password?: string;
    password_confirmation?: string;
    faculty_id?: string;
    academic_year_id?: string;
    role: string;
  }) => void;
  initialValues?: {
    name: string;
    email: string;
    password?: string;
    password_confirmation?: string;
    faculty_id?: string;
    academic_year_id?: string;
  };
}

const AccountCreationForm: React.FC<AccountCreationFormProps> = ({
  fixedRole,
  isSubmitting = false,
  error = "",
  isFaculty = false,
  isAcademicYear = false,
  onSubmit,
  initialValues,
}) => {
  const [name, setName] = useState(initialValues?.name || "");
  const [email, setEmail] = useState(initialValues?.email || "");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [formError, setFormError] = useState<string | null>(null);
  const [faculties, setFaculties] = useState<Array<{ id: number; name: string }>>([]);
  const [facultyId, setFacultyId] = useState(initialValues?.faculty_id?.toString() || "");
  const [academicYears, setAcademicYears] = useState<IAcademicYear[]>([]);
  const [academicYearId, setAcademicYearId] = useState(
    initialValues?.academic_year_id?.toString() || ""
  );
  const isEditMode = !!initialValues;

  useEffect(() => {
    const loadFaculties = async () => {
      try {
        const [facultiesData, academicYearsData] = await Promise.all([
          getAllFaculties(),
          getAllAcademicYears(),
        ]);
        setFaculties(facultiesData);
        setAcademicYears(academicYearsData);
      } catch (error) {
        console.error("Failed to load data:", error);
      }
    };
    loadFaculties();
  }, []);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormError(null);

    if (!isEditMode && password !== confirmPassword) {
      setFormError("Passwords do not match");
      return;
    }

    onSubmit({
      name,
      email,
      password: isEditMode ? undefined : password,
      password_confirmation: isEditMode ? undefined : confirmPassword,
      faculty_id: isFaculty ? facultyId : undefined,
      ...(isAcademicYear && { academic_year_id: academicYearId }),
      role: fixedRole,
    });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="w-xl max-sm:w-full p-6 mx-auto space-y-4 bg-background-100/40 dark:bg-secondary-dark-700 rounded-2xl"
    >
      <h2 className="text-xl text-center font-semibold text-primary-600 dark:text-primary-dark-200">
        {isEditMode ? `Edit User` : `Create ${fixedRole}`}
      </h2>

      {(error || formError) && (
        <p className="text-sm text-red-500">{error || formError}</p>
      )}

      <MvInput 
        label="Full Name" 
        value={name} 
        onChange={(e) => setName(e.target.value)} 
        required 
      />

      <MvInput
        label="Email"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />

      {!isEditMode && (
        <>
          <MvPasswordInput
            label="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <MvPasswordInput
            label="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </>
      )}

      {isAcademicYear && academicYears.length > 0 && (
        <MvDropdown
          placeholder="Academic Year"
          options={academicYears.map(ay => ({
            value: ay.id.toString(),
            label: ay.year_name
          }))}
          value={academicYearId}
          onChange={(value) => setAcademicYearId(value.toString())}
          required
        />
      )}

      {isFaculty && faculties.length > 0 && (
        <MvDropdown
          placeholder="Select Faculty"
          options={faculties.map(f => ({ 
            value: f.id.toString(),
            label: f.name 
          }))}
          value={facultyId}
          onChange={(value) => setFacultyId(value.toString())}
          required
        />
      )}

      <MvButton type="submit" className="w-full" disabled={isSubmitting}>
        {isSubmitting 
          ? `${isEditMode ? "Updating..." : "Creating..."}` 
          : `${isEditMode ? "Update User" : "Create " + fixedRole}`}
      </MvButton>
    </form>
  );
};

export default AccountCreationForm;
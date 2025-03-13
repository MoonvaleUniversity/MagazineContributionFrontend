import { useState, FormEvent } from "react";
import { MvCheckbox, MvInput } from "../../components/MvInput";
import { MvButton } from "../../components/MvButton";

interface AccountCreationFormProps {
  fixedRole: string;
  isSubmitting?: boolean;
  error?: string;
  onSubmit: (data: {
    name: string;
    email: string;
    password?: string;
    role: string;
  }) => void;
  initialValues?: {
    name: string;
    email: string;
    password?: string;
    confirmPassword?: string;
  };
}

const AccountCreationForm: React.FC<AccountCreationFormProps> = ({
  fixedRole,
  isSubmitting = false,
  error,
  onSubmit,
  initialValues,
}) => {
  const [name, setName] = useState<string>(initialValues?.name || "");
  const [email, setEmail] = useState<string>(initialValues?.email || "");
  const [password, setPassword] = useState<string>(initialValues?.password || "");
  const [confirmPassword, setConfirmPassword] = useState<string>(initialValues?.confirmPassword || "");
  const [termsAccepted, setTermsAccepted] = useState<boolean>(false);
  const [formError, setFormError] = useState<string | null>(null);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormError(null);

    if (!initialValues && password !== confirmPassword) {
      setFormError("Passwords do not match");
      return;
    }

    if (!termsAccepted) {
      setFormError("You must accept the terms and conditions");
      return;
    }

    onSubmit({
      name,
      email,
      password: initialValues ? undefined : password, // Omit password if editing
      role: fixedRole,
    });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="w-11/12 max-sm:w-11/12 p-6 mx-auto space-y-4 shadow-lg bg-background-100/40 dark:bg-secondary-dark-700 rounded-2xl"
    >
      <h2 className="text-xl text-center font-semibold text-primary-600 dark:text-primary-dark-200">
        {initialValues ? `Edit ${fixedRole} Account` : `Create ${fixedRole} Account`}
      </h2>

      {(error || formError) && (
        <p className="text-sm text-red-500">{error || formError}</p>
      )}

      <MvInput label="Full Name" value={name} onChange={(e) => setName(e.target.value)} required />

      <MvInput label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />

      {/* Password fields only for creation mode */}
      {!initialValues && (
        <>
          <MvInput label="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          <MvInput label="Confirm Password" type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />
        </>
      )}

      <div className="flex items-center space-x-2">
        <MvCheckbox
          id="terms"
          label="I agree to the Terms and Conditions"
          checked={termsAccepted}
          onChange={(e) => setTermsAccepted(e.target.checked)}
          className="w-4 h-4 border-gray-300 rounded text-primary-600 focus:ring-primary-500"
        />
      </div>

      <MvButton type="submit" className="w-full" disabled={isSubmitting}>
        {isSubmitting ? (initialValues ? `Updating ${fixedRole}...` : `Creating ${fixedRole}...`) : (initialValues ? `Update ${fixedRole}` : `Create ${fixedRole}`)}
      </MvButton>
    </form>
  );
};

export default AccountCreationForm;

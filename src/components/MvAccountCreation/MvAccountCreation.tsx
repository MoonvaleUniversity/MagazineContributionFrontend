import { useState, FormEvent } from "react";
import { MvCheckbox, MvInput } from "../../components/MvInput";
import { MvButton } from "../../components/MvButton";

interface AccountCreationFormProps {
  
  isSubmitting?: boolean;
  error?: string;
}

const AccountCreationForm: React.FC<AccountCreationFormProps> = ({
 
  isSubmitting = false,
  error,
}) => {
  const [fullName, setFullName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [termsAccepted, setTermsAccepted] = useState<boolean>(false);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
     
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="w-11/12 max-sm:w-11/12 p-6 mx-auto space-y-4 shadow-lg bg-background-100/40 dark:bg-secondary-dark-700 rounded-2xl"
    >
      <h2 className="text-xl text-center font-semibold text-primary-600 dark:text-primary-dark-200">
        Create an Account
      </h2>
      {error && <p className="text-sm text-red-500">{error}</p>}

      <MvInput
        label="Full Name"
        value={fullName}
        onChange={(e) => setFullName(e.target.value)}
        required
      />
      <MvInput
        label="Email"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      <MvInput
        label="Password"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />
      <MvInput
        label="Confirm Password"
        type="password"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
        required
      />

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
        {isSubmitting ? "Creating Account..." : "Create Account"}
      </MvButton>
    </form>
  );
};

export default AccountCreationForm;

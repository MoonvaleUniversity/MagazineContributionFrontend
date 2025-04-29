import { MvButton } from "../MvButton";
import { MvModal } from "../MvModal";

// --- TermsAndConditions Component ---
interface TermsAndConditionsProps {
  isOpen: boolean;
  onClose: () => void;
  onAccept: () => void;
}

export const MvTermsAndConditions: React.FC<TermsAndConditionsProps> = ({
  isOpen,
  onClose,
  onAccept,
}) => {
  return (
    <MvModal isOpen={isOpen} onClose={onClose} className="h-3/4" title="Terms and Conditions">
      <div className="p-4 overflow-y-auto mb-4 h-11/12">
      <div className="max-w-3xl mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-md p-8">
        <h1 className="text-2xl font-semibold text-blue-600 dark:text-blue-400 mb-6 text-center">Terms and Conditions for Student Contributions</h1>
        <ol className="list-decimal list-inside space-y-4 text-gray-700 dark:text-gray-300">
            <li>
                <h2 className="font-semibold text-gray-900 dark:text-gray-100">1. Eligibility</h2>
                <ul className="list-disc list-inside space-y-2">
                    <li className="dark:text-gray-300">Only registered students of Moonvale University are eligible to submit contributions.</li>
                    <li className="dark:text-gray-300">Students must verify their university email before submitting.</li>
                </ul>
            </li>
            <li>
                <h2 className="font-semibold text-gray-900 dark:text-gray-100">2. Content Ownership & Rights</h2>
                <ul className="list-disc list-inside space-y-2">
                    <li className="dark:text-gray-300">By submitting, Students retain ownership of their submitted work but grant Moonvale University an exclusive, royalty-free, perpetual license to use, modify, publish, and distribute the work for academic and publication purposes.</li>
                    <li className="dark:text-gray-300">The university will not sell or distribute student contributions for commercial purposes without additional consent.</li>
                    <li className="dark:text-gray-300">Once submitted, students cannot withdraw their work after the final closure date.</li>
                </ul>
            </li>
            <li>
                <h2 className="font-semibold text-gray-900 dark:text-gray-100">3. Submission Guidelines</h2>
                <ul className="list-disc list-inside space-y-2">
                    <li className="dark:text-gray-300">Students must ensure that all submitted content is original and does not infringe on any third-party copyrights or intellectual property rights.</li>
                    <li className="dark:text-gray-300">Plagiarized, AI-generated, or improperly credited work will be rejected.</li>
                     <li className="dark:text-gray-300">Articles must be submitted in Word format (.docx) and images in JPEG/PNG format.</li>
                </ul>
            </li>
            <li>
                <h2 className="font-semibold text-gray-900 dark:text-gray-100">4. Review & Publication</h2>
                <ul className="list-disc list-inside space-y-2">
                    <li className="dark:text-gray-300">Submissions will be reviewed by the assigned Marketing Coordinator of the respective faculty.</li>
                    <li className="dark:text-gray-300">Coordinators may request modifications or reject submissions if they do not meet quality, ethical, or content standards.</li>
                    <li className="dark:text-gray-300">Selected contributions will be published in the university magazine and made available to faculty guests.</li>
                </ul>
            </li>
            <li>
                <h2 className="font-semibold text-gray-900 dark:text-gray-100">5. Content Restrictions</h2>
                <p className="mb-2 dark:text-gray-300">Students must not submit content that:</p>
                <ul className="list-disc list-inside space-y-2">
                    <li className="dark:text-gray-300">Promotes hate speech, violence, discrimination, or illegal activities.</li>
                    <li className="dark:text-gray-300">Contains defamatory, misleading, or offensive material.</li>
                    <li className="dark:text-gray-300">Violates data privacy laws or includes personal information without consent.</li>
                </ul>
            </li>
            <li>
                <h2 className="font-semibold text-gray-900 dark:text-gray-100">6. Editing & Removal Policy</h2>
                <ul className="list-disc list-inside space-y-2">
                    <li className="dark:text-gray-300">Students can edit or delete their contributions before the final closure date.</li>
                    <li className="dark:text-gray-300">Once the final closure date passes, submissions are locked and cannot be changed or withdrawn.</li>
                </ul>
            </li>
            <li>
                <h2 className="font-semibold text-gray-900 dark:text-gray-100">7. Liability Disclaimer</h2>
                <ul className="list-disc list-inside space-y-2">
                    <li className="dark:text-gray-300">The university is not responsible for any data loss, content misuse, or technical failures that affect submissions.</li>
                    <li className="dark:text-gray-300">Students are responsible for keeping backup copies of their work.</li>
                </ul>
            </li>
            <li>
                <h2 className="font-semibold text-gray-900 dark:text-gray-100">8. Agreement Confirmation</h2>
                <ul className="list-disc list-inside space-y-2">
                     <li className="dark:text-gray-300">By submitting a contribution, students agree to these Terms and Conditions.</li>
                     <li className="dark:text-gray-300">A checkbox confirmation must be checked before submission.</li>
                </ul>
            </li>
        </ol>
    </div>
      </div>
      <div className="flex justify-end space-x-4">
        <MvButton onClick={onClose} variant="secondary">
          Decline
        </MvButton>
        <MvButton onClick={onAccept} variant="primary">
          Accept
        </MvButton>
      </div>
    </MvModal>
  );
};

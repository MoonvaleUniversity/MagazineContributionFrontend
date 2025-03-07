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
    <MvModal isOpen={isOpen} onClose={onClose} title="Terms and Conditions">
      <div className="max-h-60 overflow-y-auto mb-4">
        <p className="text-sm text-gray-700 dark:text-gray-300">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin convallis diam a
          nibh vulputate, non ultrices sem aliquam. Fusce sodales metus et sapien consequat,
          at cursus nibh convallis. Sed dignissim lacus vel lorem lacinia, nec lacinia risus
          dignissim. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere
          cubilia curae; Integer ut lectus vel lectus vestibulum dictum. Praesent ac lorem sit
          amet ex tempus condimentum.
          <br />
          <br />
          Nulla facilisi. Donec id velit nec ipsum auctor fringilla. Aliquam erat volutpat.
          Donec auctor, neque nec mollis porttitor, risus purus semper arcu, sed tempor leo urna
          sit amet turpis. Aenean ac bibendum libero, nec efficitur lectus. Duis scelerisque orci
          non diam gravida, ac convallis erat varius. Suspendisse potenti.
        </p>
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

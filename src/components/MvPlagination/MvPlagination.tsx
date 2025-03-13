// components/MvPagination.tsx

import { MvButton } from "../MvButton";


interface PaginationProps {
  currentPage: number;
  totalItems: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
  className?: string;
}

export const MvPagination = ({
  currentPage,
  totalItems,
  itemsPerPage,
  onPageChange,
  className = "",
}: PaginationProps) => {
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  return (
    <div className={`flex justify-center gap-2 ${className}`}>
      <MvButton
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="px-4 py-2"
        variant="secondary"
      >
        Previous
      </MvButton>
      
      {Array.from({ length: totalPages }, (_, i) => (
        <button
          key={i + 1}
          onClick={() => onPageChange(i + 1)}
          className={`px-4 py-2 rounded-4xl ${currentPage === i + 1 ? 'bg-blue-600 text-white' : ''}`}
        >
          {i + 1}
        </button>
      ))}
      
      <MvButton
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="px-4 py-2"  variant="secondary"
      >
        Next
      </MvButton>
    </div>
  );
};
import React from "react";

export const MvLoader: React.FC = () => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/15 bg-">
      <div className="loader"></div>
    </div>
  );
};

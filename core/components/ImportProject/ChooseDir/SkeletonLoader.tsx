import React from "react";

export const SkeletonLoader: React.FC = () => {
  return (
    <div className="space-y-3">
      <div className="h-4 rounded bg-gray-300"></div>
      <div className="h-4 rounded bg-gray-300"></div>
      <div className="h-4 rounded bg-gray-300"></div>
    </div>
  );
};

import React from 'react';

const SkeletonLoader: React.FC = () => {
  return (
<div className="flex flex-1 flex-col gap-2">
  <div className="flex justify-between items-center p-4 bg-white shadow-sm rounded-lg mb-4">
        <div className="flex w-full flex-col gap-3">
          <div className="h-3 bg-gray-200 rounded-2xl animate-pulse w-3/4"></div>
          <div className="h-3 bg-gray-200 rounded-2xl animate-pulse w-1/2"></div>
        </div>
        <div className="flex w-full flex-col items-end gap-3">
          <div className="h-3 bg-gray-200 rounded-2xl animate-pulse w-1/4"></div>
          <div className="h-3 bg-gray-200 rounded-2xl animate-pulse w-1/3"></div>
        </div>
  </div>
  <div className="flex justify-between items-center p-4 bg-white shadow-sm rounded-lg mb-4">
        <div className="flex w-full flex-col gap-3">
          <div className="h-3 bg-gray-200 rounded-2xl animate-pulse w-3/4"></div>
          <div className="h-3 bg-gray-200 rounded-2xl animate-pulse w-1/2"></div>
        </div>
        <div className="flex w-full flex-col items-end gap-3">
          <div className="h-3 bg-gray-200 rounded-2xl animate-pulse w-1/4"></div>
          <div className="h-3 bg-gray-200 rounded-2xl animate-pulse w-1/3"></div>
        </div>
  </div>
  <div className="flex justify-between items-center p-4 bg-white shadow-sm rounded-lg mb-4">
        <div className="flex w-full flex-col gap-3">
          <div className="h-3 bg-gray-200 rounded-2xl animate-pulse w-3/4"></div>
          <div className="h-3 bg-gray-200 rounded-2xl animate-pulse w-1/2"></div>
        </div>
        <div className="flex w-full flex-col items-end gap-3">
          <div className="h-3 bg-gray-200 rounded-2xl animate-pulse w-1/4"></div>
          <div className="h-3 bg-gray-200 rounded-2xl animate-pulse w-1/3"></div>
        </div>
  </div>
  <div className="flex justify-between items-center p-4 bg-white shadow-sm rounded-lg mb-4">
        <div className="flex w-full flex-col gap-3">
          <div className="h-3 bg-gray-200 rounded-2xl animate-pulse w-3/4"></div>
          <div className="h-3 bg-gray-200 rounded-2xl animate-pulse w-1/2"></div>
        </div>
        <div className="flex w-full flex-col items-end gap-3">
          <div className="h-3 bg-gray-200 rounded-2xl animate-pulse w-1/4"></div>
          <div className="h-3 bg-gray-200 rounded-2xl animate-pulse w-1/3"></div>
        </div>
  </div>
  <div className="flex justify-between items-center p-4 bg-white shadow-sm rounded-lg mb-4">
        <div className="flex w-full flex-col gap-3">
          <div className="h-3 bg-gray-200 rounded-2xl animate-pulse w-3/4"></div>
          <div className="h-3 bg-gray-200 rounded-2xl animate-pulse w-1/2"></div>
        </div>
        <div className="flex w-full flex-col items-end gap-3">
          <div className="h-3 bg-gray-200 rounded-2xl animate-pulse w-1/4"></div>
          <div className="h-3 bg-gray-200 rounded-2xl animate-pulse w-1/3"></div>
        </div>
  </div>
</div>
  );
};

export default SkeletonLoader;
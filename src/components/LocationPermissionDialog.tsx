import React from 'react';

interface LocationPermissionDialogProps {
  onRequestPermission: () => void;
  onCancel: () => void;
}

const LocationPermissionDialog: React.FC<LocationPermissionDialogProps> = ({
  onRequestPermission,
  onCancel,
}) => {
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Location Access Required</h2>
        <p className="text-gray-600 mb-6">
          This app needs access to your location to show accurate prayer times for your area.
          Please enable location services to continue.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-end">
          <button
            onClick={onCancel}
            className="px-4 py-2 rounded-xl border border-gray-200 text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Not Now
          </button>
          <button
            onClick={onRequestPermission}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-blue-500 text-white hover:from-blue-700 hover:to-blue-600 transition-colors shadow-lg shadow-blue-500/30"
          >
            Enable Location
          </button>
        </div>
      </div>
    </div>
  );
};

export default LocationPermissionDialog; 
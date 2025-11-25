import { useState } from 'react';
import { FaCheckCircle, FaTimesCircle, FaUser, FaBuilding, FaImage } from 'react-icons/fa';

// Rejection Remarks Modal Component
export default function RejectionModal({ isOpen, onClose, onConfirm, loading }) {
  const [remarks, setRemarks] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = () => {
    if (!remarks.trim()) {
      setError('Please provide a reason for rejection');
      return;
    }
    onConfirm(remarks);
  };

  const handleClose = () => {
    setRemarks('');
    setError('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-60"
      onClick={(e) => {
        if (e.target === e.currentTarget && !loading) handleClose();
      }}
    >
      <div className="bg-white rounded-2xl max-w-md w-full p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
            <FaTimesCircle className="text-red-600 text-xl" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900">Reject Clinic Registration</h3>
        </div>

        <p className="text-gray-600 text-sm mb-4">
          Please provide a clear explanation for why this clinic registration is being rejected. 
          This will help the clinic admin understand what needs to be corrected.
        </p>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Rejection Remarks <span className="text-red-500">*</span>
          </label>
          <textarea
            value={remarks}
            onChange={(e) => {
              setRemarks(e.target.value);
              if (error) setError('');
            }}
            placeholder="e.g., Invalid license document, incomplete address information, photos quality too low..."
            rows="5"
            className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 resize-none ${
              error 
                ? 'border-red-500 focus:ring-red-200' 
                : 'border-gray-300 focus:ring-primary/20 focus:border-primary'
            }`}
            disabled={loading}
          />
          {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
          <p className="text-xs text-gray-500 mt-2">
            {remarks.length} / 500 characters
          </p>
        </div>

        <div className="flex gap-3">
          <button
            onClick={handleClose}
            disabled={loading}
            className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed font-medium transition"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="flex-1 bg-red-600 text-white px-4 py-3 rounded-xl hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium transition"
          >
            {loading ? 'Rejecting...' : 'Confirm Rejection'}
          </button>
        </div>
      </div>
    </div>
  );
}
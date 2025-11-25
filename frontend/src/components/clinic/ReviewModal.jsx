import {  FaCheckCircle, FaTimesCircle, FaUser, FaBuilding, FaImage } from 'react-icons/fa';
import RejectionModal from './RejectionModal';
import { useState } from 'react';

export default function ReviewModal({ clinic, onClose, onStatusUpdate, loading, getStatusBadge }) {
  const [showRejectionModal, setShowRejectionModal] = useState(false);

  if (!clinic) return null;

  const handleReject = () => {
    setShowRejectionModal(true);
  };

  const handleConfirmRejection = (remarks) => {
    onStatusUpdate(clinic.clinic_id, 'rejected', remarks);
    setShowRejectionModal(false);
  };

  return (
    <>
      <div
        className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
        onClick={(e) => {
          if (e.target === e.currentTarget) onClose();
        }}
      >
        <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-hidden flex flex-col">
          {/* Header */}
          <div className="p-4 sm:p-6 border-b border-gray-200 shrink-0">
            <div className="flex items-center justify-between">
              <h2 className="text-xl sm:text-2xl font-semibold text-gray-900">Review Clinic</h2>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600 transition"
              >
                <FaTimesCircle className="text-2xl" />
              </button>
            </div>
          </div>

          {/* Scrollable Content */}
          <div className="p-4 sm:p-6 overflow-y-auto flex-1">
            <div className="space-y-6">
              {/* Status Badge */}
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl">
                <span className="text-sm font-medium text-gray-600">Current Status:</span>
                {getStatusBadge(clinic.status)}
              </div>

              {/* Clinic Images */}
              <div>
                <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <FaImage className="text-primary" />
                  Clinic Images
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {clinic.images && clinic.images.length > 0 ? (
                    clinic.images.map((img, idx) => (
                      <div key={idx} className="aspect-square rounded-xl overflow-hidden border border-gray-200">
                        <img src={img} alt={`Clinic ${idx + 1}`} className="w-full h-full object-cover" />
                      </div>
                    ))
                  ) : (
                    <>
                      {[1, 2, 3].map((i) => (
                        <div
                          key={i}
                          className="aspect-square rounded-xl bg-gray-100 flex items-center justify-center border border-gray-200"
                        >
                          <FaImage className="text-gray-400 text-3xl" />
                        </div>
                      ))}
                    </>
                  )}
                </div>
              </div>

              {/* Clinic Details */}
              <div>
                <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <FaBuilding className="text-primary" />
                  Clinic Information
                </h3>
                <div className="bg-gray-50 rounded-2xl p-4 space-y-4">
                  <div>
                    <label className="text-xs sm:text-sm font-medium text-gray-600 block mb-1">
                      Clinic Name
                    </label>
                    <div className="text-sm sm:text-base text-gray-900 wrap-break-words">{clinic.name}</div>
                  </div>
                  <div>
                    <label className="text-xs sm:text-sm font-medium text-gray-600 block mb-1">
                      Address
                    </label>
                    <div className="text-sm sm:text-base text-gray-900 wrap-break-words">{clinic.address}</div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs sm:text-sm font-medium text-gray-600 block mb-1">
                        Contact Number
                      </label>
                      <div className="text-sm sm:text-base text-gray-900 wrap-break-words">
                        {clinic.contact_number || 'N/A'}
                      </div>
                    </div>
                    <div>
                      <label className="text-xs sm:text-sm font-medium text-gray-600 block mb-1">
                        Email
                      </label>
                      <div className="text-sm sm:text-base text-gray-900 wrap-break-words">
                        {clinic.email || 'N/A'}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Owner Details */}
              <div>
                <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <FaUser className="text-primary" />
                  Owner Information
                </h3>
                <div className="bg-gray-50 rounded-2xl p-4 space-y-4">
                  <div>
                    <label className="text-xs sm:text-sm font-medium text-gray-600 block mb-1">
                      Owner Name
                    </label>
                    <div className="text-sm sm:text-base text-gray-900 wrap-break-words">{clinic.owner.name}</div>
                  </div>
                  <div>
                    <label className="text-xs sm:text-sm font-medium text-gray-600 block mb-1">
                      Owner Email
                    </label>
                    <div className="text-sm sm:text-base text-gray-900 wrap-break-words">
                      {clinic.owner.email}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Actions - Fixed at bottom */}
          <div className="p-4 sm:p-6 border-t border-gray-200 bg-gray-50 shrink-0">
            <div className="flex flex-col sm:flex-row gap-3">
              {clinic.status !== 'approved' && (
                <button
                  onClick={() => onStatusUpdate(clinic.clinic_id, 'approved')}
                  disabled={loading}
                  className="flex-1 bg-green-600 text-white px-4 py-3 rounded-xl hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium flex items-center justify-center gap-2 transition"
                >
                  <FaCheckCircle />
                  Approve
                </button>
              )}
              {clinic.status !== 'rejected' && (
                <button
                  onClick={handleReject}
                  disabled={loading}
                  className="flex-1 bg-red-600 text-white px-4 py-3 rounded-xl hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium flex items-center justify-center gap-2 transition"
                >
                  <FaTimesCircle />
                  Reject
                </button>
              )}
              <button
                onClick={onClose}
                disabled={loading}
                className="flex-1 bg-white border border-gray-300 text-gray-700 px-4 py-3 rounded-xl hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed font-medium transition"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Rejection Remarks Modal */}
      <RejectionModal
        isOpen={showRejectionModal}
        onClose={() => setShowRejectionModal(false)}
        onConfirm={handleConfirmRejection}
        loading={loading}
      />
    </>
  );
}
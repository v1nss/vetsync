import {  FaCheckCircle, FaTimesCircle, FaUser, FaBuilding, FaImage, FaChevronLeft, FaChevronRight, FaFileAlt, FaExpand } from 'react-icons/fa';
import RejectionModal from './RejectionModal';
import { useState } from 'react';
import DriveImage from '../DriveImage';
import ImageViewerModal from '../ImageViewerModal';

export default function ReviewModal({ clinic, onClose, onStatusUpdate, loading, getStatusBadge }) {
  const [showRejectionModal, setShowRejectionModal] = useState(false);
  const [currentClinicImageIndex, setCurrentClinicImageIndex] = useState(0);
  // Full-screen image viewer states
  const [viewerImages, setViewerImages] = useState(null);
  const [viewerIndex, setViewerIndex] = useState(null);

  if (!clinic) return null;
  
  const openImageViewer = (images, index) => {
    setViewerImages(images);
    setViewerIndex(index);
  };
  
  const closeImageViewer = () => {
    setViewerImages(null);
    setViewerIndex(null);
  };

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

              {/* Clinic Images Carousel */}
              {clinic.clinic_images && clinic.clinic_images.length > 0 && (
                <div>
                  <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <FaImage className="text-primary" />
                    Clinic Photos ({clinic.clinic_images.length})
                  </h3>
                  <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden">
                    <div 
                      className="relative aspect-video bg-gray-100 group cursor-pointer"
                      onClick={() => openImageViewer(clinic.clinic_images, currentClinicImageIndex)}
                    >
                      <DriveImage 
                        image={clinic.clinic_images[currentClinicImageIndex]} 
                        alt={clinic.clinic_images[currentClinicImageIndex]?.name || `Clinic image ${currentClinicImageIndex + 1}`}
                        className="w-full h-full object-cover" 
                      />
                      {/* Full Screen Overlay */}
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all duration-200 flex items-center justify-center">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            openImageViewer(clinic.clinic_images, currentClinicImageIndex);
                          }}
                          className="bg-black/50 hover:bg-black/70 text-white p-2 rounded-lg transition opacity-0 group-hover:opacity-100"
                        >
                          <FaExpand />
                        </button>
                      </div>
                      {clinic.clinic_images.length > 1 && (
                        <>
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              setCurrentClinicImageIndex((prev) => 
                                (prev - 1 + clinic.clinic_images.length) % clinic.clinic_images.length
                              );
                            }} 
                            className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition z-10"
                          >
                            <FaChevronLeft />
                          </button>
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              setCurrentClinicImageIndex((prev) => 
                                (prev + 1) % clinic.clinic_images.length
                              );
                            }} 
                            className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition z-10"
                          >
                            <FaChevronRight />
                          </button>
                          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 bg-black/50 text-white px-3 py-1 rounded-full text-sm pointer-events-none">
                            {currentClinicImageIndex + 1} / {clinic.clinic_images.length}
                          </div>
                        </>
                      )}
                    </div>
                    <div className="p-3 bg-gray-50 border-t border-gray-200">
                      <div className="flex gap-2 overflow-x-auto pb-1">
                        {clinic.clinic_images.map((image, idx) => (
                          <div 
                            key={image?.id || idx} 
                            onClick={() => setCurrentClinicImageIndex(idx)}
                            className="shrink-0"
                          >
                            <DriveImage 
                              image={image} 
                              alt={image?.name || `Thumbnail ${idx + 1}`}
                              className={`w-16 h-16 object-cover rounded-lg cursor-pointer transition ${
                                idx === currentClinicImageIndex ? 'ring-2 ring-primary' : 'opacity-60 hover:opacity-100'
                              }`}
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Required Documents - Separate Containers */}
              <div>
                <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <FaFileAlt className="text-blue-500" />
                  Required Documents
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* SEC/DTI Certificate */}
                  {clinic.secdti_url && (
                    <div className="bg-white border border-blue-200 rounded-2xl overflow-hidden">
                      <div className="p-3 bg-blue-50 border-b border-blue-200">
                        <h4 className="text-sm font-semibold text-gray-900">SEC/DTI Certificate</h4>
                      </div>
                      <div 
                        className="relative aspect-video bg-blue-50 group cursor-pointer"
                        onClick={() => openImageViewer([clinic.secdti_url], 0)}
                      >
                        <DriveImage 
                          image={clinic.secdti_url} 
                          alt="SEC/DTI Certificate"
                          className="w-full h-full object-cover" 
                        />
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all duration-200 flex items-center justify-center">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              openImageViewer([clinic.secdti_url], 0);
                            }}
                            className="bg-black/50 hover:bg-black/70 text-white p-2 rounded-lg transition opacity-0 group-hover:opacity-100"
                          >
                            <FaExpand />
                          </button>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Mayor's Permit */}
                  {clinic.mayor_permit_url && (
                    <div className="bg-white border border-blue-200 rounded-2xl overflow-hidden">
                      <div className="p-3 bg-blue-50 border-b border-blue-200">
                        <h4 className="text-sm font-semibold text-gray-900">Mayor's Permit</h4>
                      </div>
                      <div 
                        className="relative aspect-video bg-blue-50 group cursor-pointer"
                        onClick={() => openImageViewer([clinic.mayor_permit_url], 0)}
                      >
                        <DriveImage 
                          image={clinic.mayor_permit_url} 
                          alt="Mayor's Permit"
                          className="w-full h-full object-cover" 
                        />
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all duration-200 flex items-center justify-center">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              openImageViewer([clinic.mayor_permit_url], 0);
                            }}
                            className="bg-black/50 hover:bg-black/70 text-white p-2 rounded-lg transition opacity-0 group-hover:opacity-100"
                          >
                            <FaExpand />
                          </button>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* BIR Certificate */}
                  {clinic.bir_url && (
                    <div className="bg-white border border-blue-200 rounded-2xl overflow-hidden">
                      <div className="p-3 bg-blue-50 border-b border-blue-200">
                        <h4 className="text-sm font-semibold text-gray-900">BIR Certificate</h4>
                      </div>
                      <div 
                        className="relative aspect-video bg-blue-50 group cursor-pointer"
                        onClick={() => openImageViewer([clinic.bir_url], 0)}
                      >
                        <DriveImage 
                          image={clinic.bir_url} 
                          alt="BIR Certificate"
                          className="w-full h-full object-cover" 
                        />
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all duration-200 flex items-center justify-center">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              openImageViewer([clinic.bir_url], 0);
                            }}
                            className="bg-black/50 hover:bg-black/70 text-white p-2 rounded-lg transition opacity-0 group-hover:opacity-100"
                          >
                            <FaExpand />
                          </button>
                        </div>
                      </div>
                    </div>
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
                  {clinic.description && (
                    <div>
                      <label className="text-xs sm:text-sm font-medium text-gray-600 block mb-1">
                        Description
                      </label>
                      <div className="text-sm sm:text-base text-gray-900 wrap-break-words">
                        {clinic.description}
                      </div>
                    </div>
                  )}
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
      
      {/* Full-Screen Image Viewer */}
      <ImageViewerModal
        images={viewerImages}
        currentIndex={viewerIndex}
        onClose={closeImageViewer}
        onNavigate={setViewerIndex}
      />
    </>
  );
}
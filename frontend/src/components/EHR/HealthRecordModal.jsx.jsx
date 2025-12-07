import React from "react";
import { FiX, FiDownload } from "react-icons/fi";
import { RiMicroscopeLine, RiSyringeLine, RiBugLine } from "react-icons/ri";
import { FaPrescription } from "react-icons/fa";

const getDocumentIcon = (type) => {
  switch (type) {
    case "labResults":
      return <RiMicroscopeLine className="w-4 h-4" />;
    case "vaccineRecords":
      return <RiSyringeLine className="w-4 h-4" />;
    case "prescriptions":
      return <FaPrescription className="w-4 h-4" />;
    case "deworming":
      return <RiBugLine className="w-4 h-4" />;
    default:
      return null;
  }
};

const getDocumentColor = (type) => {
  switch (type) {
    case "labResults":
      return "bg-blue-100 text-blue-700";
    case "vaccineRecords":
      return "bg-green-100 text-green-700";
    case "prescriptions":
      return "bg-purple-100 text-purple-700";
    case "deworming":
      return "bg-orange-100 text-orange-700";
    default:
      return "bg-gray-100 text-gray-700";
  }
};

const getDocumentLabel = (type) => {
  switch (type) {
    case "labResults":
      return "Lab Results";
    case "vaccineRecords":
      return "Vaccine Records";
    case "prescriptions":
      return "Prescriptions";
    case "deworming":
      return "Deworming";
    default:
      return "";
  }
};

export default function HealthRecordModal({ healthRecord, pet, onClose }) {
  if (!healthRecord) return null;

  const handleDownload = (doc) => {
    alert(`Downloading: ${doc.documentName}`);
  };

  const documentTypes = ['labResults', 'vaccineRecords', 'prescriptions', 'deworming'];
  const availableDocs = documentTypes.filter(type => 
    healthRecord.documents[type] && healthRecord.documents[type].length > 0
  );

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Modal Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-gray-900">
              Health Record Details
            </h2>
            <p className="text-sm text-gray-600 mt-1">
              {pet.name} • {new Date(healthRecord.appointmentDate).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition"
          >
            <FiX className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6 space-y-6">
          {/* Appointment Info */}
          <div>
            <h3 className="text-sm font-semibold text-gray-600 uppercase tracking-wider mb-3">
              Appointment Information
            </h3>
            <div className="bg-gray-50 rounded-lg p-4 grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600">Date</p>
                <p className="font-medium text-gray-900">
                  {new Date(healthRecord.appointmentDate).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Veterinarian</p>
                <p className="font-medium text-gray-900">{healthRecord.veterinarian}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Clinic</p>
                <p className="font-medium text-gray-900">{healthRecord.clinic_name}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Reason for Visit</p>
                <p className="font-medium text-gray-900">{healthRecord.reason}</p>
              </div>
            </div>
          </div>

          {/* Documents */}
          {availableDocs.map(docType => (
            <div key={docType}>
              <h3 className="text-sm font-semibold text-gray-600 uppercase tracking-wider mb-3">
                {getDocumentLabel(docType)}
              </h3>
              <div className="space-y-3">
                {healthRecord.documents[docType].map(doc => (
                  <div key={doc.id} className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className={`p-1.5 rounded ${getDocumentColor(docType)}`}>
                          {getDocumentIcon(docType)}
                        </span>
                        <h4 className="font-semibold text-gray-900">{doc.documentName}</h4>
                      </div>
                      {(docType === 'prescriptions' || doc.fileUrl) && (
                        <button
                          onClick={() => handleDownload(doc)}
                          className="flex items-center gap-1 px-3 py-1.5 text-sm bg-primary text-white rounded-lg hover:bg-primary/90 transition"
                        >
                          <FiDownload className="w-3.5 h-3.5" />
                          Download
                        </button>
                      )}
                    </div>
                    <p className="text-sm text-gray-700 leading-relaxed">{doc.details}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}

          {/* Attached Files */}
          {healthRecord.attachedFiles && healthRecord.attachedFiles.length > 0 && (
            <div>
              <h3 className="text-sm font-semibold text-gray-600 uppercase tracking-wider mb-3">
                Attached Files
              </h3>
              <div className="space-y-2">
                {healthRecord.attachedFiles.map((file, index) => (
                  <a
                    key={file.id || index}
                    href={file.link || file.directLink || file.viewLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition"
                  >
                    <FiDownload className="w-5 h-5 text-gray-600" />
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">{file.name}</p>
                      <p className="text-xs text-gray-500">Click to view/download</p>
                    </div>
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 px-6 py-4">
          <button
            onClick={onClose}
            className="w-full px-6 py-2.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition font-medium"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
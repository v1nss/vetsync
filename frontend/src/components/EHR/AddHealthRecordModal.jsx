import React, { useState } from "react";
import { FiX, FiPlus, FiTrash2, FiUpload } from "react-icons/fi";
import { RiMicroscopeLine, RiSyringeLine } from "react-icons/ri";
import { FaPrescription } from "react-icons/fa";

export default function AddHealthRecordModal({ patient, onClose, onSave }) {
  const [formData, setFormData] = useState({
    appointmentDate: new Date().toISOString().split('T')[0],
    veterinarian: "",
    reason: "",
    documents: {
      labResults: [],
      vaccineRecords: [],
      prescriptions: []
    }
  });

  const [activeDocType, setActiveDocType] = useState(null);
  const [errors, setErrors] = useState({});

  // Add a new document to a specific type
  const addDocument = (type) => {
    const newDoc = {
      id: `${type}_${Date.now()}`,
      documentName: "",
      details: "",
      fileUrl: null
    };

    setFormData(prev => ({
      ...prev,
      documents: {
        ...prev.documents,
        [type]: [...(prev.documents[type] || []), newDoc]
      }
    }));
    setActiveDocType(type);
  };

  // Remove a document
  const removeDocument = (type, docId) => {
    setFormData(prev => ({
      ...prev,
      documents: {
        ...prev.documents,
        [type]: prev.documents[type].filter(doc => doc.id !== docId)
      }
    }));
  };

  // Update document field
  const updateDocument = (type, docId, field, value) => {
    setFormData(prev => ({
      ...prev,
      documents: {
        ...prev.documents,
        [type]: prev.documents[type].map(doc =>
          doc.id === docId ? { ...doc, [field]: value } : doc
        )
      }
    }));
  };

  // Handle file upload (mock - replace with actual upload logic)
  const handleFileUpload = (type, docId, file) => {
    // TODO: Implement actual file upload to your server
    console.log("Uploading file:", file.name);
    
    // Mock file URL
    const fileUrl = URL.createObjectURL(file);
    updateDocument(type, docId, 'fileUrl', fileUrl);
  };

  // Validate form
  const validateForm = () => {
    const newErrors = {};

    if (!formData.appointmentDate) {
      newErrors.appointmentDate = "Appointment date is required";
    }
    if (!formData.veterinarian.trim()) {
      newErrors.veterinarian = "Veterinarian name is required";
    }
    if (!formData.reason.trim()) {
      newErrors.reason = "Reason for visit is required";
    }

    // Check if at least one document is added
    const hasDocuments = 
      formData.documents.labResults.length > 0 ||
      formData.documents.vaccineRecords.length > 0 ||
      formData.documents.prescriptions.length > 0;

    if (!hasDocuments) {
      newErrors.documents = "Please add at least one document";
    }

    // Validate each document has required fields
    ['labResults', 'vaccineRecords', 'prescriptions'].forEach(type => {
      formData.documents[type].forEach((doc, index) => {
        if (!doc.documentName.trim()) {
          newErrors[`${type}_${index}_name`] = "Document name is required";
        }
        if (!doc.details.trim()) {
          newErrors[`${type}_${index}_details`] = "Details are required";
        }
      });
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    // Prepare data for API
    const healthRecord = {
      id: `hr_${Date.now()}`,
      patientId: patient.id,
      appointmentDate: formData.appointmentDate,
      veterinarian: formData.veterinarian,
      reason: formData.reason,
      documents: {
        labResults: formData.documents.labResults.length > 0 ? formData.documents.labResults : null,
        vaccineRecords: formData.documents.vaccineRecords.length > 0 ? formData.documents.vaccineRecords : null,
        prescriptions: formData.documents.prescriptions.length > 0 ? formData.documents.prescriptions : null
      },
      createdAt: new Date().toISOString()
    };

    // Call the onSave callback
    onSave(healthRecord);
  };

  const documentTypes = [
    { key: 'labResults', label: 'Lab Results', icon: RiMicroscopeLine, color: 'blue' },
    { key: 'vaccineRecords', label: 'Vaccine Records', icon: RiSyringeLine, color: 'green' },
    { key: 'prescriptions', label: 'Prescriptions', icon: FaPrescription, color: 'purple' }
  ];

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl max-w-5xl w-full max-h-[90vh] overflow-y-auto">
        {/* Modal Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-gray-900">
              Add Health Record
            </h2>
            <p className="text-sm text-gray-600 mt-1">
              {patient.name} • {patient.species} • {patient.breed}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition"
          >
            <FiX className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Basic Information */}
          <div>
            <h3 className="text-sm font-semibold text-gray-600 uppercase tracking-wider mb-4">
              Appointment Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Appointment Date *
                </label>
                <input
                  type="date"
                  value={formData.appointmentDate}
                  onChange={(e) => setFormData({ ...formData, appointmentDate: e.target.value })}
                  className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 ${
                    errors.appointmentDate ? 'border-red-500' : 'border-gray-200'
                  }`}
                />
                {errors.appointmentDate && (
                  <p className="text-red-500 text-xs mt-1">{errors.appointmentDate}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Veterinarian *
                </label>
                <input
                  type="text"
                  value={formData.veterinarian}
                  onChange={(e) => setFormData({ ...formData, veterinarian: e.target.value })}
                  placeholder="Dr. John Smith"
                  className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 ${
                    errors.veterinarian ? 'border-red-500' : 'border-gray-200'
                  }`}
                />
                {errors.veterinarian && (
                  <p className="text-red-500 text-xs mt-1">{errors.veterinarian}</p>
                )}
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Reason for Visit *
                </label>
                <input
                  type="text"
                  value={formData.reason}
                  onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                  placeholder="Annual Wellness Check, Vaccination, Follow-up, etc."
                  className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 ${
                    errors.reason ? 'border-red-500' : 'border-gray-200'
                  }`}
                />
                {errors.reason && (
                  <p className="text-red-500 text-xs mt-1">{errors.reason}</p>
                )}
              </div>
            </div>
          </div>

          {/* Documents Section */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-gray-600 uppercase tracking-wider">
                Medical Documents *
              </h3>
              {errors.documents && (
                <p className="text-red-500 text-xs">{errors.documents}</p>
              )}
            </div>

            {/* Add Document Buttons */}
            <div className="flex flex-wrap gap-2 mb-6">
              {documentTypes.map(({ key, label, icon: Icon, color }) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => addDocument(key)}
                  className={`flex items-center gap-2 px-4 py-2 bg-${color}-50 text-${color}-700 border border-${color}-200 rounded-lg hover:bg-${color}-100 transition`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="text-sm font-medium">Add {label}</span>
                  <FiPlus className="w-3.5 h-3.5" />
                </button>
              ))}
            </div>

            {/* Document Forms */}
            <div className="space-y-6">
              {documentTypes.map(({ key, label, icon: Icon, color }) => (
                formData.documents[key].length > 0 && (
                  <div key={key}>
                    <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                      <Icon className={`w-4 h-4 text-${color}-600`} />
                      {label} ({formData.documents[key].length})
                    </h4>
                    <div className="space-y-4">
                      {formData.documents[key].map((doc, index) => (
                        <div key={doc.id} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                          <div className="flex items-start justify-between mb-3">
                            <span className="text-sm font-medium text-gray-700">
                              {label} #{index + 1}
                            </span>
                            <button
                              type="button"
                              onClick={() => removeDocument(key, doc.id)}
                              className="p-1 text-red-600 hover:bg-red-50 rounded transition"
                            >
                              <FiTrash2 className="w-4 h-4" />
                            </button>
                          </div>

                          <div className="space-y-3">
                            <div>
                              <label className="block text-xs font-medium text-gray-600 mb-1">
                                Document Name *
                              </label>
                              <input
                                type="text"
                                value={doc.documentName}
                                onChange={(e) => updateDocument(key, doc.id, 'documentName', e.target.value)}
                                placeholder={`e.g., ${key === 'labResults' ? 'Blood Test Results' : key === 'vaccineRecords' ? 'Rabies Vaccination' : 'Amoxicillin Prescription'}`}
                                className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 ${
                                  errors[`${key}_${index}_name`] ? 'border-red-500' : 'border-gray-200'
                                }`}
                              />
                              {errors[`${key}_${index}_name`] && (
                                <p className="text-red-500 text-xs mt-1">{errors[`${key}_${index}_name`]}</p>
                              )}
                            </div>

                            <div>
                              <label className="block text-xs font-medium text-gray-600 mb-1">
                                Details *
                              </label>
                              <textarea
                                value={doc.details}
                                onChange={(e) => updateDocument(key, doc.id, 'details', e.target.value)}
                                placeholder="Enter detailed information about this document..."
                                rows={3}
                                className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 ${
                                  errors[`${key}_${index}_details`] ? 'border-red-500' : 'border-gray-200'
                                }`}
                              />
                              {errors[`${key}_${index}_details`] && (
                                <p className="text-red-500 text-xs mt-1">{errors[`${key}_${index}_details`]}</p>
                              )}
                            </div>

                            <div>
                              <label className="block text-xs font-medium text-gray-600 mb-1">
                                Attach File (Optional)
                              </label>
                              <div className="flex items-center gap-2">
                                <label className="flex-1 flex items-center justify-center gap-2 px-3 py-2 border-2 border-dashed border-gray-300 rounded-lg hover:border-primary cursor-pointer transition">
                                  <FiUpload className="w-4 h-4 text-gray-500" />
                                  <span className="text-sm text-gray-600">
                                    {doc.fileUrl ? 'File attached' : 'Choose file'}
                                  </span>
                                  <input
                                    type="file"
                                    onChange={(e) => handleFileUpload(key, doc.id, e.target.files[0])}
                                    className="hidden"
                                    accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                                  />
                                </label>
                                {doc.fileUrl && (
                                  <button
                                    type="button"
                                    onClick={() => updateDocument(key, doc.id, 'fileUrl', null)}
                                    className="p-2 text-red-600 hover:bg-red-50 rounded transition"
                                  >
                                    <FiTrash2 className="w-4 h-4" />
                                  </button>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )
              ))}
            </div>

            {/* Empty State */}
            {formData.documents.labResults.length === 0 &&
             formData.documents.vaccineRecords.length === 0 &&
             formData.documents.prescriptions.length === 0 && (
              <div className="text-center py-8 border-2 border-dashed border-gray-200 rounded-lg">
                <p className="text-gray-500 text-sm">
                  No documents added yet. Click the buttons above to add medical documents.
                </p>
              </div>
            )}
          </div>

          {/* Form Actions */}
          <div className="flex gap-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition font-medium"
            >
              Save Health Record
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
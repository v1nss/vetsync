import { useState, useEffect } from "react";

export default function AssignVetModal({ isOpen, onClose, appointment, vets, onAssign }) {
  const [selectedVet, setSelectedVet] = useState("");
  const [isAssigning, setIsAssigning] = useState(false);
  
  useEffect(() => {
    if (isOpen && appointment) {
      setSelectedVet(appointment.vet_id || "");
      setIsAssigning(false); // Reset loading state when modal opens
    }
  }, [isOpen, appointment]);

  if (!isOpen || !appointment) return null;

  const handleSubmit = async () => {
    if (!selectedVet) {
      alert("Please select a veterinarian");
      return;
    }
    
    if (isAssigning) return; // Prevent double-click
    
    setIsAssigning(true);
    try {
      await onAssign(selectedVet);
    } catch (error) {
      console.error("Error assigning vet:", error);
      setIsAssigning(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-9999 p-4">
      <div className="bg-white rounded-2xl max-w-md w-full p-8">
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">Assign Veterinarian</h2>
        <p className="text-gray-600 mb-6">
          Appointment for <span className="font-medium text-gray-900">{appointment.pet_name}</span>
        </p>

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Select Veterinarian
          </label>
          <select
            value={selectedVet}
            onChange={(e) => setSelectedVet(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent"
          >
            <option value="">Choose a vet...</option>
            {vets.map((vet) => (
              <option key={vet.user_id} value={vet.user_id}>
                Dr. {vet.User?.first_name} - {vet.specialization}
              </option>
            ))}
          </select>
        </div>

        <div className="flex gap-3">
          <button
            onClick={onClose}
            disabled={isAssigning}
            className="flex-1 px-4 py-3 bg-gray-200 text-gray-700 rounded-xl hover:bg-gray-300 transition font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={isAssigning}
            className="flex-1 px-4 py-3 bg-primary text-white rounded-xl hover:bg-primary/90 transition font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isAssigning ? (
              <span className="flex items-center justify-center gap-2">
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                Assigning...
              </span>
            ) : (
              "Assign"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
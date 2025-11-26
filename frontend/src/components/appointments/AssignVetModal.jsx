import { useState, useEffect } from "react";

export default function AssignVetModal({ isOpen, onClose, appointment, vets, onAssign }) {
  const [selectedVet, setSelectedVet] = useState("");

  useEffect(() => {
    if (isOpen && appointment) {
      setSelectedVet(appointment.assigned_vet || "");
    }
  }, [isOpen, appointment]);

  if (!isOpen || !appointment) return null;

  const handleSubmit = () => {
    if (!selectedVet) {
      alert("Please select a veterinarian");
      return;
    }
    onAssign(selectedVet);
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
              <option key={vet.id} value={vet.name}>
                {vet.name} - {vet.specialization}
              </option>
            ))}
          </select>
        </div>

        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-3 bg-gray-200 text-gray-700 rounded-xl hover:bg-gray-300 transition font-medium"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="flex-1 px-4 py-3 bg-primary text-white rounded-xl hover:bg-primary/90 transition font-medium"
          >
            Assign
          </button>
        </div>
      </div>
    </div>
  );
}
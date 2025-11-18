import { FaPrescription } from "react-icons/fa";

export default function Prescriptions({ pet }) {
  
  const prescriptions = (pet.appointmentHistory || []).flatMap((appointment) => 
    (appointment.prescriptions || []).map(prescription => ({
      ...prescription,
      appointmentDate: appointment.date,
      appointmentReason: appointment.reason
    }))
  );

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-900">Prescriptions</h3>
      
      {prescriptions.length > 0 ? (
        <div className="space-y-3">
          {prescriptions.map((prescription, index) => (
            <div key={index} className="bg-gray-50 rounded-xl p-4 border border-gray-200">
              <div className="flex justify-between items-start mb-3">
                <h4 className="font-semibold text-gray-900">{prescription.medication}</h4>
                <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                  prescription.status === "Active"
                    ? "bg-green-100 text-green-700"
                    : "bg-gray-100 text-gray-700"
                }`}>
                  {prescription.status}
                </span>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Dosage:</span>
                  <span className="font-medium text-gray-900">{prescription.dosage}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Frequency:</span>
                  <span className="font-medium text-gray-900">{prescription.frequency}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Duration:</span>
                  <span className="font-medium text-gray-900">{prescription.duration}</span>
                </div>
              </div>
              {prescription.instructions && (
                <div className="mt-3 pt-3 border-t border-gray-200">
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Instructions:</span> {prescription.instructions}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-gray-50 rounded-xl">
          <FaPrescription className="w-12 h-12 text-gray-400 mx-auto mb-3" />
          <p className="text-gray-600">No prescriptions for this appointment</p>
        </div>
      )}
    </div>
  );
}
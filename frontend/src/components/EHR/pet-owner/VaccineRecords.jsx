import { RiSyringeLine } from "react-icons/ri";

export default function VaccineRecords({ pet }) {
  const allVaccines = (pet.appointmentHistory || []).flatMap((appointment) => 
    (appointment.vaccines || []).map(vaccine => ({
      ...vaccine,
      appointmentDate: appointment.date,
      appointmentReason: appointment.reason
    }))
  );

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-900">Vaccine Records</h3>
      
      {allVaccines.length > 0 ? (
        <div className="space-y-3">
          {allVaccines.map((vaccine, index) => (
            <div key={index} className="bg-gray-50 rounded-xl p-4 border border-gray-200">
              <div className="flex justify-between items-start mb-2">
                <h4 className="font-semibold text-gray-900">{vaccine.name}</h4>
                <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
                  {vaccine.type}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-600 mb-1">Lot Number</p>
                  <p className="font-medium text-gray-900">{vaccine.lotNumber}</p>
                </div>
                <div>
                  <p className="text-gray-600 mb-1">Next Due</p>
                  <p className="font-medium text-gray-900">{vaccine.nextDue}</p>
                </div>
              </div>
              {vaccine.notes && (
                <p className="text-sm text-gray-600 mt-3">
                  Notes: {vaccine.notes}
                </p>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-gray-50 rounded-xl">
          <RiSyringeLine className="w-12 h-12 text-gray-400 mx-auto mb-3" />
          <p className="text-gray-600">No vaccines administered in this appointment</p>
        </div>
      )}
    </div>
  );
}
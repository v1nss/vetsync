import { RiMicroscopeLine } from "react-icons/ri";

export default function LabResults({ pet }) {
  const allLabResults = (pet.appointmentHistory || []).flatMap((appointment) => 
    (appointment.labResults || []).map(result => ({
      ...result,
      appointmentDate: appointment.date,
      appointmentReason: appointment.reason
    }))
  );

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-900">Laboratory Results</h3>
      
      {allLabResults.length > 0 ? (
        <div className="space-y-3">
          {allLabResults.map((result, index) => (
            <div key={index} className="bg-gray-50 rounded-xl p-4 border border-gray-200">
              <div className="flex justify-between items-start mb-3">
                <h4 className="font-semibold text-gray-900">{result.test}</h4>
                <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                  result.status === "Normal"
                    ? "bg-green-100 text-green-700"
                    : result.status === "Abnormal"
                    ? "bg-red-100 text-red-700"
                    : "bg-yellow-100 text-yellow-700"
                }`}>
                  {result.status}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-600 mb-1">Result</p>
                  <p className="font-medium text-gray-900">{result.value}</p>
                </div>
                <div>
                  <p className="text-gray-600 mb-1">Reference Range</p>
                  <p className="font-medium text-gray-900">{result.range}</p>
                </div>
              </div>
              {result.notes && (
                <p className="text-sm text-gray-600 mt-3 pt-3 border-t border-gray-200">
                  Notes: {result.notes}
                </p>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-gray-50 rounded-xl">
          <RiMicroscopeLine className="w-12 h-12 text-gray-400 mx-auto mb-3" />
          <p className="text-gray-600">No lab results for this appointment</p>
        </div>
      )}
    </div>
  );
}
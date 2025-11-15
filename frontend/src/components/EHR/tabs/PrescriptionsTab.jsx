import React from "react";

export default function PrescriptionsTab({ prescriptions }) {
  if (!prescriptions || prescriptions.length === 0) {
    return <p className="text-gray-500 text-sm">No prescriptions available.</p>;
  }

  return (
    <div className="space-y-4">
      {prescriptions.map((item, index) => (
        <div
          key={index}
          className="border border-gray-200 rounded-xl p-4 bg-white"
        >
          <div className="flex justify-between items-start">
            <h3 className="font-semibold text-gray-800 text-lg">
              {item.medication}
            </h3>
            <span className="text-sm text-gray-500">{item.date}</span>
          </div>

          <p className="text-gray-600 text-sm mt-1">Dosage: {item.dosage}</p>

          {item.instructions && (
            <p className="text-gray-600 text-sm mt-1">
              Instructions: {item.instructions}
            </p>
          )}

          {item.prescribedBy && (
            <p className="text-gray-500 text-xs mt-2">
              Prescribed by: {item.prescribedBy}
            </p>
          )}
        </div>
      ))}
    </div>
  );
}

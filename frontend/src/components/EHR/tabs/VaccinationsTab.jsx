import React from "react";

export default function VaccinationsTab({ vaccinations }) {
  if (!vaccinations || vaccinations.length === 0) {
    return <p className="text-gray-500 text-sm">No vaccination records available.</p>;
  }

  return (
    <div className="space-y-4">
      {vaccinations.map((vac, index) => (
        <div
          key={index}
          className="border border-gray-200 rounded-xl p-4 bg-white"
        >
          <div className="flex justify-between items-start mb-2">
            <h3 className="font-semibold text-gray-800 text-lg">{vac.vaccine}</h3>
            <span className="text-sm text-gray-500">{vac.date}</span>
          </div>

          <div className="text-gray-700 text-sm">
            {vac.batch && (
              <p>
                <span className="font-medium">Batch No:</span> {vac.batch}
              </p>
            )}

            {vac.nextDose && (
              <p>
                <span className="font-medium">Next Dose:</span> {vac.nextDose}
              </p>
            )}

            {vac.notes && <p className="mt-1 text-gray-600">{vac.notes}</p>}
          </div>
        </div>
      ))}
    </div>
  );
}

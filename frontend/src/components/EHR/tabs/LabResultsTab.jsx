import React from "react";

export default function LabResultsTab({ labResults }) {
  if (!labResults || labResults.length === 0) {
    return <p className="text-gray-500 text-sm">No lab results available.</p>;
  }

  return (
    <div className="space-y-4">
      {labResults.map((result, index) => (
        <div
          key={index}
          className="border border-gray-200 rounded-xl p-4 bg-white"
        >
          <div className="flex justify-between items-start mb-2">
            <h3 className="font-semibold text-gray-800 text-lg">
              {result.testName}
            </h3>
            <span className="text-sm text-gray-500">{result.date}</span>
          </div>

          <div className="text-gray-700 text-sm">
            <p>
              <span className="font-medium">Result:</span> {result.value}
            </p>
            {result.normalRange && (
              <p>
                <span className="font-medium">Normal Range:</span> {result.normalRange}
              </p>
            )}
            {result.notes && (
              <p className="mt-1 text-gray-600">{result.notes}</p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

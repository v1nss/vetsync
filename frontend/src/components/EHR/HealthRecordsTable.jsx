import React from "react";
import { FiEye } from "react-icons/fi";

export default function HealthRecordsTable({ healthRecords, onRecordClick }) {
  if (!healthRecords || healthRecords.length === 0) {
    return (
      <div className="border border-gray-200 rounded-xl overflow-hidden">
        <div className="text-center py-12">
          <p className="text-gray-600">No health records available for this pet</p>
        </div>
      </div>
    );
  }

  const getDocumentBadges = (documents) => {
    const badges = [];
    if (documents.labResults && documents.labResults.length > 0) {
      badges.push({ type: 'labResults', count: documents.labResults.length, label: 'Lab', color: 'bg-blue-100 text-blue-700' });
    }
    if (documents.vaccineRecords && documents.vaccineRecords.length > 0) {
      badges.push({ type: 'vaccineRecords', count: documents.vaccineRecords.length, label: 'Vax', color: 'bg-green-100 text-green-700' });
    }
    if (documents.prescriptions && documents.prescriptions.length > 0) {
      badges.push({ type: 'prescriptions', count: documents.prescriptions.length, label: 'Rx', color: 'bg-purple-100 text-purple-700' });
    }
    if (documents.deworming && documents.deworming.length > 0) {
      badges.push({ type: 'deworming', count: documents.deworming.length, label: 'Deworm', color: 'bg-orange-100 text-orange-700' });
    }
    return badges;
  };

  return (
    <div className="border border-gray-200 rounded-xl overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Date
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Reason for Visit
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Veterinarian
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Clinic
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Action
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {healthRecords.map((record) => {
              const badges = getDocumentBadges(record.documents);
              return (
                <tr
                  key={record.id}
                  onClick={() => onRecordClick(record)}
                  className="hover:bg-gray-50 cursor-pointer transition"
                >
                  <td className="px-6 py-4 text-gray-900 font-medium">
                    {new Date(record.appointmentDate).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric'
                    })}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col gap-2">
                      <span className="text-gray-900">{record.reason}</span>
                      {badges.length > 0 && (
                        <div className="flex flex-wrap gap-1">
                          {badges.map((badge, idx) => (
                            <span
                              key={idx}
                              className={`px-2 py-0.5 rounded-full text-xs font-medium ${badge.color}`}
                              title={`${badge.type}: ${badge.count} ${badge.count === 1 ? 'record' : 'records'}`}
                            >
                              {badge.label} ({badge.count})
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-600">
                    {record.veterinarian}
                  </td>
                  <td className="px-6 py-4 text-gray-600">
                    {record.clinic_name}
                  </td>
                  <td className="px-6 py-4">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onRecordClick(record);
                      }}
                      className="p-2 text-gray-600 hover:text-primary hover:bg-primary/10 rounded-lg transition"
                      title="View Details"
                    >
                      <FiEye className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
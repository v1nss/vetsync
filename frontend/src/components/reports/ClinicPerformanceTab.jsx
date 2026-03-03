import { useState, useEffect } from "react";
import { fetchClinicPerformanceReport } from "../../global/api/systemAdmin";
import { FaTrophy, FaMedal, FaClinicMedical } from "react-icons/fa";

const RANK_STYLES = {
  1: { bg: "bg-yellow-50", border: "border-yellow-300", text: "text-yellow-600", icon: <FaTrophy className="text-yellow-500" /> },
  2: { bg: "bg-gray-50", border: "border-gray-300", text: "text-gray-500", icon: <FaMedal className="text-gray-400" /> },
  3: { bg: "bg-orange-50", border: "border-orange-300", text: "text-orange-500", icon: <FaMedal className="text-orange-400" /> },
};

export default function ClinicPerformanceTab() {
  const [clinics, setClinics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const load = async () => {
      try {
        const report = await fetchClinicPerformanceReport();
        setClinics(report.clinics || []);
      } catch (err) {
        console.error(err);
        setError("Failed to load clinic performance data.");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-20 text-gray-500">{error}</div>
    );
  }

  if (clinics.length === 0) {
    return (
      <div className="text-center py-20 text-gray-500">
        <FaClinicMedical className="mx-auto text-4xl mb-3 text-gray-300" />
        <p className="text-lg">No completed appointments found yet.</p>
      </div>
    );
  }

  const maxCount = clinics[0]?.total_completed_appointments || 1;

  return (
    <div className="space-y-6">
      {/* Top 3 Podium Cards */}
      {clinics.length >= 1 && (
        <div>
          <h2 className="text-lg font-semibold text-gray-800 mb-3">
            Top Performing Clinics
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {clinics.slice(0, 3).map((clinic) => {
              const style = RANK_STYLES[clinic.rank] || {};
              return (
                <div
                  key={clinic.clinic_id}
                  className={`rounded-2xl border-2 p-5 ${style.bg} ${style.border}`}
                >
                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-2xl">{style.icon}</span>
                    <span className={`text-sm font-bold ${style.text}`}>
                      #{clinic.rank}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 truncate">
                    {clinic.clinic_name}
                  </h3>
                  <p className="text-3xl font-extrabold text-primary mt-1">
                    {clinic.total_completed_appointments.toLocaleString()}
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    completed appointments
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Full Rankings Table */}
      <div>
        <h2 className="text-lg font-semibold text-gray-800 mb-3">
          Complete Ranking
        </h2>
        <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 text-gray-500 text-left">
                  <th className="px-4 py-3 font-medium w-16">Rank</th>
                  <th className="px-4 py-3 font-medium">Clinic Name</th>
                  <th className="px-4 py-3 font-medium">Completed Appointments</th>
                  <th className="px-4 py-3 font-medium">Progress</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {clinics.map((clinic) => {
                  const pct = (clinic.total_completed_appointments / maxCount) * 100;
                  const rankStyle = RANK_STYLES[clinic.rank];

                  return (
                    <tr key={clinic.clinic_id} className="hover:bg-gray-50">
                      <td className="px-4 py-3">
                        {rankStyle ? (
                          <span className={`inline-flex items-center gap-1.5 font-bold ${rankStyle.text}`}>
                            {rankStyle.icon}
                            {clinic.rank}
                          </span>
                        ) : (
                          <span className="text-gray-500 font-semibold pl-1">
                            {clinic.rank}
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3 font-medium text-gray-900">
                        {clinic.clinic_name}
                      </td>
                      <td className="px-4 py-3 font-semibold text-gray-900">
                        {clinic.total_completed_appointments.toLocaleString()}
                      </td>
                      <td className="px-4 py-3 w-48">
                        <div className="w-full bg-gray-100 rounded-full h-2.5">
                          <div
                            className="bg-primary h-2.5 rounded-full transition-all"
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

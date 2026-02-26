import { useState, useEffect } from "react";
import { fetchUserActivityReport } from "../../global/api/systemAdmin";
import {
  FaClinicMedical,
  FaUsers,
  FaSignInAlt,
  FaChartLine,
  FaServer,
  FaUserCheck,
} from "react-icons/fa";

function StatCard({ icon, label, value, color = "gray", sub }) {
  const colorMap = {
    green: "border-green-200 text-green-600",
    yellow: "border-yellow-200 text-yellow-600",
    red: "border-red-200 text-red-600",
    blue: "border-blue-200 text-blue-600",
    purple: "border-purple-200 text-purple-600",
    gray: "border-gray-200 text-gray-900",
    indigo: "border-indigo-200 text-indigo-600",
  };
  const c = colorMap[color] || colorMap.gray;

  return (
    <div className={`bg-white p-5 rounded-2xl border ${c.split(" ")[0]}`}>
      <div className="flex items-center gap-3 mb-2">
        <span className={`text-lg ${c.split(" ")[1]}`}>{icon}</span>
        <span className="text-sm text-gray-500">{label}</span>
      </div>
      <div className={`text-3xl font-bold ${c.split(" ")[1]}`}>{value}</div>
      {sub && <p className="text-xs text-gray-400 mt-1">{sub}</p>}
    </div>
  );
}

export default function UserActivityTab() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const report = await fetchUserActivityReport();
        setData(report);
      } catch (err) {
        console.error(err);
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

  if (!data) {
    return (
      <div className="text-center py-20 text-gray-500">
        Failed to load report data.
      </div>
    );
  }

  // const totalUsers = Object.values(data.users).reduce((s, v) => s + v, 0);
  // const totalClinics =
  //   data.clinics.approved + data.clinics.pending + data.clinics.rejected;

  return (
    <div className="space-y-6">

      {/* Login & Usage Stats */}
      <div>
        <h2 className="text-lg font-semibold text-gray-800 mb-3">
          Login &amp; Usage
        </h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            icon={<FaSignInAlt />}
            label="Logins (24h)"
            value={data.logins.last24h}
            color="green"
          />
          <StatCard
            icon={<FaSignInAlt />}
            label="Logins (7d)"
            value={data.logins.last7d}
            color="blue"
          />
          <StatCard
            icon={<FaSignInAlt />}
            label="Logins (30d)"
            value={data.logins.last30d}
            color="purple"
          />
          <StatCard
            icon={<FaUserCheck />}
            label="Active Users (30d)"
            value={data.activeUsers30d}
            color="indigo"
            sub="Unique users with API activity"
          />
        </div>
      </div>

      {/* System Usage */}
      <div>
        <h2 className="text-lg font-semibold text-gray-800 mb-3">
          System Usage
        </h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <StatCard
            icon={<FaServer />}
            label="Total API Requests (30d)"
            value={data.totalRequests30d.toLocaleString()}
            color="blue"
          />
        </div>
      </div>

      {/* Daily Logins Table */}
      {data.dailyLogins?.length > 0 && (
        <div>
          <h2 className="text-lg font-semibold text-gray-800 mb-3">
            Daily Login Trend (Last 30 Days)
          </h2>
          <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50 text-gray-500 text-left">
                    <th className="px-4 py-3 font-medium">Date</th>
                    <th className="px-4 py-3 font-medium">Successful Logins</th>
                    <th className="px-4 py-3 font-medium">Visual</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {data.dailyLogins.map((row) => {
                    const maxCount = Math.max(
                      ...data.dailyLogins.map((r) => parseInt(r.count, 10))
                    );
                    const pct =
                      maxCount > 0
                        ? (parseInt(row.count, 10) / maxCount) * 100
                        : 0;
                    return (
                      <tr key={row.date} className="hover:bg-gray-50">
                        <td className="px-4 py-3 text-gray-700">{row.date}</td>
                        <td className="px-4 py-3 font-semibold text-gray-900">
                          {row.count}
                        </td>
                        <td className="px-4 py-3">
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
      )}

      {/* Top Endpoints */}
      {data.topEndpoints?.length > 0 && (
        <div>
          <h2 className="text-lg font-semibold text-gray-800 mb-3">
            Top API Endpoints (Last 7 Days)
          </h2>
          <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50 text-gray-500 text-left">
                    <th className="px-4 py-3 font-medium">Method</th>
                    <th className="px-4 py-3 font-medium">Endpoint</th>
                    <th className="px-4 py-3 font-medium">Requests</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {data.topEndpoints.map((ep, i) => (
                    <tr key={i} className="hover:bg-gray-50">
                      <td className="px-4 py-3">
                        <MethodBadge method={ep.method} />
                      </td>
                      <td className="px-4 py-3 text-gray-700 font-mono text-xs">
                        {ep.url}
                      </td>
                      <td className="px-4 py-3 font-semibold text-gray-900">
                        {parseInt(ep.count, 10).toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function MethodBadge({ method }) {
  const colors = {
    GET: "bg-green-100 text-green-700",
    POST: "bg-blue-100 text-blue-700",
    PUT: "bg-yellow-100 text-yellow-700",
    PATCH: "bg-orange-100 text-orange-700",
    DELETE: "bg-red-100 text-red-700",
  };
  return (
    <span
      className={`px-2 py-0.5 rounded text-xs font-bold ${
        colors[method] || "bg-gray-100 text-gray-700"
      }`}
    >
      {method}
    </span>
  );
}

import { useState, useEffect, useCallback } from "react";
import { fetchAuditTrail } from "../../global/api/systemAdmin";
import Pagination from "../Pagination";
import { FaSearch, FaFilter, FaTimes } from "react-icons/fa";
import { FiDownload } from "react-icons/fi";
import { downloadAuditTrail } from "../../global/api/systemAdmin";
import NotificationModal from "../NotificationModal";

const METHOD_OPTIONS = ["ALL", "GET", "POST", "PUT", "PATCH", "DELETE"];

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

function StatusBadge({ code }) {
  let cls = "bg-gray-100 text-gray-700";
  if (code >= 200 && code < 300) cls = "bg-green-100 text-green-700";
  else if (code >= 400 && code < 500) cls = "bg-yellow-100 text-yellow-700";
  else if (code >= 500) cls = "bg-red-100 text-red-700";

  return (
    <span className={`px-2 py-0.5 rounded text-xs font-bold ${cls}`}>
      {code}
    </span>
  );
}

export default function AuditTrailTab() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [notification, setNotification] = useState({ isOpen: false, type: "success", title: "", message: "" });

  const [urlSearch, setUrlSearch] = useState("");
  const [methodFilter, setMethodFilter] = useState("ALL");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [showFilters, setShowFilters] = useState(false);

  const loadLogs = useCallback(async () => {
    setLoading(true);
    try {
      const params = { page, limit: 20 };
      if (methodFilter !== "ALL") params.method = methodFilter;
      if (urlSearch.trim()) params.url = urlSearch.trim();
      if (startDate) params.startDate = startDate;
      if (endDate) params.endDate = endDate;

      const result = await fetchAuditTrail(params);
      setLogs(result.logs);
      setTotalPages(result.totalPages);
      setTotal(result.total);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [page, methodFilter, urlSearch, startDate, endDate]);

  useEffect(() => {
    loadLogs();
  }, [loadLogs]);

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1);
    loadLogs();
  };

  const clearFilters = () => {
    setUrlSearch("");
    setMethodFilter("ALL");
    setStartDate("");
    setEndDate("");
    setPage(1);
  };

  function getAuditRangeDays(startDate, endDate) {
    const start = new Date(startDate);
    const end = new Date(endDate);

    const utcStart = Date.UTC(start.getFullYear(), start.getMonth(), start.getDate());
    const utcEnd = Date.UTC(end.getFullYear(), end.getMonth(), end.getDate());

    const msPerDay = 1000 * 60 * 60 * 24;

    return Math.floor((utcEnd - utcStart) / msPerDay) + 1; // inclusive
  }

  const handleDownloadAuditTrail = async () => {
    const params = {};
      if (methodFilter !== "ALL") params.method = methodFilter;
      if (urlSearch.trim()) params.url = urlSearch.trim();
      if (startDate) params.startDate = startDate;
      if (endDate) params.endDate = endDate;

      if (getAuditRangeDays(startDate, endDate) > 7 || getAuditRangeDays(startDate, endDate) < 0 || !startDate || !endDate) {
          setNotification({
            isOpen: true,
            type: 'info',
            title: 'Info',
            message: 'The selected date range exceeds 7 days or invalid.'
          });
          return;
      }

    await downloadAuditTrail(params);
  };

  const handleNotificationClose = () => {
    setNotification({ ...notification, isOpen: false });
    if (notification.type === 'success') {
      onClose();
    }
  };

  const hasActiveFilters =
    urlSearch || methodFilter !== "ALL" || startDate || endDate;

  return (
    <div className="space-y-4">
      {/* Search & Filters */}
      <div className="bg-white rounded-2xl border border-gray-200 p-4">
        <form onSubmit={handleSearch} className="flex items-center gap-3">
          <div className="flex items-center bg-gray-50 rounded-xl overflow-hidden flex-1 border border-gray-200">
            <input
              type="text"
              value={urlSearch}
              onChange={(e) => setUrlSearch(e.target.value)}
              placeholder="Search by endpoint URL..."
              className="px-4 py-2.5 w-full focus:outline-none bg-transparent text-sm"
            />
            <button type="submit" className="px-4 py-2.5">
              <FaSearch className="text-gray-400" />
            </button>
          </div>
            <button
              onClick={() => handleDownloadAuditTrail()}
              className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition font-medium"
            >
              <FiDownload className="w-4 h-4" />
              <span className="hidden sm:inline">Audit Logs</span>
            </button>
          <button
            type="button"
            onClick={() => setShowFilters(!showFilters)}
            className={`p-2.5 rounded-xl border transition ${
              showFilters || hasActiveFilters
                ? "bg-primary text-white border-primary"
                : "border-gray-200 text-gray-600 hover:bg-gray-50"
            }`}
          >
            <FaFilter />
          </button>
          {hasActiveFilters && (
            <button
              type="button"
              onClick={clearFilters}
              className="p-2.5 rounded-xl border border-red-200 text-red-500 hover:bg-red-50 transition"
            >
              <FaTimes />
            </button>
          )}
        </form>

        {showFilters && (
          <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">
                HTTP Method
              </label>
              <select
                value={methodFilter}
                onChange={(e) => {
                  setMethodFilter(e.target.value);
                  setPage(1);
                }}
                className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-primary"
              >
                {METHOD_OPTIONS.map((m) => (
                  <option key={m} value={m}>
                    {m === "ALL" ? "All Methods" : m}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">
                Start Date
              </label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => {
                  setStartDate(e.target.value);
                  setPage(1);
                }}
                className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-primary"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">
                End Date
              </label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => {
                  setEndDate(e.target.value);
                  setPage(1);
                }}
                className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-primary"
              />
            </div>
          </div>
        )}
      </div>

      {/* Summary */}
      <div className="flex items-center justify-between text-sm text-gray-500">
        <span>
          {total.toLocaleString()} total log{total !== 1 ? "s" : ""}
        </span>
        <span>
          Page {page} of {totalPages}
        </span>
      </div>

      {/* Logs Table */}
      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary" />
          </div>
        ) : logs.length === 0 ? (
          <div className="text-center py-16 text-gray-400">
            No audit logs found.
          </div>
        ) : (
          <>
            {/* Desktop Table */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50 text-gray-500 text-left">
                    <th className="px-4 py-3 font-medium">Timestamp</th>
                    <th className="px-4 py-3 font-medium">Method</th>
                    <th className="px-4 py-3 font-medium">Endpoint</th>
                    <th className="px-4 py-3 font-medium">Status</th>
                    <th className="px-4 py-3 font-medium">User</th>
                    <th className="px-4 py-3 font-medium">Role</th>
                    <th className="px-4 py-3 font-medium">IP</th>
                    <th className="px-4 py-3 font-medium">Time (ms)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {logs.map((log) => (
                    <tr key={log.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-gray-600 whitespace-nowrap text-xs">
                        {new Date(log.createdAt).toLocaleString()}
                      </td>
                      <td className="px-4 py-3">
                        <MethodBadge method={log.method} />
                      </td>
                      <td className="px-4 py-3 text-gray-700 font-mono text-xs max-w-xs truncate">
                        {log.url}
                      </td>
                      <td className="px-4 py-3">
                        <StatusBadge code={log.status_code} />
                      </td>
                      <td className="px-4 py-3 text-gray-600 text-xs">
                        {log.user_email || "—"}
                      </td>
                      <td className="px-4 py-3 text-gray-500 text-xs">
                        {log.user_type
                          ? log.user_type.replace("_", " ")
                          : "—"}
                      </td>
                      <td className="px-4 py-3 text-gray-500 font-mono text-xs">
                        {log.ip_address || "—"}
                      </td>
                      <td className="px-4 py-3 text-gray-500 text-xs">
                        {log.response_time_ms != null
                          ? `${log.response_time_ms}ms`
                          : "—"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Cards */}
            <div className="md:hidden divide-y divide-gray-100">
              {logs.map((log) => (
                <div key={log.id} className="p-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <MethodBadge method={log.method} />
                      <StatusBadge code={log.status_code} />
                    </div>
                    <span className="text-xs text-gray-400">
                      {log.response_time_ms != null
                        ? `${log.response_time_ms}ms`
                        : ""}
                    </span>
                  </div>
                  <p className="font-mono text-xs text-gray-700 break-all">
                    {log.url}
                  </p>
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span>{log.user_email || "Anonymous"}</span>
                  </div>
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span>
                      {new Date(log.createdAt).toLocaleString()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Pagination */}
      <div className="flex justify-center md:justify-end max-w-full">
        <Pagination
          currentPage={page}
          totalPages={totalPages}
          onPageChange={(p) => setPage(p)}
        />
      </div>

      <NotificationModal
        isOpen={notification.isOpen}
        onClose={handleNotificationClose}
        type={notification.type}
        title={notification.title}
        message={notification.message}
      />
    </div>

    
  );
}

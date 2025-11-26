import { useState, useEffect } from "react";
import { FaTimes, FaCheckCircle, FaTimesCircle, FaClock, FaFileAlt } from "react-icons/fa";
import { fetchApprovalLogsByClinicId } from "../../global/api/systemAdmin";

export default function ClinicApprovalLogsModal({ clinic, onClose }) {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (clinic?.clinic_id) {
      const fetchLogs = async () => {
        try {
          setLoading(true);
          const approvalLogs = await fetchApprovalLogsByClinicId(clinic.clinic_id);
          setLogs(approvalLogs || []);
        } catch (err) {
          console.error("Failed to fetch approval logs:", err);
          setError("Failed to load approval logs");
        } finally {
          setLoading(false);
        }
      };
      fetchLogs();
    }
  }, [clinic?.clinic_id]);

  if (!clinic) return null;

  const formatDate = (date) => {
    if (!date) return 'N/A';
    try {
      return new Date(date).toLocaleString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (e) {
      return 'N/A';
    }
  };

  const getStatusIcon = (action) => {
    switch (action) {
      case 'approved':
        return <FaCheckCircle className="text-green-600 text-2xl" />;
      case 'rejected':
        return <FaTimesCircle className="text-red-600 text-2xl" />;
      default:
        return <FaFileAlt className="text-gray-600 text-2xl" />;
    }
  };

  const getActionColor = (action) => {
    switch (action) {
      case 'approved':
        return 'green';
      case 'rejected':
        return 'red';
      default:
        return 'gray';
    }
  };

  // Build timeline from logs and clinic data
  const buildTimeline = () => {
    const timeline = [];
    
    // Add initial submission (if clinic has created_at)
    if (clinic.created_at) {
      timeline.push({
        id: 'submitted',
        status: 'submitted',
        label: 'Application Submitted',
        date: clinic.created_at,
        icon: <FaFileAlt className="text-blue-600 text-xl" />,
        color: 'blue',
        remarks: null,
        adminName: null,
      });
    }

    // Add pending status if clinic is still pending
    if (clinic.status === 'pending' && logs.length === 0) {
      timeline.push({
        id: 'pending',
        status: 'pending',
        label: 'Pending Review',
        date: clinic.created_at || new Date(),
        icon: <FaClock className="text-yellow-600 text-xl" />,
        color: 'yellow',
        remarks: null,
        adminName: null,
      });
    }

    // Add approval logs
    logs.forEach((log) => {
      timeline.push({
        id: log.id,
        status: log.action,
        label: log.action === 'approved' ? 'Application Approved' : 'Application Rejected',
        date: log.timestamp,
        icon: log.action === 'approved' 
          ? <FaCheckCircle className="text-green-600 text-xl" />
          : <FaTimesCircle className="text-red-600 text-xl" />,
        color: getActionColor(log.action),
        remarks: log.remarks,
        adminName: log.User?.full_name || 'System Admin',
        adminEmail: log.User?.email || null,
      });
    });

    return timeline;
  };

  const timeline = buildTimeline();

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white p-6 border-b border-gray-200 flex items-center justify-between z-10">
          <div className="flex items-center gap-3">
            {getStatusIcon(clinic.status)}
            <div>
              <h2 className="text-xl font-bold text-gray-900">Approval Logs</h2>
              <p className="text-sm text-gray-600">{clinic.name}</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 p-2 hover:bg-gray-100 rounded-full transition"
          >
            <FaTimes />
          </button>
        </div>

        {/* Current Status */}
        <div className="p-6 bg-gray-50 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Current Status</p>
              <span className={`inline-block px-3 py-1 rounded-xl text-sm font-semibold ${
                clinic.status === 'approved' ? 'bg-green-100 text-green-700' :
                clinic.status === 'rejected' ? 'bg-red-100 text-red-700' :
                'bg-yellow-100 text-yellow-700'
              }`}>
                {clinic.status.toUpperCase()}
              </span>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-600 mb-1">Last Updated</p>
              <p className="text-sm font-medium text-gray-900">
                {formatDate(clinic.updated_at || clinic.created_at)}
              </p>
            </div>
          </div>
        </div>

        {/* Timeline */}
        <div className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Application Timeline</h3>
          
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              <p className="ml-3 text-gray-600">Loading approval logs...</p>
            </div>
          ) : error ? (
            <div className="bg-red-50 border border-red-200 rounded-xl p-4">
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          ) : timeline.length === 0 ? (
            <div className="bg-gray-50 border border-gray-200 rounded-xl p-6 text-center">
              <FaFileAlt className="text-gray-400 text-4xl mx-auto mb-3" />
              <p className="text-gray-600">No approval logs found</p>
            </div>
          ) : (
            <div className="relative">
              {/* Timeline Line */}
              <div className="absolute left-[15px] top-0 bottom-0 w-0.5 bg-gray-200"></div>

              {/* Timeline Items */}
              <div className="space-y-6">
                {timeline.map((item, index) => (
                  <div key={item.id || index} className="relative flex gap-4">
                    {/* Icon */}
                    <div className={`relative shrink-0 w-8 h-8 rounded-full bg-white border-2 flex items-center justify-center ${
                      item.color === 'blue' ? 'border-blue-600' :
                      item.color === 'yellow' ? 'border-yellow-600' :
                      item.color === 'red' ? 'border-red-600' :
                      'border-green-600'
                    }`}>
                      {item.icon}
                    </div>

                    {/* Content */}
                    <div className="flex-1 pb-6">
                      <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                        <div className="flex items-start justify-between mb-2">
                          <h4 className="font-semibold text-gray-900">{item.label}</h4>
                          <span className={`px-2 py-1 rounded-lg text-xs font-medium ${
                            item.color === 'blue' ? 'bg-blue-100 text-blue-700' :
                            item.color === 'yellow' ? 'bg-yellow-100 text-yellow-700' :
                            item.color === 'red' ? 'bg-red-100 text-red-700' :
                            'bg-green-100 text-green-700'
                          }`}>
                            {item.status.toUpperCase()}
                          </span>
                        </div>
                        
                        <p className="text-sm text-gray-600 mb-2">
                          <span className="font-medium">Date:</span> {formatDate(item.date)}
                        </p>

                        {/* Admin Info for approval/rejection actions */}
                        {item.adminName && (
                          <p className="text-sm text-gray-600 mb-2">
                            <span className="font-medium">Action by:</span> {item.adminName}
                            {item.adminEmail && <span className="text-gray-500"> ({item.adminEmail})</span>}
                          </p>
                        )}

                        {/* Remarks */}
                        {item.remarks && (
                          <div className={`mt-3 p-3 border rounded-lg ${
                            item.status === 'rejected' 
                              ? 'bg-red-50 border-red-200' 
                              : 'bg-green-50 border-green-200'
                          }`}>
                            <p className={`text-xs font-semibold mb-1 ${
                              item.status === 'rejected' ? 'text-red-800' : 'text-green-800'
                            }`}>
                              {item.status === 'rejected' ? 'Rejection Remarks:' : 'Approval Notes:'}
                            </p>
                            <p className={`text-sm ${
                              item.status === 'rejected' ? 'text-red-700' : 'text-green-700'
                            }`}>
                              {item.remarks}
                            </p>
                          </div>
                        )}

                        {/* Additional Info for submission */}
                        {item.status === 'submitted' && (
                          <div className="mt-3 text-xs text-gray-500">
                            <p>Owner: {clinic.owner?.name}</p>
                            <p>Email: {clinic.owner?.email}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-200 bg-gray-50">
          <div className="flex items-center justify-between text-sm">
            <div className="text-gray-600">
              <span className="font-medium">Application ID:</span> {clinic.clinic_id}
            </div>
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-xl hover:bg-gray-300 transition"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
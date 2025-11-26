import { useState, useEffect } from 'react';
import { FaSearch, FaEye, FaHistory } from "react-icons/fa";
import { useAuth } from '../../context/AuthContext';
import { fetchAllClinics } from '../../global/api/systemAdmin';
import ReviewModal from '../../components/clinic/ReviewModal';
import Pagination from '../../components/Pagination';

export default function LogsPage() {
  const { token } = useAuth();
  const [clinics, setClinics] = useState([]);
  const [filteredClinics, setFilteredClinics] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');
  const [selectedClinic, setSelectedClinic] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const clinicsPerPage = 10;

  const totalPages = Math.ceil(filteredClinics.length / clinicsPerPage);
  const indexOfLastClinic = currentPage * clinicsPerPage;
  const indexOfFirstClinic = indexOfLastClinic - clinicsPerPage;
  const currentClinics = filteredClinics.slice(indexOfFirstClinic, indexOfLastClinic);

  useEffect(() => {
    getClinics();
  }, [token]);

  const getClinics = async () => {
    try {
      const data = await fetchAllClinics(token);
      // Only show rejected and pending clinics in logs
      const logsData = data.filter(c => c.status === 'rejected' || c.status === 'pending');
      setClinics(Array.isArray(logsData) ? logsData : []);
      setFilteredClinics(Array.isArray(logsData) ? logsData : []);
    } catch (err) {
      console.error("Failed to fetch clinics:", err.message);
      setClinics([]);
      setFilteredClinics([]);
    }
  };

  useEffect(() => {
    let result = clinics;

    if (activeFilter !== 'all') {
      result = result.filter(c => c.status === activeFilter);
    }

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(c =>
        c.name.toLowerCase().includes(q) ||
        c.address.toLowerCase().includes(q) ||
        c.owner.name.toLowerCase().includes(q)
      );
    }

    setFilteredClinics(result);
  }, [searchQuery, activeFilter, clinics]);

  const getStatusBadge = (status) => {
    const styles = {
      pending: 'bg-yellow-100 text-yellow-700 border-yellow-300',
      rejected: 'bg-red-100 text-red-700 border-red-300'
    };
    return (
      <span className={`px-3 py-1 rounded-xl text-xs font-semibold border ${styles[status]}`}>
        {status.toUpperCase()}
      </span>
    );
  };

  const stats = {
    total: clinics.length,
    pending: clinics.filter(c => c.status === 'pending').length,
    rejected: clinics.filter(c => c.status === 'rejected').length
  };

  return (
    <div className="min-h-screen pb-10 overflow-x-hidden">
      {/* Header */}
      <div className="mb-6">
        <div className="bg-linear-to-r from-primary to-[#FFB49A] px-4 py-8 sm:px-6 sm:py-10 rounded-2xl">
          <div className="max-w-7xl mx-auto">
            <div className="text-white px-2 md:px-6">
              <div className="flex items-center gap-3 mb-4">
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold leading-tight">
                  Clinic Application Logs
                </h1>
              </div>
              <p className="text-white/90 mb-6 max-w-xl">
                View history of pending and rejected clinic applications.
              </p>

              {/* Search Bar */}
              <div className="flex items-center gap-3">
                <div className="flex items-center bg-white rounded-xl overflow-hidden flex-1 max-w-2xl">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search by clinic name, address, or owner..."
                    className="text-black px-4 py-3 w-full focus:outline-none"
                  />
                  <div className="group px-4 py-3">
                    <FaSearch className="text-gray-400 group-hover:text-gray-500" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="bg-white p-6 rounded-2xl border border-gray-200">
          <div className="text-sm text-gray-600 mb-1">Total Applications</div>
          <div className="text-3xl font-bold text-gray-900">{stats.total}</div>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-yellow-200">
          <div className="text-sm text-gray-600 mb-1">Pending Review</div>
          <div className="text-3xl font-bold text-yellow-600">{stats.pending}</div>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-red-200">
          <div className="text-sm text-gray-600 mb-1">Rejected</div>
          <div className="text-3xl font-bold text-red-600">{stats.rejected}</div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="mt-8 mb-6">
        <div className="flex gap-3 overflow-x-auto pb-2">
          {['all', 'pending', 'rejected'].map((tab) => {
            const isActive = activeFilter === tab;
            return (
              <button
                key={tab}
                onClick={() => setActiveFilter(tab)}
                className={`shrink-0 px-4 py-2 rounded-xl text-sm font-medium transition ${
                  isActive
                    ? 'bg-primary text-white'
                    : 'border border-gray-200 bg-white/80 text-black hover:bg-gray-100'
                }`}
              >
                {tab === 'all' ? 'All Applications' : tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            );
          })}
        </div>
      </div>

      {/* Clinics Table */}
      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden mb-6">
        {currentClinics.length === 0 ? (
          <div className="text-center py-12">
            <FaHistory className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No applications found</h3>
            <p className="text-gray-600">
              {searchQuery ? "Try a different search term" : "No pending or rejected applications at this time"}
            </p>
          </div>
        ) : (
          <>
            {/* Desktop Table */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Clinic</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Owner</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Contact</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Submitted</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {currentClinics.map((clinic) => (
                    <tr key={clinic.clinic_id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div className="font-medium text-gray-900">{clinic.name}</div>
                        <div className="text-sm text-gray-500">{clinic.address}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-gray-900">{clinic.owner.name}</div>
                        <div className="text-sm text-gray-500">{clinic.owner.email}</div>
                      </td>
                      <td className="px-6 py-4 text-gray-600">{clinic.contact_number}</td>
                      <td className="px-6 py-4 text-gray-600">
                        {new Date(clinic.created_at).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4">{getStatusBadge(clinic.status)}</td>
                      <td className="px-6 py-4 text-right">
                        <button
                          onClick={() => setSelectedClinic(clinic)}
                          className="text-primary hover:text-primary/80 font-medium flex items-center gap-2 ml-auto"
                        >
                          <FaEye /> View Details
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Cards */}
            <div className="md:hidden divide-y divide-gray-200">
              {currentClinics.map((clinic) => (
                <div key={clinic.clinic_id} className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="font-semibold text-gray-900">{clinic.name}</h3>
                      <p className="text-sm text-gray-600">{clinic.address}</p>
                    </div>
                    {getStatusBadge(clinic.status)}
                  </div>
                  <div className="space-y-2 text-sm mb-3">
                    <div>
                      <span className="text-gray-500">Owner:</span>{" "}
                      <span className="text-gray-900">{clinic.owner.name}</span>
                    </div>
                    <div>
                      <span className="text-gray-500">Contact:</span>{" "}
                      <span className="text-gray-900">{clinic.contact_number}</span>
                    </div>
                    <div>
                      <span className="text-gray-500">Submitted:</span>{" "}
                      <span className="text-gray-900">{new Date(clinic.created_at).toLocaleDateString()}</span>
                    </div>
                  </div>
                  <button
                    onClick={() => setSelectedClinic(clinic)}
                    className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-primary text-white rounded-lg"
                  >
                    <FaEye /> View Details
                  </button>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Pagination */}
      <div className="flex justify-end items-center gap-2">
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={(page) => setCurrentPage(page)}
        />
      </div>

      {/* Review Modal */}
      <ReviewModal
        clinic={selectedClinic}
        onClose={() => setSelectedClinic(null)}
        onStatusUpdate={async () => {
          await getClinics();
          setSelectedClinic(null);
        }}
        loading={false}
        getStatusBadge={getStatusBadge}
      />
    </div>
  );
}
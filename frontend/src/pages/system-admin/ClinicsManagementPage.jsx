import React, { useState, useEffect } from 'react';
import { FaSearch } from "react-icons/fa";
import Pagination from '../../components/Pagination';
import ClinicTable from '../../components/clinic/ClinicTable';
import ClinicMobileCards from '../../components/clinic/ClinicMobileCards';
import ReviewModal from '../../components/clinic/ReviewModal';
import { useAuth } from '../../context/AuthContext';
import { fetchAllClinics, updateClinicStatus } from '../../global/api/systemAdmin';

export default function ClinicManagementPage() {
  const {token} = useAuth();
  const [clinics, setClinics] = useState([]);
  const [filteredClinics, setFilteredClinics] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');
  const [selectedClinic, setSelectedClinic] = useState(null);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const clinicsPerPage = 10;
  const totalPages = Math.ceil(filteredClinics.length / clinicsPerPage);
  const indexOfLastClinic = currentPage * clinicsPerPage;
  const indexOfFirstClinic = indexOfLastClinic - clinicsPerPage;
  const currentClinics = filteredClinics.slice(indexOfFirstClinic, indexOfLastClinic);

useEffect(() => {
  const getClinics = async () => {
    try {
      const data = await fetchAllClinics();
      setClinics(Array.isArray(data) ? data : []); // <-- ensures array
      setFilteredClinics(Array.isArray(data) ? data : []);
      // console.log(data)
      // console.log(filteredClinics)
    } catch (err) {
      console.error("Failed to fetch clinics:", err);
      setClinics([]);
      setFilteredClinics([]);
    }
  };
  getClinics();
}, []);

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

  const handleStatusUpdate = async (clinicId, newStatus) => {
    setLoading(true);
    try {
      await updateClinicStatus(clinicId, newStatus);
      
      // Update the local state after successful API call
      setClinics(prev =>
        prev.map(c =>
          c.clinic_id === clinicId ? { ...c, status: newStatus } : c
        )
      );
      
      setSelectedClinic(null);
    } catch (err) {
      console.error("Failed to update clinic status:", err.message);
      alert(`Failed to update clinic status: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    const styles = {
      pending: 'bg-yellow-100 text-yellow-700 border-yellow-300',
      approved: 'bg-green-100 text-green-700 border-green-300',
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
    approved: clinics.filter(c => c.status === 'approved').length,
    rejected: clinics.filter(c => c.status === 'rejected').length
  };

  return (
    <div>
      <div className="min-h-screen pb-10 overflow-x-hidden">
        {/* Header */}
        <div className="mb-6">
          <div className="bg-linear-to-r from-primary to-[#FFB49A] px-4 py-8 sm:px-6 sm:py-10 rounded-2xl">
            <div>
              <div className="text-white px-2 md:px-6">
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold leading-tight mb-4">
                  Clinic Management
                </h1>
                <p className="text-white/90 mb-6">
                  Review and manage clinic registrations. Approve or reject pending applications.
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
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="bg-white p-6 rounded-2xl border border-gray-200">
            <div className="text-sm text-gray-600 mb-1">Total Clinics</div>
            <div className="text-3xl font-bold text-gray-900">{stats.total}</div>
          </div>
          <div className="bg-white p-6 rounded-2xl border border-yellow-200">
            <div className="text-sm text-gray-600 mb-1">Pending</div>
            <div className="text-3xl font-bold text-yellow-600">{stats.pending}</div>
          </div>
          <div className="bg-white p-6 rounded-2xl border border-green-200">
            <div className="text-sm text-gray-600 mb-1">Approved</div>
            <div className="text-3xl font-bold text-green-600">{stats.approved}</div>
          </div>
          <div className="bg-white p-6 rounded-2xl border border-red-200">
            <div className="text-sm text-gray-600 mb-1">Rejected</div>
            <div className="text-3xl font-bold text-red-600">{stats.rejected}</div>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="mt-8 mb-6">
          <div className="flex gap-3 overflow-x-auto pb-2">
            {['all', 'pending', 'approved', 'rejected'].map((tab) => {
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
                  {tab === 'all' ? 'All Status' : tab.charAt(0).toUpperCase() + tab.slice(1)}
                </button>
              );
            })}
          </div>
        </div>

        {/* Clinics Table/Cards */}
        <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden mb-14">
          <ClinicTable
            clinics={currentClinics}
            onReview={setSelectedClinic}
            getStatusBadge={getStatusBadge}
          />
          <ClinicMobileCards
            clinics={currentClinics}
            onReview={setSelectedClinic}
            getStatusBadge={getStatusBadge}
          />
        </div>

        {/* Pagination */}
        <div className="flex justify-end items-center gap-2 sm:mb-0">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={(page) => setCurrentPage(page)}
          />
        </div>
      </div>

      {/* Review Modal */}
      <ReviewModal
        clinic={selectedClinic}
        onClose={() => setSelectedClinic(null)}
        onStatusUpdate={handleStatusUpdate}
        loading={loading}
        getStatusBadge={getStatusBadge}
      />
    </div>
  );
}
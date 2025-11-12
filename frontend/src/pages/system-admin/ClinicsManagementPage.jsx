import React, { useState, useEffect } from 'react';
import { FaSearch } from "react-icons/fa";
import Navbar from '../../components/Navbar';
import Pagination from '../../components/Pagination';
import ClinicTable from '../../components/clinic/ClinicTable';
import ClinicMobileCards from '../../components/clinic/ClinicMobileCards';
import ReviewModal from '../../components/clinic/ReviewModal';

export default function ClinicManagementPage() {
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
    const mockClinics = [
      {
        clinic_id: 1,
        name: "City Medical Center",
        address: "123 Main St, Metro Manila",
        contact_number: "+63 2 1234 5678",
        email: "contact@citymedical.ph",
        status: "pending",
        images: [],
        owner: {
          id: 101,
          name: "Dr. Maria Santos",
          email: "maria.santos@email.com"
        }
      },
      {
        clinic_id: 2,
        name: "HealthFirst Clinic",
        address: "456 Oak Ave, Quezon City",
        contact_number: "+63 2 8765 4321",
        email: "info@healthfirst.ph",
        status: "approved",
        images: [],
        owner: {
          id: 102,
          name: "Dr. Juan Dela Cruz",
          email: "juan.delacruz@email.com"
        }
      },
      {
        clinic_id: 3,
        name: "Wellness Hub",
        address: "789 Pine Rd, Makati City",
        contact_number: "+63 2 5555 6666",
        email: "hello@wellnesshub.ph",
        status: "rejected",
        images: [],
        owner: {
          id: 103,
          name: "Dr. Ana Reyes",
          email: "ana.reyes@email.com"
        }
      },
      {
        clinic_id: 4,
        name: "Care Plus Medical",
        address: "321 Maple Dr, Pasig City",
        contact_number: "+63 2 9999 8888",
        email: "support@careplus.ph",
        status: "pending",
        images: [],
        owner: {
          id: 104,
          name: "Dr. Roberto Garcia",
          email: "roberto.garcia@email.com"
        }
      }
    ];
    setClinics(mockClinics);
    setFilteredClinics(mockClinics);
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

  const handleStatusUpdate = (clinicId, newStatus) => {
    setLoading(true);
    setTimeout(() => {
      setClinics(prev =>
        prev.map(c =>
          c.clinic_id === clinicId ? { ...c, status: newStatus } : c
        )
      );
      setLoading(false);
      setSelectedClinic(null);
    }, 500);
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
      <Navbar />
      <section className="min-h-screen pb-10">
        {/* Header */}
        <div className="my-6">
          <div className="bg-linear-to-r from-primary to-[#FFB49A] px-4 py-8 sm:px-6 sm:py-10 rounded-2xl">
            <div className="max-w-7xl mx-auto">
              <div className="text-white px-2 md:px-6">
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold leading-tight mb-4">
                  Clinic Management
                </h1>
                <p className="text-white/90 mb-6 max-w-xl">
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
      </section>

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
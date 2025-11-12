import React, { useState, useEffect } from "react";
import {
  FaSearch,
  FaUser,
  FaEnvelope,
  FaPhone,
  FaCalendar,
} from "react-icons/fa";
import UserDetailsModal from "../../components/users/UserDetailsModal";
import UserMobileCards from "../../components/users/UserMobileCards";
import UserTable from "../../components/users/UserTable";
import Navbar from "../../components/Navbar";

// Main User Management Page
export default function UserManagementPage() {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");
  const [selectedUser, setSelectedUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 10;
  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);


  useEffect(() => {
    const mockUsers = [
      { user_id: 1, name: "Dr. Maria Santos", email: "maria.santos@email.com", phone: "+63 917 123 4567", role: "vet_pro", status: "active", joined_date: "2024-01-15", address: "123 Main St, Quezon City" },
      { user_id: 2, name: "Juan Dela Cruz", email: "juan.delacruz@email.com", phone: "+63 917 234 5678", role: "pet_owner", status: "active", joined_date: "2024-02-20", address: "456 Oak Ave, Manila" },
      { user_id: 3, name: "Med Connect Admin", email: "clinic_admin@medconnect.ph", phone: "+63 917 345 6789", role: "clinic_admin", status: "active", joined_date: "2023-12-01", address: "789 Pine Rd, Makati" },
      { user_id: 4, name: "Dr. Ana Reyes", email: "ana.reyes@email.com", phone: "+63 917 456 7890", role: "vet_pro", status: "active", joined_date: "2024-03-10", address: "321 Maple Dr, Pasig" },
      { user_id: 5, name: "Pedro Martinez", email: "pedro.martinez@email.com", phone: "+63 917 567 8901", role: "pet_owner", status: "inactive", joined_date: "2024-01-05", address: "654 Birch Ln, Taguig" },
      { user_id: 6, name: "Dr. Roberto Garcia", email: "roberto.garcia@email.com", phone: "+63 917 678 9012", role: "vet_pro", status: "active", joined_date: "2024-04-01", address: "987 Cedar St, Mandaluyong" }
    ];
    setUsers(mockUsers);
    setFilteredUsers(mockUsers);
  }, []);

  useEffect(() => {
    let result = users;

    if (activeFilter !== "all") {
      result = result.filter((u) => u.role === activeFilter);
    }

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (u) =>
          u.name.toLowerCase().includes(q) ||
          u.email.toLowerCase().includes(q) ||
          u.phone.includes(q)
      );
    }

    setFilteredUsers(result);
    setCurrentPage(1);
  }, [searchQuery, activeFilter, users]);

  const stats = {
    total: users.length,
    clinic_admin: users.filter((u) => u.role === "clinic_admin").length,
    vet_pro: users.filter((u) => u.role === "vet_pro").length,
    pet_owner: users.filter((u) => u.role === "pet_owner").length,
  };

  const goToPage = (pageNumber) => setCurrentPage(pageNumber);
  const nextPage = () =>
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  const prevPage = () => setCurrentPage((prev) => Math.max(prev - 1, 1));

  return (
    <div>
      <Navbar />
      <section className="min-h-screen pb-10">
        {/* Header */}
        <div className="my-6">
          <div className="bg-linear-to-r from-primary to-[#FFB49A] px-4 py-8 sm:px-6 sm:py-10 rounded-2xl">
            <div className="text-white px-2 md:px-6">
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold leading-tight mb-4">
                User Management
              </h1>
              <p className="text-white/90 mb-6 max-w-xl">
                View and manage all registered users in the system.
              </p>

              {/* Search Bar */}
              <div className="flex items-center gap-3">
                <div className="flex items-center bg-white rounded-xl overflow-hidden flex-1 max-w-2xl">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search by name, email, or phone..."
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

        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="bg-white p-6 rounded-2xl border border-gray-200">
            <div className="text-sm text-gray-600 mb-1">Total Users</div>
            <div className="text-3xl font-bold text-gray-900">
              {stats.total}
            </div>
          </div>
          <div className="bg-white p-6 rounded-2xl border border-purple-200">
            <div className="text-sm text-gray-600 mb-1">Clinic Admins</div>
            <div className="text-3xl font-bold text-purple-600">
              {stats.clinic_admin}
            </div>
          </div>
          <div className="bg-white p-6 rounded-2xl border border-blue-200">
            <div className="text-sm text-gray-600 mb-1">Vet Professionals</div>
            <div className="text-3xl font-bold text-blue-600">
              {stats.vet_pro}
            </div>
          </div>
          <div className="bg-white p-6 rounded-2xl border border-gray-200">
            <div className="text-sm text-gray-600 mb-1">Pet Owners</div>
            <div className="text-3xl font-bold text-gray-600">
              {stats.pet_owner}
            </div>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="mt-8 mb-6">
          <div className="flex gap-3 overflow-x-auto pb-2">
            {["all", "clinic_admin", "vet_pro", "pet_owner"].map((tab) => {
              const isActive = activeFilter === tab;
              return (
                <button
                  key={tab}
                  onClick={() => setActiveFilter(tab)}
                  className={`shrink-0 px-4 py-2 rounded-xl text-sm font-medium transition ${
                    isActive
                      ? "bg-primary text-white"
                      : "border border-gray-200 bg-white/80 text-black hover:bg-gray-100"
                  }`}
                >
                  {tab === "all"
                    ? "All Users"
                    : tab.charAt(0).toUpperCase() +
                      tab.slice(1).replace("_", " ")}
                </button>
              );
            })}
          </div>
        </div>

        {/* Users Table/Cards */}
        <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden mb-4">
          <UserTable users={currentUsers} onViewDetails={setSelectedUser} />
          <UserMobileCards
            users={currentUsers}
            onViewDetails={setSelectedUser}
          />
        </div>

        <div className="flex justify-between items-center gap-2 sm:mb-0">
          <button
            onClick={prevPage}
            disabled={currentPage === 1}
            className="px-4 py-2 rounded-lg border border-gray-200 bg-white hover:bg-gray-100 disabled:opacity-0"
          >
            Prev
          </button>

          <div className="flex gap-2 items-center">
            {[...Array(totalPages)].map((_, i) => (
                <button
                key={i}
                onClick={() => goToPage(i + 1)}
                disabled={totalPages === 1}
                className={`px-4 py-2 rounded-lg text-sm font-medium ${currentPage === i + 1 ? "bg-primary text-white" : "border border-gray-200 bg-white hover:bg-gray-100"} disabled:opacity-0`}
                >
                {i + 1}
                </button>
            ))}
          </div>
          <button
            onClick={nextPage}
            disabled={currentPage === totalPages}
            className="px-4 py-2 rounded-lg border border-gray-200 bg-white hover:bg-gray-100 disabled:opacity-0"
          >
            Next
          </button>
        </div>
      </section>

      {/* User Details Modal */}
      <UserDetailsModal
        user={selectedUser}
        onClose={() => setSelectedUser(null)}
        loading={loading}
      />
    </div>
  );
}

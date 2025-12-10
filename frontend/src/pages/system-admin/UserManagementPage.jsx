import { useState, useEffect } from "react";
import { FaSearch, FaChevronLeft, FaChevronRight } from "react-icons/fa";
import UserDetailsModal from "../../components/users/UserDetailsModal";
import UserMobileCards from "../../components/users/UserMobileCards";
import UserTable from "../../components/users/UserTable";
import Pagination from "../../components/Pagination";
import { fetchAllUsers } from "../../global/api/systemAdmin";

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
    const fetchAllUsersData = async () => {
      setLoading(true);
      try {
        const allUsers = await fetchAllUsers();
        setUsers(allUsers);
        setFilteredUsers(allUsers);
      } catch (err) {
        console.error("Error fetching users:", err);
        setLoading(false);
      }
    }
    fetchAllUsersData();
  }, []);

  useEffect(() => {
    let result = users;

    if (activeFilter !== "all") {
      result = result.filter((u) => u.user_type === activeFilter);
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
    clinic_admin: users.filter((u) => u.user_type === "clinic_admin").length,
    vet_pro: users.filter((u) => u.user_type === "vet_professional").length,
    pet_owner: users.filter((u) => u.user_type === "pet_owner").length,
  };

  return (
    <div>
      <div className="min-h-screen pb-10">
        {/* Header */}
        <div className="mb-6">
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
            {["all", "clinic_admin", "vet_professional", "pet_owner"].map((tab) => {
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
          <UserMobileCards users={currentUsers} onViewDetails={setSelectedUser} />
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

      {/* User Details Modal */}
      <UserDetailsModal
        user={selectedUser}
        onClose={() => setSelectedUser(null)}
        loading={loading}
      />
    </div>
  );
}

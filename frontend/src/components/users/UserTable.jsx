import { FaEye } from "react-icons/fa";

export default function UserTable({ users, onViewDetails }) {
  return (
    <div className="hidden lg:block overflow-x-auto max-w-full">
      <table className="w-full">
        <thead className="bg-gray-50 border-b border-gray-200">
          <tr>
            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">User</th>
            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Contact</th>
            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Role</th>
            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Joined</th>
            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Status</th>
            <th className="px-6 py-4 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {users.length === 0 ? (
            <tr>
              <td colSpan="6" className="px-6 py-12 text-center text-gray-500">
                No users found
              </td>
            </tr>
          ) : (
            users.map((user) => (
              <tr key={user.user_id} className="hover:bg-gray-50 transition">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-linear-to-br from-primary to-[#FFB49A] flex items-center justify-center text-white font-semibold">
                      {user.name.charAt(0)}
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900">
                        {user.name}
                      </div>
                      <div className="text-sm text-gray-500">{user.email}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm text-gray-900">{user.phone}</div>
                </td>
                <td className="px-6 py-4">
                  <span
                    className={`px-3 truncate py-1 rounded-xl text-xs font-semibold ${
                      user.role === "clinic_admin"
                        ? "bg-purple-100 text-purple-700 border border-purple-300"
                        : user.role === "vet_pro"
                        ? "bg-blue-100 text-blue-700 border border-blue-300"
                        : "bg-gray-100 text-gray-700 border border-gray-300"
                    }`}
                  >
                    {user.role.toUpperCase().replace("_", " ")}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">
                  {user.joined_date}
                </td>
                <td className="px-6 py-4">
                  <span
                    className={`px-3 py-1 rounded-xl text-xs font-semibold ${
                      user.status === "active"
                        ? "bg-green-100 text-green-700 border border-green-300"
                        : "bg-red-100 text-red-700 border border-red-300"
                    }`}
                  >
                    {user.status.toUpperCase()}
                  </span>
                </td>
                <td className="px-6 py-4 text-center">
                  {/* View Details Button */}
                  <div className="relative group">
                    <button
                      onClick={() => onViewDetails(user)}
                      className="p-2.5 rounded-xl bg-primary hover:bg-primary/90 text-white transition-all duration-200 hover:shadow-lg hover:scale-105 active:scale-95"
                      aria-label="View Details"
                    >
                      <FaEye className="w-4 h-4" />
                    </button>
                    {/* Tooltip */}
                    <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1.5 bg-gray-900 text-white text-xs font-medium rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 whitespace-nowrap pointer-events-none">
                      View Details
                      {/* Tooltip arrow */}
                      <span className="absolute top-full left-1/2 -translate-x-1/2 -mt-px border-4 border-transparent border-t-gray-900"></span>
                    </span>
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

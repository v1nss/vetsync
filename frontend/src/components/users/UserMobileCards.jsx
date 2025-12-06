import React, { useState, useEffect } from "react";
import DriveImage from "../DriveImage";
import {
  FaSearch,
  FaUser,
  FaEnvelope,
  FaPhone,
  FaCalendar,
} from "react-icons/fa";

export default function UserMobileCards({ users, onViewDetails }) {
  return (
    <div className="lg:hidden p-4 space-y-4">
      {users.length === 0 ? (
        <div className="text-center py-12 text-gray-500">No users found</div>
      ) : (
        users.map((user) => (
          <div
            key={user.id}
            className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-linear-to-br from-primary to-[#FFB49A] flex items-center justify-center text-white font-semibold text-lg">
                  {user?.profile_image_url ? (
                      <DriveImage
                        image={user.profile_image_url}
                        alt={user.first_name}
                        className="w-full h-full object-cover rounded-full"
                        fallbackIcon={false}
                      />
                    ) : null}
                    {!user?.profile_image_url && user.first_name.charAt(0)}
                </div>
                <div>
                  <div className="font-semibold text-gray-900">{user.first_name} {user.last_name}</div>
                  <div className="text-xs text-gray-500">{user.email}</div>
                </div>
              </div>
            </div>

            <div className="space-y-2 mb-3">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <FaPhone className="text-gray-400" />
                {user.phone_numebr || "N/A"}
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <FaCalendar className="text-gray-400" />
                Joined: {user.createdAt.slice(0, 10)}
              </div>
            </div>

            <div className="flex items-center justify-between mb-3">
              <span
                className={`px-3 py-1 rounded-xl text-xs font-semibold ${
                  user.user_type === "clinic_admin"
                    ? "bg-purple-100 text-purple-700 border border-purple-300"
                    : user.role === "vet_professional"
                    ? "bg-blue-100 text-blue-700 border border-blue-300"
                    : "bg-gray-100 text-gray-700 border border-gray-300"
                }`}
              >
                {user.user_type.toUpperCase().replace("_", " ")}
              </span>
              {/* <span
                className={`px-3 py-1 rounded-xl text-xs font-semibold ${
                  user.status === "active"
                    ? "bg-green-100 text-green-700 border border-green-300"
                    : "bg-red-100 text-red-700 border border-red-300"
                }`}
              >
                {user.status.toUpperCase()}
              </span> */}
            </div>

            <button
              onClick={() => onViewDetails(user)}
              className="w-full px-4 py-2 bg-primary text-white text-sm rounded-lg hover:bg-primary/80 transition"
            >
              View Details
            </button>
          </div>
        ))
      )}
    </div>
  );
}

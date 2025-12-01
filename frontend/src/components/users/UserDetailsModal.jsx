import React, { useState, useEffect } from 'react';
import { FaTimesCircle } from 'react-icons/fa';
import DriveImage from '../DriveImage';

export default function UserDetailsModal({ user, onClose }) {
  if (!user) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-900">User Details</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-2xl"
          >
            <FaTimesCircle className="text-2xl" />
          </button>
        </div>

        <div className="p-6">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-20 h-20 rounded-full bg-linear-to-br from-primary to-[#FFB49A] flex items-center justify-center text-white font-bold text-3xl">
              {user?.profile_image_url ? (
                  <DriveImage
                    image={user.profile_image_url}
                    alt={user.full_name}
                    className="w-full h-full object-cover rounded-full"
                    fallbackIcon={false}
                  />
                ) : null}
                {!user?.profile_image_url && user.full_name.charAt(0)}
            </div>
            <div>
              <h3 className="text-2xl font-bold text-gray-900">{user.full_name}</h3>
              <p className="text-gray-600">{user.email}</p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="bg-gray-50 rounded-xl p-4">
              <div className="text-sm text-gray-600 mb-1">User ID</div>
              <div className="font-semibold text-gray-900">{user.id}</div>
            </div>

            <div className="bg-gray-50 rounded-xl p-4">
              <div className="text-sm text-gray-600 mb-1">Phone Number</div>
              <div className="font-semibold text-gray-900">{user.phone_numebr || "N/A"}</div>
            </div>

            <div className="bg-gray-50 rounded-xl p-4">
              <div className="text-sm text-gray-600 mb-1">Role</div>
              <span className={`inline-block px-3 py-1 rounded-xl text-xs font-semibold ${
                user.user_type === 'clinic_admin' 
                  ? 'bg-purple-100 text-purple-700 border border-purple-300'
                  : user.user_type === 'vet_pro'
                  ? 'bg-blue-100 text-blue-700 border border-blue-300'
                  : 'bg-gray-100 text-gray-700 border border-gray-300'
              }`}>
                {user.user_type.toUpperCase().replace('_', ' ')}
              </span>
            </div>

            {/* <div className="bg-gray-50 rounded-xl p-4">
              <div className="text-sm text-gray-600 mb-1">Status</div>
              <span className={`inline-block px-3 py-1 rounded-xl text-xs font-semibold ${
                user.status === 'active'
                  ? 'bg-green-100 text-green-700 border border-green-300'
                  : 'bg-red-100 text-red-700 border border-red-300'
              }`}>
                {user.status.toUpperCase()}
              </span>
            </div> */}

            <div className="bg-gray-50 rounded-xl p-4">
              <div className="text-sm text-gray-600 mb-1">Join Date</div>
              <div className="font-semibold text-gray-900">{user.createdAt.slice(0, 10)}</div>
            </div>

            {user.address && (
              <div className="bg-gray-50 rounded-xl p-4">
                <div className="text-sm text-gray-600 mb-1">Address</div>
                <div className="font-semibold text-gray-900">{user.address}</div>
              </div>
            )}
          </div>
        </div>

        <div className="sticky bottom-0 bg-white border-t border-gray-200 px-6 py-4">
          <button
            onClick={onClose}
            className="w-full px-4 py-3 bg-white border border-gray-200 text-gray-700 rounded-xl font-medium hover:bg-gray-300 transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
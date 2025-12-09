import { useState, useEffect } from "react";
import { FaCamera, FaUser, FaLock, FaEnvelope, FaPhone, FaBriefcase, FaEdit, FaSave, FaTimes } from "react-icons/fa";
import Navbar from "../../components/Navbar.jsx";
import { useAuth } from "../../context/AuthContext";
import { updateUserProfile } from "../../global/api/user";

export default function VetProfilePage() {
  const { user } = useAuth();
  
  // Profile state
  const [profile, setProfile] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    specialization: "",
    profilePicture: null,
  });
  
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  // Password change state
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [passwordError, setPasswordError] = useState("");
  
  // Image upload state
  const [imagePreview, setImagePreview] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);

  // Fetch vet profile data
  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      
      // Use the user context data
      if (user) {
        setProfile({
          firstName: user.first_name || "",
          lastName: user.last_name || "",
          email: user.email || "",
          phone: user.phone_number || "",
          specialization: user.VetProfessional?.specialization || "",
          profilePicture: user.profile_image_url?.link || null,
        });
        
        if (user.profile_image_url?.link) {
          setImagePreview(user.profile_image_url.link);
        }
      }
    } catch (error) {
      console.error("Error fetching profile:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleInputChange = (field, value) => {
    setProfile(prev => ({ ...prev, [field]: value }));
  };

  const handleSaveProfile = async () => {
    try {
      setSaving(true);
      
      const profileData = {
        first_name: profile.firstName,
        last_name: profile.lastName,
        phone_number: profile.phone,
      };
      
      // Note: Specialization update would require a separate endpoint
      // For now, we only update basic user fields
      
      await updateUserProfile(user.id, profileData);
      
      setIsEditing(false);
      setSelectedImage(null);
      alert('Profile updated successfully!');
      
      // Refresh user data
      fetchProfile();
    } catch (error) {
      console.error("Error saving profile:", error);
      alert(error.response?.data?.error || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setImagePreview(profile.profilePicture);
    setSelectedImage(null);
    fetchProfile();
  };

  const handlePasswordChange = async () => {
    setPasswordError("");
    
    if (!passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmPassword) {
      setPasswordError("All fields are required");
      return;
    }
    
    if (passwordData.newPassword.length < 6) {
      setPasswordError("New password must be at least 6 characters");
      return;
    }
    
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setPasswordError("New passwords do not match");
      return;
    }

    try {
      await updateUserProfile(user.id, {
        password: passwordData.newPassword,
      });
      
      alert('Password changed successfully!');
      setShowPasswordModal(false);
      setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" });
    } catch (error) {
      console.error("Error changing password:", error);
      setPasswordError(error.response?.data?.error || "An error occurred while changing password");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex justify-center items-center h-screen">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-gray-200 border-t-primary" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">My Profile</h1>
          <p className="text-gray-600 mt-1">Manage your personal information and settings</p>
        </div>

        {/* Profile Picture Section */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6 mb-6">
          <div className="flex flex-col sm:flex-row items-center gap-6">
            <div className="relative">
              <div className="w-32 h-32 rounded-full bg-gray-100 overflow-hidden flex items-center justify-center">
                {imagePreview ? (
                  <img src={imagePreview} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <FaUser className="text-5xl text-gray-400" />
                )}
              </div>
              {isEditing && (
                <label className="absolute bottom-0 right-0 bg-primary text-white p-3 rounded-full cursor-pointer hover:bg-[#FEA08E] transition shadow-lg">
                  <FaCamera className="text-lg" />
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                </label>
              )}
            </div>
            
            <div className="flex-1 text-center sm:text-left">
              <h2 className="text-2xl font-bold text-gray-900">
                Dr. {profile.firstName} {profile.lastName}
              </h2>
              <p className="text-gray-600 mt-1">{profile.specialization || "Veterinary Professional"}</p>
              <p className="text-sm text-gray-500 mt-2">{profile.email}</p>
            </div>

            <div className="flex gap-3">
              {!isEditing ? (
                <button
                  onClick={() => setIsEditing(true)}
                  className="flex items-center gap-2 px-5 py-2.5 bg-primary text-white rounded-xl font-semibold hover:bg-[#FEA08E] transition"
                >
                  <FaEdit /> Edit Profile
                </button>
              ) : (
                <>
                  <button
                    onClick={handleCancelEdit}
                    className="flex items-center gap-2 px-5 py-2.5 border border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition"
                  >
                    <FaTimes /> Cancel
                  </button>
                  <button
                    onClick={handleSaveProfile}
                    disabled={saving}
                    className="flex items-center gap-2 px-5 py-2.5 bg-primary text-white rounded-xl font-semibold hover:bg-[#FEA08E] transition disabled:opacity-50"
                  >
                    <FaSave /> {saving ? "Saving..." : "Save Changes"}
                  </button>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Personal Information */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6 mb-6">
          <h3 className="text-xl font-semibold mb-6 flex items-center gap-2">
            <FaUser className="text-primary" />
            Personal Information
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                First Name
              </label>
              <input
                type="text"
                value={profile.firstName}
                onChange={(e) => handleInputChange('firstName', e.target.value)}
                disabled={!isEditing}
                className="w-full border border-gray-200 p-3 rounded-xl focus:border-primary focus:outline-none disabled:bg-gray-50 disabled:text-gray-600"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Last Name
              </label>
              <input
                type="text"
                value={profile.lastName}
                onChange={(e) => handleInputChange('lastName', e.target.value)}
                disabled={!isEditing}
                className="w-full border border-gray-200 p-3 rounded-xl focus:border-primary focus:outline-none disabled:bg-gray-50 disabled:text-gray-600"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <FaEnvelope className="inline mr-2 text-primary" />
                Email Address
              </label>
              <input
                type="email"
                value={profile.email}
                disabled
                className="w-full border border-gray-200 p-3 rounded-xl bg-gray-50 text-gray-600"
              />
              <p className="text-xs text-gray-500 mt-1">Email cannot be changed</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <FaPhone className="inline mr-2 text-primary" />
                Phone Number
              </label>
              <input
                type="tel"
                value={profile.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                disabled={!isEditing}
                className="w-full border border-gray-200 p-3 rounded-xl focus:border-primary focus:outline-none disabled:bg-gray-50 disabled:text-gray-600"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <FaBriefcase className="inline mr-2 text-primary" />
                Specialization
              </label>
              <input
                type="text"
                value={profile.specialization}
                disabled
                placeholder="e.g., Small Animal Surgery, Internal Medicine"
                className="w-full border border-gray-200 p-3 rounded-xl bg-gray-50 text-gray-600"
              />
              <p className="text-xs text-gray-500 mt-1">Contact your clinic admin to update specialization</p>
            </div>
          </div>
        </div>

        {/* Security Section */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6">
          <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <FaLock className="text-primary" />
            Security
          </h3>
          <p className="text-gray-600 mb-4">Keep your account secure by updating your password regularly</p>
          <button
            onClick={() => setShowPasswordModal(true)}
            className="px-5 py-2.5 border border-primary text-primary rounded-xl font-semibold hover:bg-primary hover:text-white transition"
          >
            Change Password
          </button>
        </div>
      </div>

      {/* Password Change Modal */}
      {showPasswordModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 relative animate-scale-in">
            <button
              onClick={() => {
                setShowPasswordModal(false);
                setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" });
                setPasswordError("");
              }}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition"
            >
              <FaTimes className="text-xl" />
            </button>

            <h2 className="text-2xl font-bold text-gray-900 mb-6">Change Password</h2>

            {passwordError && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl mb-4">
                {passwordError}
              </div>
            )}

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Current Password
                </label>
                <input
                  type="password"
                  value={passwordData.currentPassword}
                  onChange={(e) => setPasswordData(prev => ({ ...prev, currentPassword: e.target.value }))}
                  className="w-full border border-gray-200 p-3 rounded-xl focus:border-primary focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  New Password
                </label>
                <input
                  type="password"
                  value={passwordData.newPassword}
                  onChange={(e) => setPasswordData(prev => ({ ...prev, newPassword: e.target.value }))}
                  className="w-full border border-gray-200 p-3 rounded-xl focus:border-primary focus:outline-none"
                />
                <p className="text-xs text-gray-500 mt-1">Must be at least 6 characters</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Confirm New Password
                </label>
                <input
                  type="password"
                  value={passwordData.confirmPassword}
                  onChange={(e) => setPasswordData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                  className="w-full border border-gray-200 p-3 rounded-xl focus:border-primary focus:outline-none"
                />
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => {
                  setShowPasswordModal(false);
                  setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" });
                  setPasswordError("");
                }}
                className="flex-1 border border-gray-300 text-gray-700 py-3 rounded-xl font-semibold hover:bg-gray-50 transition"
              >
                Cancel
              </button>
              <button
                onClick={handlePasswordChange}
                className="flex-1 bg-primary text-white py-3 rounded-xl font-semibold hover:bg-[#FEA08E] transition"
              >
                Change Password
              </button>
            </div>
          </div>

          <style>{`
            @keyframes scale-in {
              from {
                transform: scale(0.9);
                opacity: 0;
              }
              to {
                transform: scale(1);
                opacity: 1;
              }
            }
            
            .animate-scale-in {
              animation: scale-in 0.2s ease-out;
            }
          `}</style>
        </div>
      )}
    </div>
  );
}
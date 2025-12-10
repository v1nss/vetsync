import { useState, useEffect } from 'react';
import { FaChevronLeft, FaCamera, FaUser, FaLock, FaEnvelope, FaPhone, FaMapMarkerAlt, FaEdit, FaSave, FaTimes } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../../components/Navbar';
import Footer from '../../../components/Footer';
import { useAuth } from '../../../context/AuthContext';
import DriveImage from '../../../components/DriveImage';
import NotificationModal from '../../../components/NotificationModal';
import { updateUserProfile } from '../../../global/api/user';

export default function ProfileSettingsPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    bio: '',
  });
  const countryCode = "+63"; // Fixed to Philippines

  const [profileImage, setProfileImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [notification, setNotification] = useState({ isOpen: false, type: 'success', title: '', message: '' });
  
  // Password change state
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [passwordError, setPasswordError] = useState('');

  // Fetch profile data
  useEffect(() => {
    fetchProfile();
  }, []);

  // Parse phone number to remove country code for display
  const parsePhoneNumber = (phoneNumber) => {
    if (!phoneNumber) return '';
    // Remove country code if present
    const cleaned = phoneNumber.replace(/^\+63\s*/, '').replace(/\D/g, '');
    return cleaned;
  };

  const fetchProfile = async () => {
    try {
      setLoading(true);
      
      if (user) {
        setFormData({
          firstName: user.first_name || '',
          lastName: user.last_name || '',
          email: user.email || '',
          phone: parsePhoneNumber(user.phone_number || ''),
          address: user.PetOwner?.address || '',
          bio: user.bio || '',
        });
        
        if (user.profile_image_url?.link) {
          setPreview(user.profile_image_url.link);
        }
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const getInitials = (firstName, lastName) => {
    if (!firstName && !lastName) return 'U';
    const first = firstName?.[0] || '';
    const last = lastName?.[0] || '';
    return (first + last).toUpperCase();
  };

  const showNotification = (type, title, message) => {
    setNotification({ isOpen: true, type, title, message });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    const allowedTypes = ["image/png", "image/jpeg", "image/jpg"];

    if (!file) return;

    if (!allowedTypes.includes(file.type)) {
      showNotification('error', 'Invalid File Type', 'Only PNG, JPG, and JPEG images are allowed.');
      e.target.value = "";
      return;
    }

    setProfileImage(file);
    const reader = new FileReader();
    reader.onloadend = () => setPreview(reader.result);
    reader.readAsDataURL(file);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handlePhoneNumberChange = (e) => {
    const value = e.target.value;
    // Only allow numbers, spaces, hyphens, and parentheses
    const numericValue = value.replace(/[^\d\s\-()]/g, '');
    setFormData(prev => ({ ...prev, phone: numericValue }));
  };

  const handleSaveProfile = async () => {
    try {
      setSaving(true);
      
      // Format phone number with country code
      const formattedPhone = countryCode + " " + formData.phone.replace(/\D/g, '');
      
      const profileData = {
        first_name: formData.firstName,
        last_name: formData.lastName,
        phone_number: formattedPhone,
        address: formData.address,
        bio: formData.bio,
      };
      
      const response = await updateUserProfile(user.id, profileData, profileImage);
      
      // Update local state with response data
      if (response.user) {
        setFormData({
          firstName: response.user.first_name || '',
          lastName: response.user.last_name || '',
          email: response.user.email || '',
          phone: parsePhoneNumber(response.user.phone_number || ''),
          address: response.user.PetOwner?.address || '',
          bio: response.user.bio || '',
        });
        
        if (response.user.profile_image_url?.link) {
          setPreview(response.user.profile_image_url.link);
        }
      }
      
      setIsEditing(false);
      setProfileImage(null);
      showNotification('success', 'Profile Updated!', 'Your profile has been successfully updated.');
      
      // Refresh user data
      fetchProfile();
    } catch (err) {
      console.error('Error saving profile:', err);
      showNotification('error', 'Update Failed', err.response?.data?.error || 'An error occurred while updating your profile.');
    } finally {
      setSaving(false);
    }
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setProfileImage(null);
    fetchProfile();
  };

  const handlePasswordChange = async () => {
    setPasswordError('');
    
    if (!passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmPassword) {
      setPasswordError('All fields are required');
      return;
    }
    
    if (passwordData.newPassword.length < 6) {
      setPasswordError('New password must be at least 6 characters');
      return;
    }
    
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setPasswordError('New passwords do not match');
      return;
    }

    try {
      await updateUserProfile(user.id, {
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
      });
      
      showNotification('success', 'Password Changed!', 'Your password has been successfully updated.');
      setShowPasswordModal(false);
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (error) {
      console.error('Error changing password:', error);
      setPasswordError(error.response?.data?.error || 'An error occurred while changing password');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="hidden lg:block"><Navbar /></div>
        <div className="flex justify-center items-center h-screen">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-gray-200 border-t-primary" />
        </div>
      </div>
    );
  }

  const fullName = [formData.firstName, formData.lastName].filter(Boolean).join(' ') || 'User';

  return (
    <>
      <NotificationModal
        isOpen={notification.isOpen}
        onClose={() => setNotification({ ...notification, isOpen: false })}
        type={notification.type}
        title={notification.title}
        message={notification.message}
      />

      {/* Password Change Modal */}
      {showPasswordModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 relative animate-scale-in">
            <button
              onClick={() => {
                setShowPasswordModal(false);
                setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
                setPasswordError('');
              }}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition"
            >
              <FaTimes className="text-xl" />
            </button>

            <h2 className="text-2xl font-bold text-gray-900 mb-6">Change Password</h2>

            {passwordError && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl mb-4 text-sm">
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
                  className="w-full px-4 py-3 border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary"
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
                  className="w-full px-4 py-3 border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary"
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
                  className="w-full px-4 py-3 border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => {
                  setShowPasswordModal(false);
                  setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
                  setPasswordError('');
                }}
                className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-2xl hover:bg-gray-50 transition"
              >
                Cancel
              </button>
              <button
                onClick={handlePasswordChange}
                className="flex-1 px-4 py-3 bg-primary text-white rounded-2xl hover:bg-[#FEA08E] transition"
              >
                Change Password
              </button>
            </div>
          </div>

          <style>{`
            @keyframes scale-in {
              from { transform: scale(0.9); opacity: 0; }
              to { transform: scale(1); opacity: 1; }
            }
            .animate-scale-in { animation: scale-in 0.2s ease-out; }
          `}</style>
        </div>
      )}

      <div className="min-h-screen bg-background">
        {/* Mobile Layout */}
        <div className="lg:hidden">
          <div className="bg-white min-h-screen pb-20">
            <div className="sticky top-0 p-4 z-10 flex items-center justify-between bg-white border-b border-gray-100">
              <button onClick={() => navigate(-1)} className="flex gap-2 items-center rounded-full hover:bg-gray-300 transition">
                <FaChevronLeft className="text-gray-500" />
                <span className="text-xl font-medium">My Profile</span>
              </button>
              {!isEditing ? (
                <button
                  onClick={() => setIsEditing(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-xl text-sm font-medium hover:bg-[#FEA08E] transition"
                >
                  <FaEdit /> Edit
                </button>
              ) : (
                <button
                  onClick={handleCancelEdit}
                  className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-xl text-sm font-medium hover:bg-gray-50 transition"
                >
                  <FaTimes /> Cancel
                </button>
              )}
            </div>

            <div className="p-4 space-y-6">
              {/* Profile Photo */}
              <div className="flex flex-col items-center py-6">
                <div className="relative">
                  <div className="w-32 h-32 rounded-full bg-primary text-white flex items-center justify-center text-3xl font-semibold overflow-hidden">
                    {preview ? (
                      <img src={preview} alt="Profile" className="w-full h-full object-cover" />
                    ) : (
                      <span>{getInitials(formData.firstName, formData.lastName)}</span>
                    )}
                  </div>
                  {isEditing && (
                    <label htmlFor="profileImageMobile" className="absolute bottom-0 right-0 w-10 h-10 bg-primary rounded-full flex items-center justify-center cursor-pointer hover:bg-[#FEA08E] transition shadow-lg">
                      <FaCamera className="text-white" />
                    </label>
                  )}
                  <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" id="profileImageMobile" />
                </div>
                <h2 className="text-xl font-bold text-gray-900 mt-4">{fullName}</h2>
                <p className="text-sm text-gray-500">{formData.email}</p>
              </div>

              {/* Personal Information */}
              <div className="bg-white rounded-2xl border border-gray-200 p-4">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <FaUser className="text-primary" />
                  Personal Information
                </h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">First Name</label>
                    <input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                      disabled={!isEditing}
                      className="w-full px-4 py-3 border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary disabled:bg-gray-50 disabled:text-gray-600"
                      placeholder="Enter your first name"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Last Name</label>
                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                      disabled={!isEditing}
                      className="w-full px-4 py-3 border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary disabled:bg-gray-50 disabled:text-gray-600"
                      placeholder="Enter your last name"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <FaEnvelope className="inline mr-2 text-primary" />
                      Email
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      disabled
                      className="w-full px-4 py-3 border border-gray-300 rounded-2xl bg-gray-50 text-gray-600"
                    />
                    <p className="text-xs text-gray-500 mt-1">Email cannot be changed</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <FaPhone className="inline mr-2 text-primary" />
                      Phone Number
                    </label>
                    <div className="flex gap-2 w-full">
                      <div className="flex items-center justify-center px-3 sm:px-4 py-3 border border-gray-300 rounded-2xl bg-gray-50 text-gray-700 text-sm font-medium whitespace-nowrap shrink-0">
                        🇵🇭 +63
                      </div>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handlePhoneNumberChange}
                        disabled={!isEditing}
                        className="focus:outline-none flex-1 min-w-0 text-sm px-4 py-3 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-primary disabled:bg-gray-50 disabled:text-gray-600"
                        placeholder="912 345 6789"
                        maxLength={15}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <FaMapMarkerAlt className="inline mr-2 text-primary" />
                      Address
                    </label>
                    <input
                      type="text"
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      disabled={!isEditing}
                      className="w-full px-4 py-3 border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary disabled:bg-gray-50 disabled:text-gray-600"
                      placeholder="Enter your address"
                    />
                  </div>

                  {/* <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Bio</label>
                    <textarea
                      name="bio"
                      value={formData.bio}
                      onChange={handleChange}
                      disabled={!isEditing}
                      rows={4}
                      className="w-full px-4 py-3 border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary resize-none disabled:bg-gray-50 disabled:text-gray-600"
                      placeholder="Tell us about yourself"
                    />
                  </div> */}
                </div>
              </div>

              {/* Security Section */}
              <div className="bg-white rounded-2xl border border-gray-200 p-4">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <FaLock className="text-primary" />
                  Security
                </h3>
                <p className="text-sm text-gray-600 mb-4">Keep your account secure by updating your password regularly</p>
                <button
                  onClick={() => setShowPasswordModal(true)}
                  className="w-full px-4 py-3 border border-primary text-primary rounded-2xl font-medium hover:bg-primary hover:text-white transition"
                >
                  Change Password
                </button>
              </div>
            </div>

            {isEditing && (
              <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 p-4">
                <button
                  onClick={handleSaveProfile}
                  disabled={saving}
                  className="w-full px-4 py-3 bg-primary text-white rounded-2xl hover:bg-[#FEA08E] transition disabled:opacity-50 font-medium"
                >
                  {saving ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Desktop Layout */}
        <div className="hidden lg:block">
          <Navbar />
          <div className="max-w-4xl mx-auto py-8 px-6">
            <div className="flex items-center gap-4 mb-8">
              <button onClick={() => navigate(-1)} className="flex items-center gap-2">
                <FaChevronLeft className="text-gray-500" />
                <h1 className="text-2xl font-medium">My Profile</h1>
              </button>
            </div>

            {/* Profile Picture Section */}
            <div className="bg-white rounded-2xl p-6 border border-gray-200 mb-6">
              <div className="flex items-center gap-6">
                <div className="relative">
                  <div className="w-32 h-32 rounded-full bg-primary text-white flex items-center justify-center text-3xl font-semibold overflow-hidden">
                    {preview ? (
                      <img src={preview} alt="Profile" className="w-full h-full object-cover" />
                    ) : (
                      <span>{getInitials(formData.firstName, formData.lastName)}</span>
                    )}
                  </div>
                  {isEditing && (
                    <label className="absolute bottom-0 right-0 w-10 h-10 bg-primary rounded-full flex items-center justify-center cursor-pointer hover:bg-[#FEA08E] transition shadow-lg">
                      <FaCamera className="text-white" />
                      <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
                    </label>
                  )}
                </div>
                
                <div className="flex-1">
                  <h2 className="text-2xl font-bold text-gray-900">{fullName}</h2>
                  <p className="text-gray-600 mt-1">{formData.email}</p>
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
                        <FaSave /> {saving ? 'Saving...' : 'Save Changes'}
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Personal Information */}
            <div className="bg-white rounded-2xl p-6 border border-gray-200 mb-6">
              <h3 className="text-xl font-semibold mb-6 flex items-center gap-2">
                <FaUser className="text-primary" />
                Personal Information
              </h3>
              
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">First Name</label>
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    disabled={!isEditing}
                    className="w-full px-4 py-3 border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary disabled:bg-gray-50 disabled:text-gray-600"
                    placeholder="Enter your first name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Last Name</label>
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    disabled={!isEditing}
                    className="w-full px-4 py-3 border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary disabled:bg-gray-50 disabled:text-gray-600"
                    placeholder="Enter your last name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <FaEnvelope className="inline mr-2 text-primary" />
                    Email Address
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    disabled
                    className="w-full px-4 py-3 border border-gray-300 rounded-2xl bg-gray-50 text-gray-600"
                  />
                  <p className="text-xs text-gray-500 mt-1">Email cannot be changed</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <FaPhone className="inline mr-2 text-primary" />
                    Phone Number
                  </label>
                  <div className="flex gap-2 w-full">
                    <div className="flex items-center justify-center px-3 sm:px-4 py-3 border border-gray-300 rounded-2xl bg-gray-50 text-gray-700 text-sm font-medium whitespace-nowrap shrink-0">
                      🇵🇭 +63
                    </div>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handlePhoneNumberChange}
                      disabled={!isEditing}
                      className="focus:outline-none flex-1 min-w-0 text-sm px-4 py-3 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-primary disabled:bg-gray-50 disabled:text-gray-600"
                      placeholder="912 345 6789"
                      maxLength={15}
                    />
                  </div>
                </div>

                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <FaMapMarkerAlt className="inline mr-2 text-primary" />
                    Address
                  </label>
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    disabled={!isEditing}
                    className="w-full px-4 py-3 border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary disabled:bg-gray-50 disabled:text-gray-600"
                    placeholder="Enter your address"
                  />
                </div>

                {/* <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Bio</label>
                  <textarea
                    name="bio"
                    value={formData.bio}
                    onChange={handleChange}
                    disabled={!isEditing}
                    rows={4}
                    className="w-full px-4 py-3 border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary resize-none disabled:bg-gray-50 disabled:text-gray-600"
                    placeholder="Tell us about yourself"
                  />
                </div> */}
              </div>
            </div>

            {/* Security Section */}
            <div className="bg-white rounded-2xl p-6 border border-gray-200">
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
          <Footer />
        </div>
      </div>
    </>
  );
}
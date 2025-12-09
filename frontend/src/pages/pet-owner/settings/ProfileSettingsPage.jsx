import { useState } from 'react';
import { FaChevronLeft, FaCamera, FaCheckCircle, FaTimes, FaExclamationCircle } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../../components/Navbar';
import Footer from '../../../components/Footer';
import { useAuth } from '../../../context/AuthContext';
import DriveImage from '../../../components/DriveImage';
import NotificationModal from '../../../components/NotificationModal';

export default function ProfileSettingsPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [formData, setFormData] = useState({
    fullName: user?.full_name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    address: user?.address || '',
    bio: user?.bio || '',
  });

  const [profileImage, setProfileImage] = useState(null);
  const [preview, setPreview] = useState(user?.profile_image_url || null);
  const [notification, setNotification] = useState({ isOpen: false, type: 'success', title: '', message: '' });

  const getInitials = (name) => {
    if (!name) return 'U';
    return name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2);
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      // API call to update profile would go here
      // const data = new FormData();
      // data.append('user', JSON.stringify(formData));
      // if (profileImage) data.append('file', profileImage);
      // await updateUserProfile(data);
      
      showNotification('success', 'Profile Updated!', 'Your profile has been successfully updated.');
    } catch (err) {
      showNotification('error', 'Update Failed', 'An error occurred while updating your profile.');
    }
  };

  return (
    <>
      <NotificationModal
        isOpen={notification.isOpen}
        onClose={() => setNotification({ ...notification, isOpen: false })}
        type={notification.type}
        title={notification.title}
        message={notification.message}
      />

      <div className="min-h-screen bg-background">
        {/* Mobile Layout */}
        <div className="lg:hidden">
          <div className="bg-white min-h-screen pb-20">
            <div className="sticky top-0 p-4 z-10 flex items-center gap-2 bg-white border-b border-gray-100">
              <button onClick={() => navigate(-1)} className="flex gap-2 items-center justify-center rounded-full hover:bg-gray-300 transition">
                <FaChevronLeft className="text-gray-500" />
                <span className="text-xl font-medium">Edit Profile</span>
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-4 space-y-6">
              {/* Profile Photo */}
              <div className="flex flex-col items-center">
                <div className="relative">
                  <div className="w-32 h-32 rounded-full bg-primary text-white flex items-center justify-center text-3xl font-semibold overflow-hidden">
                    {preview ? (
                      <img src={preview} alt="Profile" className="w-full h-full object-cover" />
                    ) : (
                      <span>{getInitials(formData.fullName)}</span>
                    )}
                  </div>
                  <label htmlFor="profileImageMobile" className="absolute bottom-0 right-0 w-10 h-10 bg-primary rounded-full flex items-center justify-center cursor-pointer hover:bg-[#FEA08E] transition">
                    <FaCamera className="text-white" />
                  </label>
                  <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" id="profileImageMobile" />
                </div>
                <p className="text-sm text-gray-500 mt-3">Click camera icon to change photo</p>
              </div>

              {/* Form Fields */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="Enter your full name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="Enter your email"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="Enter your phone number"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="Enter your address"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Bio</label>
                  <textarea
                    name="bio"
                    value={formData.bio}
                    onChange={handleChange}
                    rows={4}
                    className="w-full px-4 py-3 border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                    placeholder="Tell us about yourself"
                  />
                </div>
              </div>
            </form>

            <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 p-4 flex gap-3">
              <button onClick={() => navigate(-1)} className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-2xl hover:bg-gray-50 transition">
                Cancel
              </button>
              <button onClick={handleSubmit} className="flex-1 px-4 py-3 bg-primary text-white rounded-2xl hover:bg-[#FEA08E] transition">
                Save Changes
              </button>
            </div>
          </div>
        </div>

        {/* Desktop Layout */}
        <div className="hidden lg:block">
          <Navbar />
          <div className="max-w-4xl mx-auto py-8 px-6">
            <div className="flex items-center gap-4 mb-8">
              <button onClick={() => navigate(-1)} className="flex items-center gap-2">
                <FaChevronLeft className="text-gray-500" />
                <h1 className="text-2xl font-medium">Edit Profile</h1>
              </button>
            </div>

            <div className="bg-white rounded-2xl p-8 border border-gray-200">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="flex flex-col items-center mb-8">
                  <div className="relative">
                    <div className="w-32 h-32 rounded-full bg-primary text-white flex items-center justify-center text-3xl font-semibold overflow-hidden">
                      {preview ? (
                        <img src={preview} alt="Profile" className="w-full h-full object-cover" />
                      ) : (
                        <span>{getInitials(formData.fullName)}</span>
                      )}
                    </div>
                    <label htmlFor="profileImageDesktop" className="absolute bottom-0 right-0 w-10 h-10 bg-primary rounded-full flex items-center justify-center cursor-pointer hover:bg-[#FEA08E] transition">
                      <FaCamera className="text-white" />
                    </label>
                    <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" id="profileImageDesktop" />
                  </div>
                  <p className="text-sm text-gray-500 mt-3">Click camera icon to change photo</p>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                    <input
                      type="text"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary"
                      placeholder="Enter your full name"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary"
                      placeholder="Enter your email"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary"
                      placeholder="Enter your phone number"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
                    <input
                      type="text"
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary"
                      placeholder="Enter your address"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Bio</label>
                  <textarea
                    name="bio"
                    value={formData.bio}
                    onChange={handleChange}
                    rows={4}
                    className="w-full px-4 py-3 border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                    placeholder="Tell us about yourself"
                  />
                </div>

                <div className="flex gap-3 pt-6 border-t border-gray-100">
                  <button type="button" onClick={() => navigate(-1)} className="px-6 py-3 border border-gray-300 text-gray-700 rounded-2xl hover:bg-gray-50 transition">
                    Cancel
                  </button>
                  <button type="submit" className="px-6 py-3 bg-primary text-white rounded-2xl hover:bg-[#FEA08E] transition">
                    Save Changes
                  </button>
                </div>
              </form>
            </div>
          </div>
          <Footer />
        </div>
      </div>
    </>
  );
}
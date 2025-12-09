import { useState, useEffect } from "react";
import { FaSearch, FaChevronRight, FaChevronLeft, FaBell, FaLock, FaPalette, FaInfoCircle, FaQuestionCircle, FaExclamationTriangle, FaMars, FaVenus, FaSignOutAlt } from "react-icons/fa";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { useNavigate } from "react-router";
import { fetchAllPetsById } from "../../global/api/pet";
import { useAuth } from "../../context/AuthContext";
import DriveImage from "../../components/DriveImage";
import ConfirmationModal from "../../components/ConfirmationModal";

export default function SettingsPage() {
  const navigate = useNavigate();
  const { user, token, logout } = useAuth();
  
  // Get full name with fallback
  const fullName = [user?.first_name, user?.last_name]
    .filter(name => name && name.trim())
    .join(' ') || user?.email || 'User';

  // Get initials from name
  const getInitials = (name) => {
    if (!name) return 'U';
    return name
      .split(" ")
      .map(n => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const [loading, setLoading] = useState(true);
  const [pets, setPets] = useState([]);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  
  useEffect(() => {
    const fetchAllPets = async () => {
      setLoading(true);
      try {
        const res = await fetchAllPetsById(token);
        console.log(res);
        if (!res) {
          console.log("no pets exist");
          setPets([]);
        } else {
          setPets(res);
        }
      } catch (err) {
        console.error("Unable to get pets by ID:", err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAllPets();
  }, [token]);

  const settingsOptions = [
    { icon: FaBell, label: "Notifications", section: "other", path: "/pet-owner/settings/notifications" },
    { icon: FaLock, label: "Security", section: "other", path: "/pet-owner/settings/security" },
    { icon: FaPalette, label: "Appearance", section: "other", path: "/pet-owner/settings/appearance" },
    { icon: FaInfoCircle, label: "About VetSync", section: "info", path: "/pet-owner/settings/about" },
    { icon: FaQuestionCircle, label: "FAQs", section: "info", path: "/pet-owner/settings/faqs" },
    { icon: FaExclamationTriangle, label: "Report a problem", section: "info", path: "/pet-owner/settings/report" },
  ];

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Reusable Components
  const ProfileButton = ({ className = "" }) => (
    <button 
      onClick={() => navigate('/pet-owner/settings/profile')}
      className={`w-full flex items-center hover:bg-gray-50 rounded-2xl transition ${className}`}
    >
      <div className="w-12 h-12 lg:w-16 lg:h-16 rounded-full bg-primary text-white flex items-center justify-center font-semibold text-lg overflow-hidden shrink-0">
        {user?.profile_image_url ? (
          <DriveImage
            image={user.profile_image_url}
            alt={fullName}
            className="w-full h-full object-cover"
            fallbackIcon={false}
          />
        ) : (
          <span>{getInitials(fullName)}</span>
        )}
      </div>
      <div className="flex-1 text-left ml-3 lg:ml-4 min-w-0">
        <p className="font-semibold lg:text-lg truncate">{fullName}</p>
        <p className="text-sm text-gray-500 truncate">{user?.user_type?.replace(/_/g, " ").replace(/\b\w/g, c => c.toUpperCase())}</p>
      </div>
      <FaChevronRight className="text-gray-400 text-sm shrink-0 ml-2" />
    </button>
  );

  const PetCard = ({ pet, onClick, className = "" }) => (
    <button
      key={pet.pet_id}
      onClick={onClick}
      className={`hover:opacity-80 lg:hover:bg-gray-50 transition ${className}`}
    >
      <div className="w-full aspect-square lg:w-16 lg:h-16 lg:aspect-auto bg-gray-100 rounded-2xl lg:rounded-xl mb-4 lg:mb-0 flex items-center justify-center overflow-hidden shrink-0">
        {pet.profileURL?.link ? (
          <img
            src={pet.profileURL.link}
            alt={pet.name}
            className="w-full h-full object-cover rounded-2xl"
          />
        ) : (
          <span className="text-2xl font-bold text-gray-400">
            {pet.name.charAt(0)}
          </span>
        )}
      </div>
      <div className="flex items-center justify-center lg:justify-start gap-1 lg:gap-2 lg:flex-1 min-w-0">
        <span className="text-sm lg:text-base font-medium truncate">{pet.name}</span>
        {pet.gender === "male" ? (
          <FaMars className="text-blue-500 text-xs lg:text-sm shrink-0" />
        ) : (
          <FaVenus className="text-pink-500 text-xs lg:text-sm shrink-0" />
        )}
      </div>
      <FaChevronRight className="hidden lg:block text-gray-400 text-sm shrink-0" />
    </button>
  );

  const SettingsButton = ({ option }) => (
    <button 
      onClick={() => navigate(option.path)}
      className="w-full flex items-center justify-between py-3 px-2 lg:py-4 lg:px-4 hover:bg-gray-50 rounded-xl transition"
    >
      <div className="flex items-center gap-3 lg:gap-4">
        <option.icon className="text-gray-700 text-lg lg:text-xl" />
        <span className="text-sm lg:text-base">{option.label}</span>
      </div>
      <FaChevronRight className="text-gray-400 text-sm" />
    </button>
  );

  const otherSettings = settingsOptions.filter((opt) => opt.section === "other");
  const infoSettings = settingsOptions.filter((opt) => opt.section === "info");

  return (
    <main>
      <div className="min-h-screen bg-background">
        {/* Mobile & Tablet Layout */}
        <div className="lg:hidden">
          <div className="bg-white min-h-screen pb-20">
            {/* Header */}
            <div className="sticky top-0 flex items-center justify-between p-4 bg-white border-b border-gray-100 z-10">
              <div className="flex items-center gap-2">
                <button onClick={() => navigate(-1)} className="flex gap-2 items-center justify-center rounded-full hover:bg-gray-300 transition">
                  <FaChevronLeft className="text-gray-500" />
                  <span className="text-xl font-medium">Account Settings</span>
                </button>
              </div>
              <button className="p-2 hover:bg-gray-50 rounded-full transition">
                <FaSearch className="text-gray-600" />
              </button>
            </div>

            <div className="m-4">
              {/* Profile Section */}
              <div className="p-4 rounded-xl border border-gray-200 mb-4">
                <ProfileButton className="gap-3 p-2 -m-2" />
              </div>

              {/* My Pets Section */}
              <div className="p-4 rounded-xl border border-gray-200 mb-4">
                <div className="flex items-center justify-between mb-3">
                  <h2 className="font-semibold">My Pets</h2>
                  <button 
                    className="text-sm text-primary hover:underline"
                    onClick={() => navigate('/pet-owner/pets')}
                  >
                    See more <FaChevronRight className="inline text-xs" />
                  </button>
                </div>
                <div className="grid grid-cols-3 gap-3">
                  {pets.slice(0, 3).map((pet) => (
                    <PetCard 
                      key={pet.pet_id} 
                      pet={pet} 
                      onClick={() => navigate('/pet-owner/pets')}
                      className="text-center" 
                    />
                  ))}
                </div>
              </div>

              {/* Other Settings */}
              <div className="p-4 rounded-xl border border-gray-200 mb-4">
                <h2 className="font-semibold mb-3">Other settings</h2>
                <div className="space-y-1">
                  {otherSettings.map((option, idx) => (
                    <SettingsButton key={idx} option={option} />
                  ))}
                </div>
              </div>

              {/* Info Section */}
              <div className="p-4 rounded-xl border border-gray-200 mb-2">
                {infoSettings.map((option, idx) => (
                  <SettingsButton key={idx} option={option} />
                ))}
              </div>

              {/* Logout Button */}
              <button
                onClick={() => setShowLogoutModal(true)}
                className="w-full flex items-center justify-center gap-3 p-4 bg-primary text-white rounded-xl border border-red-200 hover:bg-red-100 transition"
              >
                <span className="font-medium">Logout</span>
              </button>
            </div>
          </div>
        </div>

        {/* Desktop Layout */}
        <div className="hidden lg:block">
          <Navbar />
          <div className="min-h-[79vh] max-w-7xl mx-auto pb-8 pt-4 px-4 sm:px-6">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Account Settings
              </h1>
              <p className="text-gray-600">
                View and manage account settings
              </p>
            </div>

            <div className="grid grid-cols-3 gap-6">
              {/* Left Column - Profile & Pets */}
              <div className="col-span-1 space-y-6">
                {/* Profile Card */}
                <div className="bg-white rounded-2xl p-6 border border-gray-200">
                  <ProfileButton className="gap-4 p-3 -m-3" />
                </div>

                {/* My Pets Card */}
                <div className="bg-white rounded-2xl p-6 border border-gray-200">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="font-semibold text-lg">My Pets</h2>
                    <button 
                      className="text-sm text-primary hover:underline shrink-0"
                      onClick={() => navigate("/pet-owner/pets")}
                    >
                      See more <FaChevronRight className="inline text-xs" />
                    </button>
                  </div>
                  <div className="space-y-2">
                    {pets.slice(0, 5).map((pet) => (
                      <PetCard 
                        key={pet.pet_id} 
                        pet={pet} 
                        onClick={() => navigate("/pet-owner/pets")}
                        className="w-full flex items-center gap-3 rounded-xl p-2"
                      />
                    ))}
                  </div>
                </div>

                
                {/* Logout Button */}
                <div className="max-w-7xl mx-auto px-4 sm:px-6 pb-8">
                  <button
                    onClick={() => setShowLogoutModal(true)}
                    className="w-full flex items-center justify-center gap-3 p-4 bg-primary text-white rounded-2xl border border-red-200 hover:bg-red-100 transition"
                  >
                    <span className="font-medium">Logout</span>
                  </button>
                </div>
              </div>

              {/* Right Column - Settings */}
              <div className="col-span-2 space-y-6">
                {/* Other Settings Card */}
                <div className="bg-white rounded-2xl p-6 border border-gray-200">
                  <h2 className="font-semibold text-lg mb-4">Other settings</h2>
                  <div className="space-y-2">
                    {otherSettings.map((option, idx) => (
                      <SettingsButton key={idx} option={option} />
                    ))}
                  </div>
                </div>

                {/* Info Card */}
                <div className="bg-white rounded-2xl p-6 border border-gray-200">
                  <div className="space-y-2">
                    {infoSettings.map((option, idx) => (
                      <SettingsButton key={idx} option={option} />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <Footer />
        </div>
      </div>

      {/* Logout Confirmation Modal */}
      <ConfirmationModal
        isOpen={showLogoutModal}
        onClose={() => setShowLogoutModal(false)}
        onConfirm={handleLogout}
        title="Logout"
        message="Are you sure you want to logout? You'll need to sign in again to access your account."
        confirmText="Yes, Logout"
        cancelText="Stay"
        type="danger"
      />
    </main>
  );
}
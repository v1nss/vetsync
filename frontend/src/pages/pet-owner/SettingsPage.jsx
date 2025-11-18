import { useState } from "react";
import {
  FaSearch,
  FaChevronRight,
  FaChevronLeft,
  FaBell,
  FaLock,
  FaPalette,
  FaInfoCircle,
  FaQuestionCircle,
  FaExclamationTriangle,
  FaHome,
  FaCalendarAlt,
  FaComments,
  FaCog,
  FaMars,
  FaVenus,
} from "react-icons/fa";
import Navbar from "../../components/Navbar";
import { useNavigate } from "react-router";

export default function SettingsPage() {
  const navigate = useNavigate();

  const [pets] = useState([
    { id: 1, name: "Max", image: "🐕", gender: "male" },
    { id: 2, name: "Mimi", image: "🐱", gender: "female" },
    { id: 3, name: "Bruno", image: "🐕", gender: "male" },
  ]);

  const settingsOptions = [
    { icon: FaBell, label: "Notifications", section: "other" },
    { icon: FaLock, label: "Security", section: "other" },
    { icon: FaPalette, label: "Appearance", section: "other" },
    { icon: FaInfoCircle, label: "About VetSync", section: "info" },
    { icon: FaQuestionCircle, label: "FAQs", section: "info" },
    { icon: FaExclamationTriangle, label: "Report a problem", section: "info" },
  ];

  return (
    <main>
      <div className="min-h-screen bg-background">
        {/* Mobile & Tablet Layout */}
        <div className="lg:hidden">
          <div className="bg-white min-h-screen pb-20">
            {/* Header */}
            <div className="sticky top-0 flex items-center justify-between p-4 bg-white border-b border-gray-100">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => navigate(-1)}
                  className="rounded-full hover:bg-gray-300 transition"
                >
                  <FaChevronLeft className="text-gray-500" />
                </button>
                <h1 className="text-xl font-medium">Account Settings</h1>
              </div>
              <button className="p-2 hover:bg-gray-50 rounded-full transition">
                <FaSearch className="text-gray-600" />
              </button>
            </div>

            <div className="m-4">
              {/* Profile Section */}
              <div className="p-4 rounded-xl border border-gray-200 mb-4">
                <button className="w-full flex items-center justify-between hover:bg-gray-50 rounded-2xl p-2 -m-2 transition">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-gray-200"></div>
                    <div className="text-left">
                      <p className="font-semibold">John Doe</p>
                      <p className="text-sm text-gray-500">Pet Owner</p>
                    </div>
                  </div>
                  <FaChevronRight className="text-gray-400 text-sm" />
                </button>
              </div>

              {/* My Pets Section */}
              <div className="p-4 rounded-xl border border-gray-200 mb-4">
                <div className="flex items-center justify-between mb-3">
                  <h2 className="font-semibold">My Pets</h2>
                  <button className="text-sm text-primary hover:underline"
                  onClick={() => navigate('/pets')}>
                    See more <FaChevronRight className="inline text-xs" />
                  </button>
                </div>
                <div className="grid grid-cols-3 gap-3">
                  {pets.map((pet) => (
                    <button
                      key={pet.id}
                      className="text-center hover:opacity-80 transition"
                    >
                      <div className="w-full aspect-square bg-gray-100 rounded-2xl mb-4 flex items-center justify-center">
                        <img src={pet.image} alt={pet.name} />
                      </div>
                      <div className="flex items-center justify-center gap-1">
                        <span className="text-sm font-medium">{pet.name}</span>
                        {pet.gender === "male" ? (
                          <FaMars className="text-blue-500 text-xs" />
                        ) : (
                          <FaVenus className="text-pink-500 text-xs" />
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Other Settings */}
              <div className="p-4 rounded-xl border border-gray-200 mb-4">
                <h2 className="font-semibold mb-3">Other settings</h2>
                <div className="space-y-1">
                  {settingsOptions
                    .filter((opt) => opt.section === "other")
                    .map((option, idx) => (
                      <button
                        key={idx}
                        className="w-full flex items-center justify-between py-3 px-2 hover:bg-gray-50 rounded-xl transition"
                      >
                        <div className="flex items-center gap-3">
                          <option.icon className="text-gray-700 text-lg" />
                          <span className="text-sm">{option.label}</span>
                        </div>
                        <FaChevronRight className="text-gray-400 text-sm" />
                      </button>
                    ))}
                </div>
              </div>

              {/* Info Section */}
              <div>
                <div className="p-4 rounded-xl border border-gray-200 mb-2">
                  {settingsOptions
                    .filter((opt) => opt.section === "info")
                    .map((option, idx) => (
                      <button
                        key={idx}
                        className="w-full flex items-center justify-between py-3 px-2 hover:bg-gray-50 rounded-xl transition"
                      >
                        <div className="flex items-center gap-3">
                          <option.icon className="text-gray-700 text-lg" />
                          <span className="text-sm">{option.label}</span>
                        </div>
                        <FaChevronRight className="text-gray-400 text-sm" />
                      </button>
                    ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Desktop Layout */}
        <div className="hidden lg:block">
          <Navbar />
          <div className="max-w-7xl mx-auto pb-8 pt-4 px-6">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Account Settings
              </h1>
              <p className="text-gray-600">
                View and manage account settings
              </p>
            </div>
            {/* <div className="flex items-center justify-between mb-8">
              <h1 className="text-3xl font-semibold">Account Settings</h1>
              <button className="p-3 hover:bg-gray-100 rounded-full transition">
                <FaSearch className="text-gray-600 text-xl" />
              </button>
            </div> */}

            <div className="grid grid-cols-3 gap-6">
              {/* Left Column - Profile & Pets */}
              <div className="col-span-1 space-y-6">
                {/* Profile Card */}
                <div className="bg-white rounded-2xl p-6 border border-gray-200">
                  <button className="w-full flex items-center gap-4 hover:bg-gray-50 rounded-2xl p-3 -m-3 transition">
                    <div className="w-16 h-16 rounded-full bg-gray-200"></div>
                    <div className="flex-1 text-left">
                      <p className="font-semibold text-lg">John Doe</p>
                      <p className="text-sm text-gray-500">Pet Owner</p>
                    </div>
                    <FaChevronRight className="text-gray-400" />
                  </button>
                </div>

                {/* My Pets Card */}
                <div className="bg-white rounded-2xl p-6 border border-gray-200">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="font-semibold text-lg">My Pets</h2>
                    <button className="text-sm text-primary hover:underline"
                      onClick={() => navigate("/pets")}
                    >
                      See more <FaChevronRight className="inline text-xs" />
                    </button>
                  </div>
                  <div className="space-y-2">
                    {pets.map((pet) => (
                      <button
                        key={pet.id}
                        className="w-full flex items-center gap-3 hover:bg-gray-50 rounded-xl p-2 transition"
                        onClick={() => navigate("/pets")}
                      >
                        <div className="w-16 h-16 bg-gray-100 rounded-xl flex items-center justify-center">
                          <img src={pet.image} alt={pet.name} />
                        </div>
                        <div className="flex-1 text-left">
                          <div className="flex items-center gap-2">
                            <span className="font-medium">{pet.name}</span>
                            {pet.gender === "male" ? (
                              <FaMars className="text-blue-500 text-sm" />
                            ) : (
                              <FaVenus className="text-pink-500 text-sm" />
                            )}
                          </div>
                        </div>
                        <FaChevronRight className="text-gray-400 text-sm" />
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right Column - Settings */}
              <div className="col-span-2 space-y-6">
                {/* Other Settings Card */}
                <div className="bg-white rounded-2xl p-6 border border-gray-200">
                  <h2 className="font-semibold text-lg mb-4">Other settings</h2>
                  <div className="space-y-2">
                    {settingsOptions
                      .filter((opt) => opt.section === "other")
                      .map((option, idx) => (
                        <button
                          key={idx}
                          className="w-full flex items-center justify-between py-4 px-4 hover:bg-gray-50 rounded-xl transition"
                        >
                          <div className="flex items-center gap-4">
                            <option.icon className="text-gray-700 text-xl" />
                            <span>{option.label}</span>
                          </div>
                          <FaChevronRight className="text-gray-400" />
                        </button>
                      ))}
                  </div>
                </div>

                {/* Info Card */}
                <div className="bg-white rounded-2xl p-6 border border-gray-200">
                  <div className="space-y-2">
                    {settingsOptions
                      .filter((opt) => opt.section === "info")
                      .map((option, idx) => (
                        <button
                          key={idx}
                          className="w-full flex items-center justify-between py-4 px-4 hover:bg-gray-50 rounded-xl transition"
                        >
                          <div className="flex items-center gap-4">
                            <option.icon className="text-gray-700 text-xl" />
                            <span>{option.label}</span>
                          </div>
                          <FaChevronRight className="text-gray-400" />
                        </button>
                      ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

import { useState } from 'react';
import { FaChevronLeft, FaSun, FaMoon, FaDesktop, FaCheck } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../../components/Navbar';
import Footer from '../../../components/Footer';

const ThemeOption = ({ icon: Icon, title, description, isSelected, onClick }) => (
  <button
    onClick={onClick}
    className={`w-full p-4 rounded-2xl border-2 transition ${
      isSelected 
        ? 'border-primary bg-primary/5' 
        : 'border-gray-200 hover:border-gray-300'
    }`}
  >
    <div className="flex items-start gap-4">
      <div className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 ${
        isSelected ? 'bg-primary text-white' : 'bg-gray-100 text-gray-600'
      }`}>
        <Icon className="text-xl" />
      </div>
      <div className="flex-1 text-left">
        <div className="flex items-center justify-between mb-1">
          <h3 className="font-semibold text-gray-900">{title}</h3>
          {isSelected && <FaCheck className="text-primary" />}
        </div>
        <p className="text-sm text-gray-500">{description}</p>
      </div>
    </div>
  </button>
);

export default function AppearanceSettingsPage() {
  const navigate = useNavigate();
  const [selectedTheme, setSelectedTheme] = useState('light');

  const themeOptions = [
    {
      icon: FaSun,
      value: 'light',
      title: 'Light Mode',
      description: 'Bright and clear interface for daytime use'
    },
    {
      icon: FaMoon,
      value: 'dark',
      title: 'Dark Mode',
      description: 'Easy on the eyes in low-light conditions'
    },
    {
      icon: FaDesktop,
      value: 'system',
      title: 'System Default',
      description: 'Automatically match your device settings'
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Mobile Layout */}
      <div className="lg:hidden">
        <div className="bg-white min-h-screen pb-20">
          <div className="sticky top-0 p-4 z-10 flex items-center gap-2 bg-white border-b border-gray-100">
            <button onClick={() => navigate(-1)} className="flex gap-2 items-center justify-center rounded-full hover:bg-gray-300 transition">
              <FaChevronLeft className="text-gray-500" />
              <span className="text-xl font-medium">Appearance</span>
            </button>
          </div>

          <div className="p-4 space-y-6">
            {/* Theme Section */}
            <div>
              <h2 className="font-semibold text-lg mb-4">Theme</h2>
              <div className="space-y-3">
                {themeOptions.map((option) => (
                  <ThemeOption
                    key={option.value}
                    icon={option.icon}
                    title={option.title}
                    description={option.description}
                    isSelected={selectedTheme === option.value}
                    onClick={() => setSelectedTheme(option.value)}
                  />
                ))}
              </div>
            </div>
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
              <h1 className="text-2xl font-medium">Appearance</h1>
            </button>
          </div>

          <div className="space-y-6">
            {/* Theme Section */}
            <div className="bg-white rounded-2xl p-6 border border-gray-200">
              <h2 className="font-semibold text-lg mb-4">Theme</h2>
              <div className="space-y-3">
                {themeOptions.map((option) => (
                  <ThemeOption
                    key={option.value}
                    icon={option.icon}
                    title={option.title}
                    description={option.description}
                    isSelected={selectedTheme === option.value}
                    onClick={() => setSelectedTheme(option.value)}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    </div>
  );
}
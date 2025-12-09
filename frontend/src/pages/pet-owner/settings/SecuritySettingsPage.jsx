import { useState } from 'react';
import { FaChevronLeft, FaKey, FaShieldAlt, FaMobileAlt, FaHistory, FaCheckCircle, FaTimes, FaExclamationCircle } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../../components/Navbar';
import Footer from '../../../components/Footer';
import NotificationModal from '../../../components/NotificationModal';

const ToggleSwitch = ({ enabled, onChange }) => (
  <button
    onClick={onChange}
    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
      enabled ? 'bg-primary' : 'bg-gray-300'
    }`}
  >
    <span
      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
        enabled ? 'translate-x-6' : 'translate-x-1'
      }`}
    />
  </button>
);

const SecurityOption = ({ icon: Icon, title, description, onClick, showToggle, toggleValue, onToggle }) => (
  <button
    onClick={onClick}
    className="w-full flex items-center justify-between py-4 px-4 hover:bg-gray-50 rounded-xl transition"
  >
    <div className="flex items-start gap-4 flex-1 text-left">
      <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center shrink-0">
        <Icon className="text-primary text-lg" />
      </div>
      <div className="flex-1 min-w-0">
        <h3 className="font-medium text-gray-900 mb-1">{title}</h3>
        <p className="text-sm text-gray-500">{description}</p>
      </div>
    </div>
    {showToggle ? (
      <ToggleSwitch enabled={toggleValue} onChange={(e) => { e.stopPropagation(); onToggle(); }} />
    ) : (
      <FaChevronLeft className="text-gray-400 text-sm rotate-180 shrink-0 ml-2" />
    )}
  </button>
);

export default function SecuritySettingsPage() {
  const navigate = useNavigate();
  const [notification, setNotification] = useState({ isOpen: false, type: 'success', title: '', message: '' });
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);

  const showNotification = (type, title, message) => {
    setNotification({ isOpen: true, type, title, message });
  };

  const handleChangePassword = () => {
    // Navigate to change password page or show modal
    showNotification('success', 'Coming Soon', 'Password change functionality will be available soon.');
  };

  const handleTwoFactorToggle = () => {
    setTwoFactorEnabled(!twoFactorEnabled);
    showNotification(
      'success', 
      twoFactorEnabled ? 'Two-Factor Authentication Disabled' : 'Two-Factor Authentication Enabled',
      twoFactorEnabled 
        ? 'Your account is now less secure. We recommend enabling 2FA for better protection.' 
        : 'Your account is now more secure with two-factor authentication.'
    );
  };

  const handleManageDevices = () => {
    showNotification('success', 'Coming Soon', 'Device management functionality will be available soon.');
  };

  const handleLoginHistory = () => {
    showNotification('success', 'Coming Soon', 'Login history will be available soon.');
  };

  const securityOptions = [
    {
      icon: FaKey,
      title: 'Change Password',
      description: 'Update your password regularly for better security',
      onClick: handleChangePassword,
      showToggle: false
    },
    {
      icon: FaShieldAlt,
      title: 'Two-Factor Authentication',
      description: 'Add an extra layer of security to your account',
      onClick: () => {},
      showToggle: true,
      toggleValue: twoFactorEnabled,
      onToggle: handleTwoFactorToggle
    },
    {
      icon: FaMobileAlt,
      title: 'Manage Devices',
      description: 'View and manage devices that have access to your account',
      onClick: handleManageDevices,
      showToggle: false
    },
    {
      icon: FaHistory,
      title: 'Login History',
      description: 'Review recent login activity on your account',
      onClick: handleLoginHistory,
      showToggle: false
    }
  ];

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
                <span className="text-xl font-medium">Security</span>
              </button>
            </div>

            <div className="p-4">
              <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4 mb-6">
                <div className="flex gap-3">
                  <FaShieldAlt className="text-blue-600 text-xl shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-semibold text-blue-900 mb-1">Keep Your Account Safe</h3>
                    <p className="text-sm text-blue-700">
                      Enable two-factor authentication and regularly update your password to protect your account.
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl border border-gray-200">
                {securityOptions.map((option, idx) => (
                  <SecurityOption key={idx} {...option} />
                ))}
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
                <h1 className="text-2xl font-medium">Security</h1>
              </button>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-2xl p-6 mb-6">
              <div className="flex gap-4">
                <FaShieldAlt className="text-blue-600 text-2xl shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-blue-900 mb-2 text-lg">Keep Your Account Safe</h3>
                  <p className="text-blue-700">
                    Enable two-factor authentication and regularly update your password to protect your account from unauthorized access.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 border border-gray-200">
              {securityOptions.map((option, idx) => (
                <SecurityOption key={idx} {...option} />
              ))}
            </div>
          </div>
          <Footer />
        </div>
      </div>
    </>
  );
}
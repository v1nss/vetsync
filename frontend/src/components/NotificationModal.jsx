
import { FaCheckCircle, FaTimes, FaExclamationCircle, FaInfoCircle, FaExclamationTriangle } from "react-icons/fa";

export default function NotificationModal({ isOpen, onClose, type = 'success', title, message, buttonText = 'Close' }) {
  if (!isOpen) return null;

  const config = {
    success: {
      icon: FaCheckCircle,
      iconBg: 'bg-green-100',
      iconColor: 'text-green-500',
      buttonColor: 'bg-green-600 hover:bg-green-700',
      defaultTitle: 'Success!'
    },
    error: {
      icon: FaExclamationCircle,
      iconBg: 'bg-red-100',
      iconColor: 'text-red-500',
      buttonColor: 'bg-red-600 hover:bg-red-700',
      defaultTitle: 'Error'
    },
    warning: {
      icon: FaExclamationTriangle,
      iconBg: 'bg-yellow-100',
      iconColor: 'text-yellow-500',
      buttonColor: 'bg-yellow-600 hover:bg-yellow-700',
      defaultTitle: 'Warning'
    },
    info: {
      icon: FaInfoCircle,
      iconBg: 'bg-blue-100',
      iconColor: 'text-blue-500',
      buttonColor: 'bg-blue-600 hover:bg-blue-700',
      defaultTitle: 'Information'
    }
  };

  const currentConfig = config[type];
  const Icon = currentConfig.icon;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl p-8 max-w-md w-full relative animate-scale-in">
        <button 
          onClick={onClose} 
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition"
        >
          <FaTimes className="text-xl" />
        </button>
        
        <div className="text-center">
          <div className={`w-16 h-16 ${currentConfig.iconBg} rounded-full flex items-center justify-center mx-auto mb-4`}>
            <Icon className={`text-4xl ${currentConfig.iconColor}`} />
          </div>
          
          <h2 className="text-2xl font-semibold mb-2">
            {title || currentConfig.defaultTitle}
          </h2>
          
          <p className="text-gray-600 mb-6">
            {message}
          </p>
          
          <button 
            onClick={onClose}
            className={`w-full ${currentConfig.buttonColor} text-white py-3 rounded-2xl transition`}
          >
            {buttonText}
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
  );
}
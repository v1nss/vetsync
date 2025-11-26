import { FaExclamationTriangle, FaTimes } from "react-icons/fa";

export default function ConfirmationModal({ 
  isOpen, 
  onClose, 
  onConfirm, 
  title = "Are you sure?", 
  message, 
  confirmText = "Confirm",
  cancelText = "Cancel",
  type = "danger" // danger, warning, info
}) {
  if (!isOpen) return null;

  const config = {
    danger: {
      iconBg: 'bg-red-100',
      iconColor: 'text-red-500',
      confirmButton: 'bg-red-600 hover:bg-red-700'
    },
    warning: {
      iconBg: 'bg-yellow-100',
      iconColor: 'text-yellow-500',
      confirmButton: 'bg-yellow-600 hover:bg-yellow-700'
    },
    info: {
      iconBg: 'bg-blue-100',
      iconColor: 'text-blue-500',
      confirmButton: 'bg-blue-600 hover:bg-blue-700'
    }
  };

  const currentConfig = config[type];

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-60 p-4">
      <div className="bg-white rounded-2xl p-8 max-w-md w-full relative animate-scale-in">
        <button 
          onClick={onClose} 
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition"
        >
          <FaTimes className="text-xl" />
        </button>
        
        <div className="text-center">
          <div className={`w-16 h-16 ${currentConfig.iconBg} rounded-full flex items-center justify-center mx-auto mb-4`}>
            <FaExclamationTriangle className={`text-4xl ${currentConfig.iconColor}`} />
          </div>
          
          <h2 className="text-2xl font-semibold mb-2">
            {title}
          </h2>
          
          <p className="text-gray-600 mb-6">
            {message}
          </p>
          
          <div className="flex gap-3">
            <button 
              onClick={onClose}
              className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-2xl hover:bg-gray-300 transition font-medium"
            >
              {cancelText}
            </button>
            <button 
              onClick={() => {
                onConfirm();
                onClose();
              }}
              className={`flex-1 ${currentConfig.confirmButton} text-white py-3 rounded-2xl transition font-medium`}
            >
              {confirmText}
            </button>
          </div>
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
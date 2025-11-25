import { FaCheckCircle, FaTimes } from "react-icons/fa";

export default function SuccessModal({ isOpen, onClose, userType }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl p-8 max-w-md w-full relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
          <FaTimes className="text-xl" />
        </button>
        
        <div className="text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <FaCheckCircle className="text-4xl text-green-500" />
          </div>
          
          <h2 className="text-2xl font-semibold mb-2">Registration Successful! 🎉</h2>
          
          <p className="text-gray-600 mb-4">
            {userType === "clinic_admin" 
              ? "Your account has been created. Let's set up your clinic details next."
              : "Welcome to VetSync! Your account has been created successfully."}
          </p>
          
          <button onClick={onClose}
            className="w-full bg-primary text-white py-3 rounded-2xl hover:bg-[#FEA08E] transition">
            {userType === "clinic_admin" ? "Continue to Clinic Setup" : "Go to Dashboard"}
          </button>
        </div>
      </div>
    </div>
  );
}
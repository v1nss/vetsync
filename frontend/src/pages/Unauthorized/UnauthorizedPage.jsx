import { useNavigate } from "react-router-dom";
import { FaExclamationTriangle, FaHome, FaArrowLeft } from "react-icons/fa";

export default function UnauthorizedPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="max-w-md w-full text-center">
        {/* Illustration/Image */}
        <div className="mb-8">
          <img 
            src="/pets-hero-section.png" 
            alt="Unauthorized Access" 
            className="w-auto h-64 mx-auto"
            onError={(e) => {
              e.target.style.display = 'none';
              e.target.nextElementSibling.style.display = 'flex';
            }}
          />
          {/* Fallback Icon */}
          <div className="hidden w-64 h-64 mx-auto items-center justify-center bg-red-50 rounded-full">
            <FaExclamationTriangle className="text-red-500 text-8xl" />
          </div>
        </div>

        {/* Content */}
        <div className="bg-white rounded-2xl p-8 shadow-lg">
          <h1 className="text-3xl font-bold text-gray-800 mb-3">
            Access Denied
          </h1>
          <p className="text-gray-600 mb-2">
            You don't have permission to access this page.
          </p>
          <p className="text-sm text-gray-500 mb-8">
            This area is restricted to authorized users only. Please contact your administrator if you believe this is an error.
          </p>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center justify-center gap-2 px-6 py-3 border border-gray-300 text-gray-700 rounded-2xl hover:bg-gray-50 transition"
            >
              <FaArrowLeft />
              <span>Go Back</span>
            </button>
            <button
              onClick={() => navigate("/")}
              className="flex items-center justify-center gap-2 px-6 py-3 bg-primary text-white rounded-2xl hover:bg-[#FEA08E] transition"
            >
              <FaHome />
              <span>Go Home</span>
            </button>
          </div>
        </div>

        {/* Additional Help Text */}
        <p className="text-sm text-gray-500 mt-6">
          Error Code: 403 - Forbidden
        </p>
      </div>
    </div>
  );
}
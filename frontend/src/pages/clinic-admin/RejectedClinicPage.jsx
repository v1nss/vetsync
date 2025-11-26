import { useState, useEffect, useContext } from 'react';
import { useNavigate, } from 'react-router-dom';
import { FaTimesCircle, FaEdit, FaExclamationTriangle } from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext';
import { fetchMyClinic } from '../../global/api/clinicAdmin';
import ClinicAdminNavbar from '../../components/ClinicAdminNavbar';
import { ClinicStatusContext } from '../../context/ClinicStatusContext';

export default function RejectedClinicPage() {
  const navigate = useNavigate();
  const { clinic, isRejected } = useContext(ClinicStatusContext);
  const { user } = useAuth();
  // const [clinic, setClinic] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isRejected) {
      navigate('/');
    }
  }, [isRejected, navigate]);
  // useEffect(() => {
  //   fetchClinicDetails();
  // }, []);

  // const fetchClinicDetails = async () => {
  //   try {
  //     const response = await fetchMyClinic(); // No parameters needed
  //     setClinic(response);
  //   } catch (error) {
  //     console.error('Error fetching clinic:', error);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

// if (clinic) setLoading(false);

const handleEditClinic = () => {
  // Use absolute path starting with /
  navigate('/clinic-admin/clinic/edit', { 
    state: { 
      clinic: clinic,
      isResubmission: true 
    } 
  });
};

  // if (loading) {
  //   return (
  //     <div className="min-h-screen bg-gray-50 flex flex-col">
  //       <ClinicAdminNavbar />
  //       <main className="flex-1 flex items-center justify-center">
  //         <div className="text-gray-600">Loading...</div>
  //       </main>
  //     </div>
  //   );
  // }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <ClinicAdminNavbar />

      <main className="flex-1 flex flex-col items-center justify-center text-center px-6 py-12">
        <div className="bg-white rounded-2xl shadow-lg p-8 max-w-2xl w-full border border-red-200">
          <div className="flex justify-center mb-4">
            <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center">
              <FaTimesCircle className="text-red-600 text-5xl" />
            </div>
          </div>

          <h1 className="text-2xl font-bold text-gray-800 mb-2">
            Clinic Registration Rejected
          </h1>
          <p className="text-gray-600 mb-6">
            Unfortunately, your clinic registration could not be approved at this time.
            Please review the feedback below and resubmit your application.
          </p>

          {/* Rejection Remarks */}
          <div className="bg-red-50 border border-red-200 rounded-xl p-5 mb-6 text-left">
            <div className="flex items-start gap-3 mb-3">
              <FaExclamationTriangle className="text-red-600 text-xl mt-1 shrink-0" />
              <div className="flex-1">
                <h3 className="font-semibold text-red-800 mb-2">
                  Reason for Rejection
                </h3>
                <p className="text-red-700 text-sm leading-relaxed whitespace-pre-wrap">
                  {clinic?.rejection_remarks || 'No specific remarks provided. Please contact support for more information.'}
                </p>
              </div>
            </div>
          </div>

          {/* Clinic Info Summary */}
          <div className="bg-gray-50 rounded-xl p-5 mb-6 text-left">
            <h3 className="font-semibold text-gray-800 mb-3">Your Submitted Information</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Clinic Name:</span>
                <span className="font-medium text-gray-900">{clinic?.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Address:</span>
                <span className="font-medium text-gray-900 text-right max-w-xs">{clinic?.address}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Contact:</span>
                <span className="font-medium text-gray-900">{clinic?.contact_number}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Email:</span>
                <span className="font-medium text-gray-900">{clinic?.email}</span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={handleEditClinic}
              className="flex-1 bg-primary text-white px-6 py-3 rounded-xl hover:bg-[#FEA08E] transition font-medium flex items-center justify-center gap-2"
            >
              <FaEdit />
              Edit & Resubmit Application
            </button>
            <button
              onClick={() => navigate('/contact-support')}
              className="flex-1 bg-white border border-gray-300 text-gray-700 px-6 py-3 rounded-xl hover:bg-gray-50 transition font-medium"
            >
              Contact Support
            </button>
          </div>

          {/* Help Text */}
          <div className="mt-6 text-sm text-gray-500">
            <p>Need help? Our support team is here to assist you.</p>
            <p className="mt-1">Email: <a href="mailto:support@vetsync.com" className="text-primary hover:underline">support@vetsync.com</a></p>
          </div>
        </div>

        <footer className="mt-10 text-gray-500 text-sm">
          © {new Date().getFullYear()} VetSync — All Rights Reserved
        </footer>
      </main>
    </div>
  );
}
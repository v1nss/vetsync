import React, {useEffect} from 'react';
import { FaClock } from 'react-icons/fa';
import ClinicAdminNavbar from '../../components/ClinicAdminNavbar';
import {ClinicStatusContext} from '../../context/ClinicStatusContext';
import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';


export default function PendingClinicPage() {
  const navigate = useNavigate();
  const { isPending } = useContext(ClinicStatusContext);
  console.log("Clinic pending status:", isPending);

   useEffect(() => {
    if (!isPending) {
      navigate('/');
    }
  }, [isPending, navigate]);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <ClinicAdminNavbar />

      <main className="flex-1 flex flex-col items-center justify-center text-center px-6">
        <div className="bg-white rounded-2xl shadow-lg p-8 max-w-lg border border-gray-200">
          <div className="flex justify-center mb-4">
            <FaClock className="text-yellow-500 text-5xl" />
          </div>

          <h1 className="text-2xl font-bold text-gray-800 mb-2">
            Clinic Registration Pending
          </h1>
          <p className="text-gray-600 mb-6">
            Your clinic registration is currently under review.  
            Once approved, you’ll receive an email notification and full access to the system.
          </p>

          <div className="bg-yellow-50 border border-yellow-200 text-yellow-700 px-4 py-3 rounded-lg text-sm">
            Thank you for your patience! This process usually takes 1–2 business days.
          </div>
        </div>

        <footer className="mt-10 text-gray-500 text-sm">
          © {new Date().getFullYear()} VetSync — All Rights Reserved
        </footer>
      </main>
    </div>
  );
}

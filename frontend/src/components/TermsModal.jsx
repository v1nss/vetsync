import { FaTimes } from "react-icons/fa";

export default function TermsModal({ isOpen, onClose, onAccept }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] flex flex-col">
        {/* Modal Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h3 className="text-2xl font-bold text-gray-800">
            Terms and Conditions
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors p-1"
          >
            <FaTimes className="h-5 w-5" />
          </button>
        </div>

        {/* Modal Content - Scrollable */}
        <div className="overflow-y-auto p-6 flex-1">
          <div className="space-y-4 text-sm">
            <p className="text-gray-700">
              Welcome to our web-based platform designed to provide a centralized and unified listing of veterinary clinics across Parañaque City. By creating an account, logging in, or continuing to use this system, you acknowledge and agree to the following Terms and Conditions regarding data collection, security, and your responsibilities as a user.
            </p>

            <div>
              <h4 className="text-base font-semibold text-gray-800 mb-2">
                1. Purpose of Data Collection
              </h4>
              <p className="text-gray-700 mb-2">
                We collect and process user information solely for the following purposes:
              </p>
              <ul className="list-disc pl-6 text-gray-700 space-y-1">
                <li>To create and manage user accounts for secure access to the system</li>
                <li>To facilitate appointment scheduling, service inquiries, and related transactions</li>
                <li>To improve system functionality, accuracy, and user experience</li>
                <li>To maintain service reliability and prevent misuse of the platform</li>
              </ul>
              <p className="text-gray-700 mt-2">
                No data will be collected beyond what is required for these purposes.
              </p>
            </div>

            <div>
              <h4 className="text-base font-semibold text-gray-800 mb-2">
                2. Types of Data Collected
              </h4>
              <p className="text-gray-700 mb-2">
                Upon registration or use of the system, the following information may be gathered:
              </p>
              <ul className="list-disc pl-6 text-gray-700 space-y-1">
                <li><strong>Personal Information:</strong> Full name, email address, contact number, and login details</li>
                <li><strong>Usage Information:</strong> Login activity, pages accessed, and system interactions</li>
                <li><strong>Optional Information:</strong> Details voluntarily provided during appointments or inquiries</li>
              </ul>
              <p className="text-gray-700 mt-2">
                All collected data will be processed in accordance with applicable privacy laws.
              </p>
            </div>

            <div>
              <h4 className="text-base font-semibold text-gray-800 mb-2">
                3. Data Security Measures
              </h4>
              <p className="text-gray-700 mb-2">
                We implement technical, administrative, and physical safeguards to protect your data, including but not limited to:
              </p>
              <ul className="list-disc pl-6 text-gray-700 space-y-1">
                <li>Encrypted data transmission (HTTPS)</li>
                <li>Secure password hashing</li>
                <li>Regular security audits and system updates</li>
                <li>Access controls ensuring only authorized personnel may handle sensitive data</li>
                <li>Continuous monitoring for unauthorized access or suspicious activity</li>
              </ul>
              <p className="text-gray-700 mt-2">
                Despite these measures, no system can guarantee absolute security, and by using this platform, you acknowledge that data transmission over the internet carries inherent risks.
              </p>
            </div>

            <div>
              <h4 className="text-base font-semibold text-gray-800 mb-2">
                4. User Responsibilities
              </h4>
              <p className="text-gray-700 mb-2">
                To help maintain the security of your information and the platform:
              </p>
              <ul className="list-disc pl-6 text-gray-700 space-y-1">
                <li>You must keep your login details confidential.</li>
                <li>You agree not to share your account with others.</li>
                <li>You are responsible for all activities performed under your account.</li>
                <li>You agree not to attempt unauthorized access, system disruption, or data manipulation.</li>
                <li>If you suspect any unauthorized use of your account, you must notify us immediately.</li>
              </ul>
            </div>

            <div>
              <h4 className="text-base font-semibold text-gray-800 mb-2">
                5. Data Sharing and Disclosure
              </h4>
              <p className="text-gray-700 mb-2">
                Your data may be shared only under the following conditions:
              </p>
              <ul className="list-disc pl-6 text-gray-700 space-y-1">
                <li>With veterinary clinics you choose to contact or interact with through the platform</li>
                <li>With system administrators for maintenance or support purposes</li>
                <li>If required by law, legal process, or government request</li>
              </ul>
              <p className="text-gray-700 mt-2">
                We do not sell, trade, or rent personal information to third parties.
              </p>
            </div>

            <div>
              <h4 className="text-base font-semibold text-gray-800 mb-2">
                6. User Consent
              </h4>
              <p className="text-gray-700 mb-2">
                By creating an account or continuing to use the platform, you:
              </p>
              <ul className="list-disc pl-6 text-gray-700 space-y-1">
                <li>Consent to the collection and processing of your data as described above</li>
                <li>Agree to comply with all system policies and guidelines</li>
                <li>Understand that your use of the platform is voluntary</li>
              </ul>
              <p className="text-gray-700 mt-2">
                If you do not agree with these Terms and Conditions, you must discontinue using the system.
              </p>
            </div>

            <div>
              <h4 className="text-base font-semibold text-gray-800 mb-2">
                7. Updates to This Policy
              </h4>
              <p className="text-gray-700">
                We may revise or update these Terms and Conditions from time to time. Changes will take effect immediately upon posting. Users will be notified of significant updates.
              </p>
            </div>

            <div>
              <h4 className="text-base font-semibold text-gray-800 mb-2">
                8. Contact Information
              </h4>
              <p className="text-gray-700">
                For concerns, questions, or requests regarding your data privacy, you may contact us at:{' '}
                <a 
                  href="mailto:vetsync.business@gmail.com" 
                  className="text-primary hover:underline font-medium"
                >
                  vetsync.business@gmail.com
                </a>
              </p>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="flex items-center rounded-b-2xl justify-end gap-3 p-6 border-t border-gray-200 bg-gray-50">
          <button
            onClick={onClose}
            className="px-5 py-2 text-gray-700 hover:text-gray-900 font-medium transition rounded-2xl hover:bg-gray-200"
          >
            Close
          </button>
          {onAccept && (
            <button
              onClick={onAccept}
              className="px-6 py-2 bg-primary text-white rounded-2xl hover:bg-[#FEA08E] transition font-medium"
            >
              I Accept
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
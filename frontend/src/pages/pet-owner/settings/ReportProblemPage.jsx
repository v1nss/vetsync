import { useState } from 'react';
import { FaChevronLeft, FaCheckCircle, FaTimes, FaExclamationCircle, FaPaperclip } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../../components/Navbar';
import Footer from '../../../components/Footer';
import NotificationModal from '../../../components/NotificationModal';

const CategoryButton = ({ label, isSelected, onClick }) => (
  <button
    onClick={onClick}
    className={`px-4 py-2 rounded-full transition text-sm ${
      isSelected
        ? 'bg-primary text-white'
        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
    }`}
  >
    {label}
  </button>
);

export default function ReportProblemPage() {
  const navigate = useNavigate();
  const [notification, setNotification] = useState({ isOpen: false, type: 'success', title: '', message: '' });
  
  const [formData, setFormData] = useState({
    category: '',
    subject: '',
    description: '',
    email: '',
  });

  const [attachments, setAttachments] = useState([]);

  const categories = [
    'Technical Issue',
    'Account Problem',
    'Billing Issue',
    'Appointment Error',
    'Feature Request',
    'Other'
  ];

  const showNotification = (type, title, message) => {
    setNotification({ isOpen: true, type, title, message });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setAttachments(prev => [...prev, ...files]);
  };

  const removeAttachment = (index) => {
    setAttachments(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.category || !formData.subject || !formData.description) {
      showNotification('error', 'Missing Information', 'Please fill in all required fields.');
      return;
    }

    try {
      // API call would go here
      // await submitReport(formData, attachments);
      
      showNotification(
        'success',
        'Report Submitted!',
        'Thank you for your report. Our support team will review it and get back to you within 24-48 hours.'
      );

      // Reset form
      setFormData({ category: '', subject: '', description: '', email: '' });
      setAttachments([]);
    } catch (err) {
      showNotification('error', 'Submission Failed', 'An error occurred while submitting your report. Please try again.');
    }
  };

  return (
    <>
      <NotificationModal
        isOpen={notification.isOpen}
        onClose={() => {
          setNotification({ ...notification, isOpen: false });
          if (notification.type === 'success') {
            navigate(-1);
          }
        }}
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
                <span className="text-xl font-medium">Report a problem</span>
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-4 space-y-6">
              {/* Category Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Category <span className="text-red-500">*</span>
                </label>
                <div className="flex flex-wrap gap-2">
                  {categories.map((cat) => (
                    <CategoryButton
                      key={cat}
                      label={cat}
                      isSelected={formData.category === cat}
                      onClick={() => setFormData(prev => ({ ...prev, category: cat }))}
                    />
                  ))}
                </div>
              </div>

              {/* Subject */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Subject <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  placeholder="Brief description of the problem"
                  className="w-full px-4 py-3 border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description <span className="text-red-500">*</span>
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows={6}
                  placeholder="Please provide detailed information about the problem you're experiencing..."
                  className="w-full px-4 py-3 border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Contact Email (Optional)
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="your@email.com"
                  className="w-full px-4 py-3 border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary"
                />
                <p className="text-xs text-gray-500 mt-2">
                  We'll use your account email by default if not provided
                </p>
              </div>

              {/* Attachments */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Attachments (Optional)
                </label>
                <input
                  type="file"
                  multiple
                  accept="image/*,.pdf"
                  onChange={handleFileChange}
                  className="hidden"
                  id="attachments"
                />
                <label
                  htmlFor="attachments"
                  className="flex items-center justify-center gap-2 w-full px-4 py-3 border-2 border-dashed border-gray-300 rounded-2xl hover:border-primary transition cursor-pointer"
                >
                  <FaPaperclip className="text-gray-400" />
                  <span className="text-sm text-gray-600">Add screenshots or files</span>
                </label>

                {attachments.length > 0 && (
                  <div className="mt-3 space-y-2">
                    {attachments.map((file, idx) => (
                      <div key={idx} className="flex items-center justify-between p-2 bg-gray-50 rounded-xl">
                        <span className="text-sm text-gray-700 truncate flex-1">{file.name}</span>
                        <button
                          type="button"
                          onClick={() => removeAttachment(idx)}
                          className="text-red-500 hover:text-red-700 ml-2"
                        >
                          <FaTimes />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </form>

            <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 p-4 flex gap-3">
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-2xl hover:bg-gray-50 transition"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSubmit}
                className="flex-1 px-4 py-3 bg-primary text-white rounded-2xl hover:bg-[#FEA08E] transition"
              >
                Submit Report
              </button>
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
                <h1 className="text-2xl font-medium">Report a problem</h1>
              </button>
            </div>

            <div className="bg-white rounded-2xl p-8 border border-gray-200">
              <p className="text-gray-600 mb-6">
                Help us improve VetSync by reporting any issues you encounter. Our support team will investigate and respond as soon as possible.
              </p>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Category <span className="text-red-500">*</span>
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {categories.map((cat) => (
                      <CategoryButton
                        key={cat}
                        label={cat}
                        isSelected={formData.category === cat}
                        onClick={() => setFormData(prev => ({ ...prev, category: cat }))}
                      />
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Subject <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    placeholder="Brief description of the problem"
                    className="w-full px-4 py-3 border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows={8}
                    placeholder="Please provide detailed information about the problem you're experiencing..."
                    className="w-full px-4 py-3 border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Contact Email (Optional)
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="your@email.com"
                    className="w-full px-4 py-3 border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                  <p className="text-xs text-gray-500 mt-2">
                    We'll use your account email by default if not provided
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Attachments (Optional)
                  </label>
                  <input
                    type="file"
                    multiple
                    accept="image/*,.pdf"
                    onChange={handleFileChange}
                    className="hidden"
                    id="attachmentsDesktop"
                  />
                  <label
                    htmlFor="attachmentsDesktop"
                    className="flex items-center justify-center gap-2 w-full px-4 py-4 border-2 border-dashed border-gray-300 rounded-2xl hover:border-primary transition cursor-pointer"
                  >
                    <FaPaperclip className="text-gray-400" />
                    <span className="text-gray-600">Add screenshots or files (images, PDF)</span>
                  </label>

                  {attachments.length > 0 && (
                    <div className="mt-3 space-y-2">
                      {attachments.map((file, idx) => (
                        <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                          <span className="text-gray-700 truncate flex-1">{file.name}</span>
                          <button
                            type="button"
                            onClick={() => removeAttachment(idx)}
                            className="text-red-500 hover:text-red-700 ml-4"
                          >
                            <FaTimes />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="flex gap-3 pt-6 border-t border-gray-100">
                  <button
                    type="button"
                    onClick={() => navigate(-1)}
                    className="px-6 py-3 border border-gray-300 text-gray-700 rounded-2xl hover:bg-gray-50 transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-3 bg-primary text-white rounded-2xl hover:bg-[#FEA08E] transition"
                  >
                    Submit Report
                  </button>
                </div>
              </form>
            </div>
          </div>
          <Footer />
        </div>
      </div>
    </>
  );
}
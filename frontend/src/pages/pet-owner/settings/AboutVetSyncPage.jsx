import { FaChevronLeft, FaHeart, FaPaw, FaUsers, FaShieldAlt, FaBullseye } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../../components/Navbar';
import Footer from '../../../components/Footer';

const InfoCard = ({ icon: Icon, title, description }) => (
  <div className="bg-white rounded-2xl p-6 border border-gray-200">
    <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
      <Icon className="text-primary text-xl" />
    </div>
    <h3 className="font-semibold text-lg mb-2">{title}</h3>
    <p className="text-gray-600 text-sm leading-relaxed">{description}</p>
  </div>
);

export default function AboutVetSyncPage() {
  const navigate = useNavigate();

  const features = [
    {
      icon: FaBullseye,
      title: 'Our Mission',
      description: 'To streamline veterinary clinic operations and improve pet health management in Parañaque City by providing a centralized platform that helps clinics work faster and enhance service quality.'
    },
    {
      icon: FaHeart,
      title: 'Our Vision',
      description: 'To be the leading veterinary management system in Parañaque City, revolutionizing pet healthcare through seamless digital solutions that prioritize convenience, care, and communication.'
    },
    {
      icon: FaPaw,
      title: 'For Pet Owners',
      description: 'Fast access to your pet\'s health records, easy appointment booking, and better communication with veterinarians all in one place. Your pet\'s wellbeing is just a tap away.'
    },
    {
      icon: FaUsers,
      title: 'For Clinics',
      description: 'Efficient management of daily tasks with digital health records, streamlined appointment scheduling, and improved client communication tools designed specifically for veterinary practices.'
    }
  ];

  const focusAreas = [
    'Efficient clinic operations',
    'Pet health records management',
    'Easy appointment scheduling',
    'Better communication between clients and vets'
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Mobile Layout */}
      <div className="lg:hidden">
        <div className="bg-white min-h-screen pb-20">
          <div className="sticky top-0 p-4 z-10 flex items-center gap-2 bg-white border-b border-gray-100">
            <button onClick={() => navigate(-1)} className="flex gap-2 items-center rounded-full hover:bg-gray-300 transition">
              <FaChevronLeft className="text-gray-500" />
              <span className="text-xl font-medium">About VetSync</span>
            </button>
          </div>

          <div className="p-4 space-y-6">
            {/* Logo */}
            <div className="flex justify-center py-6">
              <div className="w-32">
                <img src="/vetsync-logo-wname.png" alt="VetSync" />
              </div>
            </div>

            {/* Main Description */}
            <div className="bg-white rounded-2xl p-6 border border-gray-200">
              <h2 className="text-xl font-bold mb-4">About VetSync</h2>
              
              <p className="text-gray-700 leading-relaxed mb-4">
                VetSync is a web-based application that streamlines veterinary clinic operations and improves pet health management in Parañaque City. It helps clinics manage daily tasks and gives pet owners fast access to their pets' records.
              </p>

              <h3 className="font-semibold text-gray-900 mb-3">VetSync focuses on:</h3>
              <ul className="space-y-2 mb-4">
                {focusAreas.map((area, idx) => (
                  <li key={idx} className="flex items-start gap-3">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 shrink-0"></span>
                    <span className="text-gray-700">{area}</span>
                  </li>
                ))}
              </ul>

              <p className="text-gray-700 leading-relaxed">
                The system provides a centralized platform where clinics can work faster and enhance service quality.
              </p>
            </div>

            {/* Features Cards */}
            <div className="space-y-4">
              {features.map((feature, idx) => (
                <InfoCard key={idx} {...feature} />
              ))}
            </div>

            {/* Contact */}
            <div className="bg-primary/5 rounded-2xl p-6 border border-primary/20">
              <h3 className="font-semibold mb-4">Get in Touch</h3>
              <div className="space-y-3">
                <div>
                  <p className="font-medium text-gray-900 text-sm mb-1">Email</p>
                  <p className="text-gray-600 text-sm">vetsync.business@gmail.com</p>
                </div>
                <div>
                  <p className="font-medium text-gray-900 text-sm mb-1">Support Hours</p>
                  <p className="text-gray-600 text-sm">Mon-Fri, 9AM-6PM</p>
                </div>
              </div>
            </div>

            <p className="text-center text-sm text-gray-500">Version 1.0.0</p>
          </div>
        </div>
      </div>

      {/* Desktop Layout */}
      <div className="hidden lg:block">
        <Navbar />
        <div className="max-w-6xl mx-auto py-8 px-6">
          <div className="flex items-center gap-4 mb-8">
            <button onClick={() => navigate(-1)} className="flex items-center gap-2">
              <FaChevronLeft className="text-gray-500" />
              <h1 className="text-2xl font-medium">About VetSync</h1>
            </button>
          </div>

          {/* Hero Section */}
          <div className="bg-linear-to-br from-primary/10 to-primary/5 rounded-3xl p-12 mb-8 text-center">
            <div className="w-40 mx-auto mb-6">
              <img src="/vetsync-logo-wname.png" alt="VetSync" />
            </div>
            <h2 className="text-4xl font-bold mb-4">VetSync</h2>
            <p className="text-gray-600 text-lg max-w-3xl mx-auto">
              VetSync is a web-based application that streamlines veterinary clinic operations and improves pet health management in Parañaque City. It helps clinics manage daily tasks and gives pet owners fast access to their pets' records.
            </p>
            <p className="text-gray-500 mt-4">Version 1.0.0</p>
          </div>

          {/* Focus Areas */}
          <div className="bg-white rounded-2xl p-8 border border-gray-200 mb-8">
            <h3 className="font-semibold text-xl mb-6">VetSync focuses on:</h3>
            <div className="grid grid-cols-2 gap-4">
              {focusAreas.map((area, idx) => (
                <div key={idx} className="flex items-center gap-3 p-4 bg-primary/5 rounded-xl border border-primary/20">
                  <span className="w-2 h-2 rounded-full bg-primary shrink-0"></span>
                  <span className="text-gray-700">{area}</span>
                </div>
              ))}
            </div>
            <p className="text-gray-700 leading-relaxed mt-6 text-center">
              The system provides a centralized platform where clinics can work faster and enhance service quality.
            </p>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-2 gap-6 mb-8">
            {features.map((feature, idx) => (
              <InfoCard key={idx} {...feature} />
            ))}
          </div>

          {/* Contact */}
          <div className="bg-primary/5 rounded-2xl p-8 border border-primary/20">
            <h3 className="font-semibold text-xl mb-6">Get in Touch</h3>
            <div className="grid grid-cols-2 gap-8">
              <div>
                <p className="font-medium text-gray-900 mb-2">Email</p>
                <p className="text-gray-600">vetsync.business@gmail.com</p>
              </div>
              <div>
                <p className="font-medium text-gray-900 mb-2">Support Hours</p>
                <p className="text-gray-600">Mon-Fri, 9AM-6PM</p>
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    </div>
  );
}
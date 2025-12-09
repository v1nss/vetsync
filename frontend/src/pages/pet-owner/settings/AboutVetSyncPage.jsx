import { FaChevronLeft, FaHeart, FaPaw, FaUsers, FaShieldAlt } from 'react-icons/fa';
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
      icon: FaHeart,
      title: 'Our Mission',
      description: 'To revolutionize pet healthcare by connecting pet owners with veterinary clinics through seamless digital solutions that prioritize convenience, care, and communication.'
    },
    {
      icon: FaPaw,
      title: 'For Pet Owners',
      description: 'Manage your pet\'s health records, book appointments, and communicate with veterinarians all in one place. Your pet\'s wellbeing is just a tap away.'
    },
    {
      icon: FaUsers,
      title: 'For Clinics',
      description: 'Streamline your operations with efficient appointment scheduling, digital health records, and improved client communication tools designed specifically for veterinary practices.'
    },
    {
      icon: FaShieldAlt,
      title: 'Privacy & Security',
      description: 'Your data and your pet\'s health information are protected with industry-standard encryption and security measures. We never share your information without your consent.'
    }
  ];

  const stats = [
    { value: '10K+', label: 'Happy Pet Owners' },
    { value: '500+', label: 'Partner Clinics' },
    { value: '50K+', label: 'Appointments Booked' },
    { value: '99.9%', label: 'Uptime Reliability' }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Mobile Layout */}
      <div className="lg:hidden">
        <div className="bg-white min-h-screen pb-20">
          <div className="sticky top-0 p-4 z-10 flex items-center gap-2 bg-white border-b border-gray-100">
            <button onClick={() => navigate(-1)} className="flex gap-2 items-center justify-center rounded-full hover:bg-gray-300 transition">
              <FaChevronLeft className="text-gray-500" />
              <span className="text-xl font-medium">About VetSync</span>
            </button>
          </div>

          <div className="p-4 space-y-6">
            {/* Hero Section */}
            <div className="text-center py-8">
              <div className="w-32 flex items-center justify-center mx-auto mb-6">
                <img src="/vetsync-logo-wname.png" alt="VetSync" />
              </div>
              <h2 className="text-2xl font-bold mb-3">VetSync</h2>
              <p className="text-gray-600 text-sm">
                Connecting pets, owners, and veterinarians through technology
              </p>
              <p className="text-sm text-gray-500 mt-2">Version 1.0.0</p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-4">
              {stats.map((stat, idx) => (
                <div key={idx} className="bg-white rounded-2xl p-4 border border-gray-200 text-center">
                  <p className="text-2xl font-bold text-primary mb-1">{stat.value}</p>
                  <p className="text-xs text-gray-600">{stat.label}</p>
                </div>
              ))}
            </div>

            {/* Features */}
            <div className="space-y-4">
              {features.map((feature, idx) => (
                <InfoCard key={idx} {...feature} />
              ))}
            </div>

            {/* Contact */}
            <div className="bg-primary/5 rounded-2xl p-6 border border-primary/20">
              <h3 className="font-semibold mb-3">Get in Touch</h3>
                <div className="space-y-2 gap-6">
                <div>
                    <p className="font-medium text-gray-900 mb-1">Email</p>
                    <p className="text-gray-600">vetsync.business@gmail.com</p>
                </div>
                <div>
                    <p className="font-medium text-gray-900 mb-1">Support Hours</p>
                    <p className="text-gray-600">Mon-Fri, 9AM-6PM</p>
                </div>
                </div>
            </div>
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
            <div className="w-32 flex items-center justify-center mx-auto mb-6">
              <img src="/vetsync-logo-wname.png" alt="VetSync" />
            </div>
            <h2 className="text-4xl font-bold mb-4">VetSync</h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Connecting pets, owners, and veterinarians through innovative technology that makes pet healthcare accessible, efficient, and stress-free.
            </p>
            <p className="text-gray-500 mt-4">Version 1.0.0</p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-4 gap-6 mb-8">
            {stats.map((stat, idx) => (
              <div key={idx} className="bg-white rounded-2xl p-6 border border-gray-200 text-center">
                <p className="text-3xl font-bold text-primary mb-2">{stat.value}</p>
                <p className="text-sm text-gray-600">{stat.label}</p>
              </div>
            ))}
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-2 gap-6 mb-8">
            {features.map((feature, idx) => (
              <InfoCard key={idx} {...feature} />
            ))}
          </div>

          {/* Contact */}
          <div className="bg-primary/5 rounded-2xl p-8 border border-primary/20">
            <h3 className="font-semibold text-xl mb-4">Get in Touch</h3>
            <div className="grid grid-cols-2 gap-6">
              <div>
                <p className="font-medium text-gray-900 mb-1">Email</p>
                <p className="text-gray-600">vetsync.business@gmail.com</p>
              </div>
              <div>
                <p className="font-medium text-gray-900 mb-1">Support Hours</p>
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
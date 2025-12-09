import { useState } from 'react';
import { FaChevronLeft } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../../components/Navbar';
import Footer from '../../../components/Footer';

const ToggleSwitch = ({ enabled, onChange }) => (
  <button
    onClick={onChange}
    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
      enabled ? 'bg-primary' : 'bg-gray-300'
    }`}
  >
    <span
      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
        enabled ? 'translate-x-6' : 'translate-x-1'
      }`}
    />
  </button>
);

const NotificationItem = ({ title, description, enabled, onChange }) => (
  <div className="flex items-start justify-between py-4 border-b border-gray-100 last:border-0">
    <div className="flex-1 pr-4">
      <h3 className="font-medium text-gray-900 mb-1">{title}</h3>
      <p className="text-sm text-gray-500">{description}</p>
    </div>
    <ToggleSwitch enabled={enabled} onChange={onChange} />
  </div>
);

export default function NotificationsSettingsPage() {
  const navigate = useNavigate();
  
  const [notifications, setNotifications] = useState({
    // Appointment Notifications
    appointmentReminders: true,
    appointmentConfirmation: true,
    appointmentRescheduled: true,
    appointmentCancelled: true,
    
    // Medical Notifications
    vaccinationReminders: true,
    medicationReminders: true,
    labResults: true,
    
    // Push Notifications
    pushNotifications: true,
    emailNotifications: true,
    smsNotifications: false,
  });

  const toggleNotification = (key) => {
    setNotifications(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const notificationSections = [
    {
      title: 'Appointment Notifications',
      items: [
        {
          key: 'appointmentReminders',
          title: 'Appointment Reminders',
          description: 'Get reminded about upcoming appointments 24 hours before'
        },
        {
          key: 'appointmentConfirmation',
          title: 'Appointment Confirmations',
          description: 'Receive confirmation when appointments are booked'
        },
        {
          key: 'appointmentRescheduled',
          title: 'Rescheduled Appointments',
          description: 'Be notified when appointments are rescheduled'
        },
        {
          key: 'appointmentCancelled',
          title: 'Cancelled Appointments',
          description: 'Get alerts when appointments are cancelled'
        }
      ]
    },
    {
      title: 'Medical Notifications',
      items: [
        {
          key: 'vaccinationReminders',
          title: 'Vaccination Reminders',
          description: 'Stay informed about upcoming vaccinations for your pets'
        },
        {
          key: 'medicationReminders',
          title: 'Medication Reminders',
          description: 'Get reminders for your pet\'s medication schedule'
        },
        {
          key: 'labResults',
          title: 'Lab Results',
          description: 'Be notified when lab results are available'
        }
      ]
    },
    {
      title: 'Notification Channels',
      items: [
        {
          key: 'pushNotifications',
          title: 'Push Notifications',
          description: 'Receive notifications on your device'
        },
        {
          key: 'emailNotifications',
          title: 'Email Notifications',
          description: 'Receive notifications via email'
        },
        {
          key: 'smsNotifications',
          title: 'SMS Notifications',
          description: 'Receive notifications via text message'
        }
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Mobile Layout */}
      <div className="lg:hidden">
        <div className="bg-white min-h-screen pb-20">
          <div className="sticky top-0 p-4 z-10 flex items-center gap-2 bg-white border-b border-gray-100">
            <button onClick={() => navigate(-1)} className="flex gap-2 items-center justify-center rounded-full hover:bg-gray-300 transition">
              <FaChevronLeft className="text-gray-500" />
              <span className="text-xl font-medium">Notifications</span>
            </button>
          </div>

          <div className="p-4 space-y-6">
            {notificationSections.map((section, idx) => (
              <div key={idx} className="bg-white rounded-2xl p-4 border border-gray-200">
                <h2 className="font-semibold text-lg mb-4">{section.title}</h2>
                <div>
                  {section.items.map((item) => (
                    <NotificationItem
                      key={item.key}
                      title={item.title}
                      description={item.description}
                      enabled={notifications[item.key]}
                      onChange={() => toggleNotification(item.key)}
                    />
                  ))}
                </div>
              </div>
            ))}
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
              <h1 className="text-2xl font-medium">Notifications</h1>
            </button>
          </div>

          <div className="space-y-6">
            {notificationSections.map((section, idx) => (
              <div key={idx} className="bg-white rounded-2xl p-6 border border-gray-200">
                <h2 className="font-semibold text-lg mb-4">{section.title}</h2>
                <div>
                  {section.items.map((item) => (
                    <NotificationItem
                      key={item.key}
                      title={item.title}
                      description={item.description}
                      enabled={notifications[item.key]}
                      onChange={() => toggleNotification(item.key)}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
        <Footer />
      </div>
    </div>
  );
}
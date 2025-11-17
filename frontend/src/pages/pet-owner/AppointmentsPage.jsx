import { useState } from "react";
import Navbar from "../../components/Navbar";
import { FaCalendarAlt, FaClock, FaMapMarkerAlt, FaUser, FaPhone } from "react-icons/fa";

export default function AppointmentPage() {
  const [activeTab, setActiveTab] = useState("upcoming");

  const upcomingAppointments = [
    {
      id: 1,
      petName: "Max",
      petType: "Dog",
      date: "2025-11-20",
      time: "10:00 AM",
      veterinarian: "Dr. Sarah Johnson",
      clinic: "Happy Paws Veterinary Clinic",
      address: "123 Main St, Metro Manila",
      phone: "+63 912 345 6789",
      type: "Regular Checkup",
      status: "Confirmed"
    },
    {
      id: 2,
      petName: "Luna",
      petType: "Cat",
      date: "2025-11-25",
      time: "2:30 PM",
      veterinarian: "Dr. Michael Chen",
      clinic: "Pet Care Center",
      address: "456 Oak Ave, Quezon City",
      phone: "+63 917 876 5432",
      type: "Vaccination",
      status: "Pending"
    }
  ];

  const pastAppointments = [
    {
      id: 3,
      petName: "Max",
      petType: "Dog",
      date: "2025-11-10",
      time: "11:00 AM",
      veterinarian: "Dr. Sarah Johnson",
      clinic: "Happy Paws Veterinary Clinic",
      address: "123 Main St, Metro Manila",
      phone: "+63 912 345 6789",
      type: "Vaccination",
      status: "Completed"
    },
    {
      id: 4,
      petName: "Bella",
      petType: "Dog",
      date: "2025-10-15",
      time: "3:00 PM",
      veterinarian: "Dr. Emily Rodriguez",
      clinic: "Animal Wellness Hospital",
      address: "789 Pine Rd, Makati City",
      phone: "+63 918 234 5678",
      type: "Dental Cleaning",
      status: "Completed"
    },
    {
      id: 5,
      petName: "Luna",
      petType: "Cat",
      date: "2025-09-20",
      time: "9:30 AM",
      veterinarian: "Dr. Michael Chen",
      clinic: "Pet Care Center",
      address: "456 Oak Ave, Quezon City",
      phone: "+63 917 876 5432",
      type: "Regular Checkup",
      status: "Completed"
    }
  ];

  const appointments = activeTab === "upcoming" ? upcomingAppointments : pastAppointments;

  const getStatusColor = (status) => {
    switch (status) {
      case "Confirmed":
        return "bg-green-100 text-green-800";
      case "Pending":
        return "bg-yellow-100 text-yellow-800";
      case "Completed":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-blue-100 text-blue-800";
    }
  };

  return (
    <main className="min-h-screen bg-gray-50">
      <Navbar />
      <section className=" mx-auto py-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">My Appointments</h1>
          <p className="mt-2 text-gray-600">View and manage your pet appointments</p>
        </div>

        {/* Tabs */}
        <div className="mb-6 border-b border-gray-200">
          <nav className="flex space-x-8">
            <button
              onClick={() => setActiveTab("upcoming")}
              className={`pb-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === "upcoming"
                  ? "border-primary text-primary"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              Upcoming Appointments ({upcomingAppointments.length})
            </button>
            <button
              onClick={() => setActiveTab("past")}
              className={`pb-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === "past"
                  ? "border-primary text-primary"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              Past Appointments ({pastAppointments.length})
            </button>
          </nav>
        </div>

        {/* Appointments List */}
        <div className="space-y-4">
          {appointments.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-2xl border border-gray-200">
              <FaCalendarAlt className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">No appointments</h3>
              <p className="mt-1 text-sm text-gray-500">
                {activeTab === "upcoming"
                  ? "You don't have any upcoming appointments."
                  : "You don't have any past appointments."}
              </p>
            </div>
          ) : (
            appointments.map((appointment) => (
              <div
                key={appointment.id}
                className="bg-white border border-gray-200 rounded-2xl hover:border-primary transition-shadow p-6"
              >
                <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between">
                  {/* Left Section */}
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="text-xl font-semibold text-gray-900">
                          {appointment.petName}
                          <span className="text-gray-500 font-normal text-base ml-2">
                            ({appointment.petType})
                          </span>
                        </h3>
                        <p className="text-sm text-gray-600 mt-1">{appointment.type}</p>
                      </div>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                          appointment.status
                        )}`}
                      >
                        {appointment.status}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-4">
                      <div className="flex items-center text-gray-700">
                        <FaCalendarAlt className="h-5 w-5 mr-2 text-primary" />
                        <span className="text-sm">{appointment.date}</span>
                      </div>
                      <div className="flex items-center text-gray-700">
                        <FaClock className="h-5 w-5 mr-2 text-primary" />
                        <span className="text-sm">{appointment.time}</span>
                      </div>
                      <div className="flex items-center text-gray-700">
                        <FaUser className="h-5 w-5 mr-2 text-primary" />
                        <span className="text-sm">{appointment.veterinarian}</span>
                      </div>
                      <div className="flex items-center text-gray-700">
                        <FaPhone className="h-5 w-5 mr-2 text-primary" />
                        <span className="text-sm">{appointment.phone}</span>
                      </div>
                    </div>

                    <div className="flex items-start text-gray-700 mt-3">
                      <FaMapMarkerAlt className="h-5 w-5 mr-2 text-primary shrink-0 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium">{appointment.clinic}</p>
                        <p className="text-sm text-gray-600">{appointment.address}</p>
                      </div>
                    </div>
                  </div>

                  {/* Right Section - Actions */}
                  {activeTab === "upcoming" && (
                    <div className="flex flex-col space-y-2 mt-4 lg:mt-0 lg:ml-6">
                      <button className="px-4 py-2 bg-primary text-white rounded-xl hover:bg-primary/80 transition-colors text-sm font-medium">
                        View Details
                      </button>
                      <button className="px-4 py-2 bg-white text-gray-700 border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors text-sm font-medium">
                        Reschedule
                      </button>
                      <button className="px-4 py-2 bg-white text-red-600 border border-red-300 rounded-xl hover:bg-red-50 transition-colors text-sm font-medium">
                        Cancel
                      </button>
                    </div>
                  )}

                  {activeTab === "past" && (
                    <div className="flex flex-col space-y-2 mt-4 lg:mt-0 lg:ml-6">
                      <button className="px-4 py-2 bg-primary text-white rounded-xl hover:bg-primary/80 transition-colors text-sm font-medium">
                        View Details
                      </button>
                      <button className="px-4 py-2 bg-white text-gray-700 border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors text-sm font-medium">
                        Book Again
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </section>
    </main>
  );
}
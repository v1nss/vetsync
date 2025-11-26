import { useState, useEffect } from "react";

export function useAppointments() {
  const [appointments, setAppointments] = useState([]);
  const [vets, setVets] = useState([]);

  useEffect(() => {
    fetchAppointments();
    fetchVets();
  }, []);

  const fetchAppointments = async () => {
    // TODO: Replace with actual API call
    const mockAppointments = [
      {
        id: 1,
        pet_name: "Max",
        pet_type: "Dog",
        owner_name: "John Doe",
        owner_email: "john@email.com",
        owner_phone: "+1234567890",
        date: "2025-12-15",
        time: "10:00 AM",
        service: "General Checkup",
        status: "pending",
        notes: "First time visit",
        assigned_vet: null
      },
      {
        id: 2,
        pet_name: "Luna",
        pet_type: "Cat",
        owner_name: "Jane Smith",
        owner_email: "jane@email.com",
        owner_phone: "+0987654321",
        date: "2025-12-15",
        time: "11:00 AM",
        service: "Vaccination",
        status: "approved",
        notes: "Annual vaccine",
        assigned_vet: "Dr. Sarah Johnson"
      },
      {
        id: 3,
        pet_name: "Buddy",
        pet_type: "Dog",
        owner_name: "Mike Wilson",
        owner_email: "mike@email.com",
        owner_phone: "+1122334455",
        date: "2025-12-16",
        time: "2:00 PM",
        service: "Surgery Consultation",
        status: "pending",
        notes: "Needs hip examination",
        assigned_vet: null
      },
      {
        id: 4,
        pet_name: "Whiskers",
        pet_type: "Cat",
        owner_name: "Sarah Lee",
        owner_email: "sarah@email.com",
        owner_phone: "+5566778899",
        date: "2024-12-20",
        time: "9:00 AM",
        service: "Dental Cleaning",
        status: "approved",
        notes: "Regular checkup",
        assigned_vet: "Dr. Emily Brown"
      }
    ];
    setAppointments(mockAppointments);
  };

  const fetchVets = async () => {
    // TODO: Replace with actual API call
    const mockVets = [
      { id: 1, name: "Dr. Sarah Johnson", specialization: "Surgery" },
      { id: 2, name: "Dr. Michael Chen", specialization: "General Practice" },
      { id: 3, name: "Dr. Emily Brown", specialization: "Dentistry" }
    ];
    setVets(mockVets);
  };

  const updateAppointmentStatus = (appointmentId, newStatus) => {
    setAppointments(prev =>
      prev.map(apt =>
        apt.id === appointmentId ? { ...apt, status: newStatus } : apt
      )
    );
  };

  const assignVetToAppointment = (appointmentId, vetName) => {
    setAppointments(prev =>
      prev.map(apt =>
        apt.id === appointmentId ? { ...apt, assigned_vet: vetName } : apt
      )
    );
  };

  return {
    appointments,
    vets,
    updateAppointmentStatus,
    assignVetToAppointment
  };
}
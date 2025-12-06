import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";

export function useVetAppointments() {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [stats, setStats] = useState({
    total: 0,
    today: 0,
    upcoming: 0,
    completed: 0
  });

  useEffect(() => {
    fetchVetAppointments();
  }, [user]);

  const fetchVetAppointments = async () => {
    // TODO: Replace with actual API call
    // const response = await fetch(`/api/vet/appointments?vet_id=${user.id}`);
    
    const mockAppointments = [
      {
        id: 1,
        pet_name: "Max",
        pet_type: "Dog",
        pet_breed: "Golden Retriever",
        pet_age: "3 years",
        owner_name: "John Doe",
        owner_email: "john@email.com",
        owner_phone: "+1234567890",
        date: "2024-12-15",
        time: "10:00 AM",
        service: "General Checkup",
        status: "pending",
        urgency: "routine",
        notes: "First time visit. Dog seems healthy but owner wants routine checkup.",
        clinic_name: "VetCare Clinic",
        assigned_vet: user?.full_name || "Dr. Sarah Johnson"
      },
      {
        id: 2,
        pet_name: "Luna",
        pet_type: "Cat",
        pet_breed: "Siamese",
        pet_age: "5 years",
        owner_name: "Jane Smith",
        owner_email: "jane@email.com",
        owner_phone: "+0987654321",
        date: "2024-12-15",
        time: "2:00 PM",
        service: "Vaccination",
        status: "approved",
        urgency: "routine",
        notes: "Annual rabies vaccine due.",
        clinic_name: "VetCare Clinic",
        assigned_vet: user?.full_name || "Dr. Sarah Johnson"
      },
      {
        id: 3,
        pet_name: "Buddy",
        pet_type: "Dog",
        pet_breed: "Labrador",
        pet_age: "7 years",
        owner_name: "Mike Wilson",
        owner_email: "mike@email.com",
        owner_phone: "+1122334455",
        date: "2024-12-16",
        time: "9:00 AM",
        service: "Surgery Consultation",
        status: "approved",
        urgency: "urgent",
        notes: "Hip dysplasia. Owner reports limping.",
        clinic_name: "VetCare Clinic",
        assigned_vet: user?.full_name || "Dr. Sarah Johnson"
      },
      {
        id: 4,
        pet_name: "Charlie",
        pet_type: "Dog",
        pet_breed: "Beagle",
        pet_age: "2 years",
        owner_name: "Emily Brown",
        owner_email: "emily@email.com",
        owner_phone: "+5544332211",
        date: "2024-12-14",
        time: "11:00 AM",
        service: "Dental Cleaning",
        status: "completed",
        urgency: "routine",
        notes: "Routine dental cleaning completed successfully.",
        clinic_name: "VetCare Clinic",
        assigned_vet: user?.full_name || "Dr. Sarah Johnson"
      }
    ];

    setAppointments(mockAppointments);
    calculateStats(mockAppointments);
  };

  const calculateStats = (appointments) => {
    const today = new Date().toISOString().split('T')[0];
    
    setStats({
      total: appointments.length,
      today: appointments.filter(apt => apt.date === today).length,
      upcoming: appointments.filter(apt => apt.status === 'approved').length,
      completed: appointments.filter(apt => apt.status === 'completed').length
    });
  };

  const markAppointmentComplete = (appointmentId) => {
    setAppointments(prev => {
      const updated = prev.map(apt =>
        apt.id === appointmentId ? { ...apt, status: 'completed' } : apt
      );
      calculateStats(updated);
      return updated;
    });
  };

  return {
    appointments,
    stats,
    markAppointmentComplete
  };
}
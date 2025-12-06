import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { getAppointmentsByVet } from "../global/api/appointment";

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
    try {
      const res = await getAppointmentsByVet();
      console.log("Raw vet appointments data:", res.appointments);
      const transformedAppointments = (res.appointments || []).map(apt => ({
        id: apt.appointment_id,
        pet_name: apt.pet?.name || 'N/A',
        pet_type: apt.pet?.species || 'N/A',
        pet_breed: apt.pet?.breed || apt.pet?.species || 'N/A',
        pet_birthdate: apt.pet?.birthdate || null,
        pet_gender: apt.pet?.gender || null,
        pet_id: apt.pet_id,
        owner_id: apt.owner_id,
        owner_name: (apt.owner?.User?.first_name + " " + apt.owner?.User?.last_name ) || 'N/A',
        owner_email: apt.owner?.User?.email || 'N/A',
        owner_phone: apt.owner?.User?.phone_number || 'N/A',
        clinic_id: apt.clinic_id,
        clinic_name: apt.clinic?.name || 'N/A',
        date: apt.date,
        time: apt.time,
        service: apt.service || 'General Checkup',
        status: apt.status,
        notes: apt.notes || '',
        assigned_vet: (apt.vet?.User?.first_name + " " + apt.vet?.User?.last_name) || 'N/A',
        vet_id: apt.vet_professional_id
      }));

      setAppointments(transformedAppointments);
      calculateStats(transformedAppointments);
    } catch (err) {
      console.error("Error fetching vet appointments:", err.message);
    }
    
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
    markAppointmentComplete,
    refetchAppointments: fetchVetAppointments
  };
}
import api from "../utils/api";

export const createAppointment = async (appointmentData) => {
  try {
    const res = await api.post("/appointments/create", appointmentData);
    // console.log("Appointment created successfully:", res.data);
    return res.data;
    } catch (err) {
        console.error("Error creating appointment:", err.message);
    }
}

export const getAppointmentsByOwner = async () => {
    try {
        const res = await api.get("/appointments/owner");
        // console.log("Fetched appointments for owner:", res.data);
        return res.data;
    } catch (err) {
        console.error("Error fetching appointments for owner:", err.message);
    }
}

export const deleteAppointment = async (appointmentId) => {
    try {
        const res = await api.delete(`/appointments/delete/${appointmentId}`);
        // console.log("Appointment deleted successfully:", res.data);
        return res.data;
    } catch (err) {
        console.error("Error deleting appointment:", err.message);
    }
}

export const fetchAppointmentsByClinic = async (clinicId) => {
    try {
        const res = await api.get(`/appointments/clinic/${clinicId}`);
        // console.log("Fetched appointments for clinic:", res.data);
        return res.data;
    } catch (err) {
        console.error("Error fetching appointments for clinic:", err.message);
    }
}

export const approveAppointment = async (appointmentId, vetProfessionalId = null) => {
    try {
        const res = await api.patch(`/appointments/approve/${appointmentId}`, {
            vet_professional_id: vetProfessionalId
        });
        // console.log("Appointment accepted successfully:", res.data);
        return res.data;
    } catch (err) {
        console.error("Error accepting appointment:", err.message);
        throw err;
    }
}

export const updateAppointmentStatus = async (appointmentId, status, vetProfessionalId = null) => {
    try {
        // Use accept endpoint for 'confirmed' status, complete for 'completed'
        if (status === 'approved') {
            return await approveAppointment(appointmentId, vetProfessionalId);
        } else if (status === 'completed') {
            const res = await api.patch(`/appointments/complete/${appointmentId}`);
            // console.log("Appointment completed successfully:", res.data);
            return res.data;
        } else {
            // For other statuses, we might need a generic update endpoint
            // For now, throw an error
            throw new Error(`Status update to '${status}' not yet supported`);
        }
    } catch (err) {
        console.error("Error updating appointment status:", err.message);
        throw err;
    }
}

export const assignVetToAppointment = async (appointmentId, vetProfessionalId) => {
    try {
        const res = await api.patch(`/appointments/approve/${appointmentId}`, {
            vet_professional_id: vetProfessionalId
        });
        // console.log("Vet assigned successfully:", res.data);
        return res.data;
    } catch (err) {
        console.error("Error assigning vet to appointment:", err.message);
        throw err;
    }
}
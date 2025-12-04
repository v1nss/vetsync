import api from "../utils/api";

export const createAppointment = async (appointmentData) => {
  try {
    const res = await api.post("/appointments/create", appointmentData);
    console.log("Appointment created successfully:", res.data);
    return res.data;
    } catch (err) {
        console.error("Error creating appointment:", err.message);
    }
}

export const getAppointmentsByOwner = async () => {
    try {
        const res = await api.get("/appointments/owner");
        console.log("Fetched appointments for owner:", res.data);
        return res.data;
    } catch (err) {
        console.error("Error fetching appointments for owner:", err.message);
    }
}

export const deleteAppointment = async (appointmentId) => {
    try {
        const res = await api.delete(`/appointments/delete/${appointmentId}`);
        console.log("Appointment deleted successfully:", res.data);
        return res.data;
    } catch (err) {
        console.error("Error deleting appointment:", err.message);
    }
}
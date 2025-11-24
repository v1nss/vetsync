import { createContext, useContext, useState, useEffect } from "react";
import { fetchClinicByOwnerId } from "../global/api/clinic";
import { useAuth } from "./AuthContext";

export const ClinicStatusContext = createContext();

export const ClinicStatusProvider = ({ children }) => {
  const { role, user } = useAuth();
  const [isPending, setIsPending] = useState(false);
  const [loading, setLoading] = useState(true);
  const [clinic, setClinic] = useState(null);

  useEffect(() => {
    // only fetch once role and user are ready
    if (!user || !role) return;

    const initializeClinicStatus = async () => {
      setLoading(true);

      // skip fetch if not a clinic_admin
      if (role !== "clinic_admin") {
        setIsPending(false);
        setLoading(false);
        return;
      }

      try {
        const res = await fetchClinicByOwnerId(user.id);

        if (!res || !res.clinic) {
          console.log("Clinic does not exist");
          setClinic(null);
          setIsPending(false);
        } else {
          setClinic(res.clinic);
          setIsPending(res.clinic.status === "pending");
        }
      } catch (err) {
        console.error("Unable to get clinic based on owner ID:", err.message);
      } finally {
        setLoading(false);
      }
    };

    initializeClinicStatus();
  }, [user, role]);

  return (
    <ClinicStatusContext.Provider
      value={{
        isPending,
        loading,
        clinic, // optional — might be useful later
      }}
    >
      {children}
    </ClinicStatusContext.Provider>
  );
};

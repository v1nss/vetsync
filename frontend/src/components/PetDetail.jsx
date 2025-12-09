import { useState, useEffect } from "react";
import { getEHRsByPet } from "../global/api/ehr";

export default function PetDetail({ pet }) {
  const [recentEHRs, setRecentEHRs] = useState([]);
  const [loadingEHRs, setLoadingEHRs] = useState(false);

  useEffect(() => {
    const fetchRecentEHRs = async () => {
      if (pet && pet.pet_id) {
        setLoadingEHRs(true);
        try {
          const res = await getEHRsByPet(pet.pet_id);
          if (res && res.ehrs && res.ehrs.length > 0) {
            // Get the 2 most recent EHR records
            const recent = res.ehrs.slice(0, 2).map(ehr => ({
              id: ehr.id,
              date: ehr.visit_date,
              reason: ehr.appointment?.service || "General Checkup",
              clinic: ehr.clinic?.name || "Veterinary Clinic"
            }));
            setRecentEHRs(recent);
          }
        } catch (err) {
          console.error("Error fetching recent EHRs:", err);
        } finally {
          setLoadingEHRs(false);
        }
      }
    };

    fetchRecentEHRs();
  }, [pet]);

  const InfoCard = ({ label, value }) => (
    <div className="text-center md:p-4 md:bg-gray-50 md:rounded-2xl">
      <p className="font-medium mb-1 text-xl md:text-2xl">
        {value || '-'}
      </p>
      <p className="text-sm text-gray-500">{label}</p>
    </div>
  );

    // Calculate age from birthdate
  const calculateAge = (birthdate) => {
    if (!birthdate) return null;
    
    const birth = new Date(birthdate);
    const today = new Date();
    
    let years = today.getFullYear() - birth.getFullYear();
    let months = today.getMonth() - birth.getMonth();
    
    if (months < 0) {
      years--;
      months += 12;
    }
    
    if (years > 0) {
      return `${years}y ${months > 0 ? ` ${months}m` : ''}`;
    } else if (months > 0) {
      return `${months}m`;
    } else {
      const days = Math.floor((today - birth) / (1000 * 60 * 60 * 24));
      return `${days}d`;
    }
  };

  const petBirthdate = pet?.birthdate;
  const petAge = calculateAge(petBirthdate);

  const InfoSection = ({ title, children }) => (
    <div className="mb-6">
      <h3 className="font-medium mb-3 md:text-xl">{title}</h3>
      {children}
    </div>
  );

  const InfoRow = ({ label, value }) => (
    <div className="flex justify-between items-start py-3 border-b border-gray-100 last:border-0">
      <span className="text-sm text-gray-600">{label}</span>
      <span className="text-sm font-medium text-right max-w-[60%]">{value || '-'}</span>
    </div>
  );

  return (
    <div className="p-4 max-w-2xl mx-auto md:p-0">
      {/* Pet Image */}
      <div className="w-full aspect-square bg-gray-200 rounded-2xl overflow-hidden mb-4 sm:max-w-xs sm:mx-auto md:mb-6">
        <img src={pet.profileURL?.link} alt={pet.name} className="w-full h-full object-cover" />
      </div>

      {/* Pet Name & Breed */}
      <div className="text-center mb-6">
        <h2 className="font-semibold text-xl mb-1 md:text-2xl md:mb-2">
          {pet.name}
        </h2>
        <p className="text-gray-500 md:text-lg">{pet.breed}</p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 gap-4 mb-6 md:gap-6 md:mb-8">
        <InfoCard label="Gender" value={pet.gender === 'male' ? 'Male' : 'Female'} />
        <InfoCard label="Age" value={petAge} />
        {/* <InfoCard label="Weight" value={pet.weight} /> */}
      </div>

      {/* Basic Information */}
      <InfoSection title="Basic Information">
        <div className="bg-white border border-gray-200 rounded-2xl p-4">
          <InfoRow label="Species" value={pet.species ? pet.species.charAt(0).toUpperCase() + pet.species.slice(1) : '-'} />
          <InfoRow label="Color" value={pet.color} />
          <InfoRow label="Date of Birth" value={pet.birthdate || '-'} />
        </div>
      </InfoSection>

      {/* Medical Information */}
      <InfoSection title="Medical Information">
        <div className="bg-white border border-gray-200 rounded-2xl p-4">
          <InfoRow label="Allergies" value={pet.allergies} />
          <InfoRow label="Current Medications" value={pet.medications} />
        </div>
      </InfoSection>

      {/* Additional Notes */}
      {pet.notes && (
        <InfoSection title="Additional Notes">
          <div className="bg-white border border-gray-200 rounded-2xl p-4">
            <p className="text-sm text-gray-700">{pet.notes}</p>
          </div>
        </InfoSection>
      )}

      {/* Recent Appointments */}
      <InfoSection title="Recent Health Records">
        <div className="space-y-3">
          {loadingEHRs ? (
            <>
              <div className="bg-gray-200 rounded-2xl h-16 md:h-20 animate-pulse"></div>
              <div className="bg-gray-200 rounded-2xl h-16 md:h-20 animate-pulse"></div>
            </>
          ) : recentEHRs.length > 0 ? (
            recentEHRs.map((ehr) => (
              <div key={ehr.id} className="bg-white border border-gray-200 rounded-2xl p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-medium text-gray-900 mb-1">{ehr.reason}</p>
                    <p className="text-sm text-gray-600">{ehr.clinic}</p>
                  </div>
                  <p className="text-sm text-gray-500">
                    {new Date(ehr.date).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric'
                    })}
                  </p>
                </div>
              </div>
            ))
          ) : (
            <div className="bg-gray-50 border border-gray-200 rounded-2xl p-4 text-center">
              <p className="text-sm text-gray-500">No health records available</p>
            </div>
          )}
        </div>
      </InfoSection>
    </div>
  );
}
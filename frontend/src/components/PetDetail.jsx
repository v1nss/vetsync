export default function PetDetail({ pet }) {
  const InfoCard = ({ label, value }) => (
    <div className="text-center md:p-4 md:bg-gray-50 md:rounded-2xl">
      <p className="font-medium mb-1 text-xl md:text-2xl">
        {value || '-'}
      </p>
      <p className="text-sm text-gray-500">{label}</p>
    </div>
  );

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
        <img src={pet.image} alt={pet.name} className="w-full h-full object-cover" />
      </div>

      {/* Pet Name & Breed */}
      <div className="text-center mb-6">
        <h2 className="font-semibold text-xl mb-1 md:text-2xl md:mb-2">
          {pet.name}
        </h2>
        <p className="text-gray-500 md:text-lg">{pet.breed}</p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-3 gap-4 mb-6 md:gap-6 md:mb-8">
        <InfoCard label="Gender" value={pet.gender === 'male' ? 'Male' : 'Female'} />
        <InfoCard label="Age" value={pet.ageValue || pet.age} />
        <InfoCard label="Weight" value={pet.weight} />
      </div>

      {/* Basic Information */}
      <InfoSection title="Basic Information">
        <div className="bg-white border border-gray-200 rounded-2xl p-4">
          <InfoRow label="Species" value={pet.species ? pet.species.charAt(0).toUpperCase() + pet.species.slice(1) : '-'} />
          <InfoRow label="Color" value={pet.color} />
          <InfoRow label="Date of Birth" value={pet.dateOfBirth || '-'} />
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
      <InfoSection title="Recent Appointments">
        <div className="space-y-3">
          <div className="bg-gray-200 rounded-2xl h-16 md:h-20"></div>
          <div className="bg-gray-200 rounded-2xl h-16 md:h-20"></div>
        </div>
      </InfoSection>
    </div>
  );
}
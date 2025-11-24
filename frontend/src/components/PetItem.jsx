import { FaMars, FaVenus } from 'react-icons/fa';

export default function PetItem({ pet, variant = 'card', isSelected, onClick }) {
  const GenderIcon = pet.gender === 'male' ? FaMars : FaVenus;
  const genderColor = pet.gender === 'male' ? 'text-blue-500' : 'text-pink-500';

  if (variant === 'list') {
    return (
      <button
        onClick={onClick}
        className={`w-full flex items-center gap-3 p-3 rounded-xl transition ${
          isSelected ? 'bg-primary bg-opacity-10 border-2 border-primary text-white' : 'hover:bg-gray-50'
        }`}
      >
        <div className="w-14 h-14 bg-gray-200 rounded-xl overflow-hidden">
          <img src={pet.profileURL?.link} alt={pet.name} className="w-full h-full object-cover" />
        </div>
        <div className="flex-1 text-left">
          <div className="flex items-center gap-2">
            <span className="font-medium">{pet.name}</span>
            <GenderIcon className={`${genderColor} text-sm`} />
          </div>
          <p className="text-sm text-gray-500">{pet.age}</p>
        </div>
      </button>
    );
  }

  return (
    <button onClick={onClick} className="text-left hover:opacity-80 transition">
      <div className="w-full aspect-square bg-gray-200 rounded-2xl mb-2 overflow-hidden">
        <img src={pet.profileURL?.link} alt={pet.name} className="w-full h-full object-cover" />
      </div>
      <div className="flex items-center gap-1">
        <span className="font-medium">{pet.name}</span>
        <GenderIcon className={`${genderColor} text-sm`} />
      </div>
      <p className="text-sm text-gray-500">{pet.age}</p>
    </button>
  );
}
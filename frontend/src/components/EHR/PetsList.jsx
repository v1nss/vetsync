import { FiSearch, FiChevronRight } from "react-icons/fi";

export default function PetsList({ pets, searchTerm, setSearchTerm, onSelect }) {
  return (
    <div className="p-4">
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          Select a Pet to View Records
        </h2>
        
        {/* Search */}
        <div className="relative">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search by name, species, breed, or ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition"
          />
        </div>
      </div>

      {/* Pets Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {pets.map((pet) => (
          <button
            key={pet.id}
            onClick={() => onSelect(pet)}
            className="text-left p-4 rounded-xl border border-gray-200 hover:border-primary hover:bg-primary/5 transition-all"
          >
            <div className="flex items-start gap-4">
              <div className="w-16 h-16 bg-linear-to-br from-primary to-[#FEA08E] rounded-2xl flex items-center justify-center shrink-0">
                <span className="text-2xl font-bold text-white">
                  {pet.name.charAt(0)}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-gray-900 text-lg mb-1 truncate">
                  {pet.name}
                </h3>
                <p className="text-sm text-gray-600 mb-2">
                  {pet.species} • {pet.breed}
                </p>
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <span>ID: {pet.id}</span>
                  <span>•</span>
                  <span>{pet.age}</span>
                </div>
              </div>
              <FiChevronRight className="text-gray-400 mt-5" />
            </div>
          </button>
        ))}
      </div>

      {pets.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-600">No pets found matching your search</p>
        </div>
      )}
    </div>
  );
}
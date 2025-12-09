import { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaSearch, FaPlus, FaChevronLeft } from 'react-icons/fa';
import PetItem from '../../components/PetItem';
import PetDetail from '../../components/PetDetail';
import Navbar from '../../components/Navbar';
import { useAuth } from '../../context/AuthContext';
import { fetchAllPetsById } from '../../global/api/pet';

export default function ManagePetsPage() {
  const navigate = useNavigate();
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(true);
  const [pets, setPets] = useState(null);

  useEffect(() => {

    const fetchAllPets = async () => {
      setLoading(true);
      setSelected(null);
      try {
        const res = await fetchAllPetsById();
        if (!res) {
          console.log("no pets exist");
          setPets(null);
        } else {
          setPets(res);
        }
      } catch (err) {
        console.error("Unable to get pets by ID:", err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAllPets()
  }, [])

  const handleAddPet = () => navigate('add');

  const handlePetUpdate = useCallback((updatedPet) => {
    // Update the pets list with the updated pet
    setPets(prev => prev?.map(p => p.pet_id === updatedPet.pet_id ? updatedPet : p));
    // Update the selected pet
    setSelected(updatedPet);
  }, []);

  return (
    <main>
      <div className="hidden sm:block">
        <Navbar />
      </div>
      {/* Mobile */}
      <div className="md:hidden min-h-screen bg-white">
        {!selected ? (
          <>
            <div className="top-0 sm:hidden sticky left-0 p-4 z-50 flex items-center justify-between gap-2 bg-white w-full border-b border-gray-100">
                <div className="flex gap-2">
                    <button
                        onClick={() => navigate(-1)}
                        className="rounded-full hover:bg-gray-300 transition"
                    >
                        <FaChevronLeft className="text-gray-500" />
                    </button>
                    <h1 className="text-xl font-medium">Pets</h1>
                </div>
              <div className="flex gap-2">
                <button onClick={handleAddPet} className="p-2 hover:bg-gray-50 rounded-full transition">
                  <FaPlus />
                </button>
                <button className="p-2 hover:bg-gray-50 rounded-full transition">
                  <FaSearch />
                </button>
              </div>
            </div>
            <div className="p-4 grid grid-cols-2 sm:grid-cols-4 gap-4">
              {pets?.map(pet => (
                <PetItem key={pet.pet_id} pet={pet} variant="card" onClick={() => setSelected(pet)} />
              ))}
              <button
                onClick={handleAddPet}
                className="border-2 border-dashed border-gray-300 rounded-2xl aspect-square flex flex-col items-center justify-center gap-2 hover:border-primary hover:text-primary transition"
              >
                <FaPlus className="text-2xl" />
                <span className="text-sm">Add pet</span>
              </button>
            </div>
          </>
        ) : (
          <>
            <div className="sticky top-0 bg-white flex items-center justify-between p-4 border-b border-gray-100">
              <div className="flex items-center gap-3">
                <button onClick={() => setSelected(null)} className="p-2 hover:bg-gray-50 rounded-full transition">
                  <FaChevronLeft />
                </button>
                <h1 className="text-xl font-semibold">{selected.name}</h1>
              </div>
              <button className="p-2 hover:bg-gray-50 rounded-full transition">
                <FaSearch />
              </button>
            </div>
            <PetDetail pet={selected} onUpdate={handlePetUpdate} />
          </>
        )}
      </div>

      {/* Desktop */}
      <div className="hidden md:block min-h-screen bg-background">
        <div className="max-w-7xl mx-auto py-8 px-6">
          <div className="flex items-center justify-between mb-8">
            <button
              onClick={() => navigate("/")}
              className="rounded-full flex items-center gap-2"
            >
              <FaChevronLeft className="text-gray-500" />
              <h1 className="text-2xl font-medium">Manage Pets</h1>
            </button>
            <div className="flex gap-3">
              <button onClick={handleAddPet} className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-2xl hover:bg-[#FEA08E] transition">
                <FaPlus />
                <span>Add Pet</span>
              </button>
              <button className="p-3 hover:bg-gray-100 rounded-full transition">
                <FaSearch className="text-xl" />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-12 gap-6">
            <div className="col-span-4 bg-white rounded-2xl p-6 border border-gray-200">
              <h2 className="font-semibold text-lg mb-4">Your Pets</h2>
              <div className="space-y-3">
                {pets?.map(pet => (
                  <PetItem
                    key={pet.pet_id}
                    pet={pet}
                    variant="list"
                    isSelected={selected?.pet_id === pet.pet_id}
                    onClick={() => setSelected(pet)}
                  />
                ))}
                <button
                  onClick={handleAddPet}
                  className="w-full border-2 border-dashed border-gray-300 rounded-xl p-4 flex items-center justify-center gap-2 hover:border-primary hover:text-primary transition"
                >
                  <FaPlus />
                  <span className="text-sm">Add pet</span>
                </button>
              </div>
            </div>

            <div className="col-span-8 bg-white rounded-2xl p-6 border border-gray-200">
              {selected ? (
                <PetDetail pet={selected} onUpdate={handlePetUpdate} />
              ) : (
                <div className="flex items-center justify-center h-full text-center text-gray-400">
                  <div>
                    <p className="text-lg">Select a pet to view details</p>
                    <p className="text-sm">or add a new pet</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
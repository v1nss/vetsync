import { useState, useEffect } from "react";
import { FaPlus, FaEdit, FaTrash, FaUserMd } from "react-icons/fa";
import { useAuth } from "../../context/AuthContext";
import AddVetModal from "../../components/vet/AddVetModal";

export default function VetProManagementPage() {
  const { token } = useAuth();
  const [vets, setVets] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedVet, setSelectedVet] = useState(null);

  useEffect(() => {
    fetchVets();
  }, [token]);

  const fetchVets = async () => {
    try {
      // const data = await fetchClinicVets(token);
      // setVets(data);
      
      // Mock data
      setVets([
        { id: 1, name: "Dr. Sarah Johnson", email: "sarah@clinic.com", specialization: "Surgery", license_number: "VET-2023-001", status: "active" },
        { id: 2, name: "Dr. Michael Chen", email: "michael@clinic.com", specialization: "General Practice", license_number: "VET-2023-002", status: "active" },
      ]);
    } catch (err) {
      console.error("Failed to fetch vets:", err);
    }
  };

  const handleAddVet = async (vetData) => {
    try {
      // await addVet(token, vetData);
      await fetchVets();
      setIsModalOpen(false);
    } catch (err) {
      console.error("Failed to add vet:", err);
    }
  };

  const handleEditVet = async (vetData) => {
    try {
      // await updateVet(token, selectedVet.id, vetData);
      await fetchVets();
      setIsModalOpen(false);
      setSelectedVet(null);
    } catch (err) {
      console.error("Failed to update vet:", err);
    }
  };

  const handleDeleteVet = async (vetId) => {
    if (!confirm("Are you sure you want to remove this vet?")) return;
    try {
      // await deleteVet(token, vetId);
      await fetchVets();
    } catch (err) {
      console.error("Failed to delete vet:", err);
    }
  };

  const openEditModal = (vet) => {
    setSelectedVet(vet);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedVet(null);
  };

  return (
    <main className="min-h-screen pb-10 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        <div className="flex sm:flex-row flex-col sm:items-center gap-y-4 justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Vet Professionals</h1>
            <p className="text-gray-600 mt-1">Manage your clinic's veterinary team</p>
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 px-4 py-3 bg-primary text-white rounded-xl hover:bg-primary/90 transition"
          >
            <FaPlus /> Add Vet
          </button>
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
          {vets.length === 0 ? (
            <div className="text-center py-12">
              <FaUserMd className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No vets yet</h3>
              <p className="text-gray-600 mb-4">Get started by adding your first vet professional</p>
              <button
                onClick={() => setIsModalOpen(true)}
                className="px-4 py-2 bg-primary text-white rounded-xl hover:bg-primary/90"
              >
                Add Vet
              </button>
            </div>
          ) : (
            <>
              <div className="hidden md:block overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Specialization</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">License</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {vets.map((vet) => (
                      <tr key={vet.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="font-medium text-gray-900">{vet.name}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-gray-600">{vet.email}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-gray-600">{vet.specialization}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-gray-600">{vet.license_number}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="capitalize px-2 py-1 text-xs font-medium rounded-lg bg-green-100 text-green-700">
                            {vet.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right">
                          <button
                            onClick={() => openEditModal(vet)}
                            className="text-primary hover:text-primary/80 mr-3"
                          >
                            <FaEdit />
                          </button>
                          <button
                            onClick={() => handleDeleteVet(vet.id)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <FaTrash />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="md:hidden divide-y divide-gray-200">
                {vets.map((vet) => (
                  <div key={vet.id} className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="font-semibold text-gray-900">{vet.name}</h3>
                        <p className="text-sm text-gray-600">{vet.email}</p>
                      </div>
                      <span className="px-2 py-1 text-xs font-medium rounded-lg bg-green-100 text-green-700">
                        {vet.status}
                      </span>
                    </div>
                    <div className="text-sm text-gray-600 mb-3">
                      <p>{vet.specialization}</p>
                      <p className="text-xs mt-1">{vet.license_number}</p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => openEditModal(vet)}
                        className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-primary text-white rounded-lg text-sm"
                      >
                        <FaEdit /> Edit
                      </button>
                      <button
                        onClick={() => handleDeleteVet(vet.id)}
                        className="px-3 py-2 bg-red-600 text-white rounded-lg text-sm"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      <AddVetModal
        isOpen={isModalOpen}
        onClose={closeModal}
        onSubmit={selectedVet ? handleEditVet : handleAddVet}
        vet={selectedVet}
      />
    </main>
  );
}
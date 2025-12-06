import { useState, useEffect } from "react";
import { FaPlus, FaEdit, FaTrash, FaUserMd } from "react-icons/fa";
import { useAuth } from "../../context/AuthContext";
import AddVetModal from "../../components/vet/AddVetModal";
import NotificationModal from "../../components/NotificationModal";
import ConfirmationModal from "../../components/ConfirmationModal";
import { addVetProfessional, updateVetProfessional, fetchClinicVets } from "../../global/api/clinicAdmin";

export default function VetProManagementPage() {
  const { user } = useAuth();
  const [vets, setVets] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedVet, setSelectedVet] = useState(null);
  
  // Notification state
  const [notification, setNotification] = useState({ 
    isOpen: false, 
    type: 'success', 
    title: '', 
    message: '' 
  });

  // Confirmation modal state
  const [confirmDelete, setConfirmDelete] = useState({
    isOpen: false,
    vetId: null,
    vetName: ''
  });

  useEffect(() => {
    fetchVets();
  }, [user]);

  const fetchVets = async () => {
    try {
      const vets = await fetchClinicVets();
      
      const transformedVets = vets.map(vet => ({
        id: vet.user_id,
        first_name: vet.User.first_name,
        last_name: vet.User.last_name,
        email: vet.User.email,
        specialization: vet.specialization,
        license_number: vet.license_number || 'N/A',
        profile_image_url: vet.User.profile_image_url || null,
        status: 'active' // Assuming all fetched vets are active
      }));

      setVets(transformedVets);

    } catch (err) {
      console.error("Failed to fetch vets:", err);
      setNotification({
        isOpen: true,
        type: 'error',
        title: 'Failed to Load',
        message: 'Unable to fetch veterinarians. Please try again.'
      });
    }
  };

  const handleAddVet = async (vetData, profilePicture) => {
    try {
      await addVetProfessional(vetData, profilePicture);
      await fetchVets();
      setIsModalOpen(false);
      
      // Show success notification
      setNotification({
        isOpen: true,
        type: 'success',
        title: 'Vet Added! 🎉',
        message: `${vetData.name} has been successfully added to your team.`
      });
    } catch (err) {
      console.error("Failed to add vet:", err);
      setNotification({
        isOpen: true,
        type: 'error',
        title: 'Failed to Add Vet',
        message: err.response?.data?.error || err.message || 'Unable to add the veterinarian. Please try again.'
      });
    }
  };

  const handleEditVet = async (vetData, profilePicture) => {
    try {
      if (!selectedVet || !selectedVet.id) {
        throw new Error("No vet selected for update");
      }
      console.log("Updating vet with ID:", vetData);
      await updateVetProfessional(selectedVet.id, vetData, profilePicture);
      await fetchVets();
      setIsModalOpen(false);
      setSelectedVet(null);
      
      // Show success notification
      setNotification({
        isOpen: true,
        type: 'success',
        title: 'Vet Updated! ✅',
        message: `${vetData.first_name} ${vetData.last_name}'s information has been successfully updated.`
      });
    } catch (err) {
      console.error("Failed to update vet:", err);
      setNotification({
        isOpen: true,
        type: 'error',
        title: 'Update Failed',
        message: err.response?.data?.error || err.message || 'Unable to update veterinarian information. Please try again.'
      });
    }
  };

  // Open confirmation modal
  const handleDeleteVet = (vetId) => {
    const vet = vets.find(v => v.id === vetId);
    setConfirmDelete({
      isOpen: true,
      vetId: vetId,
      vetName: vet?.name || 'this vet'
    });
  };

  // Actual delete function after confirmation
  const confirmDeleteVet = async () => {
    try {
      // await deleteVet(token, confirmDelete.vetId);
      await fetchVets();
      
      // Close confirmation modal
      setConfirmDelete({ isOpen: false, vetId: null, vetName: '' });
      
      // Show success notification
      setNotification({
        isOpen: true,
        type: 'success',
        title: 'Vet Removed',
        message: `${confirmDelete.vetName} has been successfully removed from your team.`
      });
    } catch (err) {
      console.error("Failed to delete vet:", err);
      setNotification({
        isOpen: true,
        type: 'error',
        title: 'Deletion Failed',
        message: 'Unable to remove the veterinarian. Please try again.'
      });
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
      <div>
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
                          <div className="font-medium text-gray-900">{vet.first_name} {vet.last_name}</div>
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

      <NotificationModal
        isOpen={notification.isOpen}
        onClose={() => setNotification({ ...notification, isOpen: false })}
        type={notification.type}
        title={notification.title}
        message={notification.message}
      />

      <ConfirmationModal
        isOpen={confirmDelete.isOpen}
        onClose={() => setConfirmDelete({ isOpen: false, vetId: null, vetName: '' })}
        onConfirm={confirmDeleteVet}
        type="danger"
        title="Remove Veterinarian?"
        message={`Are you sure you want to remove ${confirmDelete.vetName}? This action cannot be undone.`}
        confirmText="Remove"
        cancelText="Cancel"
      />
    </main>
  );
}
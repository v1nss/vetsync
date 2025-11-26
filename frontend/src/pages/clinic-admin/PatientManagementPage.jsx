import { useState, useEffect } from "react";
import { FaSearch, FaPhone, FaEnvelope, FaPaw } from "react-icons/fa";
import { useAuth } from "../../context/AuthContext";

export default function PatientManagementPage() {
  const { token } = useAuth();
  const [patients, setPatients] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredPatients, setFilteredPatients] = useState([]);

  useEffect(() => {
    fetchPatients();
  }, [token]);

  useEffect(() => {
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      setFilteredPatients(
        patients.filter(
          (p) =>
            p.pet_name.toLowerCase().includes(query) ||
            p.owner_name.toLowerCase().includes(query) ||
            p.species.toLowerCase().includes(query) ||
            p.breed.toLowerCase().includes(query)
        )
      );
    } else {
      setFilteredPatients(patients);
    }
  }, [searchQuery, patients]);

  const fetchPatients = async () => {
    try {
      // const data = await fetchClinicPatients(token);
      // setPatients(data);

      // Mock data
      setPatients([
        {
          id: 1,
          pet_name: "Max",
          owner_name: "John Doe",
          owner_phone: "+63 912 345 6789",
          owner_email: "john@email.com",
          species: "Dog",
          breed: "Golden Retriever",
          age: "4 years",
          last_visit: "2025-11-15",
          total_visits: 12,
        },
        {
          id: 2,
          pet_name: "Luna",
          owner_name: "Jane Smith",
          owner_phone: "+63 917 876 5432",
          owner_email: "jane@email.com",
          species: "Cat",
          breed: "Persian",
          age: "2 years",
          last_visit: "2025-11-10",
          total_visits: 8,
        },
        {
          id: 3,
          pet_name: "Charlie",
          owner_name: "Mike Johnson",
          owner_phone: "+63 918 234 5678",
          owner_email: "mike@email.com",
          species: "Dog",
          breed: "Beagle",
          age: "3 years",
          last_visit: "2025-11-18",
          total_visits: 15,
        },
        {
          id: 4,
          pet_name: "Bella",
          owner_name: "Sarah Williams",
          owner_phone: "+63 919 345 6789",
          owner_email: "sarah@email.com",
          species: "Dog",
          breed: "Poodle",
          age: "5 years",
          last_visit: "2025-11-12",
          total_visits: 20,
        },
      ]);
    } catch (err) {
      console.error("Failed to fetch patients:", err);
    }
  };

  return (
    <main className="min-h-screen pb-10 bg-gray-50">
      <div>
        <div className="flex sm:flex-row flex-col justify-between gap-y-4 sm:items-center mb-6">
            <div>
                <h1 className="text-3xl font-bold text-gray-900">
                    Patient Management
                </h1>
                <p className="text-gray-600 mt-1">
                    View and manage your clinic's patients
                </p>
            </div>
            <div className="w-full sm:w-64 bg-white p-4 rounded-xl border border-gray-200">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-primary/10 rounded-lg">
                    <FaPaw className="text-primary text-xl" />
                    </div>
                    <div>
                    <p className="text-sm text-gray-600">Total Patients</p>
                    <p className="text-2xl font-bold text-gray-900">
                        {patients.length}
                    </p>
                    </div>
                </div>
            </div>
        </div>

        {/* Search */}
        <div className="gap-4 mb-6">
          <div className="w-full sm:max-w-md">
            <div className="flex items-center bg-white rounded-xl border border-gray-200 overflow-hidden">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by pet name, owner, species, or breed..."
                className="px-4 py-3 w-full focus:outline-none"
              />
              <div className="px-4">
                <FaSearch className="text-gray-400" />
              </div>
            </div>
          </div>
        </div>

        {/* Patients Table/Cards */}
        <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
          {filteredPatients.length === 0 ? (
            <div className="text-center py-12">
              <FaPaw className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {searchQuery ? "No patients found" : "No patients yet"}
              </h3>
              <p className="text-gray-600">
                {searchQuery
                  ? "Try a different search term"
                  : "Patients will appear here once they have appointments"}
              </p>
            </div>
          ) : (
            <>
              {/* Desktop Table */}
              <div className="hidden md:block overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Pet Name
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Owner
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Contact
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Species / Breed
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Age
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Last Visit
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Visits
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {filteredPatients.map((patient) => (
                      <tr key={patient.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="font-medium text-gray-900">
                            {patient.pet_name}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-gray-900">
                            {patient.owner_name}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex flex-col text-sm text-gray-600">
                            <div className="flex items-center gap-1">
                              <FaPhone className="text-xs" />
                              <span>{patient.owner_phone}</span>
                            </div>
                            <div className="flex items-center gap-1 mt-1">
                              <FaEnvelope className="text-xs" />
                              <span>{patient.owner_email}</span>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-gray-900">{patient.species}</div>
                          <div className="text-sm text-gray-600">
                            {patient.breed}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-gray-600">
                          {patient.age}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-gray-600">
                          {new Date(patient.last_visit).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-gray-600">
                          {patient.total_visits}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile Cards */}
              <div className="md:hidden divide-y divide-gray-200">
                {filteredPatients.map((patient) => (
                  <div key={patient.id} className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="font-semibold text-gray-900">
                          {patient.pet_name}
                        </h3>
                        <p className="text-sm text-gray-600">
                          {patient.owner_name}
                        </p>
                      </div>
                      <span className="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded-lg">
                        {patient.total_visits} visits
                      </span>
                    </div>
                    <div className="space-y-2 text-sm mb-3">
                      <div className="flex items-center gap-2 text-gray-600">
                        <FaPhone className="text-xs" />
                        <span>{patient.owner_phone}</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-600">
                        <FaEnvelope className="text-xs" />
                        <span>{patient.owner_email}</span>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-sm text-gray-600 p-3 bg-gray-50 rounded-lg">
                      <div>
                        <span className="text-gray-500">Species:</span>{" "}
                        {patient.species}
                      </div>
                      <div>
                        <span className="text-gray-500">Breed:</span>{" "}
                        {patient.breed}
                      </div>
                      <div>
                        <span className="text-gray-500">Age:</span>{" "}
                        {patient.age}
                      </div>
                      <div>
                        <span className="text-gray-500">Last Visit:</span>{" "}
                        {new Date(patient.last_visit).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </main>
  );
}

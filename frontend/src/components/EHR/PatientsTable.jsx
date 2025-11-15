import { HiDotsVertical } from "react-icons/hi";

export default function PatientsTable({patients, onSelect}){
    
    return (
      <div className="bg-white rounded-xl border border-gray-200 overflow-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr className="*:p-2">
              <th className="table-header">Patient</th>
              <th className="table-header">Species & Breed</th>
              <th className="table-header">Age</th>
              <th className="table-header">Owner</th>
              <th className="table-header">Contact</th>
              <th className="table-header">Last Visit</th>
            </tr>
          </thead>

          <tbody className="bg-white divide-y divide-gray-200">
            {patients.length === 0 ? (
                <tr>
                <td colSpan="5" className="px-6 py-12 text-center text-gray-500">
                    No patients found matching your criteria
                </td>
                </tr>
            ) : (
            patients.map((patient) => (
              <tr
                key={patient.id}
                className="hover:bg-gray-50 cursor-pointer transition truncate"
                onClick={() => onSelect(patient)}
              >
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                      <span className="text-sm font-medium text-gray-600">
                        {patient.name.charAt(0)}
                      </span>
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">{patient.name}</div>
                      <div className="text-sm text-gray-500">{patient.id}</div>
                    </div>
                  </div>
                </td>

                <td className="px-6 py-4 text-sm text-gray-900">
                  {patient.species}
                  <div className="text-gray-500">{patient.breed}</div>
                </td>

                <td className="px-6 py-4 text-sm text-gray-900 truncate">{patient.age}</td>
                <td className="px-6 py-4 text-sm text-gray-900 truncate">{patient.owner.name}</td>

                <td className="px-6 py-4">
                  <div className="text-sm text-gray-900">{patient.owner.phone}</div>
                  <div className="text-sm text-gray-500">{patient.owner.email}</div>
                </td>

                <td className="px-6 py-4 text-sm text-gray-900 truncate">{patient.lastVisit}</td>
              </tr>
            ))
            )}
          </tbody>
        </table>
      </div>
    );
}
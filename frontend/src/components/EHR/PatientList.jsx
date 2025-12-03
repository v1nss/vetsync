import React, { useState } from "react";
import { FiSearch, FiFilter } from "react-icons/fi";
import Pagination from '../../components/Pagination';
import PatientsTable from "./PatientsTable";

export default function PatientList({ patients, onSelect }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const normalize = (value) => {
    if (!value) return "";
    return String(value).toLowerCase();
  };

  const filteredPatients = patients.filter((patient) => {
    const query = normalize(searchTerm);

    const fields = [
      normalize(patient.name),
      normalize(patient.id),
      normalize(patient.owner?.name),
      normalize(patient.owner?.email),
      normalize(patient.owner?.phone),
      normalize(patient.species),
      normalize(patient.breed)
    ];

    return fields.some((field) => field.includes(query));
  });

  const patientsPerPage = 10;
  const totalPages = Math.ceil(filteredPatients.length / patientsPerPage);
  const indexOfLastPatient = currentPage * patientsPerPage;
  const indexOfFirstPatient = indexOfLastPatient - patientsPerPage;
  const currentPatients = filteredPatients.slice(indexOfFirstPatient, indexOfLastPatient);

  return (
    <div className="max-w-full mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Health Records</h1>
        <p className="text-gray-600 text-sm">
          Search and view through patient records and owner information
        </p>
      </div>

      {/* Search + Filters */}
      <div className="bg-white border border-gray-200 rounded-xl p-5 mb-6">
        <div className="flex flex-col md:flex-row md:items-center md:gap-4 gap-4">

          {/* Search Bar */}
          <div className="flex-1 relative">
            <FiSearch
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              size={20}
            />
            <input
              type="text"
              placeholder="Search patients..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl 
                        focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition"
            />
          </div>

          {/* Right-side Actions */}
          <div className="flex gap-3">

            {/* Filter Button */}
            <button
              className="w-full md:w-fit px-4 py-2.5 border border-gray-200 rounded-xl 
                        hover:bg-gray-50 transition flex items-center gap-2"
            >
              <FiFilter size={18} />
              <span className="text-sm font-medium">Filters</span>
            </button>
          </div>
        </div>
      </div>

      {/* Table
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
              <th className="table-header">Actions</th>
            </tr>
          </thead>

          <tbody className="bg-white divide-y divide-gray-200">
            {filteredPatients.map((patient) => (
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

                <td className="px-6 py-4">
                  <button className="text-gray-400 hover:text-gray-600">⋮</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div> */}
      <PatientsTable
        patients={currentPatients}
        onSelect={onSelect}
      />
      <span className="text-sm xl:hidden flex pt-2 text-gray-500 font-light">Note: Slide left to view more columns.</span>
    
      {/* Pagination */}
      <div className="flex justify-end items-center gap-2 sm:mb-0">
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={(page) => setCurrentPage(page)}
        />
      </div>
    </div>
  );
}

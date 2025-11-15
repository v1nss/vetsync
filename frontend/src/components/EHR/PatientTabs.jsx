import React from "react";
import PrescriptionsTab from "./tabs/PrescriptionsTab";
import LabResultsTab from "./tabs/LabResultsTab";
import VaccinationsTab from "./tabs/VaccinationsTab";

export default function PatientTabs({ patient, activeTab, setActiveTab }) {
  const tabs = [
    { id: "prescriptions", label: "Prescriptions" },
    { id: "lab", label: "Lab Results" },
    { id: "vaccinations", label: "Vaccinations" }
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case "prescriptions":
        return <PrescriptionsTab prescriptions={patient.prescriptions} />;
      case "lab":
        return <LabResultsTab labResults={patient.labResults} />;
      case "vaccinations":
        return <VaccinationsTab vaccinations={patient.vaccinations} />;
      default:
        return null;
    }
  };

  return (
    <div>
      {/* Tab Buttons */}
      <div className="flex justify-center gap-3 mb-6">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`py-2 px-4 text-sm flex-1 rounded-xl font-medium transition relative ${
              activeTab === tab.id
                ? "bg-primary text-white"
                : "text-gray-500 hover:bg-gray-100 hover:text-gray-700"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="rounded-xl">
        {renderTabContent()}
      </div>
    </div>
  );
}

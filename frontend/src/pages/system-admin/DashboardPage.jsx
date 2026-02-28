import { useState } from "react";
import UserActivityTab from "../../components/reports/UserActivityTab";
import AuditTrailTab from "../../components/reports/AuditTrailTab";

const TABS = [
  { key: "activity", label: "User Activity Reports" },
  { key: "audit", label: "Audit Trail Reports" },
];

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState("activity");

  return (
    <div className="min-h-screen pb-10">
      {/* Header */}
      <div className="mb-6">
        <div className="bg-linear-to-r from-primary to-[#FFB49A] px-4 py-8 sm:px-6 sm:py-10 rounded-2xl">
          <div className="text-white px-2 md:px-6">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold leading-tight mb-2">
              Dashboard
            </h1>
            <p className="text-white/90">
              System reports, user activity, and audit trail.
            </p>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex gap-3 overflow-x-auto pb-2 mb-6">
        {TABS.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`shrink-0 px-5 py-2.5 rounded-xl text-sm font-medium transition ${
              activeTab === tab.key
                ? "bg-primary text-white"
                : "border border-gray-200 bg-white/80 text-black hover:bg-gray-100"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {activeTab === "activity" && <UserActivityTab />}
      {activeTab === "audit" && <AuditTrailTab />}
    </div>
  );
}

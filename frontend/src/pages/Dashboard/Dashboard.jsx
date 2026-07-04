import { useState } from "react";
import { Calendar, Download } from "lucide-react";

import Header from "../../components/layout/Header";
import MetricCard from "../../components/ui/MetricCard";
import DashboardSatelliteMonitoring from "../../components/DashboardSatelliteMonitoring";
import MoistureStressOverview from "../../components/MoistureStressOverview";
import VegetationTrends from "../../components/VegetationTrends";
import IrrigationAdvisory from "../../components/IrrigationAdvisory";
import RecentSatelliteAnalysis from "../../components/RecentSatelliteAnalysis";

import {
  mockFields,
  mockMetrics,
} from "../../constants/dashboardData";

function Dashboard() {
  const [selectedFieldId, setSelectedFieldId] = useState("A-01");

  const fields = mockFields;
  const metrics = mockMetrics(fields);

  return (
    <div className="flex-1 flex flex-col h-screen overflow-y-auto">
      <Header />

      <main className="p-6 md:p-8 flex-1 flex flex-col gap-8 max-w-7xl w-full mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h2 className="text-[24px] font-bold text-primary-green tracking-tight">
              Farm Operations Overview
            </h2>

            <p className="text-[14px] text-text-muted mt-1 font-medium">
              Satellite-powered crop monitoring and irrigation intelligence.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button className="flex items-center justify-center gap-2 bg-white border border-[#eeeeec] rounded-lg px-3 py-2.5 text-[13px] font-medium text-text-muted shadow-sm">
              <Calendar className="w-4 h-4" />
              <span>Last 30 Days</span>
            </button>

            <button className="flex items-center justify-center gap-2 bg-primary-green text-white rounded-lg px-4 py-2.5 text-[13px] font-medium shadow-sm">
              <Download className="w-4 h-4" />
              <span>Export Report</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {metrics.map((metric, index) => (
            <MetricCard
              key={index}
              title={metric.title}
              value={metric.value}
              subtext={metric.subtext}
              iconName={metric.iconName}
              badge={metric.badge}
              alert={metric.alert}
            />
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <DashboardSatelliteMonitoring
              fields={fields}
              selectedFieldId={selectedFieldId}
              onSelectField={setSelectedFieldId}
            />
          </div>

          <div className="lg:col-span-1">
            <MoistureStressOverview />
          </div>
        </div>

        <VegetationTrends
          fields={fields}
          selectedFieldId={selectedFieldId}
          onSelectField={setSelectedFieldId}
        />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pb-8">
          <IrrigationAdvisory />
          <RecentSatelliteAnalysis />
        </div>
      </main>
    </div>
  );
}

export default Dashboard;
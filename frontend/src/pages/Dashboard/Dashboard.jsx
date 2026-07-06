import { useEffect, useState } from "react";
import {
  AlertTriangle,
  Calendar,
  Download,
} from "lucide-react";

import Header from "../../components/layout/Header";
import MetricCard from "../../components/ui/MetricCard";
import DashboardSatelliteMonitoring from "../../components/DashboardSatelliteMonitoring";
import MoistureStressOverview from "../../components/MoistureStressOverview";
import VegetationTrends from "../../components/VegetationTrends";
import IrrigationAdvisory from "../../components/IrrigationAdvisory";
import RecentSatelliteAnalysis from "../../components/RecentSatelliteAnalysis";

import { getFieldAnalysis } from "../../services/api";
import { exportAnalysisReport } from "../../utils/exportAnalysisReport";

const DEMO_FIELD = {
  id: "JAIPUR-DEMO-01",
  name: "Jaipur Demonstration Field",
  latitude: 26.9124,
  longitude: 75.7873,
  sowingDate: "2025-10-01",
};

function formatGrowthStage(value) {
  if (!value) {
    return "Unavailable";
  }

  return value
    .split("_")
    .map(
      (word) =>
        word.charAt(0).toUpperCase() +
        word.slice(1),
    )
    .join(" ");
}

function formatStatus(value) {
  if (!value) {
    return "Unavailable";
  }

  const statusLabels = {
    temporal_baseline_conflict:
      "Spectral baseline inconclusive",
    temporal_crop_inference:
      "Temporal crop inference",
    baseline_model:
      "Experimental spectral baseline",
    baseline_temporally_consistent:
      "Temporal signature consistent",
    vegetation_baseline_conflict:
      "Vegetation signature conflict",
    irrigation_required:
      "Irrigation Required",
    irrigation_not_required:
      "Irrigation Not Required",
  };

  if (statusLabels[value]) {
    return statusLabels[value];
  }

  return value
    .split("_")
    .map(
      (word) =>
        word.charAt(0).toUpperCase() +
        word.slice(1),
    )
    .join(" ");
}

function Dashboard() {
  const [analysis, setAnalysis] = useState(null);

  const [sowingDate, setSowingDate] = useState(
    DEMO_FIELD.sowingDate,
  );

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  const loadAnalysis = async (dateValue) => {
    setLoading(true);
    setError("");

    try {
      const data = await getFieldAnalysis({
        latitude: DEMO_FIELD.latitude,
        longitude: DEMO_FIELD.longitude,
        sowingDate: dateValue,
      });

      setAnalysis(data);
    } catch (requestError) {
      setAnalysis(null);

      setError(
        requestError.message ??
          "Unable to load field analysis.",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAnalysis(DEMO_FIELD.sowingDate);
  }, []);

  const handleAnalyze = () => {
    loadAnalysis(sowingDate);
  };

  const handleExportReport = () => {
  setError("");

  try {
    exportAnalysisReport({
      analysis,
      field: DEMO_FIELD,
    });
  } catch (exportError) {
    setError(
      exportError.message ??
        "Unable to export analysis report.",
    );
  }
};

const canExport =
  !loading &&
  analysis?.analysis_status ===
    "analysis_completed";

  const sowingDateWarning =
    analysis?.phenology_analysis
      ?.sowing_date_warning ?? null;

  const metrics = analysis
    ? [
        {
          title: "Crop Inference",
          value:
            analysis.crop_prediction?.crop_name ??
            "Unavailable",
          subtext: formatStatus(
            analysis.crop_prediction
              ?.prediction_status,
          ),
          iconName: "Sprout",
        },
        {
          title: "Growth Stage",
          value: formatGrowthStage(
            analysis.phenology_analysis
              ?.growth_stage,
          ),
          subtext: `${
            analysis.temporal_features
              ?.observation_count ?? 0
          } temporal observations`,
          iconName: "Activity",
        },
        {
          title: "Moisture Stress",
          value:
            analysis.moisture_stress_analysis
              ?.stress_level?.toUpperCase() ??
            "UNKNOWN",
          subtext: `Stress score: ${
            analysis.moisture_stress_analysis
              ?.stress_score ?? "N/A"
          }`,
          iconName: "Droplets",
        },
        {
          title: "8-Day Water Deficit",
          value: `${
            analysis.water_deficit_analysis
              ?.water_deficit_mm?.toFixed(1) ??
            "0.0"
          } mm`,
          subtext: formatStatus(
            analysis.water_deficit_analysis
              ?.irrigation_status,
          ),
          iconName: "Gauge",
          alert:
            analysis.water_deficit_analysis
              ?.irrigation_priority === "high",
        },
      ]
    : [];

  return (
    <div className="flex-1 flex flex-col h-screen overflow-y-auto">
      <Header />

      <main className="p-6 md:p-8 flex-1 flex flex-col gap-8 max-w-7xl w-full mx-auto">
        <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-5">
          <div>
            <h2 className="text-[24px] font-bold text-primary-green tracking-tight">
              Farm Operations Overview
            </h2>

            <p className="text-[14px] text-text-muted mt-1 font-medium">
              Sentinel-1 and Sentinel-2 crop
              monitoring and irrigation intelligence.
            </p>
          </div>

          <div className="flex flex-wrap items-end gap-3">
            <div className="flex flex-col gap-1">
              <label className="text-[10px] font-mono font-bold uppercase text-text-muted">
                Sowing Date
              </label>

              <div className="flex items-center gap-2 bg-white border border-[#eeeeec] rounded-lg px-3 py-2 shadow-sm">
                <Calendar className="w-4 h-4 text-text-muted" />

                <input
                  type="date"
                  value={sowingDate}
                  onChange={(event) =>
                    setSowingDate(event.target.value)
                  }
                  className="text-[13px] text-text-dark outline-none bg-transparent"
                />
              </div>
            </div>

            <button
              onClick={handleAnalyze}
              disabled={loading || !sowingDate}
              className="bg-primary-green text-white rounded-lg px-5 py-2.5 text-[13px] font-medium shadow-sm disabled:opacity-60"
            >
              {loading
                ? "Analyzing..."
                : "Analyze Field"}
            </button>

            <button
  type="button"
  onClick={handleExportReport}
  disabled={!canExport}
  className={`flex items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-[13px] font-medium shadow-sm transition-colors ${
    canExport
      ? "bg-white border border-primary-green text-primary-green hover:bg-emerald-50 cursor-pointer"
      : "bg-white border border-[#eeeeec] text-text-muted opacity-50 cursor-not-allowed"
  }`}
>
  <Download className="w-4 h-4" />
  <span>Export Report</span>
</button>
          </div>
        </div>

        <div className="bg-white border border-[#eeeeec] rounded-xl px-5 py-4">
          <div className="flex flex-wrap gap-x-8 gap-y-2 text-[12px]">
            <span>
              <strong>Field:</strong>{" "}
              {DEMO_FIELD.name}
            </span>

            <span>
              <strong>Latitude:</strong>{" "}
              {DEMO_FIELD.latitude}
            </span>

            <span>
              <strong>Longitude:</strong>{" "}
              {DEMO_FIELD.longitude}
            </span>

            {analysis?.analysis_date && (
              <span>
                <strong>Latest Observation:</strong>{" "}
                {analysis.analysis_date}
              </span>
            )}
          </div>
        </div>

        {sowingDateWarning && (
          <div className="flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 px-5 py-4 text-amber-800">
            <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5" />

            <div>
              <p className="text-[13px] font-semibold">
                Sowing Date Warning
              </p>

              <p className="text-[12px] mt-1 leading-relaxed">
                {sowingDateWarning}
              </p>
            </div>
          </div>
        )}

        {error && (
          <div className="rounded-xl border border-red-200 bg-red-50 px-5 py-4 text-[13px] text-accent-red">
            {error}
          </div>
        )}

        {loading && !analysis && (
          <div className="rounded-xl border border-[#eeeeec] bg-white px-5 py-10 text-center text-[13px] text-text-muted">
            Processing satellite time series and
            irrigation analysis...
          </div>
        )}

        {analysis?.analysis_status ===
          "stopped" && (
          <div className="rounded-xl border border-amber-200 bg-amber-50 px-5 py-4 text-[13px] text-accent-amber">
            Analysis stopped:{" "}
            {formatStatus(analysis.reason)}
          </div>
        )}

        {analysis?.analysis_status ===
          "analysis_completed" && (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {metrics.map((metric) => (
                <MetricCard
                  key={metric.title}
                  title={metric.title}
                  value={metric.value}
                  subtext={metric.subtext}
                  iconName={metric.iconName}
                  alert={metric.alert}
                />
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <DashboardSatelliteMonitoring
                  field={DEMO_FIELD}
                  analysis={analysis}
                />
              </div>

              <div className="lg:col-span-1">
                <MoistureStressOverview
                  analysis={analysis}
                />
              </div>
            </div>

            <VegetationTrends
              analysis={analysis}
            />

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pb-8">
              <IrrigationAdvisory
                analysis={analysis}
              />

              <RecentSatelliteAnalysis
                analysis={analysis}
              />
            </div>
          </>
        )}
      </main>
    </div>
  );
}

export default Dashboard;
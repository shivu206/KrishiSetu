import { jsPDF } from "jspdf";

function formatValue(value, digits = 2) {
  if (
    value === null ||
    value === undefined
  ) {
    return "N/A";
  }

  if (typeof value === "number") {
    return value.toFixed(digits);
  }

  return String(value);
}

function formatLabel(value) {
  if (!value) {
    return "Unavailable";
  }

  return String(value)
    .replaceAll("_", " ")
    .split(" ")
    .map(
      (word) =>
        word.charAt(0).toUpperCase() +
        word.slice(1),
    )
    .join(" ");
}

export function exportAnalysisReport({
  analysis,
  field,
}) {
  if (!analysis) {
    throw new Error(
      "No field analysis is available to export.",
    );
  }

  if (
    analysis.analysis_status !==
    "analysis_completed"
  ) {
    throw new Error(
      "Only completed field analyses can be exported.",
    );
  }

  const document = new jsPDF();

  const crop = analysis.crop_prediction;
  const phenology = analysis.phenology_analysis;
  const stress =
    analysis.moisture_stress_analysis;
  const weather = analysis.weather_analysis;
  const water =
    analysis.water_deficit_analysis;
  const vegetation =
    analysis.vegetation_analysis;

  let y = 20;

  const addSectionTitle = (title) => {
    if (y > 260) {
      document.addPage();
      y = 20;
    }

    document.setFont("helvetica", "bold");
    document.setFontSize(13);
    document.text(title, 20, y);

    y += 8;
  };

  const addRow = (label, value) => {
    if (y > 275) {
      document.addPage();
      y = 20;
    }

    document.setFont("helvetica", "normal");
    document.setFontSize(10);

    document.text(label, 25, y);

    document.setFont("helvetica", "bold");

    document.text(
      String(value),
      100,
      y,
    );

    y += 6;
  };

  document.setFont("helvetica", "bold");
  document.setFontSize(20);

  document.text(
    "KrishiSetu",
    20,
    y,
  );

  y += 8;

  document.setFont("helvetica", "normal");
  document.setFontSize(11);

  document.text(
    "Satellite-Driven Crop and Irrigation Intelligence",
    20,
    y,
  );

  y += 6;

  document.setFontSize(9);

  document.text(
    "Sentinel-1 and Sentinel-2 Multi-Temporal Analysis Report",
    20,
    y,
  );

  y += 12;

  document.line(
    20,
    y,
    190,
    y,
  );

  y += 10;

  addSectionTitle("Field Information");

  addRow(
    "Field",
    field?.name ?? "Unknown Field",
  );

  addRow(
    "Field ID",
    field?.id ?? "N/A",
  );

  addRow(
    "Latitude",
    formatValue(
      analysis.latitude,
      4,
    ),
  );

  addRow(
    "Longitude",
    formatValue(
      analysis.longitude,
      4,
    ),
  );

  addRow(
    "Sowing Date",
    analysis.sowing_date ?? "N/A",
  );

  addRow(
    "Latest Observation",
    analysis.analysis_date ?? "N/A",
  );

  y += 6;

  addSectionTitle("Crop Inference");

  addRow(
    "Predicted Crop",
    crop?.crop_name ?? "Unavailable",
  );

  addRow(
    "Inference Status",
    formatLabel(
      crop?.prediction_status,
    ),
  );

  addRow(
    "Confidence",
    crop?.confidence !== null &&
      crop?.confidence !== undefined
      ? `${(
          crop.confidence * 100
        ).toFixed(1)}%`
      : "N/A",
  );

  y += 6;

  addSectionTitle("Phenology Analysis");

  addRow(
    "Growth Stage",
    formatLabel(
      phenology?.growth_stage,
    ),
  );

  addRow(
    "Current NDVI",
    formatValue(
      phenology?.current_ndvi,
      3,
    ),
  );

  addRow(
    "Peak NDVI",
    formatValue(
      phenology?.peak_ndvi,
      3,
    ),
  );

  addRow(
    "Temporal Observations",
    phenology?.observation_count ?? "N/A",
  );

  y += 6;

  addSectionTitle("Moisture Stress Analysis");

  addRow(
    "Stress Level",
    formatLabel(
      stress?.stress_level,
    ),
  );

  addRow(
    "Stress Score",
    stress?.stress_score ?? "N/A",
  );

  addRow(
    "Current NDMI",
    formatValue(
      stress?.current_ndmi,
      3,
    ),
  );

  addRow(
    "SAR Supported",
    stress?.radar_supported
      ? "Yes"
      : "No",
  );

  y += 6;

  addSectionTitle("8-Day Irrigation Advisory");

  addRow(
    "Estimated Water Deficit",
    `${formatValue(
      water?.water_deficit_mm,
      1,
    )} mm`,
  );

  addRow(
    "Crop Water Demand",
    `${formatValue(
      water?.crop_water_demand_mm,
      1,
    )} mm`,
  );

  addRow(
    "Rainfall",
    `${formatValue(
      weather?.rainfall_mm_8day,
      1,
    )} mm`,
  );

  addRow(
    "Reference ET0",
    `${formatValue(
      weather?.reference_et_mm_8day,
      2,
    )} mm`,
  );

  addRow(
    "Crop Coefficient",
    formatValue(
      water?.crop_coefficient,
      2,
    ),
  );

  addRow(
    "Irrigation Advisory",
    formatLabel(
      water?.irrigation_status,
    ),
  );

  addRow(
    "Irrigation Priority",
    formatLabel(
      water?.irrigation_priority,
    ),
  );

  y += 6;

  addSectionTitle("Satellite Observation Summary");

  addRow(
    "Sentinel-2 Observations",
    analysis.observation_count ?? 0,
  );

  addRow(
    "Sentinel-1 Supported Observations",
    analysis.radar_supported_count ?? 0,
  );

  addRow(
    "Vegetation Detected",
    vegetation?.vegetation_detected
      ? "Yes"
      : "No",
  );

  if (phenology?.sowing_date_warning) {
    y += 6;

    addSectionTitle("Analysis Warning");

    const warningLines =
      document.splitTextToSize(
        phenology.sowing_date_warning,
        160,
      );

    document.setFont(
      "helvetica",
      "normal",
    );

    document.setFontSize(9);

    document.text(
      warningLines,
      25,
      y,
    );

    y += warningLines.length * 5;
  }

  y += 10;

  document.setFont(
    "helvetica",
    "italic",
  );

  document.setFontSize(8);

  const disclaimer =
    "This report is generated from Sentinel-1, Sentinel-2 and weather-derived analysis. Irrigation recommendations are decision-support estimates and should be interpreted with local field conditions.";

  const disclaimerLines =
    document.splitTextToSize(
      disclaimer,
      170,
    );

  document.text(
    disclaimerLines,
    20,
    y,
  );

  const safeFieldName = (
    field?.name ?? "field"
  )
    .replaceAll(" ", "_")
    .replace(
      /[^a-zA-Z0-9_-]/g,
      "",
    );

  document.save(
    `KrishiSetu_${safeFieldName}_${analysis.analysis_date}.pdf`,
  );
}
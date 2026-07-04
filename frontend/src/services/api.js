const API_BASE_URL = "http://127.0.0.1:8000/api";

export async function getFields() {
  const response = await fetch(`${API_BASE_URL}/fields`);

  if (!response.ok) {
    throw new Error("Failed to fetch field data");
  }

  const data = await response.json();

  return data.fields;
}

export async function getSatelliteAnalysis() {
  const response = await fetch(`${API_BASE_URL}/satellite-analysis`);

  if (!response.ok) {
    throw new Error("Failed to fetch satellite analysis");
  }

  const data = await response.json();

  return data.analyses;
}
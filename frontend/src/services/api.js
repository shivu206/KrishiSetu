const API_BASE_URL = "http://127.0.0.1:8000";

export async function getFieldAnalysis({
  latitude,
  longitude,
  sowingDate,
}) {
  const parameters = new URLSearchParams({
    latitude: String(latitude),
    longitude: String(longitude),
    sowing_date: sowingDate,
  });

  const response = await fetch(
    `${API_BASE_URL}/api/analysis?${parameters.toString()}`,
  );

  if (!response.ok) {
    let message = "Field analysis failed.";

    try {
      const errorData = await response.json();

      if (errorData.detail) {
        message = errorData.detail;
      }
    } catch {
      message = `Field analysis failed with status ${response.status}.`;
    }

    throw new Error(message);
  }

  return response.json();
}
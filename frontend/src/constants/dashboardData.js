export const mockFields = [
  {
    id: "A-01",
    name: "Field A-01 (Wheat)",
    cropType: "Wheat",
    status: "Healthy",
    areaHa: 86.4,
    ndviTrend: [
      0.65, 0.68, 0.7, 0.72, 0.75, 0.78, 0.81, 0.79, 0.78, 0.8,
      0.82, 0.81, 0.83, 0.84, 0.85,
    ],
    ndwiTrend: [
      0.45, 0.46, 0.48, 0.49, 0.52, 0.54, 0.55, 0.53, 0.52, 0.53,
      0.55, 0.54, 0.56, 0.57, 0.58,
    ],
    dates: [
      "Jun 20",
      "Jun 21",
      "Jun 22",
      "Jun 23",
      "Jun 24",
      "Jun 25",
      "Jun 26",
      "Jun 27",
      "Jun 28",
      "Jun 29",
      "Jun 30",
      "Jul 01",
      "Jul 02",
      "Jul 03",
      "Jul 04",
    ],
    lastAnalysisDate: "JUL 04, 2026",
    moistureLevel: 78,
    coordinates: { x: 38, y: 45 },
    color: "#2c694e",
  },
  {
    id: "A-02",
    name: "Field A-02 (Mustard)",
    cropType: "Mustard",
    status: "High Stress",
    areaHa: 54.2,
    ndviTrend: [
      0.55, 0.52, 0.5, 0.47, 0.45, 0.42, 0.38, 0.35, 0.32, 0.3,
      0.29, 0.28, 0.26, 0.25, 0.24,
    ],
    ndwiTrend: [
      0.3, 0.27, 0.24, 0.21, 0.18, 0.14, 0.11, 0.08, 0.05, 0.02,
      -0.01, -0.04, -0.08, -0.12, -0.15,
    ],
    dates: [
      "Jun 20",
      "Jun 21",
      "Jun 22",
      "Jun 23",
      "Jun 24",
      "Jun 25",
      "Jun 26",
      "Jun 27",
      "Jun 28",
      "Jun 29",
      "Jun 30",
      "Jul 01",
      "Jul 02",
      "Jul 03",
      "Jul 04",
    ],
    lastAnalysisDate: "JUL 04, 2026",
    moistureLevel: 28,
    coordinates: { x: 48, y: 58 },
    color: "#ba1a1a",
  },
  {
    id: "B-01",
    name: "Field B-01 (Barley)",
    cropType: "Barley",
    status: "Moderate",
    areaHa: 108.0,
    ndviTrend: [
      0.58, 0.59, 0.6, 0.59, 0.57, 0.55, 0.54, 0.52, 0.5, 0.49,
      0.51, 0.52, 0.53, 0.52, 0.5,
    ],
    ndwiTrend: [
      0.38, 0.39, 0.4, 0.38, 0.36, 0.33, 0.31, 0.28, 0.26, 0.24,
      0.27, 0.29, 0.3, 0.29, 0.27,
    ],
    dates: [
      "Jun 20",
      "Jun 21",
      "Jun 22",
      "Jun 23",
      "Jun 24",
      "Jun 25",
      "Jun 26",
      "Jun 27",
      "Jun 28",
      "Jun 29",
      "Jun 30",
      "Jul 01",
      "Jul 02",
      "Jul 03",
      "Jul 04",
    ],
    lastAnalysisDate: "JUL 03, 2026",
    moistureLevel: 49,
    coordinates: { x: 59, y: 64 },
    color: "#d97706",
  },
];

export const mockMetrics = (fields) => {
  const totalArea = fields
    .reduce((sum, field) => sum + field.areaHa, 0)
    .toFixed(1);

  return [
    {
      title: "TOTAL FIELDS",
      value: fields.length.toString(),
      subtext: `${totalArea} ha`,
      iconName: "LayoutGrid",
    },
    {
      title: "HEALTHY CROPS",
      value: "78%",
      subtext: "Optimal growth state",
      iconName: "TrendingUp",
      badge: "+4.2%",
    },
    {
      title: "MOISTURE STRESS ALERTS",
      value: "1",
      subtext: "Field requires attention",
      iconName: "AlertTriangle",
      alert: true,
    },
    {
      title: "IRRIGATION DUE",
      value: "2",
      subtext: "Fields in next 48h",
      iconName: "Clock",
    },
  ];
};

export const recentSatellitePasses = [
  {
    date: "JUL 04, 2026",
    sensor: "SENTINEL-2",
    cloudCover: 1.2,
    ndviAverage: 0.72,
    status: "optimal",
  },
  {
    date: "JUL 03, 2026",
    sensor: "SENTINEL-1",
    polarization: "VV/VH",
    status: "optimal",
  },
  {
    date: "JUN 29, 2026",
    sensor: "SENTINEL-2",
    cloudCover: 8.4,
    ndviAverage: 0.69,
    status: "optimal",
  },
  {
    date: "JUN 28, 2026",
    sensor: "SENTINEL-1",
    polarization: "VV/VH",
    status: "optimal",
  },
];
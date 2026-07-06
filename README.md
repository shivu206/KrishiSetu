# KrishiSetu

**Satellite-Driven Crop Monitoring and Irrigation Decision Support System**

KrishiSetu is a full-stack satellite analytics and agricultural decision-support prototype built using **Python, FastAPI, React, Machine Learning, Sentinel-1 SAR, Sentinel-2 optical imagery, remote sensing, temporal data analysis, and weather data integration**.

The system processes multi-temporal satellite observations to detect vegetation signatures, extract vegetation and moisture indicators, perform experimental crop inference, identify crop growth stages, estimate moisture stress, calculate an 8-day crop water deficit, and generate irrigation advisories.

KrishiSetu combines **optical satellite imagery, Synthetic Aperture Radar (SAR), machine learning, temporal feature engineering, REST API development, and interactive data visualization** in an end-to-end crop monitoring pipeline.

---

## Problem Statement

Crop monitoring and irrigation planning require timely information about vegetation growth, crop moisture conditions, and crop water demand.

Traditional field-level assessment can depend on manual observations and sparse ground measurements. Satellite Earth observation provides repeated measurements of agricultural areas using optical and microwave sensors.

KrishiSetu explores an automated workflow for:

- Crop type inference
- Vegetation signature detection
- Crop phenology and growth-stage analysis
- Moisture stress detection
- Multi-temporal satellite analysis
- 8-day crop water deficit estimation
- Weather-informed irrigation advisory generation

The prototype uses **Sentinel-1 and Sentinel-2 satellite observations** together with rainfall and reference evapotranspiration data.

---

## Key Features

- Multi-temporal Sentinel-2 optical imagery processing
- Sentinel-1 Synthetic Aperture Radar processing
- NDVI vegetation index calculation
- NDMI moisture index calculation
- VV and VH radar backscatter analysis
- VH/VV radar ratio extraction
- Optical and SAR temporal data fusion
- Vegetation signature detection
- Temporal feature engineering
- Random Forest crop classification baseline
- Temporal consistency validation for crop inference
- Crop phenology and growth-stage detection
- Moisture stress estimation
- Historical weather API integration
- FAO reference evapotranspiration analysis
- 8-day crop water deficit estimation
- Irrigation priority generation
- Sowing-date consistency validation
- Edge-case and insufficient-data handling
- FastAPI REST API backend
- React and Vite frontend dashboard
- Leaflet-based field visualization
- Satellite vegetation and moisture trend visualization
- PDF analysis report generation

---

## Technology Stack

### Backend

- Python
- FastAPI
- NumPy
- Rasterio
- scikit-learn
- Joblib
- Requests
- Uvicorn

### Frontend

- React
- JavaScript
- Vite
- Tailwind CSS
- Leaflet
- React Leaflet
- Lucide React
- jsPDF

### Machine Learning

- Random Forest Classifier
- scikit-learn
- Temporal feature engineering
- Spectral feature analysis
- Model serialization using Joblib

### Remote Sensing and Earth Observation

- Sentinel-1 SAR
- Sentinel-2 Multispectral Imagery
- NDVI
- NDMI
- VV Backscatter
- VH Backscatter
- VH/VV Ratio
- Multi-temporal satellite analysis
- Optical and microwave data fusion

### Weather and Irrigation Analysis

- Open-Meteo Historical Weather API
- Rainfall data
- FAO Reference Evapotranspiration (ET0)
- Crop coefficient-based water demand
- 8-day crop water deficit estimation

---

## System Workflow

```text
Field Location + Sowing Date
             |
             v
    Sentinel-2 Time Series
      B04 + B08 + B11
             |
             v
       NDVI + NDMI
             |
             +-----------------------+
             |                       |
             |                       v
             |              Sentinel-1 Time Series
             |                VV + VH Backscatter
             |                       |
             |                       v
             |                 VH/VV Ratio
             |                       |
             +-----------+-----------+
                         |
                         v
              Temporal Satellite Fusion
                         |
                         v
              Vegetation Signature Check
                         |
                         v
              Temporal Feature Extraction
                         |
              +----------+----------+
              |                     |
              v                     v
       Crop Inference       Phenology Detection
                                    |
                                    v
                         Moisture Stress Analysis
                                    |
                                    v
                          Weather Data Integration
                          Rainfall + Reference ET0
                                    |
                                    v
                         8-Day Water Deficit
                                    |
                                    v
                         Irrigation Advisory
                                    |
                                    v
                    React Dashboard + PDF Report
```

---

## Sentinel-2 Optical Processing

KrishiSetu processes multi-temporal Sentinel-2 raster observations.

The optical processing pipeline uses:

- **B04 - Red Band**
- **B08 - Near Infrared Band**
- **B11 - Short-Wave Infrared Band**
- **Scene Classification Layer (SCL)** for pixel masking

Raster data is processed using **Rasterio** and **NumPy**.

### NDVI

The Normalized Difference Vegetation Index is calculated as:

```text
NDVI = (NIR - Red) / (NIR + Red)
```

NDVI is used to analyze:

- Vegetation presence
- Vegetation persistence
- Crop growth dynamics
- Temporal vegetation trends
- Peak vegetation activity

### NDMI

The Normalized Difference Moisture Index is calculated as:

```text
NDMI = (NIR - SWIR) / (NIR + SWIR)
```

NDMI is used as an optical indicator of vegetation moisture conditions.

For every valid Sentinel-2 observation, the pipeline extracts:

- Mean NDVI
- Minimum NDVI
- Maximum NDVI
- Mean NDMI
- Minimum NDMI
- Maximum NDMI
- Valid pixel count

---

## Sentinel-1 SAR Processing

KrishiSetu uses Sentinel-1 Synthetic Aperture Radar observations to provide microwave-based field information.

The SAR processing pipeline analyzes:

- VV backscatter
- VH backscatter
- VH/VV ratio

The following statistical features are extracted:

- Mean VV backscatter
- Minimum VV backscatter
- Maximum VV backscatter
- Mean VH backscatter
- Minimum VH backscatter
- Maximum VH backscatter
- Mean VH/VV ratio
- Valid radar pixel count

SAR observations provide additional radar support for moisture-stress analysis.

---

## Optical and Radar Temporal Fusion

Sentinel-1 and Sentinel-2 observations are acquired on different dates.

KrishiSetu performs temporal fusion by matching each optical observation with the latest eligible radar observation.

A Sentinel-1 observation is used only when:

- The radar observation does not occur after the optical observation.
- The radar observation falls within the configured maximum radar-age window.

Each fused observation can contain:

- NDVI statistics
- NDMI statistics
- VV backscatter statistics
- VH backscatter statistics
- VH/VV ratio
- Radar observation date
- Radar age in days
- Radar availability status

This creates a unified multi-temporal optical and microwave satellite sequence.

---

## Vegetation Signature Detection

Before crop analysis, KrishiSetu verifies whether the satellite time series contains a persistent vegetation signature.

The vegetation detector evaluates:

- Observation count
- Vegetated observation count
- Vegetated fraction
- Peak NDVI
- Mean NDVI

If no meaningful vegetation signature is detected, downstream crop analysis is stopped.

This prevents crop, phenology, moisture-stress, and irrigation results from being generated for non-vegetated observations.

---

## Temporal Feature Engineering

KrishiSetu analyzes the complete available satellite observation sequence rather than relying only on a single satellite image.

The temporal feature extraction pipeline derives:

### NDVI Features

- NDVI mean
- NDVI minimum
- NDVI maximum
- NDVI standard deviation
- Current NDVI
- Full NDVI trend
- Recent NDVI trend

### NDMI Features

- NDMI mean
- NDMI minimum
- NDMI maximum
- NDMI standard deviation
- Current NDMI
- Full NDMI trend
- Recent NDMI trend

### Vegetation Dynamics

- Peak NDVI observation index
- Current-to-peak NDVI ratio
- Vegetation persistence
- Days after supplied sowing date

### Radar Features

- Radar support availability
- Mean VH/VV ratio

These temporal features are used by crop inference, phenology detection, and moisture-stress analysis.

---

## Machine Learning-Based Crop Inference

KrishiSetu contains an experimental crop classification baseline implemented using a **Random Forest Classifier** from **scikit-learn**.

The serialized machine learning model is loaded using **Joblib**.

The current baseline uses:

- NDVI
- NDMI

The classifier produces:

- Predicted crop label
- Predicted crop name
- Prediction confidence
- Model metadata

### Temporal Consistency Validation

A two-feature spectral classifier can produce ambiguous crop predictions.

KrishiSetu therefore performs an additional temporal consistency check using:

- Vegetation detection status
- Vegetation persistence
- Peak NDVI
- Baseline crop prediction

For example, if the Random Forest baseline predicts a fallow class while the multi-temporal satellite sequence contains persistent vegetation and a strong NDVI peak, KrishiSetu does not display the fallow prediction as a confirmed crop class.

The system returns:

```text
Crop Type Uncertain
```

with a temporal-baseline conflict status.

This validation layer prevents contradictory crop and vegetation states from being presented as confident crop predictions.

---

## Crop Phenology and Growth-Stage Detection

KrishiSetu estimates crop growth stage using the multi-temporal satellite vegetation signature.

The phenology detector analyzes:

- Current NDVI
- Peak NDVI
- Peak observation position
- Current-to-peak NDVI ratio
- Recent NDVI trend
- Temporal observation count

The current prototype identifies growth-stage conditions from observed vegetation dynamics.

The supplied sowing date is used as temporal context.

If the supplied sowing date is inconsistent with the active vegetation cycle detected by satellite observations, KrishiSetu generates a sowing-date warning.

In this case, growth-stage inference is based on the observed satellite temporal signature.

---

## Moisture Stress Detection

The moisture-stress analysis combines optical moisture indicators, vegetation trends, phenology information, and available SAR support.

The detector evaluates:

- Current NDMI
- Mean NDMI
- Recent NDMI trend
- Recent NDVI trend
- Detected growth stage
- Sentinel-1 radar support
- Mean VH/VV ratio

The output contains:

- Moisture stress level
- Stress score
- Growth stage
- Current NDMI
- Mean NDMI
- Recent moisture trend
- Recent vegetation trend
- Radar support status
- Radar ratio information

---

## Weather Data Integration

KrishiSetu integrates historical weather data using the Open-Meteo Historical Weather API.

For the latest satellite analysis date, the system retrieves an 8-day weather period containing:

- Daily precipitation
- FAO reference evapotranspiration

The pipeline calculates:

- 8-day accumulated rainfall
- 8-day accumulated reference evapotranspiration

The weather service contains retry handling for temporary API or network failures.

A fallback weather observation is available when live weather retrieval cannot be completed.

---

## 8-Day Crop Water Deficit Estimation

KrishiSetu estimates crop water demand using reference evapotranspiration and a growth-stage crop coefficient.

### Crop Water Demand

```text
Crop Water Demand = Kc × ET0
```

Where:

- `Kc` is the crop coefficient associated with the detected growth stage.
- `ET0` is FAO reference evapotranspiration.

### Water Deficit

```text
Water Deficit = Crop Water Demand - Effective Rainfall
```

The calculated deficit is constrained to prevent negative irrigation demand.

The irrigation advisory uses:

- Crop water demand
- Effective rainfall
- Estimated water deficit
- Moisture stress level

The system generates:

- Irrigation status
- Irrigation priority

The dashboard displays the estimated 8-day water deficit and weather-informed irrigation advisory.

---

## Edge-Case Handling and Pipeline Validation

KrishiSetu includes explicit failure-state handling to prevent invalid downstream predictions.

### No Satellite Observations

If no satellite observations are available after the supplied sowing date, the analysis pipeline returns:

```text
no_satellite_observations
```

Crop inference, phenology detection, moisture-stress estimation, and irrigation advisory generation are not executed.

### Insufficient Temporal Data

If the available satellite sequence is insufficient for temporal feature extraction, the pipeline returns:

```text
insufficient_temporal_data
```

The dashboard stops downstream analysis and does not display fabricated crop or irrigation results.

### Inconsistent Sowing Date

If the supplied sowing date is inconsistent with the detected active vegetation cycle, the pipeline generates a warning.

Growth-stage inference continues using the observed satellite temporal signature.

---

## REST API Backend

The backend is implemented using **FastAPI**.

The field analysis API accepts:

- Latitude
- Longitude
- Sowing date

The API executes the complete satellite analysis pipeline and returns structured JSON containing:

- Analysis status
- Field coordinates
- Sowing date
- Latest analysis date
- Vegetation analysis
- Temporal features
- Crop prediction
- Phenology analysis
- Moisture-stress analysis
- Weather analysis
- Water-deficit analysis
- Observation count
- Radar-supported observation count
- Fused satellite observations

FastAPI CORS middleware is configured for local frontend development.

---

## React Dashboard

The frontend is implemented using **React and Vite**.

The dashboard provides:

- Field information
- Sowing-date input
- Crop inference summary
- Growth-stage summary
- Moisture-stress status
- 8-day water-deficit summary
- Field map visualization
- Vegetation and moisture trend chart
- Irrigation advisory
- Recent satellite observation analysis
- Sowing-date warning visualization
- Analysis failure-state visualization
- PDF report export

Field visualization is implemented using **Leaflet and React Leaflet**.

---

## PDF Analysis Report

KrishiSetu can export completed field analyses as PDF reports using **jsPDF**.

The generated report contains:

- Field information
- Crop inference
- Phenology analysis
- Moisture-stress analysis
- 8-day irrigation advisory
- Weather indicators
- Satellite observation summary
- Analysis warnings

Reports are generated only for successfully completed analyses.

---

## Project Structure

```text
KrishiSetu/
|
|-- backend/
|   |-- main.py
|   |-- requirements.txt
|   |
|   |-- models/
|   |   `-- Model artifact stored locally
|   |
|   `-- processing/
|       |-- agrifieldnet_loader.py
|       |-- analysis_service.py
|       |-- crop_predictor.py
|       |-- moisture_stress_detector.py
|       |-- phenology_detector.py
|       |-- sentinel1_processor.py
|       |-- sentinel1_timeseries.py
|       |-- sentinel2_processor.py
|       |-- sentinel2_timeseries.py
|       |-- temporal_feature_extractor.py
|       |-- temporal_fusion.py
|       |-- vegetation_detector.py
|       |-- water_deficit_advisor.py
|       `-- weather_service.py
|
|-- frontend/
|   |-- package.json
|   |-- package-lock.json
|   |-- vite.config.js
|   |-- index.html
|   |
|   `-- src/
|       |-- App.jsx
|       |-- main.jsx
|       |
|       |-- components/
|       |-- pages/
|       |-- services/
|       `-- utils/
|
|-- .gitignore
`-- README.md
```

---

## Installation and Setup

### Prerequisites

Install:

- Python 3
- Node.js
- npm

---

## Backend Setup

Navigate to the backend directory:

```bash
cd backend
```

Create a Python virtual environment:

```bash
python -m venv .venv
```

Activate the virtual environment on Windows:

```bash
.venv\Scripts\activate
```

Install Python dependencies:

```bash
pip install -r requirements.txt
```

Start the FastAPI development server:

```bash
uvicorn main:app --reload
```

The backend API runs at:

```text
http://127.0.0.1:8000
```

FastAPI interactive API documentation is available at:

```text
http://127.0.0.1:8000/docs
```

---

## Frontend Setup

Open another terminal and navigate to the frontend directory:

```bash
cd frontend
```

Install Node.js dependencies:

```bash
npm install
```

Start the Vite development server:

```bash
npm run dev
```

Open the local development URL displayed by Vite.

---

## Local Satellite Data

Raw satellite GeoTIFF raster observations are intentionally excluded from the Git repository because satellite imagery files can be large.
The trained crop classification model artifact is also excluded from the public repository because of its large file size. The backend expects the serialized model at `backend/models/crop_classifier.joblib`.

The backend expects satellite observations under:

```text
backend/satellite_data/
```

The expected high-level structure is:

```text
satellite_data/
|-- sentinel1/
`-- sentinel2/
```

Sentinel-1 and Sentinel-2 observations are processed from locally available raster data.

The development satellite dataset is not committed to the public repository.

---

## Current Prototype Limitations

- Crop classification uses an experimental NDVI and NDMI Random Forest baseline.
- The current crop classifier is not presented as a production-grade crop identification model.
- Crop classification performance depends on representative labelled agricultural training data.
- Satellite raster observations are processed from locally available data.
- The dashboard currently uses a demonstration field configuration.
- Crop coefficients are stage-based prototype coefficients.
- Soil texture and soil water-holding capacity are not currently integrated.
- Previously applied irrigation events are not included in the water-balance calculation.
- Irrigation advisory outputs are decision-support estimates and should be interpreted with local field conditions.

---

## Future Enhancements

- Automated Sentinel-1 and Sentinel-2 data acquisition
- Interactive field polygon and Area of Interest selection
- User-managed agricultural fields
- Multi-temporal crop classification models
- Regional ground-truth training datasets
- Crop-specific phenology models
- Soil texture integration
- Soil water-holding capacity modelling
- Irrigation event tracking
- Canal command and command-area GIS layer integration
- Near-real-time satellite processing
- Spatial moisture-stress maps
- Spatial irrigation advisory maps
- Cloud deployment
- Persistent database integration
- Authentication and field management
- Scalable geospatial processing pipeline

---

## Skills and Engineering Concepts Demonstrated

This project demonstrates practical experience with:

- Python backend development
- FastAPI REST API development
- React frontend development
- Full-stack application development
- Machine learning
- Random Forest classification
- scikit-learn
- Feature engineering
- Time-series analysis
- Multi-temporal data processing
- Remote sensing
- Geospatial raster processing
- Rasterio
- NumPy
- Sentinel-1 SAR data
- Sentinel-2 multispectral imagery
- Synthetic Aperture Radar
- Optical and microwave data fusion
- NDVI and NDMI analysis
- Crop monitoring
- Phenology analysis
- Moisture-stress detection
- Weather API integration
- Reference evapotranspiration
- Irrigation decision support
- REST API integration
- Data visualization
- Leaflet mapping
- PDF report generation
- Error handling
- Edge-case validation
- Modular software architecture

---

## Disclaimer

KrishiSetu is a prototype satellite-driven agricultural decision-support system.

Crop inference and irrigation advisory outputs are experimental estimates and should be interpreted alongside local field conditions, agronomic knowledge, and available ground observations.
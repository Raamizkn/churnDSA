# Customer Churn Prediction System

A comprehensive solution for predicting customer churn risk and providing actionable retention strategies for e-commerce businesses.

## Project Overview

This system predicts customer churn risk in real-time and suggests targeted retention strategies to help businesses reduce customer attrition. The architecture includes:

- **Data Layer**: Data ingestion, cleaning, and storage using a relational database
- **ML Pipeline**: Model training using Logistic Regression, Random Forest, and XGBoost
- **Model Serving API**: A Flask-based REST API for real-time prediction requests
- **Interactive Front End**: A business-facing web application built in React (TypeScript)

## Project Structure

```
churnDSA/
├── data/                  # Data storage and processing
│   ├── raw/               # Raw data files
│   └── processed/         # Processed data files
├── models/                # Trained model artifacts
├── notebooks/             # Jupyter notebooks for exploration and model development
├── backend/               # Flask API for model serving
│   ├── app.py             # Main Flask application
│   ├── models/            # Model loading and prediction logic
│   ├── database/          # Database models and connections
│   └── utils/             # Utility functions
├── frontend/              # React TypeScript frontend
│   ├── public/            # Static files
│   ├── src/               # Source code
│   ├── package.json       # Dependencies
│   └── tsconfig.json      # TypeScript configuration
├── docker/                # Docker configuration files
│   ├── Dockerfile.api     # Dockerfile for the Flask API
│   ├── Dockerfile.frontend # Dockerfile for the React frontend
│   └── docker-compose.yml # Docker Compose configuration
└── requirements.txt       # Python dependencies
```

## Setup Instructions

### Prerequisites
- Python 3.8+
- Node.js 14+
- Docker and Docker Compose (optional for containerized deployment)

### Backend Setup
1. Create a virtual environment:
   ```
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

2. Install dependencies:
   ```
   pip install -r requirements.txt
   ```

3. Run the Flask API:
   ```
   cd backend
   python app.py
   ```

### Frontend Setup
1. Install dependencies:
   ```
   cd frontend
   npm install
   ```

2. Run the development server:
   ```
   npm start
   ```

### Using Docker (Optional)
1. Build and start the containers:
   ```
   docker-compose up --build
   ```

## Usage
Once both the backend and frontend are running:
1. Access the web interface at http://localhost:3000
2. Input customer data to get churn predictions and retention strategies
3. View visualizations and analytics on the dashboard

## License
[MIT License](LICENSE) 
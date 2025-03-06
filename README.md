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

### Option 1: Using Docker (Recommended)

The easiest way to run the application is using Docker:

1. Make sure Docker and Docker Compose are installed on your system.

2. Clone the repository:
   ```
   git clone <repository-url>
   cd churnDSA
   ```

3. Build and start the containers:
   ```
   docker-compose up --build
   ```

4. Access the application:
   - Frontend: http://localhost
   - Backend API: http://localhost:5000

### Option 2: Manual Setup

#### Backend Setup
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

#### Frontend Setup
1. Install dependencies:
   ```
   cd frontend
   npm install
   ```

2. Run the development server:
   ```
   npm start
   ```

## Usage
Once both the backend and frontend are running:
1. Access the web interface at http://localhost:3000 (or http://localhost if using Docker)
2. Input customer data to get churn predictions and retention strategies
3. View visualizations and analytics on the dashboard

## API Endpoints

The backend API provides the following endpoints:

- `GET /health`: Health check endpoint
- `POST /predict`: Predict churn for a customer
- `GET /strategies`: Get retention strategies for a risk segment
- `GET /customer/:id`: Get customer data and prediction history

## Data Processing and Model Training

The project includes Jupyter notebooks for data exploration and model training:

1. `notebooks/01_data_exploration.ipynb`: Exploratory data analysis of the Telco Customer Churn dataset
2. `notebooks/02_model_training.ipynb`: Training and evaluation of machine learning models

## Docker Deployment

The project includes Docker configuration for easy deployment:

- `docker/Dockerfile.api`: Dockerfile for the Flask backend
- `docker/Dockerfile.frontend`: Dockerfile for the React frontend
- `docker/nginx.conf`: Nginx configuration for the frontend
- `docker-compose.yml`: Docker Compose configuration for orchestrating the services

## License
[MIT License](LICENSE) 
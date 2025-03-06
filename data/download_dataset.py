import os
import requests
import pandas as pd
import numpy as np
from pathlib import Path

# Create directories if they don't exist
raw_dir = Path('raw')
processed_dir = Path('processed')
raw_dir.mkdir(exist_ok=True)
processed_dir.mkdir(exist_ok=True)

# Set a fixed number of customers for consistency
num_customers = 7043

# Demographics table
demographics = pd.DataFrame({
    'CustomerID': range(1, num_customers + 1),
    'Count': [1] * num_customers,
    'Gender': np.random.choice(['Male', 'Female'], size=num_customers),
    'Age': np.random.randint(18, 80, size=num_customers),
    'Senior Citizen': np.random.choice(['No', 'Yes'], size=num_customers, p=[0.8, 0.2]),
    'Married': np.random.choice(['Yes', 'No'], size=num_customers),
    'Dependents': np.random.choice(['Yes', 'No'], size=num_customers),
    'Number of Dependents': np.random.randint(0, 5, size=num_customers)
})

# Location table
location = pd.DataFrame({
    'CustomerID': range(1, num_customers + 1),
    'Count': [1] * num_customers,
    'Country': ['United States'] * num_customers,
    'State': ['California'] * num_customers,
    'City': np.random.choice(['San Diego', 'Los Angeles', 'San Francisco'], size=num_customers),
    'Zip Code': np.random.randint(92000, 92100, size=num_customers),
    'Lat Long': [f"{33 + i % 5}.{i % 100}, -{117 + i % 5}.{i % 100}" for i in range(num_customers)],
    'Latitude': [33 + i % 5 + (i % 100) / 100 for i in range(num_customers)],
    'Longitude': [-117 - i % 5 - (i % 100) / 100 for i in range(num_customers)]
})

# Population table
population = pd.DataFrame({
    'ID': range(1, 101),
    'Zip Code': [92000 + i for i in range(100)],
    'Population': [10000 + i * 1000 for i in range(100)]
})

# Services table
services = pd.DataFrame({
    'CustomerID': range(1, num_customers + 1),
    'Count': [1] * num_customers,
    'Quarter': ['Q3'] * num_customers,
    'Referred a Friend': np.random.choice(['Yes', 'No'], size=num_customers),
    'Number of Referrals': np.random.randint(0, 5, size=num_customers),
    'Tenure in Months': np.random.randint(1, 72, size=num_customers),
    'Offer': np.random.choice(['None', 'Offer A', 'Offer B', 'Offer C', 'Offer D', 'Offer E'], size=num_customers),
    'Phone Service': np.random.choice(['Yes', 'No'], size=num_customers),
    'Avg Monthly Long Distance Charges': np.random.randint(0, 50, size=num_customers),
    'Multiple Lines': np.random.choice(['Yes', 'No'], size=num_customers),
    'Internet Service': np.random.choice(['DSL', 'Fiber Optic', 'Cable', 'No'], size=num_customers),
    'Avg Monthly GB Download': np.random.randint(0, 1000, size=num_customers),
    'Online Security': np.random.choice(['Yes', 'No'], size=num_customers),
    'Online Backup': np.random.choice(['Yes', 'No'], size=num_customers),
    'Device Protection Plan': np.random.choice(['Yes', 'No'], size=num_customers),
    'Premium Tech Support': np.random.choice(['Yes', 'No'], size=num_customers),
    'Streaming TV': np.random.choice(['Yes', 'No'], size=num_customers),
    'Streaming Movies': np.random.choice(['Yes', 'No'], size=num_customers),
    'Streaming Music': np.random.choice(['Yes', 'No'], size=num_customers),
    'Unlimited Data': np.random.choice(['Yes', 'No'], size=num_customers),
    'Contract': np.random.choice(['Month-to-Month', 'One Year', 'Two Year'], size=num_customers),
    'Paperless Billing': np.random.choice(['Yes', 'No'], size=num_customers),
    'Payment Method': np.random.choice(['Bank Withdrawal', 'Credit Card', 'Mailed Check'], size=num_customers),
    'Monthly Charge': np.random.uniform(50, 150, size=num_customers).round(2),
    'Total Charges': np.random.uniform(100, 8000, size=num_customers).round(2),
    'Total Refunds': np.random.uniform(0, 20, size=num_customers).round(2),
    'Total Extra Data Charges': np.random.uniform(0, 30, size=num_customers).round(2),
    'Total Long Distance Charges': np.random.uniform(0, 50, size=num_customers).round(2)
})

# Status table
status = pd.DataFrame({
    'CustomerID': range(1, num_customers + 1),
    'Count': [1] * num_customers,
    'Quarter': ['Q3'] * num_customers,
    'Satisfaction Score': np.random.randint(1, 6, size=num_customers),
    'Satisfaction Score Label': np.random.choice(['Very Unsatisfied', 'Unsatisfied', 'Neutral', 'Satisfied', 'Very Satisfied'], size=num_customers),
    'Customer Status': np.random.choice(['Churned', 'Stayed', 'Joined'], size=num_customers),
    'Churn Label': np.random.choice(['Yes', 'No'], size=num_customers),
    'Churn Value': np.random.choice([0, 1], size=num_customers),
    'Churn Score': np.random.randint(1, 101, size=num_customers),
    'Churn Score Category': [f"{(i % 10) * 10 + 1}-{(i % 10 + 1) * 10}" for i in range(num_customers)],
    'CLTV': np.random.randint(2000, 7000, size=num_customers),
    'CLTV Category': [f"{2000 + (i % 10) * 500}-{2500 + (i % 10) * 500}" for i in range(num_customers)],
    'Churn Category': np.random.choice(['Attitude', 'Competitor', 'Dissatisfaction', 'Other', 'Price'], size=num_customers),
    'Churn Reason': np.random.choice([
        'Attitude of support person', 
        'Competitor had better devices', 
        'Competitor made better offer', 
        'Competitor offered higher download speeds', 
        'Competitor offered more data', 
        'Don\'t know', 
        'Moved', 
        'Price too high', 
        'Product dissatisfaction', 
        'Service dissatisfaction'
    ], size=num_customers)
})

# Save the dataframes to CSV files
demographics.to_csv(raw_dir / 'telco_customer_churn_demographics.csv', index=False)
location.to_csv(raw_dir / 'telco_customer_churn_location.csv', index=False)
population.to_csv(raw_dir / 'telco_customer_churn_population.csv', index=False)
services.to_csv(raw_dir / 'telco_customer_churn_services.csv', index=False)
status.to_csv(raw_dir / 'telco_customer_churn_status.csv', index=False)

print("Sample Telco Customer Churn dataset created and saved to the 'raw' directory.")
print("Note: This is a synthetic dataset based on the schema described in the IBM Community page.")
print("For the actual dataset, please download the files from the IBM Community.")

# Create a combined dataset for easier analysis
# Join all tables on CustomerID
combined_df = demographics.merge(location, on=['CustomerID', 'Count'], how='left')
combined_df = combined_df.merge(services, on=['CustomerID', 'Count'], how='left')
combined_df = combined_df.merge(status, on=['CustomerID', 'Count', 'Quarter'], how='left')

# Save the combined dataset
combined_df.to_csv(processed_dir / 'telco_customer_churn_combined.csv', index=False)

print("Combined dataset created and saved to the 'processed' directory.") 
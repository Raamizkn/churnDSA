import pandas as pd
import numpy as np
from datetime import datetime

def validate_customer_data(data):
    """
    Validate customer data for prediction.
    
    Args:
        data (dict): Customer data
        
    Returns:
        tuple: (is_valid, error_message)
    """
    required_fields = [
        'gender', 'age', 'tenure_months', 'contract', 
        'monthly_charge', 'internet_service'
    ]
    
    # Check if all required fields are present
    for field in required_fields:
        if field not in data:
            return False, f"Missing required field: {field}"
    
    # Validate data types
    try:
        # Numeric fields
        numeric_fields = ['age', 'tenure_months', 'monthly_charge', 'total_charges']
        for field in numeric_fields:
            if field in data and data[field] is not None:
                data[field] = float(data[field])
        
        # Boolean fields (convert 'Yes'/'No' to True/False)
        boolean_fields = [
            'senior_citizen', 'married', 'dependents', 'phone_service',
            'multiple_lines', 'online_security', 'online_backup',
            'device_protection', 'tech_support', 'streaming_tv',
            'streaming_movies', 'streaming_music', 'unlimited_data',
            'paperless_billing'
        ]
        for field in boolean_fields:
            if field in data:
                if isinstance(data[field], str):
                    data[field] = data[field].lower() == 'yes'
    except ValueError as e:
        return False, f"Invalid data type: {str(e)}"
    
    return True, ""

def format_prediction_response(prediction_result, customer_data):
    """
    Format the prediction result for API response.
    
    Args:
        prediction_result (dict): Prediction result from the model
        customer_data (dict): Customer data
        
    Returns:
        dict: Formatted response
    """
    # Format churn probability as percentage
    churn_probability_percent = round(prediction_result['churn_probability'] * 100, 2)
    
    # Format retention strategies with descriptions
    formatted_strategies = []
    for i, strategy in enumerate(prediction_result['retention_strategies']):
        formatted_strategies.append({
            'name': strategy,
            'priority': i + 1
        })
    
    # Create response
    response = {
        'customer_id': customer_data.get('customer_id', 'unknown'),
        'prediction': {
            'churn_probability': prediction_result['churn_probability'],
            'churn_probability_percent': f"{churn_probability_percent}%",
            'risk_segment': prediction_result['risk_segment'],
            'prediction_time': datetime.now().isoformat(),
            'model_version': prediction_result['model_version']
        },
        'retention_strategies': formatted_strategies,
        'customer_data': {
            'gender': customer_data.get('gender'),
            'age': customer_data.get('age'),
            'tenure_months': customer_data.get('tenure_months'),
            'contract': customer_data.get('contract'),
            'monthly_charge': customer_data.get('monthly_charge'),
            'internet_service': customer_data.get('internet_service')
        }
    }
    
    return response

def prepare_customer_data_for_db(data):
    """
    Prepare customer data for database storage.
    
    Args:
        data (dict): Customer data
        
    Returns:
        dict: Prepared data for database
    """
    # Map API field names to database field names
    field_mapping = {
        'tenure_months': 'tenure_months',
        'phone_service': 'phone_service',
        'multiple_lines': 'multiple_lines',
        'internet_service': 'internet_service',
        'online_security': 'online_security',
        'online_backup': 'online_backup',
        'device_protection': 'device_protection',
        'tech_support': 'tech_support',
        'streaming_tv': 'streaming_tv',
        'streaming_movies': 'streaming_movies',
        'streaming_music': 'streaming_music',
        'unlimited_data': 'unlimited_data',
        'contract': 'contract',
        'paperless_billing': 'paperless_billing',
        'payment_method': 'payment_method',
        'monthly_charge': 'monthly_charge',
        'total_charges': 'total_charges',
        'satisfaction_score': 'satisfaction_score',
        'cltv': 'cltv'
    }
    
    # Create a new dict with mapped fields
    db_data = {}
    for api_field, db_field in field_mapping.items():
        if api_field in data:
            db_data[db_field] = data[api_field]
    
    # Add customer_id if present
    if 'customer_id' in data:
        db_data['customer_id'] = data['customer_id']
    
    # Convert boolean string values to actual booleans
    boolean_fields = [
        'phone_service', 'multiple_lines', 'online_security', 'online_backup',
        'device_protection', 'tech_support', 'streaming_tv', 'streaming_movies',
        'streaming_music', 'unlimited_data', 'paperless_billing'
    ]
    for field in boolean_fields:
        if field in db_data and isinstance(db_data[field], str):
            db_data[field] = db_data[field].lower() == 'yes'
    
    return db_data 
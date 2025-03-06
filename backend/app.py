from flask import Flask, request, jsonify
from flask_cors import CORS
import os
import json
import logging
from dotenv import load_dotenv

# Import custom modules
from models.predictor import ChurnPredictor
from database.db import init_db, get_session, close_session
from database.models import Customer, Prediction, Strategy
from utils.helpers import validate_customer_data, format_prediction_response, prepare_customer_data_for_db

# Load environment variables
load_dotenv()

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# Initialize Flask app
app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Initialize database
init_db()

# Initialize predictor
predictor = ChurnPredictor()

@app.route('/health', methods=['GET'])
def health_check():
    """
    Health check endpoint.
    """
    return jsonify({
        'status': 'healthy',
        'message': 'Churn prediction API is running'
    })

@app.route('/predict', methods=['POST'])
def predict_churn():
    """
    Endpoint for predicting customer churn.
    """
    try:
        # Get customer data from request
        customer_data = request.json
        
        # Validate customer data
        is_valid, error_message = validate_customer_data(customer_data)
        if not is_valid:
            return jsonify({
                'error': 'Invalid customer data',
                'message': error_message
            }), 400
        
        # Make prediction
        prediction_result = predictor.predict(customer_data)
        
        # Format response
        response = format_prediction_response(prediction_result, customer_data)
        
        # Store customer and prediction in database
        store_prediction(customer_data, prediction_result)
        
        return jsonify(response)
    
    except Exception as e:
        logger.error(f"Error in predict_churn: {str(e)}")
        return jsonify({
            'error': 'Prediction failed',
            'message': str(e)
        }), 500

@app.route('/strategies', methods=['GET'])
def get_strategies():
    """
    Endpoint for getting retention strategies.
    """
    try:
        # Get risk segment from query parameters
        risk_segment = request.args.get('risk_segment')
        
        # If risk segment is provided, return strategies for that segment
        if risk_segment:
            strategies = predictor.strategies.get(risk_segment, [])
            return jsonify({
                'risk_segment': risk_segment,
                'strategies': strategies
            })
        
        # Otherwise, return all strategies
        return jsonify(predictor.strategies)
    
    except Exception as e:
        logger.error(f"Error in get_strategies: {str(e)}")
        return jsonify({
            'error': 'Failed to get strategies',
            'message': str(e)
        }), 500

@app.route('/customer/<customer_id>', methods=['GET'])
def get_customer(customer_id):
    """
    Endpoint for getting customer data and predictions.
    """
    try:
        # Get database session
        session = get_session()
        
        # Query customer
        customer = session.query(Customer).filter_by(customer_id=customer_id).first()
        
        # If customer not found, return 404
        if not customer:
            close_session(session)
            return jsonify({
                'error': 'Customer not found',
                'message': f"No customer found with ID {customer_id}"
            }), 404
        
        # Query predictions for customer
        predictions = session.query(Prediction).filter_by(customer_id=customer.id).all()
        
        # Format response
        response = {
            'customer_id': customer.customer_id,
            'customer_data': {
                'gender': customer.gender,
                'age': customer.age,
                'senior_citizen': customer.senior_citizen,
                'married': customer.married,
                'dependents': customer.dependents,
                'tenure_months': customer.tenure_months,
                'contract': customer.contract,
                'monthly_charge': customer.monthly_charge,
                'total_charges': customer.total_charges,
                'internet_service': customer.internet_service
            },
            'predictions': []
        }
        
        # Add predictions to response
        for prediction in predictions:
            # Query strategies for prediction
            strategies = session.query(Strategy).filter_by(prediction_id=prediction.id).all()
            
            # Format strategies
            formatted_strategies = []
            for strategy in strategies:
                formatted_strategies.append({
                    'name': strategy.strategy_name,
                    'description': strategy.strategy_description,
                    'priority': strategy.priority
                })
            
            # Add prediction to response
            response['predictions'].append({
                'churn_probability': prediction.churn_probability,
                'risk_segment': prediction.risk_segment,
                'prediction_time': prediction.prediction_time.isoformat(),
                'model_version': prediction.model_version,
                'strategies': formatted_strategies
            })
        
        close_session(session)
        return jsonify(response)
    
    except Exception as e:
        logger.error(f"Error in get_customer: {str(e)}")
        if 'session' in locals():
            close_session(session)
        return jsonify({
            'error': 'Failed to get customer data',
            'message': str(e)
        }), 500

def store_prediction(customer_data, prediction_result):
    """
    Store customer data and prediction in database.
    
    Args:
        customer_data (dict): Customer data
        prediction_result (dict): Prediction result
    """
    try:
        # Get database session
        session = get_session()
        
        # Prepare customer data for database
        db_customer_data = prepare_customer_data_for_db(customer_data)
        
        # Check if customer already exists
        customer = None
        if 'customer_id' in db_customer_data:
            customer = session.query(Customer).filter_by(customer_id=db_customer_data['customer_id']).first()
        
        # If customer doesn't exist, create new customer
        if not customer:
            customer = Customer(**db_customer_data)
            session.add(customer)
            session.flush()  # Flush to get customer ID
        
        # Create prediction
        prediction = Prediction(
            customer_id=customer.id,
            churn_probability=prediction_result['churn_probability'],
            risk_segment=prediction_result['risk_segment'],
            model_version=prediction_result['model_version']
        )
        session.add(prediction)
        session.flush()  # Flush to get prediction ID
        
        # Create strategies
        for i, strategy_name in enumerate(prediction_result['retention_strategies']):
            strategy = Strategy(
                prediction_id=prediction.id,
                strategy_name=strategy_name,
                priority=i + 1
            )
            session.add(strategy)
        
        # Commit changes
        session.commit()
        
    except Exception as e:
        logger.error(f"Error in store_prediction: {str(e)}")
        session.rollback()
        raise
    
    finally:
        close_session(session)

if __name__ == '__main__':
    # Get port from environment variable or use default
    port = int(os.environ.get('PORT', 5000))
    
    # Run app
    app.run(host='0.0.0.0', port=port, debug=True) 
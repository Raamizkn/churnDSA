import joblib
import json
import os
import pandas as pd
import numpy as np
from pathlib import Path

class ChurnPredictor:
    """
    Class for loading ML models and making churn predictions.
    """
    def __init__(self, model_path=None, strategies_path=None):
        """
        Initialize the ChurnPredictor with model and strategies paths.
        
        Args:
            model_path (str): Path to the trained model file
            strategies_path (str): Path to the retention strategies JSON file
        """
        # Set default paths if not provided
        if model_path is None:
            model_path = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(__file__))), 
                                     'models', 'xgboost_model.pkl')
        
        if strategies_path is None:
            strategies_path = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(__file__))), 
                                          'models', 'retention_strategies.json')
        
        # Load the model
        self.model = self._load_model(model_path)
        
        # Load retention strategies
        self.strategies = self._load_strategies(strategies_path)
        
        # Model version (derived from filename)
        self.model_version = Path(model_path).stem
    
    def _load_model(self, model_path):
        """
        Load the trained model from disk.
        
        Args:
            model_path (str): Path to the trained model file
            
        Returns:
            object: Loaded model
        """
        try:
            return joblib.load(model_path)
        except Exception as e:
            print(f"Error loading model: {e}")
            raise
    
    def _load_strategies(self, strategies_path):
        """
        Load retention strategies from JSON file.
        
        Args:
            strategies_path (str): Path to the retention strategies JSON file
            
        Returns:
            dict: Retention strategies by risk segment
        """
        try:
            with open(strategies_path, 'r') as f:
                return json.load(f)
        except Exception as e:
            print(f"Error loading strategies: {e}")
            # Return default strategies if file not found
            return {
                'Low Risk': ['Regular check-ins', 'Loyalty program enrollment'],
                'Medium-Low Risk': ['Personalized usage tips', 'Cross-sell complementary services'],
                'Medium Risk': ['Service review call', 'Targeted promotions'],
                'Medium-High Risk': ['Proactive service check', 'Discount on current services'],
                'High Risk': ['Immediate outreach', 'Significant discount offer']
            }
    
    def predict(self, customer_data):
        """
        Make a churn prediction for a customer.
        
        Args:
            customer_data (dict): Customer data as a dictionary
            
        Returns:
            dict: Prediction results including churn probability, risk segment, and strategies
        """
        # Convert customer data to DataFrame
        df = pd.DataFrame([customer_data])
        
        # Make prediction
        churn_probability = self.model.predict_proba(df)[0, 1]
        
        # Assign risk segment
        risk_segment = self._assign_risk_segment(churn_probability)
        
        # Get retention strategies for the risk segment
        retention_strategies = self.strategies.get(risk_segment, [])
        
        return {
            'churn_probability': float(churn_probability),
            'risk_segment': risk_segment,
            'retention_strategies': retention_strategies,
            'model_version': self.model_version
        }
    
    def _assign_risk_segment(self, probability):
        """
        Assign a risk segment based on churn probability.
        
        Args:
            probability (float): Churn probability
            
        Returns:
            str: Risk segment
        """
        if probability < 0.2:
            return 'Low Risk'
        elif probability < 0.4:
            return 'Medium-Low Risk'
        elif probability < 0.6:
            return 'Medium Risk'
        elif probability < 0.8:
            return 'Medium-High Risk'
        else:
            return 'High Risk' 
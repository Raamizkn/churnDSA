from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey, Boolean, Text
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship
import datetime

Base = declarative_base()

class Customer(Base):
    """
    Customer model representing customer data in the database.
    """
    __tablename__ = 'customers'
    
    id = Column(Integer, primary_key=True)
    customer_id = Column(String(50), unique=True, nullable=False)
    gender = Column(String(10))
    age = Column(Integer)
    senior_citizen = Column(Boolean)
    married = Column(Boolean)
    dependents = Column(Boolean)
    number_of_dependents = Column(Integer)
    tenure_months = Column(Integer)
    phone_service = Column(Boolean)
    multiple_lines = Column(Boolean)
    internet_service = Column(String(20))
    online_security = Column(Boolean)
    online_backup = Column(Boolean)
    device_protection = Column(Boolean)
    tech_support = Column(Boolean)
    streaming_tv = Column(Boolean)
    streaming_movies = Column(Boolean)
    streaming_music = Column(Boolean)
    unlimited_data = Column(Boolean)
    contract = Column(String(20))
    paperless_billing = Column(Boolean)
    payment_method = Column(String(30))
    monthly_charge = Column(Float)
    total_charges = Column(Float)
    satisfaction_score = Column(Integer)
    cltv = Column(Float)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.datetime.utcnow, onupdate=datetime.datetime.utcnow)
    
    # Relationship with predictions
    predictions = relationship("Prediction", back_populates="customer", cascade="all, delete-orphan")
    
    def __repr__(self):
        return f"<Customer(id={self.id}, customer_id='{self.customer_id}')>"


class Prediction(Base):
    """
    Prediction model representing churn predictions in the database.
    """
    __tablename__ = 'predictions'
    
    id = Column(Integer, primary_key=True)
    customer_id = Column(Integer, ForeignKey('customers.id'), nullable=False)
    churn_probability = Column(Float, nullable=False)
    risk_segment = Column(String(20), nullable=False)
    model_version = Column(String(50))
    prediction_time = Column(DateTime, default=datetime.datetime.utcnow)
    
    # Relationship with customer
    customer = relationship("Customer", back_populates="predictions")
    
    # Relationship with strategies
    strategies = relationship("Strategy", back_populates="prediction", cascade="all, delete-orphan")
    
    def __repr__(self):
        return f"<Prediction(id={self.id}, churn_probability={self.churn_probability:.2f}, risk_segment='{self.risk_segment}')>"


class Strategy(Base):
    """
    Strategy model representing retention strategies in the database.
    """
    __tablename__ = 'strategies'
    
    id = Column(Integer, primary_key=True)
    prediction_id = Column(Integer, ForeignKey('predictions.id'), nullable=False)
    strategy_name = Column(String(100), nullable=False)
    strategy_description = Column(Text)
    priority = Column(Integer)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    
    # Relationship with prediction
    prediction = relationship("Prediction", back_populates="strategies")
    
    def __repr__(self):
        return f"<Strategy(id={self.id}, strategy_name='{self.strategy_name}')>" 
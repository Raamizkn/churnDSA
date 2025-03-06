from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, scoped_session
from sqlalchemy.ext.declarative import declarative_base
import os
from dotenv import load_dotenv
from .models import Base

# Load environment variables
load_dotenv()

# Get database URL from environment variables or use SQLite as fallback
DATABASE_URL = os.getenv('DATABASE_URL', 'sqlite:///churn_prediction.db')

# Create engine
engine = create_engine(DATABASE_URL)

# Create session factory
session_factory = sessionmaker(bind=engine)
Session = scoped_session(session_factory)

def init_db():
    """
    Initialize the database by creating all tables.
    """
    Base.metadata.create_all(engine)

def get_session():
    """
    Get a database session.
    """
    return Session()

def close_session(session):
    """
    Close a database session.
    """
    session.close() 
from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from app.config import load_configurations, configure_logging, Config
from .views import webhook_blueprint


db = SQLAlchemy()

def create_app():
    app = Flask(__name__)
    
    load_configurations(app)
    app.config.from_object(Config)
    
    db.init_app(app)
    with app.app_context():
        from models.job import Job
        db.create_all()
    
    # Load configurations and logging settings
    configure_logging()

    # Import and register blueprints, if any
    app.register_blueprint(webhook_blueprint)

    return app
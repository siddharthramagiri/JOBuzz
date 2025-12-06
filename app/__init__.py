from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from app.config import load_configurations, configure_logging, Config
from flask_cors import CORS


db = SQLAlchemy()

def create_app():
    app = Flask(__name__)
    CORS(app, supports_credentials=True)
    
    load_configurations(app)
    app.config.from_object(Config)
    
    db.init_app(app)
    with app.app_context():
        from models.job import Job
        from models.otp import OTP
        from models.user import User
        db.create_all()
    
    # Load configurations and logging settings
    configure_logging()

    def register_blueprints():
        from .views import webhook_blueprint
        app.register_blueprint(webhook_blueprint)

    register_blueprints()
    
    return app

from app import db
from datetime import date

class User(db.Model):
    __tablename__ = "user"

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    phone_number = db.Column(db.String, unique=True, nullable=False)
    name = db.Column(db.String, nullable=True)  # optional
    registered = db.Column(db.Boolean, default=False, nullable=False)
    interests = db.Column(db.ARRAY(db.String), default=[])  # list of strings
    preferred_locations = db.Column(db.ARRAY(db.String), default=[])  # list of strings
    experience_level = db.Column(db.String, nullable=True)  # optional

    def __repr__(self):
        return f"<User {self.phone_number} - {self.name}>"
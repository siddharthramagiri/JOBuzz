from app import db
from datetime import date

class Job(db.Model):
    __tablename__ = "jobs"

    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(255), nullable=False)
    company = db.Column(db.String(255), nullable=False)
    location = db.Column(db.String(255))
    experience = db.Column(db.String(255))
    url = db.Column(db.String(500))
    description = db.Column(db.Text)
    date_scraped = db.Column(db.Date, default=date.today)

    def __repr__(self):
        return f"<Job {self.title} at {self.company}>"

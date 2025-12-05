import os
import random
import string
import datetime
import logging
import jwt
from app import db
from flask import request, jsonify
from apscheduler.schedulers.background import BackgroundScheduler
from app.services import scrape_jobs_data, save_database, save_json_data
from app.utils.whatsapp_utils import get_text_message_input, send_message
from rag.data_loader import load_json
from app import create_app
from models.otp import OTP


app = create_app()
scheduler = BackgroundScheduler()

SECRET_KEY=os.getenv("SECRET_KEY")

def start_scheduler():
    # Run scrape_jobs_data() every day at 02:00 AM
    if not scheduler.get_jobs():
        scheduler.add_job(scrape_jobs_data, 'cron', hour=2, minute=0)
        scheduler.start()

start_scheduler()

@app.route('/')
def home():
    text = "Hello, Flask!"
    return text.upper()

def generate_otp(length=4):
    return ''.join(random.choices(string.digits, k=length))

@app.route('/send-otp', methods=['POST'])
def send_otp():
    data = request.get_json()
    phone_number = data.get('phone')

    if not phone_number:
        return jsonify({"message": "Phone number is required"}), 400
    
    if len(phone_number) < 10:
        return jsonify({"message": "Invalid phone number"}), 400
    
    existing_otp = OTP.query.filter_by(phone_number=phone_number).first()
    if existing_otp:
        db.session.delete(existing_otp)
        db.session.commit()
            
    otp = generate_otp()

    new_otp = OTP(phone_number=phone_number, otp=otp)
    db.session.add(new_otp)
    db.session.commit()
    
    data = get_text_message_input(recipient=phone_number, text="Your OTP is " + otp)
    send_message(data=data)
    
    return jsonify({"message": "OTP sent successfully"}), 200


@app.route('/verify-otp', methods=['POST'])
def verify_otp():
    data = request.get_json()
    phone_number = data.get('phone')
    otp = data.get('otp')

    if not phone_number or not otp:
        return jsonify({"success": False, "message": "Phone number and OTP are required"}), 400

    otp_record = OTP.query.filter_by(phone_number=phone_number).first()

    if not otp_record:
        return jsonify({"success": False, "message": "OTP not found"}), 400

    if otp_record.otp != otp:
        return jsonify({"success": False, "message": "Invalid OTP"}), 400
    
    db.session.delete(otp_record)
    db.session.commit()

    token_payload = {
        "phone": phone_number,
        "exp": datetime.datetime.utcnow() + datetime.timedelta(days=7),
        "iat": datetime.datetime.utcnow()
    }

    token = jwt.encode(token_payload, SECRET_KEY, algorithm="HS256")

    return jsonify({
        "success": True,
        "message": "OTP verified successfully",
        "token": token
    }), 200

@app.route('/api/save_data')
def save_data():
    return save_json_data()


if __name__ == "__main__" :
    logging.info("Flask app started")
    app.run(host="0.0.0.0", port=8000)
    
    # rag_search = RAGSearch()
    # query = "Software Engineer Jobs"
    # summary = rag_search.search_and_summarize(query, top_k=3)
    
    # json_answer = json.loads(summary)
    # print(json.dumps(json_answer, indent=2))
    
    # f = FaissVectorStore()
    # f.test()
    # r = RAGSearch()
    # r.test()
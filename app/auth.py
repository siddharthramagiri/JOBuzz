import os, jwt, random, string, datetime
from flask import request, jsonify
from models.otp import OTP
from app.utils.whatsapp_utils import get_text_message_input, send_message
from . import db



SECRET_KEY=os.getenv("SECRET_KEY")

def generate_otp(length=4):
    return ''.join(random.choices(string.digits, k=length))

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
    

def validate_token():
    auth_header = request.headers.get("Authorization")

    print("AUTH HEADER =", auth_header)

    if not auth_header:
        return jsonify({"success": False, "message": "Authorization header missing"}), 401

    parts = auth_header.split()

    if len(parts) != 2 or parts[0].lower() != "bearer":
        return jsonify({"success": False, "message": "Invalid token format"}), 401

    token = parts[1]

    try:
        decoded = jwt.decode(
            token,
            SECRET_KEY,
            algorithms=["HS256"],
            options={"verify_exp": True}
        )

        return jsonify({
            "success": True,
            "message": "Token valid",
            "phone": decoded.get("phone")
        }), 200

    except jwt.ExpiredSignatureError:
        return jsonify({"success": False, "message": "Token expired"}), 401

    except jwt.InvalidTokenError:
        return jsonify({"success": False, "message": "Invalid token"}), 401

import logging
import requests
import json
import re
from flask import current_app, jsonify
from rag import test, get_response


def generate_response(message: str) :
    return get_response(message)

# from app.services.gemini_ai_service import generate_response

def log_http_response(response):
    logging.info(f"Status: {response.status_code}")
    logging.info(f"Content-type: {response.headers.get('content-type')}")
    # logging.info(f"Body: {response.text}")


def get_text_message_input(recipient, text):
    # Return a dict instead of a JSON string
    return {
        "messaging_product": "whatsapp",
        "recipient_type": "individual",
        "to": recipient,
        "type": "text",
        "text": {"preview_url": False, "body": text},
    }


def send_message(data):
    access_token = current_app.config.get("ACCESS_TOKEN")
    version = current_app.config.get("VERSION")
    phone_number_id = current_app.config.get("PHONE_NUMBER_ID")

    # logging.info(f"ACCESS_TOKEN present: {bool(access_token)}")
    # logging.info(f"VERSION: {version}")
    # logging.info(f"PHONE_NUMBER_ID: {phone_number_id}")

    headers = {
        "Content-type": "application/json",
        "Authorization": f"Bearer {access_token}",
    }

    url = f"https://graph.facebook.com/{version}/{phone_number_id}/messages"

    try:
        response = requests.post(
            url, json=data, headers=headers, timeout=10
        )
        response.raise_for_status()
    except requests.Timeout:
        logging.error("Timeout occurred while sending message")
        return jsonify({"status": "error", "message": "Request timed out"}), 408
    except requests.RequestException as e:
        logging.error(f"Request failed due to: {e}")
        if hasattr(e, "response") and e.response is not None:
            logging.error(f"WhatsApp error body: {e.response.text}")
        return jsonify({"status": "error", "message": "Failed to send message"}), 500
    else:
        log_http_response(response)
        return response


def process_text_for_whatsapp(text):
    # remove the citation brackets like 【...】
    pattern = r"\【.*?\】"
    text = re.sub(pattern, "", text).strip()

    # convert **bold** to *bold*
    pattern = r"\*\*(.*?)\*\*"
    replacement = r"*\1*"
    whatsapp_style_text = re.sub(pattern, replacement, text)

    return whatsapp_style_text


def process_whatsapp_message(body):
    wa_id = body["entry"][0]["changes"][0]["value"]["contacts"][0]["wa_id"]
    name = body["entry"][0]["changes"][0]["value"]["contacts"][0]["profile"]["name"]

    message = body["entry"][0]["changes"][0]["value"]["messages"][0]
    message_body = message["text"]["body"]
    
    response_text = generate_response(message_body)

    # IMPORTANT: send back to the same user (wa_id), not RECIPIENT_WAID
    data = get_text_message_input(wa_id, response_text)
    send_message(data)

def is_valid_whatsapp_message(body):
    """
    Check if the incoming webhook event has a valid WhatsApp message structure.
    """
    return (
        body.get("object")
        and body.get("entry")
        and body["entry"][0].get("changes")
        and body["entry"][0]["changes"][0].get("value")
        and body["entry"][0]["changes"][0]["value"].get("messages")
        and body["entry"][0]["changes"][0]["value"]["messages"][0]
    )
import logging
from apscheduler.schedulers.background import BackgroundScheduler
from app.services import scrape_jobs_data, save_database, save_json_data
from app.utils.whatsapp_utils import get_text_message_input, send_message
from rag.data_loader import load_json
from app import create_app


app = create_app()
scheduler = BackgroundScheduler()

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


@app.route('/send-otp', methods=['POST'])
def send_otp():
    from app.auth import send_otp
    return send_otp()


@app.route('/verify-otp', methods=['POST'])
def verify_otp():
    from app.auth import verify_otp
    return verify_otp()


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
import json
import logging
from flask import jsonify
from sqlalchemy import text
from apscheduler.schedulers.background import BackgroundScheduler
from datetime import date, time
from scraper.scrape_google_careers import scrape_google
from scraper.scrape_amazon_careers import scrape_amazon
from rag.data_loader import process_all_jsons, load_json, convert_json_to_documents
from rag.vectorstore import FaissVectorStore
from rag.search import RAGSearch
from app import create_app, db
from models.job import Job


app = create_app()
scheduler = BackgroundScheduler()

def scrape_jobs_data() :
    logging.info("Started Scraping jobs")
    scrape_google()
    scrape_amazon()
    all_documents = process_all_jsons("data")
    store = FaissVectorStore()
    store.build_from_documents(all_documents)
    store.load()
    save_json_data()
    
    
def save_database(all_documents):
    try : 
        try:
            db.session.execute(text("TRUNCATE TABLE jobs RESTART IDENTITY CASCADE;"))
            db.session.commit()
            logging.info("Jobs table truncated.")
        except Exception as e:
            db.session.rollback()
            logging.info(f"Skipping truncate — table not found. Error: {e}")
            
        logging.info("All existing jobs deleted.")
        for doc in all_documents :
            job = doc['content']
            db.session.add(
                Job(
                    title=job["Title"],
                    company=job["Company"],
                    location=job["Location"],
                    experience=job["Experience"],
                    url=job["URL"],
                    description=job["Description"],
                    date_scraped=date.today(),
                )
            )
        db.session.commit()
        logging.info("New jobs inserted into Neon PostgreSQL")
        return jsonify({"Message" : "Data Stored Successfully"}), 201
    except Exception as e :
        logging.info("Failed to save in Database")
        return jsonify({"error": str(e)}), 500
    
    
@app.route('/api/save_data')
def save_json_data():
    all_documents = load_json("data")
    return save_database(all_documents)

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
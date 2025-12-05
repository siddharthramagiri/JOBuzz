import logging
from datetime import date
from flask import jsonify
from models.job import Job
from sqlalchemy import text
from . import db
from rag.data_loader import process_all_jsons, load_json
from rag.vectorstore import FaissVectorStore
from scraper.scrape_amazon_careers import scrape_amazon
from scraper.scrape_google_careers import scrape_google


def scrape_jobs_data() :
    logging.info("Started Scraping jobs")
    # scrape_google()
    # scrape_amazon()
    # all_documents = process_all_jsons("data")
    # store = FaissVectorStore()
    # store.build_from_documents(all_documents)
    # store.load()
    # save_json_data()
    
def save_database(all_documents):
    try : 
        # try:
        #     db.session.execute(text("TRUNCATE TABLE jobs RESTART IDENTITY CASCADE;"))
        #     db.session.commit()
        #     logging.info("Jobs table truncated.")
        # except Exception as e:
        #     db.session.rollback()
        #     logging.info(f"Skipping truncate — table not found. Error: {e}")
            
        logging.info("All existing jobs deleted.")
        # for doc in all_documents :
        #     job = doc['content']
        #     db.session.add(
        #         Job(
        #             title=job["Title"],
        #             company=job["Company"],
        #             location=job["Location"],
        #             experience=job["Experience"],
        #             url=job["URL"],
        #             description=job["Description"],
        #             date_scraped=date.today(),
        #         )
        #     )
        # db.session.commit()
        logging.info("New jobs inserted into Neon PostgreSQL")
        return jsonify({"Message" : "Data Stored Successfully"}), 201
    except Exception as e :
        logging.info("Failed to save in Database")
        return jsonify({"error": str(e)}), 500
    
    
def save_json_data():
    all_documents = load_json("data")
    return save_database(all_documents)
import json
import logging
from scraper.scrape_google_careers import scrape_google
from scraper.scrape_amazon_careers import scrape_amazon
from rag.data_loader import process_all_jsons
from rag.vectorstore import FaissVectorStore
from rag.search import RAGSearch
from app import create_app


app = create_app()

def scrape_jobs_data() :
    scrape_google()
    scrape_amazon()


@app.route('/')
def home():
    text = "Hello, Flask!"
    return text.upper()


if __name__ == "__main__" :
    logging.info("Flask app started")
    app.run(host="0.0.0.0", port=8000)
    
    # all_documents = process_all_jsons("data")
    # print(all_documents)
    
    # store = FaissVectorStore()
    # # store.build_from_documents(all_documents)
    # store.load()
    
    # rag_search = RAGSearch()
    # query = "Software Engineer Jobs"
    # summary = rag_search.search_and_summarize(query, top_k=3)
    
    # json_answer = json.loads(summary)
    # print(json.dumps(json_answer, indent=2))
    
    # f = FaissVectorStore()
    # f.test()
    # r = RAGSearch()
    # r.test()
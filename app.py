import json
from scraper.scrape_google_careers import scrape_google
from scraper.scrape_amazon_careers import scrape_amazon
from src.data_loader import process_all_jsons
from src.vectorstore import FaissVectorStore
from src.search import RAGSearch


def scrape_jobs_data() :
    scrape_google()
    scrape_amazon()


if __name__ == "__main__" :
    # all_documents = process_all_jsons("data")
    
    store = FaissVectorStore()
    # store.build_from_documents(all_documents)
    store.load()
    
    rag_search = RAGSearch()
    query = "Software Engineer Jobs"
    summary = rag_search.search_and_summarize(query, top_k=3)
    
    json_answer = json.loads(summary)
    print(json.dumps(json_answer, indent=2))
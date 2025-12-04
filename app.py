from scraper.scrape_google_careers import testing, scrape_google
from scraper.scrape_amazon_careers import scrape_amazon


def scrape_jobs_data() :
    scrape_google()
    scrape_amazon()


if __name__ == "__main__" :
    pass
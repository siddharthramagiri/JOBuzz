from playwright.sync_api import sync_playwright
import json
import time
from scraper.scrape_amazon_careers import scrape_amazon

if __name__ == "__main__" :
    # with open("data/google_jobs.json", "r", encoding="utf-8") as f:
    #     data = json.load(f)
    # print(len(data))
    scrape_amazon()
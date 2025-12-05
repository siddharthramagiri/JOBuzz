import os
import json
import time
import re
from playwright.sync_api import sync_playwright


def extract_experience(description_text):
    patterns = [
        r"(\d+\+?\s*years?)",
        r"(\d+-\d+\s*years?)",
        r"(entry[-\s]?level)"
    ]

    text = description_text.lower()
    for pattern in patterns:
        match = re.search(pattern, text)
        if match:
            return match.group(0)

    return "Not Specified"

def scrape_amazon_jobs(playwright):
    browser = playwright.chromium.launch(headless=False)
    page = browser.new_page()
    
    all_jobs = []
    result_limit = 10
    offset = 0

    while True:
        url = f"https://www.amazon.jobs/en/search?offset={offset}&result_limit={result_limit}&sort=relevant&category[]=business-intelligence&category[]=software-development&category[]=operations-it-support-engineering&category[]=project-program-product-management-technical&country[]=IND&industry_experience=less_than_1_year"
        page.goto(url)
        page.wait_for_selector("div.job-tile-lists")
        time.sleep(2)

        job_tiles = page.locator("div.job-tile-lists div.job-tile div.job")
        count = job_tiles.count()
        
        if count == 0:
            break  # no more jobs

        for i in range(count):
            job_card = job_tiles.nth(i)
            job = {}

            # Title
            element = job_card.element_handle()
            title_elem = element.query_selector("h3.job-title a.job-link") if element else None
            
            # URL
            job['Title'] = title_elem.inner_text().strip() if title_elem else ""
            job['URL'] = "https://www.amazon.jobs" + title_elem.get_attribute("href").strip() if title_elem else ""
            job['Company'] = 'Amazon'
            
            # Location
            location_elem = job_card.locator("div.location-and-id ul li:first-child")
            job['Location'] = location_elem.inner_text().strip() if location_elem.count() > 0 else ""

            job_id_elem = job_card.locator("div.location-and-id ul li:nth-child(3)")
            job['JobID'] = job_id_elem.inner_text().replace("Job ID:", "").strip() if job_id_elem.count() > 0 else ""

            post_elem = job_card.locator("span.posting-date")
            job['Posted'] = post_elem.inner_text().strip() if post_elem.count() > 0 else ""

            desc_elem = job_card.locator("div.qualifications-preview")
            job['Description'] = desc_elem.inner_text().strip() if desc_elem.count() > 0 else ""

            job['Experience'] = "Not Specified"
            
            all_jobs.append(job)

        print(f"Scraped {len(all_jobs)} jobs so far...")
        offset += result_limit

    browser.close()
    return all_jobs


def scrape_amazon():
    with sync_playwright() as playwright:
        jobs = scrape_amazon_jobs(playwright)
        if jobs == []:
            return
        # Save to JSON
        file_path = "data/amazon_jobs.json"

        # Remove old file if exists
        if os.path.exists(file_path):
            os.remove(file_path)
            
        with open(file_path, "w", encoding="utf-8") as f:
            json.dump(jobs, f, ensure_ascii=False, indent=4)

    print(f"Scraped {len(jobs)} jobs successfully.")

import os
import json
import time
from playwright.sync_api import sync_playwright

def scrape_jobs(playwright):
    browser = playwright.chromium.launch(headless=False)
    page = browser.new_page()

    all_jobs = []
    pageCount = 1
    
    while (pageCount < 15) :
        page.goto(f"https://www.google.com/about/careers/applications/jobs/results?location=India&page={str(pageCount)}")
        page.wait_for_selector("main")
        time.sleep(2)

        jobs = []

        job_list_items = page.locator("ul > li")

        for job_card in job_list_items.element_handles():
            # Only process if there is a title
            title_elem = job_card.query_selector("h3")
            link_elem = job_card.query_selector("a[aria-label*='Learn more']")

            if not title_elem or not link_elem:
                continue  # skip non-job <li>

            job = {}
            job['Title'] = title_elem.inner_text().strip()
            job['URL'] = 'https://www.google.com/about/careers/applications/' + link_elem.get_attribute("href").strip()

            # Company
            company_elem = job_card.query_selector("span.RP7SMd > span")
            job['Company'] = company_elem.inner_text().strip() if company_elem else ""

            # Location
            location_elem = job_card.query_selector("span.pwO9Dc > span")
            job['Location'] = location_elem.inner_text().strip() if location_elem else ""

            # Experience level
            level_elem = job_card.query_selector("span.wVSTAb")
            job['Experience'] = level_elem.inner_text().strip() if level_elem else ""

            # Description
            desc_elem = job_card.query_selector("div.Xsxa1e")
            job['Description'] = desc_elem.inner_text().strip() if desc_elem else ""

            jobs.append(job)
        
        pageCount += 1
        if jobs == []:
            break
        
        all_jobs.extend(jobs)

    browser.close()
    return all_jobs



def scrape_google():
    with sync_playwright() as playwright:
        all_jobs = scrape_jobs(playwright)
        if all_jobs == []:
            return
        file_path = "data/google_jobs.json"

        # Remove old file if exists
        if os.path.exists(file_path):
            os.remove(file_path)
            
        # Save to JSON
        with open(file_path, "w", encoding="utf-8") as f:
            json.dump(all_jobs, f, ensure_ascii=False, indent=4)

    print(f"Scraped {len(all_jobs)} jobs successfully.")
    

def testing() :
    data = {
        "name" : "Siddu",
        "Roll" : "B22Ai091"
    }
    with open("data/test_json_data.json", "w", encoding="utf-8") as f :
        json.dump(data, f, ensure_ascii=False, indent=4)
    
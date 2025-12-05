import json
from rag.search import RAGSearch

def test(message: str) :
    return "Testing response to send\n" + message.upper()


def get_response(message: str) :
    rag_search = RAGSearch()
    summary = rag_search.search_and_summarize(query=message, top_k=3)
    
    json_answer = json.loads(summary)
    print(json.dumps(json_answer, indent=2))
    
    return format_rag_results(json_answer)

def format_rag_results(jobs):
    if not isinstance(jobs, list):
        return "No jobs found."

    output = []
    for job in jobs:
        block = (
            f"*{job.get('Title', 'N/A')}*\n"
            f"{job.get('Company Name', 'N/A')}\n"
            f"📍 {job.get('Location', 'N/A')}\n"
            f"{job.get('URL', 'N/A')}\n"
            f"💼 Experience: {job.get('Experience Level', 'N/A')}\n\n"
            f"*Description:*\n{job.get('Job Description', 'N/A')}\n"
        )
        output.append(block)

    return "\n\n".join(output)
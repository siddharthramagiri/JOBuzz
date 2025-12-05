from pathlib import Path
from typing import List, Any
from langchain_community.document_loaders import PyPDFLoader, PyMuPDFLoader, TextLoader, CSVLoader, Docx2txtLoader, JSONLoader
from langchain_community.document_loaders.excel import UnstructuredExcelLoader
from langchain_core.documents import Document
import json


def convert_json_to_documents(all_json_documents):
    documents = []
    for item in all_json_documents:
        data = item["content"]
        text = ""
        for key, value in data.items():
            text += f"{key}: {value}\n\n"

        documents.append(
            Document(
                page_content=text.strip(),
                metadata=item["metadata"]
            )
        )

    print(f"Converted {len(documents)} JSON entries into Document objects")
    return documents
        
        
def process_all_jsons(json_directory):
    all_documents = []
    json_dir = Path(json_directory)
    
    json_files = list(json_dir.glob("**/*.json"))
    print(f"Found {len(json_files)} JSON files to process")
    
    for json_file in json_files:
        print(f"\nProcessing: {json_file.name}")
        try:
            with open(json_file, "r", encoding="utf-8") as f:
                data = json.load(f)
            
            if isinstance(data, list):
                for item in data:
                    doc = {
                        "content": item,
                        "metadata": {
                            "source_file": json_file.name,
                            "file_type": "json"
                        }
                    }
                    all_documents.append(doc)
            else:
                doc = {
                    "content": data,
                    "metadata": {
                        "source_file": json_file.name,
                        "file_type": "json"
                    }
                }
                all_documents.append(doc)
                
        except Exception as e:
            print(f"Error: {e}")
    
    all_documents = convert_json_to_documents(all_json_documents=all_documents)
    
    print(f"All JSON documents loaded: {len(all_documents)}")
    return all_documents

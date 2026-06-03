#!/usr/bin/env python3
"""Search arXiv for papers on continual learning and related topics."""

import urllib.request
import xml.etree.ElementTree as ET
import json
from datetime import datetime

def search_arxiv(query, max_results=5):
    """Search arXiv and return parsed results."""
    url = f"https://export.arxiv.org/api/query?search_query=all:{query}&max_results={max_results}&sortBy=submittedDate&sortOrder=descending"
    
    print(f"\n{'='*60}")
    print(f"Searching arXiv for: {query}")
    print(f"{'='*60}")
    
    try:
        with urllib.request.urlopen(url, timeout=30) as response:
            xml_data = response.read().decode('utf-8')
        
        root = ET.fromstring(xml_data)
        ns = {'a': 'http://www.w3.org/2005/Atom', 'arxiv': 'http://arxiv.org/schemas/atom'}
        
        papers = []
        for entry in root.findall('a:entry', ns):
            try:
                title = entry.find('a:title', ns).text.strip().replace('\n', ' ')
                arxiv_id = entry.find('a:id', ns).text.strip().split('/abs/')[-1]
                published = entry.find('a:published', ns).text[:10]
                
                authors = []
                for author in entry.findall('a:author', ns):
                    name = author.find('a:name', ns).text
                    authors.append(name)
                
                summary = entry.find('a:summary', ns).text.strip()[:300]
                
                categories = []
                for cat in entry.findall('a:category', ns):
                    term = cat.get('term')
                    if term:
                        categories.append(term)
                
                summary_lower = summary.lower()
                is_withdrawn = 'withdrawn' in summary_lower or 'retracted' in summary_lower
                
                papers.append({
                    'title': title,
                    'authors': authors,
                    'published': published,
                    'arxiv_id': arxiv_id,
                    'summary': summary,
                    'categories': categories,
                    'pdf_url': f'https://arxiv.org/pdf/{arxiv_id}',
                    'abs_url': f'https://arxiv.org/abs/{arxiv_id}',
                    'is_withdrawn': is_withdrawn
                })
            except Exception as e:
                print(f"Warning: Could not parse entry: {e}")
                continue
        
        return papers
    except Exception as e:
        print(f"Error: {e}")
        return []

def format_papers(papers):
    """Format papers for display."""
    output = []
    output.append(f"Found {len(papers)} papers:")
    output.append("")
    
    for i, paper in enumerate(papers, 1):
        output.append(f"{i}. [{paper['arxiv_id]}] {paper['title']}")
        output.append(f"   Authors: {', '.join(paper['authors'])}")
        output.append(f"   Published: {paper['published']}")
        output.append(f"   Categories: {', '.join(paper['categories'])}")
        output.append(f"   Abstract: {paper['summary']}...")
        output.append(f"   PDF: {paper['pdf_url']}")
        output.append(f"   Abs: {paper['abs_url']}")
        if paper['is_withdrawn']:
            output.append("   WITHDRAWN")
        output.append("")
    
    return "\n".join(output)

def search_topic(query, max_results=5):
    """Search for a specific topic and return papers."""
    papers = search_arxiv(query, max_results)
    valid_papers = [p for p in papers if not p['is_withdrawn']]
    print(format_papers(valid_papers))
    return valid_papers

def main():
    """Run all searches and compile results."""
    print("Searching arXiv for papers on continual learning and related topics...")
    print(f"Current date: {datetime.now().strftime('%Y-%m-%d')}")
    
    queries = [
        ("continual learning", 5),
        ("lifelong learning", 5),
        ("online learning machine learning", 5),
        ("adaptive learning algorithms", 5),
        ("meta-learning continual learning", 5),
    ]
    
    all_papers = []
    
    for query, max_results in queries:
        papers = search_topic(query, max_results)
        all_papers.extend(papers)
    
    seen_ids = set()
    unique_papers = []
    for paper in all_papers:
        if paper['arxiv_id'] not in seen_ids:
            seen_ids.add(paper['arxiv_id'])
            unique_papers.append(paper)
    
    unique_papers.sort(key=lambda x: x['published'], reverse=True)
    
    print(f"\n{'='*60}")
    print(f"FINAL RESULTS: {len(unique_papers)} unique papers")
    print(f"{'='*60}")
    print(format_papers(unique_papers))
    
    with open('/tmp/arxiv_continual_learning_papers.json', 'w') as f:
        json.dump(unique_papers, f, indent=2)
    print(f"\nSaved papers to /tmp/arxiv_continual_learning_papers.json")
    
    return unique_papers

if __name__ == "__main__":
    main()

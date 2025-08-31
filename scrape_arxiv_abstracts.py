#!/usr/bin/env python3
"""
Script to scrape abstracts from arXiv for publications missing them in publications.json
"""

import json
import requests
from bs4 import BeautifulSoup
import time
import re
from urllib.parse import urljoin

def get_arxiv_abstract(arxiv_url):
    """
    Scrape abstract from arXiv URL
    """
    try:
        # Add delay to be respectful to arXiv servers
        time.sleep(1)
        
        headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        }
        
        response = requests.get(arxiv_url, headers=headers, timeout=10)
        response.raise_for_status()
        
        soup = BeautifulSoup(response.content, 'html.parser')
        
        # Find the abstract section
        abstract_block = soup.find('blockquote', class_='abstract')
        if abstract_block:
            # Remove the "Abstract:" label and get the text
            abstract_text = abstract_block.get_text(strip=True)
            abstract_text = re.sub(r'^Abstract:\s*', '', abstract_text)
            return abstract_text.strip()
        
        return None
        
    except Exception as e:
        print(f"Error fetching abstract from {arxiv_url}: {e}")
        return None

def convert_pdf_to_abs_url(url):
    """
    Convert arXiv PDF URL to abstract URL
    """
    if not url or 'arxiv.org' not in url:
        return None
    
    if '/pdf/' in url:
        arxiv_id = url.split('/pdf/')[-1].replace('.pdf', '')
        return f'https://arxiv.org/abs/{arxiv_id}'
    elif '/abs/' in url:
        return url
    
    return None

def main():
    # Load publications data
    with open('publications.json', 'r') as f:
        data = json.load(f)
    
    publications = data['publications']
    updated_count = 0
    
    print(f"Processing {len(publications)} publications...")
    
    for i, pub in enumerate(publications):
        print(f"\nProcessing {i+1}/{len(publications)}: {pub['title'][:60]}...")
        
        # Skip if abstract already exists
        if 'abstract' in pub and pub['abstract']:
            print("  ✓ Abstract already exists, skipping")
            continue
        
        # Get arXiv URL
        arxiv_url = convert_pdf_to_abs_url(pub.get('url'))
        if not arxiv_url:
            print("  ✗ No arXiv URL found, skipping")
            continue
        
        print(f"  → Fetching from: {arxiv_url}")
        
        # Scrape abstract
        abstract = get_arxiv_abstract(arxiv_url)
        if abstract:
            pub['abstract'] = abstract
            updated_count += 1
            print(f"  ✓ Abstract added ({len(abstract)} chars)")
        else:
            print("  ✗ Could not fetch abstract")
    
    # Save updated data
    with open('publications.json', 'w') as f:
        json.dump(data, f, indent=2, ensure_ascii=False)
    
    print(f"\n✅ Complete! Updated {updated_count} publications with abstracts")
    print(f"📝 Results saved to publications.json")

if __name__ == "__main__":
    main()
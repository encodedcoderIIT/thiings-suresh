#!/usr/bin/env python3
"""
Script to rename images from encoded filenames to match metadata expectations
"""

import json
import os
import shutil
from urllib.parse import urlparse

def main():
    # Load the metadata
    metadata_path = "src/data/thiings_metadata.json"
    images_dir = "public/images"
    
    with open(metadata_path, 'r', encoding='utf-8') as f:
        metadata = json.load(f)
    
    # Create mapping from encoded filename to expected filename
    renamed_count = 0
    
    for item in metadata:
        original_url = item.get('originalImageUrl', '')
        expected_filename = item.get('image', '')
        
        if original_url and expected_filename:
            # Extract the encoded filename from the URL
            # URL format: https://.../.../image-ENCODED.png
            url_parts = original_url.split('/')
            encoded_filename = url_parts[-1] if url_parts else ''
            
            if encoded_filename.startswith('image-'):
                encoded_path = os.path.join(images_dir, encoded_filename)
                expected_path = os.path.join(images_dir, expected_filename)
                
                # Check if encoded file exists and expected file doesn't
                if os.path.exists(encoded_path) and not os.path.exists(expected_path):
                    try:
                        # Copy (don't move) to preserve original
                        shutil.copy2(encoded_path, expected_path)
                        print(f"Renamed: {encoded_filename} -> {expected_filename}")
                        renamed_count += 1
                    except Exception as e:
                        print(f"Error renaming {encoded_filename}: {e}")
    
    print(f"\nRenamed {renamed_count} files successfully!")

if __name__ == "__main__":
    main()

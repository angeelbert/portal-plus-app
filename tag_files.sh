#!/bin/bash

# Arguments
file=$1
tag=$2

# Define the tag file
TAG_FILE="FILE_TAGS.md"

# Function to tag a file
tag_file() {
  local file=$1
  local tag=$2
  echo "File: $file" >> $TAG_FILE
  echo "Tags: $tag" >> $TAG_FILE
  echo "" >> $TAG_FILE
}

# Tag the specified file
tag_file "$file" "$tag"

# Commit changes
git add $TAG_FILE
git commit -m "Tagging $file with $tag"
git push origin main

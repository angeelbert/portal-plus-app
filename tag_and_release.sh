#!/bin/bash

# tag_and_release.sh

# Function to tag a specific file
tag_file() {
  local file=$1
  local tag=$2
  echo "Tagging $file with $tag"
  echo "File: $file" >> FILE_TAGS.md
  echo "Tags: $tag" >> FILE_TAGS.md
  echo "" >> FILE_TAGS.md
}

while IFS= read -r repo_url; do
  echo "Processing repository $repo_url"
  repo_name=$(basename -s .git "$repo_url")
  authenticated_repo_url="https://${GH_TOKEN}@${repo_url#https://}"
  git clone "$authenticated_repo_url"
  cd "$repo_name"
  
  # Ensure the tag file exists
  touch FILE_TAGS.md

  # Set up Git configuration
  git config user.name "github-actions[bot]"
  git config user.email "github-actions[bot]@users.noreply.github.com"
  
  # Iterate over files to tag
  while IFS= read -r file; do
    tag_file "$file" "$1"
  done < files.txt

  # Commit and push changes
  git add FILE_TAGS.md
  git commit -m "Tagging files with $1"
  git push "$authenticated_repo_url" main

  # Create a release
  repo_api_url="https://api.github.com/repos/${repo_url#https://github.com/}/releases"
  release_response=$(curl -X POST \
    -H "Authorization: token $GH_TOKEN" \
    -H "Accept: application/vnd.github.v3+json" \
    "$repo_api_url" \
    -d @- <<EOF
{
  "tag_name": "$1",
  "target_commitish": "main",
  "name": "Release $1",
  "body": "### Release $1 (2024-05-24)",
  "draft": false,
  "prerelease": false
}
EOF
  )
  if echo "$release_response" | grep -q 'created_at'; then
    echo "Release created successfully for $repo_url"
  else
    echo "Failed to create release for $repo_url: $release_response"
  fi
  cd ..
done < repos.txt

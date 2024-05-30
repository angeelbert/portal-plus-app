#!/bin/bash

# tag_and_release.sh

# Function to tag files
tag_files() {
  local repo_url="$1"
  local tag="$2"
  
  while IFS= read -r file_path; do
    echo "Tagging file: $file_path"
    authenticated_repo_url="https://${GH_TOKEN}@${repo_url#https://}"
    cd "$repo_name"
    git config user.name "github-actions[bot]"
    git config user.email "github-actions[bot]@users.noreply.github.com"
    
    # Check if the file exists
    if [ -f "$file_path" ]; then
      # Increment tag version if tag already exists
      latest_tag=$(git tag --list "$tag" | tail -n 1)
      if [ "$latest_tag" = "$tag" ]; then
        tag_number=$(echo "$tag" | cut -d '.' -f 2)
        new_tag="v0.0.$((tag_number + 1))"
        git tag "$new_tag" "$file_path"
        git push "$authenticated_repo_url" --tags
      else
        git tag "$tag" "$file_path"
        git push "$authenticated_repo_url" --tags
      fi
    else
      echo "File $file_path does not exist."
    fi
    
    cd ..
  done < files.txt
}

while IFS= read -r repo_url; do
  echo "Tagging and releasing in $repo_url"
  repo_name=$(basename -s .git "$repo_url" | tr -d '\r') # Remove any trailing carriage return
  authenticated_repo_url="https://${GH_TOKEN}@${repo_url#https://}"
  git clone "$authenticated_repo_url"
  cd "$repo_name"
  git config user.name "github-actions[bot]"
  git config user.email "github-actions[bot]@users.noreply.github.com"
  
  # Increment tag version if tag already exists
  latest_tag=$(git tag --list "$1" | tail -n 1)
  if [ "$latest_tag" = "$1" ]; then
    tag_number=$(echo "$1" | cut -d '.' -f 2)
    new_tag="v0.0.$((tag_number + 1))"
    git tag "$new_tag"
    git push "$authenticated_repo_url" --tags
  else
    git tag "$1"
    git push "$authenticated_repo_url" --tags
  fi
  
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
  "body": "### [$1]($authenticated_repo_url/compare/$latest_tag...$1) (2024-05-24)",
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
  
  # Tag files
  if [ -f "files.txt" ]; then
    tag_files "$repo_url" "$1"
  else
    echo "No files.txt found. Skipping file tagging."
  fi
  
  cd ..
done < repos.txt

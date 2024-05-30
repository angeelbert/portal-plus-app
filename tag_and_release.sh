#!/bin/bash

# tag_and_release.sh

while IFS= read -r repo_url; do
  echo "Tagging and releasing in $repo_url"
  repo_name=$(basename -s .git "$repo_url")
  repo_name_clean=$(echo "$repo_name" | tr -d '\r')  # Eliminar cualquier carácter de retorno de carro
  authenticated_repo_url="https://${GH_TOKEN}@github.com/${repo_name_clean}"
  git clone "$authenticated_repo_url" || { echo "Failed to clone repository: $repo_url"; exit 1; }
  cd "$repo_name_clean" || { echo "Failed to change directory to repository: $repo_name_clean"; exit 1; }
  git config user.name "github-actions[bot]"
  git config user.email "github-actions[bot]@users.noreply.github.com"
  
  # Tagging the repository
  tag_version="$1"
  if git rev-parse "$tag_version" >/dev/null 2>&1; then
    echo "Tag $tag_version already exists for repository $repo_url. Incrementing tag version."
    tag_version=$(echo "$tag_version" | awk -F '.' '{$NF = $NF + 1;} 1' OFS='.')
    while git rev-parse "$tag_version" >/dev/null 2>&1; do
      tag_version=$(echo "$tag_version" | awk -F '.' '{$NF = $NF + 1;} 1' OFS='.')
    done
  fi
  git tag "$tag_version"
  git push "$authenticated_repo_url" --tags || { echo "Failed to push tags to repository: $authenticated_repo_url"; exit 1; }
  
  # Creating a release
  repo_api_url="https://api.github.com/repos/${repo_url#https://github.com/}/releases"
  release_response=$(curl -X POST \
    -H "Authorization: token $GH_TOKEN" \
    -H "Accept: application/vnd.github.v3+json" \
    "$repo_api_url" \
    -d @- <<EOF
{
  "tag_name": "$tag_version",
  "target_commitish": "main",
  "name": "Release $tag_version",
  "body": "### [$tag_version](https://github.com/${repo_url}/compare/v${tag_version}...$tag_version) (2024-05-24)",
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
  
  # Tagging files
  if [ -f files.txt ]; then
    while IFS= read -r file_path; do
      echo "Tagging file: $file_path"
      if [ -f "$file_path" ]; then
        git tag -a "${file_path##*/}" -m "Tag ${file_path##*/} for file $file_path"
        git push "$authenticated_repo_url" "${file_path##*/}"
      else
        echo "File $file_path does not exist."
      fi
    done < files.txt
  else
    echo "No files.txt found. Skipping file tagging."
  fi
  
  cd ..
done < repos.txt

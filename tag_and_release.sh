#!/bin/bash

while IFS= read -r repo_url; do
  echo "Tagging and releasing in $repo_url"
  repo_name=$(basename -s .git "$repo_url")
  authenticated_repo_url="https://${GH_TOKEN}@${repo_url#https://}"
  
  # Clonar el repositorio
  git clone "$authenticated_repo_url" "$repo_name"
  
  # Cambiar al directorio del repositorio
  cd "$repo_name" || exit
  
  # Configurar el usuario de git
  git config user.name "github-actions[bot]"
  git config user.email "github-actions[bot]@users.noreply.github.com"
  
  # Tag y push
  git tag "$1"
  git push "$authenticated_repo_url" --tags
  
  # Crear release
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
  "body": "### [$1]($repo_url/compare/v$1) (2024-05-24)",
  "draft": false,
  "prerelease": false
}
EOF
  )
  
  # Verificar si la release se creó correctamente
  if echo "$release_response" | grep -q 'created_at'; then
    echo "Release created successfully for $repo_url"
  else
    echo "Failed to create release for $repo_url: $release_response"
  fi
  
  # Manejar archivos listados en files.txt
  if [ -f "files.txt" ]; then
    while IFS= read -r file; do
      echo "Tagging file: $file"
      if [ -f "$file" ]; then
        git tag "$1" -- "$file"
      else
        echo "File $file does not exist."
      fi
    done < files.txt
  else
    echo "No files.txt found. Skipping file tagging."
  fi
  
  cd ..
done < repos.txt

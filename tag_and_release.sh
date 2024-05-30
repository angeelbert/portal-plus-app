#!/bin/bash

# tag_and_release.sh

# Función para agregar tag a un archivo
tag_and_commit_file() {
  file_path="$1"
  tag_name="$2"

  # Obtener el nombre del archivo sin la extensión
  file_name=$(basename "$file_path" | sed 's/\.[^.]*$//')

  echo "Tagging file: $file_path with tag $tag_name"

  # Clonar el repositorio si no está clonado
  if [ ! -d "$file_name" ]; then
    git clone "$authenticated_repo_url" "$file_name" || { echo "Failed to clone repository: $authenticated_repo_url"; exit 1; }
  fi

  cd "$file_name" || { echo "Failed to change directory to repository: $file_name"; exit 1; }

  git config user.name "github-actions[bot]"
  git config user.email "github-actions[bot]@users.noreply.github.com"

  # Incrementar el tag si ya existe
  while git tag | grep -q "^$tag_name$"; do
    echo "Tag $tag_name already exists for file $file_path. Incrementing tag version."
    tag_name="${tag_name}_new" # Modificar el tag con un sufijo _new
  done

  # Agregar el tag al archivo y hacer el commit
  git tag "$tag_name" "$file_path"
  git commit -m "Tagging file $file_path with version $tag_name"
  git push origin "$tag_name" || { echo "Failed to push tag $tag_name for file $file_path"; exit 1; }

  echo "Committed and pushed changes for file $file_path with tag $tag_name"

  cd ..
}

# Etiquetar y lanzar repositorios desde repos.txt
while IFS= read -r repo_url; do
  echo "Tagging and releasing in $repo_url"
  repo_name=$(basename -s .git "$repo_url")
  authenticated_repo_url="https://${GH_TOKEN}@${repo_url#https://}"
  git clone "$authenticated_repo_url" || { echo "Failed to clone repository: $repo_url"; exit 1; }
  cd "$repo_name" || { echo "Failed to change directory to repository: $repo_name"; exit 1; }
  git config user.name "github-actions[bot]"
  git config user.email "github-actions[bot]@users.noreply.github.com"
  git tag "$1"
  git push "$authenticated_repo_url" --tags || { echo "Failed to push tags to repository: $authenticated_repo_url"; exit 1; }
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
  "body": "### [$1]($authenticated_repo_url/compare/v${1}...v$1) (2024-05-24)",
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

# Etiquetar archivos en las rutas proporcionadas en files.txt
if [ -f "files.txt" ]; then
  while IFS= read -r file_path; do
    tag_and_commit_file "$file_path" "$1"
  done < files.txt
else
  echo "No files.txt found. Skipping file tagging."
fi

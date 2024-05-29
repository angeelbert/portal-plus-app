#!/bin/bash

# tag_and_release.sh

# Función para etiquetar y lanzar un solo repositorio
tag_and_release_repo() {
  repo_url="$1"
  tag_name="$2"

  echo "Tagging and releasing in $repo_url"
  repo_name=$(basename -s .git "$repo_url")
  authenticated_repo_url="https://${GH_TOKEN}@${repo_url#https://}"
  git clone "$authenticated_repo_url"
  cd "$repo_name"
  git config user.name "github-actions[bot]"
  git config user.email "github-actions[bot]@users.noreply.github.com"
  git tag "$tag_name"
  git push "$authenticated_repo_url" --tags
  repo_api_url="https://api.github.com/repos/${repo_url#https://github.com/}/releases"
  release_response=$(curl -X POST \
    -H "Authorization: token $GH_TOKEN" \
    -H "Accept: application/vnd.github.v3+json" \
    "$repo_api_url" \
    -d @- <<EOF
{
  "tag_name": "$tag_name",
  "target_commitish": "main",
  "name": "Release $tag_name",
  "body": "### [$tag_name](https://github.com/${{ github.repository }}/compare/v${{ steps.tag_version.outputs.previous_tag }}...v$tag_name) (2024-05-24)",
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
}

# Etiquetar y lanzar repositorios
while IFS= read -r repo_url; do
  tag_and_release_repo "$repo_url" "$1"
done < repos.txt

# Etiquetar archivos en las rutas proporcionadas
while IFS= read -r file_path; do
  echo "Tagging file: $file_path"
  tag_name=$(basename "$file_path")
  git tag "$tag_name" --force # Etiquetar el archivo
  git push --tags # Empujar la etiqueta al repositorio remoto
  echo "Tagged file $file_path with tag $tag_name"
done < files.txt

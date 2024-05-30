#!/bin/bash

# Función para incrementar la versión del tag
increment_tag_version() {
  tag=$1
  if [[ $tag =~ ^v?[0-9]+\.[0-9]+\.[0-9]+$ ]]; then
    base=${tag%.*} # v0.0 or 0.0
    patch=${tag##*.} # 72
    new_patch=$((patch + 1))
    new_tag="${base}.${new_patch}" # v0.0.73 or 0.0.73
    echo "$new_tag"
  else
    echo "$tag"
  fi
}

# Etiquetar y lanzar repositorios
tag_and_release_repo() {
  repo_url="$1"
  tag_name="$2"

  echo "Tagging and releasing in $repo_url"
  repo_name=$(basename "$(echo "$repo_url" | sed 's/\.git$//')" | tr -d '\r')
  authenticated_repo_url="https://${GH_TOKEN}@${repo_url#https://}"

  # Incrementar el tag si ya existe
  while git ls-remote --tags "$repo_url" | grep -q "refs/tags/$tag_name"; do
    echo "Tag $tag_name already exists in $repo_url. Incrementing tag version."
    tag_name=$(increment_tag_version "$tag_name")
  done

  # Clonar el repositorio
  if [ -d "$repo_name" ]; then
    echo "Repository directory already exists. Skipping cloning."
  else
    git clone "$authenticated_repo_url" "$repo_name" || { echo "Failed to clone repository: $repo_url"; exit 1; }
  fi

  cd "$repo_name" || { echo "Failed to change directory to repository: $repo_name"; exit 1; }

  git config user.name "github-actions[bot]"
  git config user.email "github-actions[bot]@users.noreply.github.com"

  # Etiquetar y empujar los tags
  git tag "$tag_name"
  git push "$authenticated_repo_url" --tags || { echo "Failed to push tags to repository: $repo_url"; exit 1; }

  # Crear el lanzamiento
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
  "body": "### [$tag_name](https://github.com/${repo_url}/compare/v${tag_name}...v$tag_name) (2024-05-24)",
  "draft": false,
  "prerelease": false
}
EOF
  )

  if echo "$release_response" | grep -q 'created_at'; then
    echo "Release created successfully for $repo_url"
  else
    if echo "$release_response" | grep -q 'already_exists'; then
      echo "Release for tag $tag_name already exists. Skipping release creation."
    else
      echo "Failed to create release for $repo_url: $release_response"
    fi
  fi
}

# Etiquetar y lanzar repositorios
while IFS= read -r repo_url; do
  tag_and_release_repo "$(echo "$repo_url" | tr -d '\r')" "$1"
done < repos.txt

# Etiquetar archivos en las rutas proporcionadas
if [ -f "files.txt" ]; then
  while IFS= read -r file_path; do
    echo "Tagging file: $file_path"
    file_name=$(basename "$file_path" | tr -d '\r')
    tag_name="${file_name%.*}"

    # Incrementar el tag si ya existe
    while git tag | grep -q "^$tag_name$"; do
      echo "Tag $tag_name already exists for file $file_path. Incrementing tag version."
      tag_name=$(increment_tag_version "$tag_name")
    done

    # Etiquetar el archivo
    git tag "$tag_name" "$file_path"
    git push origin "$tag_name" || { echo "Failed to push tag $tag_name for file $file_path"; continue; }
    echo "Tagged file $file_path with tag $tag_name"

    # Hacer commit con el mensaje que incluye la versión del tag
    git add "$file_path"
    git commit -m "Tagging file $file_path with version $tag_name"
    git push origin main || { echo "Failed to push commit for file $file_path"; continue; }
    echo "Committed and pushed changes for file $file_path with tag $tag_name"
  done < files.txt
else
  echo "No files.txt found. Skipping file tagging."
fi

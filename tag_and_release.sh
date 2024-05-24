#!/bin/bash

# tag_and_release.sh

        while IFS= read -r repo_url; do
          echo "Tagging and releasing in $repo_url"
          repo_name=$(basename -s .git "$repo_url")
          authenticated_repo_url="https://${{ secrets.GH_TOKEN }}@${repo_url#https://}"
          git clone "$authenticated_repo_url"
          cd "$repo_name"
          git config user.name "github-actions[bot]"
          git config user.email "github-actions[bot]@users.noreply.github.com"
          git tag ${{ steps.tag_version.outputs.new_tag }}
          git push "$authenticated_repo_url" --tags
          repo_api_url="https://api.github.com/repos/${repo_url#https://github.com/}/releases"
          release_response=$(curl -X POST \
            -H "Authorization: token ${{ secrets.GH_TOKEN }}" \
            -H "Accept: application/vnd.github.v3+json" \
            "$repo_api_url" \
            -d '{
              "tag_name": "'"${{ steps.tag_version.outputs.new_tag }}"'",
              "target_commitish": "main",
              "name": "Release '"${{ steps.tag_version.outputs.new_tag }}"'",
              "body": "### [${{ steps.tag_version.outputs.new_tag }}](https://github.com/${{ github.repository }}/compare/v${{ steps.tag_version.outputs.previous_tag }}...v${{ steps.tag_version.outputs.new_tag }}) (2024-05-24)",
              "draft": false,
              "prerelease": false
            }')
          if echo "$release_response" | grep -q 'created_at'; then
            echo "Release created successfully for $repo_url"
          else
            echo "Failed to create release for $repo_url: $release_response"
          fi
          cd ..
        done < repos.txt

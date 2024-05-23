import sys
import os
import git

def increment_version(version, version_type):
    parts = version.split('.')
    if version_type == 'major':
        parts[0] = str(int(parts[0][1:]) + 1)
        parts[1] = '0'
        parts[2] = '0'
    elif version_type == 'minor':
        parts[1] = str(int(parts[1]) + 1)
        parts[2] = '0'
    elif version_type == 'patch':
        parts[2] = str(int(parts[2]) + 1)
    return 'v' + '.'.join(parts)

repo = git.Repo('.')
try:
    current_version = repo.git.describe(tags=True, abbrev=0)
except git.exc.GitCommandError:
    current_version = 'v0.0.0'  # Set an initial version if no tags exist

version_type = sys.argv[1]
new_version = increment_version(current_version, version_type)

repo.create_tag(new_version)

# Configure authentication using the token
remote_url = f'https://{os.getenv("GITHUB_TOKEN")}@github.com/{os.getenv("GITHUB_REPOSITORY")}.git'
origin = repo.create_remote('authenticated', url=remote_url)
origin.push('refs/tags/' + new_version)  
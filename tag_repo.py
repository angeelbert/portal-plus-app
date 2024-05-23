import sys
import os
import git

def get_current_version(repo):
    try:
        tags = repo.git.tag(sort='-version:refname').split('\n')
        return tags[0] if tags else 'v0.1.0'
    except git.exc.GitCommandError:
        return 'v0.1.0'

def increment_version(current_version, version_type):
    parts = current_version.strip('v').split('.')
    vnum1, vnum2, vnum3 = map(int, parts)

    if version_type == 'major':
        vnum1 += 1
        vnum2 = 0
        vnum3 = 0
    elif version_type == 'minor':
        vnum2 += 1
        vnum3 = 0
    elif version_type == 'patch':
        vnum3 += 1
    else:
        raise ValueError(f"Invalid version type: {version_type}")

    return f'v{vnum1}.{vnum2}.{vnum3}'

def main():
    if len(sys.argv) != 2:
        print("Usage: python tag_repo.py <version_type>")
        sys.exit(1)

    version_type = sys.argv[1]
    token = os.getenv('GH_TOKEN')
    repo_url = f"https://{token}:x-oauth-basic@github.com/angeelbert/portal-plus-app.git"
    repo = git.Repo('.')
    repo.remotes.origin.set_url(repo_url)

    current_version = get_current_version(repo)
    new_version = increment_version(current_version, version_type)

    repo.create_tag(new_version)
    repo.remotes.origin.push(tags=True)
    print(f"Repository tagged with {new_version}")

if __name__ == '__main__':
    main()

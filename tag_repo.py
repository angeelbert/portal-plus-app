import os
import sys
import git
import requests
from requests.auth import HTTPBasicAuth

# Configura tus variables
GITHUB_USER = os.getenv('GITHUB_ACTOR')
GITHUB_TOKEN = os.getenv('GITHUB_TOKEN')
REPO_NAME = os.getenv('GITHUB_REPOSITORY').split('/')[1]
REPO_PATH = './'  # La ruta del repositorio es la raíz del directorio de trabajo en GitHub Actions
VERSION_TYPE = sys.argv[1]  # 'major', 'minor' or 'patch'

# Autenticación para la API de GitHub
auth = HTTPBasicAuth(GITHUB_USER, GITHUB_TOKEN)

# Abre el repositorio
repo = git.Repo(REPO_PATH)

# Obtiene el tag más alto actual
tags = sorted(repo.tags, key=lambda t: t.commit.committed_datetime)
if tags:
    latest_tag = tags[-1].name
else:
    latest_tag = 'v0.1.0'

# Divide la versión en partes
version_parts = latest_tag.lstrip('v').split('.')
major = int(version_parts[0])
minor = int(version_parts[1])
patch = int(version_parts[2])

# Incrementa la versión según el tipo
if VERSION_TYPE == 'major':
    major += 1
    minor = 0
    patch = 0
elif VERSION_TYPE == 'minor':
    minor += 1
    patch = 0
elif VERSION_TYPE == 'patch':
    patch += 1
else:
    print("Tipo de versión no válido. Use 'major', 'minor' o 'patch'.")
    sys.exit(1)

# Nueva versión
new_tag = f'v{major}.{minor}.{patch}'

# Crear un nuevo tag en el repositorio local
repo.create_tag(new_tag)

# Pushear los tags al repositorio remoto
origin = repo.remote(name='origin')
origin.push(tags=True)

print(f"Nuevo tag creado: {new_tag}")

# Confirma que el tag ha sido creado en GitHub
response = requests.get(f'https://api.github.com/repos/{GITHUB_USER}/{REPO_NAME}/tags', auth=auth)
if response.status_code == 200:
    tags = response.json()
    tag_names = [tag['name'] for tag in tags]
    if new_tag in tag_names:
        print(f"El tag {new_tag} se ha subido correctamente a GitHub.")
    else:
        print(f"Error: El tag {new_tag} no se encuentra en el repositorio remoto.")
else:
    print(f"Error al obtener los tags del repositorio: {response.content}")

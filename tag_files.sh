#!/bin/bash

# Archivo que contiene las etiquetas
ARCHIVO_ETIQUETAS="FILE_TAGS.md"

# Función para etiquetar un archivo
etiquetar_archivo() {
  local ruta_archivo=$1
  local etiqueta=$2
  echo "Archivo: $ruta_archivo" >> $ARCHIVO_ETIQUETAS
  echo "Etiquetas: $etiqueta" >> $ARCHIVO_ETIQUETAS
  echo "" >> $ARCHIVO_ETIQUETAS
}

# Ejemplo de uso
etiquetar_archivo "FILE_TAGS.md" "v1.0, lanzamiento_inicial, crítico"
etiquetar_archivo "tag_files.sh" "v1.0, documentación, lanzamiento_inicial"

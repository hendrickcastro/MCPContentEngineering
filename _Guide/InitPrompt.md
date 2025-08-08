# MCP ContentEngineering - SIMPLIFICADO

## Descripción

Este MCP tiene **UNA SOLA FUNCIÓN**: devolver el contenido RAW de archivos Markdown sin procesar.

## Configuración

### Variables de Entorno

| Variable | Valores | Descripción |
|----------|---------|-------------|
| `CONTENT_SOURCE_TYPE` | `file` \| `directory` | Tipo de fuente de contenido |
| `CONTENT_SOURCE_PATH` | `/path/to/file.md` \| `/path/to/folder/` | Ruta al archivo o carpeta |

### Ejemplos de Configuración

```bash
# Para un archivo único
export CONTENT_SOURCE_TYPE=file
export CONTENT_SOURCE_PATH=/docs/business-rules.md

# Para una carpeta (une todos los .md)
export CONTENT_SOURCE_TYPE=directory
export CONTENT_SOURCE_PATH=/docs/knowledge-base/
```

## Herramienta Disponible

### `content_get_raw`

**Entrada:** Ninguna (usa variables de entorno)

**Comportamiento:**
1. **Si CONTENT_SOURCE_TYPE=file**: Lee ese archivo específico tal como está
2. **Si CONTENT_SOURCE_TYPE=directory**: Busca TODOS los archivos .md de forma recursiva y los une con separadores

---

**��� SIMPLE Y DIRECTO: Una herramienta, un propósito, contenido RAW cuando lo necesites.**

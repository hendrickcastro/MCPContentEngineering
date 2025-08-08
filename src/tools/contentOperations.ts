import { ToolResult } from './types.js';
import fs from 'fs-extra';
import path from 'path';

// ÚNICA HERRAMIENTA: Obtener contenido RAW - archivo único o unión de todos los .md de una carpeta
export const mcp_content_get_raw = async (args: {
  file_path?: string;
}): Promise<ToolResult<{
  content: string;
  source_info: string;
  total_files: number;
  size_bytes: number;
  last_modified: string;
}>> => {
  try {
    const contentSourceType = process.env.CONTENT_SOURCE_TYPE || 'directory';
    const contentSourcePath = process.env.CONTENT_SOURCE_PATH;
    
    if (!contentSourcePath) {
      return {
        success: false,
        error: 'CONTENT_SOURCE_PATH not configured'
      };
    }

    if (contentSourceType === 'file') {
      // CASO 1: Archivo único - leer el archivo tal como está
      if (!await fs.pathExists(contentSourcePath)) {
        return {
          success: false,
          error: `File not found: ${contentSourcePath}`
        };
      }

      const stat = await fs.stat(contentSourcePath);
      if (!stat.isFile()) {
        return {
          success: false,
          error: `Path is not a file: ${contentSourcePath}`
        };
      }

      const content = await fs.readFile(contentSourcePath, 'utf-8');
      
      return {
        success: true,
        data: {
          content: content,
          source_info: `Single file: ${contentSourcePath}`,
          total_files: 1,
          size_bytes: stat.size,
          last_modified: stat.mtime.toISOString()
        }
      };

    } else {
      // CASO 2: Directorio - unir TODOS los archivos .md
      if (!await fs.pathExists(contentSourcePath)) {
        return {
          success: false,
          error: `Directory not found: ${contentSourcePath}`
        };
      }

      const stat = await fs.stat(contentSourcePath);
      if (!stat.isDirectory()) {
        return {
          success: false,
          error: `Path is not a directory: ${contentSourcePath}`
        };
      }

      // Buscar todos los archivos .md recursivamente
      const { globSync } = await import('glob');
      const markdownFiles = globSync('**/*.md', { 
        cwd: contentSourcePath,
        absolute: true,
        nodir: true
      });

      if (markdownFiles.length === 0) {
        return {
          success: false,
          error: `No .md files found in directory: ${contentSourcePath}`
        };
      }

      // Leer y concatenar todos los archivos .md
      let combinedContent = '';
      let totalSize = 0;
      let latestModified = new Date(0);

      for (const filePath of markdownFiles) {
        const fileContent = await fs.readFile(filePath, 'utf-8');
        const fileStat = await fs.stat(filePath);
        
        // Agregar separador y nombre del archivo
        const relativePath = path.relative(contentSourcePath, filePath);
        combinedContent += `\n\n<!-- ========== ARCHIVO: ${relativePath} ========== -->\n\n`;
        combinedContent += fileContent;
        
        totalSize += fileStat.size;
        if (fileStat.mtime > latestModified) {
          latestModified = fileStat.mtime;
        }
      }

      return {
        success: true,
        data: {
          content: combinedContent.trim(),
          source_info: `Combined ${markdownFiles.length} .md files from: ${contentSourcePath}`,
          total_files: markdownFiles.length,
          size_bytes: totalSize,
          last_modified: latestModified.toISOString()
        }
      };
    }

  } catch (error: any) {
    return {
      success: false,
      error: `Failed to get raw content: ${error.message}`
    };
  }
};
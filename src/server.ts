#!/usr/bin/env node

/**
 * MCP ContentEngineering Server - SIMPLIFICADO
 * Solo maneja content_get_raw para obtener contenido Markdown sin procesar
 */

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';

// Import simplificado - solo content_get_raw
import { mcp_content_get_raw } from './tools/index.js';
import { MCP_CONTENT_TOOLS } from './tools.js';

// Crear servidor MCP
const server = new Server(
  {
    name: 'mcp-content-engineering',
    version: '1.0.0',
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

// Handler para listar herramientas
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: MCP_CONTENT_TOOLS,
  };
});

// Handler para ejecutar herramientas
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  try {
    const { name, arguments: args } = request.params;

    // Solo manejamos content_get_raw
    if (name === 'content_get_raw') {
      const result = await mcp_content_get_raw(args || {});
      
      if (result.success) {
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(result.data, null, 2),
            },
          ],
        };
      } else {
        return {
          content: [
            {
              type: 'text',
              text: `Error: ${result.error}`,
            },
          ],
          isError: true,
        };
      }
    }

    // Herramienta no encontrada
    return {
      content: [
        {
          type: 'text',
          text: `Unknown tool: ${name}. Only 'content_get_raw' is available.`,
        },
      ],
      isError: true,
    };

  } catch (error: any) {
    console.error('Error in tool execution:', error);
    return {
      content: [
        {
          type: 'text',
          text: `Internal error: ${error.message}`,
        },
      ],
      isError: true,
    };
  }
});

// Iniciar servidor
async function main() {
  console.log('Starting MCP ContentEngineering Server (Simplified)...');
  console.log('Available tool: content_get_raw');
  
  const transport = new StdioServerTransport();
  await server.connect(transport);
  
  console.log('Server running and ready to serve content!');
}

// Manejar errores no capturados
process.on('uncaughtException', (error) => {
  console.error('Uncaught exception:', error);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled rejection at:', promise, 'reason:', reason);
  process.exit(1);
});

// Ejecutar servidor
if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch((error) => {
    console.error('Server startup error:', error);
    process.exit(1);
  });
}
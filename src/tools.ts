// MCP Tools definition - SIMPLIFICADO: Solo content_get_raw

export const MCP_CONTENT_TOOLS = [
  {
    name: "content_get_raw",
    description: "Get raw markdown content without any processing. If source is a file, returns that file. If source is a directory, combines ALL .md files into one content with separators",
    inputSchema: {
      type: "object",
      properties: {
        file_path: {
          type: "string",
          description: "Not used - content source is determined by CONTENT_SOURCE_TYPE and CONTENT_SOURCE_PATH environment variables"
        }
      },
      additionalProperties: false
    }
  }
];
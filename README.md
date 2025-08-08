# MCP ContentEngineering - Simplified

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js Version](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen)](https://nodejs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8.3-blue)](https://www.typescriptlang.org/)
[![Jest](https://img.shields.io/badge/Jest-Testing-red)](https://jestjs.io/)
[![MCP Protocol](https://img.shields.io/badge/MCP-Protocol-purple)](https://github.com/modelcontextprotocol/sdk)
[![Claude Desktop](https://img.shields.io/badge/Claude-Desktop-orange)](https://claude.ai/desktop)
[![Cursor IDE](https://img.shields.io/badge/Cursor-IDE-green)](https://cursor.sh/)
[![Maintenance](https://img.shields.io/badge/Maintained-Yes-brightgreen)](https://github.com/hendrickcastro/MCPContentEngineering/graphs/commit-activity)

A **simplified Model Context Protocol (MCP)** server for **raw Markdown content** access. This server provides a single powerful tool for accessing raw Markdown files or combining multiple files from directories without any processing or parsing.

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm
- Markdown files or directories containing `.md` files
- MCP-compatible client (like Claude Desktop, Cursor IDE, or any MCP client)

### Installation & Configuration

#### Option 1: Using npx from GitHub (Recommended)
No installation needed! Just configure your MCP client:

**For Claude Desktop (`claude_desktop_config.json`):**
```json
{
  "mcpServers": {
    "mcp-content-engineering": {
      "command": "npx",
      "args": ["-y", "hendrickcastro/MCPContentEngineering"],
      "env": {
        "CONTENT_SOURCE_TYPE": "file",
        "CONTENT_SOURCE_PATH": "/path/to/your/business-rules.md"
      }
    }
  }
}
```

**For Cursor IDE:**
```json
{
  "mcpServers": {
    "mcp-content-engineering": {
      "command": "npx",
      "args": ["-y", "hendrickcastro/MCPContentEngineering"],
      "env": {
        "CONTENT_SOURCE_TYPE": "directory",
        "CONTENT_SOURCE_PATH": "/path/to/your/docs/"
      }
    }
  }
}
```

#### Option 2: Local Development Installation

1. **Clone and setup:**
```bash
git clone https://github.com/hendrickcastro/MCPContentEngineering.git
cd MCPContentEngineering
npm install
npm run build
```

2. **Configure content source:**
Create a `.env` file with your content configuration:
```bash
# For single file
CONTENT_SOURCE_TYPE=file
CONTENT_SOURCE_PATH=/docs/architecture-guide.md

# For directory with multiple .md files
CONTENT_SOURCE_TYPE=directory
CONTENT_SOURCE_PATH=/docs/knowledge-base/
```

3. **Configure MCP client with local path:**
```json
{
  "mcpServers": {
    "mcp-content-engineering": {
      "command": "node",
      "args": ["path/to/MCPContentEngineering/dist/server.js"]
    }
  }
}
```

## 🛠️ Available Tool

MCPContentEngineering provides **1 specialized tool** for Markdown content access:

### 🔄 **Raw Content Access** - `content_get_raw`
Get raw Markdown content without any processing, parsing, or indexing. Perfect for accessing business rules, documentation, or knowledge bases exactly as they are written.

**Features:**
- ✅ **Single File Mode**: Returns exact file content
- ✅ **Directory Mode**: Combines ALL `.md` files with clear separators
- ✅ **Recursive Search**: Finds `.md` files in subdirectories  
- ✅ **No Processing**: Content returned exactly as written
- ✅ **Metadata Included**: File size, modification date, source info

## 🔧 Configuration Types & Examples

MCPContentEngineering supports two content source types with simple configuration:

### 📋 Environment Variables

| Variable | Description | Values | Required |
|----------|-------------|---------|----------|
| `CONTENT_SOURCE_TYPE` | Content source type | `file` \| `directory` | Yes |
| `CONTENT_SOURCE_PATH` | Path to file or directory | Absolute or relative path | Yes |

### 🔧 Configuration Examples

### 1. 📄 Single Business Rules File
Perfect for accessing a specific rules or documentation file:

```json
{
  "mcpServers": {
    "mcp-content-engineering": {
      "command": "npx",
      "args": ["-y", "hendrickcastro/MCPContentEngineering"],
      "env": {
        "CONTENT_SOURCE_TYPE": "file",
        "CONTENT_SOURCE_PATH": "/docs/business-rules.md"
      }
    }
  }
}
```

### 2. 📁 Knowledge Base Directory
Combines all Markdown files from a documentation directory:

```json
{
  "mcpServers": {
    "mcp-content-engineering": {
      "command": "npx",
      "args": ["-y", "hendrickcastro/MCPContentEngineering"],
      "env": {
        "CONTENT_SOURCE_TYPE": "directory",
        "CONTENT_SOURCE_PATH": "/company/knowledge-base/"
      }
    }
  }
}
```

### 3. 🏗️ Architecture Documentation
Access comprehensive architecture documentation:

```json
{
  "mcpServers": {
    "mcp-content-engineering": {
      "command": "npx",
      "args": ["-y", "hendrickcastro/MCPContentEngineering"],
      "env": {
        "CONTENT_SOURCE_TYPE": "directory",
        "CONTENT_SOURCE_PATH": "/docs/architecture/"
      }
    }
  }
}
```

### 4. 📐 Project Standards & Patterns
Access coding standards and design patterns:

```json
{
  "mcpServers": {
    "mcp-content-engineering": {
      "command": "npx",
      "args": ["-y", "hendrickcastro/MCPContentEngineering"],
      "env": {
        "CONTENT_SOURCE_TYPE": "file",
        "CONTENT_SOURCE_PATH": "/standards/coding-patterns.md"
      }
    }
  }
}
```

### 5. 🔄 Local Development Configuration
For local development and testing:

```json
{
  "mcpServers": {
    "mcp-content-engineering": {
      "command": "node",
      "args": ["./MCPContentEngineering/dist/server.js"],
      "env": {
        "CONTENT_SOURCE_TYPE": "directory",
        "CONTENT_SOURCE_PATH": "./docs"
      }
    }
  }
}
```

## 📋 Usage Examples

### Single File Access
```typescript
// Returns exact content of business-rules.md
const result = await content_get_raw({});

console.log(result.data.content);
// Output: Raw markdown content exactly as written
// "# Business Rules\n\n## Validation Rules\n..."

console.log(result.data.source_info);
// Output: "Single file: /docs/business-rules.md"

console.log(result.data.total_files);
// Output: 1
```

### Directory Combination
```typescript
// Combines all .md files from directory
const result = await content_get_raw({});

console.log(result.data.content);
// Output: Combined content with separators:
/*
<!-- ========== ARCHIVO: rules.md ========== -->
# Business Rules
...

<!-- ========== ARCHIVO: patterns.md ========== -->
# Design Patterns
...
*/

console.log(result.data.source_info);
// Output: "Combined 2 .md files from: /docs/"

console.log(result.data.total_files);
// Output: 2
```

### Response Structure
```typescript
interface ContentResponse {
  content: string;           // Raw markdown content
  source_info: string;       // Source description
  total_files: number;       // Number of files processed
  size_bytes: number;        // Total content size
  last_modified: string;     // ISO timestamp of latest modification
}
```

## 💡 Use Cases

### 1. 📚 **Enterprise Knowledge Base**
Access company documentation, policies, and procedures:
```json
{
  "CONTENT_SOURCE_TYPE": "directory",
  "CONTENT_SOURCE_PATH": "/company/knowledge-base/"
}
```

### 2. 🏗️ **Architecture Documentation**
Provide AI models with architectural guidelines and patterns:
```json
{
  "CONTENT_SOURCE_TYPE": "file",
  "CONTENT_SOURCE_PATH": "/docs/architecture-layers-summary.md"
}
```

### 3. 📐 **Coding Standards**
Access development standards and best practices:
```json
{
  "CONTENT_SOURCE_TYPE": "directory",
  "CONTENT_SOURCE_PATH": "/standards/"
}
```

### 4. 🔍 **Business Rules Engine**
Provide specific business rules for decision-making:
```json
{
  "CONTENT_SOURCE_TYPE": "file",
  "CONTENT_SOURCE_PATH": "/rules/validation-rules.md"
}
```

### 5. 📖 **Project Documentation**
Combine all project documentation for comprehensive context:
```json
{
  "CONTENT_SOURCE_TYPE": "directory",
  "CONTENT_SOURCE_PATH": "/project/docs/"
}
```

## 🚨 Troubleshooting Common Issues

### File/Directory Not Found
- **Issue**: `File not found` or `Directory not found`
- **Solution**: Verify the path exists and is accessible
- **Check**: Use absolute paths for clarity

### No .md Files Found
- **Issue**: `No .md files found in directory`
- **Solution**: Ensure directory contains `.md` files
- **Note**: Searches recursively in subdirectories

### Permission Errors
- **Issue**: Permission denied when accessing files
- **Solution**: Ensure read permissions on files/directories
- **Check**: File ownership and access rights

### Configuration Issues
- **Issue**: `CONTENT_SOURCE_PATH not configured`
- **Solution**: Set both required environment variables
- **Required**: `CONTENT_SOURCE_TYPE` and `CONTENT_SOURCE_PATH`

## 🧪 Testing

Run the comprehensive test suite:
```bash
npm test
```

The test suite includes:
- ✅ **Unit Tests**: Temporary file testing with various scenarios
- ✅ **Real Tests**: Actual architecture documentation testing
- ✅ **Error Handling**: Comprehensive error case coverage
- ✅ **Content Validation**: JSON serialization and data structure validation

Test Results:
```
Test Suites: 2 passed, 2 total
Tests:       11 passed, 11 total
```

## 🏗️ Architecture

### Project Structure
```
MCPContentEngineering/
├── src/
│   ├── __tests__/              # Comprehensive test suite
│   │   ├── unit.test.ts        # Unit tests with temp files
│   │   └── real.test.ts        # Real file testing
│   ├── tools/                  # Tool implementation
│   │   ├── contentOperations.ts # Single tool: content_get_raw
│   │   ├── types.ts            # Type definitions
│   │   └── index.ts            # Tool exports
│   ├── server.ts               # MCP server setup
│   ├── tools.ts                # Tool definitions and schemas
│   └── mcp-server.ts           # Tool re-exports
├── dist/                       # Compiled JavaScript output
└── package.json               # Dependencies and scripts
```

### Key Features
- ⚡ **Zero Processing**: Content returned exactly as written
- 📁 **Recursive Search**: Finds `.md` files in all subdirectories
- 🔄 **File Combination**: Intelligent merging with clear separators
- 📊 **Rich Metadata**: Comprehensive file and content information
- 🛡️ **Error Handling**: Robust error handling and validation
- 🔧 **Simple Configuration**: Just two environment variables

## 📝 Important Notes

- **File Types**: Only processes `.md` (Markdown) files
- **Content Preservation**: Returns content exactly as written - no processing
- **Directory Mode**: Recursively finds ALL `.md` files in subdirectories
- **File Separators**: Clear HTML comment separators when combining files
- **Encoding**: Assumes UTF-8 encoding for all files
- **Security**: Read-only operations only - no file modifications

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes and add tests
4. Ensure all tests pass (`npm test`)
5. Commit your changes (`git commit -m 'Add amazing feature'`)
6. Push to the branch (`git push origin feature/amazing-feature`)
7. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Built with the [Model Context Protocol SDK](https://github.com/modelcontextprotocol/sdk)
- Uses [fs-extra](https://github.com/jprichardson/node-fs-extra) for file operations
- Uses [glob](https://github.com/isaacs/node-glob) for file discovery
- Comprehensive testing with [Jest](https://jestjs.io/)

## 🏷️ Tags & Keywords

**Content Management:** `markdown` `documentation` `knowledge-base` `content-access` `raw-content` `file-processing` `text-processing` `document-management`

**MCP & AI:** `model-context-protocol` `mcp-server` `mcp-tools` `ai-tools` `claude-desktop` `cursor-ide` `anthropic` `llm-integration` `ai-content` `intelligent-content`

**Technology:** `typescript` `nodejs` `npm-package` `cli-tool` `file-system` `markdown-reader` `content-sdk` `text-api` `file-api` `content-connector`

**Use Cases:** `business-rules` `architecture-docs` `coding-standards` `project-docs` `knowledge-management` `content-retrieval` `documentation-access` `standards-access` `rule-engine` `content-automation`

---

**🎯 MCPContentEngineering provides simple, direct access to raw Markdown content through the Model Context Protocol. Perfect for AI models that need access to business rules, documentation, or knowledge bases without any processing overhead!** 🚀
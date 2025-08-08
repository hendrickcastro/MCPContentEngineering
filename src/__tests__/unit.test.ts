/**
 * UNIT TESTS - content_get_raw with temporary files
 */

import { describe, it, expect, beforeAll, afterAll } from '@jest/globals';
import fs from 'fs-extra';
import path from 'path';
import { mcp_content_get_raw } from '../tools/index.js';
import { ToolResult } from '../tools/types.js';

// Type guards for ToolResult
function isSuccessResult<T>(result: ToolResult<T>): result is { success: true; data: T } {
  return result.success === true;
}

function isErrorResult<T>(result: ToolResult<T>): result is { success: false; error: string } {
  return result.success === false;
}

describe('🧪 UNIT Tests - content_get_raw', () => {
  const testDir = path.join(process.cwd(), 'test-content-unit');
  const testFile1 = path.join(testDir, 'rules.md');
  const testFile2 = path.join(testDir, 'patterns.md');
  const singleFile = path.join(testDir, 'business-guide.md');

  beforeAll(async () => {
    // Create test directory
    await fs.ensureDir(testDir);
    
    // Create test files
    await fs.writeFile(testFile1, '# Business Rules\n\n- Rule 1: Validate data\n- Rule 2: Authorization required');
    await fs.writeFile(testFile2, '# Design Patterns\n\n## Singleton\nUse for configuration.\n\n## Factory\nFor creating objects.');
    await fs.writeFile(singleFile, '# Business Guide\n\nThis is a complete guide of rules and patterns for development.');
  });

  afterAll(async () => {
    // Clean up test files
    await fs.remove(testDir);
  });

  describe('📄 Single file', () => {
    it('should read raw content from a specific file', async () => {
      // Configure for single file
      process.env.CONTENT_SOURCE_TYPE = 'file';
      process.env.CONTENT_SOURCE_PATH = singleFile;

      const result = await mcp_content_get_raw({});

      expect(isSuccessResult(result)).toBe(true);
      if (isSuccessResult(result)) {
        expect(result.data.content).toContain('# Business Guide');
        expect(result.data.content).toContain('This is a complete guide');
        expect(result.data.total_files).toBe(1);
        expect(result.data.source_info).toContain('Single file:');
        expect(result.data.size_bytes).toBeGreaterThan(0);
      }
    });
  });

  describe('📁 Multiple directory', () => {
    it('should combine all .md files from a directory', async () => {
      // Configure for directory
      process.env.CONTENT_SOURCE_TYPE = 'directory';
      process.env.CONTENT_SOURCE_PATH = testDir;

      const result = await mcp_content_get_raw({});

      expect(isSuccessResult(result)).toBe(true);
      if (isSuccessResult(result)) {
        // Verify contains all files
        expect(result.data.content).toContain('# Business Rules');
        expect(result.data.content).toContain('# Design Patterns');
        expect(result.data.content).toContain('# Business Guide');
        
        // Verify separators
        expect(result.data.content).toContain('ARCHIVO: rules.md');
        expect(result.data.content).toContain('ARCHIVO: patterns.md');
        expect(result.data.content).toContain('ARCHIVO: business-guide.md');
        
        // Verify metadata
        expect(result.data.total_files).toBe(3);
        expect(result.data.source_info).toContain('Combined 3 .md files');
        expect(result.data.size_bytes).toBeGreaterThan(0);
      }
    });

    it('should include specific content from each file in the union', async () => {
      process.env.CONTENT_SOURCE_TYPE = 'directory';
      process.env.CONTENT_SOURCE_PATH = testDir;

      const result = await mcp_content_get_raw({});

      expect(isSuccessResult(result)).toBe(true);
      if (isSuccessResult(result)) {
        // Verify specific content from each file
        expect(result.data.content).toContain('Rule 1: Validate data');
        expect(result.data.content).toContain('Singleton');
        expect(result.data.content).toContain('Factory');
        expect(result.data.content).toContain('complete guide of rules');
      }
    });
  });

  describe('❌ Error cases', () => {
    it('should return error for non-existent file', async () => {
      process.env.CONTENT_SOURCE_TYPE = 'file';
      process.env.CONTENT_SOURCE_PATH = '/file/that/does/not/exist.md';

      const result = await mcp_content_get_raw({});

      expect(isErrorResult(result)).toBe(true);
      if (isErrorResult(result)) {
        expect(result.error).toContain('File not found');
      }
    });

    it('should return error for non-existent directory', async () => {
      process.env.CONTENT_SOURCE_TYPE = 'directory';
      process.env.CONTENT_SOURCE_PATH = '/directory/that/does/not/exist';

      const result = await mcp_content_get_raw({});

      expect(isErrorResult(result)).toBe(true);
      if (isErrorResult(result)) {
        expect(result.error).toContain('Directory not found');
      }
    });

    it('should return error when CONTENT_SOURCE_PATH not configured', async () => {
      delete process.env.CONTENT_SOURCE_PATH;

      const result = await mcp_content_get_raw({});

      expect(isErrorResult(result)).toBe(true);
      if (isErrorResult(result)) {
        expect(result.error).toBe('CONTENT_SOURCE_PATH not configured');
      }
    });
  });
});
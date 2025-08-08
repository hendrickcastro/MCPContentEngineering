/**
 * REAL TESTS - content_get_raw with actual Architecture-Layers-Summary.md
 */

import { describe, it, expect } from '@jest/globals';
import path from 'path';
import fs from 'fs-extra';
import { mcp_content_get_raw } from '../tools/index.js';
import { ToolResult } from '../tools/types.js';

// Type guards for ToolResult
function isSuccessResult<T>(result: ToolResult<T>): result is { success: true; data: T } {
  return result.success === true;
}

function isErrorResult<T>(result: ToolResult<T>): result is { success: false; error: string } {
  return result.success === false;
}

describe('🎯 REAL Tests - content_get_raw with Architecture-Layers-Summary.md', () => {
  const realFile = path.join(process.cwd(), 'test-real-content', 'Architecture-Layers-Summary.md');
  const realDir = path.join(process.cwd(), 'test-real-content');

  describe('📄 Real single file test', () => {
    it('should read the actual Architecture-Layers-Summary.md file', async () => {
      // Verify file exists before testing
      const fileExists = await fs.pathExists(realFile);
      expect(fileExists).toBe(true);

      // Configure for single file
      process.env.CONTENT_SOURCE_TYPE = 'file';
      process.env.CONTENT_SOURCE_PATH = realFile;

      const result = await mcp_content_get_raw({});

      expect(isSuccessResult(result)).toBe(true);
      if (isSuccessResult(result)) {
        // Verify it contains expected architecture content
        expect(result.data.content).toContain('RTS.ManagerService Layering Summary');
        expect(result.data.content).toContain('Entities');
        expect(result.data.content).toContain('Data Access Layer');
        expect(result.data.content).toContain('Business Implementations');
        expect(result.data.content).toContain('Business Interfaces');
        expect(result.data.content).toContain('Controllers');
        
        // Verify specific architectural patterns
        expect(result.data.content).toContain('GetNullableValue');
        expect(result.data.content).toContain('JsonProperty');
        expect(result.data.content).toContain('BaseDataAccess');
        
        // Verify metadata
        expect(result.data.total_files).toBe(1);
        expect(result.data.source_info).toContain('Single file:');
        expect(result.data.size_bytes).toBeGreaterThan(5000); // Architecture doc should be substantial
        expect(result.data.last_modified).toBeDefined();
      }
    });

    it('should contain specific architectural rules', async () => {
      process.env.CONTENT_SOURCE_TYPE = 'file';
      process.env.CONTENT_SOURCE_PATH = realFile;

      const result = await mcp_content_get_raw({});

      expect(isSuccessResult(result)).toBe(true);
      if (isSuccessResult(result)) {
        // Test for specific rules that should be in the architecture doc
        expect(result.data.content).toContain('MUST use `GetNullableValue<T>`');
        expect(result.data.content).toContain('NullValueHandling.Ignore');
        expect(result.data.content).toContain('Task.WhenAll');
        expect(result.data.content).toContain('async Task<');
        
        // Test for layer structure
        expect(result.data.content).toContain('### 1) Entities');
        expect(result.data.content).toContain('### 2) Data');
        expect(result.data.content).toContain('### 3) Business');
        expect(result.data.content).toContain('### 4) Business Interfaces');
        expect(result.data.content).toContain('### 5) Controllers');
      }
    });
  });

  describe('📁 Real directory test', () => {
    it('should combine files from test-real-content directory', async () => {
      // Verify directory exists
      const dirExists = await fs.pathExists(realDir);
      expect(dirExists).toBe(true);

      // Configure for directory
      process.env.CONTENT_SOURCE_TYPE = 'directory';
      process.env.CONTENT_SOURCE_PATH = realDir;

      const result = await mcp_content_get_raw({});

      expect(isSuccessResult(result)).toBe(true);
      if (isSuccessResult(result)) {
        // Should contain the architecture content
        expect(result.data.content).toContain('RTS.ManagerService Layering Summary');
        
        // Should have file separator for the architecture file
        expect(result.data.content).toContain('ARCHIVO: Architecture-Layers-Summary.md');
        
        // Verify metadata for directory operation
        expect(result.data.total_files).toBeGreaterThanOrEqual(1);
        expect(result.data.source_info).toContain('Combined');
        expect(result.data.source_info).toContain('.md files from:');
        expect(result.data.size_bytes).toBeGreaterThan(5000);
      }
    });

    it('should preserve content integrity when combining directory files', async () => {
      process.env.CONTENT_SOURCE_TYPE = 'directory';
      process.env.CONTENT_SOURCE_PATH = realDir;

      const result = await mcp_content_get_raw({});

      expect(isSuccessResult(result)).toBe(true);
      if (isSuccessResult(result)) {
        // Content should be properly separated and readable
        const separatorCount = (result.data.content.match(/<!-- ========== ARCHIVO:/g) || []).length;
        expect(separatorCount).toBe(result.data.total_files);
        
        // Each file should be clearly separated
        expect(result.data.content).toContain('<!-- ========== ARCHIVO: Architecture-Layers-Summary.md ==========');
        
        // Content should still contain all the important architectural info
        expect(result.data.content).toContain('GetNullableValue');
        expect(result.data.content).toContain('BaseDataAccess');
        expect(result.data.content).toContain('IBusinessServices');
      }
    });
  });

  describe('🔍 Content validation', () => {
    it('should return valid JSON-serializable data', async () => {
      process.env.CONTENT_SOURCE_TYPE = 'file';
      process.env.CONTENT_SOURCE_PATH = realFile;

      const result = await mcp_content_get_raw({});

      expect(isSuccessResult(result)).toBe(true);
      if (isSuccessResult(result)) {
        // Test that data can be JSON serialized (important for MCP)
        expect(() => JSON.stringify(result.data)).not.toThrow();
        
        // Test data structure
        expect(typeof result.data.content).toBe('string');
        expect(typeof result.data.source_info).toBe('string');
        expect(typeof result.data.total_files).toBe('number');
        expect(typeof result.data.size_bytes).toBe('number');
        expect(typeof result.data.last_modified).toBe('string');
        
        // Test that last_modified is a valid ISO date
        expect(() => new Date(result.data.last_modified)).not.toThrow();
      }
    });
  });
});

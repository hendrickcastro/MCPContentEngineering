# MCPContentEngineering Security Configuration

## Security Environment Variables

This project includes security mechanisms to prevent unauthorized access and ensure safe content processing, especially important when working with sensitive documentation and business rules.

### Available Variables

#### `CONTENT_READ_ONLY`
- **Default value**: `true`
- **Description**: Controls whether content modifications are allowed
- **Operations blocked when `true`**:
  - Content file modifications
  - Source file deletion
  - Content source modifications
  - Index manipulation beyond read operations

#### `ALLOW_EXTERNAL_SOURCES`
- **Default value**: `false`
- **Description**: Controls whether external content sources are allowed
- **Blocked sources when `false`**:
  - HTTP/HTTPS URLs
  - Network paths
  - External APIs
  - Remote repositories

#### `VALIDATE_PATHS`
- **Default value**: `true`
- **Description**: Controls path validation and sanitization
- **Security checks when `true`**:
  - Prevents directory traversal attacks
  - Blocks access to system directories
  - Validates file path formats
  - Sanitizes input paths

#### `MAX_FILE_SIZE_MB`
- **Default value**: `10`
- **Description**: Maximum file size in MB to prevent resource exhaustion
- **Security purpose**:
  - Prevents DoS attacks through large files
  - Controls memory usage
  - Limits processing time

#### `MAX_INDEX_SIZE_MB`
- **Default value**: `100`
- **Description**: Maximum total index size to prevent resource exhaustion
- **Security purpose**:
  - Prevents storage exhaustion
  - Controls memory usage
  - Limits processing overhead

## Configuration

### .env File
```env
# Security settings
CONTENT_READ_ONLY=true
ALLOW_EXTERNAL_SOURCES=false
VALIDATE_PATHS=true
MAX_FILE_SIZE_MB=10
MAX_INDEX_SIZE_MB=100

# Debug and logging (avoid in production)
DEBUG_MODE=false
LOG_FILE_PATH=./content_debug.log
```

### System Variables (alternative)
```bash
# Windows
set CONTENT_READ_ONLY=true
set ALLOW_EXTERNAL_SOURCES=false
set VALIDATE_PATHS=true

# Linux/Mac
export CONTENT_READ_ONLY=true
export ALLOW_EXTERNAL_SOURCES=false
export VALIDATE_PATHS=true
```

## Check Security Status

Use the `content_get_stats` tool to verify current security configuration:

```json
{
  "name": "content_get_stats",
  "arguments": {
    "include_details": true
  }
}
```

This tool returns:
- Current security variable status
- Configuration validation results
- Content source security status
- Recommended security settings

## Error Messages

### When content modifications are blocked:
```
Error: Content modification operations are blocked for security.
Content sources are configured as read-only.
To enable modifications, set: CONTENT_READ_ONLY=false
CAUTION: Only enable in trusted environments.
```

### When external sources are blocked:
```
Error: External content sources are blocked for security.
To enable external sources, set: ALLOW_EXTERNAL_SOURCES=true
CAUTION: Only enable external sources from trusted locations.
```

### When path validation fails:
```
Error: Path validation failed for security reasons.
Invalid characters or patterns detected in path.
Ensure paths do not contain: ../, /etc/, /sys/, or other restricted patterns.
```

### When file size limits are exceeded:
```
Error: File size exceeds security limit.
Maximum allowed file size: 10MB
To increase limit, set: MAX_FILE_SIZE_MB=<new_limit>
CAUTION: Large files may impact performance and security.
```

## Best Practices

1. **Production**: Keep all security variables at their default secure values
2. **Development**: Enable only necessary permissions for development tasks
3. **Testing**: Use restrictive configuration for security testing
4. **Monitoring**: Regularly check security status and audit logs
5. **Content Sources**: Only use trusted, validated content sources
6. **Path Validation**: Always enable path validation in production
7. **Size Limits**: Set appropriate limits based on your content requirements

## Always Allowed Operations

The following operations are always permitted regardless of security configuration:
- Content reading and search
- Structure analysis
- Concept extraction
- Statistics generation
- Summary creation
- Rule and pattern analysis
- Content indexing (read-only)
- Metadata extraction

## Security Validation

MCPContentEngineering includes multiple layers of security validation:

### Path Security
- Prevents directory traversal (`../` sequences)
- Blocks access to system directories (`/etc/`, `/sys/`, `/proc/`)
- Validates file extensions against allowed types
- Sanitizes all input paths

### Content Security
- Validates file sizes before processing
- Checks total index size limits
- Validates content types and formats
- Sanitizes extracted content

### Source Security
- Validates content source paths
- Blocks external/remote sources when disabled
- Checks file permissions and accessibility
- Validates source configuration

## Incident Response

If security violations are detected:

1. **Log the incident**: All security violations are logged with timestamps
2. **Block the operation**: Prevent potentially harmful operations
3. **Return error message**: Provide clear security error messages
4. **Audit configuration**: Review and validate security settings
5. **Update security**: Strengthen security configuration if needed

## Security Updates

Keep MCPContentEngineering updated to receive security patches:

```bash
npm update mcp-content-engineering
```

## Reporting Security Issues

If you discover security vulnerabilities:

1. **Do not** open public issues for security vulnerabilities
2. **Contact** the maintainers privately
3. **Provide** detailed information about the vulnerability
4. **Wait** for confirmation before public disclosure

## Compliance

MCPContentEngineering follows security best practices for:
- Input validation and sanitization
- Path traversal prevention
- Resource limit enforcement
- Access control validation
- Error handling and logging
- Secure defaults configuration

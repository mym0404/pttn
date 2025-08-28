# Initialize Claude Code Project with Self-Reference Capabilities

## Task

Set up this project with intelligent self-reference capabilities by creating project-specific Claude Code configuration and directory structure.

## Implementation Steps

### 1. Create or Update project CLAUDE.md file

**Important**: If `CLAUDE.md` already exists in the project:

- **Merge Strategy**: Improve and integrate existing sections while preserving valuable content
- **New Sections**: Add any missing sections at the end of the file
- **Preserve**: Keep any project-specific customizations and domain knowledge

Create or update `CLAUDE.md` file in the project root with the following content, customizing it for this specific project:

====================== BEGIN CLAUDE.md CONTENT ======================

# Project Context for Claude Code

## Project Overview

[Analyze the current project and describe: project type, main purpose, key features]

## Architecture & Tech Stack

- **Language**: [Identify primary language from package.json/files]
- **Framework**: [Detect framework from dependencies] with major version if necessary
- **Key Dependencies**: [List important libraries from package.json] with major version if necessary

## Development Guidelines

- **Code Style**: [Infer from existing code patterns and configs]
- **Testing Strategy**: [Check for test files and testing frameworks]
- **Documentation**: [Observe documentation patterns]

## Project Structure

[Analyze and document the key directories and their purposes]

## Domain Knowledge

[If this is a domain-specific project, document relevant business logic or constraints]

## Code Patterns & Conventions

[Observe and document coding patterns, naming conventions, and architectural decisions used in this project]

## cc-self-refer System

This project uses cc-self-refer for intelligent self-reference capabilities. Claude Code agents should use these CLI commands to access and manage project context automatically:

```bash
# IMPORTANT: Claude Code agents should use these commands proactively
# Search and access existing content before starting tasks
npx cc-self-refer plan search "keyword"       # Find relevant plans
npx cc-self-refer knowledge search "topic"    # Find domain knowledge
npx cc-self-refer pattern search "keyword"    # Find reusable patterns
npx cc-self-refer page search "session"       # Find previous sessions

# List and view specific content
npx cc-self-refer plan list                   # List all plans
npx cc-self-refer plan view <id>              # Load specific plan
npx cc-self-refer knowledge list              # List all knowledge
npx cc-self-refer knowledge view <id>         # Load specific knowledge
npx cc-self-refer pattern list                # List all patterns
npx cc-self-refer pattern view <id>           # Load specific pattern
npx cc-self-refer page list                   # List all sessions
npx cc-self-refer page view <id>              # Load session context

# Create new content when discovering valuable information
npx cc-self-refer plan create "title" "desc"      # Create strategic plans
npx cc-self-refer knowledge create "title" "desc" # Document domain knowledge
npx cc-self-refer pattern create "title" "desc"   # Save reusable patterns
npx cc-self-refer page save "title" "desc"      # Save session context
```

**Agent Guidelines:**

- Search for relevant context before starting tasks
- Use existing knowledge, patterns, and plans for implementation
- Create entries when discovering valuable insights

.claude/
├── pages/ # Session History  
├── plans/ # Strategic Plans
├── patterns/ # Code Templates
└── knowledges/ # Domain Knowledge

### Usage Workflow

**Agent Task Flow:**

1. Search for relevant context: `npx cc-self-refer <type> search "keyword"`
2. Load existing content: `npx cc-self-refer <type> view <id>`
3. Work with full project context
4. Create new entries: `npx cc-self-refer <type> create "title" "description"`

====================== END CLAUDE.md CONTENT ======================

### 2. Analyze and Initialize Knowledge Base and Patterns

**Important**: Instead of manually adding domain knowledge and code patterns to CLAUDE.md, analyze the project and use the CLI commands to populate the knowledge and pattern directories:

#### Domain Knowledge Analysis

After analyzing the project's business logic, API constraints, and domain-specific rules:

```bash
# Create knowledge entries for domain-specific information
npx -y cc-self-refer knowledge create "API Rate Limits" "# API Rate Limits

## Overview
Third-party API has strict rate limiting that affects our application behavior.

## Constraints
- Maximum 100 requests per minute per API key
- 429 responses include Retry-After header
- Rate limit resets at the top of each minute

## Implementation Guidelines
- Implement exponential backoff with jitter
- Cache responses for 5 minutes when possible
- Use queue system for burst requests
- Monitor rate limit headers: X-RateLimit-Remaining

## Retry Strategy
1. Wait for Retry-After header value
2. Exponential backoff: 1s, 2s, 4s, 8s
3. Maximum 3 retry attempts
4. Log rate limit violations for monitoring"

npx -y cc-self-refer knowledge create "User Authentication" "# User Authentication Rules

## Overview
Authentication system using JWT tokens with role-based access control.

## Business Rules
- Users must verify email before accessing premium features
- Session expires after 24 hours of inactivity
- Password must contain 8+ chars, 1 uppercase, 1 number, 1 special char
- Account locks after 5 failed login attempts for 30 minutes

## Implementation Guidelines
- Store JWT in httpOnly cookies, not localStorage
- Refresh tokens valid for 7 days
- Role checks required on both client and server
- Implement proper logout (token blacklisting)

## Security Considerations
- Rate limit login attempts: 10 per minute per IP
- Log all authentication events
- Use bcrypt with 12 rounds for password hashing"
```

#### Code Pattern Analysis

After identifying reusable code patterns and architectural decisions:

```bash
# Create pattern entries for reusable code templates
npx -y cc-self-refer pattern create "React Hook Pattern" "# Custom React Hook Pattern

## Pattern Description
Standard structure for creating reusable custom hooks with proper error handling and loading states.

## Implementation
\`\`\`tsx
import { useState, useEffect } from 'react';

export const useApiData = <T>(url: string) => {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await fetch(url);
        if (!response.ok) throw new Error('Failed to fetch');
        const result = await response.json();
        setData(result);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [url]);

  return { data, loading, error };
};
\`\`\`

## Usage Example
\`\`\`tsx
const UserProfile = () => {
  const { data: user, loading, error } = useApiData<User>('/api/user/profile');

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return <div>{user?.name}</div>;
};
\`\`\`

## When to Use
- Any async data fetching operation
- Need consistent loading/error states
- Want to avoid useEffect boilerplate"

npx -y cc-self-refer pattern create "API Error Handling" "# API Error Handling Pattern

## Pattern Description
Consistent error handling across all API calls with proper user feedback and logging.

## Implementation
\`\`\`typescript
export class ApiError extends Error {
  constructor(
    public status: number,
    public code: string,
    message: string,
    public details?: any
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

export const handleApiError = (error: unknown): ApiError => {
  if (error instanceof ApiError) return error;

  if (error instanceof Response) {
    return new ApiError(
      error.status,
      'HTTP_ERROR',
      \`HTTP \${error.status}: \${error.statusText}\`
    );
  }

  if (error instanceof Error) {
    return new ApiError(500, 'UNKNOWN_ERROR', error.message);
  }

  return new ApiError(500, 'UNKNOWN_ERROR', 'An unexpected error occurred');
};

export const apiCall = async <T>(
  url: string,
  options?: RequestInit
): Promise<T> => {
  try {
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
      ...options,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new ApiError(
        response.status,
        errorData.code || 'HTTP_ERROR',
        errorData.message || response.statusText,
        errorData
      );
    }

    return response.json();
  } catch (error) {
    const apiError = handleApiError(error);

    // Log error for monitoring
    console.error('API Error:', {
      url,
      status: apiError.status,
      code: apiError.code,
      message: apiError.message,
    });

    throw apiError;
  }
};
\`\`\`

## Usage Example
\`\`\`typescript
try {
  const user = await apiCall<User>('/api/users/123');
  return user;
} catch (error) {
  if (error instanceof ApiError) {
    if (error.status === 404) {
      showToast('User not found', 'error');
    } else if (error.status >= 500) {
      showToast('Server error, please try again', 'error');
    } else {
      showToast(error.message, 'error');
    }
  }
  throw error;
}
\`\`\`

## When to Use
- All API communication
- Need consistent error handling
- Want centralized error logging
- Need user-friendly error messages"
```

### 3. Ensure .claude directory structure exists

Verify the following directories exist (create if missing):

- `.claude/pages/` - For session history
- `.claude/plans/` - For strategic planning documents
- `.claude/patterns/` - For reusable code patterns
- `.claude/knowledges/` - For domain knowledge base
- `.claude/commands/` - For Claude Code commands

## Quick Reference

After running this initialization, your project will have the `.claude/` directory with all necessary commands and structure for intelligent self-reference capabilities.

## Success Criteria

After completion:

- `CLAUDE.md` exists with project-specific context
- `.claude/` directory structure is ready with all commands
- Self-referential development system ready for intelligent, context-aware sessions
- Team can build and share knowledge incrementally across development cycles

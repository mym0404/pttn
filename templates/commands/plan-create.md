# Plan Create - Interactive Implementation Planning System

Create comprehensive development plans markdown content through deep interactive dialogue and run cli with that content.

**Usage**: `/plan-create`

## Purpose

This command initiates a comprehensive implementation planning process through extensive conversation. It transforms basic ideas into detailed, actionable implementation plans.

### ⚠️ IMPORTANT: CLI Command Execution Required

**This command MUST execute the `cc-self-refer plan create` CLI command after the interactive planning phase.**

### CLI Commands Used

```bash
# Create the implementation plan after planning:
npx -y cc-self-refer plan create "<plan-title>" <<'EOF'
<plan-content>
EOF
```

## Interactive Deep-Dive Process

## Interactive Planning Process

**Simple Workflow:**
1. Ask what the user wants to plan
2. Have a conversation to understand details
3. Create the plan with CLI command

**Start by asking:**

```
What would you like to plan?

Please describe:
- What you want to implement
- The problem it solves
- Your current tech setup

I'll ask follow-up questions to create a detailed plan.
```

Then have a natural conversation asking about:
- Technical details and architecture
- Specific requirements and features  
- Files that need changes
- Dependencies and integrations
- Success criteria

After gathering enough information, create the plan using:

```bash
npx -y cc-self-refer plan create "<plan-title>" <<'EOF'
<plan-content>
EOF
```

## Plan Document Template

**IMPORTANT: the following implementation details are just example. The content of implementation section will vary depend on the plan requirement. **

======================TEMPLATE=====================
```markdown
# <Task Name>

## Overview
[Concise description of what needs to be done, why it's needed, and expected outcome]

## Implementation

### Required Content


**Technical Stack & Dependencies**
- Framework: [React, Vue, Node.js, etc.]
- Language & Version: [TypeScript 5.x, Node 18+, etc.]  
- Package Manager: [npm, pnpm, yarn]
- Required Dependencies: List exact package names and versions
- New Dependencies to Install: Exact commands to run
  ```bash
  npm install package-name@version
  pnpm add package-name
  ```

**Architecture & File Structure **
- Directory Structure: Show exact paths where files will be created/modified
- Component/Module Design: Describe the main classes, functions, or components
- Data Flow: How data moves through the system
- State Management: Redux, Context, or other patterns used

**Implementation Steps **
1. **Setup Phase**
   - Environment configuration
   - Dependency installation commands (exact CLI commands)
   - Database migration commands (if needed)

2. **Core Development**
   - File Creation: List all new files to create with their exact paths
   - File Modification: List existing files to modify with specific functions/sections
   - Code Patterns: Reference existing patterns or describe new ones

3. **Integration Phase**  
   - API Integration: Exact endpoint URLs, request/response formats
   - Component Integration: How new components connect to existing ones
   - Testing Integration: Test file locations and testing commands

4. **Validation & Deployment**
   - Build Commands: `npm run build`, `pnpm build`, etc.
   - Test Commands: `npm test`, `pnpm test`, `npm run e2e`, etc.
   - Linting Commands: `npm run lint`, `pnpm lint`, etc.

**Configuration Details **
- Environment Variables: Exact variable names and example values
- Config Files: Which files need modification (tsconfig.json, package.json, etc.)
- Build Settings: Webpack, Vite, or other build tool configurations

**External References **
- Documentation Links: Include exact URLs for libraries, APIs, or frameworks
- CLI Commands from Docs: Copy exact commands from documentation
  ```bash
  # Example: From Next.js docs
  npx create-next-app@latest my-app --typescript --tailwind
  ```
- Code Examples: Include relevant code snippets from documentation

**Error Handling & Edge Cases (에러 처리 및 엣지 케이스)**
- Common Error Scenarios: What could go wrong and how to handle it
- Validation Rules: Input validation, data validation requirements
- Fallback Strategies: What to do when primary approach fails

**Performance Considerations (성능 고려사항)**
- Optimization Strategies: Lazy loading, caching, bundling
- Monitoring: How to measure success (metrics, logging)
- Scalability: How the solution handles growth



## Todo List
- [ ] [Specific action item 1]
- [ ] [Specific action item 2]
- [ ] [Specific action item 3]
- [ ] [Additional tasks as needed]

## Success Criteria
- [ ] [Measurable outcome 1]
- [ ] [Measurable outcome 2]
- [ ] [Test or validation requirement]

## References
- Pattern #[N]: [Brief description if needed]
- Spec #[N]: [Spec title or topic]
- Page #[N]: [Previous session topic]
- File: `path/to/relevant/file.ts`
- Docs: [External documentation link if needed]
```

======================TEMPLATE END=====================

### Q&A Completion Checklist

**Only proceed to CLI execution when:**
- ✅ All technical decisions clarified
- ✅ Implementation approach validated
- ✅ Success criteria defined
- ✅ No ambiguous requirements

**If user seems impatient:**
"I need these details to create an actionable plan. The more specific the information, the better the plan will be."

### Plan Flexibility Guide

**The Implementation section should adapt to your task type:**

- **Feature Development**: Frameworks, libraries, new files to create
- **Bug Fixes**: Root cause analysis, specific code changes
- **Performance**: Metrics, optimization strategies, benchmarks  
- **Refactoring**: Architecture changes, migration steps
- **Configuration**: Environment variables, deployment settings
- **Integration**: API endpoints, authentication, data flow

**Keep it practical:** Include only what's needed for execution. Skip sections if they don't apply.

## Output Characteristics

The implementation plans created should:
- Capture complete technical requirements discussed in conversation
- Be detailed enough for developers to execute immediately
- Include specific file paths, code snippets, and dependencies
- Provide clear success criteria and validation steps
- Reference existing patterns, specs, or previous sessions when relevant

## Reference Commands

If users want to reference existing content while creating plans:

```bash
# View existing patterns
npx cc-self-refer pattern list
npx cc-self-refer pattern search "<keyword>"  
npx cc-self-refer pattern view "<pattern-id>"

# View existing specs  
npx cc-self-refer spec list
npx cc-self-refer spec search "<keyword>"
npx cc-self-refer spec view "<spec-id>"

# View existing plans
npx cc-self-refer plan list
npx cc-self-refer plan search "<keyword>"
npx cc-self-refer plan view "<plan-id>"
```


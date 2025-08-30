# Use Code Pattern - Apply Predefined Code Patterns

Retrieve and apply code patterns with `cc-self-refer pattern search` command

**Usage**: `/pattern-use <number|keyword>`

## What does this command do

### ⚠️ IMPORTANT: CLI Command Execution Required

**This command MUST execute the following `cc-self-refer` CLI commands.**

### CLI Commands Used

```bash
# Search for patterns first
npx -y cc-self-refer pattern search <keyword>

# View specific pattern
npx -y cc-self-refer pattern view <id_or_keyword>

# List all patterns
npx -y cc-self-refer pattern list
```

### Command Arguments
- `id_or_keyword`: Pattern ID number or search keyword  

### Expected Workflow
1. Search for relevant patterns using `npx -y cc-self-refer pattern search`
2. Check search results:
   - If search result contains full pattern content, use that content directly
   - If search result only shows summary/metadata, use `npx -y cc-self-refer pattern view <number>` for complete content
3. Use printed code pattern as a references in the development process with flexible adaption by the circumstances.


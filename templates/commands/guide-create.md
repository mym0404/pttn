# Guide Create - Project Coding Guidelines

Add project-specific coding guidelines to CLAUDE.md file.

**Usage**: `/guide-create <guide-content>`

## What does this command do

### ⚠️ IMPORTANT: Direct CLAUDE.md File Modification

**This command modifies CLAUDE.md directly, not through CLI.**

1. Read project root CLAUDE.md file
2. Find [GUIDE LIST] ~ [GUIDE LIST END] section  
3. Add new guide with ### heading
4. Write guide content

### Guide Structure Template

```markdown
### {Guide Title}

{Brief description of the guideline}

**Rules:**
- Specific rule 1
- Specific rule 2

**Good:**
```{language}
// Recommended approach
{good example code}
```

**Bad:**
```{language}
// Avoid this approach  
{bad example code}
```

**When to apply:**
- When situation 1
- When situation 2
```

## Example Usage

When user requests:
```
/guide-create "In this project, use Lucide React icons only. No emojis or custom SVGs. Import from 'lucide-react' and use size prop (16, 20, 24)."
```

Claude will:
1. Parse the guide content from user input
2. **If intent is unclear, ask clarifying questions**
3. Extract title and create structured guide format
4. Add to CLAUDE.md [GUIDE LIST] section using Edit tool

### Content Requirements

**IMPORTANT: Always ask for clarification if user intent is unclear**

Guides must be:
- **Concise but complete**: Include all essential information
- **Actionable**: Specific rules developers can follow
- **Clear examples**: Show good vs bad practices when relevant

If user input lacks clarity, ask questions like:
- "What specific rules should developers follow?"
- "Are there particular tools/libraries to use or avoid?"
- "When should this guideline be applied?"

## Implementation

- Use Read tool to check current CLAUDE.md
- Use Edit tool to add guide in [GUIDE LIST] section
- Add guide with ### heading level
- Follow consistent format with existing guides
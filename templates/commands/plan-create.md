# Plan Create - Create New Strategic Planning Document

Create comprehensive strategic planning documents with structured templates.

**Usage**: `/plan-create <task-name> <description>`

## What does this command do

### ⚠️ IMPORTANT: CLI Command Execution Required

**This command MUST execute the following `cc-self-refer` CLI command.**

### CLI Command Used

```bash
npx -y cc-self-refer plan create "<task-name>" "<description>"
```

### Command Arguments
- `task-name`: Name of the strategic plan/task
- `description`: Initial description or overview of the plan

### Expected Output
- Creates a new strategic plan with auto-incremented numbering
- Generates comprehensive plan template with structured sections
- Saves to `.claude/plans/<number>-<sanitized-name>.md`
- Returns plan filename for reference

## Purpose

This command creates new strategic planning documents by utilizing the `cc-self-refer` CLI tool's plan creation functionality.

## Plan Document Example Structure

```markdown
# <Number>. <Original Task Name>

## Overview

[Clear description of what needs to be accomplished and why]
[Business value and user impact]
[Current state vs desired state]

## Goals & Success Criteria

### Main Goals

- [Primary objective with measurable outcome]
- [Secondary objectives if any]

### Success Criteria

- ✅ [Specific success metric 1]
- ✅ [Specific success metric 2]
- ✅ [Specific success metric 3]

## Implementation Approach

### Architecture Approach

[High-level architectural approach and patterns to use]

### Tech Stack & Tools

- **Frontend**: [Relevant technologies]
- **Backend**: [Relevant technologies]
- **Infrastructure**: [Relevant infrastructure]
- **Tools**: [Development and testing tools]

### Key Design Decisions

1. [Key design decision and rationale]
2. [Another design decision and why]
3. [Technical approach justification]

## Implementation Checklist

### Phase 1: Initial Setup & Preparation

- [ ] Environment setup and dependency verification
- [ ] Basic structure design review
- [ ] Required packages/libraries research
- [ ] Initial prototype planning

### Phase 2: Core Feature Implementation

- [ ] [Core feature 1 - brief description]
- [ ] [Core feature 2 - brief description]
- [ ] [Integration point 1]
- [ ] [Data flow implementation]

### Phase 3: Integration & Optimization

- [ ] Component integration testing
- [ ] Performance optimization
- [ ] Edge case handling
- [ ] Enhanced error handling

### Phase 4: Validation & Finalization

- [ ] End-to-end testing
- [ ] User feedback incorporation
- [ ] Documentation updates
- [ ] Deployment preparation

## Key Considerations

### Technical Considerations

- **Performance**: [Performance requirements and strategies]
- **Scalability**: [Scalability considerations]
- **Security**: [Security requirements]
- **Compatibility**: [Compatibility requirements]

### User Experience Considerations

- **Accessibility**: [Accessibility requirements]
- **Responsive**: [Responsive design needs]
- **Usability**: [Usability principles to follow]

### Maintenance Considerations

- **Code Quality**: [Code quality standards]
- **Testing Strategy**: [Testing approach]
- **Documentation**: [Documentation requirements]
- **Monitoring**: [Monitoring and logging strategy]

## Risks & Mitigation

### Main Risks

| Risk     | Impact          | Probability     | Mitigation Strategy   |
| -------- | --------------- | --------------- | --------------------- |
| [Risk 1] | High/Medium/Low | High/Medium/Low | [Mitigation strategy] |
| [Risk 2] | High/Medium/Low | High/Medium/Low | [Mitigation strategy] |

### Dependencies & Constraints

- 🔗 [External dependency and impact]
- ⚠️ [Technical constraint to work around]
- 📋 [Regulatory or compliance requirement]

## Work Breakdown Structure

- **Phase 1**: [X days/hours] - Initial Setup
- **Phase 2**: [X days/hours] - Core Implementation
- **Phase 3**: [X days/hours] - Integration & Optimization
- **Phase 4**: [X days/hours] - Validation & Deployment
- **Buffer**: [X days/hours] - Unexpected issues response

## References

- 📚 [Relevant documentation or project specification]
- 🔗 [External resource or similar implementation]
- 💡 [Best practices or patterns to follow]
- 📖 [Technical articles or guides]

## Next Steps

1. [Immediate next action]
2. [Follow-up action]
3. [Preparation for implementation]

---

**Status**: [Planning/In Progress/Completed]
**Last Updated**: [Date]
```

## Usage Examples

### Creating New Plan

```bash
/plan-create "Dark Mode Implementation" "Feature allowing users to switch between light/dark themes"
```

Claude will:

1. Ask about UI framework and CSS approach
2. Inquire about persistence requirements
3. Clarify scope and components affected
4. Generate comprehensive planning document

## Interactive Question Examples

**Feature Development**:

- "Which UI framework are you using?"
- "How should it integrate with the existing system?"
- "Are there any performance requirements?"
- "Which browsers need to be supported?"

**Bug Fix Planning**:

- "What symptoms are appearing?"
- "Since when has the issue been occurring?"
- "Which components are affected?"
- "Is there a reproducible scenario?"

**API Optimization**:

- "What is the current response time?"
- "What are the target performance metrics?"
- "Is there caching infrastructure?"
- "What are the traffic patterns?"

## Directory Management

- **Creation**: Ensure `.claude/plans/` exists
- **Naming**: Auto-numbered with descriptive names
- **Organization**: Sequential numbering for easy reference

## Error Handling

- **Missing Directory**: Create `.claude/plans/` automatically
- **File Conflicts**: Handle gracefully with user confirmation

## Best Practices

1. **Creating Plans**:
   - Provide detailed initial description
   - Answer Claude's questions thoroughly
   - Review generated plan before finalizing

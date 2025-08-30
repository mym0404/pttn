---
id: best-practices
title: Best Practices
sidebar_label: Best Practices
---

# Best Practices

Maximize the value of cc-self-refer with these proven practices.

## Organization Strategies

### Naming Conventions

- **Specs**: Use domain-specific names ("Authentication", "Payment Gateway")
- **Plans**: Include timeframe ("Q1 2024 Roadmap", "Sprint 15 Goals")
- **Patterns**: Describe the pattern ("Repository Pattern", "Error Boundary")
- **Pages**: Include date and topic ("2024-01-15 Auth Discussion")

### Directory Structure

```bash
# Create subcategories for large projects
mkdir .claude/specs/frontend
mkdir .claude/specs/backend
mkdir .claude/patterns/components
mkdir .claude/patterns/services
```

## Content Guidelines

### Writing Specifications

1. **Start with Why**: Explain the business need
2. **Define Success**: Clear acceptance criteria
3. **Include Examples**: Concrete use cases
4. **Link Related**: Reference other specs

### Creating Plans

1. **Actionable Items**: Each item should be executable
2. **Time Estimates**: Include realistic timelines
3. **Dependencies**: Note blocking factors
4. **Success Metrics**: Define completion criteria

### Saving Patterns

1. **Complete Examples**: Include all necessary code
2. **Usage Instructions**: How to apply the pattern
3. **When to Use**: Describe appropriate scenarios
4. **Variations**: Note alternative approaches

## Workflow Recommendations

### Daily Practices

- **Morning Review**: Check active plans
- **Before Coding**: Reference relevant specs
- **After Solutions**: Save successful patterns
- **End of Day**: Update plan progress

### Weekly Practices

- **Plan Review**: Update and close completed plans
- **Pattern Audit**: Review and refine saved patterns
- **Spec Updates**: Keep specifications current
- **Context Cleanup**: Archive old pages

## Team Collaboration

### Shared Context

```bash
# Commit important context
git add .claude/specs/ .claude/patterns/
git commit -m "Update project specifications"
```

### Personal Context

```bash
# Keep personal notes private
echo ".claude/pages/" >> .gitignore
echo ".claude/plans/personal-*" >> .gitignore
```

## Performance Tips

### Search Optimization

- Use specific keywords
- Search titles first, then content
- Leverage ID numbers for quick access

### File Management

- Archive old content regularly
- Use meaningful descriptions
- Keep files under 10KB when possible

## Anti-Patterns to Avoid

1. **Vague Specifications**: Always be specific
2. **Stale Plans**: Close or update old plans
3. **Duplicate Patterns**: Consolidate similar patterns
4. **No Descriptions**: Always add context

## Integration Tips

### With Git

- Commit specs with related code changes
- Tag releases with specification versions
- Branch strategies aligned with plans

### With CI/CD

- Generate docs from specs
- Validate patterns in tests
- Track plan completion in dashboards

## Maintenance

### Regular Cleanup

```bash
# Archive old pages (30+ days)
cc-self-refer page archive --days 30

# Review unused patterns
cc-self-refer pattern audit
```

### Version Control

- Tag important specification versions
- Branch for experimental patterns
- Document breaking changes

## Success Metrics

- Reduced context switching
- Faster onboarding for new team members
- Consistent implementation patterns
- Better decision documentation
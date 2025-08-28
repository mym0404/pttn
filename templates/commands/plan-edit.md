# Plan Edit - Modify Existing Strategic Plans

Edit and update existing strategic planning documents with targeted modifications.

**Usage**: `/plan-edit <id|keyword> <수정 가이드>`

## Purpose

This command modifies existing strategic plans by utilizing the `cc-self-refer` CLI tool's plan editing functionality.

## Implementation

Execute the `npx -y cc-self-refer plan edit` command:

```bash
npx -y cc-self-refer plan edit <id_or_keyword> "Modification instructions"
```

Examples:

```bash
npx -y cc-self-refer plan edit 3 "Add authentication integration to Phase 2"
npx -y cc-self-refer plan edit "dark mode" "Update performance considerations"
```

This will:

- Find the plan by ID number or keyword search
- Apply modifications to the existing plan
- Update timestamp and add modification history
- Preserve original plan structure

## Usage Examples

### Edit by Plan Number

```bash
/plan-edit 3 "Phase 2에 인증 통합 작업 추가해줘"
```

### Edit by Keyword Search

```bash
/plan-edit darkmode "성능 고려사항에 CSS 변수 최적화 추가"
```

### Major Revision

```bash
/plan-edit authentication "전체 아키텍처를 JWT에서 OAuth2로 변경"
```

## Modification Types

### Adding New Items

- Add tasks to specific phases
- Include new considerations
- Append additional resources
- Insert new milestones

### Updating Existing Content

- Modify technical approaches
- Update timelines and estimates
- Revise success criteria
- Change implementation strategies

### Structural Changes

- Reorganize phases
- Merge or split sections
- Update priority ordering
- Restructure workflow

## Interactive Clarifications

Claude will ask minimal questions focused on:

- Clarifying ambiguous edit instructions
- Confirming major structural changes
- Validating technical approach changes

### Example Questions

- "Phase 2의 어느 부분에 인증 로직을 추가할까요?"
- "성능 최적화는 어떤 측면에서 진행할까요?"
- "기존 아키텍처와 충돌하는 부분이 있는지 확인해드릴까요?"

## Edit Scope Guidelines

### Minor Edits (No Confirmation Needed)

- Adding single tasks or items
- Updating estimates or dates
- Adding references or resources
- Correcting typos or formatting

### Major Edits (Confirmation Required)

- Changing core architecture
- Removing entire phases
- Restructuring the plan
- Modifying success criteria significantly

## Error Handling

- **Plan Not Found**: Show available plans for selection
- **Ambiguous Keywords**: Display multiple matches for clarification
- **Invalid ID**: Suggest correct ID format or keyword search
- **Conflicting Changes**: Highlight conflicts and request resolution

## Best Practices

1. **Be Specific**: Provide clear, actionable modification instructions
2. **Maintain Structure**: Keep consistent formatting and organization
3. **Update Related Sections**: Consider impact on timelines, risks, and dependencies
4. **Review Changes**: Verify modifications align with overall plan objectives

## Common Edit Patterns

### Adding Authentication

```bash
/plan-edit myproject "Phase 2에 JWT 토큰 기반 인증 시스템 추가: 로그인/로그아웃 API, 토큰 검증 미들웨어, 사용자 세션 관리"
```

### Performance Optimization

```bash
/plan-edit performance "성능 고려사항에 다음 추가: 메모이제이션 전략, 지연 로딩 구현, 번들 크기 최적화"
```

### Timeline Adjustment

```bash
/plan-edit timeline "Phase 3 일정을 2주에서 3주로 조정, 통합 테스트 기간 확장"
```

### Risk Update

```bash
/plan-edit risks "새로운 리스크 추가: 서드파티 API 의존성 - 영향도 High, 확률 Medium, 완화방안: 대체 API 준비"
```

## File Management

- **Backup**: Original content is preserved in edit history
- **Versioning**: Timestamps track modification history
- **Consistency**: Maintains original numbering and file structure
- **Validation**: Ensures plan integrity after modifications

# Plan Create - Create New Strategic Planning Document

Create comprehensive strategic planning documents with structured templates.

**Usage**: `/plan-create <작업명> <내용>`

## Purpose

This command creates new strategic planning documents by utilizing the `cc-self-refer` CLI tool's plan creation functionality.

## Implementation

Execute the `npx -y cc-self-refer plan create` command:

```bash
npx -y cc-self-refer plan create "Task Name" "Initial description"
```

This will:

- Create a new strategic plan with auto-incremented numbering
- Generate comprehensive plan template with structured sections
- Save to `.claude/plans/<number>-<sanitized-name>.md`

## Plan Document Example Structure

```markdown
# <Number>. <Original Task Name>

## 개요 (Overview)

[Clear description of what needs to be accomplished and why]
[Business value and user impact]
[Current state vs desired state]

## 목표 및 성공 기준 (Goals & Success Criteria)

### 주요 목표

- [Primary objective with measurable outcome]
- [Secondary objectives if any]

### 성공 기준

- ✅ [Specific success metric 1]
- ✅ [Specific success metric 2]
- ✅ [Specific success metric 3]

## 전체적인 구현 방식 (Implementation Approach)

### 아키텍처 접근법

[High-level architectural approach and patterns to use]

### 기술 스택 및 도구

- **Frontend**: [Relevant technologies]
- **Backend**: [Relevant technologies]
- **Infrastructure**: [Relevant infrastructure]
- **Tools**: [Development and testing tools]

### 핵심 설계 결정사항

1. [Key design decision and rationale]
2. [Another design decision and why]
3. [Technical approach justification]

## 세부 구현 항목 및 체크리스트 (Implementation Checklist)

### Phase 1: 기초 설정 및 준비

- [ ] 환경 설정 및 의존성 확인
- [ ] 기본 구조 설계 검토
- [ ] 필요한 패키지/라이브러리 조사
- [ ] 초기 프로토타입 계획

### Phase 2: 핵심 기능 구현

- [ ] [Core feature 1 - brief description]
- [ ] [Core feature 2 - brief description]
- [ ] [Integration point 1]
- [ ] [Data flow implementation]

### Phase 3: 통합 및 최적화

- [ ] 컴포넌트 통합 테스트
- [ ] 성능 최적화
- [ ] 엣지 케이스 처리
- [ ] 에러 핸들링 강화

### Phase 4: 검증 및 마무리

- [ ] 전체 기능 테스트
- [ ] 사용자 피드백 반영
- [ ] 문서화 업데이트
- [ ] 배포 준비

## 주요 고려사항 (Key Considerations)

### 기술적 고려사항

- **성능**: [Performance requirements and strategies]
- **확장성**: [Scalability considerations]
- **보안**: [Security requirements]
- **호환성**: [Compatibility requirements]

### 사용자 경험 고려사항

- **접근성**: [Accessibility requirements]
- **반응형**: [Responsive design needs]
- **사용성**: [Usability principles to follow]

### 유지보수 고려사항

- **코드 품질**: [Code quality standards]
- **테스트 전략**: [Testing approach]
- **문서화**: [Documentation requirements]
- **모니터링**: [Monitoring and logging strategy]

## 리스크 및 완화 방안 (Risks & Mitigation)

### 주요 리스크

| 리스크   | 영향도          | 확률            | 완화 방안             |
| -------- | --------------- | --------------- | --------------------- |
| [Risk 1] | High/Medium/Low | High/Medium/Low | [Mitigation strategy] |
| [Risk 2] | High/Medium/Low | High/Medium/Low | [Mitigation strategy] |

### 의존성 및 제약사항

- 🔗 [External dependency and impact]
- ⚠️ [Technical constraint to work around]
- 📋 [Regulatory or compliance requirement]

## 작업 분해 구조

- **Phase 1**: [X days/hours] - 기초 설정
- **Phase 2**: [X days/hours] - 핵심 구현
- **Phase 3**: [X days/hours] - 통합 및 최적화
- **Phase 4**: [X days/hours] - 검증 및 배포
- **Buffer**: [X days/hours] - 예상치 못한 이슈 대응

## 참고 자료 및 레퍼런스 (References)

- 📚 [Relevant documentation or specification]
- 🔗 [External resource or similar implementation]
- 💡 [Best practices or patterns to follow]
- 📖 [Technical articles or guides]

## 다음 단계 (Next Steps)

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
/plan-create "다크모드 구현" "사용자가 라이트/다크 테마를 전환할 수 있는 기능"
```

Claude will:

1. Ask about UI framework and CSS approach
2. Inquire about persistence requirements
3. Clarify scope and components affected
4. Generate comprehensive planning document

## Interactive Question Examples

**Feature Development**:

- "어떤 UI 프레임워크를 사용하시나요?"
- "기존 시스템과 어떻게 통합되어야 하나요?"
- "성능 요구사항이 있나요?"
- "어떤 브라우저를 지원해야 하나요?"

**Bug Fix Planning**:

- "어떤 증상이 나타나고 있나요?"
- "언제부터 이슈가 발생했나요?"
- "영향받는 컴포넌트는 무엇인가요?"
- "재현 가능한 시나리오가 있나요?"

**API Optimization**:

- "현재 응답 시간은 어느 정도인가요?"
- "목표 성능 지표는 무엇인가요?"
- "캐싱 인프라가 있나요?"
- "트래픽 패턴은 어떻게 되나요?"

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

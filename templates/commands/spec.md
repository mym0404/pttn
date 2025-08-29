# Spec - Adaptive Interactive Project Planning System

Create comprehensive project specifications through intelligent AI-powered collaborative planning that **automatically adapts** to your project's current state. This advanced system analyzes existing specifications and determines the optimal approach for your specific situation.

**Usage**: `/spec [initial concept or feature name]`

## What does this command do

### ⚠️ IMPORTANT: CLI Command Execution Required

**This command MUST execute multiple `cc-self-refer spec create` CLI commands. After analyzing requirements, create each specification file individually.**

### CLI Commands Used

```bash
# After planning phase, create each specification:
npx -y cc-self-refer spec create "<spec-title-1>" "<spec-content-1>"
npx -y cc-self-refer spec create "<spec-title-2>" "<spec-content-2>"
# ... continue for each planned specification
```

### Command Arguments
- `spec-title`: Title of each individual specification
- `spec-content`: Complete content for each specification file
- Multiple calls needed for comprehensive specification coverage

### Expected Output
- Agent analyzes requirements and plans multiple specifications
- Creates individual specification files using multiple CLI calls
- Each spec file gets auto-incremented ID and saves to `.claude/specs/`
- Returns list of created specification files

## Intelligent Adaptive Planning

### Automatic Context Analysis

The system first analyzes your current project state to determine the best approach:

#### 🆕 **Fresh Start Mode** (No existing specs)
When `.claude/specs/` is empty or minimal:
- **Comprehensive Product Breakdown**: Automatically splits concepts into multiple interconnected specifications
- **Complete Foundation Building**: Creates full specification architecture from scratch
- **Multi-Document Strategy**: Generates 5-10+ specification files covering all aspects

**Example Auto-Generated Structure:**
```
001-product-vision-and-goals.md          # High-level product strategy
002-user-personas-and-journeys.md        # Target users and workflows  
003-core-functional-requirements.md      # Essential features and capabilities
004-technical-architecture-overview.md   # System design foundation
005-api-specifications-and-contracts.md  # API design and data models
006-ui-ux-design-specifications.md       # Interface and interaction design
007-security-and-compliance-requirements.md # Security framework
008-performance-and-scalability-plan.md  # Performance requirements
009-deployment-and-operations-strategy.md # DevOps and infrastructure
010-testing-and-quality-assurance.md     # QA strategy and standards
011-implementation-roadmap.md            # Development phases and milestones
012-risks-and-mitigation-strategies.md   # Risk management
```

#### 🔄 **Evolution Mode** (Existing specs present)
When specification files already exist:
- **Gap Analysis**: Identifies missing specifications and outdated content
- **Relationship Mapping**: Analyzes connections between existing files
- **Strategic Planning**: Determines whether to modify, merge, extend, or replace

**Adaptive Actions:**
- **Modify Existing**: Update and enhance current specifications
- **Merge Related**: Combine redundant or overlapping specifications  
- **Split Complex**: Break down overly complex specifications into focused files
- **Add Missing**: Create new specifications for uncovered areas
- **Deprecate Outdated**: Mark obsolete specifications for removal
- **Cross-Reference**: Establish proper links between related specifications

#### 🎯 **Focused Enhancement Mode** (Specific feature/component)
For targeted improvements:
- **Impact Assessment**: Analyzes how new feature affects existing specifications
- **Minimal Viable Changes**: Makes precise updates without disrupting the broader system
- **Integration Planning**: Ensures new specifications integrate seamlessly

## Advanced Multi-Document Intelligence

### Smart Document Splitting

The system automatically determines optimal document structure:

#### **Complete Product Planning** → Multiple Strategic Documents:
```bash
User: /spec "E-commerce Platform"

AI Analysis: This is a complete product. I'll create comprehensive specifications.

🧠 Thinking: E-commerce requires user management, product catalog, shopping cart, 
payment processing, order management, admin dashboard, and more. Each needs 
detailed specification.

Generated Structure:
├── 001-ecommerce-product-vision.md          # Business vision and objectives
├── 002-user-types-and-personas.md           # Customer/admin/vendor personas  
├── 003-customer-journey-specifications.md   # Shopping and purchase flows
├── 004-product-catalog-requirements.md      # Product management system
├── 005-shopping-cart-and-checkout.md        # Cart functionality and payment flow
├── 006-payment-processing-integration.md    # Payment gateway specifications
├── 007-order-management-system.md           # Order lifecycle and tracking
├── 008-user-account-and-authentication.md   # User management and security
├── 009-admin-dashboard-specifications.md    # Admin interface and capabilities
├── 010-inventory-management-system.md       # Stock management and tracking
├── 011-api-integration-strategy.md          # External service integration approach
├── 012-database-design-and-models.md        # Data structure and relationships
├── 013-security-and-compliance-framework.md # Security and legal requirements
└── 014-deployment-and-scaling-strategy.md   # Infrastructure and performance
```

#### **Feature-Specific Planning** → Targeted Documents:
```bash
User: /spec "User Authentication Screen"

AI Analysis: Specific UI component. I'll develop focused specifications.

🧠 Thinking: Authentication affects security, UX, API integration, and existing 
user flows. Need focused but comprehensive coverage.

Generated Structure:
├── 015-auth-screen-ui-specifications.md     # Visual design and interactions
├── 016-auth-security-requirements.md       # Security protocols and validation
├── 017-auth-api-integration.md              # Backend integration specifications
└── 018-auth-user-experience-flows.md       # User journey and error handling
```

#### **Existing System Enhancement** → Smart Updates:
```bash
User: /spec "Mobile App Support"

AI Analysis: Existing web platform. I'll enhance current specifications.

🧠 Current State Analysis:
- Found 12 existing specifications
- Web-focused architecture present  
- User management already defined
- API specifications need mobile extension

Adaptive Actions:
✏️  Modified: 004-technical-architecture.md (added mobile considerations)
🔗 Merged: Mobile UX requirements into 006-ui-ux-specifications.md
➕ Created: 015-mobile-app-specifications.md (new mobile-specific requirements)
➕ Created: 016-mobile-api-extensions.md (mobile-specific API needs)
🔄 Updated: 008-deployment-strategy.md (mobile deployment pipeline)
```

## Ultra-Deep Analysis Engine

### Multi-Dimensional Project Understanding

#### **1. Codebase Analysis**
```bash
🔍 Analyzing project structure...
- Technology Stack: React + TypeScript + Node.js + PostgreSQL
- Architecture Patterns: Component-based frontend, REST API backend
- Existing Features: User authentication, basic CRUD operations
- Code Quality: TypeScript strict mode, ESLint configured
- Testing Setup: Jest + React Testing Library

💡 Strategic Implications:
- Specifications must align with React component architecture
- API specs should follow existing REST patterns
- Consider TypeScript type definitions in specifications
- Leverage existing authentication for new features
```

#### **2. Existing Specification Analysis**
```bash
📋 Reviewing current specifications...
- Found 8 existing specification files
- Coverage Areas: Authentication (✓), API Design (✓), UI Components (✓)
- Missing Areas: Performance requirements, deployment strategy, security audit
- Outdated Content: API specifications (last updated 3 months ago)
- Inconsistencies: User flow descriptions conflict between files

🎯 Recommended Actions:
- Update API specifications to reflect recent changes
- Create missing performance and deployment specifications  
- Resolve user flow inconsistencies across documents
- Add cross-references between related specifications
```

#### **3. Business Context Integration**
```bash
💼 Understanding business requirements...
- Product Stage: MVP launched, scaling phase
- User Feedback: Performance issues, mobile experience gaps
- Business Goals: 3x user growth, mobile-first approach
- Business Debt: Legacy user onboarding flow, manual operations
- Compliance Needs: GDPR compliance required for EU users

🚀 Strategic Focus:
- Prioritize mobile experience specifications
- Include performance optimization requirements  
- Address business process gaps in specification planning
- Integrate compliance requirements across all specifications
```

## Interactive Specification Development Process

### Phase 1: Intelligent Context Discovery

```bash
🤖 System: I'm analyzing your project to create the optimal specification strategy...

📊 Project Analysis Complete:
- Current State: Early-stage product with basic user management
- Existing Specs: 3 files (user-auth, basic-api, ui-components)  
- Request: "Social Media Integration"
- Complexity: Medium (affects existing auth, requires new APIs, impacts UI)

🎯 Recommended Approach:
I suggest creating 4 interconnected specifications:
1. Social media authentication integration (extends existing auth spec)
2. Social media API specifications (new comprehensive API design)
3. Social sharing UI components (extends existing UI spec)  
4. Social media data privacy and compliance (new security/legal spec)

Should I proceed with this multi-document approach, or would you prefer a different structure?
```

### Phase 2: Adaptive Questioning Strategy

The system asks different types of questions based on your situation:

#### **For Fresh Projects:**
```bash
🔍 Deep Discovery Questions:
- What core problem does your product solve that others don't?
- Who are your primary users and what are their biggest pain points?  
- What's your competitive advantage and how should it influence the architecture?
- What scale are you building for? (users, transactions, data volume)
- What are your non-negotiable constraints? (budget, timeline, compliance)

🏗️  Architecture Questions:
- Should this integrate with existing systems or be standalone?
- What are your preferences for technology stack and why?
- How important is real-time functionality vs. batch processing?
- What are your security and compliance requirements?
```

#### **For Existing Projects:**
```bash
🔄 Evolution-Focused Questions:
- What specific problems with current specifications need solving?
- Which existing features work well and should be preserved/extended?
- What new requirements have emerged since the last specifications?
- Are there any breaking changes you're planning that affect multiple specs?
- Which specifications are most outdated and need priority updates?

📈 Strategic Questions:
- How has user feedback influenced your specification priorities?
- What business process improvements should be addressed in the new specifications?
- Are there any compliance or security gaps in current specifications?
- What new integrations or platforms need specification coverage?
```

### Phase 3: Multi-Agent Collaborative Analysis

#### **Specialized Agent Coordination:**
```bash
🔍 Research Agent: Analyzing competitive landscape and user needs...
   - Studying similar products and their approach to [your concept]
   - Identifying industry best practices and emerging patterns
   - Researching user behavior and expectation benchmarks

🏗️  Architecture Agent: Evaluating technical feasibility and design...
   - Reviewing current codebase patterns and constraints
   - Analyzing scalability implications and technical requirements
   - Recommending architecture patterns and technology choices

👤 UX Strategy Agent: Designing user experience framework...
   - Mapping user journeys and interaction patterns  
   - Identifying accessibility and usability requirements
   - Defining interface specifications and design system needs

💼 Business Agent: Optimizing business value and processes...
   - Analyzing business logic and workflow requirements
   - Identifying revenue impact and operational considerations
   - Defining success metrics and business rule specifications

🔒 Security Agent: Ensuring comprehensive security coverage...
   - Analyzing security threats and vulnerability patterns
   - Defining authentication, authorization, and data protection specs
   - Ensuring compliance with relevant regulations and standards

⚡ Performance Agent: Optimizing system performance...
   - Analyzing performance requirements and bottlenecks  
   - Defining scalability specifications and optimization strategies
   - Identifying monitoring and alerting requirements
```

## Advanced Specification Management

### Smart File Operations

#### **Intelligent Merging:**
```bash
🔗 Merge Analysis:
Files: 003-user-authentication.md + 008-social-auth.md
Overlap: 67% content similarity detected
Conflicts: Different password policies specified
Recommendation: Merge into comprehensive authentication specification

Action: Create unified 003-authentication-comprehensive.md
- Combine common authentication flows
- Resolve policy conflicts through stakeholder preferences  
- Add social authentication as additional flow option
- Archive original files with deprecation notice
```

#### **Smart Splitting:**
```bash
📄 Split Analysis:
File: 004-api-specifications.md (47 pages, too complex)
Identified Domains: User management, Product catalog, Order processing, Payment
Recommendation: Split into focused API specifications

Actions:
- Create 004-user-management-api.md (user-related endpoints)
- Create 005-product-catalog-api.md (product and inventory endpoints)  
- Create 006-order-processing-api.md (order lifecycle endpoints)
- Create 007-payment-integration-api.md (payment gateway endpoints)
- Update cross-references between all files
- Archive original comprehensive file
```

#### **Dependency Management:**
```bash
🔗 Cross-Reference Analysis:
- 001-product-vision.md references → 003-functional-requirements.md  
- 004-business-architecture.md depends on → 005-feature-specifications.md
- 006-ui-ux-specifications.md relates to → 008-user-journey-flows.md

🎯 Automatic Link Updates:
When updating any specification, system automatically:
- Updates related cross-references  
- Validates dependency consistency
- Suggests updates to dependent specifications
- Maintains bidirectional link integrity
```

## Quality Assurance and Validation

### Multi-Pass Validation System

#### **1. Completeness Verification:**
```bash
✅ Coverage Analysis:
- User Stories: All have acceptance criteria ✓
- API Endpoints: Complete request/response/error specs ✓  
- UI Components: Interaction and state specifications ✓
- Business Rules: Validation logic defined ✓
- Security Requirements: Threat model and controls ✓

⚠️  Gap Detection:
- Missing: Performance benchmarks for search functionality
- Missing: Error handling specifications for payment failures  
- Missing: Accessibility requirements for mobile interface
- Action: Generate additional specifications for identified gaps
```

#### **2. Consistency Validation:**
```bash
🔍 Cross-Specification Analysis:
- Data Models: User schema consistent across all specifications ✓
- API Contracts: Request/response formats align with UI needs ✓
- Business Logic: Payment rules consistent between UI and API specs ✓

❌ Inconsistency Detection:
- Conflict: User role definitions differ between auth and UI specs
- Conflict: API versioning strategy inconsistent across endpoints
- Action: Generate reconciliation recommendations and update specifications
```

#### **3. Implementation Readiness:**
```bash
🚀 Development-Ready Assessment:
- Business Detail Level: Sufficient for implementation planning ✓
- Architecture Clarity: Clear technical approach defined ✓  
- Integration Points: All external dependencies specified ✓
- Success Criteria: Measurable acceptance criteria defined ✓

📋 Development Handoff Package:
- All specifications cross-linked and consistent
- Project requirements mapped to business objectives
- Implementation priorities and dependencies clear
- Quality gates and testing strategies defined
```

## Usage Examples

### Fresh Product Specification
```bash
User: /spec "AI-Powered Task Management Platform"

Claude: 🚀 Starting comprehensive specification planning for your AI-Powered Task Management Platform.

🔍 Project Analysis:
- Codebase: Clean slate, no existing specifications
- Complexity: High (AI integration, multi-user, real-time features)
- Strategy: Complete product specification suite

🧠 AI Planning:
I'll create 12 interconnected specifications covering:
1. Product vision and AI differentiation strategy
2. User personas (individuals, teams, enterprise)
3. AI feature specifications (smart scheduling, task prioritization, insights)
4. Core task management functionality
5. Real-time collaboration features
6. AI model integration architecture
7. Data privacy and AI ethics framework
8. Performance requirements for AI processing
9. Mobile and web UI specifications
10. API design for third-party integrations
11. Deployment and scaling strategy
12. Security framework for AI and user data

Let's start with understanding your vision:
- What specific AI capabilities will differentiate your platform?
- Who are your primary users and what AI-powered workflows do they need?
- What's your approach to AI model integration? (cloud APIs vs. custom models)
```

### Existing System Enhancement
```bash
User: /spec "Real-time Chat Feature"

Claude: 🔄 Analyzing existing project for real-time chat integration...

📊 Current State Analysis:
- Found 8 existing specifications in .claude/specs/
- Current: User management ✓, REST APIs ✓, React frontend ✓
- Architecture: Traditional request/response, no WebSocket support
- Gap: Real-time communication capabilities missing

🎯 Integration Strategy:
I'll create 3 new specifications and update 2 existing ones:

New Specifications:
- 009-real-time-chat-system.md (core chat functionality)
- 010-websocket-architecture.md (real-time communication layer)  
- 011-chat-ui-components.md (chat interface specifications)

Existing Updates:
- 004-api-specifications.md (add chat API endpoints)
- 005-security-framework.md (add real-time security considerations)

Key Questions:
- Should chat be 1-on-1, group-based, or both?
- Do you need message persistence and history?
- What's your approach to real-time scaling? (Redis, separate service?)
- Any compliance requirements for chat data? (encryption, retention)
```

## Benefits and Outcomes

### **Adaptive Intelligence:**
- **Context-Aware**: Automatically adjusts approach based on project maturity
- **Relationship-Smart**: Understands connections between existing specifications
- **Gap-Detecting**: Identifies missing coverage areas automatically
- **Consistency-Ensuring**: Maintains coherence across all specification files

### **Professional Output:**
- **Implementation-Ready**: Specifications detailed enough for immediate development
- **Cross-Referenced**: Proper links and dependencies between related specifications
- **Version-Controlled**: Clear history and evolution tracking
- **Team-Friendly**: Structured for collaborative review and updates

### **Strategic Value:**
- **Business-Aligned**: Specifications tied to clear business objectives
- **Risk-Mitigated**: Potential issues identified and addressed proactively
- **Future-Proofed**: Specifications designed for evolution and scaling
- **Compliance-Ready**: Security and regulatory requirements integrated throughout

This adaptive specification system transforms planning from a static documentation task into a dynamic, intelligent collaboration that evolves with your project and ensures comprehensive, professional-grade specifications tailored to your specific situation.
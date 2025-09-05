# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

한화생명 사내 AI 어시스턴트 - AI 기반 통합 업무 지원 플랫폼

This is a web-based AI assistant platform for Hanwha Life Insurance employees, providing:
- **Integrated Information Search**: Unified access to company resources and data
- **Intelligent Report Generation**: Automated document creation with company templates
- **Smart Schedule Management**: Meeting coordination and room reservation system
- **Conversational Interface**: Natural language processing for daily work queries

## Development Commands

### Running the Application
```bash
# Open the application directly in browser (simplest method)
open index.html

# Use local web server for better development experience
python3 -m http.server 8000
# Then navigate to http://localhost:8000

# Alternative: Use any static file server
npx http-server -p 8000  # If Node.js is available
```

### Testing Mobile Responsiveness
```bash
# Open Chrome DevTools → Toggle device toolbar (Cmd+Shift+M on Mac)
# Test breakpoints: Mobile (<768px), Tablet (768-1024px), Desktop (>1024px)
```

## Code Architecture

### Core Application Flow
The application follows a state-driven pattern:
1. **Initial State**: Welcome screen with central input (`index.html` + `hanwha-app.js`)
2. **Chat Initiation**: User input triggers `initiateChatMode()` → UI transformation
3. **Message Flow**: `sendMessage()` → `addUserMessage()` → `addAIResponse()`
4. **Meeting Detection**: `handleMeetingRequest()` analyzes input for meeting-related keywords
5. **State Persistence**: Chat history, user sessions, and calendar events stored in localStorage

### Key JavaScript Modules
- **`hanwha-app.js`**: Main application controller, chat interface, user management
- **`chat-manager.js`**: Chat history persistence and multi-user session management
- **`meeting-modal.js`**: New Figma-based meeting reservation modal component
- **`meeting-reservation.js`**: Legacy meeting reservation logic and workflow
- **`calendar.js`**: Calendar component for schedule management
- **`storage-manager.js`**: Centralized localStorage management
- **`contact-detail-manager.js`**: Contact detail panel for staff information

### Key Technical Decisions
- **No Framework**: Pure vanilla JavaScript for minimal dependencies and fast loading
- **CSS Custom Properties**: Dynamic theming without JavaScript manipulation
- **Mobile-First**: Base styles for mobile, progressive enhancement for larger screens
- **DOM Caching**: Elements cached on load to avoid repeated queries
- **Dual Meeting Systems**: New modal (`meetingModal`) with fallback to legacy system

### State Management Pattern
```javascript
// Global state (hanwha-app.js)
let chatStarted = false;     // Controls UI mode
let messages = [];           // Chat history
let currentUser = null;      // Active user object
let usersData = [];         // All available users
let currentChatId = null;    // Active chat session ID
```

### Data Layer Architecture
Three parallel data management systems:
1. **Session State** (`hanwha-app.js`): Runtime chat and UI state
2. **Persistent Storage** (`storage-manager.js`): Centralized localStorage API
3. **Chat History** (`chat-manager.js`): Multi-user chat session persistence

## AI Assistant Response Guidelines

### 담당자 카드 표시 원칙
모든 AI 응답에는 관련 담당자 정보를 카드 형식으로 표시해야 합니다:
- **담당자 카드 구성**: 이름, 직책, 부서, 연락처, 프로필 이미지
- **표시 위치**: AI 응답 메시지 하단 또는 관련 정보 카드 내부
- **스타일**: 간결하고 명확한 카드 UI로 구현
- **무한도전 멤버 사용 필수**: 모든 담당자 예시는 무한도전 멤버(김동준, 이정은, 유재석, 박명수, 정준하, 정형돈, 노홍철)로 작업
- **용도별 담당자**:
  - 휴가/근태: 정준하 (HR팀 담당자)
  - 회의실 예약: 정형돈 (시설관리팀)  
  - IT 지원: 김동준 (IT서비스팀)
  - 프로젝트: 박명수 (프로젝트 매니저)
  - 디지털마케팅: 유재석, 노홍철
  - UX/디자인: 이정은

### 담당자 상세정보 패널
담당자 이름 클릭 시 오른쪽 캔버스 영역에 표시되는 기능:
- **상세 정보**: 담당 업무, 전문 기술, 현재 프로젝트, 업무 스타일
- **조직도**: 상급자, 팀원, 부하직원 관계 표시
- **문의하기**: 해당 담당자와 직접 채팅 시작 기능
- **네비게이션**: 조직도 내 다른 담당자 클릭으로 이동 가능

### Response Patterns
- **휴가 조회**: 남은 휴가 일수, 사용 내역, 예정된 휴가를 카드 형식으로 표시 + HR팀 담당자 카드
- **회의 예약**: 회의실 옵션과 시설 담당자 정보 함께 표시
- **프로젝트 상태**: 프로젝트 카드와 PM 정보 포함
- **일반 질문**: 기본 응답과 함께 IT서비스팀 담당자 카드 표시

### Vacation Feature
The application now supports vacation inquiry functionality:
- **Vacation Data**: Stored in `data/sample-vacation.js` with annual leave, sick leave, congratulations leave, and family care leave
- **Detection Keywords**: '휴가', '연차', '병가', '경조사', '가족돌봄', '남은 휴가', '휴가 내역'
- **Display Format**: Purple gradient vacation card showing:
  - Total remaining days prominently displayed
  - Breakdown by leave type (annual, sick, congratulations, family care)
  - Recent vacation history (last 3 approved entries)
  - Always includes HR responsible person card below

## Important Integrations

### Figma Design Integration
When implementing UI changes, reference these Figma designs using MCP:
- **Main Interface**: https://www.figma.com/design/ekVkR9adztkXLOtHIGSPvy/AI-%EB%B9%84%EC%84%9C-MCP?node-id=4-1993
- **Additional Screens**: https://www.figma.com/design/ekVkR9adztkXLOtHIGSPvy/AI-%EB%B9%84%EC%84%9C-MCP?node-id=4-2061

#### Figma Asset Management Rules
- Figma Dev Mode MCP 서버는 이미지 및 SVG 에셋을 제공할 수 있는 끝점을 제공합니다
- **중요**: Figma에서 제공하는 localhost 소스는 먼저 로컬 파일로 다운로드하여 `assets/icons/` 디렉토리에 저장 후 상대경로로 참조
- **중요**: 새로운 아이콘 패키지를 가져오거나 추가하지 마세요. 모든 에셋은 Figma 페이로드에 있어야 합니다
- **중요**: 피그마 디자인으로 작업된 내용을 절대 변경하지 마세요
- **중요**: 피그마 디자인을 가져올때 변환하지 말고 디자인 요소 그대로를 가져오세요

### Asset Directory Structure
```
assets/
├── icons/          # SVG icons downloaded from Figma
│   ├── document-pen.svg
│   ├── document-pen-full.svg
│   ├── menu-food.svg
│   ├── meeting.svg
│   └── hanwha-logo.svg
└── avatar-placeholder.png  # User avatar placeholder
```

### Design System Variables
The design system (`hanwha-design-system.css`) uses CSS custom properties:
- **Colors**: Brand orange `#FA6600`, secondary `#403f3e`
- **Typography**: Font stack includes `HanwhaGothic` (custom) → `Pretendard` → `Noto Sans KR`
- **Spacing Scale**: xs(4px) → sm(8px) → md(12px) → lg(16px) → xl(24px) → 2xl(32px) → 3xl(48px)

## Critical Implementation Notes

### Meeting Request Handling
The system detects meeting-related requests through keyword analysis:
- **Reservation Keywords**: '회의실', '회의 잡', '미팅 잡', '예약', '회의 예약'
- **Query Keywords**: '회의 알려', '회의가 있', '미팅 알려', '일정 알려', '스케줄'
- **Response Types**:
  - `type: 'reservation'` → Opens meeting modal or legacy UI
  - `type: 'query'` → Returns calendar data with meeting details

### Mobile Navigation Pattern
The mobile sidebar uses a three-part system:
1. **Toggle Button** (`.mobile-menu-toggle`): Triggers `toggleMobileSidebar()`
2. **Overlay** (`.mobile-sidebar-overlay`): Click-to-close backdrop
3. **Sidebar Transform**: CSS transforms for slide-in animation

### Message Rendering
Messages are rendered with distinct styling:
- **User Messages**: Orange gradient background, right-aligned
- **AI Messages**: White background with border, left-aligned
- HTML is escaped using `escapeHtml()` function for security

### User Session Management
- Multiple users supported via dropdown selector
- Current user stored in localStorage with key `currentUserId`
- User switching preserves individual chat histories
- Each user has separate chat sessions and preferences

## Production Considerations

### Current Limitations (Frontend-Only Prototype)
- AI responses are simulated with setTimeout delays
- No actual backend API integration
- Data stored in browser localStorage only
- No user authentication

### Required for Production
1. **Backend API**: Real AI integration endpoint
2. **Authentication**: Employee SSO integration
3. **Data Security**: Encryption for sensitive employee data
4. **Performance**: CDN for assets, code splitting for scalability
5. **Error Handling**: Comprehensive error boundaries and fallbacks

## Path and Link Guidelines

- **Always use relative paths** for all assets and links (e.g., `assets/icons/logo.svg`)
- **Never use absolute URLs** like `http://localhost` or `https://localhost`
- When downloading Figma assets via localhost URLs, save them locally first then reference with relative paths

## Key Data Structures

### Sample Users (from `sample-users.js`)
Users have the following structure:
```javascript
{
  id: 'user-001',
  name: '김동준',
  position: '과장',
  department: '디지털프로덕트팀',
  email: 'dongjun.kim@hanwhalife.com'
}
```

### Calendar Events (stored in localStorage)
```javascript
{
  id: 'evt-001',
  date: '2024-01-01',        // ISO date format
  startTime: '10:00',
  endTime: '11:00',
  title: '주간 팀 회의',
  type: 'meeting',           // or 'personal', 'task'
  location: '회의실 A',
  attendees: ['김동준', '이서연'],
  description: '주간 업무 보고'
}
```

### Chat Messages
```javascript
{
  type: 'user' | 'ai',
  text: 'Message content',
  timestamp: Date.now()
}
```

## Contact Detail Panel System

### Architecture
The contact detail panel (`contact-detail-manager.js`) provides a slide-in panel from the right side displaying detailed staff information when clicking on staff member names or cards.

### Key Components
- **ContactDetailManager Class**: Manages panel lifecycle and data population
- **Panel Creation**: Dynamically creates HTML panel structure on initialization
- **Data Integration**: Pulls from `SAMPLE_USERS_DATA`, `ORGANIZATION_DATA`, and `VacationManager`
- **Event Handling**: Click outside to close, ESC key support, staff card integration

### Usage Patterns
- Click staff member name → `handleResponsibleNameClick()` → `ContactDetailManager.showContactDetail()`
- Click "문의하기" button → `handleResponsibleCardClick()` → `startChatWithPerson()`
- Panel displays: Basic info, contact details, responsibilities, skills, projects, work style, org chart

### Debugging Notes
If the contact detail panel doesn't appear:
1. Check console for `ContactDetailManager` initialization
2. Verify CSS classes: `.contact-detail-panel` and `.contact-detail-panel.active`
3. Ensure z-index is high enough (currently set to 9999)
4. Check event handlers are not immediately closing the panel after opening

# important-instruction-reminders
Do what has been asked; nothing more, nothing less.
NEVER create files unless they're absolutely necessary for achieving your goal.
ALWAYS prefer editing an existing file to creating a new one.
NEVER proactively create documentation files (*.md) or README files. Only create documentation files if explicitly requested by the User.

      
      IMPORTANT: this context may or may not be relevant to your tasks. You should not respond to this context unless it is highly relevant to your task.
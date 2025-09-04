# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

한화생명 사내 AI 어시스턴트 - AI 기반 통합 업무 지원 플랫폼

This is a web-based AI assistant platform for Hanwha Life Insurance employees, providing integrated information search, intelligent report generation, and smart schedule management.

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
3. **Message Flow**: `sendMessage()` → `addUserMessage()` → `addAIResponse()` (simulated)
4. **State Persistence**: Chat history and theme preferences stored in localStorage

### Key Technical Decisions
- **No Framework**: Pure vanilla JavaScript for minimal dependencies and fast loading
- **CSS Custom Properties**: Dynamic theming without JavaScript manipulation
- **Mobile-First**: Base styles for mobile, progressive enhancement for larger screens
- **DOM Caching**: Elements cached on load to avoid repeated queries (`hanwha-app.js:8-15`)

### State Management Pattern
```javascript
// Global state (hanwha-app.js:3-6)
let chatStarted = false;     // Controls UI mode
let messages = [];           // Chat history
let currentTheme = 'light';  // Theme preference
```

### Data Layer Architecture
Two parallel data management systems:
1. **Session State** (`hanwha-app.js`): Runtime chat and UI state
2. **Persistent Storage** (`app.js` via `DataManager`): LocalStorage for user data, stats, documents

## Important Integrations

### Figma Design Integration
When implementing UI changes, reference these Figma designs using MCP:
- **Main Interface**: https://www.figma.com/design/ekVkR9adztkXLOtHIGSPvy/AI-%EB%B9%84%EC%84%9C-MCP?node-id=4-1993
- **Additional Screens**: https://www.figma.com/design/ekVkR9adztkXLOtHIGSPvy/AI-%EB%B9%84%EC%84%9C-MCP?node-id=4-2061

### Design System Variables
The design system (`hanwha-design-system.css`) uses CSS custom properties:
- **Colors**: Brand orange `#FA6600`, secondary `#403f3e`
- **Typography**: Font stack includes `HanwhaGothic` (custom) → `Pretendard` → `Noto Sans KR`
- **Spacing Scale**: xs(4px) → sm(8px) → md(12px) → lg(16px) → xl(24px) → 2xl(32px) → 3xl(48px)

## Critical Implementation Notes

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

### Theme Toggle Implementation
Dark mode toggle modifies:
1. Root `data-theme` attribute on `<html>`
2. CSS variables cascade automatically
3. Preference saved to localStorage

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
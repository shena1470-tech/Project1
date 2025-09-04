# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

한화생명 사내 AI 어시스턴트 - AI 기반 통합 업무 지원 플랫폼

This is a web-based AI assistant platform for Hanwha Life Insurance employees, focusing on integrated information search, intelligent report generation, and smart schedule management.

## Development Commands

### Running the Application
```bash
# Open the application locally
open index.html
# Or use a local web server (if Python is installed)
python3 -m http.server 8000
# Then navigate to http://localhost:8000
```

### File Serving
For production deployment, serve these files using a standard web server (Apache, Nginx, etc.) or deploy to a CDN/static hosting service.

## Code Architecture

### File Structure
```
projectH/
├── index.html           # Main application entry point
├── css/
│   ├── hanwha-design-system.css  # Primary design system styles
│   └── styles.css      # Legacy styles (may be deprecated)
├── js/
│   ├── hanwha-app.js   # Main application logic
│   └── app.js          # Legacy application code
├── data/
│   └── sampleData.json # Sample data for templates and users
└── assets/             # Images and icons
```

### Key Components

#### Frontend Architecture
- **Single Page Application**: Pure vanilla JavaScript with DOM manipulation
- **State Management**: Global variables in `hanwha-app.js` managing `chatStarted`, `messages`, and `currentTheme`
- **UI Components**:
  - Sidebar navigation with user profile and chat management
  - Main chat interface with welcome screen and message area
  - Quick action buttons for common tasks
  - Dark mode toggle functionality
  - Mobile responsive design with hamburger menu

#### Styling System
- **Design System**: `hanwha-design-system.css` implements Hanwha's brand identity
- **Theme Support**: Light/dark mode toggle with CSS custom properties
- **Responsive Design**: Mobile-first approach with breakpoints for tablets and desktop

### Core Functionality

1. **Chat Interface** (`hanwha-app.js`):
   - `startNewChat()`: Initializes new conversation
   - `sendMessage()`: Handles message sending and UI updates
   - `addMessage()`: Renders messages in chat area
   - `handleAIResponse()`: Simulates AI responses

2. **Quick Actions**:
   - Report creation (`createReport()`)
   - Meeting scheduler (`scheduleMeeting()`)
   - Menu viewer (`showMenu()`)

3. **Theme Management**:
   - `toggleTheme()`: Switches between light and dark modes
   - Persists theme preference in localStorage

4. **Mobile Support**:
   - `toggleMobileSidebar()`: Handles mobile navigation
   - Responsive layout adjustments

## Important Integrations

### Figma Design Resources
The UI/UX designs are maintained in Figma. Use the MCP Figma integration to access:
1. Main UI Components: https://www.figma.com/design/ekVkR9adztkXLOtHIGSPvy/AI-%EB%B9%84%EC%84%9C-MCP?node-id=4-1993
2. Additional Screens: https://www.figma.com/design/ekVkR9adztkXLOtHIGSPvy/AI-%EB%B9%84%EC%84%9C-MCP?node-id=4-2061

### Data Structure
Sample data in `data/sampleData.json` includes:
- User profiles with preferences
- Document templates (회의록, 보고서)
- Quick responses and suggestions
- Menu information

## Development Guidelines

### Adding New Features
1. Follow the existing vanilla JavaScript patterns in `hanwha-app.js`
2. Maintain the single-page application structure
3. Use the established CSS class naming conventions from `hanwha-design-system.css`
4. Ensure mobile responsiveness for all new components

### Styling Guidelines
- Use CSS custom properties for theme-aware styling
- Follow BEM-like naming convention for CSS classes
- Maintain consistent spacing using the existing CSS variables
- Test both light and dark modes

### State Management
- Keep global state minimal in the main JavaScript file
- Use DOM data attributes for component-specific state when needed
- Handle async operations with appropriate loading states

### Security Considerations
- This is currently a frontend-only prototype
- Production implementation will require:
  - Backend API integration for actual AI responses
  - Proper authentication and authorization
  - Secure handling of employee data
  - API rate limiting and error handling

## Future Enhancements

Based on the project roadmap, future development should focus on:
1. Backend API integration for real AI responses
2. User authentication system
3. Real-time data synchronization
4. Advanced reporting features with data visualization
5. Integration with existing Hanwha Life systems

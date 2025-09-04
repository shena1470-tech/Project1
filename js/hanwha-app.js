// 한화생명 AI 비서 애플리케이션

// 상태 관리
let chatStarted = false;
let messages = [];
let currentTheme = 'light';
let currentUser = null;
let usersData = [];

// DOM 요소 캐싱
const welcomeScreen = document.getElementById('welcomeScreen');
const chatMessages = document.getElementById('chatMessages');
const bottomInput = document.getElementById('bottomInput');
const mainInput = document.getElementById('mainInput');
const bottomInputField = document.getElementById('bottomInputField');
const chatArea = document.getElementById('chatArea');

// 초기화 함수
window.addEventListener('DOMContentLoaded', async () => {
    await loadUsers();
    loadCurrentUser();
    updateUserDisplay();
});

// 유저 데이터 로드
async function loadUsers() {
    try {
        const response = await fetch('data/users.json');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        usersData = data.users;
        console.log('유저 데이터 로드 성공:', usersData.length + '명의 사용자');
    } catch (error) {
        console.error('유저 데이터 로드 실패:', error);
        console.error('에러 상세:', error.message);
        // 폴백 데이터 - 더미 사용자 여러명 추가
        usersData = [
            {
                id: 'user-001',
                name: '김동준',
                position: '과장',
                department: '디지털프로덕트팀',
                email: 'dongjun.kim@hanwhalife.com'
            },
            {
                id: 'user-002',
                name: '이서연',
                position: '대리',
                department: '마케팅본부',
                email: 'seoyeon.lee@hanwhalife.com'
            },
            {
                id: 'user-003',
                name: '박준혁',
                position: '차장',
                department: '재무관리팀',
                email: 'junhyuk.park@hanwhalife.com'
            }
        ];
    }
}

// 현재 유저 로드 (localStorage에서)
function loadCurrentUser() {
    const savedUserId = localStorage.getItem('currentUserId');
    if (savedUserId && usersData.length > 0) {
        currentUser = usersData.find(user => user.id === savedUserId) || usersData[0];
    } else if (usersData.length > 0) {
        currentUser = usersData[0];
    }
    
    if (currentUser) {
        localStorage.setItem('currentUserId', currentUser.id);
    }
}

// 유저 정보 표시 업데이트
function updateUserDisplay() {
    if (!currentUser) return;
    
    // 사이드바 유저 이름 업데이트
    const userNameElement = document.querySelector('.user-name');
    if (userNameElement) {
        userNameElement.innerHTML = `
            ${currentUser.name}
            <svg class="arrow-down" viewBox="0 0 20 20" fill="none">
                <path d="M5 7.5L10 12.5L15 7.5" stroke="#333333" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
        `;
        userNameElement.onclick = toggleUserDropdown;
    }
    
    // 웰컴 메시지 업데이트
    const welcomeTitle = document.querySelector('.welcome-title');
    if (welcomeTitle) {
        welcomeTitle.textContent = `안녕하세요. ${currentUser.name} ${currentUser.position}님!`;
    }
}

// 유저 드롭다운 토글
function toggleUserDropdown() {
    let dropdown = document.getElementById('userDropdown');
    
    if (dropdown) {
        dropdown.remove();
        return;
    }
    
    dropdown = createUserDropdown();
    document.querySelector('.sidebar-header').appendChild(dropdown);
}

// 유저 드롭다운 생성
function createUserDropdown() {
    console.log('Creating dropdown with users:', usersData);
    console.log('Current user:', currentUser);
    
    const dropdown = document.createElement('div');
    dropdown.id = 'userDropdown';
    dropdown.className = 'user-dropdown';
    dropdown.innerHTML = `
        <div class="dropdown-header">
            <span>계정 전환</span>
            <button onclick="closeUserDropdown()" class="close-btn">×</button>
        </div>
        <div class="dropdown-content">
            ${usersData && usersData.length > 0 ? usersData.map(user => `
                <div class="user-item ${user.id === currentUser.id ? 'active' : ''}" 
                     onclick="selectUser('${user.id}')">
                    <div class="user-avatar">${user.name ? user.name[0] : '?'}</div>
                    <div class="user-info">
                        <div class="user-name">${user.name || 'Unknown'}</div>
                        <div class="user-role">${user.position || ''} ${user.department ? '• ' + user.department : ''}</div>
                    </div>
                    ${user.id === currentUser.id ? '<span class="check-icon">✓</span>' : ''}
                </div>
            `).join('') : '<div class="user-item">사용자 데이터를 불러오는 중...</div>'}
        </div>
    `;
    
    return dropdown;
}

// 유저 선택
function selectUser(userId) {
    const user = usersData.find(u => u.id === userId);
    if (user) {
        currentUser = user;
        localStorage.setItem('currentUserId', userId);
        updateUserDisplay();
        closeUserDropdown();
        
        // 새로운 유저로 전환 시 채팅 초기화
        startNewChat();
    }
}

// 드롭다운 닫기
function closeUserDropdown() {
    const dropdown = document.getElementById('userDropdown');
    if (dropdown) {
        dropdown.remove();
    }
}

// 새 대화 시작
function startNewChat() {
    // 메시지 초기화
    messages = [];
    chatStarted = false;
    
    // UI 초기화
    if (welcomeScreen) {
        welcomeScreen.style.display = 'block';
    }
    if (chatMessages) {
        chatMessages.style.display = 'none';
        chatMessages.innerHTML = '';
    }
    if (bottomInput) {
        bottomInput.style.display = 'none';
    }
    
    // 입력 필드 초기화
    if (mainInput) mainInput.value = '';
    if (bottomInputField) bottomInputField.value = '';
    
    // 채팅 영역 스타일 초기화
    chatArea.style.justifyContent = 'center';
    chatArea.style.alignItems = 'center';
}

// 메시지 전송
function sendMessage() {
    const input = chatStarted ? bottomInputField : mainInput;
    const message = input.value.trim();
    
    if (!message) return;
    
    // 첫 메시지인 경우 채팅 화면으로 전환
    if (!chatStarted) {
        initiateChatMode();
    }
    
    // 사용자 메시지 추가
    addUserMessage(message);
    
    // 입력 필드 초기화
    input.value = '';
    
    // AI 응답 시뮬레이션
    setTimeout(() => {
        addAIResponse(message);
    }, 1000);
}

// 채팅 모드 초기화
function initiateChatMode() {
    chatStarted = true;
    
    // 웰컴 화면 숨김
    welcomeScreen.style.display = 'none';
    
    // 채팅 메시지 영역 표시
    chatMessages.style.display = 'flex';
    
    // 하단 입력 영역 표시
    bottomInput.style.display = 'flex';
    
    // 채팅 영역 스타일 변경
    chatArea.style.justifyContent = 'flex-start';
    chatArea.style.alignItems = 'stretch';
    chatArea.style.padding = '0';
    chatArea.style.paddingBottom = '104px'; // 하단 입력창 높이만큼 패딩
}

// 사용자 메시지 추가
function addUserMessage(text) {
    const messageHtml = `
        <div class="message-container user-message" style="justify-content: flex-end;">
            <div class="message-bubble" style="background: linear-gradient(135deg, #fa6600, #ff8833); color: white; padding: 12px 20px; border-radius: 18px; max-width: 70%;">
                <p class="message-text" style="color: white; font-size: 16px;">${escapeHtml(text)}</p>
            </div>
        </div>
    `;
    
    chatMessages.insertAdjacentHTML('beforeend', messageHtml);
    scrollToBottom();
    
    messages.push({ type: 'user', text: text });
}

// AI 응답 추가
function addAIResponse(userMessage) {
    // AI 응답 로직
    let response = generateAIResponse(userMessage);
    
    const messageHtml = `
        <div class="message-container">
            <div class="ai-avatar"></div>
            <div class="message-bubble">
                <p class="message-text">${response}</p>
            </div>
        </div>
    `;
    
    chatMessages.insertAdjacentHTML('beforeend', messageHtml);
    scrollToBottom();
    
    messages.push({ type: 'ai', text: response });
}

// AI 응답 생성 (시뮬레이션)
function generateAIResponse(userMessage) {
    const lowerMessage = userMessage.toLowerCase();
    
    // 간단한 응답 매핑
    if (lowerMessage.includes('회의') || lowerMessage.includes('미팅')) {
        return '회의 정보를 알려주시면 예약하겠습니다. 과장님!';
    } else if (lowerMessage.includes('보고서') || lowerMessage.includes('문서')) {
        return '어떤 보고서를 작성하시겠습니까? 템플릿을 제공해드리거나 처음부터 작성을 도와드릴 수 있습니다.';
    } else if (lowerMessage.includes('식당') || lowerMessage.includes('메뉴')) {
        return '오늘의 구내식당 메뉴입니다:\n\n한식: 김치찌개, 제육볶음, 계란찜\n양식: 까르보나라, 샐러드, 수프\n\n맛있는 식사 되세요!';
    } else if (lowerMessage.includes('안녕')) {
        return '안녕하세요 과장님! 오늘 하루도 좋은 하루 되세요. 무엇을 도와드릴까요?';
    } else if (lowerMessage.includes('일정')) {
        return '오늘 일정을 확인해드리겠습니다. 오후 2시에 마케팅팀과 회의가 있으시고, 4시에 보고서 제출 마감입니다.';
    } else {
        return '네, 알겠습니다. 해당 업무를 도와드리겠습니다. 추가로 필요한 정보가 있으면 말씀해 주세요.';
    }
}

// 엔터키 처리
function handleEnter(event) {
    if (event.key === 'Enter' && !event.shiftKey) {
        event.preventDefault();
        sendMessage();
    }
}

// 스크롤 하단 이동
function scrollToBottom() {
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

// HTML 이스케이프
function escapeHtml(text) {
    const map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
    };
    return text.replace(/[&<>"']/g, m => map[m]);
}

// 빠른 작업 함수들
function createReport() {
    if (!chatStarted) {
        initiateChatMode();
    }
    const input = chatStarted ? bottomInputField : mainInput;
    input.value = '보고서 작성을 도와주세요.';
    sendMessage();
}

function showMenu() {
    if (!chatStarted) {
        initiateChatMode();
    }
    const input = chatStarted ? bottomInputField : mainInput;
    input.value = '오늘 구내식당 메뉴를 알려주세요.';
    sendMessage();
}

function scheduleMeeting() {
    if (!chatStarted) {
        initiateChatMode();
    }
    const input = chatStarted ? bottomInputField : mainInput;
    input.value = '회의 일정을 잡고 싶습니다.';
    sendMessage();
}

function showAttachments() {
    alert('파일 첨부 기능은 준비 중입니다.');
}

function openReportBuilder() {
    alert('보고서 작성 도구로 이동합니다.');
    // 실제 구현 시 페이지 이동 또는 모달 열기
}

function openBoard() {
    alert('게시판으로 이동합니다.');
    // 실제 구현 시 페이지 이동
}

// 모바일 사이드바 토글
function toggleMobileSidebar() {
    const sidebar = document.querySelector('.sidebar');
    const overlay = document.querySelector('.mobile-sidebar-overlay');
    
    if (sidebar && overlay) {
        sidebar.classList.toggle('mobile-active');
        overlay.classList.toggle('active');
    }
}

function closeMobileSidebar() {
    const sidebar = document.querySelector('.sidebar');
    const overlay = document.querySelector('.mobile-sidebar-overlay');
    
    if (sidebar && overlay) {
        sidebar.classList.remove('mobile-active');
        overlay.classList.remove('active');
    }
}

// 초기화
document.addEventListener('DOMContentLoaded', function() {
    // 초기 상태 설정
    startNewChat();
    
    // 포커스 설정
    if (mainInput) {
        mainInput.focus();
    }
    
    // 사이드바 메뉴 아이템 클릭 이벤트
    document.querySelectorAll('.menu-item').forEach(item => {
        item.addEventListener('click', function() {
            // 추후 구현: 대화 목록 표시 등
            console.log('Menu item clicked:', this.textContent);
            
            // 모바일에서 메뉴 클릭 시 사이드바 닫기
            if (window.innerWidth <= 768) {
                closeMobileSidebar();
            }
        });
    });
    
    // 윈도우 리사이즈 처리
    window.addEventListener('resize', function() {
        if (chatStarted) {
            scrollToBottom();
        }
        
        // 데스크톱 크기로 변경 시 모바일 사이드바 초기화
        if (window.innerWidth > 768) {
            closeMobileSidebar();
        }
    });
    
    // ESC 키로 모바일 사이드바 닫기
    document.addEventListener('keydown', function(event) {
        if (event.key === 'Escape') {
            closeMobileSidebar();
        }
    });
});

// 애니메이션 추가
const style = document.createElement('style');
style.textContent = `
    .message-container {
        animation: fadeInUp 0.3s ease-out;
    }
    
    @keyframes fadeInUp {
        from {
            opacity: 0;
            transform: translateY(20px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
    
    .user-message {
        animation: fadeInUp 0.3s ease-out;
    }
    
    .input-container {
        transition: all 0.3s ease;
    }
    
    .input-container:focus-within {
        box-shadow: 0 0 0 2px rgba(250, 102, 0, 0.2);
    }
    
    .quick-button {
        position: relative;
        overflow: hidden;
    }
    
    .quick-button::before {
        content: '';
        position: absolute;
        top: 50%;
        left: 50%;
        width: 0;
        height: 0;
        border-radius: 50%;
        background: rgba(250, 102, 0, 0.1);
        transform: translate(-50%, -50%);
        transition: width 0.6s, height 0.6s;
    }
    
    .quick-button:hover::before {
        width: 100%;
        height: 100%;
    }
`;
document.head.appendChild(style);

// 테마 관련 함수
function initTheme() {
    // localStorage에서 저장된 테마 확인
    const savedTheme = localStorage.getItem('theme');
    
    if (savedTheme) {
        currentTheme = savedTheme;
    } else {
        // 기본값은 라이트 모드
        currentTheme = 'light';
    }
    
    // 테마 적용
    if (currentTheme === 'dark') {
        document.body.classList.add('dark-mode');
    } else {
        document.body.classList.remove('dark-mode');
    }
}

// 테마 전환
function toggleTheme() {
    if (currentTheme === 'light') {
        currentTheme = 'dark';
        document.body.classList.add('dark-mode');
    } else {
        currentTheme = 'light';
        document.body.classList.remove('dark-mode');
    }
    
    // localStorage에 저장
    localStorage.setItem('theme', currentTheme);
    
    // 애니메이션 효과
    const toggleBtn = document.querySelector('.theme-toggle');
    if (toggleBtn) {
        toggleBtn.style.transform = 'scale(0.9)';
        setTimeout(() => {
            toggleBtn.style.transform = '';
        }, 200);
    }
}

// 시스템 테마 변경 감지 (선택적 - 사용자가 수동으로 설정하지 않은 경우에만)
// 기본은 라이트 모드를 유지하고, 사용자가 원할 때만 다크모드 전환 가능

// 초기화
document.addEventListener('DOMContentLoaded', initTheme);

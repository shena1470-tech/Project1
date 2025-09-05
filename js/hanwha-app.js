// 한화생명 AI 비서 애플리케이션

// 상태 관리
let chatStarted = false;
let messages = [];
let currentUser = null;
let usersData = [];
let currentChatId = null;

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
    await chatManager.init();
    updateChatHistory();
});

// 유저 데이터 로드
async function loadUsers() {
    // SAMPLE_USERS_DATA가 정의되어 있으면 사용
    if (typeof SAMPLE_USERS_DATA !== 'undefined' && SAMPLE_USERS_DATA.users) {
        usersData = SAMPLE_USERS_DATA.users;
        console.log('유저 데이터 로드 성공:', usersData.length + '명의 사용자');
    } else {
        console.warn('샘플 유저 데이터를 찾을 수 없습니다. 폴백 데이터 사용');
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
    const savedUserId = storageManager.getCurrentUserId();
    if (savedUserId && usersData.length > 0) {
        currentUser = usersData.find(user => user.id === savedUserId) || usersData[0];
    } else if (usersData.length > 0) {
        currentUser = usersData[0];
    }
    
    if (currentUser) {
        storageManager.setCurrentUserId(currentUser.id);
    }
}

// 유저 정보 표시 업데이트
function updateUserDisplay() {
    if (!currentUser) return;
    
    // 헤더 유저 이름 업데이트 (오른쪽 상단)
    const headerUserName = document.querySelector('.header-actions .user-name');
    if (headerUserName) {
        headerUserName.innerHTML = `
            ${currentUser.name}
            <svg class="arrow-down" viewBox="0 0 20 20" fill="none">
                <path d="M5 7.5L10 12.5L15 7.5" stroke="#333333" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
        `;
    }
    
    // 유저 프로필 클릭 이벤트
    const userProfile = document.querySelector('.user-profile');
    if (userProfile) {
        userProfile.onclick = toggleUserDropdown;
    }
    
    // 웰컴 메시지 업데이트
    const welcomeTitle = document.querySelector('.welcome-title');
    if (welcomeTitle) {
        welcomeTitle.textContent = `안녕하세요. ${currentUser.name} ${currentUser.position}님!`;
    }
}

// 대화 히스토리 업데이트
function updateChatHistory() {
    if (!currentUser) return;
    
    const historyList = document.getElementById('chatHistoryList');
    if (!historyList) return;
    
    const recentChats = chatManager.getRecentChats(currentUser.id, 20);
    
    if (recentChats.length === 0) {
        historyList.innerHTML = '<div class="empty-history">대화 내역이 없습니다</div>';
        return;
    }
    
    historyList.innerHTML = recentChats.map(chat => {
        // 마지막 메시지 가져오기
        const lastMessage = chat.messages && chat.messages.length > 0 
            ? chat.messages[chat.messages.length - 1].text 
            : '대화를 시작하세요';
            
        return `
            <div class="chat-history-item ${chat.id === currentChatId ? 'active' : ''}" 
                 onclick="loadChat('${chat.id}')">
                <div class="chat-title">${escapeHtml(chat.title)}</div>
                <div class="chat-preview">${escapeHtml(lastMessage)}</div>
                <div class="chat-time">${formatDate(chat.lastUpdated)}</div>
            </div>
        `;
    }).join('');
}

// 전역 함수로 노출 (다른 페이지에서도 사용 가능)
function loadChatHistory() {
    updateChatHistory();
}

// 날짜 포맷 함수
function formatDate(isoString) {
    const date = new Date(isoString);
    const now = new Date();
    const diff = now - date;
    
    // 1분 미만
    if (diff < 60000) {
        return '방금 전';
    }
    // 1시간 미만
    if (diff < 3600000) {
        const minutes = Math.floor(diff / 60000);
        return `${minutes}분 전`;
    }
    // 24시간 미만
    if (diff < 86400000) {
        const hours = Math.floor(diff / 3600000);
        return `${hours}시간 전`;
    }
    // 7일 미만
    if (diff < 604800000) {
        const days = Math.floor(diff / 86400000);
        return `${days}일 전`;
    }
    
    // 그 외
    return date.toLocaleDateString('ko-KR');
}

// 채팅 로드
function loadChat(chatId) {
    if (!currentUser) return;
    
    const chat = chatManager.getChat(currentUser.id, chatId);
    if (!chat) return;
    
    // 현재 채팅 ID 설정
    currentChatId = chatId;
    chatManager.currentChatId = chatId;
    
    // 메시지 로드
    messages = chat.messages.map(msg => ({
        type: msg.type,
        text: msg.text
    }));
    
    // 채팅 화면 초기화 및 메시지 표시
    if (!chatStarted) {
        initiateChatMode();
    }
    
    // 기존 메시지 클리어 후 다시 렌더링
    chatMessages.innerHTML = '';
    messages.forEach(msg => {
        if (msg.type === 'user') {
            renderUserMessage(msg.text);
        } else {
            renderAIMessage(msg.text);
        }
    });
    
    scrollToBottom();
    updateChatHistory();
}

// 유저 드롭다운 토글
function toggleUserDropdown() {
    let dropdown = document.getElementById('userDropdown');
    
    if (dropdown) {
        dropdown.remove();
        return;
    }
    
    dropdown = createUserDropdown();
    // 오른쪽 상단 헤더의 user-profile 영역에 추가
    const userProfile = document.querySelector('.user-profile');
    if (userProfile) {
        userProfile.appendChild(dropdown);
    }
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
        storageManager.setCurrentUserId(userId);
        updateUserDisplay();
        closeUserDropdown();
        
        // 새로운 유저로 전환 시 채팅 초기화
        startNewChat();
        
        // 해당 유저의 대화 히스토리 업데이트
        updateChatHistory();
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
    currentChatId = null;
    chatManager.currentChatId = null;
    
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
    
    // 대화 히스토리 업데이트
    updateChatHistory();
}

// 메시지 전송
function sendMessage() {
    const input = chatStarted ? bottomInputField : mainInput;
    const message = input.value.trim();
    
    if (!message) return;
    
    // 새 채팅이면 ChatManager에 새 세션 생성
    if (!currentChatId && currentUser) {
        currentChatId = chatManager.createNewChat(currentUser.id);
        chatManager.currentChatId = currentChatId;
    }
    
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
    renderUserMessage(text);
    
    messages.push({ type: 'user', text: text });
    
    // ChatManager에 저장
    if (currentUser && currentChatId) {
        chatManager.addMessage(currentUser.id, currentChatId, 'user', text);
        updateChatHistory();
    }
}

// 사용자 메시지 렌더링
function renderUserMessage(text) {
    const messageHtml = `
        <div class="message-container user-message" style="justify-content: flex-end;">
            <div class="message-bubble" style="background: linear-gradient(135deg, #fa6600, #ff8833); color: white; padding: 12px 20px; border-radius: 18px; max-width: 70%;">
                <p class="message-text" style="color: white; font-size: 16px;">${escapeHtml(text)}</p>
            </div>
        </div>
    `;
    
    chatMessages.insertAdjacentHTML('beforeend', messageHtml);
    scrollToBottom();
}

// AI 응답 추가
function addAIResponse(userMessage) {
    // 회의실 예약 요청 감지
    if (userMessage.includes('회의실') && (
        userMessage.includes('잡아') || 
        userMessage.includes('예약') || 
        userMessage.includes('예약해') ||
        userMessage.includes('보아')
    )) {
        // 회의실 예약 UI 활성화
        activateMeetingReservation();
        return;
    }
    
    // 일반 AI 응답 로직
    let response = generateAIResponse(userMessage);
    
    renderAIMessage(response);
    
    messages.push({ type: 'ai', text: response });
    
    // ChatManager에 저장
    if (currentUser && currentChatId) {
        chatManager.addMessage(currentUser.id, currentChatId, 'ai', response);
        updateChatHistory();
    }
}

// AI 메시지 렌더링
function renderAIMessage(text) {
    const messageHtml = `
        <div class="message-container">
            <div class="ai-avatar"></div>
            <div class="message-bubble">
                <p class="message-text">${text}</p>
            </div>
        </div>
    `;
    
    chatMessages.insertAdjacentHTML('beforeend', messageHtml);
    scrollToBottom();
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
    
    /* quick-button hover 효과 제거 - 비활성화된 버튼이므로 hover 효과 불필요 */
    .quick-button {
        position: relative;
        /* overflow: hidden; */
    }
    
    /* hover 효과 제거 */
    /*
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
    */
    
    /* 대화 히스토리 스타일 */
    .chat-history-section {
        padding: 16px;
    }
    
    .section-title {
        font-size: 14px;
        font-weight: 600;
        color: #666;
        margin-bottom: 12px;
        padding-left: 8px;
    }
    
    .chat-history-list {
        display: flex;
        flex-direction: column;
        gap: 4px;
    }
    
    .chat-history-item {
        padding: 10px 12px;
        border-radius: 8px;
        cursor: pointer;
        transition: background-color 0.2s ease;
    }
    
    .chat-history-item:hover {
        background-color: #f5f5f5;
    }
    
    .chat-history-item.active {
        background-color: #fff3e8;
        border-left: 3px solid #fa6600;
        padding-left: 9px;
    }
    
    .chat-history-item .chat-title {
        font-size: 14px;
        color: #333;
        margin-bottom: 4px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }
    
    .chat-history-item .chat-date {
        font-size: 12px;
        color: #999;
    }
    
    /* 회의실 예약 오버레이 스타일 */
    .meeting-reservation-overlay {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0, 0, 0, 0.5);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 1000;
        animation: fadeIn 0.3s ease;
    }
    
    .meeting-reservation-wrapper {
        position: relative;
        width: 90%;
        max-width: 900px;
        max-height: 90vh;
        background: white;
        border-radius: 16px;
        overflow-y: auto;
        animation: slideUp 0.3s ease;
    }
    
    .close-reservation-btn {
        position: absolute;
        top: 16px;
        right: 16px;
        width: 32px;
        height: 32px;
        border: none;
        background: #f5f5f5;
        border-radius: 50%;
        font-size: 20px;
        cursor: pointer;
        z-index: 10;
        transition: background 0.2s ease;
    }
    
    .close-reservation-btn:hover {
        background: #e0e0e0;
    }
    
    @keyframes slideUp {
        from {
            transform: translateY(20px);
            opacity: 0;
        }
        to {
            transform: translateY(0);
            opacity: 1;
        }
    }
    
    .empty-history {
        text-align: center;
        padding: 20px;
        color: #999;
        font-size: 14px;
    }
`;
document.head.appendChild(style);


// 회의실 예약 시스템 활성화
function activateMeetingReservation() {
    // 회의실 예약 시스템 초기화
    meetingReservation.initializeNewReservation();
    
    // 현재 사용자를 첫 번째 참가자로 추가
    if (currentUser) {
        meetingReservation.addParticipant(currentUser);
        meetingReservation.currentReservation.createdBy = currentUser.id;
    }
    
    // AI 메시지 표시
    renderAIMessage('회의실 예약을 시작합니다. 아래 화면에서 참가자를 추가해주세요.');
    
    // 회의실 예약 UI를 별도의 컨테이너에 렌더링
    const reservationContainer = document.createElement('div');
    reservationContainer.id = 'meetingReservationContainer';
    reservationContainer.className = 'meeting-reservation-overlay';
    reservationContainer.innerHTML = `
        <div class="meeting-reservation-wrapper">
            <button class="close-reservation-btn" onclick="closeMeetingReservation()">×</button>
            <div id="meetingReservationContent"></div>
        </div>
    `;
    
    // 채팅 메시지 영역에 추가
    chatMessages.appendChild(reservationContainer);
    
    // 회의실 예약 UI 활성화
    const contentDiv = document.getElementById('meetingReservationContent');
    meetingReservationUI.activate(contentDiv);
    
    messages.push({ type: 'ai', text: '회의실 예약 시스템이 활성화되었습니다.' });
    
    // ChatManager에 저장
    if (currentUser && currentChatId) {
        chatManager.addMessage(currentUser.id, currentChatId, 'ai', '회의실 예약을 시작합니다.');
        updateChatHistory();
    }
}

// 회의실 예약 닫기
function closeMeetingReservation() {
    const container = document.getElementById('meetingReservationContainer');
    if (container) {
        container.remove();
    }
    
    // 예약 완료 확인
    if (meetingReservation.currentStep === 'complete') {
        const summary = meetingReservation.getReservationSummary();
        const message = `회의실 예약이 완료되었습니다!\n
` +
                       `회의 제목: ${summary.title || '팀 회의'}\n` +
                       `시간: ${summary.time}\n` +
                       `장소: ${summary.room.name}\n` +
                       `참석자: ${summary.participants.map(p => p.name).join(', ')}`;
        
        renderAIMessage(message);
        
        if (currentUser && currentChatId) {
            chatManager.addMessage(currentUser.id, currentChatId, 'ai', message);
            updateChatHistory();
        }
    } else {
        renderAIMessage('회의실 예약이 취소되었습니다.');
    }
}

// 알림 표시 함수
function showNotifications() {
    // 알림 드롭다운이 이미 있으면 제거
    let dropdown = document.getElementById('notificationDropdown');
    if (dropdown) {
        dropdown.remove();
        return;
    }
    
    // 알림 드롭다운 생성
    dropdown = document.createElement('div');
    dropdown.id = 'notificationDropdown';
    dropdown.className = 'notification-dropdown';
    dropdown.innerHTML = `
        <div class="notification-header">
            <h3>알림</h3>
            <button onclick="document.getElementById('notificationDropdown').remove()">×</button>
        </div>
        <div class="notification-list">
            <div class="notification-item">
                <div class="notification-icon">📢</div>
                <div class="notification-content">
                    <div class="notification-title">팀 회의 일정 변경</div>
                    <div class="notification-message">오늘 오후 3시 회의가 4시로 변경되었습니다.</div>
                    <div class="notification-time">30분 전</div>
                </div>
            </div>
            <div class="notification-item">
                <div class="notification-icon">📄</div>
                <div class="notification-content">
                    <div class="notification-title">보고서 승인 완료</div>
                    <div class="notification-message">월간 실적 보고서가 승인되었습니다.</div>
                    <div class="notification-time">2시간 전</div>
                </div>
            </div>
            <div class="notification-item">
                <div class="notification-icon">🍚</div>
                <div class="notification-content">
                    <div class="notification-title">구내식당 메뉴 업데이트</div>
                    <div class="notification-message">오늘의 특별 메뉴가 등록되었습니다.</div>
                    <div class="notification-time">3시간 전</div>
                </div>
            </div>
        </div>
    `;
    
    // 알림 버튼 근처에 드롭다운 위치시키기
    const notificationButton = document.querySelector('.notification-button');
    if (notificationButton) {
        notificationButton.parentElement.appendChild(dropdown);
    }
    
    // 외부 클릭시 닫기
    setTimeout(() => {
        document.addEventListener('click', function closeOnClickOutside(e) {
            if (!dropdown.contains(e.target) && e.target !== notificationButton) {
                dropdown.remove();
                document.removeEventListener('click', closeOnClickOutside);
            }
        });
    }, 100);
}


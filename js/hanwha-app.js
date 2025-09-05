// 한화생명 AI 비서 애플리케이션

// 상태 관리
let chatStarted = false;
let messages = [];
let currentUser = null;
let usersData = [];
let currentChatId = null;

// DOM 요소 캐싱 - 일부는 DOMContentLoaded 이후에 설정
let welcomeScreen = null;
let chatMessages = null;
let bottomInput = null;
let mainInput = null;
let bottomInputField = null;
let chatArea = null;

// 초기화 함수
window.addEventListener('DOMContentLoaded', async () => {
    // DOM 요소 초기화
    welcomeScreen = document.getElementById('welcomeScreen');
    chatMessages = document.getElementById('chatMessages');
    bottomInput = document.getElementById('bottomInput');
    mainInput = document.getElementById('mainInput');
    bottomInputField = document.getElementById('bottomInputField');
    chatArea = document.getElementById('chatArea');
    
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
        headerUserName.textContent = currentUser.name;
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
    if (chatArea) {
        chatArea.style.justifyContent = 'center';
        chatArea.style.alignItems = 'center';
    }
    
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
    if (welcomeScreen) {
        welcomeScreen.style.display = 'none';
    }
    
    // 채팅 메시지 영역 표시
    if (chatMessages) {
        chatMessages.style.display = 'flex';
    }
    
    // 하단 입력 영역 표시
    if (bottomInput) {
        bottomInput.style.display = 'flex';
    }
    
    // 채팅 영역 스타일 변경
    if (chatArea) {
        chatArea.style.justifyContent = 'flex-start';
        chatArea.style.alignItems = 'stretch';
        chatArea.style.padding = '0';
        chatArea.style.paddingBottom = '104px'; // 하단 입력창 높이만큼 패딩
    }
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
    // 회의 관련 요청 처리
    const meetingResponse = handleMeetingRequest(userMessage);
    if (meetingResponse) {
        if (meetingResponse.type === 'meeting-options') {
            // 피그마 디자인 스타일의 회의 옵션 표시
            const aiMessageText = '참석자 모두 가능한 날짜와 시간으로 잡았어요.\n2개 중 마음에 드는 것을 선택해 주세요.';
            renderAIMessage(aiMessageText);
            
            // 회의 옵션 카드들을 별도로 렌더링
            const optionsHtml = meetingResponse.response;
            chatMessages.insertAdjacentHTML('beforeend', optionsHtml);
            
            // 옵션 카드 클릭 이벤트 추가
            document.querySelectorAll('.meeting-option-card').forEach(card => {
                card.addEventListener('click', function() {
                    document.querySelectorAll('.meeting-option-card').forEach(c => c.classList.remove('selected'));
                    this.classList.add('selected');
                });
            });
            
            messages.push({ type: 'ai', text: aiMessageText });
            
            // ChatManager에 저장
            if (currentUser && currentChatId) {
                chatManager.addMessage(currentUser.id, currentChatId, 'ai', aiMessageText);
                updateChatHistory();
            }
            return;
        } else if (meetingResponse.type === 'reservation') {
            // 회의실 예약 UI 활성화
            activateMeetingReservation();
            return;
        } else if (meetingResponse.type === 'query') {
            // 회의 정보 조회 응답
            renderAIMessage(meetingResponse.message);
            messages.push({ type: 'ai', text: meetingResponse.message });
            
            // ChatManager에 저장
            if (currentUser && currentChatId) {
                chatManager.addMessage(currentUser.id, currentChatId, 'ai', meetingResponse.message);
                updateChatHistory();
            }
            return;
        }
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

// 회의 관련 요청 처리
function handleMeetingRequest(userMessage) {
    const lowerMessage = userMessage.toLowerCase();
    
    // 점심, 식사 관련 키워드 제외
    const excludeKeywords = ['점심', '저녁', '식사', '밥', '먹', '구내식당', '메뉴', '음식', '식당', '카페테리아'];
    const hasExcludeKeyword = excludeKeywords.some(keyword => lowerMessage.includes(keyword));
    
    // 점심/식사 관련 문장이면 회의 예약으로 처리하지 않음
    if (hasExcludeKeyword) {
        return null;
    }
    
    // 회의실 예약 관련 키워드 - '예약'은 너무 일반적이므로 제외
    const reservationKeywords = ['회의실', '회의 잡', '미팅 잡', '회의 예약', '미팅 예약', '회의실 예약', '회의 하나만'];
    // '예약' 단독 사용 시 회의실 예약으로 처리하지 않음
    const hasReservationKeyword = reservationKeywords.some(keyword => lowerMessage.includes(keyword)) ||
                                  (lowerMessage.includes('회의') && lowerMessage.includes('잡'));
    
    // 전역 회의실 목록이 있으면 사용 (meeting-rooms-data.js 로드 확인)
    if (typeof MEETING_ROOMS !== 'undefined' && typeof MEETING_ROOM_NAMES !== 'undefined') {
        console.log('전역 회의실 목록 로드됨:', MEETING_ROOM_NAMES.length + '개 회의실');
    }
    
    // 회의 조회 관련 키워드
    const queryKeywords = ['회의 알려', '회의가 있', '미팅 알려', '일정 알려', '스케줄'];
    const hasQueryKeyword = queryKeywords.some(keyword => lowerMessage.includes(keyword));
    
    // 회의 관련 키워드가 있는지 확인
    const hasMeetingKeyword = lowerMessage.includes('회의') || lowerMessage.includes('미팅');
    
    // 회의 예약 요청 분석
    if (hasReservationKeyword || (hasMeetingKeyword && (lowerMessage.includes('잡') || lowerMessage.includes('예약')))) {
        // 참석자 파싱
        const attendees = parseAttendees(userMessage);
        // 층수 제한 파싱 (예: "8층 회의실")
        const floorRestriction = parseFloorRestriction(userMessage);
        // 시간 파싱 (예: "1시간짜리")
        const duration = parseDuration(userMessage);
        
        // 피그마 디자인 스타일로 옵션 제시
        if (attendees.length > 0) {
            return {
                type: 'meeting-options',
                attendees: attendees,
                floorRestriction: floorRestriction,
                duration: duration,
                response: generateMeetingOptions(attendees, floorRestriction, duration, userMessage)
            };
        }
        
        return { type: 'reservation' };
    }
    
    if (hasQueryKeyword || (hasMeetingKeyword && lowerMessage.includes('알려'))) {
        // 캘린더 데이터 조회
        const meetings = getMeetingInfo(userMessage);
        return { type: 'query', message: meetings };
    }
    
    return null;
}

// 회의 정보 조회
function getMeetingInfo(userMessage) {
    const lowerMessage = userMessage.toLowerCase();
    
    // 캘린더 데이터 가져오기
    const calendarData = getCalendarData();
    const today = new Date();
    const todayStr = today.toISOString().split('T')[0];
    
    // 오늘 회의 필터링
    const todayMeetings = calendarData.filter(event => 
        event.date === todayStr && event.type === 'meeting'
    );
    
    // 특정 시간 요청 처리
    if (lowerMessage.includes('2시')) {
        const twoOclockMeetings = todayMeetings.filter(event => {
            const eventHour = parseInt(event.startTime.split(':')[0]);
            return eventHour === 14; // 오후 2시
        });
        
        if (twoOclockMeetings.length > 0) {
            return `오늘 오후 2시에 예정된 회의입니다:\n\n` +
                   twoOclockMeetings.map(m => 
                       `📅 ${m.title}\n시간: ${m.startTime} - ${m.endTime}\n장소: ${m.location || '미정'}\n참석자: ${m.attendees?.join(', ') || '미정'}`
                   ).join('\n\n');
        } else {
            return '오늘 오후 2시에는 예정된 회의가 없습니다.';
        }
    }
    
    // 가장 빠른 회의 요청
    if (lowerMessage.includes('가장 빠른') || lowerMessage.includes('다음')) {
        const now = today.getHours() * 60 + today.getMinutes();
        const upcomingMeetings = todayMeetings.filter(event => {
            const [hour, minute] = event.startTime.split(':').map(Number);
            const eventTime = hour * 60 + minute;
            return eventTime > now;
        }).sort((a, b) => a.startTime.localeCompare(b.startTime));
        
        if (upcomingMeetings.length > 0) {
            const next = upcomingMeetings[0];
            return `가장 빠른 회의 일정입니다:\n\n` +
                   `📅 ${next.title}\n시간: ${next.startTime} - ${next.endTime}\n장소: ${next.location || '미정'}\n참석자: ${next.attendees?.join(', ') || '미정'}`;
        } else {
            return '오늘 남은 회의 일정이 없습니다.';
        }
    }
    
    // 마케팅 관련 회의
    if (lowerMessage.includes('마케팅')) {
        const marketingMeetings = todayMeetings.filter(event => 
            event.title.toLowerCase().includes('마케팅') || 
            event.description?.toLowerCase().includes('마케팅')
        );
        
        if (marketingMeetings.length > 0) {
            return `마케팅 관련 회의 일정입니다:\n\n` +
                   marketingMeetings.map(m => 
                       `📅 ${m.title}\n시간: ${m.startTime} - ${m.endTime}\n장소: ${m.location || '미정'}\n참석자: ${m.attendees?.join(', ') || '미정'}`
                   ).join('\n\n');
        } else {
            return '오늘 마케팅 관련 회의는 없습니다.';
        }
    }
    
    // 오늘 전체 회의 요청
    if (lowerMessage.includes('오늘') || lowerMessage.includes('전체')) {
        if (todayMeetings.length > 0) {
            return `오늘의 회의 일정입니다 (총 ${todayMeetings.length}개):\n\n` +
                   todayMeetings.map(m => 
                       `📅 ${m.title}\n시간: ${m.startTime} - ${m.endTime}\n장소: ${m.location || '미정'}`
                   ).join('\n\n');
        } else {
            return '오늘은 예정된 회의가 없습니다.';
        }
    }
    
    // 기본 응답
    if (todayMeetings.length > 0) {
        return `오늘 예정된 회의가 ${todayMeetings.length}개 있습니다. 자세한 내용을 알려드릴까요?`;
    } else {
        return '오늘은 예정된 회의가 없습니다. 회의를 예약하시겠습니까?';
    }
}

// 참석자 파싱
function parseAttendees(message) {
    const attendees = [];
    const knownAttendees = [
        { name: '정준하', position: '과장', id: 'user-002' },
        { name: '박명수', position: '차장', id: 'user-003' },
        { name: '이정은', position: '대리', id: 'user-005' },
        { name: '김동준', position: '과장', id: 'user-001' },
        { name: '하동훈', position: '사원', id: 'user-004' }
    ];
    
    knownAttendees.forEach(person => {
        if (message.includes(person.name)) {
            attendees.push(person);
        }
    });
    
    return attendees;
}

// 층수 제한 파싱
function parseFloorRestriction(message) {
    const floorMatch = message.match(/(\d+)층/);
    if (floorMatch) {
        return parseInt(floorMatch[1]);
    }
    return null;
}

// 회의 시간 파싱
function parseDuration(message) {
    if (message.includes('30분')) return '30분';
    if (message.includes('1시간') || message.includes('한시간')) return '1시간';
    if (message.includes('1시간 30분') || message.includes('1시간반')) return '1시간 30분';
    if (message.includes('2시간')) return '2시간';
    return '1시간'; // 기본값
}

// 회의 옵션 생성 (피그마 디자인 스타일)
function generateMeetingOptions(attendees, floorRestriction, duration, originalMessage) {
    const options = findAvailableMeetingSlots(attendees, floorRestriction, duration);
    
    if (options.length === 0) {
        return '죄송합니다. 참석자 모두가 가능한 시간을 찾을 수 없습니다. 다른 날짜나 참석자를 조정해 보시겠어요?';
    }
    
    // 피그마 디자인처럼 옵션 카드 생성
    const optionCards = options.slice(0, 2).map((option, index) => `
        <div class="meeting-option-card" data-option-index="${index}">
            <h3 class="option-title">회의 옵션 ${index + 1}</h3>
            <div class="option-details">
                <div class="detail-group">
                    <label>참석자</label>
                    <div class="attendee-badges">
                        ${option.attendees.map(a => `<span class="attendee-badge">${a.name} ${a.position}</span>`).join('')}
                    </div>
                </div>
                <div class="detail-group">
                    <label>회의실</label>
                    <div class="room-field">${option.room}</div>
                </div>
                <div class="detail-group">
                    <label>날짜</label>
                    <div class="date-field">
                        <span>${option.date}</span>
                        <img src="assets/icons/calendar.svg" alt="" class="calendar-icon">
                    </div>
                </div>
                <div class="detail-group">
                    <label>시간</label>
                    <div class="time-field">${option.time}</div>
                </div>
            </div>
        </div>
    `).join('');
    
    const responseHTML = `
        <div class="meeting-options-container">
            <div class="meeting-options-grid">
                ${optionCards}
            </div>
            <button class="confirm-meeting-btn" onclick="confirmMeetingOption()">선택한 옵션으로 예약하기</button>
        </div>
    `;
    
    return responseHTML;
}

// 가능한 회의 시간 찾기
function findAvailableMeetingSlots(attendees, floorRestriction, duration) {
    // 현재 시간 기준으로 가능한 슬롯 생성
    const options = [];
    const today = new Date();
    
    // 8층 회의실 우선 배정
    const rooms = floorRestriction === 8 ? 
        ['8층 - E1 - 중회의실', '8층 - E2 - 소회의실', '8층 - W1 - 중회의실'] :
        ['8층 - E1 - 중회의실', '12층 - 대회의실', '10층 - 중회의실'];
    
    // 샘플 옵션 생성 (실제로는 캘린더 데이터와 연동해야 함)
    // 옵션 1: 오늘 오전
    const option1Date = new Date(today);
    option1Date.setDate(option1Date.getDate() + 1); // 내일
    options.push({
        attendees: attendees,
        room: rooms[0],
        date: formatDateKorean(option1Date),
        time: '오전 9시',
        available: true
    });
    
    // 옵션 2: 다음주 월요일
    const option2Date = new Date(today);
    option2Date.setDate(option2Date.getDate() + (8 - option2Date.getDay()) % 7 || 7);
    options.push({
        attendees: attendees,
        room: rooms[1] || rooms[0],
        date: formatDateKorean(option2Date),
        time: '오후 2시',
        available: true
    });
    
    return options;
}

// 한국어 날짜 형식
function formatDateKorean(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const weekDays = ['일', '월', '화', '수', '목', '금', '토'];
    const dayOfWeek = weekDays[date.getDay()];
    return `${year}. ${month}. ${day}. (${dayOfWeek})`;
}

// 회의 옵션 선택 확인
function confirmMeetingOption() {
    const selectedCard = document.querySelector('.meeting-option-card.selected');
    if (selectedCard) {
        const optionIndex = selectedCard.getAttribute('data-option-index');
        alert(`회의 옵션 ${parseInt(optionIndex) + 1}이 선택되었습니다. 예약을 진행합니다.`);
        // 실제 예약 로직 구현
    } else {
        alert('먼저 회의 옵션을 선택해주세요.');
    }
}

// 캘린더 데이터 가져오기
function getCalendarData() {
    // localStorage에서 캘린더 데이터 가져오기
    const storedData = localStorage.getItem('calendarEvents');
    if (storedData) {
        return JSON.parse(storedData);
    }
    
    // 샘플 데이터 반환
    const today = new Date().toISOString().split('T')[0];
    return [
        {
            id: 'evt-001',
            date: today,
            startTime: '10:00',
            endTime: '11:00',
            title: '주간 팀 회의',
            type: 'meeting',
            location: '회의실 A',
            attendees: ['김동준', '이서연', '박준혁'],
            description: '주간 업무 보고 및 이슈 공유'
        },
        {
            id: 'evt-002',
            date: today,
            startTime: '14:00',
            endTime: '15:00',
            title: '마케팅 전략 회의',
            type: 'meeting',
            location: '회의실 B',
            attendees: ['이서연', '최민지', '정우성'],
            description: '2024년 상반기 마케팅 전략 논의'
        },
        {
            id: 'evt-003',
            date: today,
            startTime: '16:00',
            endTime: '16:30',
            title: '프로젝트 진행상황 점검',
            type: 'meeting',
            location: '화상회의',
            attendees: ['박준혁', '김동준'],
            description: 'AI 비서 프로젝트 진행 현황 점검'
        }
    ];
}

// AI 응답 생성 (시뮬레이션)
function generateAIResponse(userMessage) {
    const lowerMessage = userMessage.toLowerCase();
    
    // 간단한 응답 매핑
    if (lowerMessage.includes('보고서') || lowerMessage.includes('문서')) {
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
    // 새로운 모달 시스템 사용
    if (typeof meetingModal !== 'undefined') {
        meetingModal.open();
    } else {
        // 폴백: 기존 채팅 방식
        if (!chatStarted) {
            initiateChatMode();
        }
        const input = chatStarted ? bottomInputField : mainInput;
        input.value = '회의 일정을 잡고 싶습니다.';
        sendMessage();
    }
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
    // 새로운 회의실 예약 모달 열기
    if (typeof openMeetingModal === 'function') {
        openMeetingModal();
        
        // AI 메시지 표시
        renderAIMessage('회의실 예약 모달을 열었습니다. 필요한 정보를 입력해주세요.');
        
        // ChatManager에 저장
        if (currentUser && currentChatId) {
            chatManager.addMessage(currentUser.id, currentChatId, 'ai', '회의실 예약을 시작합니다.');
            updateChatHistory();
        }
    } else {
        // 폴백: 기존 시스템 사용
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

// 회의 모달 열기 함수
function openMeetingModal() {
    // MeetingModal 인스턴스 생성 및 열기
    const modal = new MeetingModal();
    modal.open();
}


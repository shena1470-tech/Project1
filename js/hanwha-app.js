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

    // 헤더 유저 아바타 업데이트 (첫 글자 표시)
    const headerUserAvatar = document.querySelector('.user-profile .user-avatar');
    if (headerUserAvatar) {
        headerUserAvatar.textContent = currentUser.name ? currentUser.name[0] : '?';
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

    // 메시지 로드 (확장된 구조 지원)
    messages = chat.messages.map(msg => ({
        type: msg.type,
        text: msg.text,
        htmlContent: msg.htmlContent,
        metadata: msg.metadata
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
            // HTML 콘텐츠가 있으면 그대로 사용, 없으면 기본 렌더링
            if (msg.htmlContent) {
                chatMessages.insertAdjacentHTML('beforeend', msg.htmlContent);

                // 메타데이터에 따라 이벤트 리스너 재연결
                if (msg.metadata && msg.metadata.type === 'meeting-options') {
                    // 회의 옵션 카드 클릭 이벤트 재연결
                    document.querySelectorAll('.meeting-option-card').forEach(card => {
                        card.addEventListener('click', function() {
                            document.querySelectorAll('.meeting-option-card').forEach(c => c.classList.remove('selected'));
                            this.classList.add('selected');
                        });
                    });
                }
            } else {
                renderAIMessage(msg.text);
            }
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
    // 상태카드 관련 요청 처리
    const statusCardResponse = handleStatusCardRequest(userMessage);
    if (statusCardResponse) {
        renderStatusCards(statusCardResponse);
        return;
    }

    // 휴가 관련 요청 처리
    const vacationResponse = handleVacationRequest(userMessage);
    if (vacationResponse) {
        renderAIMessageWithCard(vacationResponse.message, vacationResponse.vacationData, vacationResponse.responsiblePerson);
        messages.push({ type: 'ai', text: vacationResponse.message });

        // ChatManager에 저장 (HTML 콘텐츠와 메타데이터 포함)
        if (currentUser && currentChatId) {
            // 렌더링된 HTML을 캡처하여 저장
            setTimeout(() => {
                const lastMessageElements = chatMessages.children;
                const lastMessageHTML = lastMessageElements[lastMessageElements.length - 1].outerHTML;

                const metadata = {
                    type: 'vacation',
                    vacationData: vacationResponse.vacationData,
                    responsiblePerson: vacationResponse.responsiblePerson
                };

                chatManager.addMessage(currentUser.id, currentChatId, 'ai', vacationResponse.message, lastMessageHTML, metadata);
                updateChatHistory();
            }, 100);
        }
        return;
    }

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

            // ChatManager에 저장 (HTML 콘텐츠와 메타데이터 포함)
            if (currentUser && currentChatId) {
                setTimeout(() => {
                    const lastMessageElements = chatMessages.children;
                    // AI 메시지와 옵션 카드들을 모두 포함
                    let combinedHTML = '';
                    for (let i = Math.max(0, lastMessageElements.length - 2); i < lastMessageElements.length; i++) {
                        combinedHTML += lastMessageElements[i].outerHTML;
                    }

                    const metadata = {
                        type: 'meeting-options',
                        meetingData: meetingResponse.data
                    };

                    chatManager.addMessage(currentUser.id, currentChatId, 'ai', aiMessageText, combinedHTML, metadata);
                    updateChatHistory();
                }, 100);
            }
            return;
        } else if (meetingResponse.type === 'reservation') {
            // 회의실 예약 UI 활성화
            activateMeetingReservation();
            return;
        } else if (meetingResponse.type === 'query') {
            // 회의 정보 조회 응답
            renderAIMessage(meetingResponse.message);

            // 회의실 담당자 카드 추가
            const facilityPerson = {
                id: 'user-006',
                name: '정형돈',
                position: '부장',
                department: '시설관리팀',
                email: 'hyungdon.jung@hanwhalife.com',
                phone: '010-5678-9012',
                extension: '3456'
            };
            const responsibleCard = createResponsibleCard(facilityPerson);
            chatMessages.insertAdjacentHTML('beforeend', responsibleCard);

            messages.push({ type: 'ai', text: meetingResponse.message });

            // ChatManager에 저장 (HTML 콘텐츠와 메타데이터 포함)
            if (currentUser && currentChatId) {
                setTimeout(() => {
                    const lastMessageElements = chatMessages.children;
                    // AI 메시지와 담당자 카드를 모두 포함
                    let combinedHTML = '';
                    for (let i = Math.max(0, lastMessageElements.length - 2); i < lastMessageElements.length; i++) {
                        combinedHTML += lastMessageElements[i].outerHTML;
                    }

                    const metadata = {
                        type: 'meeting-query',
                        responsiblePerson: facilityPerson
                    };

                    chatManager.addMessage(currentUser.id, currentChatId, 'ai', meetingResponse.message, combinedHTML, metadata);
                    updateChatHistory();
                }, 100);
            }
            return;
        }
    }

    // 일반 AI 응답 로직
    let response = generateAIResponse(userMessage);

    renderAIMessage(response);

    // 일반 질문에 대한 기본 담당자 (AI 비서 지원팀)
    const defaultPerson = {
        id: 'user-001',
        name: '김동준',
        position: '과장',
        department: 'IT서비스팀',
        email: 'dongjun.kim@hanwhalife.com',
        phone: '010-1234-5678',
        extension: '5678'
    };
    const responsibleCard = createResponsibleCard(defaultPerson);
    chatMessages.insertAdjacentHTML('beforeend', responsibleCard);

    messages.push({ type: 'ai', text: response });

    // ChatManager에 저장 (HTML 콘텐츠와 메타데이터 포함)
    if (currentUser && currentChatId) {
        setTimeout(() => {
            const lastMessageElements = chatMessages.children;
            // AI 메시지와 담당자 카드를 모두 포함
            let combinedHTML = '';
            for (let i = Math.max(0, lastMessageElements.length - 2); i < lastMessageElements.length; i++) {
                combinedHTML += lastMessageElements[i].outerHTML;
            }

            const metadata = {
                type: 'general',
                responsiblePerson: defaultPerson
            };

            chatManager.addMessage(currentUser.id, currentChatId, 'ai', response, combinedHTML, metadata);
            updateChatHistory();
        }, 100);
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

    // AI 응답 후 약간의 지연을 두고 스크롤 (DOM 렌더링 완료 대기)
    setTimeout(() => {
        scrollToBottom();
    }, 100);
}

// AI 메시지와 카드를 함께 렌더링
function renderAIMessageWithCard(text, vacationData, responsiblePerson) {
    // AI 메시지 렌더링
    renderAIMessage(text);

    // 휴가 카드 렌더링
    if (vacationData) {
        const recentHistory = vacationData.recentVacations || [];
        const vacationCard = createVacationCard(vacationData, recentHistory);
        chatMessages.insertAdjacentHTML('beforeend', vacationCard);
    }

    // 담당자 카드 렌더링
    if (responsiblePerson) {
        const responsibleCard = createResponsibleCard(responsiblePerson);
        chatMessages.insertAdjacentHTML('beforeend', responsibleCard);
    }

    scrollToBottom();
}

// 휴가 카드 생성 - 컴팩트 버전
function createVacationCard(vacationData, recentHistory = []) {
    const totalRemaining = vacationData.annualLeave.remaining +
                           vacationData.specialLeave.sick.remaining +
                           vacationData.specialLeave.congratulations.remaining +
                           vacationData.specialLeave.family.remaining;

    return `
        <div class="message-container">
            <div class="ai-avatar"></div>
            <div class="vacation-card">
                <div class="vacation-header">
                    <div class="vacation-title">${vacationData.name}님의 휴가 현황</div>
                    <div class="vacation-year">${vacationData.year}년</div>
                </div>
                
                <div class="vacation-summary">
                    <div class="vacation-item">
                        <div class="vacation-label">총 남은 휴가</div>
                        <div class="vacation-number">${totalRemaining}</div>
                        <div class="vacation-unit">일</div>
                    </div>
                    <div class="vacation-item">
                        <div class="vacation-label">연차</div>
                        <div class="vacation-number">${vacationData.annualLeave.remaining}</div>
                        <div class="vacation-unit">일</div>
                    </div>
                    <div class="vacation-item">
                        <div class="vacation-label">사용</div>
                        <div class="vacation-number">${vacationData.annualLeave.used}</div>
                        <div class="vacation-unit">일</div>
                    </div>
                    <div class="vacation-item">
                        <div class="vacation-label">예정</div>
                        <div class="vacation-number">${vacationData.annualLeave.scheduled}</div>
                        <div class="vacation-unit">일</div>
                    </div>
                </div>
                
                <div class="vacation-details">
                    <div class="vacation-detail-title">상세 휴가 현황</div>
                    <div class="vacation-breakdown">
                        <div class="vacation-type">
                            <span class="vacation-type-name">연차</span>
                            <div class="vacation-type-days">
                                <span class="vacation-used">${vacationData.annualLeave.used}/${vacationData.annualLeave.total}일 사용</span>
                                <span class="vacation-remaining">${vacationData.annualLeave.remaining}일 남음</span>
                            </div>
                        </div>
                        <div class="vacation-type">
                            <span class="vacation-type-name">병가</span>
                            <div class="vacation-type-days">
                                <span class="vacation-used">${vacationData.specialLeave.sick.used}/${vacationData.specialLeave.sick.total}일 사용</span>
                                <span class="vacation-remaining">${vacationData.specialLeave.sick.remaining}일 남음</span>
                            </div>
                        </div>
                        <div class="vacation-type">
                            <span class="vacation-type-name">경조사</span>
                            <div class="vacation-type-days">
                                <span class="vacation-used">${vacationData.specialLeave.congratulations.used}/${vacationData.specialLeave.congratulations.total}일 사용</span>
                                <span class="vacation-remaining">${vacationData.specialLeave.congratulations.remaining}일 남음</span>
                            </div>
                        </div>
                        <div class="vacation-type">
                            <span class="vacation-type-name">가족돌봄</span>
                            <div class="vacation-type-days">
                                <span class="vacation-used">${vacationData.specialLeave.family.used}/${vacationData.specialLeave.family.total}일 사용</span>
                                <span class="vacation-remaining">${vacationData.specialLeave.family.remaining}일 남음</span>
                            </div>
                        </div>
                    </div>
                </div>
                
                ${recentHistory.length > 0 ? `
                <div class="vacation-history">
                    <div class="vacation-history-title">최근 휴가 사용 내역</div>
                    <div class="vacation-history-list">
                        ${recentHistory.map(h => `
                            <div class="vacation-history-item">
                                <span class="vacation-history-date">${h.startDate}</span>
                                <span class="vacation-history-type">${VacationManager.getVacationTypeName(h.type)}</span>
                                <span class="vacation-history-days">${h.days}일</span>
                            </div>
                        `).join('')}
                    </div>
                </div>
                ` : ''}
            </div>
        </div>
    `;
}

// 담당자 카드 생성
function createResponsibleCard(person) {
    // 이름의 첫 글자로 아바타 이니셜 생성
    const initial = person.name.charAt(0);

    return `
        <div class="message-container">
            <div class="ai-avatar"></div>
            <div class="responsible-card">
                <div class="responsible-avatar" onclick="handleResponsibleNameClick('${person.id || person.name}', event)">${initial}</div>
                <div class="responsible-info">
                    <div class="responsible-header">
                        <span class="responsible-name" onclick="handleResponsibleNameClick('${person.id || person.name}', event)" style="cursor: pointer; text-decoration: underline; color: #fa6600;">${person.name}</span>
                        <span class="responsible-position">${person.position}</span>
                    </div>
                    <div class="responsible-department">${person.department}</div>
                    <div class="responsible-contact">
                        <span class="responsible-email">${person.email}</span>
                        <span class="responsible-phone">내선 ${person.extension}</span>
                    </div>
                </div>
                <button class="responsible-action" onclick="handleResponsibleCardClick('${person.id || person.name}')">
                    문의하기
                </button>
            </div>
        </div>
    `;
}

// 담당자 이름 클릭 처리 - 상세정보 패널 표시
function handleResponsibleNameClick(personIdentifier, event) {
    console.log('담당자 이름 클릭:', personIdentifier);
    console.log('SAMPLE_USERS_DATA available:', !!window.SAMPLE_USERS_DATA);
    console.log('ORGANIZATION_DATA available:', !!window.ORGANIZATION_DATA);
    
    // 이벤트 전파 중지
    if (event) {
        event.preventDefault();
        event.stopPropagation();
        console.log('이벤트 전파 중지됨');
    }

    // personIdentifier가 ID인지 이름인지 확인
    let contactId = personIdentifier;

    // 이름으로 전달된 경우 ID를 찾아야 함
    if (personIdentifier && !personIdentifier.startsWith('user-')) {
        // SAMPLE_USERS_DATA에서 이름으로 ID 찾기
        const userData = window.SAMPLE_USERS_DATA?.users || [];
        const user = userData.find(u => u.name === personIdentifier);
        if (user) {
            contactId = user.id;
        } else {
            // 매니저 데이터에서도 찾아보기
            const managers = window.ORGANIZATION_DATA?.managers || {};
            for (const [managerId, managerInfo] of Object.entries(managers)) {
                if (managerInfo.name === personIdentifier) {
                    contactId = managerId;
                    break;
                }
            }
        }
    }

    // 담당자 상세정보 패널 표시
    console.log('contactDetailManager 확인:', window.contactDetailManager);
    console.log('최종 contactId:', contactId);
    
    if (window.contactDetailManager) {
        window.contactDetailManager.showContactDetail(contactId);
    } else {
        console.error('ContactDetailManager를 찾을 수 없습니다. contactDetailManager가 로드되었는지 확인하세요.');
        // 대체 방안으로 알림 표시
        alert(`담당자 정보를 로드 중입니다.\n${personIdentifier}의 상세정보는 잠시 후 표시됩니다.`);
    }
}

// 담당자 카드 문의하기 버튼 클릭 처리
function handleResponsibleCardClick(personIdentifier) {
    console.log('문의하기 버튼 클릭:', personIdentifier);

    // 직접 채팅 시작하기
    startChatWithPerson(personIdentifier);
}

// 특정 담당자와 채팅 시작 함수
function startChatWithPerson(personIdentifier) {
    // personIdentifier가 ID인지 이름인지 확인
    let contactId = personIdentifier;
    let userData = null;

    // 이름으로 전달된 경우 ID를 찾아야 함
    if (personIdentifier && !personIdentifier.startsWith('user-')) {
        // SAMPLE_USERS_DATA에서 이름으로 ID 찾기
        const allUsers = window.SAMPLE_USERS_DATA?.users || [];
        const user = allUsers.find(u => u.name === personIdentifier);
        if (user) {
            contactId = user.id;
            userData = user;
        } else {
            // 매니저 데이터에서도 찾아보기
            const managers = window.ORGANIZATION_DATA?.managers || {};
            for (const [managerId, managerInfo] of Object.entries(managers)) {
                if (managerInfo.name === personIdentifier) {
                    contactId = managerId;
                    userData = managerInfo;
                    break;
                }
            }
        }
    } else {
        // ID로 전달된 경우 사용자 데이터 찾기
        const allUsers = window.SAMPLE_USERS_DATA?.users || [];
        userData = allUsers.find(u => u.id === contactId);
        if (!userData) {
            const managers = window.ORGANIZATION_DATA?.managers || {};
            userData = managers[contactId];
        }
    }

    if (!userData) {
        console.error('사용자 데이터를 찾을 수 없습니다:', personIdentifier);
        alert('담당자 정보를 찾을 수 없습니다.');
        return;
    }

    // 채팅 모드로 전환
    if (typeof initiateChatMode === 'function') {
        initiateChatMode();
    }

    // 담당자와의 채팅 시작 메시지 추가
    const chatMessage = `${userData.name} ${userData.position}님과의 문의를 시작합니다.`;
    
    setTimeout(() => {
        if (typeof addUserMessage === 'function') {
            addUserMessage(chatMessage);
        }
        
        // AI 응답 (담당자 정보 기반)
        setTimeout(() => {
            const orgDetails = window.ORGANIZATION_DATA?.contactDetails?.[contactId];
            const responsibilities = orgDetails?.responsibilities?.slice(0, 3) || ['업무 정보를 불러오는 중입니다...'];
            
            const aiResponse = `안녕하세요! ${userData.name} ${userData.position}입니다. 무엇을 도와드릴까요? 😊\n\n제가 담당하고 있는 업무는 다음과 같습니다:\n${responsibilities.map(r => `• ${r}`).join('\n')}`;
            
            if (typeof addAIResponse === 'function') {
                addAIResponse(aiResponse);
            }
        }, 1500);
    }, 300);
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
                                  (lowerMessage.includes('회의') && lowerMessage.includes('잡')) ||
                                  (lowerMessage.includes('미팅') && lowerMessage.includes('잡'));

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
    // "미팅할거야", "회의할거야" 같은 패턴도 포함
    const hasMeetingPlan = lowerMessage.includes('미팅할') || lowerMessage.includes('회의할');

    if (hasReservationKeyword ||
        (hasMeetingKeyword && (lowerMessage.includes('잡') || lowerMessage.includes('예약'))) ||
        hasMeetingPlan) {
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
    const options = findAvailableMeetingSlots(attendees, floorRestriction, duration, originalMessage);

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
function findAvailableMeetingSlots(attendees, floorRestriction, duration, userMessage = '') {
    const options = [];
    const today = new Date();

    // 회의실 목록 설정
    const rooms = floorRestriction === 8 ?
        ['8층 - E1 - 중회의실', '8층 - E2 - 소회의실', '8층 - W1 - 중회의실'] :
        ['8층 - E1 - 중회의실', '12층 - 대회의실', '10층 - 중회의실'];

    // 시간 슬롯 후보 생성 (다음 7일 동안)
    const timeSlots = [
        { time: '오전 9시', timeRaw: '09:00' },
        { time: '오전 10시', timeRaw: '10:00' },
        { time: '오전 11시', timeRaw: '11:00' },
        { time: '오후 2시', timeRaw: '14:00' },
        { time: '오후 3시', timeRaw: '15:00' },
        { time: '오후 4시', timeRaw: '16:00' }
    ];

    // "오늘" 키워드 확인
    const includesToday = userMessage.toLowerCase().includes('오늘');
    
    // 검색 시작일 설정 (오늘 포함 또는 내일부터)
    const startOffset = includesToday ? 0 : 1;
    const endOffset = includesToday ? 7 : 7; // 총 7일간 검색
    
    // 지정된 기간 동안 검색
    for (let dayOffset = startOffset; dayOffset <= endOffset; dayOffset++) {
        const targetDate = new Date(today);
        targetDate.setDate(targetDate.getDate() + dayOffset);
        const dateString = targetDate.toISOString().split('T')[0];

        // 주말 제외 (단, "오늘"이 주말이면 포함)
        if (targetDate.getDay() === 0 || targetDate.getDay() === 6) {
            if (!(includesToday && dayOffset === 0)) {
                continue;
            }
        }

        for (const room of rooms) {
            for (const slot of timeSlots) {
                // 오늘인 경우 현재 시간 이후만 포함
                if (dayOffset === 0) {
                    const now = new Date();
                    const currentHour = now.getHours();
                    const slotHour = parseInt(slot.timeRaw.split(':')[0]);
                    
                    // 현재 시간보다 이른 시간대는 제외
                    if (slotHour <= currentHour) {
                        continue;
                    }
                }
                
                // 회의실 충돌 검사
                if (isRoomConflict(room, dateString, slot.timeRaw, duration)) {
                    continue;
                }

                // 참석자 일정 충돌 검사
                if (hasAttendeeConflict(attendees, dateString, slot.timeRaw, duration)) {
                    continue;
                }

                // 가능한 옵션 추가
                options.push({
                    attendees: attendees,
                    room: room,
                    date: formatDateKorean(targetDate),
                    dateRaw: dateString,
                    time: slot.time,
                    timeRaw: slot.timeRaw,
                    duration: duration || '1시간',
                    available: true
                });

                // 최대 5개 옵션만 생성
                if (options.length >= 5) {
                    break;
                }
            }
            if (options.length >= 5) break;
        }
        if (options.length >= 5) break;
    }

    // 옵션이 없으면 샘플 옵션 생성 (충돌 무시)
    if (options.length === 0) {
        console.warn('사용 가능한 회의 시간을 찾을 수 없어 샘플 옵션을 제공합니다.');

        const option1Date = new Date(today);
        option1Date.setDate(option1Date.getDate() + 1);
        options.push({
            attendees: attendees,
            room: rooms[0],
            date: formatDateKorean(option1Date),
            dateRaw: option1Date.toISOString().split('T')[0],
            time: '오전 9시',
            timeRaw: '09:00',
            duration: duration || '1시간',
            available: true,
            warning: '일정 충돌 가능성 있음'
        });

        const option2Date = new Date(today);
        option2Date.setDate(option2Date.getDate() + 2);
        options.push({
            attendees: attendees,
            room: rooms[1] || rooms[0],
            date: formatDateKorean(option2Date),
            dateRaw: option2Date.toISOString().split('T')[0],
            time: '오후 2시',
            timeRaw: '14:00',
            duration: duration || '1시간',
            available: true,
            warning: '일정 충돌 가능성 있음'
        });
    }

    // 전역 변수에 저장 (confirmMeetingOption에서 사용)
    window.lastGeneratedMeetingOptions = options;
    window.lastMeetingTitle = parseMeetingTitle(userMessage);

    return options;
}

// 회의 제목 파싱
function parseMeetingTitle(userMessage) {
    const message = userMessage.toLowerCase();

    // 명시적인 제목 패턴들
    const titlePatterns = [
        /(.+?)\s*(회의|미팅).*$/,           // "프로젝트 회의할거야" -> "프로젝트"
        /(.+?)\s*에\s*대해\s*(회의|미팅)/,   // "신규 서비스에 대해 회의" -> "신규 서비스"
        /(.+?)\s*관련\s*(회의|미팅)/,       // "예산 관련 회의" -> "예산"
        /(.+?)\s*(회의실|미팅룸)/,          // "기획 회의실" -> "기획"
        /(.+?)\s*논의/,                    // "일정 논의할거야" -> "일정"
    ];

    // 제외할 단어들 (일반적인 단어들)
    const excludeWords = ['오늘', '내일', '모레', '이번', '다음', '주간', '월간',
                         '긴급', '중요', '간단', '빠른', '짧은', '긴', '층에서',
                         '에서', '에게', '와', '과', '랑', '이랑', '하고'];

    for (const pattern of titlePatterns) {
        const match = message.match(pattern);
        if (match && match[1]) {
            let title = match[1].trim();

            // 제외 단어들 제거
            const words = title.split(/\s+/);
            const filteredWords = words.filter(word => !excludeWords.includes(word));

            if (filteredWords.length > 0) {
                title = filteredWords.join(' ');
                // 첫 글자 대문자로 변환
                return title.charAt(0).toUpperCase() + title.slice(1) + ' 회의';
            }
        }
    }

    // 특별한 키워드 기반 제목 생성
    if (message.includes('프로젝트')) return '프로젝트 회의';
    if (message.includes('기획')) return '기획 회의';
    if (message.includes('개발')) return '개발 회의';
    if (message.includes('마케팅')) return '마케팅 회의';
    if (message.includes('영업')) return '영업 회의';
    if (message.includes('예산')) return '예산 회의';
    if (message.includes('전략')) return '전략 회의';
    if (message.includes('리뷰')) return '리뷰 회의';
    if (message.includes('점검')) return '점검 회의';
    if (message.includes('보고')) return '보고 회의';

    // 참석자가 있으면 참석자 기반 제목
    const attendees = parseAttendees(userMessage);
    if (attendees.length > 0) {
        return `${attendees.map(a => a.name).join(', ')} 회의`;
    }

    // 기본 제목
    return '팀 회의';
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

// 휴가 관련 요청 처리
function handleVacationRequest(userMessage) {
    const lowerMessage = userMessage.toLowerCase();

    // 휴가 관련 키워드 체크
    const vacationKeywords = ['휴가', '연차', '병가', '경조사', '가족돌봄', '남은 휴가', '휴가 내역', '휴가 현황'];
    const hasVacationKeyword = vacationKeywords.some(keyword => lowerMessage.includes(keyword));

    if (!hasVacationKeyword) {
        return null;
    }

    // 현재 사용자의 휴가 정보 가져오기
    if (!currentUser || !VacationManager) {
        return {
            message: '사용자 정보를 확인할 수 없습니다. 먼저 로그인해주세요.',
            vacationData: null,
            responsiblePerson: null
        };
    }

    const vacationData = VacationManager.getUserVacation(currentUser.id);
    if (!vacationData) {
        return {
            message: '휴가 정보를 찾을 수 없습니다. 인사팀에 문의해주세요.',
            vacationData: null,
            responsiblePerson: VacationManager.getResponsiblePerson()
        };
    }

    // 남은 휴가 계산
    const totalRemaining = VacationManager.getTotalRemaining(currentUser.id);

    // 응답 메시지 생성
    let responseMessage = '';

    if (lowerMessage.includes('남은') || lowerMessage.includes('잔여') || lowerMessage.includes('현황')) {
        responseMessage = `${currentUser.name}님의 2025년 남은 휴가는 총 ${totalRemaining}일입니다.\n\n` +
                         `연차 ${vacationData.annualLeave.remaining}일, 병가 ${vacationData.specialLeave.sick.remaining}일, ` +
                         `경조사 ${vacationData.specialLeave.congratulations.remaining}일, 가족돌봄 ${vacationData.specialLeave.family.remaining}일이 남아있습니다.`;

        if (vacationData.annualLeave.scheduled > 0) {
            responseMessage += `\n\n예정된 휴가가 ${vacationData.annualLeave.scheduled}일 있습니다.`;
        }
    } else if (lowerMessage.includes('사용') || lowerMessage.includes('내역')) {
        const usedTotal = vacationData.annualLeave.used +
                         vacationData.specialLeave.sick.used +
                         vacationData.specialLeave.congratulations.used +
                         vacationData.specialLeave.family.used;
        responseMessage = `${currentUser.name}님은 2025년에 총 ${usedTotal}일의 휴가를 사용하셨습니다.\n\n` +
                         `연차 ${vacationData.annualLeave.used}일, 병가 ${vacationData.specialLeave.sick.used}일, ` +
                         `경조사 ${vacationData.specialLeave.congratulations.used}일, 가족돌봄 ${vacationData.specialLeave.family.used}일을 사용하셨습니다.`;
    } else {
        // 기본 응답
        responseMessage = `${currentUser.name}님의 휴가 정보를 확인했습니다.\n` +
                         `2025년 기준 총 ${totalRemaining}일의 휴가가 남아있습니다.`;
    }

    return {
        message: responseMessage,
        vacationData: vacationData,
        responsiblePerson: VacationManager.getResponsiblePerson()
    };
}

// 회의 옵션 선택 확인
function confirmMeetingOption() {
    const selectedCard = document.querySelector('.meeting-option-card.selected');
    if (!selectedCard) {
        alert('먼저 회의 옵션을 선택해주세요.');
        return;
    }

    const optionIndex = parseInt(selectedCard.getAttribute('data-option-index'));

    // 저장된 회의 옵션 데이터 가져오기 (findAvailableMeetingSlots에서 생성된 데이터)
    const lastMeetingOptions = window.lastGeneratedMeetingOptions;
    if (!lastMeetingOptions || !lastMeetingOptions[optionIndex]) {
        alert('회의 옵션 데이터를 찾을 수 없습니다. 다시 시도해주세요.');
        return;
    }

    const selectedOption = lastMeetingOptions[optionIndex];

    // 회의 데이터 생성
    const meetingTitle = window.lastMeetingTitle || '팀 회의';
    const meetingData = {
        id: 'mtg-' + Date.now(),
        title: meetingTitle,
        date: selectedOption.dateRaw || new Date().toISOString().split('T')[0],
        startTime: selectedOption.timeRaw || selectedOption.time,
        endTime: calculateEndTime(selectedOption.timeRaw || selectedOption.time, selectedOption.duration || '1시간'),
        room: selectedOption.room,
        attendees: selectedOption.attendees.map(a => ({
            id: a.id,
            name: a.name,
            position: a.position
        })),
        createdBy: currentUser ? currentUser.id : 'unknown',
        createdAt: new Date().toISOString(),
        type: 'meeting',
        status: 'confirmed',
        description: '회의 예약 시스템을 통해 생성된 회의'
    };

    // 1. 캘린더에 회의 일정 저장
    saveMeetingToCalendar(meetingData);

    // 2. 회의실 예약 정보 저장
    saveRoomReservation(meetingData);

    // 3. 각 참석자의 개인 캘린더에 추가
    saveToAttendeesCalendar(meetingData);

    // 성공 메시지 생성
    const successMessage = `
✅ 회의 예약이 완료되었습니다!

📅 날짜: ${selectedOption.date}
⏰ 시간: ${selectedOption.time}
📍 장소: ${selectedOption.room}
👥 참석자: ${selectedOption.attendees.map(a => `${a.name} ${a.position}`).join(', ')}

각 참석자의 캘린더에 일정이 추가되었습니다.
회의실 예약도 완료되었습니다.`;

    // UI 업데이트
    renderAIMessage(successMessage);

    // 옵션 카드 제거
    const optionsContainer = document.querySelector('.meeting-options-container');
    if (optionsContainer) {
        optionsContainer.remove();
    }

    // ChatManager에 저장
    if (currentUser && currentChatId) {
        chatManager.addMessage(currentUser.id, currentChatId, 'ai', successMessage);
        updateChatHistory();
    }

    // 캘린더 새로고침
    if (typeof calendarManager !== 'undefined' && calendarManager) {
        calendarManager.loadSchedules();
        calendarManager.render();
        console.log('캘린더 새로고침 완료');
    }

    console.log('회의 예약 완료:', meetingData);
}

// 종료 시간 계산 함수
function calculateEndTime(startTime, duration) {
    const [hours, minutes] = startTime.split(':').map(Number);
    let endHours = hours;
    let endMinutes = minutes;

    if (duration === '30분') {
        endMinutes += 30;
    } else if (duration === '1시간') {
        endHours += 1;
    } else if (duration === '1시간 30분') {
        endHours += 1;
        endMinutes += 30;
    } else if (duration === '2시간') {
        endHours += 2;
    } else {
        endHours += 1; // 기본값 1시간
    }

    // 분이 60을 넘으면 시간으로 변환
    if (endMinutes >= 60) {
        endHours += Math.floor(endMinutes / 60);
        endMinutes = endMinutes % 60;
    }

    return `${String(endHours).padStart(2, '0')}:${String(endMinutes).padStart(2, '0')}`;
}

// 캘린더에 회의 저장
function saveMeetingToCalendar(meetingData) {
    // 기존 캘린더 데이터 가져오기
    let calendarEvents = [];
    const storedData = localStorage.getItem('calendarEvents');
    if (storedData) {
        try {
            calendarEvents = JSON.parse(storedData);
        } catch (e) {
            console.error('캘린더 데이터 파싱 오류:', e);
            calendarEvents = [];
        }
    }

    // 새 회의 추가
    const calendarEvent = {
        id: meetingData.id,
        date: meetingData.date,
        startTime: meetingData.startTime,
        endTime: meetingData.endTime,
        title: meetingData.title,
        type: 'meeting',
        location: meetingData.room,
        attendees: meetingData.attendees.map(a => a.name),
        description: meetingData.description,
        createdBy: meetingData.createdBy,
        createdAt: meetingData.createdAt
    };

    calendarEvents.push(calendarEvent);

    // localStorage에 저장
    localStorage.setItem('calendarEvents', JSON.stringify(calendarEvents));
    console.log('캘린더에 회의 저장됨:', calendarEvent);
}

// 회의실 예약 정보 저장
function saveRoomReservation(meetingData) {
    // 회의실 예약 데이터 가져오기
    let roomReservations = [];
    const storedData = localStorage.getItem('roomReservations');
    if (storedData) {
        try {
            roomReservations = JSON.parse(storedData);
        } catch (e) {
            console.error('회의실 예약 데이터 파싱 오류:', e);
            roomReservations = [];
        }
    }

    // 새 예약 추가
    const reservation = {
        id: 'res-' + Date.now(),
        meetingId: meetingData.id,
        room: meetingData.room,
        date: meetingData.date,
        startTime: meetingData.startTime,
        endTime: meetingData.endTime,
        reservedBy: meetingData.createdBy,
        reservedAt: meetingData.createdAt,
        attendees: meetingData.attendees,
        status: 'confirmed'
    };

    roomReservations.push(reservation);

    // localStorage에 저장
    localStorage.setItem('roomReservations', JSON.stringify(roomReservations));
    console.log('회의실 예약 저장됨:', reservation);
}

// 회의실 충돌 검사
function isRoomConflict(room, date, startTime, duration) {
    try {
        // 회의실 예약 데이터 가져오기
        const roomReservations = JSON.parse(localStorage.getItem('roomReservations') || '[]');

        // 새 회의의 종료 시간 계산
        const newEndTime = calculateEndTime(startTime, duration);

        // 같은 날짜, 같은 회의실 예약들과 비교
        for (const reservation of roomReservations) {
            if (reservation.room === room && reservation.date === date && reservation.status === 'confirmed') {
                // 시간 겹침 검사
                if (isTimeOverlap(startTime, newEndTime, reservation.startTime, reservation.endTime)) {
                    console.log(`회의실 충돌 감지: ${room}, ${date} ${startTime}-${newEndTime} vs ${reservation.startTime}-${reservation.endTime}`);
                    return true;
                }
            }
        }

        return false;
    } catch (e) {
        console.error('회의실 충돌 검사 오류:', e);
        return false; // 오류 시 충돌 없음으로 간주
    }
}

// 참석자 일정 충돌 검사
function hasAttendeeConflict(attendees, date, startTime, duration) {
    try {
        // 새 회의의 종료 시간 계산
        const newEndTime = calculateEndTime(startTime, duration);

        // 전체 캘린더 데이터 가져오기
        const calendarData = getCalendarData();

        // 각 참석자별로 일정 충돌 검사
        for (const attendee of attendees) {
            // 해당 날짜의 모든 회의 찾기
            const conflictMeetings = calendarData.filter(event =>
                event.date === date &&
                event.type === 'meeting' &&
                event.attendees.includes(attendee.name)
            );

            // 시간 겹침 검사
            for (const meeting of conflictMeetings) {
                if (isTimeOverlap(startTime, newEndTime, meeting.startTime, meeting.endTime)) {
                    console.log(`참석자 일정 충돌 감지: ${attendee.name}, ${date} ${startTime}-${newEndTime} vs ${meeting.startTime}-${meeting.endTime} (${meeting.title})`);
                    return true;
                }
            }

            // 개인 캘린더 데이터도 확인
            const personalCalendar = JSON.parse(localStorage.getItem(`calendar_${attendee.id}`) || '[]');
            for (const event of personalCalendar) {
                if (event.date === date && event.type === 'meeting') {
                    if (isTimeOverlap(startTime, newEndTime, event.startTime, event.endTime)) {
                        console.log(`참석자 개인 일정 충돌 감지: ${attendee.name}, ${date} ${startTime}-${newEndTime} vs ${event.startTime}-${event.endTime} (${event.title})`);
                        return true;
                    }
                }
            }
        }

        return false;
    } catch (e) {
        console.error('참석자 일정 충돌 검사 오류:', e);
        return false; // 오류 시 충돌 없음으로 간주
    }
}

// 시간 겹침 검사
function isTimeOverlap(start1, end1, start2, end2) {
    // 시간 문자열을 분으로 변환
    const toMinutes = (timeStr) => {
        const [hours, minutes] = timeStr.split(':').map(Number);
        return hours * 60 + minutes;
    };

    const start1Min = toMinutes(start1);
    const end1Min = toMinutes(end1);
    const start2Min = toMinutes(start2);
    const end2Min = toMinutes(end2);

    // 겹침 검사: 한 회의의 시작이 다른 회의의 끝보다 이전이고, 끝이 다른 회의의 시작보다 이후면 겹침
    return start1Min < end2Min && end1Min > start2Min;
}

// 참석자별 캘린더에 저장
function saveToAttendeesCalendar(meetingData) {
    // 각 참석자의 개인 캘린더 데이터 저장
    meetingData.attendees.forEach(attendee => {
        const storageKey = `calendar_${attendee.id}`;
        let personalCalendar = [];

        // 기존 개인 캘린더 데이터 가져오기
        const storedData = localStorage.getItem(storageKey);
        if (storedData) {
            try {
                personalCalendar = JSON.parse(storedData);
            } catch (e) {
                console.error(`${attendee.name}의 캘린더 데이터 파싱 오류:`, e);
                personalCalendar = [];
            }
        }

        // 개인 캘린더 이벤트 추가
        const personalEvent = {
            id: meetingData.id,
            date: meetingData.date,
            startTime: meetingData.startTime,
            endTime: meetingData.endTime,
            title: meetingData.title,
            type: 'meeting',
            location: meetingData.room,
            attendees: meetingData.attendees.map(a => a.name),
            description: meetingData.description,
            addedAt: new Date().toISOString()
        };

        personalCalendar.push(personalEvent);

        // 개인 캘린더에 저장
        localStorage.setItem(storageKey, JSON.stringify(personalCalendar));
        console.log(`${attendee.name}의 캘린더에 저장됨:`, personalEvent);
    });

    // 참석 알림 데이터 생성 (선택적)
    const notifications = meetingData.attendees.map(attendee => ({
        userId: attendee.id,
        type: 'meeting_invitation',
        title: '새로운 회의 일정',
        message: `${meetingData.date} ${meetingData.startTime}에 ${meetingData.room}에서 회의가 있습니다.`,
        meetingId: meetingData.id,
        createdAt: new Date().toISOString(),
        read: false
    }));

    // 알림 저장
    let allNotifications = [];
    const storedNotifications = localStorage.getItem('notifications');
    if (storedNotifications) {
        try {
            allNotifications = JSON.parse(storedNotifications);
        } catch (e) {
            console.error('알림 데이터 파싱 오류:', e);
            allNotifications = [];
        }
    }

    allNotifications.push(...notifications);
    localStorage.setItem('notifications', JSON.stringify(allNotifications));
    console.log('참석자 알림 생성됨:', notifications);
}

// 상태카드 요청 처리
function handleStatusCardRequest(userMessage) {
    const lowerMessage = userMessage.toLowerCase();

    // 상태카드 관련 키워드 - 특정 프로젝트명 추가
    const statusKeywords = ['상태카드', '프로젝트', '진행상황', '업무 상황', '프로젝트 상태', '업무 진행', '진행 상태'];
    const specificProjects = ['나의 보험 계약', '청약철회', '사고보험금 대리청구', '사고보험금'];

    const hasStatusKeyword = statusKeywords.some(keyword => lowerMessage.includes(keyword));
    const hasSpecificProject = specificProjects.some(project => lowerMessage.includes(project));

    if (!hasStatusKeyword && !hasSpecificProject) {
        return null;
    }

    // 특정 조건 파싱
    let filteredCards = STATUS_CARDS;
    let responseMessage = '현재 진행 중인 프로젝트 상태카드를 보여드리겠습니다.';

    // 특정 프로젝트명으로 검색
    if (lowerMessage.includes('상태카드') && !lowerMessage.includes('모든')) {
        // '상태카드' 프로젝트를 구체적으로 찾기
        const statusCardProject = STATUS_CARDS.find(card => card.title === '상태카드');
        if (statusCardProject) {
            filteredCards = [statusCardProject];
            responseMessage = '상태카드 프로젝트 정보입니다.';
        }
    } else if (lowerMessage.includes('나의 보험 계약') || lowerMessage.includes('나의보험계약')) {
        const insuranceProject = STATUS_CARDS.find(card => card.title === '나의 보험 계약');
        if (insuranceProject) {
            filteredCards = [insuranceProject];
            responseMessage = '나의 보험 계약 프로젝트 정보입니다.';
        }
    } else if (lowerMessage.includes('청약철회') || lowerMessage.includes('청약 철회')) {
        const withdrawProject = STATUS_CARDS.find(card => card.title === '청약철회');
        if (withdrawProject) {
            filteredCards = [withdrawProject];
            responseMessage = '청약철회 프로젝트 정보입니다.';
        }
    } else if (lowerMessage.includes('사고보험금') || lowerMessage.includes('대리청구')) {
        const claimProject = STATUS_CARDS.find(card => card.title === '사고보험금 대리청구');
        if (claimProject) {
            filteredCards = [claimProject];
            responseMessage = '사고보험금 대리청구 프로젝트 정보입니다.';
        }
    }

    // 특정 사람 관련 카드 검색
    const memberNames = ['김동준', '정준하', '박명수', '이서연', '박준혁', '이정은', '하동훈', '이상태', '정보험', '김철회', '박보험금'];
    const mentionedMember = memberNames.find(name => userMessage.includes(name));
    if (mentionedMember && filteredCards.length > 1) {
        filteredCards = getStatusCardsByMember(mentionedMember);
        responseMessage = `${mentionedMember}님이 참여하고 있는 프로젝트 상태카드입니다.`;
    }

    // 상태별 필터링
    if (lowerMessage.includes('완료') || lowerMessage.includes('끝난')) {
        filteredCards = getStatusCardsByStatus('완료');
        responseMessage = '완료된 프로젝트 상태카드입니다.';
    } else if (lowerMessage.includes('긴급') || lowerMessage.includes('급한')) {
        filteredCards = getStatusCardsByStatus('긴급');
        responseMessage = '긴급한 프로젝트 상태카드입니다.';
    } else if (lowerMessage.includes('대기')) {
        filteredCards = getStatusCardsByStatus('대기');
        responseMessage = '대기 중인 프로젝트 상태카드입니다.';
    } else if (lowerMessage.includes('진행')) {
        filteredCards = getStatusCardsByStatus('진행중');
        responseMessage = '현재 진행 중인 프로젝트 상태카드입니다.';
    }

    return {
        message: responseMessage,
        cards: filteredCards.slice(0, 5) // 최대 5개까지만 표시
    };
}

// 상태카드 렌더링
function renderStatusCards(response) {
    if (response.cards.length === 0) {
        renderAIMessage('해당하는 프로젝트를 찾을 수 없습니다.');
        // 담당자 카드 추가 (프로젝트 관련)
        const pmPerson = {
            id: 'user-004',
            name: '박명수',
            position: '차장',
            department: '프로젝트관리팀',
            email: 'myungsoo.park@hanwhalife.com',
            phone: '010-3456-7890',
            extension: '1234'
        };
        const responsibleCard = createResponsibleCard(pmPerson);
        chatMessages.insertAdjacentHTML('beforeend', responsibleCard);
        return;
    }

    // 텍스트 형태로 프로젝트 정보 생성
    let detailedInfo = response.message + '\n\n';

    response.cards.forEach(card => {
        detailedInfo += `📋 **${card.title}**\n`;
        detailedInfo += `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n`;

        detailedInfo += `📌 기본 정보\n`;
        detailedInfo += `• 상태: ${card.status} (진행률: ${card.progress}%)\n`;
        detailedInfo += `• 기간: ${card.startDate} ~ ${card.endDate}\n`;
        detailedInfo += `• 부서: ${card.department}\n`;
        detailedInfo += `• 최종 업데이트: ${card.lastUpdated}\n\n`;

        detailedInfo += `📝 프로젝트 설명\n`;
        detailedInfo += `${card.description}\n\n`;

        detailedInfo += `👥 프로젝트 팀\n`;
        detailedInfo += `• 책임자: ${card.manager.name} ${card.manager.position} (${card.manager.email})\n`;
        detailedInfo += `• 팀원:\n`;
        card.members.forEach(member => {
            detailedInfo += `  - ${member.name} ${member.position}: ${member.role}\n`;
        });
        detailedInfo += `\n`;

        detailedInfo += `✅ 주요 업무 현황\n`;
        card.keyTasks.forEach(task => {
            let statusIcon = task.status === 'completed' ? '✓' :
                           task.status === 'in-progress' ? '●' : '○';
            let statusText = task.status === 'completed' ? '완료' :
                           task.status === 'in-progress' ? '진행중' : '대기';
            detailedInfo += `${statusIcon} ${task.task} [${statusText}]\n`;
        });
        detailedInfo += `\n`;

        if (card.nextMilestone) {
            detailedInfo += `🎯 다음 마일스톤\n`;
            detailedInfo += `${card.nextMilestone}\n\n`;
        }

        detailedInfo += `\n`;
    });

    // 텍스트를 HTML로 변환하여 렌더링
    const formattedMessage = detailedInfo
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        .replace(/━+/g, '<hr style="border: none; border-top: 1px solid #e0e0e0; margin: 10px 0;">')
        .replace(/\n/g, '<br>')
        .replace(/•/g, '&bull;')
        .replace(/✓/g, '<span style="color: #4CAF50;">✓</span>')
        .replace(/●/g, '<span style="color: #FA6600;">●</span>')
        .replace(/○/g, '<span style="color: #999;">○</span>')
        .replace(/📋/g, '<span style="font-size: 1.2em;">📋</span>')
        .replace(/📌/g, '<span style="color: #FA6600;">📌</span>')
        .replace(/📝/g, '<span style="color: #2196F3;">📝</span>')
        .replace(/👥/g, '<span style="color: #9C27B0;">👥</span>')
        .replace(/✅/g, '<span style="color: #4CAF50;">✅</span>')
        .replace(/🎯/g, '<span style="color: #FF5722;">🎯</span>');

    renderAIMessage(formattedMessage);

    // 프로젝트 담당자 카드 추가
    const pmPerson = {
        id: 'user-004',
        name: '박명수',
        position: '차장',
        department: '프로젝트관리팀',
        email: 'myungsoo.park@hanwhalife.com',
        phone: '010-3456-7890',
        extension: '1234'
    };
    const responsibleCard = createResponsibleCard(pmPerson);
    if (chatMessages) {
        chatMessages.insertAdjacentHTML('beforeend', responsibleCard);
    }

    // 모든 콘텐츠 렌더링 후 스크롤
    setTimeout(() => {
        scrollToBottom();
    }, 300);

    // ChatManager에 저장
    if (currentUser && currentChatId) {
        chatManager.addMessage(currentUser.id, currentChatId, 'ai', response.message);
        updateChatHistory();
    }
}

// 상태카드 HTML 생성
function createStatusCardHTML(card) {
    const statusClass = card.statusType === 'in-progress' ? 'status-in-progress' :
                       card.statusType === 'completed' ? 'status-completed' :
                       card.statusType === 'urgent' ? 'status-urgent' :
                       'status-pending';

    const statusText = card.status === '진행중' ? '진행중' :
                      card.status === '완료' ? '완료' :
                      card.status === '긴급' ? '긴급' :
                      '대기';

    const badgeClass = card.statusType;

    // 주요 업무 중 최대 3개만 표시
    const displayTasks = card.keyTasks.slice(0, 3);

    return `
        <div class="status-card ${statusClass}" onclick="showStatusCardDetail('${card.id}')">
            <div class="status-card-header">
                <div>
                    <h3 class="status-card-title">${card.title}</h3>
                    <div class="status-card-meta">
                        <span class="status-card-meta-item">
                            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                                <path d="M7 2v5l3 3" stroke="#666" stroke-width="1.5" stroke-linecap="round"/>
                                <circle cx="7" cy="7" r="5" stroke="#666" stroke-width="1.5"/>
                            </svg>
                            ${card.startDate} ~ ${card.endDate}
                        </span>
                        <span class="status-card-meta-item">
                            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                                <rect x="2" y="4" width="10" height="8" rx="1" stroke="#666" stroke-width="1.5"/>
                                <path d="M5 2v2M9 2v2" stroke="#666" stroke-width="1.5" stroke-linecap="round"/>
                            </svg>
                            ${card.department}
                        </span>
                    </div>
                </div>
                <span class="status-badge ${badgeClass}">${statusText}</span>
            </div>
            
            <p class="status-card-description">${card.description}</p>
            
            <div class="status-progress-container">
                <div class="status-progress-label">
                    <span>진행률</span>
                    <span>${card.progress}%</span>
                </div>
                <div class="status-progress-bar">
                    <div class="status-progress-fill" style="width: ${card.progress}%"></div>
                </div>
            </div>
            
            <div class="status-card-members">
                <div class="status-card-section-title">프로젝트 관리자 및 팀원</div>
                <div class="status-members-list">
                    <span class="status-member-chip manager">${card.manager.name} ${card.manager.position}</span>
                    ${card.members.slice(0, 3).map(member => 
                        `<span class="status-member-chip">${member.name} ${member.position}</span>`
                    ).join('')}
                    ${card.members.length > 3 ? `<span class="status-member-chip">+${card.members.length - 3}명</span>` : ''}
                </div>
            </div>
            
            <div class="status-card-tasks">
                <div class="status-card-section-title">주요 업무</div>
                <div class="status-task-list">
                    ${displayTasks.map(task => `
                        <div class="status-task-item">
                            <span class="status-task-icon ${task.status}"></span>
                            <span>${task.task}</span>
                        </div>
                    `).join('')}
                    ${card.keyTasks.length > 3 ? 
                        `<div class="status-task-item" style="color: #999; font-size: 12px;">
                            ... 외 ${card.keyTasks.length - 3}개 업무
                        </div>` : ''}
                </div>
            </div>
            
            <div class="status-card-footer">
                <span class="status-milestone">다음 마일스톤: ${card.nextMilestone}</span>
                <span class="status-last-updated">최종 업데이트: ${card.lastUpdated}</span>
            </div>
        </div>
    `;
}

// 상태카드 상세 보기
function showStatusCardDetail(cardId) {
    const card = STATUS_CARDS.find(c => c.id === cardId);
    if (card) {
        renderAIMessage(`${card.title} 프로젝트의 상세 정보를 보여드리겠습니다.`);

        const detailMessage = `
📋 프로젝트명: ${card.title}
📅 기간: ${card.startDate} ~ ${card.endDate}
🏢 담당부서: ${card.department}
👤 관리자: ${card.manager.name} ${card.manager.position}
📊 진행률: ${card.progress}%

📝 프로젝트 설명:
${card.description}

👥 참여 인원:
${card.members.map(m => `- ${m.name} ${m.position} (${m.role})`).join('\n')}

✅ 주요 업무 현황:
${card.keyTasks.map(t => `- ${t.task}: ${t.status === 'completed' ? '✅ 완료' : t.status === 'in-progress' ? '🔄 진행중' : '⏳ 대기'}`).join('\n')}

🎯 다음 마일스톤: ${card.nextMilestone}
`;

        renderAIMessage(detailMessage);
    }
}

// 캘린더 데이터 가져오기
function getCalendarData() {
    // localStorage에서 캘린더 데이터 가져오기
    const storedData = localStorage.getItem('calendarEvents');
    let calendarEvents = [];

    if (storedData) {
        try {
            calendarEvents = JSON.parse(storedData);
        } catch (e) {
            console.error('캘린더 데이터 파싱 오류:', e);
            calendarEvents = [];
        }
    }

    // 저장된 데이터가 없으면 샘플 데이터로 초기화 (한 번만)
    if (calendarEvents.length === 0) {
        const today = new Date().toISOString().split('T')[0];
        const sampleData = [
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

        // 샘플 데이터를 localStorage에 저장 (첫 번째 로드 시에만)
        try {
            localStorage.setItem('calendarEvents', JSON.stringify(sampleData));
            calendarEvents = sampleData;
            console.log('샘플 캘린더 데이터 초기화됨');
        } catch (e) {
            console.error('샘플 데이터 저장 실패:', e);
            calendarEvents = sampleData;
        }
    }

    return calendarEvents;
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
    // 채팅 메시지 영역이 표시된 경우에만 스크롤
    if (chatMessages && chatMessages.style.display !== 'none') {
        // scrollHeight를 정확히 얻기 위해 약간의 지연 추가
        requestAnimationFrame(() => {
            chatMessages.scrollTop = chatMessages.scrollHeight;

            // 스크롤이 제대로 되지 않은 경우를 위한 추가 시도
            setTimeout(() => {
                chatMessages.scrollTop = chatMessages.scrollHeight;
            }, 50);
        });
    }
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


// 로컬 스토리지를 사용한 데이터 관리
class DataManager {
    constructor() {
        this.dataKey = 'aiAssistantData';
        this.initializeData();
    }

    initializeData() {
        // 초기 데이터가 없으면 생성
        const existingData = storageManager.get(this.dataKey);
        if (!existingData) {
            const initialData = {
                activities: [],
                stats: {
                    tasksCompleted: 0,
                    timesSaved: 0,
                    documentsCreated: 0,
                    chatSessions: 0
                },
                chats: [],
                documents: [],
                schedules: []
            };
            storageManager.set(this.dataKey, initialData);
        }
    }

    getData() {
        return storageManager.get(this.dataKey, {
            activities: [],
            stats: {
                tasksCompleted: 0,
                timesSaved: 0,
                documentsCreated: 0,
                chatSessions: 0
            },
            chats: [],
            documents: [],
            schedules: []
        });
    }

    saveData(data) {
        return storageManager.set(this.dataKey, data);
    }

    addActivity(activity) {
        const data = this.getData();
        activity.id = Date.now();
        activity.timestamp = new Date().toISOString();
        data.activities.unshift(activity);
        // 최근 20개만 유지
        if (data.activities.length > 20) {
            data.activities = data.activities.slice(0, 20);
        }
        this.saveData(data);
    }

    updateStats(statName, increment = 1) {
        const data = this.getData();
        if (data.stats[statName] !== undefined) {
            data.stats[statName] += increment;
            this.saveData(data);
        }
    }

    getRecentActivities(limit = 6) {
        const data = this.getData();
        return data.activities.slice(0, limit);
    }
}

// 전역 데이터 매니저 인스턴스
const dataManager = new DataManager();

// 홈페이지 초기화
function initHomePage() {
    loadRecentActivities();
    loadStats();
    
    // 샘플 데이터 추가 (첫 방문시)
    if (dataManager.getData().activities.length === 0) {
        addSampleActivities();
        addSampleStats();
    }
}

// 최근 활동 로드
function loadRecentActivities() {
    const activitiesContainer = document.getElementById('recentActivities');
    if (!activitiesContainer) return;

    const activities = dataManager.getRecentActivities();
    
    if (activities.length === 0) {
        activitiesContainer.innerHTML = '<p style="color: white; text-align: center;">아직 활동 기록이 없습니다.</p>';
        return;
    }

    activitiesContainer.innerHTML = activities.map(activity => `
        <div class="activity-item">
            <div class="activity-header">
                <div class="activity-icon ${activity.type}">
                    <i class="${getActivityIcon(activity.type)}"></i>
                </div>
                <div>
                    <div class="activity-title">${activity.title}</div>
                    <div class="activity-time">${formatTime(activity.timestamp)}</div>
                </div>
            </div>
            <div class="activity-description">${activity.description}</div>
        </div>
    `).join('');
}

// 통계 로드
function loadStats() {
    const data = dataManager.getData();
    
    Object.keys(data.stats).forEach(key => {
        const element = document.getElementById(key);
        if (element) {
            element.textContent = data.stats[key];
        }
    });
}

// 활동 아이콘 가져오기
function getActivityIcon(type) {
    const icons = {
        chat: 'fas fa-comments',
        document: 'fas fa-file-alt',
        schedule: 'fas fa-calendar',
        analysis: 'fas fa-chart-line'
    };
    return icons[type] || 'fas fa-circle';
}

// 시간 포맷팅
function formatTime(timestamp) {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now - date;
    
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);
    
    if (minutes < 1) return '방금 전';
    if (minutes < 60) return `${minutes}분 전`;
    if (hours < 24) return `${hours}시간 전`;
    if (days < 7) return `${days}일 전`;
    
    return date.toLocaleDateString('ko-KR');
}

// 샘플 활동 추가
function addSampleActivities() {
    const sampleActivities = [
        {
            type: 'chat',
            title: 'AI 비서와 대화',
            description: '프로젝트 계획에 대해 논의했습니다.'
        },
        {
            type: 'document',
            title: '보고서 작성',
            description: '월간 실적 보고서를 생성했습니다.'
        },
        {
            type: 'schedule',
            title: '일정 추가',
            description: '다음 주 회의 일정을 등록했습니다.'
        },
        {
            type: 'analysis',
            title: '데이터 분석',
            description: '판매 데이터 트렌드를 분석했습니다.'
        }
    ];
    
    sampleActivities.forEach(activity => {
        dataManager.addActivity(activity);
    });
}

// 샘플 통계 추가
function addSampleStats() {
    dataManager.updateStats('tasksCompleted', 12);
    dataManager.updateStats('timesSaved', 145);
    dataManager.updateStats('documentsCreated', 8);
    dataManager.updateStats('chatSessions', 23);
}

// 데이터 분석 보기
function showAnalysis() {
    alert('데이터 분석 기능은 준비 중입니다.');
}

// 채팅 페이지 함수들
let currentChatId = null;

function initChatPage() {
    loadChatList();
    setupChatInput();
}

function loadChatList() {
    const chatList = document.querySelector('.chat-list');
    if (!chatList) return;
    
    const data = dataManager.getData();
    
    if (data.chats.length === 0) {
        // 새 채팅 생성
        createNewChat();
    } else {
        chatList.innerHTML = data.chats.map(chat => `
            <div class="chat-item ${chat.id === currentChatId ? 'active' : ''}" onclick="selectChat(${chat.id})">
                <div style="font-weight: 600;">${chat.title}</div>
                <div style="font-size: 0.9rem; color: var(--text-light);">${formatTime(chat.lastUpdated)}</div>
            </div>
        `).join('');
        
        // 첫 번째 채팅 선택
        if (!currentChatId && data.chats.length > 0) {
            selectChat(data.chats[0].id);
        }
    }
}

function createNewChat() {
    const data = dataManager.getData();
    const newChat = {
        id: Date.now(),
        title: `새 대화 ${data.chats.length + 1}`,
        messages: [],
        lastUpdated: new Date().toISOString()
    };
    
    data.chats.unshift(newChat);
    dataManager.saveData(data);
    currentChatId = newChat.id;
    loadChatList();
    loadChatMessages();
}

function selectChat(chatId) {
    currentChatId = chatId;
    loadChatList();
    loadChatMessages();
}

function loadChatMessages() {
    const messagesContainer = document.querySelector('.chat-messages');
    if (!messagesContainer) return;
    
    const data = dataManager.getData();
    const chat = data.chats.find(c => c.id === currentChatId);
    
    if (!chat || chat.messages.length === 0) {
        messagesContainer.innerHTML = '<div style="text-align: center; color: var(--text-light);">대화를 시작해보세요!</div>';
        return;
    }
    
    messagesContainer.innerHTML = chat.messages.map(msg => `
        <div class="message ${msg.sender}">
            ${msg.content}
        </div>
    `).join('');
    
    // 스크롤을 맨 아래로
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

function setupChatInput() {
    const input = document.querySelector('.chat-input');
    const button = document.querySelector('.send-button');
    
    if (!input || !button) return;
    
    const sendMessage = () => {
        const message = input.value.trim();
        if (!message) return;
        
        // 사용자 메시지 추가
        addMessage('user', message);
        input.value = '';
        
        // AI 응답 시뮬레이션
        setTimeout(() => {
            const aiResponse = generateAIResponse(message);
            addMessage('ai', aiResponse);
        }, 1000);
    };
    
    button.addEventListener('click', sendMessage);
    input.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            sendMessage();
        }
    });
}

function addMessage(sender, content) {
    const data = dataManager.getData();
    const chat = data.chats.find(c => c.id === currentChatId);
    
    if (!chat) return;
    
    chat.messages.push({
        sender,
        content,
        timestamp: new Date().toISOString()
    });
    
    chat.lastUpdated = new Date().toISOString();
    
    // 첫 메시지면 제목 업데이트
    if (chat.messages.length === 1) {
        chat.title = content.substring(0, 30) + (content.length > 30 ? '...' : '');
    }
    
    dataManager.saveData(data);
    loadChatMessages();
    
    // 통계 업데이트
    if (sender === 'user') {
        dataManager.updateStats('chatSessions', 1);
    }
}

function generateAIResponse(userMessage) {
    const responses = {
        '안녕': '안녕하세요! 무엇을 도와드릴까요?',
        '도움': '제가 도와드릴 수 있는 것들:\n• 문서 작성 및 편집\n• 일정 관리\n• 데이터 분석\n• 정보 검색',
        '날씨': '죄송합니다. 실시간 날씨 정보는 제공하지 못합니다. 날씨 앱을 확인해주세요.',
        '시간': `현재 시간은 ${new Date().toLocaleTimeString('ko-KR')}입니다.`,
        default: '네, 이해했습니다. 어떻게 도와드릴까요?'
    };
    
    // 간단한 키워드 매칭
    for (const [keyword, response] of Object.entries(responses)) {
        if (userMessage.includes(keyword)) {
            return response;
        }
    }
    
    return responses.default;
}

// 페이지 로드시 초기화
document.addEventListener('DOMContentLoaded', () => {
    const path = window.location.pathname;
    
    if (path.includes('index.html') || path === '/' || path === '') {
        initHomePage();
    } else if (path.includes('chat.html')) {
        initChatPage();
    }
    
    // 네비게이션 활성 상태 업데이트
    updateNavigation();
});

// 네비게이션 업데이트
function updateNavigation() {
    const currentPath = window.location.pathname.split('/').pop() || 'index.html';
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
        const href = link.getAttribute('href');
        if (href === currentPath) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });
}
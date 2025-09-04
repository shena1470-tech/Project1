// 대화 히스토리 관리 모듈

class ChatManager {
    constructor() {
        this.chatHistory = {};
        this.currentChatId = null;
        this.dataUrl = 'data/chat-history.json';
        this.storageKey = 'hanwha_chat_history';
        this.init();
    }

    // 초기화
    async init() {
        await this.loadChatHistory();
    }

    // 채팅 히스토리 로드 (파일 또는 localStorage)
    async loadChatHistory() {
        try {
            // StorageManager를 통해 로드
            const data = storageManager.getChatHistory();
            if (data && data.chatHistory) {
                this.chatHistory = data.chatHistory;
                return;
            }

            // 파일에서 로드
            const response = await fetch(this.dataUrl);
            if (response.ok) {
                const data = await response.json();
                this.chatHistory = data.chatHistory || {};
                this.saveChatHistory(); // localStorage에 저장
            }
        } catch (error) {
            console.error('채팅 히스토리 로드 실패:', error);
            this.chatHistory = {};
        }
    }

    // 채팅 히스토리 저장 (localStorage)
    saveChatHistory() {
        try {
            const data = {
                chatHistory: this.chatHistory,
                metadata: {
                    version: '1.0.0',
                    lastUpdated: new Date().toISOString(),
                    totalChats: this.getTotalChatsCount(),
                    totalUsers: Object.keys(this.chatHistory).length
                }
            };
            storageManager.setChatHistory(data);
        } catch (error) {
            console.error('채팅 히스토리 저장 실패:', error);
        }
    }

    // 새 채팅 세션 생성
    createNewChat(userId, title = null) {
        if (!userId) return null;

        const chatId = this.generateChatId();
        const now = new Date().toISOString();
        
        const newChat = {
            id: chatId,
            title: title || '새 대화',
            createdAt: now,
            lastUpdated: now,
            messages: []
        };

        // 사용자별 채팅 배열이 없으면 생성
        if (!this.chatHistory[userId]) {
            this.chatHistory[userId] = [];
        }

        // 새 채팅을 맨 앞에 추가 (최신순)
        this.chatHistory[userId].unshift(newChat);
        this.currentChatId = chatId;
        this.saveChatHistory();

        return chatId;
    }

    // 메시지 추가
    addMessage(userId, chatId, type, text) {
        if (!userId || !chatId) return null;

        const userChats = this.chatHistory[userId];
        if (!userChats) return null;

        const chat = userChats.find(c => c.id === chatId);
        if (!chat) return null;

        const messageId = this.generateMessageId();
        const message = {
            id: messageId,
            type: type, // 'user' or 'ai'
            text: text,
            timestamp: new Date().toISOString()
        };

        chat.messages.push(message);
        chat.lastUpdated = message.timestamp;

        // 첫 번째 사용자 메시지로 제목 자동 생성
        if (type === 'user' && chat.messages.length === 1) {
            chat.title = this.generateChatTitle(text);
        }

        this.saveChatHistory();
        return messageId;
    }

    // 사용자의 모든 채팅 가져오기
    getUserChats(userId) {
        if (!userId) return [];
        return this.chatHistory[userId] || [];
    }

    // 특정 채팅 가져오기
    getChat(userId, chatId) {
        const userChats = this.getUserChats(userId);
        return userChats.find(c => c.id === chatId) || null;
    }

    // 채팅 삭제
    deleteChat(userId, chatId) {
        if (!userId || !chatId) return false;

        const userChats = this.chatHistory[userId];
        if (!userChats) return false;

        const index = userChats.findIndex(c => c.id === chatId);
        if (index === -1) return false;

        userChats.splice(index, 1);
        this.saveChatHistory();
        return true;
    }

    // 모든 사용자의 채팅 삭제
    clearUserChats(userId) {
        if (!userId) return false;
        
        this.chatHistory[userId] = [];
        this.saveChatHistory();
        return true;
    }

    // 채팅 제목 수정
    updateChatTitle(userId, chatId, newTitle) {
        const chat = this.getChat(userId, chatId);
        if (!chat) return false;

        chat.title = newTitle;
        chat.lastUpdated = new Date().toISOString();
        this.saveChatHistory();
        return true;
    }

    // 채팅 검색
    searchChats(userId, query) {
        if (!userId || !query) return [];
        
        const userChats = this.getUserChats(userId);
        const lowercaseQuery = query.toLowerCase();
        
        return userChats.filter(chat => {
            // 제목에서 검색
            if (chat.title.toLowerCase().includes(lowercaseQuery)) {
                return true;
            }
            
            // 메시지에서 검색
            return chat.messages.some(msg => 
                msg.text.toLowerCase().includes(lowercaseQuery)
            );
        });
    }

    // 최근 채팅 가져오기
    getRecentChats(userId, limit = 10) {
        const userChats = this.getUserChats(userId);
        // 이미 최신순으로 정렬되어 있음
        return userChats.slice(0, limit);
    }

    // 채팅 통계 가져오기
    getUserStats(userId) {
        const userChats = this.getUserChats(userId);
        
        let totalMessages = 0;
        let userMessages = 0;
        let aiMessages = 0;

        userChats.forEach(chat => {
            chat.messages.forEach(msg => {
                totalMessages++;
                if (msg.type === 'user') {
                    userMessages++;
                } else if (msg.type === 'ai') {
                    aiMessages++;
                }
            });
        });

        return {
            totalChats: userChats.length,
            totalMessages: totalMessages,
            userMessages: userMessages,
            aiMessages: aiMessages,
            firstChatDate: userChats.length > 0 ? 
                userChats[userChats.length - 1].createdAt : null,
            lastChatDate: userChats.length > 0 ? 
                userChats[0].lastUpdated : null
        };
    }

    // 채팅 ID 생성
    generateChatId() {
        return 'chat-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9);
    }

    // 메시지 ID 생성
    generateMessageId() {
        return 'msg-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9);
    }

    // 채팅 제목 자동 생성 (첫 메시지 기반)
    generateChatTitle(firstMessage) {
        if (!firstMessage) return '새 대화';
        
        // 메시지가 너무 길면 잘라내기
        const maxLength = 50;
        if (firstMessage.length > maxLength) {
            return firstMessage.substring(0, maxLength) + '...';
        }
        return firstMessage;
    }

    // 전체 채팅 수 계산
    getTotalChatsCount() {
        let total = 0;
        Object.values(this.chatHistory).forEach(userChats => {
            total += userChats.length;
        });
        return total;
    }

    // 채팅 내보내기 (JSON)
    exportUserChats(userId) {
        const userChats = this.getUserChats(userId);
        const data = {
            userId: userId,
            exportDate: new Date().toISOString(),
            chats: userChats
        };
        
        const blob = new Blob([JSON.stringify(data, null, 2)], 
            { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        
        const a = document.createElement('a');
        a.href = url;
        a.download = `chat-history-${userId}-${Date.now()}.json`;
        a.click();
        
        URL.revokeObjectURL(url);
    }

    // 채팅 가져오기 (JSON)
    async importUserChats(userId, file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            
            reader.onload = (e) => {
                try {
                    const data = JSON.parse(e.target.result);
                    
                    if (!data.chats || !Array.isArray(data.chats)) {
                        reject('잘못된 파일 형식입니다.');
                        return;
                    }
                    
                    // 기존 채팅과 병합
                    if (!this.chatHistory[userId]) {
                        this.chatHistory[userId] = [];
                    }
                    
                    // 중복 제거하며 병합
                    data.chats.forEach(chat => {
                        const exists = this.chatHistory[userId].some(c => c.id === chat.id);
                        if (!exists) {
                            this.chatHistory[userId].push(chat);
                        }
                    });
                    
                    // 날짜순 정렬 (최신순)
                    this.chatHistory[userId].sort((a, b) => 
                        new Date(b.lastUpdated) - new Date(a.lastUpdated)
                    );
                    
                    this.saveChatHistory();
                    resolve(data.chats.length);
                } catch (error) {
                    reject('파일 파싱 실패: ' + error.message);
                }
            };
            
            reader.onerror = () => reject('파일 읽기 실패');
            reader.readAsText(file);
        });
    }
}

// 전역 인스턴스 생성
const chatManager = new ChatManager();
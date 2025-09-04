/**
 * StorageManager - localStorage 관리 공통 모듈
 * 모든 localStorage 작업을 중앙화하여 관리
 */
class StorageManager {
    constructor() {
        // 스토리지 키 정의
        this.KEYS = {
            // 유저 관련
            CURRENT_USER_ID: 'currentUserId',
            
            // 채팅 관련
            CHAT_HISTORY: 'hanwha_chat_history',
            
            // 테마 관련
            THEME: 'theme',
            
            // 기타 설정
            APP_SETTINGS: 'app_settings',
            USER_PREFERENCES: 'user_preferences'
        };
        
        // 스토리지 가용 여부 확인
        this.isAvailable = this.checkAvailability();
    }
    
    /**
     * localStorage 사용 가능 여부 확인
     */
    checkAvailability() {
        try {
            const testKey = '__storage_test__';
            localStorage.setItem(testKey, 'test');
            localStorage.removeItem(testKey);
            return true;
        } catch (e) {
            console.warn('localStorage를 사용할 수 없습니다:', e);
            return false;
        }
    }
    
    /**
     * 데이터 저장
     * @param {string} key - 저장할 키
     * @param {*} value - 저장할 값 (자동으로 JSON 문자열로 변환)
     * @returns {boolean} 저장 성공 여부
     */
    set(key, value) {
        if (!this.isAvailable) {
            console.warn('localStorage를 사용할 수 없습니다');
            return false;
        }
        
        try {
            const serializedValue = JSON.stringify(value);
            localStorage.setItem(key, serializedValue);
            return true;
        } catch (e) {
            console.error(`데이터 저장 실패 [${key}]:`, e);
            
            // 용량 초과 에러 처리
            if (e.name === 'QuotaExceededError') {
                this.handleQuotaExceeded();
            }
            return false;
        }
    }
    
    /**
     * 데이터 가져오기
     * @param {string} key - 가져올 키
     * @param {*} defaultValue - 값이 없을 때 반환할 기본값
     * @returns {*} 저장된 값 또는 기본값
     */
    get(key, defaultValue = null) {
        if (!this.isAvailable) {
            return defaultValue;
        }
        
        try {
            const item = localStorage.getItem(key);
            if (item === null) {
                return defaultValue;
            }
            return JSON.parse(item);
        } catch (e) {
            console.error(`데이터 파싱 실패 [${key}]:`, e);
            return defaultValue;
        }
    }
    
    /**
     * 단순 문자열 저장 (JSON 변환 없이)
     */
    setString(key, value) {
        if (!this.isAvailable) return false;
        
        try {
            localStorage.setItem(key, value);
            return true;
        } catch (e) {
            console.error(`문자열 저장 실패 [${key}]:`, e);
            return false;
        }
    }
    
    /**
     * 단순 문자열 가져오기 (JSON 파싱 없이)
     */
    getString(key, defaultValue = '') {
        if (!this.isAvailable) return defaultValue;
        
        try {
            return localStorage.getItem(key) || defaultValue;
        } catch (e) {
            console.error(`문자열 가져오기 실패 [${key}]:`, e);
            return defaultValue;
        }
    }
    
    /**
     * 데이터 삭제
     * @param {string} key - 삭제할 키
     * @returns {boolean} 삭제 성공 여부
     */
    remove(key) {
        if (!this.isAvailable) return false;
        
        try {
            localStorage.removeItem(key);
            return true;
        } catch (e) {
            console.error(`데이터 삭제 실패 [${key}]:`, e);
            return false;
        }
    }
    
    /**
     * 모든 데이터 삭제
     * @param {boolean} confirm - 확인 플래그 (안전장치)
     * @returns {boolean} 삭제 성공 여부
     */
    clear(confirm = false) {
        if (!confirm) {
            console.warn('clear 메서드는 confirm=true 파라미터가 필요합니다');
            return false;
        }
        
        if (!this.isAvailable) return false;
        
        try {
            localStorage.clear();
            return true;
        } catch (e) {
            console.error('전체 데이터 삭제 실패:', e);
            return false;
        }
    }
    
    /**
     * 특정 접두사로 시작하는 모든 키 가져오기
     * @param {string} prefix - 접두사
     * @returns {Array} 매칭되는 키 배열
     */
    getKeysByPrefix(prefix) {
        if (!this.isAvailable) return [];
        
        const keys = [];
        try {
            for (let i = 0; i < localStorage.length; i++) {
                const key = localStorage.key(i);
                if (key && key.startsWith(prefix)) {
                    keys.push(key);
                }
            }
        } catch (e) {
            console.error('키 목록 가져오기 실패:', e);
        }
        return keys;
    }
    
    /**
     * 스토리지 용량 정보 가져오기
     * @returns {Object} 사용량 정보
     */
    getStorageInfo() {
        if (!this.isAvailable) {
            return { used: 0, total: 0, percentage: 0 };
        }
        
        try {
            let used = 0;
            for (let key in localStorage) {
                if (localStorage.hasOwnProperty(key)) {
                    used += localStorage[key].length + key.length;
                }
            }
            
            // 브라우저별 기본 제한 (약 5-10MB)
            const total = 5 * 1024 * 1024; // 5MB
            const percentage = (used / total * 100).toFixed(2);
            
            return {
                used: used,
                total: total,
                percentage: parseFloat(percentage),
                usedMB: (used / 1024 / 1024).toFixed(2),
                totalMB: (total / 1024 / 1024).toFixed(2)
            };
        } catch (e) {
            console.error('스토리지 정보 가져오기 실패:', e);
            return { used: 0, total: 0, percentage: 0 };
        }
    }
    
    /**
     * 용량 초과 처리
     */
    handleQuotaExceeded() {
        console.warn('localStorage 용량이 초과되었습니다');
        const info = this.getStorageInfo();
        console.warn(`현재 사용량: ${info.usedMB}MB / ${info.totalMB}MB (${info.percentage}%)`);
        
        // 오래된 채팅 히스토리 정리 시도
        this.cleanupOldData();
    }
    
    /**
     * 오래된 데이터 정리
     */
    cleanupOldData() {
        try {
            // 채팅 히스토리에서 30일 이상 된 대화 삭제
            const chatHistory = this.get(this.KEYS.CHAT_HISTORY, {});
            const thirtyDaysAgo = new Date();
            thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
            
            let cleaned = false;
            
            if (chatHistory.chatHistory) {
                for (const userId in chatHistory.chatHistory) {
                    const userChats = chatHistory.chatHistory[userId];
                    const filteredChats = userChats.filter(chat => {
                        const lastUpdated = new Date(chat.lastUpdated);
                        return lastUpdated > thirtyDaysAgo;
                    });
                    
                    if (filteredChats.length < userChats.length) {
                        chatHistory.chatHistory[userId] = filteredChats;
                        cleaned = true;
                    }
                }
                
                if (cleaned) {
                    this.set(this.KEYS.CHAT_HISTORY, chatHistory);
                    console.log('오래된 채팅 히스토리가 정리되었습니다');
                }
            }
        } catch (e) {
            console.error('데이터 정리 실패:', e);
        }
    }
    
    // ===== 애플리케이션 특화 메서드 =====
    
    /**
     * 현재 유저 ID 저장
     */
    setCurrentUserId(userId) {
        return this.setString(this.KEYS.CURRENT_USER_ID, userId);
    }
    
    /**
     * 현재 유저 ID 가져오기
     */
    getCurrentUserId() {
        return this.getString(this.KEYS.CURRENT_USER_ID);
    }
    
    /**
     * 채팅 히스토리 저장
     */
    setChatHistory(chatHistory) {
        return this.set(this.KEYS.CHAT_HISTORY, chatHistory);
    }
    
    /**
     * 채팅 히스토리 가져오기
     */
    getChatHistory() {
        return this.get(this.KEYS.CHAT_HISTORY, { chatHistory: {}, metadata: {} });
    }
    
    /**
     * 테마 저장
     */
    setTheme(theme) {
        return this.setString(this.KEYS.THEME, theme);
    }
    
    /**
     * 테마 가져오기
     */
    getTheme(defaultTheme = 'light') {
        return this.getString(this.KEYS.THEME, defaultTheme);
    }
    
    /**
     * 앱 설정 저장
     */
    setAppSettings(settings) {
        return this.set(this.KEYS.APP_SETTINGS, settings);
    }
    
    /**
     * 앱 설정 가져오기
     */
    getAppSettings(defaultSettings = {}) {
        return this.get(this.KEYS.APP_SETTINGS, defaultSettings);
    }
    
    /**
     * 유저 설정 저장
     */
    setUserPreferences(userId, preferences) {
        const allPreferences = this.get(this.KEYS.USER_PREFERENCES, {});
        allPreferences[userId] = preferences;
        return this.set(this.KEYS.USER_PREFERENCES, allPreferences);
    }
    
    /**
     * 유저 설정 가져오기
     */
    getUserPreferences(userId) {
        const allPreferences = this.get(this.KEYS.USER_PREFERENCES, {});
        return allPreferences[userId] || {};
    }
}

// 싱글톤 인스턴스 생성 및 export
const storageManager = new StorageManager();

// 전역 객체로도 노출 (다른 스크립트에서 접근 가능)
window.storageManager = storageManager;
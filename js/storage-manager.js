/**
 * LocalStorage 관리 클래스
 * 애플리케이션의 모든 데이터 저장 및 조회를 담당
 */
class StorageManager {
    constructor() {
        this.STORAGE_KEYS = {
            USER_PROFILE: 'hanwha_user_profile',
            STATS: 'hanwha_stats',
            DOCUMENTS: 'hanwha_documents',
            SCHEDULES: 'hanwha_schedules',
            CHAT_HISTORY: 'hanwha_chat_history',
            BOOKMARKS: 'hanwha_bookmarks',
            NOTIFICATION_SETTINGS: 'hanwha_notification_settings',
            SYSTEM_SETTINGS: 'hanwha_system_settings',
            THEME: 'hanwha_theme',
            SETTINGS: 'hanwha_settings',
            CURRENT_USER: 'hanwha_current_user'
        };

        this.initializeStorage();
    }

    initializeStorage() {
        // 모든 샘플 데이터 수집
        const sampleData = this.collectSampleData();
        
        if (!sampleData) {
            console.warn('샘플 데이터를 찾을 수 없습니다. 샘플 데이터 파일들을 확인하세요.');
            return;
        }

        // 각 데이터 타입별로 초기화
        this.initializeDataIfEmpty(this.STORAGE_KEYS.USER_PROFILE, sampleData.userProfile);
        this.initializeDataIfEmpty(this.STORAGE_KEYS.STATS, sampleData.stats);
        this.initializeDataIfEmpty(this.STORAGE_KEYS.DOCUMENTS, sampleData.documents);
        this.initializeDataIfEmpty(this.STORAGE_KEYS.SCHEDULES, sampleData.schedules);
        this.initializeDataIfEmpty(this.STORAGE_KEYS.CHAT_HISTORY, sampleData.chatHistory);
        this.initializeDataIfEmpty(this.STORAGE_KEYS.BOOKMARKS, sampleData.bookmarks);
        this.initializeDataIfEmpty(this.STORAGE_KEYS.NOTIFICATION_SETTINGS, sampleData.notificationSettings);
        this.initializeDataIfEmpty(this.STORAGE_KEYS.SYSTEM_SETTINGS, sampleData.systemSettings);

        // 기존 설정 유지 (하위 호환성)
        if (!this.getData(this.STORAGE_KEYS.SETTINGS)) {
            this.saveData(this.STORAGE_KEYS.SETTINGS, {
                theme: sampleData.systemSettings?.theme || 'light',
                notifications: sampleData.notificationSettings?.emailNotifications || true,
                autoSave: sampleData.systemSettings?.autoSave || true
            });
        }

        console.log('스토리지 초기화 완료');
    }

    collectSampleData() {
        // 여러 샘플 데이터 소스에서 데이터 수집
        const data = {};
        
        // SAMPLE_DATA (data/sample-data.js)에서 기본 데이터 가져오기
        if (typeof SAMPLE_DATA !== 'undefined') {
            Object.assign(data, SAMPLE_DATA);
        }
        
        // SAMPLE_SAMPLE_DATA (data/sample-sampleData.js)에서 추가 데이터 가져오기
        if (typeof SAMPLE_SAMPLE_DATA !== 'undefined') {
            // 필요한 데이터 병합
            if (!data.templates) data.templates = SAMPLE_SAMPLE_DATA.templates;
            if (!data.aiResponses) data.aiResponses = SAMPLE_SAMPLE_DATA.aiResponses;
            if (!data.scheduleTypes) data.scheduleTypes = SAMPLE_SAMPLE_DATA.scheduleTypes;
            if (!data.taskCategories) data.taskCategories = SAMPLE_SAMPLE_DATA.taskCategories;
            if (!data.analyticsData) data.analyticsData = SAMPLE_SAMPLE_DATA.analyticsData;
            if (!data.settings) data.settings = SAMPLE_SAMPLE_DATA.settings;
        }
        
        // SAMPLE_USERS_DATA (data/sample-users.js)에서 사용자 데이터 가져오기
        if (typeof SAMPLE_USERS_DATA !== 'undefined') {
            if (!data.users) data.users = SAMPLE_USERS_DATA.users;
            if (!data.departments) data.departments = SAMPLE_USERS_DATA.departments;
            if (!data.positions) data.positions = SAMPLE_USERS_DATA.positions;
            if (!data.offices) data.offices = SAMPLE_USERS_DATA.offices;
        }
        
        // SAMPLE_CHAT_HISTORY (data/sample-chat-history.js)에서 채팅 히스토리 가져오기
        if (typeof SAMPLE_CHAT_HISTORY !== 'undefined') {
            if (!data.chatHistory) data.chatHistory = SAMPLE_CHAT_HISTORY.chatHistory;
        }
        
        // 최소한의 데이터라도 있으면 반환
        return Object.keys(data).length > 0 ? data : null;
    }

    initializeDataIfEmpty(key, defaultData) {
        const existingData = this.getData(key);
        if (!existingData || (Array.isArray(existingData) && existingData.length === 0)) {
            this.saveData(key, defaultData);
            console.log(`${key} 초기 데이터 설정 완료`);
        }
    }

    // 데이터 저장
    saveData(key, data) {
        try {
            localStorage.setItem(key, JSON.stringify(data));
            return true;
        } catch (error) {
            console.error(`데이터 저장 실패 (${key}):`, error);
            return false;
        }
    }

    // 데이터 조회
    getData(key) {
        try {
            const data = localStorage.getItem(key);
            return data ? JSON.parse(data) : null;
        } catch (error) {
            console.error(`데이터 조회 실패 (${key}):`, error);
            return null;
        }
    }

    // 데이터 삭제
    removeData(key) {
        try {
            localStorage.removeItem(key);
            return true;
        } catch (error) {
            console.error(`데이터 삭제 실패 (${key}):`, error);
            return false;
        }
    }

    // 특정 항목 업데이트
    updateItem(storageKey, itemId, updates) {
        const data = this.getData(storageKey);
        if (Array.isArray(data)) {
            const index = data.findIndex(item => item.id === itemId);
            if (index !== -1) {
                data[index] = { ...data[index], ...updates };
                return this.saveData(storageKey, data);
            }
        }
        return false;
    }

    // 새 항목 추가
    addItem(storageKey, item) {
        const data = this.getData(storageKey) || [];
        if (Array.isArray(data)) {
            data.push(item);
            return this.saveData(storageKey, data);
        }
        return false;
    }

    // 항목 삭제
    deleteItem(storageKey, itemId) {
        const data = this.getData(storageKey);
        if (Array.isArray(data)) {
            const filtered = data.filter(item => item.id !== itemId);
            return this.saveData(storageKey, filtered);
        }
        return false;
    }

    // 전체 스토리지 초기화
    clearAll() {
        Object.values(this.STORAGE_KEYS).forEach(key => {
            this.removeData(key);
        });
    }

    // 스토리지 사용량 확인
    getStorageSize() {
        let totalSize = 0;
        Object.values(this.STORAGE_KEYS).forEach(key => {
            const data = localStorage.getItem(key);
            if (data) {
                totalSize += data.length;
            }
        });
        return (totalSize / 1024).toFixed(2) + ' KB';
    }

    // 특정 데이터 타입 메서드들
    getUserProfile() {
        return this.getData(this.STORAGE_KEYS.USER_PROFILE);
    }

    updateUserProfile(updates) {
        const profile = this.getUserProfile();
        return this.saveData(this.STORAGE_KEYS.USER_PROFILE, { ...profile, ...updates });
    }

    getStats() {
        return this.getData(this.STORAGE_KEYS.STATS);
    }

    updateStats(updates) {
        const stats = this.getStats();
        return this.saveData(this.STORAGE_KEYS.STATS, { ...stats, ...updates });
    }

    getDocuments() {
        return this.getData(this.STORAGE_KEYS.DOCUMENTS) || [];
    }

    getSchedules() {
        return this.getData(this.STORAGE_KEYS.SCHEDULES) || [];
    }

    getChatHistory() {
        return this.getData(this.STORAGE_KEYS.CHAT_HISTORY) || [];
    }
    
    setChatHistory(chatHistory) {
        return this.saveData(this.STORAGE_KEYS.CHAT_HISTORY, chatHistory);
    }

    addChatMessage(chatSession) {
        return this.addItem(this.STORAGE_KEYS.CHAT_HISTORY, chatSession);
    }

    getBookmarks() {
        return this.getData(this.STORAGE_KEYS.BOOKMARKS) || [];
    }

    addBookmark(bookmark) {
        return this.addItem(this.STORAGE_KEYS.BOOKMARKS, bookmark);
    }

    removeBookmark(bookmarkId) {
        return this.deleteItem(this.STORAGE_KEYS.BOOKMARKS, bookmarkId);
    }

    getNotificationSettings() {
        return this.getData(this.STORAGE_KEYS.NOTIFICATION_SETTINGS);
    }

    updateNotificationSettings(settings) {
        return this.saveData(this.STORAGE_KEYS.NOTIFICATION_SETTINGS, settings);
    }

    getSystemSettings() {
        return this.getData(this.STORAGE_KEYS.SYSTEM_SETTINGS);
    }

    updateSystemSettings(settings) {
        const current = this.getSystemSettings();
        return this.saveData(this.STORAGE_KEYS.SYSTEM_SETTINGS, { ...current, ...settings });
    }

    // 테마 관련 메서드
    getTheme() {
        const systemSettings = this.getSystemSettings();
        return systemSettings?.theme || 'light';
    }

    setTheme(theme) {
        return this.updateSystemSettings({ theme });
    }

    // 현재 사용자 ID 관련 메서드
    getCurrentUserId() {
        return this.getData(this.STORAGE_KEYS.CURRENT_USER);
    }

    setCurrentUserId(userId) {
        return this.saveData(this.STORAGE_KEYS.CURRENT_USER, userId);
    }

    // 데이터 내보내기
    exportData() {
        const data = {};
        Object.entries(this.STORAGE_KEYS).forEach(([name, key]) => {
            data[name] = this.getData(key);
        });
        return data;
    }

    // 데이터 가져오기
    importData(data) {
        Object.entries(data).forEach(([name, value]) => {
            if (this.STORAGE_KEYS[name]) {
                this.saveData(this.STORAGE_KEYS[name], value);
            }
        });
    }
}

// 싱글톤 인스턴스 생성
const storageManager = new StorageManager();

// 전역에서 사용할 수 있도록 export
if (typeof window !== 'undefined') {
    window.StorageManager = storageManager;
}

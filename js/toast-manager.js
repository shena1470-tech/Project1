// Toast Manager - 토스트 알림 관리 시스템
class ToastManager {
    constructor() {
        this.toasts = [];
        this.container = null;
        this.init();
    }

    init() {
        // 토스트 컨테이너 생성
        this.container = document.createElement('div');
        this.container.className = 'toast-container';
        document.body.appendChild(this.container);
    }

    /**
     * 토스트 메시지 표시
     * @param {string} message - 표시할 메시지
     * @param {Object} options - 토스트 옵션
     * @param {string} options.type - 토스트 타입 ('success', 'error', 'warning', 'info')
     * @param {number} options.duration - 자동 닫기 시간 (ms, 0이면 자동 닫기 안함)
     * @param {boolean} options.closable - 닫기 버튼 표시 여부
     */
    show(message, options = {}) {
        const config = {
            type: 'success',
            duration: 5000,
            closable: true,
            ...options
        };

        const toastId = this.generateId();
        const toast = this.createToastElement(toastId, message, config);
        
        this.container.appendChild(toast);
        this.toasts.push({ id: toastId, element: toast, config });

        // 애니메이션을 위한 약간의 지연
        requestAnimationFrame(() => {
            toast.classList.add('toast-show');
        });

        // 자동 닫기 설정
        if (config.duration > 0) {
            setTimeout(() => {
                this.hide(toastId);
            }, config.duration);
        }

        return toastId;
    }

    /**
     * 회의실 예약 완료 토스트 (특화 메서드)
     */
    showMeetingSuccess(meetingInfo = {}) {
        const message = `회의실 예약 완료! 회의 15분 전에 알려드릴게요.`;
        
        return this.show(message, {
            type: 'success',
            duration: 5000,
            closable: true
        });
    }

    /**
     * 토스트 숨기기
     * @param {string} toastId - 토스트 ID
     */
    hide(toastId) {
        const toastIndex = this.toasts.findIndex(t => t.id === toastId);
        if (toastIndex === -1) return;

        const toast = this.toasts[toastIndex];
        toast.element.classList.add('toast-exit');

        // 애니메이션 완료 후 DOM에서 제거
        setTimeout(() => {
            if (toast.element.parentNode) {
                toast.element.parentNode.removeChild(toast.element);
            }
            this.toasts.splice(toastIndex, 1);
        }, 300);
    }

    /**
     * 모든 토스트 숨기기
     */
    hideAll() {
        this.toasts.forEach(toast => {
            this.hide(toast.id);
        });
    }

    /**
     * 토스트 엘리먼트 생성
     */
    createToastElement(id, message, config) {
        const toast = document.createElement('div');
        toast.className = `toast toast-${config.type}`;
        toast.dataset.toastId = id;

        const iconPath = this.getIconPath(config.type);
        
        toast.innerHTML = `
            <div class="toast-icon">
                <img src="${iconPath}" alt="${config.type}" />
            </div>
            <div class="toast-content">${this.escapeHtml(message)}</div>
            ${config.closable ? `
                <button class="toast-close" type="button" aria-label="토스트 닫기">
                    <img src="assets/icons/toast-close.svg" alt="닫기" />
                </button>
            ` : ''}
        `;

        // 닫기 버튼 이벤트 리스너
        if (config.closable) {
            const closeBtn = toast.querySelector('.toast-close');
            closeBtn.addEventListener('click', () => {
                this.hide(id);
            });
        }

        return toast;
    }

    /**
     * 토스트 타입에 따른 아이콘 경로 반환
     */
    getIconPath(type) {
        const iconMap = {
            success: 'assets/icons/toast-success.svg',
            error: 'assets/icons/toast-success.svg', // 현재는 같은 아이콘 사용
            warning: 'assets/icons/toast-success.svg',
            info: 'assets/icons/toast-success.svg'
        };
        return iconMap[type] || iconMap.success;
    }

    /**
     * HTML 이스케이프
     */
    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    /**
     * 고유 ID 생성
     */
    generateId() {
        return `toast_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    }

    /**
     * 활성 토스트 개수 반환
     */
    getActiveCount() {
        return this.toasts.length;
    }

    /**
     * 특정 타입의 토스트가 활성화되어 있는지 확인
     */
    hasActiveType(type) {
        return this.toasts.some(toast => toast.config.type === type);
    }
}

// 전역 토스트 매니저 인스턴스
let toastManager = null;

// 토스트 매니저 초기화 및 전역 접근 함수들
function initToastManager() {
    if (!toastManager) {
        toastManager = new ToastManager();
    }
    return toastManager;
}

// 편의 함수들
function showToast(message, options) {
    return initToastManager().show(message, options);
}

function showSuccessToast(message, duration = 5000) {
    return showToast(message, { type: 'success', duration });
}

function showErrorToast(message, duration = 5000) {
    return showToast(message, { type: 'error', duration });
}

function showMeetingSuccessToast(meetingInfo) {
    return initToastManager().showMeetingSuccess(meetingInfo);
}

function hideToast(toastId) {
    if (toastManager) {
        toastManager.hide(toastId);
    }
}

function hideAllToasts() {
    if (toastManager) {
        toastManager.hideAll();
    }
}

// DOM이 준비되면 토스트 매니저 초기화
document.addEventListener('DOMContentLoaded', function() {
    initToastManager();
});
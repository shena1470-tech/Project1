// 가이드 모달 관리자
class GuideModalManager {
    constructor() {
        this.currentGuideIndex = 0;
        this.guides = [
            {
                title: '회의 잡기',
                // 피그마 노드 107-52173의 콘텐츠 이미지 (회의 잡기 가이드)
                fullImage: 'assets/guide/meeting-guide.png'
            },
            {
                title: '업무 히스토리 문의',
                // 피그마 노드 107-52211의 콘텐츠 이미지 (업무 히스토리 가이드)
                fullImage: 'assets/guide/history-guide.png'
            },
            {
                title: '남은 연차 확인',
                // 피그마 노드 107-52242의 콘텐츠 이미지 (연차 확인 가이드)
                fullImage: 'assets/guide/vacation-guide.png'
            },
            {
                title: '보고서 모드',
                // 피그마 노드 107-52273의 콘텐츠 이미지 (보고서 모드 가이드)
                fullImage: 'assets/guide/report-guide.png'
            },
            {
                title: 'User Test 모드',
                // 피그마 노드 107-52303의 콘텐츠 이미지 (User Test 모드 가이드)
                fullImage: 'assets/guide/usertest-guide.png'
            }
        ];
        
        this.init();
    }

    init() {
        this.createModal();
        this.attachEventListeners();
    }

    createModal() {
        // 모달 오버레이 생성
        const overlay = document.createElement('div');
        overlay.className = 'guide-modal-overlay';
        overlay.id = 'guideModalOverlay';

        // 모달 컨테이너 생성
        const modal = document.createElement('div');
        modal.className = 'guide-modal';

        // 모달 헤더
        const header = document.createElement('div');
        header.className = 'guide-modal-header';
        header.innerHTML = `
            <div>
                <div class="guide-modal-title">김한화 사원 사용 가이드</div>
                <div class="guide-modal-subtitle">현재 시연 가능한 기능들을 소개해 드려요.</div>
            </div>
            <button class="guide-modal-close" onclick="guideModalManager.closeModal()">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <path d="M4 4L16 16M4 16L16 4" stroke="#272b2f" stroke-width="2" stroke-linecap="round"/>
                </svg>
            </button>
        `;

        // 네비게이션
        const navigation = document.createElement('div');
        navigation.className = 'guide-modal-navigation';
        navigation.innerHTML = `
            <button class="guide-nav-button" id="guidePrevButton" onclick="guideModalManager.previousGuide()">
                <svg viewBox="0 0 20 20" fill="none">
                    <path d="M12 5L7 10L12 15" stroke="#272b2f" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
            </button>
            <div class="guide-section-title" id="guideSectionTitle"></div>
            <button class="guide-nav-button" id="guideNextButton" onclick="guideModalManager.nextGuide()">
                <svg viewBox="0 0 20 20" fill="none">
                    <path d="M8 5L13 10L8 15" stroke="#272b2f" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
            </button>
        `;

        // 콘텐츠 영역
        const content = document.createElement('div');
        content.className = 'guide-modal-content';
        content.id = 'guideModalContent';

        modal.appendChild(header);
        modal.appendChild(navigation);
        modal.appendChild(content);
        overlay.appendChild(modal);
        document.body.appendChild(overlay);
    }

    attachEventListeners() {
        const overlay = document.getElementById('guideModalOverlay');
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) {
                this.closeModal();
            }
        });

        // ESC 키로 닫기
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && overlay.classList.contains('active')) {
                this.closeModal();
            }
        });
    }

    openModal() {
        const overlay = document.getElementById('guideModalOverlay');
        overlay.classList.add('active');
        this.currentGuideIndex = 0;
        this.renderGuide();
    }

    closeModal() {
        const overlay = document.getElementById('guideModalOverlay');
        overlay.classList.remove('active');
    }

    previousGuide() {
        if (this.currentGuideIndex > 0) {
            this.currentGuideIndex--;
            this.renderGuide();
        }
    }

    nextGuide() {
        if (this.currentGuideIndex < this.guides.length - 1) {
            this.currentGuideIndex++;
            this.renderGuide();
        }
    }

    renderGuide() {
        const guide = this.guides[this.currentGuideIndex];
        const content = document.getElementById('guideModalContent');
        const title = document.getElementById('guideSectionTitle');
        const prevButton = document.getElementById('guidePrevButton');
        const nextButton = document.getElementById('guideNextButton');

        // 제목 업데이트
        title.textContent = guide.title;

        // 버튼 상태 업데이트
        prevButton.disabled = this.currentGuideIndex === 0;
        nextButton.disabled = this.currentGuideIndex === this.guides.length - 1;

        // 콘텐츠를 통 이미지로 렌더링
        let contentHTML = '<div class="guide-content-wrapper">';
        contentHTML += `<img class="guide-content-image" src="${guide.fullImage}" alt="${guide.title} 가이드">`;
        contentHTML += '</div>';
        
        content.innerHTML = contentHTML;

        // 스크롤 상단으로
        content.scrollTop = 0;
    }
}

// 전역 인스턴스 생성
let guideModalManager;

// DOM 로드 완료 시 초기화
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        guideModalManager = new GuideModalManager();
    });
} else {
    guideModalManager = new GuideModalManager();
}

// 가이드 모달 열기 함수 (showGuide 함수 재정의)
function showGuide() {
    if (guideModalManager) {
        guideModalManager.openModal();
    }
}
// 보고서 작성 모드 관리 - Figma Design Implementation
class ReportModeManager {
    constructor() {
        this.isActive = false;
        this.userRequest = '';
        this.templates = [
            {
                id: 'quarterly',
                title: '분기별 실적 보고서',
                description: '매출, 성과 분석',
                category: 'performance'
            },
            {
                id: 'project',
                title: '프로젝트 진행 보고서',
                description: '일정, 리스크 관리',
                category: 'project'
            },
            {
                id: 'marketing',
                title: '마케팅 캠페인 보고서',
                description: 'ROI, 성과 지표',
                category: 'marketing'
            },
            {
                id: 'market',
                title: '시장 분석 보고서',
                description: '경쟁사, 트렌드 분석',
                category: 'analysis'
            },
            {
                id: 'hr',
                title: '인사 평가 보고서',
                description: '성과, KPI 평가',
                category: 'hr'
            },
            {
                id: 'financial',
                title: '재무 현황 보고서',
                description: '예산, 손익 분석',
                category: 'financial'
            },
            {
                id: 'risk',
                title: '리스크 관리 보고서',
                description: '위험 요소, 대응 방안',
                category: 'risk'
            }
        ];
    }

    init() {
        this.createReportModeHTML();
        this.bindEvents();
    }

    createReportModeHTML() {
        // 기존 보고서 모드 컨테이너가 있으면 제거
        const existingContainer = document.getElementById('reportModeContainer');
        if (existingContainer) {
            existingContainer.remove();
        }

        const reportModeHTML = `
            <div id="reportModeContainer" class="report-mode-container">
                <!-- Recreate the full app structure for report mode -->
                <div class="report-app-wrapper">
                    <!-- Left Sidebar -->
                    <aside class="report-sidebar">
                        <div class="sidebar-header">
                            <div class="hanwha-logo">
                                <img src="assets/hanwha_logo(pc).png" alt="한화생명" />
                                <span class="ai-assistant-title">AI 비서</span>
                            </div>
                        </div>
                        <nav class="sidebar-menu">
                            <div class="recent-chat-header">
                                <span class="section-title">최근 대화</span>
                                <button class="new-chat-button" onclick="reportModeManager.hideReportMode(); startNewChat()">
                                    <span class="plus-icon"></span>
                                    새 대화
                                </button>
                            </div>
                            <div class="chat-history-section">
                                <div class="chat-history-item">
                                    <div class="chat-title">구내식당 메뉴</div>
                                    <div class="chat-preview">오늘 구내식당 메뉴 알려줘.</div>
                                    <div class="chat-time">1시간 전</div>
                                </div>
                                <div class="chat-history-item">
                                    <div class="chat-title">마케팅 캠페인 기획</div>
                                    <div class="chat-preview">소셜미디어 전략에 대해 더 자세히 알려주세요</div>
                                    <div class="chat-time">1일 전</div>
                                </div>
                            </div>
                            <div class="sidebar-bottom-menu">
                                <button class="bottom-menu-item">가이드</button>
                                <button class="bottom-menu-item">내 캘린더</button>
                                <button class="bottom-menu-item">설정</button>
                            </div>
                        </nav>
                    </aside>

                    <!-- Main Content Area -->
                    <main class="report-main-content">
                        <!-- Top Header -->
                        <header class="report-header-bar">
                            <div class="report-header-actions">
                                <button class="notification-button" aria-label="알림">
                                    <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
                                        <path d="M14 2C10.686 2 8 4.686 8 8C8 11.314 8 15 6 17H22C20 15 20 11.314 20 8C20 4.686 17.314 2 14 2Z" stroke="#333333" stroke-width="1.5"/>
                                        <path d="M16.5 21C16.5 22.381 15.381 23.5 14 23.5C12.619 23.5 11.5 22.381 11.5 21" stroke="#333333" stroke-width="1.5"/>
                                    </svg>
                                </button>
                                <div class="user-profile">
                                    <div class="user-avatar"></div>
                                    <span class="user-name">김동준</span>
                                    <svg class="arrow-down" viewBox="0 0 20 20" fill="none">
                                        <path d="M5 7.5L10 12.5L15 7.5" stroke="#333333" stroke-width="1.5"/>
                                    </svg>
                                </div>
                            </div>
                        </header>

                        <!-- Content Area -->
                        <div class="report-content-area">
                            <!-- User Message Bubble -->
                            <div class="report-user-message">
                                <div class="report-user-message-content">
                                    <p>서비스 개선 보고서</p>
                                    <ul>
                                        <li>보고서 개요: 고객센터 챗봇 서비스의 성능 및 만족도 개선을 위해 진행한 프로젝트 결과를 정리합니다.</li>
                                        <li>목표: 응답 정확도를 85% 이상으로 향상하고, 고객 이탈률을 10% 감소시키는 것.</li>
                                        <li>세부 내용: FAQ 데이터셋 확장, AI 모델 고도화, UI/UX 개선을 통해 고객 접근성을 강화했습니다.</li>
                                    </ul>
                                </div>
                            </div>
                            
                            <!-- Report Selection Panel -->
                            <div class="report-selection-wrapper">
                                <div class="report-ai-avatar">AI</div>
                                <div class="report-selection-panel">
                                    <div class="report-header">
                                        <h2 class="report-title">보고서 양식을 선택해 주세요.</h2>
                                        <p class="report-subtitle">스타일을 선택하시면 '한화생명 보고서' 스타일로 바꿔서 보내드려요.</p>
                                    </div>
                                    
                                    <div class="report-template-grid">
                                        ${this.generateTemplateCards()}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- Bottom Input Area -->
                        <div class="report-input-area">
                            <div class="input-wrapper">
                                <div class="input-container">
                                    <button class="input-plus-button">
                                        <span class="plus-icon"></span>
                                    </button>
                                    <input type="text" class="input-field" placeholder="무엇이든 물어보세요." />
                                    <button class="send-button">
                                        <span class="send-icon"></span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </main>
                </div>
            </div>
        `;

        // 메인 콘텐츠 영역에 추가
        const mainContent = document.querySelector('.main-content');
        if (mainContent) {
            mainContent.insertAdjacentHTML('beforeend', reportModeHTML);
        }
    }

    setUserRequest(request) {
        this.userRequest = request;
        const userMessageContent = document.querySelector('.report-user-message-content');
        if (userMessageContent) {
            userMessageContent.innerHTML = `<p>${request}</p>`;
        }
    }

    generateTemplateCards() {
        let cardsHTML = '';
        
        // 실제 템플릿 7개 생성
        this.templates.forEach(template => {
            cardsHTML += `
                <div class="report-card" data-template="${template.id}">
                    <div class="report-card-background"></div>
                    <h3 class="report-card-title">${template.title}</h3>
                    <p class="report-card-description">${template.description}</p>
                </div>
            `;
        });

        // 마지막에 빈 보고서 만들기 카드 추가
        cardsHTML += `
            <div class="report-card report-card-add" data-template="create-new">
                <div class="report-card-add-icon">+</div>
                <div class="report-card-add-text">빈 보고서 만들기</div>
            </div>
        `;

        return cardsHTML;
    }

    bindEvents() {
        // 템플릿 카드 클릭 이벤트
        document.addEventListener('click', (e) => {
            const reportCard = e.target.closest('.report-card');
            if (reportCard && this.isActive) {
                const templateId = reportCard.dataset.template;
                this.selectTemplate(templateId);
            }
        });
    }

    selectTemplate(templateId) {
        if (templateId === 'create-new') {
            this.createBlankReport();
        } else {
            const template = this.templates.find(t => t.id === templateId);
            if (template) {
                this.createReportFromTemplate(template);
            }
        }
    }

    createBlankReport() {
        // 빈 보고서 생성 로직
        console.log('빈 보고서 생성');
        this.hideReportMode();
        
        // AI 응답 시뮬레이션
        setTimeout(() => {
            const aiResponse = `
                <div class="ai-message-content">
                    <p>빈 보고서를 생성하겠습니다. 어떤 내용의 보고서를 작성하고 싶으신지 알려주세요.</p>
                    <p>예를 들어:</p>
                    <ul>
                        <li>특정 프로젝트의 진행 상황 보고서</li>
                        <li>월간/분기별 성과 분석 보고서</li>
                        <li>시장 분석 및 경쟁사 비교 보고서</li>
                        <li>리스크 분석 및 대응방안 보고서</li>
                    </ul>
                </div>
            `;
            addAIResponse(aiResponse);
        }, 1000);
    }

    createReportFromTemplate(template) {
        console.log(`템플릿 선택: ${template.title}`);
        this.hideReportMode();
        
        // AI 응답 시뮬레이션
        setTimeout(() => {
            const aiResponse = `
                <div class="ai-message-content">
                    <p><strong>${template.title}</strong> 템플릿을 선택하셨습니다.</p>
                    <p>${template.description}</p>
                    <p>이 보고서 작성을 위해 다음 정보가 필요합니다:</p>
                    <ul>
                        <li>보고서 작성 기간 (예: 2024년 1분기)</li>
                        <li>분석할 주요 항목들</li>
                        <li>데이터 소스 및 참고자료</li>
                        <li>보고서 수신 대상</li>
                    </ul>
                    <p>위 정보를 입력해 주시면 한화생명 스타일의 전문적인 보고서를 작성해 드리겠습니다.</p>
                </div>
            `;
            addAIResponse(aiResponse);
        }, 1000);
    }

    showReportMode() {
        // 보고서 모드 표시 (오버레이 형태로)
        const reportContainer = document.getElementById('reportModeContainer');
        if (reportContainer) {
            reportContainer.classList.add('active');
            this.isActive = true;
            console.log('보고서 모드 활성화됨');
        } else {
            console.error('보고서 모드 컨테이너를 찾을 수 없습니다.');
        }
    }

    hideReportMode() {
        const reportContainer = document.getElementById('reportModeContainer');
        if (reportContainer) {
            reportContainer.classList.remove('active');
            this.isActive = false;
            console.log('보고서 모드 비활성화됨');
        }

        // 채팅 모드로 전환 (기존 채팅 상태 유지)
        if (!chatStarted) {
            // 채팅이 시작되지 않았다면 초기 화면으로 돌아감
            const welcomeScreen = document.getElementById('welcomeScreen');
            if (welcomeScreen) {
                welcomeScreen.style.display = 'block';
            }
        }
    }
}

// 전역 인스턴스 생성
const reportModeManager = new ReportModeManager();

// 보고서 작성 모드 활성화 함수 (외부에서 호출 가능)
function activateReportMode() {
    reportModeManager.showReportMode();
}

// 페이지 로드 시 초기화
document.addEventListener('DOMContentLoaded', () => {
    reportModeManager.init();
});
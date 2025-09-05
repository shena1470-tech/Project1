// 보고서 작성 모드 관리
class ReportModeManager {
    constructor() {
        this.isActive = false;
        this.templates = [
            {
                id: 'transforming',
                title: '변화, 상황 분석',
                category: 'analysis',
                description: '비즈니스 환경 변화와 상황을 분석하는 보고서'
            },
            {
                id: 'marketing',
                title: '성과, 리스크 관리',
                category: 'performance',
                description: '마케팅 성과와 리스크를 관리하는 보고서'
            },
            {
                id: 'roi',
                title: 'ROI, 상황 지표',
                category: 'metrics',
                description: 'ROI와 주요 상황 지표를 분석하는 보고서'
            },
            {
                id: 'insights',
                title: '경영진, 트렌드 분석',
                category: 'trends',
                description: '경영진을 위한 트렌드 분석 보고서'
            },
            {
                id: 'business',
                title: '예산, 순익 분석',
                category: 'financial',
                description: '예산과 순익을 분석하는 재무 보고서'
            },
            {
                id: 'global',
                title: '위험 요소, 대응 방안',
                category: 'risk',
                description: '위험 요소 식별과 대응 방안 보고서'
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
                <div class="report-header">
                    <h2>보고서 양식을 선택해 주세요.</h2>
                    <div class="report-description">
                        스타일을 선택하시면 '한화생명'보고서 스타일로 바뀌며 보고서를 작성해 주시게 됩니다.
                    </div>
                </div>
                
                <div class="report-templates-grid">
                    ${this.generateTemplateCards()}
                </div>
            </div>
        `;

        // 메인 콘텐츠 영역에 추가
        const mainContent = document.querySelector('.main-content');
        if (mainContent) {
            mainContent.insertAdjacentHTML('beforeend', reportModeHTML);
        }
    }

    generateTemplateCards() {
        let cardsHTML = '';
        
        // 실제 템플릿 6개 생성
        this.templates.forEach(template => {
            cardsHTML += `
                <div class="report-template-card" data-template-id="${template.id}">
                    <div class="report-template-preview template-${template.id}"></div>
                    <div class="report-template-info">
                        <h3 class="report-template-title">${template.title}</h3>
                    </div>
                </div>
            `;
        });

        // 마지막에 빈 보고서 만들기 카드 추가
        cardsHTML += `
            <div class="report-template-card" data-template-id="create-new">
                <div class="report-template-preview empty">
                    <div class="add-report-icon">+</div>
                </div>
                <div class="report-template-info">
                    <h3 class="report-template-title">빈 보고서 만들기</h3>
                </div>
            </div>
        `;

        return cardsHTML;
    }

    bindEvents() {
        // 템플릿 카드 클릭 이벤트
        document.addEventListener('click', (e) => {
            const templateCard = e.target.closest('.report-template-card');
            if (templateCard && this.isActive) {
                const templateId = templateCard.dataset.templateId;
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
        // 기존 화면 숨기기
        const welcomeScreen = document.getElementById('welcomeScreen');
        const chatMessages = document.getElementById('chatMessages');
        
        if (welcomeScreen) {
            welcomeScreen.style.display = 'none';
        }
        if (chatMessages) {
            chatMessages.style.display = 'none';
        }

        // 보고서 모드 표시
        const reportContainer = document.getElementById('reportModeContainer');
        if (reportContainer) {
            reportContainer.classList.add('active');
            this.isActive = true;
        }
    }

    hideReportMode() {
        const reportContainer = document.getElementById('reportModeContainer');
        if (reportContainer) {
            reportContainer.classList.remove('active');
            this.isActive = false;
        }

        // 채팅 모드로 전환
        if (!chatStarted) {
            initiateChatMode();
        } else {
            const chatMessages = document.getElementById('chatMessages');
            if (chatMessages) {
                chatMessages.style.display = 'block';
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
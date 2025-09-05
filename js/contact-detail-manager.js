/**
 * 담당자 상세정보 패널 관리 모듈
 * 담당자 클릭 시 오른쪽 패널에 상세정보와 조직도를 표시
 */

class ContactDetailManager {
    constructor() {
        this.panel = null;
        this.currentContact = null;
        this.isInitialized = false;
        
        // DOM이 준비되면 초기화
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.init());
        } else {
            this.init();
        }
    }

    init() {
        if (this.isInitialized) return;
        
        this.createPanel();
        this.attachEventListeners();
        this.isInitialized = true;
        
        console.log('ContactDetailManager initialized');
    }

    // 패널 HTML 생성
    createPanel() {
        const panelHTML = `
            <div class="contact-detail-panel" id="contactDetailPanel">
                <div class="contact-detail-header">
                    <div class="contact-detail-header-content">
                        <div class="contact-detail-profile">
                            <div class="contact-detail-avatar" id="contactAvatar">
                                <!-- 아바타 -->
                            </div>
                            <div class="contact-detail-info">
                                <h2 id="contactName">담당자 이름</h2>
                                <div class="position" id="contactPosition">직책</div>
                                <div class="department" id="contactDepartment">부서</div>
                            </div>
                        </div>
                        <button class="contact-detail-close" onclick="contactDetailManager.closePanel()" aria-label="닫기">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                                <path d="M18 6L6 18" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                                <path d="M6 6L18 18" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                            </svg>
                        </button>
                    </div>
                    
                    <div class="contact-detail-contact" id="contactInfo">
                        <!-- 연락처 정보 -->
                    </div>
                    
                    <button class="contact-inquiry-button" onclick="contactDetailManager.startChat()">
                        문의하기
                    </button>
                </div>
                
                <div class="contact-detail-content">
                    <!-- 담당 업무 섹션 -->
                    <div class="contact-detail-section">
                        <h3>담당 업무</h3>
                        <div class="responsibilities-list" id="contactResponsibilities">
                            <!-- 담당 업무 목록 -->
                        </div>
                    </div>
                    
                    <!-- 전문 기술 섹션 -->
                    <div class="contact-detail-section">
                        <h3>전문 기술</h3>
                        <div class="skills-container" id="contactSkills">
                            <!-- 기술 태그들 -->
                        </div>
                    </div>
                    
                    <!-- 현재 프로젝트 섹션 -->
                    <div class="contact-detail-section">
                        <h3>현재 프로젝트</h3>
                        <div class="projects-list" id="contactProjects">
                            <!-- 프로젝트 목록 -->
                        </div>
                    </div>
                    
                    <!-- 조직도 섹션 -->
                    <div class="contact-detail-section">
                        <h3>조직 구성</h3>
                        <div class="organization-chart" id="organizationChart">
                            <!-- 조직도 내용 -->
                        </div>
                    </div>
                    
                    <!-- 업무 스타일 섹션 -->
                    <div class="contact-detail-section">
                        <h3>업무 스타일</h3>
                        <div class="work-style-grid" id="workStyle">
                            <!-- 업무 스타일 정보 -->
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        document.body.insertAdjacentHTML('beforeend', panelHTML);
        this.panel = document.getElementById('contactDetailPanel');
    }

    // 이벤트 리스너 연결
    attachEventListeners() {
        // 패널 외부 클릭 시 닫기
        document.addEventListener('click', (e) => {
            if (this.panel && this.panel.classList.contains('active')) {
                const isInsidePanel = this.panel.contains(e.target);
                const isContactCard = e.target.closest('.person-card, .contact-card, .responsible-card');
                
                console.log('클릭 이벤트 감지:');
                console.log('- 클릭 대상:', e.target);
                console.log('- 패널 내부 클릭:', isInsidePanel);
                console.log('- 담당자 카드 클릭:', isContactCard);
                
                if (!isInsidePanel && !isContactCard) {
                    console.log('패널 외부 클릭으로 패널 닫기');
                    this.closePanel();
                }
            }
        });

        // ESC 키로 패널 닫기
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.panel && this.panel.classList.contains('active')) {
                this.closePanel();
            }
        });
    }

    // 담당자 상세정보 표시
    showContactDetail(contactId) {
        console.log('showContactDetail 호출됨:', contactId);
        const userData = this.getUserData(contactId);
        console.log('getUserData 결과:', userData);
        if (!userData) {
            console.error('사용자 데이터를 찾을 수 없습니다:', contactId);
            console.log('SAMPLE_USERS_DATA:', window.SAMPLE_USERS_DATA?.users);
            console.log('ORGANIZATION_DATA managers:', window.ORGANIZATION_DATA?.managers);
            return;
        }

        console.log('패널 열기 시도...');
        this.currentContact = contactId;
        this.updateContactInfo(userData);
        this.updateOrganizationChart(contactId);
        
        // 약간의 지연 후 패널 열기 (클릭 이벤트 처리 완료 대기)
        setTimeout(() => {
            this.openPanel();
        }, 10);
    }

    // 사용자 데이터 가져오기
    getUserData(contactId) {
        console.log('getUserData 호출:', contactId);
        
        // SAMPLE_USERS_DATA에서 사용자 정보 가져오기
        const user = window.SAMPLE_USERS_DATA?.users.find(u => u.id === contactId);
        console.log('SAMPLE_USERS_DATA에서 찾은 사용자:', user);
        
        if (!user) {
            // 매니저 데이터에서 찾기
            const managers = window.ORGANIZATION_DATA?.managers || {};
            const manager = managers[contactId];
            console.log('ORGANIZATION_DATA managers에서 찾은 사용자:', manager);
            
            if (!manager) {
                // 휴가 담당자로 정의된 경우 처리
                const vacationManager = window.VacationManager?.getResponsiblePerson();
                console.log('휴가 담당자 정보:', vacationManager);
                
                if (vacationManager && vacationManager.id === contactId) {
                    // 휴가 담당자 정보를 기본 사용자 데이터로 변환
                    return {
                        id: vacationManager.id,
                        name: vacationManager.name,
                        position: vacationManager.position,
                        department: vacationManager.department,
                        email: vacationManager.email,
                        phone: vacationManager.phone,
                        extension: vacationManager.extension,
                        location: {
                            building: '본사',
                            floor: '5층',
                            seat: 'HR-05'
                        },
                        responsibilities: [
                            '교육 프로그램 기획',
                            '직원 역량 개발',
                            '온보딩 프로세스 관리',
                            '교육 효과 측정'
                        ],
                        expertise: ['교육 설계', 'HR 시스템', '커뮤니케이션', '프로젝트 관리'],
                        currentProjects: [
                            {
                                name: '2024 신입사원 교육 과정',
                                status: '진행중',
                                completion: 90,
                                deadline: '2024-02-28'
                            }
                        ],
                        workStyle: {
                            communicationPreference: 'Teams, 직접 미팅',
                            meetingAvailability: '화요일, 목요일 전일',
                            responseTime: '평균 2시간 이내'
                        }
                    };
                }
                return null;
            }
            
            // 매니저 정보를 기본 사용자 데이터 형식으로 변환
            const orgData = window.ORGANIZATION_DATA;
            const contactDetail = orgData?.contactDetails?.[contactId];
            
            return {
                ...manager,
                ...contactDetail
            };
        }

        // ORGANIZATION_DATA에서 상세 정보 가져오기
        const orgData = window.ORGANIZATION_DATA;
        const contactDetail = orgData?.contactDetails?.[contactId];
        
        const result = {
            ...user,
            ...contactDetail
        };
        
        console.log('최종 사용자 데이터:', result);
        return result;
    }

    // 연락처 정보 업데이트
    updateContactInfo(userData) {
        // 기본 정보
        const avatar = document.getElementById('contactAvatar');
        const name = document.getElementById('contactName');
        const position = document.getElementById('contactPosition');
        const department = document.getElementById('contactDepartment');
        
        avatar.textContent = userData.name.charAt(0);
        name.textContent = userData.name;
        position.textContent = userData.position;
        department.textContent = `${userData.department} ${userData.team || ''}`;

        // 연락처 정보
        const contactInfo = document.getElementById('contactInfo');
        contactInfo.innerHTML = `
            <div class="contact-item">
                <svg viewBox="0 0 24 24" fill="none">
                    <path d="M21 10C21 17 12 23 12 23S3 17 3 10C3 5.029 7.029 1 12 1S21 5.029 21 10Z" stroke="currentColor" stroke-width="2"/>
                    <circle cx="12" cy="10" r="3" stroke="currentColor" stroke-width="2"/>
                </svg>
                ${userData.location ? 
                    `${userData.location.building} ${userData.location.floor} ${userData.location.seat}` : 
                    '위치 정보 없음'
                }
            </div>
            <div class="contact-item">
                <svg viewBox="0 0 24 24" fill="none">
                    <path d="M4 4H20C21.1 4 22 4.9 22 6V18C22 19.1 21.1 20 20 20H4C2.9 20 2 19.1 2 18V6C2 4.9 2.9 4 4 4Z" stroke="currentColor" stroke-width="2"/>
                    <polyline points="22,6 12,13 2,6" stroke="currentColor" stroke-width="2"/>
                </svg>
                <a href="mailto:${userData.email}">${userData.email}</a>
            </div>
            <div class="contact-item">
                <svg viewBox="0 0 24 24" fill="none">
                    <path d="M22 16.92V19.92C22 20.57 21.76 21.18 21.35 21.61C20.94 22.04 20.4 22.24 19.85 22.17C16.93 21.86 14.1 20.85 11.63 19.24C9.37 17.8 7.49 15.92 6.05 13.66C4.44 11.18 3.43 8.34 3.13 5.41C3.06 4.87 3.26 4.33 3.69 3.92C4.12 3.51 4.73 3.27 5.38 3.27H8.38C9.32 3.26 10.12 3.95 10.25 4.88C10.38 5.75 10.61 6.6 10.93 7.41C11.19 8.07 11.04 8.83 10.54 9.33L9.21 10.66C10.58 12.75 12.75 14.92 14.84 16.29L16.17 14.96C16.67 14.46 17.43 14.31 18.09 14.57C18.9 14.89 19.75 15.12 20.62 15.25C21.56 15.38 22.25 16.19 22.24 17.13L22 16.92Z" stroke="currentColor" stroke-width="2"/>
                </svg>
                <a href="tel:${userData.phone}">${userData.phone}</a>
            </div>
        `;

        // 담당 업무
        if (userData.responsibilities) {
            const responsibilitiesContainer = document.getElementById('contactResponsibilities');
            responsibilitiesContainer.innerHTML = userData.responsibilities
                .map(resp => `<div class="responsibility-item">${resp}</div>`)
                .join('');
        }

        // 전문 기술
        if (userData.expertise) {
            const skillsContainer = document.getElementById('contactSkills');
            skillsContainer.innerHTML = userData.expertise
                .map(skill => `<span class="skill-tag">${skill}</span>`)
                .join('');
        }

        // 현재 프로젝트
        if (userData.currentProjects) {
            const projectsContainer = document.getElementById('contactProjects');
            projectsContainer.innerHTML = userData.currentProjects
                .map(project => `
                    <div class="project-item">
                        <div class="project-header">
                            <div class="project-name">${project.name}</div>
                            <span class="project-status ${project.status === '진행중' ? 'progress' : project.status === '계획' ? 'planned' : 'review'}">${project.status}</span>
                        </div>
                        <div class="project-progress">
                            <div class="progress-bar">
                                <div class="progress-fill" style="width: ${project.completion}%"></div>
                            </div>
                            <div class="project-deadline">완료 예정: ${project.deadline}</div>
                        </div>
                    </div>
                `).join('');
        }

        // 업무 스타일
        if (userData.workStyle) {
            const workStyleContainer = document.getElementById('workStyle');
            workStyleContainer.innerHTML = `
                <div class="work-style-item">
                    <div class="work-style-label">선호 소통 방식</div>
                    <div class="work-style-value">${userData.workStyle.communicationPreference}</div>
                </div>
                <div class="work-style-item">
                    <div class="work-style-label">미팅 가능 시간</div>
                    <div class="work-style-value">${userData.workStyle.meetingAvailability}</div>
                </div>
                <div class="work-style-item">
                    <div class="work-style-label">응답 시간</div>
                    <div class="work-style-value">${userData.workStyle.responseTime}</div>
                </div>
            `;
        }
    }

    // 조직도 업데이트
    updateOrganizationChart(contactId) {
        const orgData = window.ORGANIZATION_DATA;
        if (!orgData || !orgData.hierarchy) return;

        const hierarchy = orgData.hierarchy[contactId];
        if (!hierarchy) return;

        const chartContainer = document.getElementById('organizationChart');
        let chartHTML = '';

        // 상급자 정보
        if (hierarchy.managerId) {
            const manager = this.getUserBasicInfo(hierarchy.managerId);
            if (manager) {
                chartHTML += `
                    <div class="org-level">
                        <div class="org-level-title">상급자</div>
                        <div class="org-member" onclick="contactDetailManager.showContactDetail('${manager.id}')">
                            <div class="org-member-avatar">${manager.name.charAt(0)}</div>
                            <div class="org-member-info">
                                <div class="org-member-name">${manager.name}</div>
                                <div class="org-member-position">${manager.position}</div>
                            </div>
                        </div>
                    </div>
                `;
            }
        }

        // 현재 담당자 (본인)
        const currentUser = this.getUserBasicInfo(contactId);
        if (currentUser) {
            chartHTML += `
                <div class="org-level">
                    <div class="org-level-title">현재 담당자</div>
                    <div class="org-member current">
                        <div class="org-member-avatar">${currentUser.name.charAt(0)}</div>
                        <div class="org-member-info">
                            <div class="org-member-name">${currentUser.name}</div>
                            <div class="org-member-position">${currentUser.position}</div>
                        </div>
                    </div>
                </div>
            `;
        }

        // 팀원 정보
        if (hierarchy.teamMembers && hierarchy.teamMembers.length > 0) {
            chartHTML += `
                <div class="org-level">
                    <div class="org-level-title">팀원</div>
            `;
            
            hierarchy.teamMembers.forEach(memberId => {
                const member = this.getUserBasicInfo(memberId);
                if (member) {
                    chartHTML += `
                        <div class="org-member" onclick="contactDetailManager.showContactDetail('${member.id}')">
                            <div class="org-member-avatar">${member.name.charAt(0)}</div>
                            <div class="org-member-info">
                                <div class="org-member-name">${member.name}</div>
                                <div class="org-member-position">${member.position}</div>
                            </div>
                        </div>
                    `;
                }
            });
            
            chartHTML += `</div>`;
        }

        // 부하직원 정보
        if (hierarchy.subordinates && hierarchy.subordinates.length > 0) {
            chartHTML += `
                <div class="org-level">
                    <div class="org-level-title">부하직원</div>
            `;
            
            hierarchy.subordinates.forEach(subordinateId => {
                const subordinate = this.getUserBasicInfo(subordinateId);
                if (subordinate) {
                    chartHTML += `
                        <div class="org-member" onclick="contactDetailManager.showContactDetail('${subordinate.id}')">
                            <div class="org-member-avatar">${subordinate.name.charAt(0)}</div>
                            <div class="org-member-info">
                                <div class="org-member-name">${subordinate.name}</div>
                                <div class="org-member-position">${subordinate.position}</div>
                            </div>
                        </div>
                    `;
                }
            });
            
            chartHTML += `</div>`;
        }

        chartContainer.innerHTML = chartHTML;
    }

    // 사용자 기본 정보 가져오기
    getUserBasicInfo(userId) {
        const users = window.SAMPLE_USERS_DATA?.users || [];
        const managers = window.ORGANIZATION_DATA?.managers || {};
        
        // 먼저 일반 사용자에서 찾기
        let user = users.find(u => u.id === userId);
        
        // 없으면 매니저에서 찾기
        if (!user) {
            user = managers[userId];
        }
        
        return user;
    }

    // 패널 열기
    openPanel() {
        console.log('openPanel 호출됨');
        console.log('패널 엘리먼트:', this.panel);
        console.log('패널이 존재하는가:', !!this.panel);
        
        if (this.panel) {
            console.log('active 클래스 추가 전 클래스:', this.panel.className);
            this.panel.classList.add('active');
            console.log('active 클래스 추가 후 클래스:', this.panel.className);
            
            // 스타일 정보 확인
            const computedStyle = window.getComputedStyle(this.panel);
            console.log('패널 위치 정보:');
            console.log('- right:', computedStyle.right);
            console.log('- width:', computedStyle.width);
            console.log('- height:', computedStyle.height);
            console.log('- z-index:', computedStyle.zIndex);
            console.log('- display:', computedStyle.display);
            console.log('- visibility:', computedStyle.visibility);
            console.log('- position:', computedStyle.position);
            
            document.body.style.overflow = 'hidden'; // 스크롤 방지
            console.log('패널 열기 완료');
        } else {
            console.error('패널 엘리먼트를 찾을 수 없습니다!');
        }
    }

    // 패널 닫기
    closePanel() {
        console.log('closePanel 호출됨!');
        console.trace('closePanel 호출 스택:'); // 호출 스택 추적
        if (this.panel) {
            console.log('패널 닫기 실행됨');
            this.panel.classList.remove('active');
            document.body.style.overflow = ''; // 스크롤 복원
            this.currentContact = null;
        }
    }

    // 문의하기 버튼 클릭 - 채팅 시작
    startChat() {
        if (!this.currentContact) return;
        
        const userData = this.getUserBasicInfo(this.currentContact);
        if (!userData) return;

        // 패널 닫기
        this.closePanel();

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
            
            // AI 응답
            setTimeout(() => {
                const aiResponse = `안녕하세요! ${userData.name} ${userData.position}입니다. 무엇을 도와드릴까요? 😊\n\n제가 담당하고 있는 업무는 다음과 같습니다:\n${userData.responsibilities?.slice(0, 3).map(r => `• ${r}`).join('\n') || '• 담당 업무 정보를 불러오는 중입니다...'}`;
                
                if (typeof addAIResponse === 'function') {
                    addAIResponse(aiResponse);
                }
            }, 1500);
        }, 300);
    }
}

// 전역 인스턴스 생성
const contactDetailManager = new ContactDetailManager();

// 전역에서 사용할 수 있도록 export
if (typeof window !== 'undefined') {
    window.contactDetailManager = contactDetailManager;
}
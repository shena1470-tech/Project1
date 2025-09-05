// User Test 모달 - Figma 디자인 기반 구현
// AI 선택 → AI 테스터 설정 → 선택 완료 → UT 중 대화

class UserTestModal {
    constructor() {
        this.modal = null;
        this.currentStep = 1; // 1: AI선택, 2: 테스터설정, 3: UT대화
        this.selectedAI = null;
        this.testConfig = {
            age: '',
            gender: '',
            digitalLevel: ''
        };
        this.chatHistory = [];
        this.settingsModal = null;
        
        // AI 페르소나 (무한도전 멤버)
        this.aiPersonas = [
            {
                id: 'park-jinhye',
                name: '박진혜',
                age: '54세',
                gender: '여성',
                digitalLevel: '낮음',
                avatar: 'assets/persona-박진혜.png',
                description: '디지털 이해도 낮음'
            },
            {
                id: 'lee-jungeun',
                name: '이정은',
                age: '20세',
                gender: '여성',
                digitalLevel: '높음',
                avatar: 'assets/persona-이정은.png',
                description: '디지털 이해도 높음'
            }
        ];
    }

    open() {
        this.createModal();
        this.renderAISelection();
        document.body.style.overflow = 'hidden';
    }

    close() {
        if (this.modal) {
            this.modal.remove();
            this.modal = null;
        }
        if (this.settingsModal) {
            this.settingsModal.remove();
            this.settingsModal = null;
        }
        
        // 기존 화면 복원
        const welcomeScreen = document.getElementById('welcomeScreen');
        const chatMessages = document.getElementById('chatMessages');
        if (welcomeScreen) welcomeScreen.style.display = 'block';
        if (chatMessages && chatMessages.children.length > 0) {
            chatMessages.style.display = 'block';
        }
        
        document.body.style.overflow = '';
    }

    createModal() {
        // 기존 채팅 영역 숨기기
        const welcomeScreen = document.getElementById('welcomeScreen');
        const chatMessages = document.getElementById('chatMessages');
        if (welcomeScreen) welcomeScreen.style.display = 'none';
        if (chatMessages) chatMessages.style.display = 'none';
        
        // 채팅 영역에 User Test 컨텐츠 추가
        const chatArea = document.getElementById('chatArea');
        if (chatArea) {
            const userTestContainer = document.createElement('div');
            userTestContainer.className = 'user-test-container';
            userTestContainer.id = 'userTestContainer';
            userTestContainer.innerHTML = `
                <div class="user-test-header">
                    <div class="user-test-title">화면 UT를 진행하고싶어.</div>
                </div>
                <div class="user-test-content" id="userTestContent">
                    <!-- 내용이 여기에 렌더링됩니다 -->
                </div>
            `;
            
            chatArea.appendChild(userTestContainer);
            this.modal = userTestContainer;
        }
        
        // 전역 참조 설정
        window.userTestModal = this;
    }

    renderAISelection() {
        const content = document.getElementById('userTestContent');
        content.innerHTML = `
            <div class="ai-selection-container">
                <div class="ai-message-box">
                    <div class="ai-avatar-icon"></div>
                    <div class="ai-message">정확한 UT를 위해 AI테스터를 선택해 주세요.</div>
                </div>
                
                <div class="ai-personas-container">
                    ${this.aiPersonas.map(persona => `
                        <div class="ai-persona-box ${this.selectedAI?.id === persona.id ? 'selected' : ''}" 
                             data-persona-id="${persona.id}">
                            <div class="persona-header">
                                <h3>${persona.name}</h3>
                                <input type="checkbox" 
                                       class="persona-checkbox" 
                                       ${this.selectedAI?.id === persona.id ? 'checked' : ''}
                                       onchange="userTestModal.selectAI('${persona.id}')">
                            </div>
                            <div class="persona-image">
                                <img src="${persona.avatar}" alt="${persona.name}">
                            </div>
                            <div class="persona-info">
                                ${persona.age} ・ ${persona.gender} ・ 디지털 이해도 ${persona.digitalLevel}
                            </div>
                        </div>
                    `).join('')}
                </div>
                
                <div class="action-buttons">
                    <button class="btn-complete ${this.selectedAI ? '' : 'disabled'}" 
                            onclick="userTestModal.proceedToChat()"
                            ${!this.selectedAI ? 'disabled' : ''}>
                        선택 완료
                    </button>
                    <button class="btn-custom" onclick="userTestModal.openSettingsModal()">
                        직접 생성하기
                    </button>
                </div>
            </div>
        `;
    }

    selectAI(personaId) {
        // 기존 선택 해제
        const checkboxes = document.querySelectorAll('.persona-checkbox');
        checkboxes.forEach(cb => {
            cb.checked = false;
            cb.closest('.ai-persona-box').classList.remove('selected');
        });
        
        // 새로운 선택
        const persona = this.aiPersonas.find(p => p.id === personaId);
        if (persona) {
            this.selectedAI = persona;
            const selectedBox = document.querySelector(`[data-persona-id="${personaId}"]`);
            if (selectedBox) {
                selectedBox.classList.add('selected');
                selectedBox.querySelector('.persona-checkbox').checked = true;
            }
            
            // 선택 완료 버튼 활성화
            const completeBtn = document.querySelector('.btn-complete');
            if (completeBtn) {
                completeBtn.classList.remove('disabled');
                completeBtn.disabled = false;
            }
        }
    }

    openSettingsModal() {
        // AI 테스터 설정하기 모달 (중앙에 표시)
        const settingsOverlay = document.createElement('div');
        settingsOverlay.className = 'settings-modal-overlay';
        settingsOverlay.onclick = (e) => {
            if (e.target === settingsOverlay) {
                this.closeSettingsModal();
            }
        };
        
        settingsOverlay.innerHTML = `
            <div class="settings-modal-container">
                <div class="settings-header">
                    <h2>AI 테스터 설정하기</h2>
                    <button class="close-btn" onclick="userTestModal.closeSettingsModal()">
                        <img src="assets/icons/close-icon.svg" alt="닫기">
                    </button>
                </div>
                
                <div class="settings-content">
                    <div class="setting-group">
                        <label>연령</label>
                        <div class="option-buttons">
                            <button class="option-btn" data-value="10대">10대</button>
                            <button class="option-btn" data-value="20대">20대</button>
                            <button class="option-btn" data-value="30대">30대</button>
                            <button class="option-btn" data-value="40대">40대</button>
                        </div>
                        <div class="option-buttons">
                            <button class="option-btn" data-value="50대">50대</button>
                            <button class="option-btn" data-value="60대">60대</button>
                            <button class="option-btn" data-value="70대이상">70대 이상</button>
                        </div>
                    </div>
                    
                    <div class="setting-group">
                        <label>성별</label>
                        <div class="option-buttons">
                            <button class="option-btn" data-value="여성">여성</button>
                            <button class="option-btn" data-value="남성">남성</button>
                        </div>
                    </div>
                    
                    <div class="setting-group">
                        <label>디지털 친숙도</label>
                        <div class="option-buttons">
                            <button class="option-btn" data-value="상">상</button>
                            <button class="option-btn" data-value="중">중</button>
                            <button class="option-btn" data-value="하">하</button>
                        </div>
                    </div>
                </div>
                
                <div class="settings-footer">
                    <button class="btn-setting-complete" onclick="userTestModal.applySettings()">
                        설정 완료
                    </button>
                </div>
            </div>
        `;
        
        document.body.appendChild(settingsOverlay);
        this.settingsModal = settingsOverlay;
        
        // 옵션 버튼 클릭 이벤트 바인딩
        this.bindSettingsEvents();
    }

    bindSettingsEvents() {
        const settingGroups = this.settingsModal.querySelectorAll('.setting-group');
        
        settingGroups.forEach(group => {
            const buttons = group.querySelectorAll('.option-btn');
            buttons.forEach(btn => {
                btn.addEventListener('click', () => {
                    // 같은 그룹 내 다른 버튼 선택 해제
                    buttons.forEach(b => b.classList.remove('selected'));
                    // 현재 버튼 선택
                    btn.classList.add('selected');
                    
                    // 설정 값 저장
                    const label = group.querySelector('label').textContent;
                    if (label === '연령') {
                        this.testConfig.age = btn.dataset.value;
                    } else if (label === '성별') {
                        this.testConfig.gender = btn.dataset.value;
                    } else if (label === '디지털 친숙도') {
                        this.testConfig.digitalLevel = btn.dataset.value;
                    }
                });
            });
        });
    }

    closeSettingsModal() {
        if (this.settingsModal) {
            this.settingsModal.remove();
            this.settingsModal = null;
        }
    }

    applySettings() {
        if (!this.testConfig.age || !this.testConfig.gender || !this.testConfig.digitalLevel) {
            alert('모든 항목을 선택해주세요.');
            return;
        }
        
        // 커스텀 AI 생성
        this.selectedAI = {
            id: 'custom',
            name: '커스텀 테스터',
            age: this.testConfig.age,
            gender: this.testConfig.gender,
            digitalLevel: this.testConfig.digitalLevel,
            avatar: 'assets/avatar-placeholder.png',
            description: `${this.testConfig.age} ${this.testConfig.gender} · 디지털 이해도 ${this.testConfig.digitalLevel}`
        };
        
        this.closeSettingsModal();
        this.proceedToChat();
    }

    proceedToChat() {
        if (!this.selectedAI) {
            alert('AI를 선택해주세요.');
            return;
        }
        
        // 대화 화면으로 전환
        this.renderChatInterface();
    }

    renderChatInterface() {
        const content = document.getElementById('userTestContent');
        
        // 선택된 AI에 따른 정확한 텍스트 생성
        let testerDescription = '';
        if (this.selectedAI.id === 'park-jinhye') {
            testerDescription = '디지털 이해도가 낮은 54세 여성 박진혜님과 UT중';
        } else if (this.selectedAI.id === 'lee-jungeun') {
            testerDescription = '디지털 이해도가 높은 20세 여성 이정은님과 UT중';
        } else {
            // 커스텀 AI인 경우
            testerDescription = `디지털 이해도가 ${this.selectedAI.digitalLevel === '상' ? '높은' : this.selectedAI.digitalLevel === '하' ? '낮은' : '보통인'} ${this.selectedAI.age} ${this.selectedAI.gender} 테스터와 UT중`;
        }
        
        content.innerHTML = `
            <div class="chat-container">
                <div class="chat-header">
                    <div class="selected-ai-info">
                        <span class="ai-badge"></span>
                        <span>${testerDescription}</span>
                    </div>
                    <button class="end-test-btn" onclick="userTestModal.endTest()">
                        테스트 종료
                    </button>
                </div>
                
                <div class="chat-messages" id="testChatMessages">
                    <div class="ai-initial-message">
                        <div class="message-box">
                            <p>안녕하세요. 진혜님.</p>
                            <p>User Test 진행을 맡은 김동준입니다.</p>
                            <br>
                            <p>평소 사용하시는대로 말씀해 주시면 됩니다.</p>
                            <p>화면에서 고객센터를 한번 찾아주시겠어요?</p>
                            <br>
                            <p>고객센터, ? 고객센터가 어딧죠?</p>
                            <p>아건가? 이거 그림이 무슨 뜻이에요? 상담사모양인가..</p>
                            <br>
                            <p>아 맨 아래에 있나~?</p>
                        </div>
                    </div>
                </div>
                
                <div class="chat-input-container">
                    <input type="text" 
                           id="testChatInput" 
                           placeholder="무엇이든 물어보세요."
                           onkeypress="if(event.key==='Enter') userTestModal.sendMessage()">
                    <button class="send-btn" onclick="userTestModal.sendMessage()">
                        <span>➤</span>
                    </button>
                </div>
            </div>
        `;
    }

    sendMessage() {
        const input = document.getElementById('testChatInput');
        const message = input.value.trim();
        if (!message) return;
        
        // 사용자 메시지 추가
        this.addUserMessage(message);
        input.value = '';
        
        // AI 응답 시뮬레이션
        setTimeout(() => {
            this.addAIResponse(message);
        }, 1000);
    }

    addUserMessage(message) {
        const chatMessages = document.getElementById('testChatMessages');
        const messageDiv = document.createElement('div');
        messageDiv.className = 'user-message';
        messageDiv.innerHTML = `
            <div class="message-box user">
                <p>${message}</p>
            </div>
        `;
        chatMessages.appendChild(messageDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    addAIResponse(userMessage) {
        const chatMessages = document.getElementById('testChatMessages');
        const messageDiv = document.createElement('div');
        messageDiv.className = 'ai-message';
        
        // 간단한 응답 생성
        let response = '';
        if (userMessage.includes('고객센터')) {
            response = '고객센터는 화면 하단에 있는 아이콘을 클릭하시면 됩니다. 찾기 어려우셨나요?';
        } else if (userMessage.includes('어디')) {
            response = '화면 아래쪽을 보시면 물음표 모양 아이콘이 있어요. 그게 고객센터 버튼이에요.';
        } else {
            response = '네, 말씀하신 부분에 대해 확인해보겠습니다. 어떤 점이 불편하셨나요?';
        }
        
        messageDiv.innerHTML = `
            <div class="message-box">
                <p>${response}</p>
            </div>
        `;
        chatMessages.appendChild(messageDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    endTest() {
        if (confirm('테스트를 종료하시겠습니까?\n테스트 결과가 저장됩니다.')) {
            this.close();
        }
    }
}

// 전역 인스턴스 생성 함수
function openUserTestModal() {
    const modal = new UserTestModal();
    modal.open();
}
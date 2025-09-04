// 회의실 예약 UI 컴포넌트
class MeetingReservationUI {
    constructor() {
        this.container = null;
        this.isActive = false;
    }
    
    // 예약 시스템 활성화
    activate(containerElement) {
        this.container = containerElement;
        this.isActive = true;
        this.render();
    }
    
    // 메인 렌더링
    render() {
        if (!this.container) return;
        
        const step = meetingReservation.currentStep;
        
        this.container.innerHTML = `
            <div class="meeting-reservation-container">
                <div class="reservation-header">
                    <h2 class="reservation-title">회의실 예약</h2>
                    <div class="progress-bar">
                        <div class="progress-step ${step === 'participants' ? 'active' : ''} ${this.isStepCompleted('participants') ? 'completed' : ''}">
                            <span class="step-number">1</span>
                            <span class="step-label">참가자</span>
                        </div>
                        <div class="progress-step ${step === 'time' ? 'active' : ''} ${this.isStepCompleted('time') ? 'completed' : ''}">
                            <span class="step-number">2</span>
                            <span class="step-label">시간</span>
                        </div>
                        <div class="progress-step ${step === 'room' ? 'active' : ''} ${this.isStepCompleted('room') ? 'completed' : ''}">
                            <span class="step-number">3</span>
                            <span class="step-label">회의실</span>
                        </div>
                        <div class="progress-step ${step === 'beverage' ? 'active' : ''} ${this.isStepCompleted('beverage') ? 'completed' : ''}">
                            <span class="step-number">4</span>
                            <span class="step-label">음료</span>
                        </div>
                    </div>
                </div>
                
                <div class="reservation-content">
                    ${this.renderCurrentStep()}
                </div>
            </div>
        `;
        
        this.attachEventListeners();
    }
    
    // 현재 단계 렌더링
    renderCurrentStep() {
        switch(meetingReservation.currentStep) {
            case 'participants':
                return this.renderParticipantsStep();
            case 'time':
                return this.renderTimeVotingStep();
            case 'room':
                return this.renderRoomVotingStep();
            case 'beverage':
                return this.renderBeverageStep();
            case 'complete':
                return this.renderCompletionStep();
            default:
                return this.renderParticipantsStep();
        }
    }
    
    // 참가자 추가 단계
    renderParticipantsStep() {
        const participants = meetingReservation.currentReservation.participants;
        
        return `
            <div class="step-container participants-step">
                <h3 class="step-title">회의 참가자를 추가해주세요</h3>
                <p class="step-description">회의에 참석할 직원들을 선택해주세요.</p>
                
                <div class="meeting-title-input">
                    <label>회의 제목</label>
                    <input type="text" 
                           id="meetingTitle" 
                           placeholder="예: 마케팅 전략 회의"
                           value="${meetingReservation.currentReservation.title || ''}"
                           class="form-input">
                </div>
                
                <div class="participant-search">
                    <input type="text" 
                           id="participantSearch" 
                           placeholder="이름으로 검색..."
                           class="search-input">
                    <button onclick="meetingReservationUI.searchParticipants()" class="search-btn">
                        <svg viewBox="0 0 24 24" width="20" height="20">
                            <path d="M21.71 20.29L18 16.61A9 9 0 1 0 16.61 18l3.68 3.68a1 1 0 0 0 1.42 0 1 1 0 0 0 0-1.39zM11 18a7 7 0 1 1 7-7 7 7 0 0 1-7 7z" fill="currentColor"/>
                        </svg>
                    </button>
                </div>
                
                <div id="searchResults" class="search-results"></div>
                
                <div class="selected-participants">
                    <h4>선택된 참가자 (${participants.length}명)</h4>
                    <div class="participants-list">
                        ${participants.map(p => `
                            <div class="participant-item">
                                <div class="participant-info">
                                    <div class="participant-avatar">${p.name[0]}</div>
                                    <div class="participant-details">
                                        <div class="participant-name">${p.name}</div>
                                        <div class="participant-position">${p.position} • ${p.department}</div>
                                    </div>
                                </div>
                                <button onclick="meetingReservationUI.removeParticipant('${p.id}')" class="remove-btn">
                                    <svg viewBox="0 0 24 24" width="16" height="16">
                                        <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" fill="currentColor"/>
                                    </svg>
                                </button>
                            </div>
                        `).join('')}
                    </div>
                </div>
                
                <div class="step-actions">
                    <button onclick="meetingReservationUI.proceedToTimeVoting()" 
                            class="btn-primary ${participants.length < 2 ? 'disabled' : ''}"
                            ${participants.length < 2 ? 'disabled' : ''}>
                        다음 단계 (시간 선택)
                    </button>
                </div>
            </div>
        `;
    }
    
    // 시간 투표 단계
    renderTimeVotingStep() {
        const participants = meetingReservation.currentReservation.participants;
        const timeVotes = meetingReservation.currentReservation.timeVotes;
        const currentUserId = currentUser ? currentUser.id : participants[0]?.id;
        
        return `
            <div class="step-container time-voting-step">
                <h3 class="step-title">회의 시간 투표</h3>
                <p class="step-description">가능한 시간을 모두 선택해주세요. (복수 선택 가능)</p>
                
                <div class="voting-container">
                    <div class="voter-tabs">
                        ${participants.map((p, index) => `
                            <button class="voter-tab ${p.id === currentUserId ? 'active' : ''} ${timeVotes[p.id]?.length > 0 ? 'voted' : ''}"
                                    onclick="meetingReservationUI.switchVoter('${p.id}')">
                                <span class="voter-name">${p.name}</span>
                                ${timeVotes[p.id]?.length > 0 ? '<span class="check-mark">✓</span>' : ''}
                            </button>
                        `).join('')}
                    </div>
                    
                    <div class="time-slots-grid" id="timeSlotsGrid">
                        ${this.renderTimeSlots(currentUserId)}
                    </div>
                    
                    <div class="voting-status">
                        <p>${this.getVotingStatus()}</p>
                    </div>
                </div>
                
                <div class="step-actions">
                    <button onclick="meetingReservationUI.submitTimeVote('${currentUserId}')" 
                            class="btn-primary">
                        투표 완료
                    </button>
                </div>
            </div>
        `;
    }
    
    // 시간 슬롯 렌더링
    renderTimeSlots(userId) {
        const selectedTimes = meetingReservation.currentReservation.timeVotes[userId] || [];
        
        return meetingReservation.timeSlots.map(slot => `
            <label class="time-slot ${selectedTimes.includes(slot.id) ? 'selected' : ''}">
                <input type="checkbox" 
                       value="${slot.id}"
                       ${selectedTimes.includes(slot.id) ? 'checked' : ''}
                       onchange="meetingReservationUI.toggleTimeSlot('${userId}', '${slot.id}')">
                <span class="time-display">${slot.display}</span>
            </label>
        `).join('');
    }
    
    // 회의실 투표 단계
    renderRoomVotingStep() {
        const participants = meetingReservation.currentReservation.participants;
        const roomVotes = meetingReservation.currentReservation.roomVotes;
        const selectedTime = meetingReservation.currentReservation.selectedTime;
        const currentUserId = currentUser ? currentUser.id : participants[0]?.id;
        
        return `
            <div class="step-container room-voting-step">
                <h3 class="step-title">회의실 선택</h3>
                <p class="step-description">
                    선택된 시간: <strong>${selectedTime}</strong><br>
                    희망하는 회의실을 선택해주세요.
                </p>
                
                <div class="voting-container">
                    <div class="voter-tabs">
                        ${participants.map((p, index) => `
                            <button class="voter-tab ${p.id === currentUserId ? 'active' : ''} ${roomVotes[p.id] ? 'voted' : ''}"
                                    onclick="meetingReservationUI.switchVoter('${p.id}')">
                                <span class="voter-name">${p.name}</span>
                                ${roomVotes[p.id] ? '<span class="check-mark">✓</span>' : ''}
                            </button>
                        `).join('')}
                    </div>
                    
                    <div class="rooms-grid" id="roomsGrid">
                        ${this.renderRooms(currentUserId)}
                    </div>
                </div>
                
                <div class="step-actions">
                    <button onclick="meetingReservationUI.submitRoomVote('${currentUserId}')" 
                            class="btn-primary">
                        투표 완료
                    </button>
                </div>
            </div>
        `;
    }
    
    // 회의실 목록 렌더링
    renderRooms(userId) {
        const selectedRoom = meetingReservation.currentReservation.roomVotes[userId];
        
        return meetingReservation.availableRooms.map(room => `
            <div class="room-card ${selectedRoom === room.id ? 'selected' : ''}"
                 onclick="meetingReservationUI.selectRoom('${userId}', '${room.id}')">
                <div class="room-header">
                    <h4 class="room-name">${room.name}</h4>
                    <span class="room-capacity">${room.capacity}인</span>
                </div>
                <div class="room-details">
                    <p class="room-floor">${room.floor}</p>
                    <div class="room-equipment">
                        ${room.equipment.map(eq => `<span class="equipment-tag">${eq}</span>`).join('')}
                    </div>
                </div>
            </div>
        `).join('');
    }
    
    // 음료 선택 단계
    renderBeverageStep() {
        const participants = meetingReservation.currentReservation.participants;
        const beverageOrders = meetingReservation.currentReservation.beverageOrders;
        const currentUserId = currentUser ? currentUser.id : participants[0]?.id;
        
        return `
            <div class="step-container beverage-step">
                <h3 class="step-title">음료 선택</h3>
                <p class="step-description">회의에서 제공할 음료를 선택해주세요.</p>
                
                <div class="voting-container">
                    <div class="voter-tabs">
                        ${participants.map((p, index) => `
                            <button class="voter-tab ${p.id === currentUserId ? 'active' : ''} ${beverageOrders[p.id] ? 'ordered' : ''}"
                                    onclick="meetingReservationUI.switchVoter('${p.id}')">
                                <span class="voter-name">${p.name}</span>
                                ${beverageOrders[p.id] ? '<span class="check-mark">✓</span>' : ''}
                            </button>
                        `).join('')}
                    </div>
                    
                    <div class="beverages-grid" id="beveragesGrid">
                        ${this.renderBeverages(currentUserId)}
                    </div>
                </div>
                
                <div class="step-actions">
                    <button onclick="meetingReservationUI.submitBeverageOrder('${currentUserId}')" 
                            class="btn-primary">
                        주문 완료
                    </button>
                </div>
            </div>
        `;
    }
    
    // 음료 목록 렌더링
    renderBeverages(userId) {
        const currentOrder = meetingReservation.currentReservation.beverageOrders[userId];
        
        return meetingReservation.beverages.map(beverage => `
            <div class="beverage-card">
                <div class="beverage-header" onclick="meetingReservationUI.selectBeverage('${userId}', '${beverage.id}')">
                    <span class="beverage-icon">${beverage.icon}</span>
                    <span class="beverage-name">${beverage.name}</span>
                </div>
                <div class="beverage-variants ${currentOrder?.beverageId === beverage.id ? 'show' : ''}">
                    ${beverage.variants.map(variant => `
                        <button class="variant-btn ${currentOrder?.beverageId === beverage.id && currentOrder?.variant === variant ? 'selected' : ''}"
                                onclick="meetingReservationUI.selectVariant('${userId}', '${beverage.id}', '${variant}')">
                            ${variant}
                        </button>
                    `).join('')}
                </div>
            </div>
        `).join('');
    }
    
    // 완료 단계
    renderCompletionStep() {
        const summary = meetingReservation.getReservationSummary();
        
        return `
            <div class="step-container completion-step">
                <div class="success-icon">✅</div>
                <h3 class="step-title">회의실 예약이 완료되었습니다!</h3>
                
                <div class="reservation-summary">
                    <div class="summary-item">
                        <label>회의 제목</label>
                        <p>${summary.title || '팀 회의'}</p>
                    </div>
                    
                    <div class="summary-item">
                        <label>참석자</label>
                        <p>${summary.participants.map(p => p.name).join(', ')} (${summary.participants.length}명)</p>
                    </div>
                    
                    <div class="summary-item">
                        <label>시간</label>
                        <p>${summary.time}</p>
                    </div>
                    
                    <div class="summary-item">
                        <label>장소</label>
                        <p>${summary.room.name} (${summary.room.floor})</p>
                    </div>
                    
                    <div class="summary-item">
                        <label>음료 주문</label>
                        <div class="beverage-summary">
                            ${Object.entries(summary.beverageOrders).map(([key, count]) => {
                                const [beverageId, variant] = key.split('-');
                                const beverage = meetingReservation.beverages.find(b => b.id === beverageId);
                                return `<p>${beverage.icon} ${variant} x ${count}</p>`;
                            }).join('')}
                        </div>
                    </div>
                </div>
                
                <div class="step-actions">
                    <button onclick="meetingReservationUI.startNewReservation()" class="btn-primary">
                        새 회의 예약
                    </button>
                    <button onclick="meetingReservationUI.close()" class="btn-secondary">
                        닫기
                    </button>
                </div>
            </div>
        `;
    }
    
    // 참가자 검색
    searchParticipants() {
        const searchInput = document.getElementById('participantSearch');
        const searchResults = document.getElementById('searchResults');
        const query = searchInput.value.trim().toLowerCase();
        
        if (!query) {
            searchResults.innerHTML = '';
            return;
        }
        
        // 전체 유저 목록에서 검색 (이미 추가된 사용자 제외)
        const existingIds = meetingReservation.currentReservation.participants.map(p => p.id);
        const results = usersData.filter(user => 
            !existingIds.includes(user.id) && 
            user.name.toLowerCase().includes(query)
        );
        
        searchResults.innerHTML = results.map(user => `
            <div class="search-result-item" onclick="meetingReservationUI.addParticipant('${user.id}')">
                <div class="user-avatar">${user.name[0]}</div>
                <div class="user-info">
                    <div class="user-name">${user.name}</div>
                    <div class="user-position">${user.position} • ${user.department}</div>
                </div>
            </div>
        `).join('');
    }
    
    // 참가자 추가
    addParticipant(userId) {
        const user = usersData.find(u => u.id === userId);
        if (user) {
            meetingReservation.addParticipant(user);
            this.render();
        }
    }
    
    // 참가자 제거
    removeParticipant(userId) {
        meetingReservation.removeParticipant(userId);
        this.render();
    }
    
    // 시간 슬롯 토글
    toggleTimeSlot(userId, timeId) {
        const votes = meetingReservation.currentReservation.timeVotes[userId] || [];
        const index = votes.indexOf(timeId);
        
        if (index > -1) {
            votes.splice(index, 1);
        } else {
            votes.push(timeId);
        }
        
        meetingReservation.currentReservation.timeVotes[userId] = votes;
        meetingReservation.saveToStorage();
    }
    
    // 시간 투표 제출
    submitTimeVote(userId) {
        const votes = meetingReservation.currentReservation.timeVotes[userId] || [];
        if (votes.length === 0) {
            alert('최소 하나의 시간을 선택해주세요.');
            return;
        }
        
        if (meetingReservation.voteForTime(userId, votes)) {
            this.render();
        } else {
            alert('투표가 완료되었습니다. 다른 참가자의 투표를 기다려주세요.');
            // 다음 참가자로 전환
            this.switchToNextVoter(userId);
        }
    }
    
    // 회의실 선택
    selectRoom(userId, roomId) {
        meetingReservation.currentReservation.roomVotes[userId] = roomId;
        meetingReservation.saveToStorage();
        
        // UI 업데이트
        document.querySelectorAll('.room-card').forEach(card => {
            card.classList.remove('selected');
        });
        event.currentTarget.classList.add('selected');
    }
    
    // 회의실 투표 제출
    submitRoomVote(userId) {
        const roomId = meetingReservation.currentReservation.roomVotes[userId];
        if (!roomId) {
            alert('회의실을 선택해주세요.');
            return;
        }
        
        if (meetingReservation.voteForRoom(userId, roomId)) {
            this.render();
        } else {
            alert('투표가 완료되었습니다. 다른 참가자의 투표를 기다려주세요.');
            this.switchToNextVoter(userId);
        }
    }
    
    // 음료 선택
    selectBeverage(userId, beverageId) {
        // 모든 variants 숨기기
        document.querySelectorAll('.beverage-variants').forEach(v => {
            v.classList.remove('show');
        });
        
        // 선택한 음료의 variants 표시
        event.currentTarget.nextElementSibling.classList.add('show');
    }
    
    // 음료 변형 선택
    selectVariant(userId, beverageId, variant) {
        meetingReservation.currentReservation.beverageOrders[userId] = {
            beverageId: beverageId,
            variant: variant
        };
        meetingReservation.saveToStorage();
        
        // UI 업데이트
        document.querySelectorAll('.variant-btn').forEach(btn => {
            btn.classList.remove('selected');
        });
        event.currentTarget.classList.add('selected');
    }
    
    // 음료 주문 제출
    submitBeverageOrder(userId) {
        const order = meetingReservation.currentReservation.beverageOrders[userId];
        if (!order) {
            alert('음료를 선택해주세요.');
            return;
        }
        
        if (meetingReservation.orderBeverage(userId, order.beverageId, order.variant)) {
            this.render();
        } else {
            alert('주문이 완료되었습니다. 다른 참가자의 주문을 기다려주세요.');
            this.switchToNextVoter(userId);
        }
    }
    
    // 투표자 전환
    switchVoter(userId) {
        // 탭 활성화 업데이트
        document.querySelectorAll('.voter-tab').forEach(tab => {
            tab.classList.remove('active');
        });
        event.currentTarget.classList.add('active');
        
        // 해당 유저의 선택 상태로 UI 업데이트
        if (meetingReservation.currentStep === 'time') {
            document.getElementById('timeSlotsGrid').innerHTML = this.renderTimeSlots(userId);
        } else if (meetingReservation.currentStep === 'room') {
            document.getElementById('roomsGrid').innerHTML = this.renderRooms(userId);
        } else if (meetingReservation.currentStep === 'beverage') {
            document.getElementById('beveragesGrid').innerHTML = this.renderBeverages(userId);
        }
    }
    
    // 다음 투표자로 전환
    switchToNextVoter(currentUserId) {
        const participants = meetingReservation.currentReservation.participants;
        const currentIndex = participants.findIndex(p => p.id === currentUserId);
        const nextIndex = (currentIndex + 1) % participants.length;
        const nextUser = participants[nextIndex];
        
        if (nextUser) {
            this.switchVoter(nextUser.id);
            
            // 탭 업데이트
            document.querySelectorAll('.voter-tab').forEach((tab, index) => {
                tab.classList.toggle('active', index === nextIndex);
            });
        }
    }
    
    // 시간 투표로 진행
    proceedToTimeVoting() {
        const title = document.getElementById('meetingTitle').value.trim();
        if (!title) {
            alert('회의 제목을 입력해주세요.');
            return;
        }
        
        meetingReservation.currentReservation.title = title;
        meetingReservation.currentStep = 'time';
        meetingReservation.saveToStorage();
        this.render();
    }
    
    // 투표 상태 확인
    getVotingStatus() {
        const participants = meetingReservation.currentReservation.participants;
        const votes = meetingReservation.currentReservation.timeVotes;
        const voted = participants.filter(p => votes[p.id] && votes[p.id].length > 0);
        
        return `투표 현황: ${voted.length}/${participants.length}명 완료`;
    }
    
    // 단계 완료 여부 확인
    isStepCompleted(step) {
        switch(step) {
            case 'participants':
                return meetingReservation.currentReservation.participants.length > 0;
            case 'time':
                return meetingReservation.currentReservation.selectedTime !== null;
            case 'room':
                return meetingReservation.currentReservation.selectedRoom !== null;
            case 'beverage':
                return meetingReservation.currentStep === 'complete';
            default:
                return false;
        }
    }
    
    // 새 예약 시작
    startNewReservation() {
        meetingReservation.initializeNewReservation();
        meetingReservation.currentStep = 'participants';
        this.render();
    }
    
    // 닫기
    close() {
        this.isActive = false;
        if (this.container) {
            this.container.innerHTML = '';
        }
        
        // 채팅 화면으로 돌아가기
        if (typeof renderAIMessage === 'function') {
            renderAIMessage('회의실 예약이 완료되었습니다. 다른 도움이 필요하시면 말씀해주세요.');
        }
    }
    
    // 이벤트 리스너 등록
    attachEventListeners() {
        // Enter 키로 검색
        const searchInput = document.getElementById('participantSearch');
        if (searchInput) {
            searchInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    this.searchParticipants();
                }
            });
        }
    }
}

// 전역 인스턴스 생성
const meetingReservationUI = new MeetingReservationUI();
// 회의실 예약 모달 컴포넌트
class MeetingModal {
    constructor() {
        this.modal = null;
        this.overlay = null;
        this.participants = [];
        this.selectedRoom = '8층 - E1 - 중회의실';
        this.selectedDate = new Date();
        this.selectedTime = '09:00';
        this.selectedDuration = '1시간';
    }

    // 모달 열기
    open() {
        this.createModal();
        document.body.appendChild(this.overlay);
        document.body.appendChild(this.modal);
        
        // 애니메이션을 위한 딜레이
        setTimeout(() => {
            this.overlay.classList.add('active');
            this.modal.classList.add('active');
        }, 10);
    }

    // 모달 생성
    createModal() {
        // 오버레이 생성
        this.overlay = document.createElement('div');
        this.overlay.className = 'modal-overlay';
        this.overlay.onclick = () => this.close();

        // 모달 컨테이너 생성
        this.modal = document.createElement('div');
        this.modal.className = 'meeting-modal';
        
        // 초기 참석자 설정
        this.participants = [
            { id: 1, name: '정준하 과장', position: '과장', department: '마케팅팀' },
            { id: 2, name: '박명수 차장', position: '차장', department: '기획팀' },
            { id: 3, name: '김동준 과장', position: '과장', department: 'IT팀' },
            { id: 4, name: '하동훈 사원', position: '사원', department: '영업팀' },
            { id: 5, name: '이정은 대리', position: '대리', department: '인사팀' }
        ];

        this.modal.innerHTML = `
            <div class="modal-header">
                <h2 class="modal-title">회의실 예약</h2>
                <button class="modal-close" onclick="meetingModal.close()">
                    <img src="assets/icons/close.svg" alt="닫기">
                </button>
            </div>
            
            <div class="modal-subtitle">
                차례대로 입력해 주세요.<br>
                참석자 모두 가능한 날짜와 시간과 예약 가능한 회의실을 알려드려요.
            </div>
            
            <div class="modal-body">
                <!-- 참석자 필드 -->
                <div class="form-field">
                    <label class="field-label">참석자</label>
                    <div class="participants-select" onclick="meetingModal.toggleParticipantsList()">
                        <div class="participants-tags">
                            ${this.participants.map(p => `
                                <span class="participant-tag">${p.name}</span>
                            `).join('')}
                        </div>
                        <img src="assets/icons/arrow-down.svg" alt="펼치기" class="select-arrow">
                    </div>
                </div>
                
                <!-- 회의실 필드 -->
                <div class="form-field">
                    <label class="field-label">회의실</label>
                    <div class="select-field" onclick="meetingModal.toggleRoomList()">
                        <span class="select-value">${this.selectedRoom}</span>
                        <img src="assets/icons/arrow-down.svg" alt="펼치기" class="select-arrow">
                    </div>
                </div>
                
                <!-- 날짜 필드 -->
                <div class="form-field">
                    <label class="field-label">날짜</label>
                    <div class="select-field" onclick="meetingModal.openCalendar()">
                        <span class="select-value">${this.formatDate(this.selectedDate)}</span>
                        <img src="assets/icons/calendar.svg" alt="캘린더" class="select-arrow">
                    </div>
                </div>
                
                <!-- 시작 시간 필드 -->
                <div class="form-field">
                    <div class="time-field-header">
                        <label class="field-label">시작 시간</label>
                        <div class="duration-select" onclick="meetingModal.toggleDuration()">
                            <span class="duration-value">${this.selectedDuration}</span>
                            <img src="assets/icons/arrow-down.svg" alt="펼치기" class="select-arrow">
                        </div>
                    </div>
                    <div class="time-slots">
                        ${this.renderTimeSlots()}
                    </div>
                </div>
            </div>
            
            <div class="modal-footer">
                <button class="btn-secondary" onclick="meetingModal.quickReserve()">
                    바로 예약하기
                </button>
                <button class="btn-primary" onclick="meetingModal.sendVote()">
                    참석자 확인 투표 보내기
                </button>
            </div>
        `;
    }

    // 시간 슬롯 렌더링
    renderTimeSlots() {
        const times = ['09:00', '10:00', '12:00', '17:00'];
        return times.map(time => `
            <button class="time-slot ${time === this.selectedTime ? 'active' : ''}" 
                    onclick="meetingModal.selectTime('${time}')">
                ${time}
            </button>
        `).join('');
    }

    // 날짜 포맷
    formatDate(date) {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const weekday = ['일', '월', '화', '수', '목', '금', '토'][date.getDay()];
        return `${year}. ${month}. ${day}. (${weekday})`;
    }

    // 시간 선택
    selectTime(time) {
        this.selectedTime = time;
        
        // 모든 시간 슬롯의 active 클래스 제거
        document.querySelectorAll('.time-slot').forEach(slot => {
            slot.classList.remove('active');
        });
        
        // 선택된 시간 슬롯에 active 클래스 추가
        event.target.classList.add('active');
    }

    // 참석자 목록 토글
    toggleParticipantsList() {
        // 추가 구현 필요
        console.log('참석자 목록 토글');
    }

    // 회의실 목록 토글
    toggleRoomList() {
        // 추가 구현 필요
        console.log('회의실 목록 토글');
    }

    // 캘린더 열기
    openCalendar() {
        // 추가 구현 필요
        console.log('캘린더 열기');
    }

    // 회의 시간 토글
    toggleDuration() {
        // 추가 구현 필요
        console.log('회의 시간 토글');
    }

    // 바로 예약
    quickReserve() {
        const reservation = {
            participants: this.participants,
            room: this.selectedRoom,
            date: this.formatDate(this.selectedDate),
            time: this.selectedTime,
            duration: this.selectedDuration
        };
        
        console.log('예약 정보:', reservation);
        this.showSuccessMessage('회의실이 예약되었습니다!');
        
        setTimeout(() => {
            this.close();
        }, 2000);
    }

    // 투표 보내기
    sendVote() {
        const voteData = {
            participants: this.participants,
            room: this.selectedRoom,
            date: this.formatDate(this.selectedDate),
            time: this.selectedTime,
            duration: this.selectedDuration
        };
        
        console.log('투표 데이터:', voteData);
        this.showSuccessMessage('참석자들에게 확인 요청을 보냈습니다!');
        
        setTimeout(() => {
            this.close();
        }, 2000);
    }

    // 성공 메시지 표시
    showSuccessMessage(message) {
        const successDiv = document.createElement('div');
        successDiv.className = 'success-message';
        successDiv.textContent = message;
        this.modal.appendChild(successDiv);
    }

    // 모달 닫기
    close() {
        if (this.overlay) {
            this.overlay.classList.remove('active');
            this.modal.classList.remove('active');
            
            setTimeout(() => {
                if (this.overlay && this.overlay.parentNode) {
                    this.overlay.parentNode.removeChild(this.overlay);
                }
                if (this.modal && this.modal.parentNode) {
                    this.modal.parentNode.removeChild(this.modal);
                }
            }, 300);
        }
    }
}

// 전역 인스턴스 생성
const meetingModal = new MeetingModal();
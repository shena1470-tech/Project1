// 회의실 예약 모달 - 피그마 디자인 기반 구현
class MeetingModal {
    constructor() {
        this.modal = null;
        this.selectedAttendees = [];
        this.selectedRoom = null;
        this.selectedDate = this.getToday();
        this.selectedTime = '09:00';
        this.selectedDuration = '1시간';
        this.isVoteMode = false; // false: 바로 예약, true: 투표 모드
        this.meetingOptions = []; // 필터링된 회의 옵션들
        
        // MEETING_ROOMS 데이터에서 회의실 목록 가져오기
        this.floorEightRooms = [];
        this.otherRooms = [];
        
        // MEETING_ROOMS가 정의되어 있으면 사용
        if (typeof MEETING_ROOMS !== 'undefined') {
            // 8층 회의실
            this.floorEightRooms = MEETING_ROOMS
                .filter(room => room.floor === 8)
                .map(room => room.name);
            
            // 기타 층 회의실 (8층 제외)
            this.otherRooms = MEETING_ROOMS
                .filter(room => room.floor !== 8)
                .map(room => room.name);
        } else {
            // 백업 데이터 (MEETING_ROOMS가 없는 경우)
            this.floorEightRooms = [
                '8층 - E1 - 중회의실',
                '8층 - E2 - 소회의실', 
                '8층 - E3 - 대회의실',
                '8층 - W1 - 중회의실',
                '8층 - W2 - 소회의실'
            ];
            
            this.otherRooms = [
                '12층 - 대회의실',
                '10층 - 중회의실',
                '5층 - 소회의실'
            ];
        }
        
        // 전체 회의실 목록
        this.rooms = [...this.floorEightRooms, ...this.otherRooms];
        
        // 참석자 목록
        this.attendees = [
            { id: 'user-002', name: '정준하', position: '과장' },
            { id: 'user-003', name: '박명수', position: '차장' },
            { id: 'user-001', name: '김동준', position: '과장' },
            { id: 'user-004', name: '하동훈', position: '사원' },
            { id: 'user-005', name: '이정은', position: '대리' }
        ];
        
        // 시간 슬롯 (30분 단위)
        this.timeSlots = [
            '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
            '12:00', '12:30', '13:00', '13:30', '14:00', '14:30',
            '15:00', '15:30', '16:00', '16:30', '17:00', '17:30'
        ];
    }
    
    getToday() {
        const today = new Date();
        const year = today.getFullYear();
        const month = String(today.getMonth() + 1).padStart(2, '0');
        const day = String(today.getDate()).padStart(2, '0');
        const weekDays = ['일', '월', '화', '수', '목', '금', '토'];
        const dayOfWeek = weekDays[today.getDay()];
        return `${year}. ${month}. ${day}. (${dayOfWeek})`;
    }
    
    open() {
        this.createModal();
        document.body.style.overflow = 'hidden';
    }
    
    close() {
        if (this.modal) {
            this.modal.remove();
            this.modal = null;
            document.body.style.overflow = '';
        }
    }
    
    createModal() {
        // 오버레이 생성
        const overlay = document.createElement('div');
        overlay.className = 'meeting-modal-overlay';
        overlay.onclick = () => this.close();
        
        // 모달 컨테이너 생성
        const modalContainer = document.createElement('div');
        modalContainer.className = 'meeting-modal-container';
        modalContainer.onclick = (e) => e.stopPropagation();
        
        // 모달 헤더
        const header = document.createElement('div');
        header.className = 'meeting-modal-header';
        header.innerHTML = `
            <div class="meeting-modal-title-section">
                <h2 class="meeting-modal-title">회의실 예약</h2>
                <button class="meeting-modal-close" aria-label="닫기">
                    <img src="assets/icons/close.svg" alt="">
                </button>
            </div>
            <p class="meeting-modal-subtitle">
                차례대로 입력해 주세요.<br>
                참석자 모두 가능한 날짜와 시간과 예약 가능한 회의실을 알려드려요.
            </p>
        `;
        
        // 닫기 버튼 이벤트
        header.querySelector('.meeting-modal-close').onclick = () => this.close();
        
        // 모달 바디
        const body = document.createElement('div');
        body.className = 'meeting-modal-body';
        
        // 참석자 필드
        const attendeesField = this.createAttendeesField();
        body.appendChild(attendeesField);
        
        // 회의실 필드
        const roomField = this.createRoomField();
        body.appendChild(roomField);
        
        // 날짜 필드
        const dateField = this.createDateField();
        body.appendChild(dateField);
        
        // 시작 시간 필드
        const timeField = this.createTimeField();
        body.appendChild(timeField);
        
        // 하단 버튼 영역
        const footer = document.createElement('div');
        footer.className = 'meeting-modal-footer';
        footer.innerHTML = `
            <div class="meeting-modal-footer-gradient"></div>
            <div class="meeting-modal-buttons">
                <button class="meeting-modal-button meeting-modal-button-secondary" id="directReserveBtn">
                    바로 예약하기
                </button>
                <button class="meeting-modal-button meeting-modal-button-primary" id="sendVoteBtn">
                    참석자 확인 투표 보내기
                </button>
            </div>
        `;
        
        // 버튼 이벤트
        footer.querySelector('#directReserveBtn').onclick = () => this.handleDirectReserve();
        footer.querySelector('#sendVoteBtn').onclick = () => this.handleSendVote();
        
        // 모달 조립
        modalContainer.appendChild(header);
        modalContainer.appendChild(body);
        modalContainer.appendChild(footer);
        overlay.appendChild(modalContainer);
        
        // DOM에 추가
        document.body.appendChild(overlay);
        this.modal = overlay;
    }
    
    createAttendeesField() {
        const field = document.createElement('div');
        field.className = 'meeting-modal-field';
        
        const label = document.createElement('label');
        label.className = 'meeting-modal-label';
        label.textContent = '참석자';
        
        const selectBox = document.createElement('div');
        selectBox.className = 'meeting-modal-select';
        
        const selectedDisplay = document.createElement('div');
        selectedDisplay.className = 'meeting-modal-attendees-display';
        
        // 선택된 참석자들을 태그로 표시
        const updateDisplay = () => {
            if (this.selectedAttendees.length === 0) {
                selectedDisplay.innerHTML = '<span class="meeting-modal-placeholder">참석자를 선택하세요</span>';
            } else {
                selectedDisplay.innerHTML = this.selectedAttendees.map(attendee => 
                    `<span class="meeting-modal-attendee-tag">${attendee.name} ${attendee.position}</span>`
                ).join('');
            }
        };
        
        updateDisplay();
        
        const arrow = document.createElement('img');
        arrow.src = 'assets/icons/arrow-down.svg';
        arrow.className = 'meeting-modal-arrow';
        
        selectBox.appendChild(selectedDisplay);
        selectBox.appendChild(arrow);
        
        // 드롭다운 토글
        selectBox.onclick = () => this.toggleAttendeesDropdown(selectBox, updateDisplay);
        
        field.appendChild(label);
        field.appendChild(selectBox);
        
        return field;
    }
    
    toggleAttendeesDropdown(selectBox, updateDisplay) {
        // 기존 드롭다운이 있으면 제거
        const existing = selectBox.querySelector('.meeting-modal-dropdown');
        if (existing) {
            existing.remove();
            return;
        }
        
        // 드롭다운 생성
        const dropdown = document.createElement('div');
        dropdown.className = 'meeting-modal-dropdown';
        
        this.attendees.forEach(attendee => {
            const option = document.createElement('div');
            option.className = 'meeting-modal-dropdown-option';
            
            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.checked = this.selectedAttendees.some(a => a.id === attendee.id);
            checkbox.onchange = () => {
                if (checkbox.checked) {
                    this.selectedAttendees.push(attendee);
                } else {
                    this.selectedAttendees = this.selectedAttendees.filter(a => a.id !== attendee.id);
                }
                updateDisplay();
            };
            
            const label = document.createElement('label');
            label.innerHTML = `${attendee.name} ${attendee.position}`;
            
            option.appendChild(checkbox);
            option.appendChild(label);
            dropdown.appendChild(option);
        });
        
        selectBox.appendChild(dropdown);
        
        // 외부 클릭시 드롭다운 닫기
        setTimeout(() => {
            const closeDropdown = (e) => {
                if (!selectBox.contains(e.target)) {
                    dropdown.remove();
                    document.removeEventListener('click', closeDropdown);
                }
            };
            document.addEventListener('click', closeDropdown);
        }, 0);
    }
    
    createRoomField() {
        const field = document.createElement('div');
        field.className = 'meeting-modal-field';
        
        const label = document.createElement('label');
        label.className = 'meeting-modal-label';
        label.textContent = '회의실';
        
        const selectBox = document.createElement('div');
        selectBox.className = 'meeting-modal-select';
        selectBox.innerHTML = `
            <span>${this.selectedRoom}</span>
            <img src="assets/icons/arrow-down.svg" class="meeting-modal-arrow">
        `;
        
        // 드롭다운 토글
        selectBox.onclick = () => this.toggleRoomDropdown(selectBox);
        
        field.appendChild(label);
        field.appendChild(selectBox);
        
        return field;
    }
    
    toggleRoomDropdown(selectBox) {
        // 기존 드롭다운이 있으면 제거
        const existing = selectBox.querySelector('.meeting-modal-dropdown');
        if (existing) {
            existing.remove();
            return;
        }
        
        // 드롭다운 생성
        const dropdown = document.createElement('div');
        dropdown.className = 'meeting-modal-dropdown';
        
        this.rooms.forEach(room => {
            const option = document.createElement('div');
            option.className = 'meeting-modal-dropdown-option';
            option.textContent = room;
            option.onclick = () => {
                this.selectedRoom = room;
                selectBox.querySelector('span').textContent = room;
                dropdown.remove();
            };
            dropdown.appendChild(option);
        });
        
        selectBox.appendChild(dropdown);
        
        // 외부 클릭시 드롭다운 닫기
        setTimeout(() => {
            const closeDropdown = (e) => {
                if (!selectBox.contains(e.target)) {
                    dropdown.remove();
                    document.removeEventListener('click', closeDropdown);
                }
            };
            document.addEventListener('click', closeDropdown);
        }, 0);
    }
    
    createDateField() {
        const field = document.createElement('div');
        field.className = 'meeting-modal-field';
        
        const label = document.createElement('label');
        label.className = 'meeting-modal-label';
        label.textContent = '날짜';
        
        const selectBox = document.createElement('div');
        selectBox.className = 'meeting-modal-select';
        selectBox.innerHTML = `
            <span>${this.selectedDate}</span>
            <img src="assets/icons/calendar.svg" class="meeting-modal-arrow">
        `;
        
        // 날짜 선택 기능 (간단한 구현)
        selectBox.onclick = () => {
            // 실제 프로덕션에서는 datepicker 라이브러리 사용
            const newDate = prompt('날짜를 입력하세요 (예: 2025. 09. 03.)', this.selectedDate);
            if (newDate) {
                this.selectedDate = newDate;
                selectBox.querySelector('span').textContent = newDate;
            }
        };
        
        field.appendChild(label);
        field.appendChild(selectBox);
        
        return field;
    }
    
    createTimeField() {
        const field = document.createElement('div');
        field.className = 'meeting-modal-field';
        
        const labelRow = document.createElement('div');
        labelRow.className = 'meeting-modal-label-row';
        
        const label = document.createElement('label');
        label.className = 'meeting-modal-label';
        label.textContent = '시작 시간';
        
        const durationSelect = document.createElement('div');
        durationSelect.className = 'meeting-modal-duration';
        durationSelect.innerHTML = `
            <span>${this.selectedDuration}</span>
            <img src="assets/icons/arrow-down.svg" class="meeting-modal-arrow">
        `;
        
        // 시간 길이 선택
        durationSelect.onclick = () => {
            const durations = ['30분', '1시간', '1시간 30분', '2시간'];
            const dropdown = document.createElement('div');
            dropdown.className = 'meeting-modal-dropdown meeting-modal-dropdown-small';
            
            durations.forEach(duration => {
                const option = document.createElement('div');
                option.className = 'meeting-modal-dropdown-option';
                option.textContent = duration;
                option.onclick = () => {
                    this.selectedDuration = duration;
                    durationSelect.querySelector('span').textContent = duration;
                    dropdown.remove();
                };
                dropdown.appendChild(option);
            });
            
            durationSelect.appendChild(dropdown);
            
            // 외부 클릭시 드롭다운 닫기
            setTimeout(() => {
                const closeDropdown = (e) => {
                    if (!durationSelect.contains(e.target)) {
                        dropdown.remove();
                        document.removeEventListener('click', closeDropdown);
                    }
                };
                document.addEventListener('click', closeDropdown);
            }, 0);
        };
        
        labelRow.appendChild(label);
        labelRow.appendChild(durationSelect);
        
        // 시간 선택 버튼들
        const timeButtons = document.createElement('div');
        timeButtons.className = 'meeting-modal-time-buttons';
        
        this.timeSlots.forEach(time => {
            const button = document.createElement('button');
            button.className = 'meeting-modal-time-button';
            if (time === this.selectedTime) {
                button.classList.add('active');
            }
            button.textContent = time;
            button.onclick = () => {
                // 기존 active 제거
                timeButtons.querySelectorAll('.active').forEach(btn => {
                    btn.classList.remove('active');
                });
                // 새로운 active 추가
                button.classList.add('active');
                this.selectedTime = time;
            };
            timeButtons.appendChild(button);
        });
        
        field.appendChild(labelRow);
        field.appendChild(timeButtons);
        
        return field;
    }
    
    handleDirectReserve() {
        // 바로 예약 처리
        if (this.validateForm()) {
            // 시간 계산
            const [hours, minutes] = this.selectedTime.split(':');
            const startTime = this.selectedTime;
            let endHour = parseInt(hours);
            let endMinute = parseInt(minutes || 0);
            
            // duration 파싱 (예: "1시간", "30분", "1시간 30분")
            const durationMatch = this.selectedDuration.match(/(\d+)시간\s*(\d*)분?|(\d+)분/);
            if (durationMatch) {
                if (durationMatch[1]) {
                    endHour += parseInt(durationMatch[1]);
                    if (durationMatch[2]) {
                        endMinute += parseInt(durationMatch[2]);
                    }
                } else if (durationMatch[3]) {
                    endMinute += parseInt(durationMatch[3]);
                }
            }
            
            // 분이 60을 넘으면 시간으로 변환
            if (endMinute >= 60) {
                endHour += Math.floor(endMinute / 60);
                endMinute = endMinute % 60;
            }
            
            const endTime = `${String(endHour).padStart(2, '0')}:${String(endMinute).padStart(2, '0')}`;
            
            // selectedDate를 ISO 형식으로 변환 ("2025. 09. 05. (금)" -> "2025-09-05")
            const dateMatch = this.selectedDate.match(/(\d{4})\.\s*(\d{2})\.\s*(\d{2})/);
            let isoDate = this.selectedDate;
            if (dateMatch) {
                isoDate = `${dateMatch[1]}-${dateMatch[2]}-${dateMatch[3]}`;
            }
            
            const reservationData = {
                id: `meeting_${Date.now()}`,
                title: '회의',
                date: isoDate,
                startTime: startTime,
                endTime: endTime,
                time: startTime, // 호환성을 위해 추가
                location: this.selectedRoom,
                roomId: `room_${this.selectedRoom.replace(/\s+/g, '_')}`,
                participants: this.selectedAttendees.map(a => a.name),
                attendees: this.selectedAttendees,
                type: 'meeting',
                userId: window.storageManager?.getCurrentUserId() || 'user_001',
                createdAt: new Date().toISOString()
            };
            
            // localStorage에 저장
            const existingReservations = JSON.parse(localStorage.getItem('meeting_reservations') || '[]');
            existingReservations.push(reservationData);
            localStorage.setItem('meeting_reservations', JSON.stringify(existingReservations));
            
            // calendarManager가 있으면 갱신
            if (window.calendarManager) {
                window.calendarManager.loadSchedules();
                window.calendarManager.render();
            }
            
            // 토스트 알림 표시
            try {
                console.log('Attempting to show toast...');
                if (typeof showMeetingSuccessToast === 'function') {
                    console.log('showMeetingSuccessToast function found, calling...');
                    showMeetingSuccessToast({
                        room: this.selectedRoom,
                        date: this.selectedDate,
                        time: this.selectedTime,
                        attendees: this.selectedAttendees
                    });
                    console.log('showMeetingSuccessToast called successfully');
                } else {
                    console.error('showMeetingSuccessToast function not found!');
                    console.log('Available functions:', window.showMeetingSuccessToast);
                    
                    // 백업 토스트 표시 방법
                    if (window.toastManager) {
                        console.log('Using toastManager as backup...');
                        window.toastManager.showMeetingSuccess();
                    } else {
                        console.error('No toast manager available');
                        // 최후의 수단으로 간단한 토스트 생성
                        this.showFallbackToast();
                    }
                }
            } catch (error) {
                console.error('Error showing toast:', error);
                this.showFallbackToast();
            }
            
            console.log('Reservation data:', reservationData);
            
            // 모달 닫기
            this.close();
            
            // 채팅에 예약 완료 메시지 추가
            if (typeof addAIResponse === 'function') {
                addAIResponse(`회의실이 예약되었습니다.\n\n📍 회의실: ${this.selectedRoom}\n📅 날짜: ${this.selectedDate}\n⏰ 시간: ${this.selectedTime} (${this.selectedDuration})\n👥 참석자: ${this.selectedAttendees.map(a => a.name + ' ' + a.position).join(', ')}`);
            }
        }
    }
    
    handleSendVote() {
        // 투표 보내기 처리
        if (this.validateForm()) {
            const voteData = {
                attendees: this.selectedAttendees,
                room: this.selectedRoom,
                date: this.selectedDate,
                time: this.selectedTime,
                duration: this.selectedDuration
            };
            
            // 투표 발송 메시지
            alert('참석자들에게 투표 요청을 보냈습니다.');
            console.log('Vote data:', voteData);
            
            // 모달 닫기
            this.close();
            
            // 채팅에 투표 발송 메시지 추가
            if (typeof addAIResponse === 'function') {
                addAIResponse(`참석자들에게 회의 일정 투표를 보냈습니다.\n\n📍 회의실: ${this.selectedRoom}\n📅 날짜: ${this.selectedDate}\n⏰ 시간: ${this.selectedTime} (${this.selectedDuration})\n👥 참석자: ${this.selectedAttendees.map(a => a.name + ' ' + a.position).join(', ')}\n\n참석자들의 응답을 기다리고 있습니다.`);
            }
        }
    }
    
    validateForm() {
        if (this.selectedAttendees.length === 0) {
            alert('참석자를 선택해주세요.');
            return false;
        }
        return true;
    }
}

// 전역 인스턴스 생성
let meetingModal = null;

// 회의실 예약 모달 열기
function openMeetingModal() {
    if (!meetingModal) {
        meetingModal = new MeetingModal();
    }
    meetingModal.open();
}

// 외부에서 사용할 수 있도록 전역 함수로 노출
window.openMeetingModal = openMeetingModal;
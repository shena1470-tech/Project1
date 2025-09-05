/**
 * 캘린더 관리 시스템
 * 개인 일정 및 회의실 예약 관리
 */

class CalendarManager {
    constructor() {
        this.currentView = 'month'; // month, week, day
        this.currentDate = new Date();
        this.selectedDate = null;
        this.schedules = [];
        this.meetingRooms = [];
        this.currentUserId = null;
        
        this.init();
    }
    
    init() {
        // 스토리지에서 데이터 로드
        this.loadSchedules();
        this.loadMeetingRooms();
        this.currentUserId = storageManager.getCurrentUserId() || 'user_001';
        
        // 초기 렌더링
        this.render();
    }
    
    loadSchedules() {
        // 개인 일정 로드
        const personalSchedules = storageManager.getSchedules() || [];
        
        // 회의실 예약 로드
        const meetingReservations = storageManager.getData('meeting_reservations') || [];
        
        this.schedules = [...personalSchedules, ...meetingReservations];
    }
    
    loadMeetingRooms() {
        // 회의실 목록 로드
        this.meetingRooms = storageManager.getData('meeting_rooms') || [
            { id: 'room_001', name: '대회의실', capacity: 20, floor: '10F' },
            { id: 'room_002', name: '중회의실 A', capacity: 10, floor: '10F' },
            { id: 'room_003', name: '중회의실 B', capacity: 10, floor: '11F' },
            { id: 'room_004', name: '소회의실 1', capacity: 6, floor: '11F' },
            { id: 'room_005', name: '소회의실 2', capacity: 6, floor: '12F' },
            { id: 'room_006', name: 'VIP 회의실', capacity: 8, floor: '15F' }
        ];
        
        // 초기 데이터가 없으면 저장
        if (!storageManager.getData('meeting_rooms')) {
            storageManager.saveData('meeting_rooms', this.meetingRooms);
        }
    }
    
    render() {
        const container = document.getElementById('calendarContent');
        if (!container) return;
        
        switch(this.currentView) {
            case 'month':
                this.renderMonthView(container);
                break;
            case 'week':
                this.renderWeekView(container);
                break;
            case 'day':
                this.renderDayView(container);
                break;
        }
        
        this.updateTitle();
    }
    
    renderMonthView(container) {
        const year = this.currentDate.getFullYear();
        const month = this.currentDate.getMonth();
        
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        const prevLastDay = new Date(year, month, 0);
        
        const startDate = firstDay.getDay();
        const endDate = lastDay.getDate();
        const prevEndDate = prevLastDay.getDate();
        
        let html = `
            <div class="calendar-month">
                <div class="calendar-weekdays">
                    <div class="weekday">일</div>
                    <div class="weekday">월</div>
                    <div class="weekday">화</div>
                    <div class="weekday">수</div>
                    <div class="weekday">목</div>
                    <div class="weekday">금</div>
                    <div class="weekday">토</div>
                </div>
                <div class="calendar-dates">
        `;
        
        // 이전 달 날짜
        for (let i = startDate - 1; i >= 0; i--) {
            const date = prevEndDate - i;
            html += `<div class="calendar-date other-month" data-date="${year}-${month}-${date}">
                <div class="date-number">${date}</div>
            </div>`;
        }
        
        // 현재 달 날짜
        const today = new Date();
        for (let date = 1; date <= endDate; date++) {
            const isToday = today.getFullYear() === year && 
                           today.getMonth() === month && 
                           today.getDate() === date;
            
            const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(date).padStart(2, '0')}`;
            const events = this.getEventsForDate(dateStr);
            
            html += `
                <div class="calendar-date ${isToday ? 'today' : ''}" 
                     data-date="${dateStr}"
                     onclick="calendarManager.selectDate('${dateStr}')">
                    <div class="date-number">${date}</div>
                    <div class="date-events">
            `;
            
            // 최대 3개의 일정만 표시
            events.slice(0, 3).forEach(event => {
                const type = event.type === '회의' ? 'meeting' : 
                           event.roomId ? 'meeting' : 'personal';
                html += `<div class="event-item ${type}">${event.title}</div>`;
            });
            
            if (events.length > 3) {
                html += `<div class="event-item" style="opacity: 0.7">+${events.length - 3} more</div>`;
            }
            
            html += `
                    </div>
                </div>
            `;
        }
        
        // 다음 달 날짜
        const remainingDays = 42 - (startDate + endDate);
        for (let date = 1; date <= remainingDays; date++) {
            html += `<div class="calendar-date other-month" data-date="${year}-${month + 2}-${date}">
                <div class="date-number">${date}</div>
            </div>`;
        }
        
        html += `
                </div>
            </div>
        `;
        
        container.innerHTML = html;
    }
    
    renderWeekView(container) {
        const startOfWeek = new Date(this.currentDate);
        const day = startOfWeek.getDay();
        startOfWeek.setDate(startOfWeek.getDate() - day);
        
        let html = `
            <div class="calendar-week">
                <div class="week-header">
                    <div class="week-time-label"></div>
        `;
        
        const weekDays = ['일', '월', '화', '수', '목', '금', '토'];
        for (let i = 0; i < 7; i++) {
            const date = new Date(startOfWeek);
            date.setDate(date.getDate() + i);
            const isToday = this.isToday(date);
            
            html += `
                <div class="week-day ${isToday ? 'today' : ''}">
                    <div class="week-day-name">${weekDays[i]}</div>
                    <div class="week-day-date">${date.getDate()}</div>
                </div>
            `;
        }
        
        html += `
                </div>
                <div class="week-body">
        `;
        
        // 30분 단위 시간별 그리드 (6시부터 22시까지)
        for (let hour = 6; hour <= 22; hour++) {
            for (let minute = 0; minute < 60; minute += 30) {
                const timeStr = `${hour}:${minute === 0 ? '00' : '30'}`;
                const isHalfHour = minute === 30;
                
                html += `
                    <div class="week-row ${isHalfHour ? 'half-hour' : ''}">
                        <div class="week-time">${timeStr}</div>
                `;
                
                for (let day = 0; day < 7; day++) {
                    const date = new Date(startOfWeek);
                    date.setDate(date.getDate() + day);
                    const dateStr = this.formatDate(date);
                    const events = this.getEventsForDateTimeSlot(dateStr, hour, minute);
                    
                    html += `<div class="week-cell" 
                             data-date="${dateStr}" 
                             data-time="${timeStr}"
                             onclick="calendarManager.handleTimeSlotClick('${dateStr}', '${timeStr}')">`;
                    
                    if (events.length > 0) {
                        events.forEach(event => {
                            const type = event.type === '회의' ? 'meeting' : 
                                       event.roomId ? 'meeting' : 'personal';
                            const duration = this.getEventDuration(event);
                            const height = duration > 30 ? Math.floor(duration / 30) * 30 : 30;
                            
                            html += `<div class="week-event ${type}" 
                                     style="height: ${height}px"
                                     onclick="event.stopPropagation(); calendarManager.showEventDetails('${event.id}')">
                                     <div class="week-event-title">${event.title}</div>
                                     </div>`;
                        });
                    }
                    
                    html += `</div>`;
                }
                
                html += `</div>`;
            }
        }
        
        html += `
                </div>
            </div>
        `;
        
        container.innerHTML = html;
    }
    
    renderDayView(container) {
        const date = this.currentDate;
        const dateStr = this.formatDate(date);
        const weekdays = ['일요일', '월요일', '화요일', '수요일', '목요일', '금요일', '토요일'];
        
        let html = `
            <div class="calendar-day">
                <div class="day-header">
                    <div class="day-date">${date.getFullYear()}년 ${date.getMonth() + 1}월 ${date.getDate()}일</div>
                    <div class="day-weekday">${weekdays[date.getDay()]}</div>
                    <button class="add-schedule-btn" onclick="calendarManager.showAddScheduleModal()">
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                            <path d="M8 3v10M3 8h10" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                        </svg>
                        일정 추가
                    </button>
                </div>
                <div class="day-timeline">
        `;
        
        // 30분 단위 시간 슬롯 (6시부터 22시까지)
        for (let hour = 6; hour <= 22; hour++) {
            for (let minute = 0; minute < 60; minute += 30) {
                const timeStr = `${hour}:${minute === 0 ? '00' : '30'}`;
                const events = this.getEventsForDateTimeSlot(dateStr, hour, minute);
                
                html += `
                    <div class="time-slot ${minute === 30 ? 'half-hour' : ''}" 
                         data-date="${dateStr}" 
                         data-time="${timeStr}"
                         onclick="calendarManager.handleTimeSlotClick('${dateStr}', '${timeStr}')">
                        <div class="time-label">${timeStr}</div>
                        <div class="time-events">
                `;
                
                if (events.length > 0) {
                    events.forEach(event => {
                        const type = event.type === '회의' ? 'meeting' : 
                                   event.roomId ? 'meeting' : 'personal';
                        const duration = this.getEventDuration(event);
                        const height = duration > 30 ? Math.floor(duration / 30) * 40 : 40;
                        
                        html += `
                            <div class="day-event ${type}" style="height: ${height}px" onclick="event.stopPropagation(); calendarManager.showEventDetails('${event.id}')">
                                <div class="day-event-title">${event.title}</div>
                                <div class="day-event-detail">
                                    ${event.location || ''} 
                                    ${event.participants ? `• ${event.participants.length}명` : ''}
                                </div>
                            </div>
                        `;
                    });
                }
                
                html += `
                        </div>
                    </div>
                `;
            }
        }
        
        html += `
                </div>
            </div>
        `;
        
        container.innerHTML = html;
        this.renderScheduleModal();
    }
    
    getEventsForDate(dateStr) {
        return this.schedules.filter(schedule => {
            const scheduleDate = schedule.date || schedule.startDate;
            return scheduleDate && scheduleDate.startsWith(dateStr);
        });
    }
    
    getEventsForDateTime(dateStr, hour) {
        return this.schedules.filter(schedule => {
            const scheduleDate = schedule.date || schedule.startDate;
            if (!scheduleDate || !scheduleDate.startsWith(dateStr)) return false;
            
            const time = schedule.time || schedule.startTime;
            if (!time) return false;
            
            const eventHour = parseInt(time.split(':')[0]);
            return eventHour === hour;
        });
    }
    
    getEventsForDateTimeSlot(dateStr, hour, minute) {
        return this.schedules.filter(schedule => {
            const scheduleDate = schedule.date || schedule.startDate;
            if (!scheduleDate || !scheduleDate.startsWith(dateStr)) return false;
            
            const time = schedule.time || schedule.startTime;
            if (!time) return false;
            
            const [eventHour, eventMinute] = time.split(':').map(Number);
            const eventTotalMinutes = eventHour * 60 + eventMinute;
            const slotTotalMinutes = hour * 60 + minute;
            
            // 해당 30분 슬롯에 시작하는 일정만 표시
            return eventTotalMinutes >= slotTotalMinutes && eventTotalMinutes < slotTotalMinutes + 30;
        });
    }
    
    getEventDuration(event) {
        const startTime = event.time || event.startTime;
        const endTime = event.endTime;
        
        if (!startTime || !endTime) return 60; // 기본 1시간
        
        const start = this.timeToMinutes(startTime);
        const end = this.timeToMinutes(endTime);
        
        return end - start;
    }
    
    formatDate(date) {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    }
    
    isToday(date) {
        const today = new Date();
        return date.getFullYear() === today.getFullYear() &&
               date.getMonth() === today.getMonth() &&
               date.getDate() === today.getDate();
    }
    
    updateTitle() {
        const titleElement = document.getElementById('calendarTitle');
        if (!titleElement) return;
        
        const year = this.currentDate.getFullYear();
        const month = this.currentDate.getMonth() + 1;
        
        switch(this.currentView) {
            case 'month':
                titleElement.textContent = `${year}년 ${month}월`;
                break;
            case 'week':
                const startOfWeek = new Date(this.currentDate);
                const day = startOfWeek.getDay();
                startOfWeek.setDate(startOfWeek.getDate() - day);
                const endOfWeek = new Date(startOfWeek);
                endOfWeek.setDate(endOfWeek.getDate() + 6);
                
                titleElement.textContent = `${startOfWeek.getMonth() + 1}월 ${startOfWeek.getDate()}일 - ${endOfWeek.getMonth() + 1}월 ${endOfWeek.getDate()}일`;
                break;
            case 'day':
                titleElement.textContent = `${year}년 ${month}월 ${this.currentDate.getDate()}일`;
                break;
        }
    }
    
    changeView(view) {
        this.currentView = view;
        
        // 버튼 활성 상태 업데이트
        document.querySelectorAll('.view-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.view === view);
        });
        
        this.render();
    }
    
    previousPeriod() {
        switch(this.currentView) {
            case 'month':
                this.currentDate.setMonth(this.currentDate.getMonth() - 1);
                break;
            case 'week':
                this.currentDate.setDate(this.currentDate.getDate() - 7);
                break;
            case 'day':
                this.currentDate.setDate(this.currentDate.getDate() - 1);
                break;
        }
        this.render();
    }
    
    nextPeriod() {
        switch(this.currentView) {
            case 'month':
                this.currentDate.setMonth(this.currentDate.getMonth() + 1);
                break;
            case 'week':
                this.currentDate.setDate(this.currentDate.getDate() + 7);
                break;
            case 'day':
                this.currentDate.setDate(this.currentDate.getDate() + 1);
                break;
        }
        this.render();
    }
    
    selectDate(dateStr) {
        this.selectedDate = dateStr;
        
        // 선택된 날짜 스타일 업데이트
        document.querySelectorAll('.calendar-date').forEach(el => {
            el.classList.toggle('selected', el.dataset.date === dateStr);
        });
        
        // 일 보기로 전환
        const [year, month, day] = dateStr.split('-').map(Number);
        this.currentDate = new Date(year, month - 1, day);
        this.changeView('day');
    }
    
    // 회의실 예약 충돌 검사
    checkRoomAvailability(roomId, date, startTime, endTime) {
        const reservations = this.schedules.filter(schedule => {
            return schedule.roomId === roomId && 
                   schedule.date === date &&
                   this.isTimeOverlap(schedule.startTime, schedule.endTime, startTime, endTime);
        });
        
        return reservations.length === 0;
    }
    
    // 참가자 일정 충돌 검사
    checkParticipantAvailability(participants, date, startTime, endTime) {
        const conflicts = [];
        
        participants.forEach(participantId => {
            const userSchedules = this.schedules.filter(schedule => {
                return (schedule.userId === participantId || 
                       (schedule.participants && schedule.participants.includes(participantId))) &&
                       schedule.date === date &&
                       this.isTimeOverlap(schedule.startTime, schedule.endTime, startTime, endTime);
            });
            
            if (userSchedules.length > 0) {
                conflicts.push({
                    userId: participantId,
                    conflicts: userSchedules
                });
            }
        });
        
        return conflicts;
    }
    
    // 시간 중복 검사
    isTimeOverlap(start1, end1, start2, end2) {
        const s1 = this.timeToMinutes(start1);
        const e1 = this.timeToMinutes(end1);
        const s2 = this.timeToMinutes(start2);
        const e2 = this.timeToMinutes(end2);
        
        return (s1 < e2 && s2 < e1);
    }
    
    timeToMinutes(timeStr) {
        const [hours, minutes] = timeStr.split(':').map(Number);
        return hours * 60 + (minutes || 0);
    }
    
    // 일정 추가
    addSchedule(scheduleData) {
        const newSchedule = {
            id: `schedule_${Date.now()}`,
            userId: this.currentUserId,
            createdAt: new Date().toISOString(),
            ...scheduleData
        };
        
        this.schedules.push(newSchedule);
        
        // 저장
        if (newSchedule.roomId) {
            // 회의실 예약
            const reservations = storageManager.getData('meeting_reservations') || [];
            reservations.push(newSchedule);
            storageManager.saveData('meeting_reservations', reservations);
        } else {
            // 개인 일정
            const personalSchedules = storageManager.getSchedules() || [];
            personalSchedules.push(newSchedule);
            storageManager.saveData(storageManager.STORAGE_KEYS.SCHEDULES, personalSchedules);
        }
        
        this.render();
        return newSchedule;
    }
    
    // 일정 삭제
    deleteSchedule(scheduleId) {
        const index = this.schedules.findIndex(s => s.id === scheduleId);
        if (index === -1) return false;
        
        const schedule = this.schedules[index];
        this.schedules.splice(index, 1);
        
        // 스토리지에서도 삭제
        if (schedule.roomId) {
            const reservations = storageManager.getData('meeting_reservations') || [];
            const filtered = reservations.filter(r => r.id !== scheduleId);
            storageManager.saveData('meeting_reservations', filtered);
        } else {
            const personalSchedules = storageManager.getSchedules() || [];
            const filtered = personalSchedules.filter(s => s.id !== scheduleId);
            storageManager.saveData(storageManager.STORAGE_KEYS.SCHEDULES, filtered);
        }
        
        this.render();
        return true;
    }
    
    // 시간 슬롯 클릭 핸들러
    handleTimeSlotClick(dateStr, timeStr) {
        this.showAddScheduleModal(dateStr, timeStr);
    }
    
    // 일정 추가 모달 표시
    showAddScheduleModal(presetDate = null, presetTime = null) {
        // 모달이 없으면 먼저 생성
        this.renderScheduleModal();
        
        const modal = document.getElementById('scheduleModal');
        if (!modal) return;
        
        // 폼 초기화
        const form = document.getElementById('scheduleForm');
        if (form) {
            form.reset();
            
            // 기본값 설정
            if (presetDate) {
                const dateInput = form.querySelector('input[name="date"]');
                if (dateInput) dateInput.value = presetDate;
            } else {
                const dateInput = form.querySelector('input[name="date"]');
                if (dateInput) dateInput.value = this.formatDate(this.currentDate);
            }
            
            if (presetTime) {
                const [hour, minute] = presetTime.split(':');
                
                // 시작 시간 설정
                const startHourSelect = form.querySelector('select[name="startHour"]');
                const startMinuteSelect = form.querySelector('select[name="startMinute"]');
                if (startHourSelect) startHourSelect.value = hour;
                if (startMinuteSelect) startMinuteSelect.value = minute;
                
                // 종료 시간을 시작 시간 + 30분으로 설정
                let endHour = parseInt(hour);
                let endMinute = minute === '00' ? '30' : '00';
                
                // 분이 30분이면 다음 시간으로
                if (minute === '30') {
                    endHour = parseInt(hour) + 1;
                }
                
                const endHourSelect = form.querySelector('select[name="endHour"]');
                const endMinuteSelect = form.querySelector('select[name="endMinute"]');
                
                if (endHourSelect && endHour <= 22) {
                    endHourSelect.value = endHour.toString().padStart(2, '0');
                } else if (endHourSelect && endHour > 22) {
                    // 22시를 넘어가면 22:30으로 설정
                    endHourSelect.value = '22';
                    endMinute = '30';
                }
                
                if (endMinuteSelect) endMinuteSelect.value = endMinute;
            } else {
                // 기본값: 현재 시간의 다음 30분 단위
                const now = new Date();
                const currentHour = now.getHours();
                const currentMinute = now.getMinutes();
                
                let startHour = currentHour;
                let startMinute = currentMinute < 30 ? '30' : '00';
                if (startMinute === '00') startHour++;
                
                if (startHour >= 6 && startHour <= 22) {
                    const startHourSelect = form.querySelector('select[name="startHour"]');
                    const startMinuteSelect = form.querySelector('select[name="startMinute"]');
                    if (startHourSelect) startHourSelect.value = startHour.toString().padStart(2, '0');
                    if (startMinuteSelect) startMinuteSelect.value = startMinute;
                    
                    // 종료 시간을 시작 시간 + 30분으로 설정
                    let endHour = startHour;
                    let endMinute = startMinute === '00' ? '30' : '00';
                    
                    if (startMinute === '30') {
                        endHour = startHour + 1;
                    }
                    
                    const endHourSelect = form.querySelector('select[name="endHour"]');
                    const endMinuteSelect = form.querySelector('select[name="endMinute"]');
                    
                    if (endHourSelect && endHour <= 22) {
                        endHourSelect.value = endHour.toString().padStart(2, '0');
                    } else if (endHourSelect && endHour > 22) {
                        endHourSelect.value = '22';
                        endMinute = '30';
                    }
                    
                    if (endMinuteSelect) endMinuteSelect.value = endMinute;
                }
            }
        }
        
        modal.style.display = 'flex';
    }
    
    // 모달 닫기
    closeScheduleModal() {
        const modal = document.getElementById('scheduleModal');
        if (modal) {
            modal.style.display = 'none';
        }
    }
    
    // 일정 저장
    saveSchedule() {
        const form = document.getElementById('scheduleForm');
        if (!form) return;
        
        const formData = new FormData(form);
        
        // 시간과 분을 조합
        const startHour = formData.get('startHour');
        const startMinute = formData.get('startMinute');
        const endHour = formData.get('endHour');
        const endMinute = formData.get('endMinute');
        
        const startTime = startHour && startMinute ? `${startHour}:${startMinute}` : '';
        const endTime = endHour && endMinute ? `${endHour}:${endMinute}` : '';
        
        const scheduleData = {
            title: formData.get('title'),
            date: formData.get('date'),
            startTime: startTime,
            endTime: endTime,
            type: formData.get('type') || '개인',
            location: formData.get('location'),
            description: formData.get('description'),
            reminder: formData.get('reminder')
        };
        
        // 유효성 검사
        if (!scheduleData.title || !scheduleData.date || !scheduleData.startTime) {
            alert('제목, 날짜, 시작 시간은 필수 입력 항목입니다.');
            return;
        }
        
        // 시간 유효성 검사
        if (scheduleData.endTime && this.timeToMinutes(scheduleData.startTime) >= this.timeToMinutes(scheduleData.endTime)) {
            alert('종료 시간은 시작 시간보다 늦어야 합니다.');
            return;
        }
        
        // 일정 추가
        this.addSchedule(scheduleData);
        
        // 모달 닫기
        this.closeScheduleModal();
        
        // 성공 메시지
        this.showToast('일정이 성공적으로 추가되었습니다.');
    }
    
    // 토스트 메시지 표시
    showToast(message) {
        const toast = document.createElement('div');
        toast.className = 'toast-message';
        toast.textContent = message;
        document.body.appendChild(toast);
        
        setTimeout(() => {
            toast.classList.add('show');
        }, 100);
        
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => {
                document.body.removeChild(toast);
            }, 300);
        }, 3000);
    }
    
    // 일정 상세 표시
    showEventDetails(eventId) {
        const event = this.schedules.find(s => s.id === eventId);
        if (!event) return;
        
        // 간단한 상세 정보 표시 (추후 모달로 개선 가능)
        const details = `
            제목: ${event.title}
            날짜: ${event.date || event.startDate}
            시간: ${event.startTime || event.time} - ${event.endTime || ''}
            ${event.location ? `장소: ${event.location}` : ''}
            ${event.description ? `설명: ${event.description}` : ''}
        `;
        
        if (confirm(details + '\n\n이 일정을 삭제하시겠습니까?')) {
            this.deleteSchedule(eventId);
            this.showToast('일정이 삭제되었습니다.');
        }
    }
    
    // 시간 옵션 생성
    generateHourOptions() {
        let options = '';
        for (let hour = 6; hour <= 22; hour++) {
            const hourStr = hour.toString().padStart(2, '0');
            options += `<option value="${hourStr}">${hourStr}</option>`;
        }
        return options;
    }
    
    // 일정 추가 모달 HTML 렌더링
    renderScheduleModal() {
        if (document.getElementById('scheduleModal')) return;
        
        const modalHtml = `
            <div id="scheduleModal" class="modal-overlay" style="display: none;">
                <div class="modal-content schedule-modal">
                    <div class="modal-header">
                        <h3>일정 추가</h3>
                        <button class="modal-close" onclick="calendarManager.closeScheduleModal()">✕</button>
                    </div>
                    <form id="scheduleForm" class="schedule-form">
                        <div class="form-group">
                            <label for="scheduleTitle">제목 *</label>
                            <input type="text" id="scheduleTitle" name="title" required placeholder="일정 제목을 입력하세요">
                        </div>
                        
                        <div class="form-row">
                            <div class="form-group">
                                <label for="scheduleDate">날짜 *</label>
                                <input type="date" id="scheduleDate" name="date" required>
                            </div>
                            <div class="form-group">
                                <label for="scheduleType">구분</label>
                                <select id="scheduleType" name="type">
                                    <option value="개인">개인</option>
                                    <option value="회의">회의</option>
                                    <option value="외근">외근</option>
                                    <option value="휴가">휴가</option>
                                </select>
                            </div>
                        </div>
                        
                        <div class="form-row">
                            <div class="form-group">
                                <label for="scheduleStartTime">시작 시간 *</label>
                                <div class="time-selector">
                                    <select id="startHour" name="startHour" class="time-select">
                                        ${this.generateHourOptions()}
                                    </select>
                                    <span class="time-separator">:</span>
                                    <select id="startMinute" name="startMinute" class="time-select">
                                        <option value="00">00</option>
                                        <option value="30">30</option>
                                    </select>
                                </div>
                            </div>
                            <div class="form-group">
                                <label for="scheduleEndTime">종료 시간</label>
                                <div class="time-selector">
                                    <select id="endHour" name="endHour" class="time-select">
                                        ${this.generateHourOptions()}
                                    </select>
                                    <span class="time-separator">:</span>
                                    <select id="endMinute" name="endMinute" class="time-select">
                                        <option value="00">00</option>
                                        <option value="30">30</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                        
                        <div class="form-group">
                            <label for="scheduleLocation">장소</label>
                            <input type="text" id="scheduleLocation" name="location" placeholder="장소를 입력하세요">
                        </div>
                        
                        <div class="form-group">
                            <label for="scheduleDescription">설명</label>
                            <textarea id="scheduleDescription" name="description" rows="3" placeholder="일정에 대한 설명을 입력하세요"></textarea>
                        </div>
                        
                        <div class="form-group">
                            <label for="scheduleReminder">알림</label>
                            <select id="scheduleReminder" name="reminder">
                                <option value="">알림 없음</option>
                                <option value="10">10분 전</option>
                                <option value="30">30분 전</option>
                                <option value="60">1시간 전</option>
                                <option value="1440">1일 전</option>
                            </select>
                        </div>
                        
                        <div class="modal-footer">
                            <button type="button" class="btn-secondary" onclick="calendarManager.closeScheduleModal()">취소</button>
                            <button type="button" class="btn-primary" onclick="calendarManager.saveSchedule()">저장</button>
                        </div>
                    </form>
                </div>
            </div>
        `;
        
        document.body.insertAdjacentHTML('beforeend', modalHtml);
    }
}

// 전역 함수들
let calendarManager;

function initCalendar() {
    calendarManager = new CalendarManager();
}

function openCalendar() {
    // 모든 탭 버튼 비활성화
    document.querySelectorAll('.tab-button').forEach(btn => {
        btn.classList.remove('active');
    });
    
    // 캘린더 탭 활성화
    event.target.classList.add('active');
    
    // 화면 전환
    document.getElementById('chatArea').style.display = 'none';
    document.getElementById('bottomInput').style.display = 'none';
    document.getElementById('calendarContainer').style.display = 'block';
    
    // 캘린더 초기화 (아직 안 되어있으면)
    if (!calendarManager) {
        initCalendar();
    } else {
        calendarManager.render();
    }
}

function changeView(view) {
    if (calendarManager) {
        calendarManager.changeView(view);
    }
}

function previousPeriod() {
    if (calendarManager) {
        calendarManager.previousPeriod();
    }
}

function nextPeriod() {
    if (calendarManager) {
        calendarManager.nextPeriod();
    }
}

function openScheduleModal() {
    if (calendarManager) {
        calendarManager.showAddScheduleModal();
    }
}

// DOMContentLoaded 시 초기화
document.addEventListener('DOMContentLoaded', () => {
    // 캘린더는 처음 클릭할 때 초기화
});
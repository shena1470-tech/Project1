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
        
        // 시간별 그리드 (6시부터 22시까지)
        for (let hour = 6; hour <= 22; hour++) {
            html += `
                <div class="week-row">
                    <div class="week-time">${hour}:00</div>
            `;
            
            for (let day = 0; day < 7; day++) {
                const date = new Date(startOfWeek);
                date.setDate(date.getDate() + day);
                const dateStr = this.formatDate(date);
                const events = this.getEventsForDateTime(dateStr, hour);
                
                html += `<div class="week-cell" data-date="${dateStr}" data-hour="${hour}">`;
                
                events.forEach(event => {
                    const type = event.type === '회의' ? 'meeting' : 
                               event.roomId ? 'meeting' : 'personal';
                    html += `<div class="event-item ${type}">${event.title}</div>`;
                });
                
                html += `</div>`;
            }
            
            html += `</div>`;
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
                </div>
                <div class="day-timeline">
        `;
        
        // 시간별 일정 (6시부터 22시까지)
        for (let hour = 6; hour <= 22; hour++) {
            const events = this.getEventsForDateTime(dateStr, hour);
            
            html += `
                <div class="time-slot">
                    <div class="time-label">${hour}:00</div>
                    <div class="time-events">
            `;
            
            if (events.length > 0) {
                events.forEach(event => {
                    const type = event.type === '회의' ? 'meeting' : 
                               event.roomId ? 'meeting' : 'personal';
                    html += `
                        <div class="day-event ${type}">
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
        
        html += `
                </div>
            </div>
        `;
        
        container.innerHTML = html;
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
    // 일정 추가 모달 표시 (추후 구현)
    alert('일정 추가 기능은 준비 중입니다.');
}

// DOMContentLoaded 시 초기화
document.addEventListener('DOMContentLoaded', () => {
    // 캘린더는 처음 클릭할 때 초기화
});
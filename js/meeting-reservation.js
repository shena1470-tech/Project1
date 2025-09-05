// 회의실 예약 시스템
class MeetingReservation {
    constructor() {
        this.currentReservation = null;
        this.currentStep = 'participants'; // participants, time, room, beverage, complete
        
        // 전역 회의실 목록 사용 (MEETING_ROOMS가 정의되어 있으면 사용)
        if (typeof MEETING_ROOMS !== 'undefined') {
            this.availableRooms = MEETING_ROOMS;
        } else {
            // 기본 회의실 목록 (폴백)
            this.availableRooms = [
                { id: 'room-101', name: '101호 회의실', capacity: 10, floor: '10층', equipment: ['프로젝터', '화이트보드'] },
                { id: 'room-201', name: '201호 회의실', capacity: 15, floor: '20층', equipment: ['화상회의', '프로젝터', '화이트보드'] },
                { id: 'room-301', name: '301호 대회의실', capacity: 30, floor: '30층', equipment: ['마이크', '화상회의', '프로젝터'] },
                { id: 'room-401', name: '401호 소회의실', capacity: 6, floor: '40층', equipment: ['화이트보드', 'TV'] },
                { id: 'room-501', name: '501호 임원회의실', capacity: 20, floor: '50층', equipment: ['화상회의', '프로젝터', '마이크'] }
            ];
        }
        
        this.timeSlots = this.generateTimeSlots();
        this.beverages = [
            { id: 'coffee', name: '커피', icon: '☕', variants: ['아메리카노', '카페라떼', '카푸치노'] },
            { id: 'tea', name: '차', icon: '🍵', variants: ['녹차', '홍차', '보이차'] },
            { id: 'juice', name: '주스', icon: '🥤', variants: ['오렌지', '포도', '사과'] },
            { id: 'water', name: '생수', icon: '💧', variants: ['일반', '탄산수'] },
            { id: 'soda', name: '음료수', icon: '🥤', variants: ['콜라', '사이다', '환타'] }
        ];
        
        this.initializeNewReservation();
    }
    
    // 시간 슬롯 생성 (30분 단위)
    generateTimeSlots() {
        const slots = [];
        const startHour = 9;
        const endHour = 18;
        
        for (let hour = startHour; hour < endHour; hour++) {
            slots.push({
                id: `${hour}:00`,
                display: `${hour}:00`,
                value: hour * 60
            });
            slots.push({
                id: `${hour}:30`,
                display: `${hour}:30`,
                value: hour * 60 + 30
            });
        }
        
        return slots;
    }
    
    // 새 예약 초기화
    initializeNewReservation() {
        const reservationId = 'res-' + Date.now();
        this.currentReservation = {
            id: reservationId,
            title: '',
            participants: [],
            timeVotes: {},  // {participantId: [selectedTimes]}
            selectedTime: null,
            roomVotes: {},  // {participantId: selectedRoom}
            selectedRoom: null,
            beverageOrders: {},  // {participantId: {beverageId: variant}}
            status: 'pending',
            createdAt: new Date().toISOString(),
            createdBy: null
        };
        
        this.saveToStorage();
    }
    
    // 참가자 추가
    addParticipant(user) {
        if (!this.currentReservation.participants.find(p => p.id === user.id)) {
            this.currentReservation.participants.push(user);
            this.currentReservation.timeVotes[user.id] = [];
            this.currentReservation.roomVotes[user.id] = null;
            this.currentReservation.beverageOrders[user.id] = null;
            this.saveToStorage();
            return true;
        }
        return false;
    }
    
    // 참가자 제거
    removeParticipant(userId) {
        const index = this.currentReservation.participants.findIndex(p => p.id === userId);
        if (index !== -1) {
            this.currentReservation.participants.splice(index, 1);
            delete this.currentReservation.timeVotes[userId];
            delete this.currentReservation.roomVotes[userId];
            delete this.currentReservation.beverageOrders[userId];
            this.saveToStorage();
            return true;
        }
        return false;
    }
    
    // 시간 투표
    voteForTime(userId, timeSlots) {
        if (this.currentReservation.timeVotes.hasOwnProperty(userId)) {
            this.currentReservation.timeVotes[userId] = timeSlots;
            this.saveToStorage();
            
            // 모든 참가자가 투표했는지 확인
            if (this.checkAllTimeVotesCompleted()) {
                this.calculateBestTime();
                return true;
            }
        }
        return false;
    }
    
    // 모든 시간 투표 완료 확인
    checkAllTimeVotesCompleted() {
        for (let participant of this.currentReservation.participants) {
            if (!this.currentReservation.timeVotes[participant.id] || 
                this.currentReservation.timeVotes[participant.id].length === 0) {
                return false;
            }
        }
        return true;
    }
    
    // 최적 시간 계산
    calculateBestTime() {
        const timeCount = {};
        
        // 각 시간별 투표 수 계산
        for (let userId in this.currentReservation.timeVotes) {
            const votes = this.currentReservation.timeVotes[userId];
            for (let time of votes) {
                timeCount[time] = (timeCount[time] || 0) + 1;
            }
        }
        
        // 가장 많은 투표를 받은 시간 찾기
        let maxVotes = 0;
        let bestTime = null;
        
        for (let time in timeCount) {
            if (timeCount[time] > maxVotes) {
                maxVotes = timeCount[time];
                bestTime = time;
            }
        }
        
        this.currentReservation.selectedTime = bestTime;
        this.currentStep = 'room';
        this.saveToStorage();
        
        return bestTime;
    }
    
    // 회의실 투표
    voteForRoom(userId, roomId) {
        if (this.currentReservation.roomVotes.hasOwnProperty(userId)) {
            this.currentReservation.roomVotes[userId] = roomId;
            this.saveToStorage();
            
            // 모든 참가자가 투표했는지 확인
            if (this.checkAllRoomVotesCompleted()) {
                this.calculateBestRoom();
                return true;
            }
        }
        return false;
    }
    
    // 모든 회의실 투표 완료 확인
    checkAllRoomVotesCompleted() {
        for (let participant of this.currentReservation.participants) {
            if (!this.currentReservation.roomVotes[participant.id]) {
                return false;
            }
        }
        return true;
    }
    
    // 최적 회의실 계산
    calculateBestRoom() {
        const roomCount = {};
        
        // 각 회의실별 투표 수 계산
        for (let userId in this.currentReservation.roomVotes) {
            const roomId = this.currentReservation.roomVotes[userId];
            roomCount[roomId] = (roomCount[roomId] || 0) + 1;
        }
        
        // 가장 많은 투표를 받은 회의실 찾기
        let maxVotes = 0;
        let bestRoom = null;
        
        for (let roomId in roomCount) {
            if (roomCount[roomId] > maxVotes) {
                maxVotes = roomCount[roomId];
                bestRoom = roomId;
            }
        }
        
        this.currentReservation.selectedRoom = bestRoom;
        this.currentStep = 'beverage';
        this.saveToStorage();
        
        return bestRoom;
    }
    
    // 음료 주문
    orderBeverage(userId, beverageId, variant) {
        if (this.currentReservation.beverageOrders.hasOwnProperty(userId)) {
            this.currentReservation.beverageOrders[userId] = {
                beverageId: beverageId,
                variant: variant
            };
            this.saveToStorage();
            
            // 모든 참가자가 주문했는지 확인
            if (this.checkAllBeverageOrdersCompleted()) {
                this.completeReservation();
                return true;
            }
        }
        return false;
    }
    
    // 모든 음료 주문 완료 확인
    checkAllBeverageOrdersCompleted() {
        for (let participant of this.currentReservation.participants) {
            if (!this.currentReservation.beverageOrders[participant.id]) {
                return false;
            }
        }
        return true;
    }
    
    // 예약 완료
    completeReservation() {
        this.currentReservation.status = 'confirmed';
        this.currentStep = 'complete';
        this.saveToStorage();
        
        // 예약 내역을 별도로 저장
        this.saveReservationHistory();
        
        // 토스트 알림 표시
        if (typeof showMeetingSuccessToast === 'function') {
            const room = this.availableRooms.find(r => r.id === this.currentReservation.selectedRoom);
            showMeetingSuccessToast({
                room: room ? room.name : this.currentReservation.selectedRoom,
                participants: this.currentReservation.participants
            });
        }
        
        return this.getReservationSummary();
    }
    
    // 예약 요약 정보 생성
    getReservationSummary() {
        const room = this.availableRooms.find(r => r.id === this.currentReservation.selectedRoom);
        const time = this.currentReservation.selectedTime;
        
        const beverageSummary = {};
        for (let userId in this.currentReservation.beverageOrders) {
            const order = this.currentReservation.beverageOrders[userId];
            if (order) {
                const key = `${order.beverageId}-${order.variant}`;
                beverageSummary[key] = (beverageSummary[key] || 0) + 1;
            }
        }
        
        return {
            id: this.currentReservation.id,
            title: this.currentReservation.title,
            participants: this.currentReservation.participants,
            time: time,
            room: room,
            beverageOrders: beverageSummary,
            status: this.currentReservation.status
        };
    }
    
    // LocalStorage 저장
    saveToStorage() {
        const key = `meeting_reservation_${this.currentReservation.id}`;
        localStorage.setItem(key, JSON.stringify(this.currentReservation));
        localStorage.setItem('current_reservation_id', this.currentReservation.id);
    }
    
    // 예약 내역 저장
    saveReservationHistory() {
        const history = JSON.parse(localStorage.getItem('meeting_reservation_history') || '[]');
        history.push(this.getReservationSummary());
        localStorage.setItem('meeting_reservation_history', JSON.stringify(history));
    }
    
    // 현재 예약 불러오기
    loadCurrentReservation() {
        const currentId = localStorage.getItem('current_reservation_id');
        if (currentId) {
            const reservation = localStorage.getItem(`meeting_reservation_${currentId}`);
            if (reservation) {
                this.currentReservation = JSON.parse(reservation);
                return true;
            }
        }
        return false;
    }
    
    // 예약 내역 조회
    getReservationHistory() {
        return JSON.parse(localStorage.getItem('meeting_reservation_history') || '[]');
    }
}

// 전역 인스턴스 생성
const meetingReservation = new MeetingReservation();
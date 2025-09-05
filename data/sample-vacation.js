// 휴가 데이터
const vacationData = {
    // 사용자별 휴가 현황
    users: {
        'user-001': {
            userId: 'user-001',
            name: '김동준',
            year: 2025,
            annualLeave: {
                total: 15,        // 연차 총 개수
                used: 7,          // 사용한 연차
                remaining: 8,     // 남은 연차
                scheduled: 2      // 예정된 연차
            },
            specialLeave: {
                sick: {           // 병가
                    total: 5,
                    used: 1,
                    remaining: 4
                },
                congratulations: { // 경조사
                    total: 5,
                    used: 0,
                    remaining: 5
                },
                family: {         // 가족돌봄
                    total: 10,
                    used: 2,
                    remaining: 8
                }
            },
            vacationHistory: [
                {
                    id: 'vac-001',
                    type: 'annual',
                    startDate: '2025-01-02',
                    endDate: '2025-01-03',
                    days: 2,
                    reason: '개인 사유',
                    status: 'approved'
                },
                {
                    id: 'vac-002',
                    type: 'annual',
                    startDate: '2025-03-15',
                    endDate: '2025-03-20',
                    days: 5,
                    reason: '가족 여행',
                    status: 'approved'
                },
                {
                    id: 'vac-003',
                    type: 'sick',
                    startDate: '2025-04-10',
                    endDate: '2025-04-10',
                    days: 1,
                    reason: '병원 진료',
                    status: 'approved'
                },
                {
                    id: 'vac-004',
                    type: 'family',
                    startDate: '2025-05-05',
                    endDate: '2025-05-06',
                    days: 2,
                    reason: '자녀 돌봄',
                    status: 'approved'
                },
                {
                    id: 'vac-005',
                    type: 'annual',
                    startDate: '2025-12-23',
                    endDate: '2025-12-24',
                    days: 2,
                    reason: '연말 휴가',
                    status: 'scheduled'
                }
            ]
        },
        'user-002': {
            userId: 'user-002',
            name: '이서연',
            year: 2025,
            annualLeave: {
                total: 18,
                used: 10,
                remaining: 8,
                scheduled: 3
            },
            specialLeave: {
                sick: {
                    total: 5,
                    used: 0,
                    remaining: 5
                },
                congratulations: {
                    total: 5,
                    used: 3,
                    remaining: 2
                },
                family: {
                    total: 10,
                    used: 0,
                    remaining: 10
                }
            },
            vacationHistory: [
                {
                    id: 'vac-006',
                    type: 'annual',
                    startDate: '2025-02-10',
                    endDate: '2025-02-14',
                    days: 5,
                    reason: '해외 여행',
                    status: 'approved'
                },
                {
                    id: 'vac-007',
                    type: 'annual',
                    startDate: '2025-06-20',
                    endDate: '2025-06-24',
                    days: 5,
                    reason: '여름 휴가',
                    status: 'approved'
                },
                {
                    id: 'vac-008',
                    type: 'congratulations',
                    startDate: '2025-07-15',
                    endDate: '2025-07-17',
                    days: 3,
                    reason: '결혼식 참석',
                    status: 'approved'
                },
                {
                    id: 'vac-009',
                    type: 'annual',
                    startDate: '2025-11-20',
                    endDate: '2025-11-22',
                    days: 3,
                    reason: '개인 휴가',
                    status: 'scheduled'
                }
            ]
        },
        'user-003': {
            userId: 'user-003',
            name: '박지훈',
            year: 2025,
            annualLeave: {
                total: 20,
                used: 5,
                remaining: 15,
                scheduled: 0
            },
            specialLeave: {
                sick: {
                    total: 5,
                    used: 2,
                    remaining: 3
                },
                congratulations: {
                    total: 5,
                    used: 0,
                    remaining: 5
                },
                family: {
                    total: 10,
                    used: 3,
                    remaining: 7
                }
            },
            vacationHistory: [
                {
                    id: 'vac-010',
                    type: 'annual',
                    startDate: '2025-04-01',
                    endDate: '2025-04-05',
                    days: 5,
                    reason: '봄 휴가',
                    status: 'approved'
                },
                {
                    id: 'vac-011',
                    type: 'sick',
                    startDate: '2025-05-15',
                    endDate: '2025-05-16',
                    days: 2,
                    reason: '건강검진',
                    status: 'approved'
                },
                {
                    id: 'vac-012',
                    type: 'family',
                    startDate: '2025-08-10',
                    endDate: '2025-08-12',
                    days: 3,
                    reason: '부모님 병간호',
                    status: 'approved'
                }
            ]
        }
    },

    // 휴가 담당자 정보
    responsiblePerson: {
        id: 'user-005',
        name: '정준하',
        position: '사원',
        department: '인사팀',
        email: 'junha.jung@hanwhalife.com',
        phone: '010-4567-8901',
        extension: '4567'
    }
};

// 휴가 관련 함수들
const VacationManager = {
    // 사용자의 휴가 정보 가져오기
    getUserVacation(userId) {
        return vacationData.users[userId] || null;
    },

    // 남은 총 휴가 계산
    getTotalRemaining(userId) {
        const userData = this.getUserVacation(userId);
        if (!userData) return 0;

        const annual = userData.annualLeave.remaining;
        const sick = userData.specialLeave.sick.remaining;
        const congratulations = userData.specialLeave.congratulations.remaining;
        const family = userData.specialLeave.family.remaining;

        return annual + sick + congratulations + family;
    },

    // 휴가 타입 한글 변환
    getVacationTypeName(type) {
        const types = {
            'annual': '연차',
            'sick': '병가',
            'congratulations': '경조사',
            'family': '가족돌봄'
        };
        return types[type] || type;
    },

    // 휴가 상태 한글 변환
    getStatusName(status) {
        const statuses = {
            'approved': '승인',
            'scheduled': '예정',
            'pending': '대기',
            'rejected': '반려'
        };
        return statuses[status] || status;
    },

    // 휴가 담당자 정보 가져오기
    getResponsiblePerson() {
        return vacationData.responsiblePerson;
    }
};
// 상태카드 데이터 - 프로젝트 진행 상태 및 업무 정보
const STATUS_CARDS = [
    {
        id: 'card-001',
        title: '디지털 전환 프로젝트',
        status: '진행중',
        statusType: 'in-progress', // in-progress, completed, pending, urgent
        progress: 75,
        startDate: '2025-08-01',
        endDate: '2025-10-31',
        lastUpdated: '2025-09-04',
        department: '디지털프로덕트팀',
        manager: {
            id: 'user-001',
            name: '김동준',
            position: '과장',
            email: 'dongjun.kim@hanwhalife.com'
        },
        members: [
            { id: 'user-002', name: '이정은', position: '대리', role: 'UI/UX 기획' },
            { id: 'user-003', name: '유재석', position: '대리', role: '디지털 마케팅' },
            { id: 'user-005', name: '정준하', position: '사원', role: '교육 프로그램' }
        ],
        description: '고객 경험 개선을 위한 디지털 플랫폼 전면 개편 프로젝트',
        keyTasks: [
            { task: '요구사항 분석', status: 'completed' },
            { task: 'UI/UX 디자인', status: 'completed' },
            { task: '프론트엔드 개발', status: 'in-progress' },
            { task: '백엔드 API 개발', status: 'in-progress' },
            { task: '테스트 및 QA', status: 'pending' }
        ],
        nextMilestone: '9월 15일 - 1차 베타 테스트'
    },
    {
        id: 'card-002',
        title: 'AI 비서 시스템 구축',
        status: '진행중',
        statusType: 'in-progress',
        progress: 60,
        startDate: '2025-09-01',
        endDate: '2025-11-30',
        lastUpdated: '2025-09-05',
        department: 'AI기술팀',
        manager: {
            id: 'user-005',
            name: '정준하',
            position: '과장',
            email: 'junha.jung@hanwhalife.com'
        },
        members: [
            { id: 'user-006', name: '정형돈', position: '부장', role: 'AI 서비스 총괄' },
            { id: 'user-002', name: '이정은', position: '대리', role: 'UX 기획' },
            { id: 'user-004', name: '박명수', position: '차장', role: 'AI 모델링' }
        ],
        description: '업무 효율성 향상을 위한 AI 기반 업무 지원 시스템 개발',
        keyTasks: [
            { task: '요구사항 정의', status: 'completed' },
            { task: 'AI 모델 설계', status: 'completed' },
            { task: '프로토타입 개발', status: 'in-progress' },
            { task: '데이터 학습', status: 'in-progress' },
            { task: '시스템 통합', status: 'pending' },
            { task: '파일럿 테스트', status: 'pending' }
        ],
        nextMilestone: '9월 20일 - 프로토타입 데모'
    },
    {
        id: 'card-003',
        title: '모바일 앱 리뉴얼',
        status: '완료',
        statusType: 'completed',
        progress: 100,
        startDate: '2025-06-01',
        endDate: '2025-08-31',
        lastUpdated: '2025-08-31',
        department: '모바일개발팀',
        manager: {
            id: 'user-004',
            name: '박명수',
            position: '차장',
            email: 'myungsoo.park@hanwhalife.com'
        },
        members: [
            { id: 'user-003', name: '유재석', position: '대리', role: '디지털 마케팅 전략' },
            { id: 'user-007', name: '노홍철', position: '팀장', role: '디지털마케팅 팀 리더' },
            { id: 'user-002', name: '이정은', position: '대리', role: 'UX 기획' }
        ],
        description: '사용자 경험 개선 및 최신 디자인 트렌드를 반영한 모바일 앱 전면 리뉴얼',
        keyTasks: [
            { task: '디자인 리뉴얼', status: 'completed' },
            { task: 'iOS 앱 개발', status: 'completed' },
            { task: 'Android 앱 개발', status: 'completed' },
            { task: '테스트', status: 'completed' },
            { task: '배포', status: 'completed' }
        ],
        nextMilestone: '프로젝트 완료'
    },
    {
        id: 'card-004',
        title: '정보보안 강화 프로젝트',
        status: '긴급',
        statusType: 'urgent',
        progress: 40,
        startDate: '2025-09-02',
        endDate: '2025-09-30',
        lastUpdated: '2025-09-05',
        department: '정보보안팀',
        manager: {
            name: '강보안',
            position: '팀장',
            email: 'boan.kang@hanwhalife.com'
        },
        members: [
            { name: '이보안', position: '과장', role: '보안 아키텍처' },
            { name: '김해커', position: '대리', role: '침투 테스트' },
            { name: '박패치', position: '사원', role: '보안 패치' }
        ],
        description: '최신 보안 위협에 대응하기 위한 전사 정보보안 시스템 강화',
        keyTasks: [
            { task: '보안 취약점 진단', status: 'completed' },
            { task: '보안 정책 수립', status: 'in-progress' },
            { task: '시스템 보안 패치', status: 'in-progress' },
            { task: '보안 교육', status: 'pending' },
            { task: '모의 해킹 테스트', status: 'pending' }
        ],
        nextMilestone: '9월 10일 - 1차 보안 패치 완료'
    },
    {
        id: 'card-005',
        title: '고객 데이터 분석 플랫폼',
        status: '대기',
        statusType: 'pending',
        progress: 20,
        startDate: '2025-10-01',
        endDate: '2025-12-31',
        lastUpdated: '2025-09-03',
        department: '데이터분석팀',
        manager: {
            name: '데이터킴',
            position: '팀장',
            email: 'data.kim@hanwhalife.com'
        },
        members: [
            { name: '분석가1', position: '과장', role: '데이터 아키텍처' },
            { name: '분석가2', position: '대리', role: '데이터 분석' },
            { name: '분석가3', position: '사원', role: '시각화' }
        ],
        description: '고객 행동 패턴 분석을 통한 맞춤형 서비스 제공 플랫폼 구축',
        keyTasks: [
            { task: '요구사항 분석', status: 'in-progress' },
            { task: '데이터 수집 체계 구축', status: 'pending' },
            { task: '분석 모델 개발', status: 'pending' },
            { task: '대시보드 개발', status: 'pending' },
            { task: '시스템 배포', status: 'pending' }
        ],
        nextMilestone: '10월 1일 - 프로젝트 킥오프'
    },
    {
        id: 'card-006',
        title: '상태카드',
        status: '완료',
        statusType: 'completed',
        progress: 100,
        startDate: '2025-07-01',
        endDate: '2025-08-15',
        lastUpdated: '2025-08-15',
        department: '디지털프로덕트팀',
        manager: {
            name: '이상태',
            position: '과장',
            email: 'sangtae.lee@hanwhalife.com'
        },
        members: [
            { name: '박카드', position: '대리', role: 'UI/UX 디자인' },
            { name: '김상태', position: '사원', role: '프론트엔드 개발' },
            { name: '최정보', position: '사원', role: '백엔드 개발' }
        ],
        description: '보험 계약 상태 정보를 실시간으로 확인할 수 있는 상태카드 시스템 구축',
        keyTasks: [
            { task: '요구사항 분석', status: 'completed' },
            { task: 'UI/UX 디자인', status: 'completed' },
            { task: 'API 개발', status: 'completed' },
            { task: '프론트엔드 구현', status: 'completed' },
            { task: '테스트 및 배포', status: 'completed' }
        ],
        nextMilestone: '프로젝트 완료 - 운영 중'
    },
    {
        id: 'card-007',
        title: '나의 보험 계약',
        status: '진행중',
        statusType: 'in-progress',
        progress: 85,
        startDate: '2025-08-01',
        endDate: '2025-09-30',
        lastUpdated: '2025-09-05',
        department: '보험서비스팀',
        manager: {
            name: '정보험',
            position: '팀장',
            email: 'bohum.jung@hanwhalife.com'
        },
        members: [
            { name: '이계약', position: '과장', role: '서비스 기획' },
            { name: '박보장', position: '대리', role: 'UI/UX 디자인' },
            { name: '김가입', position: '사원', role: '프론트엔드 개발' },
            { name: '최약관', position: '사원', role: '백엔드 개발' }
        ],
        description: '고객이 자신의 보험 계약 내역을 손쉽게 조회하고 관리할 수 있는 통합 서비스 플랫폼',
        keyTasks: [
            { task: '계약 조회 API 개발', status: 'completed' },
            { task: '보장 내역 분석 기능', status: 'completed' },
            { task: '납입 내역 관리', status: 'completed' },
            { task: '계약 변경 기능', status: 'in-progress' },
            { task: '모바일 앱 연동', status: 'in-progress' },
            { task: '사용자 테스트', status: 'pending' }
        ],
        nextMilestone: '9월 20일 - 베타 서비스 오픈'
    },
    {
        id: 'card-008',
        title: '청약철회',
        status: '진행중',
        statusType: 'in-progress',
        progress: 65,
        startDate: '2025-08-15',
        endDate: '2025-10-15',
        lastUpdated: '2025-09-04',
        department: '보험서비스팀',
        manager: {
            name: '김철회',
            position: '과장',
            email: 'chulhoe.kim@hanwhalife.com'
        },
        members: [
            { name: '이청약', position: '대리', role: '업무 프로세스 설계' },
            { name: '박취소', position: '사원', role: 'UI/UX 디자인' },
            { name: '정환불', position: '사원', role: '프론트엔드 개발' },
            { name: '최처리', position: '사원', role: '백엔드 개발' }
        ],
        description: '보험 가입 후 청약철회를 온라인으로 간편하게 처리할 수 있는 자동화 시스템',
        keyTasks: [
            { task: '청약철회 요건 검증 로직', status: 'completed' },
            { task: '자동 환불 계산 시스템', status: 'completed' },
            { task: '온라인 신청 폼 개발', status: 'in-progress' },
            { task: '심사 자동화 프로세스', status: 'in-progress' },
            { task: '환불 처리 연동', status: 'pending' },
            { task: '규정 준수 검증', status: 'pending' }
        ],
        nextMilestone: '9월 25일 - 심사 자동화 테스트'
    },
    {
        id: 'card-009',
        title: '사고보험금 대리청구',
        status: '진행중',
        statusType: 'in-progress',
        progress: 55,
        startDate: '2025-09-01',
        endDate: '2025-11-30',
        lastUpdated: '2025-09-05',
        department: '보험금지급팀',
        manager: {
            name: '박보험금',
            position: '팀장',
            email: 'bohumgeum.park@hanwhalife.com'
        },
        members: [
            { name: '이청구', position: '과장', role: '업무 프로세스 설계' },
            { name: '김대리', position: '대리', role: '법률 검토' },
            { name: '정서류', position: '사원', role: 'UI/UX 디자인' },
            { name: '최지급', position: '사원', role: '백엔드 개발' },
            { name: '강심사', position: '사원', role: '심사 로직 개발' }
        ],
        description: '미성년자나 의식불명 환자를 대신하여 보험금을 청구할 수 있는 대리청구 시스템',
        keyTasks: [
            { task: '대리청구 자격 검증', status: 'completed' },
            { task: '필수 서류 체크리스트', status: 'completed' },
            { task: '온라인 신청 시스템', status: 'in-progress' },
            { task: '서류 자동 검증', status: 'in-progress' },
            { task: '심사 프로세스 구축', status: 'pending' },
            { task: '지급 처리 연동', status: 'pending' },
            { task: '법적 검토 완료', status: 'pending' }
        ],
        nextMilestone: '10월 10일 - 1차 시스템 테스트'
    }
];

// 상태별 카드 조회
function getStatusCardsByStatus(status) {
    return STATUS_CARDS.filter(card => card.status === status);
}

// 부서별 카드 조회
function getStatusCardsByDepartment(department) {
    return STATUS_CARDS.filter(card => card.department === department);
}

// 관련자로 카드 조회
function getStatusCardsByMember(memberName) {
    return STATUS_CARDS.filter(card => 
        card.manager.name === memberName ||
        card.members.some(member => member.name === memberName)
    );
}

// 진행률별 카드 조회
function getStatusCardsByProgress(minProgress, maxProgress = 100) {
    return STATUS_CARDS.filter(card => 
        card.progress >= minProgress && card.progress <= maxProgress
    );
}
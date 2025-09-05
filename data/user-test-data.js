// User Test 관련 데이터 및 시나리오 관리

// User Test 시나리오 데이터
const USER_TEST_SCENARIOS = [
    {
        id: 'scenario-001',
        title: '회원가입 프로세스 테스트',
        description: '신규 사용자의 회원가입 과정에서의 사용성 테스트',
        type: 'usability',
        duration: 15,
        participants: 10,
        testConditions: [
            '모바일 환경에서 테스트',
            '20-30대 사용자 대상',
            '보험 관련 사전 지식 없음',
            '처음 방문 사용자'
        ],
        tasks: [
            {
                id: 'task-001',
                title: '메인 페이지에서 회원가입 버튼 찾기',
                expectedTime: 30,
                difficulty: 'easy'
            },
            {
                id: 'task-002', 
                title: '개인정보 입력 완료',
                expectedTime: 180,
                difficulty: 'medium'
            },
            {
                id: 'task-003',
                title: '본인 인증 절차 완료',
                expectedTime: 120,
                difficulty: 'medium'
            }
        ],
        metrics: {
            completionRate: 85,
            averageTime: 330,
            satisfactionScore: 4.2,
            errorRate: 12
        }
    },
    {
        id: 'scenario-002',
        title: '보험 상품 비교 테스트',
        description: '사용자가 다양한 보험 상품을 비교하고 선택하는 과정 테스트',
        type: 'navigation',
        duration: 20,
        participants: 15,
        testConditions: [
            '데스크톱 환경에서 테스트',
            '30-50대 사용자 대상',
            '보험 가입 경험 있음',
            '비교 구매 성향'
        ],
        tasks: [
            {
                id: 'task-004',
                title: '상품 카테고리 선택',
                expectedTime: 45,
                difficulty: 'easy'
            },
            {
                id: 'task-005',
                title: '상품 비교 기능 사용',
                expectedTime: 240,
                difficulty: 'hard'
            },
            {
                id: 'task-006',
                title: '견적 요청 완료',
                expectedTime: 180,
                difficulty: 'medium'
            }
        ],
        metrics: {
            completionRate: 78,
            averageTime: 465,
            satisfactionScore: 3.8,
            errorRate: 18
        }
    },
    {
        id: 'scenario-003',
        title: 'AI 비서 사용성 테스트',
        description: 'AI 비서 기능의 직관성과 응답 정확도 테스트',
        type: 'interaction',
        duration: 25,
        participants: 12,
        testConditions: [
            '모바일/데스크톱 혼합 환경',
            '전 연령대 사용자',
            'AI 서비스 사용 경험 다양',
            '자연어 질문 능력 테스트'
        ],
        tasks: [
            {
                id: 'task-007',
                title: 'AI 비서와 첫 대화 시작',
                expectedTime: 60,
                difficulty: 'easy'
            },
            {
                id: 'task-008',
                title: '복잡한 질문에 대한 답변 품질 평가',
                expectedTime: 300,
                difficulty: 'hard'
            },
            {
                id: 'task-009',
                title: '업무 관련 기능 활용',
                expectedTime: 240,
                difficulty: 'medium'
            }
        ],
        metrics: {
            completionRate: 92,
            averageTime: 600,
            satisfactionScore: 4.5,
            errorRate: 8
        }
    }
];

// User Test 설정 템플릿
const USER_TEST_TEMPLATES = {
    usability: {
        name: '사용성 테스트',
        icon: 'usability-icon',
        description: '인터페이스의 사용편의성을 평가합니다',
        defaultDuration: 20,
        recommendedParticipants: '8-12명',
        keyMetrics: ['작업 완료율', '소요 시간', '오류 빈도', '만족도']
    },
    navigation: {
        name: '내비게이션 테스트', 
        icon: 'navigation-icon',
        description: '정보 구조와 탐색 경로를 평가합니다',
        defaultDuration: 25,
        recommendedParticipants: '10-15명',
        keyMetrics: ['경로 발견율', '탐색 효율성', '이탈률', '목표 달성률']
    },
    interaction: {
        name: '상호작용 테스트',
        icon: 'interaction-icon', 
        description: '사용자와 시스템간의 상호작용을 평가합니다',
        defaultDuration: 30,
        recommendedParticipants: '6-10명',
        keyMetrics: ['응답 정확도', '상호작용 자연스러움', '학습 용이성', '재사용 의향']
    },
    accessibility: {
        name: '접근성 테스트',
        icon: 'accessibility-icon',
        description: '다양한 사용자의 접근성을 평가합니다', 
        defaultDuration: 35,
        recommendedParticipants: '8-12명',
        keyMetrics: ['스크린리더 호환성', '키보드 탐색', '색상 대비', '텍스트 가독성']
    }
};

// User Test 담당자 정보
const USER_TEST_MANAGERS = {
    lead: {
        id: 'user-002',
        name: '이정은',
        position: '선임 UX 연구원',
        department: '디지털프로덕트팀',
        email: 'jeongeun.lee@hanwhalife.com',
        phone: '010-1234-5679',
        profileImage: 'assets/avatar-placeholder.png',
        specialties: ['사용자 경험 연구', 'A/B 테스팅', '정성적 리서치', '데이터 분석'],
        experience: '7년',
        currentProjects: ['모바일 앱 리뉴얼 UX 테스트', 'AI 비서 사용성 개선']
    },
    analyst: {
        id: 'user-007',
        name: '정준하',
        position: '데이터 분석가',
        department: '디지털마케팅팀',
        email: 'junha.jung@hanwhalife.com', 
        phone: '010-3456-7890',
        profileImage: 'assets/avatar-placeholder.png',
        specialties: ['사용자 행동 분석', '통계적 검증', '성과 지표 분석', 'GA4'],
        experience: '5년',
        currentProjects: ['전환율 최적화 분석', '사용자 여정 맵핑']
    }
};

// User Test 진행 상태
const USER_TEST_STATUS = {
    planned: { name: '계획됨', color: '#6b7280', icon: '📋' },
    inProgress: { name: '진행중', color: '#3b82f6', icon: '🔄' },
    analyzing: { name: '분석중', color: '#f59e0b', icon: '📊' },
    completed: { name: '완료', color: '#10b981', icon: '✅' },
    cancelled: { name: '취소됨', color: '#ef4444', icon: '❌' }
};

// User Test 결과 샘플 데이터
const USER_TEST_RESULTS = {
    'scenario-001': {
        status: 'completed',
        completedDate: '2024-01-10',
        summary: {
            totalParticipants: 10,
            completionRate: 85,
            averageTime: 330,
            satisfactionScore: 4.2,
            majorIssues: [
                '회원가입 버튼이 눈에 잘 띄지 않음',
                '본인 인증 과정이 복잡함',
                '개인정보 처리방침 내용이 길어 읽기 어려움'
            ],
            recommendations: [
                '메인 페이지 CTA 버튼 위치 및 디자인 개선',
                '본인 인증 단계 간소화',
                '개인정보 처리방침 요약본 제공'
            ]
        },
        detailAnalysis: {
            demographics: {
                ageGroups: { '20-25': 3, '26-30': 7 },
                gender: { male: 4, female: 6 },
                experience: { novice: 8, experienced: 2 }
            },
            taskAnalysis: [
                {
                    taskId: 'task-001',
                    successRate: 90,
                    averageTime: 35,
                    commonErrors: ['버튼을 찾지 못함', '다른 링크 클릭']
                },
                {
                    taskId: 'task-002', 
                    successRate: 85,
                    averageTime: 195,
                    commonErrors: ['필수 항목 누락', '형식 오류']
                },
                {
                    taskId: 'task-003',
                    successRate: 80,
                    averageTime: 140,
                    commonErrors: ['인증번호 입력 지연', '재시도 필요']
                }
            ]
        }
    }
};

// 전역 객체로 내보내기
if (typeof window !== 'undefined') {
    window.USER_TEST_SCENARIOS = USER_TEST_SCENARIOS;
    window.USER_TEST_TEMPLATES = USER_TEST_TEMPLATES;
    window.USER_TEST_MANAGERS = USER_TEST_MANAGERS;
    window.USER_TEST_STATUS = USER_TEST_STATUS;
    window.USER_TEST_RESULTS = USER_TEST_RESULTS;
}
/**
 * 조직도 및 담당자 상세정보 데이터
 * 한화생명 조직 구조와 담당자 관계 매핑
 */

const ORGANIZATION_DATA = {
    // 조직도 정보 - 상하급자 관계 및 팀원 정보
    hierarchy: {
        "user-001": { // 김동준
            managerId: "user-005",
            subordinates: [],
            team: "세일즈플러스파트",
            department: "디지털프로덕트팀",
            teamMembers: ["user-002", "user-003"] // 같은 팀 멤버
        },
        "user-002": { // 이정은
            managerId: "user-006",
            subordinates: [],
            team: "고객서비스파트",
            department: "디지털프로덕트팀",
            teamMembers: ["user-001", "user-003"]
        },
        "user-003": { // 유재석
            managerId: "user-007",
            subordinates: [],
            team: "디지털마케팅팀",
            department: "마케팅본부",
            teamMembers: ["user-001", "user-002"]
        },
        "user-004": { // 박명수
            managerId: "user-008",
            subordinates: ["user-005"],
            team: "자산운용파트",
            department: "재무관리팀",
            teamMembers: []
        },
        "user-005": { // 정준하
            managerId: "user-008",
            subordinates: ["user-001"], // 김동준 담당
            team: "인재개발파트",
            department: "인사팀",
            teamMembers: ["user-004"]
        },
        "user-006": { // 정형돈 (부장)
            managerId: "user-010",
            subordinates: ["user-002"], // 이정은 담당
            team: "AI개발파트",
            department: "디지털프로덕트팀",
            teamMembers: []
        },
        "user-007": { // 노홍철 (팀장)
            managerId: "user-011",
            subordinates: ["user-003"], // 유재석 담당
            team: "디지털마케팅팀",
            department: "마케팅본부",
            teamMembers: []
        }
    },

    // 상급자 정보 (매니저들)
    managers: {
        "user-008": {
            id: "user-008",
            name: "안소영",
            position: "과장",
            department: "인사팀",
            team: "인재개발파트",
            email: "soyoung.an@hanwhalife.com",
            phone: "010-1111-2222",
            avatar: "assets/avatars/an-soyoung.png",
            specialties: ["인사관리", "교육 프로그램", "조직 개발"],
            workingHours: "09:00-18:00"
        },
        "user-010": {
            id: "user-010",
            name: "최현우",
            position: "상무",
            department: "디지털프로덕트팀",
            team: "전략기획",
            email: "hyunwoo.choi@hanwhalife.com",
            phone: "010-3333-4444",
            avatar: "assets/avatars/choi-hyunwoo.png",
            specialties: ["디지털 전략", "제품 기획", "사업 개발"],
            workingHours: "08:30-19:00"
        },
        "user-011": {
            id: "user-011",
            name: "한지민",
            position: "본부장",
            department: "마케팅본부",
            team: "마케팅전략",
            email: "jimin.han@hanwhalife.com",
            phone: "010-5555-6666",
            avatar: "assets/avatars/han-jimin.png",
            specialties: ["마케팅 전략", "브랜드 관리", "고객 경험"],
            workingHours: "09:00-18:30"
        }
    },

    // 담당자별 세부 정보
    contactDetails: {
        "user-001": {
            responsibilities: [
                "백엔드 시스템 개발",
                "API 설계 및 구현",
                "데이터베이스 최적화",
                "서버 성능 관리"
            ],
            expertise: ["Python", "Django", "PostgreSQL", "Redis", "Docker"],
            currentProjects: [
                {
                    name: "고객 데이터 플랫폼 개선",
                    status: "진행중",
                    completion: 75,
                    deadline: "2024-02-28"
                },
                {
                    name: "AI 모델 API 구축",
                    status: "계획",
                    completion: 0,
                    deadline: "2024-03-15"
                }
            ],
            recentAchievements: [
                "Q4 시스템 성능 20% 향상",
                "신규 API 개발 완료",
                "팀 내 코드 리뷰 표준화"
            ],
            workStyle: {
                communicationPreference: "슬랙, 이메일",
                meetingAvailability: "화요일, 목요일 오후",
                responseTime: "평균 2시간 이내"
            }
        },
        "user-002": {
            responsibilities: [
                "사용자 경험 설계",
                "프로토타입 제작",
                "사용성 테스트",
                "디자인 시스템 관리"
            ],
            expertise: ["Figma", "Sketch", "Adobe XD", "사용자 리서치", "와이어프레임"],
            currentProjects: [
                {
                    name: "모바일 앱 리디자인",
                    status: "진행중",
                    completion: 60,
                    deadline: "2024-02-15"
                },
                {
                    name: "사용자 행동 분석 도구",
                    status: "검토중",
                    completion: 30,
                    deadline: "2024-03-30"
                }
            ],
            recentAchievements: [
                "모바일 전환율 15% 개선",
                "디자인 시스템 구축",
                "사용자 만족도 4.2점 달성"
            ],
            workStyle: {
                communicationPreference: "직접 미팅, 피그마 댓글",
                meetingAvailability: "월요일, 수요일 오전",
                responseTime: "평균 1시간 이내"
            }
        },
        "user-003": {
            responsibilities: [
                "디지털 마케팅 전략 수립",
                "온라인 캠페인 관리",
                "성과 분석 및 보고",
                "마케팅 자동화"
            ],
            expertise: ["Google Analytics", "Facebook Ads", "SEO/SEM", "마케팅 자동화"],
            currentProjects: [
                {
                    name: "2024 브랜드 인지도 캠페인",
                    status: "진행중",
                    completion: 45,
                    deadline: "2024-06-30"
                },
                {
                    name: "고객 획득 비용 최적화",
                    status: "계획",
                    completion: 10,
                    deadline: "2024-04-30"
                }
            ],
            recentAchievements: [
                "Q4 리드 생성 30% 증가",
                "마케팅 ROI 25% 향상",
                "브랜드 검색량 40% 증가"
            ],
            workStyle: {
                communicationPreference: "카카오톡, 전화",
                meetingAvailability: "매일 오후 2-5시",
                responseTime: "평균 30분 이내"
            }
        },
        "user-004": {
            responsibilities: [
                "포트폴리오 관리",
                "리스크 분석",
                "투자 전략 수립",
                "시장 동향 분석"
            ],
            expertise: ["금융 분석", "리스크 관리", "Excel VBA", "Bloomberg Terminal"],
            currentProjects: [
                {
                    name: "ESG 투자 포트폴리오 구성",
                    status: "진행중",
                    completion: 80,
                    deadline: "2024-01-31"
                },
                {
                    name: "시장 리스크 모델링",
                    status: "검토중",
                    completion: 50,
                    deadline: "2024-03-15"
                }
            ],
            recentAchievements: [
                "포트폴리오 수익률 8.5% 달성",
                "리스크 지표 개선",
                "투자 프로세스 자동화"
            ],
            workStyle: {
                communicationPreference: "이메일, 공식 문서",
                meetingAvailability: "월요일-금요일 오전",
                responseTime: "평균 4시간 이내"
            }
        },
        "user-005": {
            responsibilities: [
                "교육 프로그램 기획",
                "직원 역량 개발",
                "온보딩 프로세스 관리",
                "교육 효과 측정"
            ],
            expertise: ["교육 설계", "HR 시스템", "커뮤니케이션", "프로젝트 관리"],
            currentProjects: [
                {
                    name: "2024 신입사원 교육 과정",
                    status: "진행중",
                    completion: 90,
                    deadline: "2024-02-28"
                },
                {
                    name: "리더십 개발 프로그램",
                    status: "계획",
                    completion: 20,
                    deadline: "2024-05-31"
                }
            ],
            recentAchievements: [
                "신입사원 교육 만족도 4.7점",
                "교육 프로그램 디지털화 완료",
                "직원 역량 평가 시스템 개선"
            ],
            workStyle: {
                communicationPreference: "Teams, 직접 미팅",
                meetingAvailability: "화요일, 목요일 전일",
                responseTime: "평균 2시간 이내"
            }
        },
        "user-006": {
            responsibilities: [
                "AI 서비스 전략 수립",
                "팀 운영 및 관리",
                "기술 로드맵 계획",
                "사업부 협업 조율"
            ],
            expertise: ["AI 전략", "팀 리더십", "제품 관리", "사업 개발"],
            currentProjects: [
                {
                    name: "차세대 AI 플랫폼 구축",
                    status: "진행중",
                    completion: 55,
                    deadline: "2024-08-31"
                },
                {
                    name: "AI 윤리 가이드라인 수립",
                    status: "검토중",
                    completion: 30,
                    deadline: "2024-04-15"
                }
            ],
            recentAchievements: [
                "AI 모델 정확도 15% 향상",
                "개발 프로세스 표준화",
                "팀 생산성 25% 증가"
            ],
            workStyle: {
                communicationPreference: "슬랙, 정기 미팅",
                meetingAvailability: "매일 오전 9-11시",
                responseTime: "평균 1시간 이내"
            }
        },
        "user-007": {
            responsibilities: [
                "디지털 마케팅 팀 리더십",
                "마케팅 전략 총괄",
                "예산 계획 및 관리",
                "성과 관리 및 보고"
            ],
            expertise: ["디지털 마케팅", "브랜드 관리", "팀 관리", "데이터 분석"],
            currentProjects: [
                {
                    name: "옴니채널 마케팅 플랫폼",
                    status: "진행중",
                    completion: 65,
                    deadline: "2024-05-31"
                },
                {
                    name: "고객 여정 최적화",
                    status: "계획",
                    completion: 15,
                    deadline: "2024-07-31"
                }
            ],
            recentAchievements: [
                "마케팅 ROI 35% 개선",
                "브랜드 인지도 20% 상승",
                "팀 성과 목표 120% 달성"
            ],
            workStyle: {
                communicationPreference: "카카오톡, Teams",
                meetingAvailability: "월요일, 수요일, 금요일 오후",
                responseTime: "평균 1시간 이내"
            }
        }
    },

    // 팀별 담당 업무 영역
    teamResponsibilities: {
        "디지털프로덕트팀": {
            description: "디지털 제품 개발 및 기술 혁신을 담당하는 핵심 부서",
            mainServices: [
                "AI 서비스 개발",
                "고객 플랫폼 구축",
                "데이터 분석 시스템",
                "모바일 애플리케이션"
            ],
            contactKeywords: ["개발", "기술", "시스템", "플랫폼", "앱"]
        },
        "마케팅본부": {
            description: "브랜드 마케팅 및 고객 획득을 담당하는 전문 조직",
            mainServices: [
                "디지털 마케팅 캠페인",
                "브랜드 전략 수립",
                "고객 경험 개선",
                "시장 조사 및 분석"
            ],
            contactKeywords: ["마케팅", "브랜드", "캠페인", "광고", "홍보"]
        },
        "재무관리팀": {
            description: "자산 운용 및 재무 리스크 관리 전담 부서",
            mainServices: [
                "투자 포트폴리오 관리",
                "리스크 분석 및 관리",
                "재무 계획 수립",
                "자산 운용 전략"
            ],
            contactKeywords: ["투자", "자산", "재무", "포트폴리오", "리스크"]
        },
        "인사팀": {
            description: "인재 개발 및 조직 운영을 지원하는 핵심 기능",
            mainServices: [
                "교육 프로그램 운영",
                "인사 제도 관리",
                "조직 문화 개발",
                "성과 관리 시스템"
            ],
            contactKeywords: ["교육", "인사", "조직", "성과", "문화"]
        }
    }
};

// 전역에서 사용할 수 있도록 export
if (typeof window !== 'undefined') {
    window.ORGANIZATION_DATA = ORGANIZATION_DATA;
}
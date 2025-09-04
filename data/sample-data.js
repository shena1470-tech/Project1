/**
 * 샘플 데이터 정의
 * localStorage에 데이터가 없을 경우 사용될 초기 데이터
 */

const SAMPLE_DATA = {
    // 사용자 프로필 데이터
    userProfile: {
        name: "김한화",
        position: "사원",
        department: "디지털혁신팀",
        email: "kim.hanwha@hanwhalife.com",
        phone: "010-1234-5678",
        avatar: "assets/avatar-placeholder.png"
    },

    // 통계 데이터
    stats: {
        totalQueries: 127,
        savedTime: 85,
        accuracy: 94,
        documentsProcessed: 42
    },

    // 최근 문서 데이터
    documents: [
        {
            id: "doc_001",
            title: "2024년 1분기 실적보고서",
            type: "보고서",
            date: "2024-03-15",
            category: "경영",
            size: "2.4MB",
            lastAccessed: "2024-03-20T10:30:00"
        },
        {
            id: "doc_002",
            title: "신상품 개발 제안서",
            type: "제안서",
            date: "2024-03-18",
            category: "상품개발",
            size: "1.8MB",
            lastAccessed: "2024-03-19T14:20:00"
        },
        {
            id: "doc_003",
            title: "디지털 전환 전략 로드맵",
            type: "전략문서",
            date: "2024-03-10",
            category: "IT",
            size: "3.2MB",
            lastAccessed: "2024-03-18T09:15:00"
        },
        {
            id: "doc_004",
            title: "고객만족도 조사 분석",
            type: "분석자료",
            date: "2024-03-12",
            category: "마케팅",
            size: "1.5MB",
            lastAccessed: "2024-03-17T16:45:00"
        },
        {
            id: "doc_005",
            title: "리스크 관리 가이드라인",
            type: "가이드",
            date: "2024-03-08",
            category: "리스크관리",
            size: "2.1MB",
            lastAccessed: "2024-03-16T11:00:00"
        }
    ],

    // 일정 데이터
    schedules: [
        {
            id: "sch_001",
            title: "분기 실적 보고",
            date: "2024-03-25",
            time: "10:00",
            duration: "2시간",
            location: "본사 대회의실",
            type: "회의",
            participants: ["김부장", "이과장", "박대리"],
            description: "2024년 1분기 실적 검토 및 2분기 목표 설정"
        },
        {
            id: "sch_002",
            title: "AI 시스템 교육",
            date: "2024-03-26",
            time: "14:00",
            duration: "3시간",
            location: "교육장 A",
            type: "교육",
            participants: ["디지털혁신팀 전체"],
            description: "신규 AI 어시스턴트 시스템 사용법 교육"
        },
        {
            id: "sch_003",
            title: "신상품 기획 회의",
            date: "2024-03-27",
            time: "15:00",
            duration: "1시간 30분",
            location: "온라인",
            type: "회의",
            participants: ["상품개발팀", "마케팅팀"],
            description: "2024년 하반기 출시 예정 신상품 기획안 검토"
        },
        {
            id: "sch_004",
            title: "팀 워크샵",
            date: "2024-03-28",
            time: "09:00",
            duration: "종일",
            location: "외부 연수원",
            type: "워크샵",
            participants: ["디지털혁신팀"],
            description: "팀빌딩 및 혁신 아이디어 발굴 워크샵"
        },
        {
            id: "sch_005",
            title: "고객 미팅",
            date: "2024-03-29",
            time: "11:00",
            duration: "1시간",
            location: "VIP 회의실",
            type: "미팅",
            participants: ["김한화", "영업팀장"],
            description: "주요 기업고객 계약 갱신 협의"
        }
    ],

    // 채팅 히스토리 데이터
    chatHistory: [
        {
            id: "chat_001",
            date: "2024-03-20T09:15:00",
            messages: [
                {
                    type: "user",
                    content: "지난달 매출 실적 보고서를 찾아줘",
                    timestamp: "2024-03-20T09:15:00"
                },
                {
                    type: "ai",
                    content: "2024년 2월 매출 실적 보고서를 찾았습니다. 주요 내용은 다음과 같습니다:\n- 전체 매출: 전년 동월 대비 12% 증가\n- 신규 계약: 345건\n- 주요 성과: 디지털 채널 매출 25% 성장",
                    timestamp: "2024-03-20T09:15:05"
                }
            ]
        },
        {
            id: "chat_002",
            date: "2024-03-19T14:30:00",
            messages: [
                {
                    type: "user",
                    content: "내일 일정 확인해줘",
                    timestamp: "2024-03-19T14:30:00"
                },
                {
                    type: "ai",
                    content: "내일(3월 20일) 일정입니다:\n• 10:00 - 팀 회의 (회의실 A)\n• 14:00 - 신상품 리뷰 (온라인)\n• 16:00 - 고객 미팅 (VIP룸)",
                    timestamp: "2024-03-19T14:30:03"
                }
            ]
        }
    ],

    // 즐겨찾기/북마크 데이터
    bookmarks: [
        {
            id: "bm_001",
            title: "월간 실적 대시보드",
            type: "대시보드",
            url: "/dashboard/monthly-performance",
            category: "경영",
            addedDate: "2024-03-01T09:00:00"
        },
        {
            id: "bm_002",
            title: "보험상품 가이드",
            type: "문서",
            url: "/docs/product-guide",
            category: "상품",
            addedDate: "2024-02-15T10:30:00"
        },
        {
            id: "bm_003",
            title: "AI 어시스턴트 매뉴얼",
            type: "매뉴얼",
            url: "/manual/ai-assistant",
            category: "시스템",
            addedDate: "2024-03-05T14:00:00"
        }
    ],

    // 알림 설정 데이터
    notificationSettings: {
        emailNotifications: true,
        pushNotifications: true,
        meetingReminders: true,
        documentUpdates: true,
        systemAlerts: true,
        reminderTime: 15 // 미팅 15분 전 알림
    },

    // 시스템 설정 데이터
    systemSettings: {
        theme: "light",
        language: "ko",
        fontSize: "medium",
        autoSave: true,
        dataSync: true,
        lastSync: "2024-03-20T08:00:00"
    }
};

// 샘플 데이터 내보내기
if (typeof module !== 'undefined' && module.exports) {
    module.exports = SAMPLE_DATA;
}
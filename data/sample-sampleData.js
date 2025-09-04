/**
 * 샘플 데이터 정의
 * 사용자, 템플릿, AI 응답, 일정, 문서 등의 샘플 데이터
 */

const SAMPLE_SAMPLE_DATA = {
    users: [
        {
            id: 1,
            name: "김철수",
            email: "chulsoo@example.com",
            role: "관리자",
            avatar: "assets/avatar-1.png",
            preferences: {
                theme: "light",
                language: "ko",
                notifications: true
            }
        }
    ],
    
    templates: {
        documents: [
            {
                id: "doc-1",
                name: "회의록 템플릿",
                category: "회의",
                content: "# 회의록\n\n**일시:** \n**장소:** \n**참석자:** \n\n## 안건\n1. \n2. \n\n## 논의사항\n\n## 결정사항\n\n## 차기 회의"
            },
            {
                id: "doc-2",
                name: "보고서 템플릿",
                category: "보고서",
                content: "# 보고서\n\n**작성자:** \n**날짜:** \n\n## 요약\n\n## 배경\n\n## 현황\n\n## 분석\n\n## 결론 및 제안"
            },
            {
                id: "doc-3",
                name: "제안서 템플릿",
                category: "제안",
                content: "# 제안서\n\n## 제안 개요\n\n## 목적\n\n## 제안 내용\n\n## 기대효과\n\n## 예산\n\n## 일정"
            }
        ],
        emails: [
            {
                id: "email-1",
                name: "회의 초대",
                content: "안녕하세요,\n\n다음 주 [날짜] [시간]에 [주제]에 대한 회의가 있을 예정입니다.\n\n장소: [장소]\n안건: [안건]\n\n참석 부탁드립니다.\n\n감사합니다."
            },
            {
                id: "email-2",
                name: "프로젝트 진행 상황",
                content: "안녕하세요,\n\n[프로젝트명] 진행 상황을 공유드립니다.\n\n현재 진행률: [%]\n완료 항목:\n- \n- \n\n진행 중 항목:\n- \n- \n\n이슈사항:\n- \n\n감사합니다."
            }
        ]
    },
    
    aiResponses: {
        greetings: [
            "안녕하세요! 오늘은 어떤 도움이 필요하신가요?",
            "반갑습니다! 무엇을 도와드릴까요?",
            "좋은 하루입니다! 어떤 작업을 시작하시겠습니까?"
        ],
        confirmations: [
            "네, 이해했습니다. 바로 처리하겠습니다.",
            "알겠습니다. 작업을 시작하겠습니다.",
            "네, 확인했습니다. 진행하겠습니다."
        ],
        questions: [
            "추가로 필요한 정보가 있으신가요?",
            "다른 도움이 필요하신가요?",
            "이 작업과 관련해 더 설명이 필요하신가요?"
        ],
        completions: [
            "작업이 완료되었습니다!",
            "요청하신 작업을 마쳤습니다.",
            "성공적으로 처리되었습니다."
        ]
    },
    
    scheduleTypes: [
        {
            type: "meeting",
            label: "회의",
            color: "#5E5CE6",
            icon: "fas fa-users"
        },
        {
            type: "deadline",
            label: "마감일",
            color: "#FF6B6B",
            icon: "fas fa-clock"
        },
        {
            type: "reminder",
            label: "알림",
            color: "#4ECDC4",
            icon: "fas fa-bell"
        },
        {
            type: "event",
            label: "이벤트",
            color: "#FFD93D",
            icon: "fas fa-calendar-day"
        }
    ],
    
    taskCategories: [
        {
            id: "urgent",
            name: "긴급",
            color: "#FF6B6B",
            priority: 1
        },
        {
            id: "important",
            name: "중요",
            color: "#FFD93D",
            priority: 2
        },
        {
            id: "normal",
            name: "일반",
            color: "#4ECDC4",
            priority: 3
        },
        {
            id: "low",
            name: "낮음",
            color: "#95E1D3",
            priority: 4
        }
    ],
    
    sampleSchedules: [
        {
            id: "sch-1",
            title: "팀 회의",
            type: "meeting",
            date: "2024-01-15",
            time: "10:00",
            duration: 60,
            location: "회의실 A",
            participants: ["김철수", "이영희", "박민수"],
            description: "주간 프로젝트 진행 상황 점검"
        },
        {
            id: "sch-2",
            title: "보고서 제출",
            type: "deadline",
            date: "2024-01-20",
            time: "18:00",
            description: "월간 실적 보고서 제출 마감"
        },
        {
            id: "sch-3",
            title: "신년 행사",
            type: "event",
            date: "2024-01-25",
            time: "19:00",
            duration: 180,
            location: "컨벤션 센터",
            description: "2024년 신년 회사 행사"
        }
    ],
    
    sampleDocuments: [
        {
            id: "doc-sample-1",
            title: "2024년 사업계획서",
            type: "보고서",
            createdDate: "2024-01-05",
            lastModified: "2024-01-10",
            author: "김철수",
            tags: ["계획", "2024", "사업"],
            status: "완료"
        },
        {
            id: "doc-sample-2",
            title: "1월 팀 회의록",
            type: "회의록",
            createdDate: "2024-01-08",
            lastModified: "2024-01-08",
            author: "이영희",
            tags: ["회의", "1월", "팀"],
            status: "진행중"
        },
        {
            id: "doc-sample-3",
            title: "신규 프로젝트 제안서",
            type: "제안서",
            createdDate: "2024-01-12",
            lastModified: "2024-01-13",
            author: "박민수",
            tags: ["제안", "프로젝트", "신규"],
            status: "검토중"
        }
    ],
    
    analyticsData: {
        daily: {
            labels: ["월", "화", "수", "목", "금", "토", "일"],
            tasks: [12, 15, 8, 20, 18, 10, 5],
            chats: [30, 45, 35, 50, 40, 20, 15],
            documents: [5, 8, 6, 10, 9, 3, 2]
        },
        monthly: {
            labels: ["1월", "2월", "3월", "4월", "5월", "6월"],
            efficiency: [75, 78, 82, 85, 88, 90],
            satisfaction: [4.2, 4.3, 4.5, 4.6, 4.7, 4.8]
        },
        categories: {
            labels: ["문서작성", "데이터분석", "일정관리", "커뮤니케이션", "기타"],
            values: [35, 25, 20, 15, 5]
        }
    },
    
    settings: {
        themes: [
            {
                id: "light",
                name: "라이트 모드",
                primary: "#5E5CE6",
                background: "#FFFFFF"
            },
            {
                id: "dark",
                name: "다크 모드",
                primary: "#8E8DF0",
                background: "#1A1A2E"
            },
            {
                id: "auto",
                name: "자동",
                description: "시스템 설정을 따릅니다"
            }
        ],
        languages: [
            {
                code: "ko",
                name: "한국어",
                flag: "🇰🇷"
            },
            {
                code: "en",
                name: "English",
                flag: "🇺🇸"
            },
            {
                code: "ja",
                name: "日本語",
                flag: "🇯🇵"
            }
        ],
        notificationTypes: [
            {
                id: "chat",
                label: "채팅 알림",
                enabled: true
            },
            {
                id: "schedule",
                label: "일정 알림",
                enabled: true
            },
            {
                id: "document",
                label: "문서 알림",
                enabled: false
            },
            {
                id: "system",
                label: "시스템 알림",
                enabled: true
            }
        ]
    }
};

// 전역에서 사용할 수 있도록 export
if (typeof window !== 'undefined') {
    window.SAMPLE_SAMPLE_DATA = SAMPLE_SAMPLE_DATA;
}
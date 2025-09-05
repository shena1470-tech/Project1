/**
 * 사용자 데이터 정의
 * 한화생명 임직원 정보 및 조직 구조
 */

const SAMPLE_USERS_DATA = {
    users: [
        {
            id: "user-001",
            employeeId: "HW2021001",
            name: "김동준",
            nameEn: "Kim Dong Jun",
            email: "dongjun.kim@hanwhalife.com",
            phone: "010-1234-5678",
            department: "디지털프로덕트팀",
            team: "세일즈플러스파트",
            position: "과장",
            jobTitle: "Backend 개발",
            level: "L4",
            joinDate: "2021-03-15",
            birthDate: "1987-04-16",
            avatar: "assets/avatars/kim-dongjun.png",
            status: "active",
            location: {
                office: "본사",
                building: "63빌딩",
                floor: "8F",
                seat: "A-42-15"
            },
            manager: {
                id: "user-005",
                name: "정준하",
                position: "차장"
            },
            permissions: {
                chat: true,
                reports: true,
                schedule: true,
                board: true,
                admin: false
            },
            preferences: {
                theme: "light",
                language: "ko",
                fontSize: "medium",
                notifications: {
                    email: true,
                    push: true,
                    sms: false,
                    desktop: true
                },
                workingHours: {
                    start: "09:00",
                    end: "18:00",
                    timezone: "Asia/Seoul"
                }
            },
            stats: {
                lastLogin: "2024-01-15T08:45:00Z",
                totalChats: 342,
                documentsCreated: 87,
                meetingsScheduled: 45,
                averageResponseTime: 2.5
            },
            skills: ["Python", "Machine Learning", "Data Analysis", "Project Management"],
            certifications: ["PMP", "AWS Solutions Architect", "Data Science Certificate"]
        },
        {
            id: "user-002",
            employeeId: "HW2022002",
            name: "이정은",
            nameEn: "Lee Jung Eun",
            email: "jungeun.lee@hanwhalife.com",
            phone: "010-2222-3333",
            department: "디지털프로덕트팀",
            team: "고객서비스파트",
            position: "대리",
            jobTitle: "UX 기획",
            level: "L3",
            joinDate: "2022-02-14",
            birthDate: "1998-08-22",
            avatar: "assets/avatars/lee-jungeun.png",
            status: "active",
            location: {
                office: "본사",
                building: "63빌딩",
                floor: "42F",
                seat: "B-42-08"
            },
            manager: {
                id: "user-006",
                name: "정형돈",
                position: "부장"
            },
            permissions: {
                chat: true,
                reports: true,
                schedule: true,
                board: true,
                admin: false
            },
            preferences: {
                theme: "light",
                language: "ko",
                fontSize: "medium",
                notifications: {
                    email: true,
                    push: true,
                    sms: false,
                    desktop: true
                },
                workingHours: {
                    start: "09:00",
                    end: "18:00",
                    timezone: "Asia/Seoul"
                }
            },
            stats: {
                lastLogin: "2024-01-15T09:30:00Z",
                totalChats: 412,
                documentsCreated: 98,
                meetingsScheduled: 67,
                averageResponseTime: 2.3
            },
            skills: ["UX Design", "User Research", "Prototyping", "Figma", "User Testing"],
            certifications: ["UX Design Professional", "Google UX Design Certificate"]
        },
        {
            id: "user-003",
            employeeId: "HW2019003",
            name: "유재석",
            nameEn: "Yoo Jae Suk",
            email: "jaesuk.yoo@hanwhalife.com",
            phone: "010-2345-6789",
            department: "마케팅본부",
            team: "디지털마케팅팀",
            position: "대리",
            jobTitle: "디지털 마케팅 전략",
            level: "L3",
            joinDate: "2019-07-01",
            birthDate: "1992-03-15",
            avatar: "assets/avatars/yoo-jaesuk.png",
            status: "active",
            location: {
                office: "본사",
                building: "63빌딩",
                floor: "38F",
                seat: "B-38-22"
            },
            manager: {
                id: "user-006",
                name: "최지훈",
                position: "팀장"
            },
            permissions: {
                chat: true,
                reports: true,
                schedule: true,
                board: true,
                admin: false
            },
            preferences: {
                theme: "dark",
                language: "ko",
                fontSize: "small",
                notifications: {
                    email: true,
                    push: true,
                    sms: true,
                    desktop: true
                },
                workingHours: {
                    start: "09:00",
                    end: "18:00",
                    timezone: "Asia/Seoul"
                }
            },
            stats: {
                lastLogin: "2024-01-15T09:15:00Z",
                totalChats: 523,
                documentsCreated: 156,
                meetingsScheduled: 89,
                averageResponseTime: 1.8
            },
            skills: ["Marketing Strategy", "Data Analytics", "Content Creation", "SEO/SEM"],
            certifications: ["Google Analytics", "Facebook Blueprint", "HubSpot Marketing"]
        },
        {
            id: "user-004",
            employeeId: "HW2020004",
            name: "박명수",
            nameEn: "Park Myung Soo",
            email: "myungsoo.park@hanwhalife.com",
            phone: "010-3456-7890",
            department: "재무관리팀",
            team: "자산운용파트",
            position: "차장",
            jobTitle: "자산 포트폴리오 관리",
            level: "L5",
            joinDate: "2020-01-10",
            birthDate: "1985-11-08",
            avatar: "assets/avatars/park-myungsoo.png",
            status: "active",
            location: {
                office: "본사",
                building: "63빌딩",
                floor: "45F",
                seat: "A-45-08"
            },
            manager: {
                id: "user-007",
                name: "김영수",
                position: "본부장"
            },
            permissions: {
                chat: true,
                reports: true,
                schedule: true,
                board: true,
                admin: true
            },
            preferences: {
                theme: "light",
                language: "ko",
                fontSize: "large",
                notifications: {
                    email: true,
                    push: false,
                    sms: true,
                    desktop: true
                },
                workingHours: {
                    start: "08:00",
                    end: "17:00",
                    timezone: "Asia/Seoul"
                }
            },
            stats: {
                lastLogin: "2024-01-15T07:30:00Z",
                totalChats: 892,
                documentsCreated: 234,
                meetingsScheduled: 167,
                averageResponseTime: 3.2
            },
            skills: ["Financial Analysis", "Risk Management", "Portfolio Management", "Excel VBA"],
            certifications: ["CFA", "FRM", "Investment Management Certificate"]
        },
        {
            id: "user-005",
            employeeId: "HW2022005",
            name: "정준하",
            nameEn: "Jung Jun Ha",
            email: "junha.jung@hanwhalife.com",
            phone: "010-4567-8901",
            department: "인사팀",
            team: "인재개발파트",
            position: "사원",
            jobTitle: "교육 프로그램 운영",
            level: "L2",
            joinDate: "2022-08-01",
            birthDate: "1996-05-30",
            avatar: "assets/avatars/jung-junha.png",
            status: "active",
            location: {
                office: "본사",
                building: "63빌딩",
                floor: "35F",
                seat: "C-35-12"
            },
            manager: {
                id: "user-008",
                name: "안소영",
                position: "과장"
            },
            permissions: {
                chat: true,
                reports: true,
                schedule: true,
                board: true,
                admin: false
            },
            preferences: {
                theme: "auto",
                language: "ko",
                fontSize: "medium",
                notifications: {
                    email: true,
                    push: true,
                    sms: false,
                    desktop: false
                },
                workingHours: {
                    start: "09:00",
                    end: "18:00",
                    timezone: "Asia/Seoul"
                }
            },
            stats: {
                lastLogin: "2024-01-15T09:00:00Z",
                totalChats: 178,
                documentsCreated: 43,
                meetingsScheduled: 28,
                averageResponseTime: 2.1
            },
            skills: ["HR Management", "Training Development", "Communication", "MS Office"],
            certifications: ["SHRM-CP", "교육훈련전문가"]
        },
        {
            id: "user-006",
            employeeId: "HW2018006",
            name: "정형돈",
            nameEn: "Jung Hyung Don",
            email: "hyungdon.jung@hanwhalife.com",
            phone: "010-5678-9012",
            department: "디지털프로덕트팀",
            team: "AI개발파트",
            position: "부장",
            jobTitle: "AI 서비스 총괄",
            level: "L6",
            joinDate: "2018-04-01",
            birthDate: "1982-09-14",
            avatar: "assets/avatars/jung-hyungdon.png",
            status: "active",
            location: {
                office: "본사",
                building: "63빌딩",
                floor: "42F",
                seat: "A-42-01"
            },
            manager: {
                id: "user-010",
                name: "최현우",
                position: "상무"
            },
            permissions: {
                chat: true,
                reports: true,
                schedule: true,
                board: true,
                admin: true
            },
            preferences: {
                theme: "light",
                language: "ko",
                fontSize: "medium",
                notifications: {
                    email: true,
                    push: true,
                    sms: true,
                    desktop: true
                },
                workingHours: {
                    start: "08:30",
                    end: "19:00",
                    timezone: "Asia/Seoul"
                }
            },
            stats: {
                lastLogin: "2024-01-15T08:00:00Z",
                totalChats: 1567,
                documentsCreated: 456,
                meetingsScheduled: 289,
                averageResponseTime: 4.5
            },
            skills: ["AI Strategy", "Team Leadership", "Product Management", "Business Development"],
            certifications: ["PMP", "AI Professional", "Digital Transformation Leader"]
        },
        {
            id: "user-007",
            employeeId: "HW2017007",
            name: "노홍철",
            nameEn: "Noh Hong Chul",
            email: "hongchul.noh@hanwhalife.com",
            phone: "010-6789-0123",
            department: "마케팅본부",
            team: "디지털마케팅팀",
            position: "팀장",
            jobTitle: "디지털마케팅 팀 리더",
            level: "L5",
            joinDate: "2017-02-15",
            birthDate: "1986-01-25",
            avatar: "assets/avatars/noh-hongchul.png",
            status: "active",
            location: {
                office: "본사",
                building: "63빌딩",
                floor: "38F",
                seat: "B-38-01"
            },
            manager: {
                id: "user-011",
                name: "한지민",
                position: "본부장"
            },
            permissions: {
                chat: true,
                reports: true,
                schedule: true,
                board: true,
                admin: true
            },
            preferences: {
                theme: "dark",
                language: "ko",
                fontSize: "small",
                notifications: {
                    email: true,
                    push: true,
                    sms: false,
                    desktop: true
                },
                workingHours: {
                    start: "09:00",
                    end: "18:30",
                    timezone: "Asia/Seoul"
                }
            },
            stats: {
                lastLogin: "2024-01-15T08:50:00Z",
                totalChats: 987,
                documentsCreated: 312,
                meetingsScheduled: 198,
                averageResponseTime: 3.7
            },
            skills: ["Digital Marketing", "Brand Management", "Analytics", "Team Management"],
            certifications: ["Digital Marketing Institute", "Google Ads", "Marketing Analytics"]
        },
        {
            id: "user-008",
            employeeId: "HW2023008",
            name: "하하",
            nameEn: "Ha Ha",
            email: "haha@hanwhalife.com",
            phone: "010-7890-1234",
            department: "IT서비스팀",
            team: "시스템운영파트",
            position: "과장",
            jobTitle: "시스템 관리자",
            level: "L4",
            joinDate: "2023-03-10",
            birthDate: "1989-07-18",
            avatar: "assets/avatars/haha.png",
            status: "active",
            location: {
                office: "본사",
                building: "63빌딩",
                floor: "40F",
                seat: "C-40-15"
            },
            manager: {
                id: "user-006",
                name: "정형돈",
                position: "부장"
            },
            permissions: {
                chat: true,
                reports: true,
                schedule: true,
                board: true,
                admin: false
            },
            preferences: {
                theme: "light",
                language: "ko",
                fontSize: "medium",
                notifications: {
                    email: true,
                    push: true,
                    sms: false,
                    desktop: true
                },
                workingHours: {
                    start: "09:00",
                    end: "18:00",
                    timezone: "Asia/Seoul"
                }
            },
            stats: {
                lastLogin: "2024-01-15T08:30:00Z",
                totalChats: 256,
                documentsCreated: 72,
                meetingsScheduled: 38,
                averageResponseTime: 2.8
            },
            skills: ["System Administration", "Network Management", "Database", "Linux"],
            certifications: ["CISSP", "RHCE", "Oracle DBA"]
        },
        {
            id: "user-009",
            employeeId: "HW2021009",
            name: "황광희",
            nameEn: "Hwang Kwang Hee",
            email: "kwanghee.hwang@hanwhalife.com",
            phone: "010-8901-2345",
            department: "고객서비스팀",
            team: "콜센터운영파트",
            position: "대리",
            jobTitle: "고객 상담 관리",
            level: "L3",
            joinDate: "2021-09-20",
            birthDate: "1993-12-05",
            avatar: "assets/avatars/hwang-kwanghee.png",
            status: "active",
            location: {
                office: "본사",
                building: "63빌딩",
                floor: "35F",
                seat: "B-35-28"
            },
            manager: {
                id: "user-005",
                name: "정준하",
                position: "차장"
            },
            permissions: {
                chat: true,
                reports: true,
                schedule: true,
                board: true,
                admin: false
            },
            preferences: {
                theme: "light",
                language: "ko",
                fontSize: "large",
                notifications: {
                    email: true,
                    push: true,
                    sms: true,
                    desktop: false
                },
                workingHours: {
                    start: "09:00",
                    end: "18:00",
                    timezone: "Asia/Seoul"
                }
            },
            stats: {
                lastLogin: "2024-01-15T09:45:00Z",
                totalChats: 687,
                documentsCreated: 134,
                meetingsScheduled: 67,
                averageResponseTime: 1.5
            },
            skills: ["Customer Service", "Communication", "CRM Systems", "Problem Solving"],
            certifications: ["고객상담사", "서비스품질관리사", "콜센터상담원"]
        },
        {
            id: "user-010",
            employeeId: "HW2020010",
            name: "길",
            nameEn: "Gil",
            email: "gil@hanwhalife.com",
            phone: "010-9012-3456",
            department: "기획관리팀",
            team: "전략기획파트",
            position: "과장",
            jobTitle: "사업 전략 기획",
            level: "L4",
            joinDate: "2020-06-15",
            birthDate: "1987-11-20",
            avatar: "assets/avatars/gil.png",
            status: "active",
            location: {
                office: "본사",
                building: "63빌딩",
                floor: "50F",
                seat: "A-50-12"
            },
            manager: {
                id: "user-004",
                name: "박명수",
                position: "차장"
            },
            permissions: {
                chat: true,
                reports: true,
                schedule: true,
                board: true,
                admin: false
            },
            preferences: {
                theme: "dark",
                language: "ko",
                fontSize: "small",
                notifications: {
                    email: true,
                    push: false,
                    sms: true,
                    desktop: true
                },
                workingHours: {
                    start: "08:30",
                    end: "17:30",
                    timezone: "Asia/Seoul"
                }
            },
            stats: {
                lastLogin: "2024-01-15T08:15:00Z",
                totalChats: 445,
                documentsCreated: 189,
                meetingsScheduled: 98,
                averageResponseTime: 3.1
            },
            skills: ["Strategic Planning", "Business Analysis", "Project Management", "Market Research"],
            certifications: ["전략기획사", "경영지도사", "PMP"]
        }
    ],
    
    departments: [
        {
            id: "dept-001",
            name: "디지털프로덕트팀",
            head: "user-010",
            memberCount: 45,
            teams: ["AI개발파트", "데이터분석파트", "플랫폼개발파트"]
        },
        {
            id: "dept-002",
            name: "마케팅본부",
            head: "user-011",
            memberCount: 68,
            teams: ["디지털마케팅팀", "브랜드전략팀", "고객경험팀"]
        },
        {
            id: "dept-003",
            name: "재무관리팀",
            head: "user-007",
            memberCount: 32,
            teams: ["자산운용파트", "리스크관리파트", "회계파트"]
        },
        {
            id: "dept-004",
            name: "인사팀",
            head: "user-012",
            memberCount: 28,
            teams: ["인재개발파트", "인사운영파트", "조직문화파트"]
        }
    ],
    
    positions: [
        {level: "L1", title: "인턴", minYears: 0},
        {level: "L2", title: "사원", minYears: 0},
        {level: "L3", title: "대리", minYears: 3},
        {level: "L4", title: "과장", minYears: 6},
        {level: "L5", title: "차장", minYears: 10},
        {level: "L6", title: "부장", minYears: 15},
        {level: "L7", title: "상무", minYears: 20},
        {level: "L8", title: "전무", minYears: 25},
        {level: "L9", title: "부사장", minYears: 30}
    ],
    
    offices: [
        {
            id: "office-001",
            name: "본사",
            address: "서울특별시 영등포구 63로 50",
            building: "63빌딩",
            floors: ["35F", "38F", "42F", "45F", "50F"],
            facilities: ["회의실", "카페테리아", "헬스장", "도서관", "휴게실"]
        },
        {
            id: "office-002",
            name: "판교 연구소",
            address: "경기도 성남시 분당구 판교로 255",
            building: "판교테크노밸리",
            floors: ["3F", "4F", "5F"],
            facilities: ["연구실", "서버실", "회의실", "카페테리아"]
        }
    ]
};

// 전역에서 사용할 수 있도록 export
if (typeof window !== 'undefined') {
    window.SAMPLE_USERS_DATA = SAMPLE_USERS_DATA;
}
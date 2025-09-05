/**
 * 채팅 히스토리 샘플 데이터
 * 사용자별 대화 내역 저장
 */

const SAMPLE_CHAT_HISTORY = {
    chatHistory: {
        "user-001": [
            {
                id: "chat-001",
                title: "보고서 작성 도움",
                createdAt: "2024-01-15T09:30:00.000Z",
                lastUpdated: "2024-01-15T10:15:00.000Z",
                messages: [
                    {
                        id: "msg-001",
                        type: "user",
                        text: "월간 실적 보고서 작성을 도와주세요.",
                        timestamp: "2024-01-15T09:30:00.000Z"
                    },
                    {
                        id: "msg-002",
                        type: "ai",
                        text: "네, 월간 실적 보고서 작성을 도와드리겠습니다. 어떤 부서의 실적 보고서인가요?",
                        htmlContent: '<div class="message-container ai-message"><div class="message-bubble"><p class="message-text">네, 월간 실적 보고서 작성을 도와드리겠습니다. 어떤 부서의 실적 보고서인가요?</p></div></div><div class="responsible-card"><div class="responsible-avatar"><img src="assets/avatar-placeholder.png" alt="담당자"></div><div class="responsible-info"><div class="responsible-name">김지원</div><div class="responsible-position">과장 · IT서비스팀</div><div class="responsible-contact">📞 02-789-5678 📧 jiwon.kim@hanwhalife.com</div></div></div>',
                        metadata: {
                            type: "general",
                            responsiblePerson: {
                                name: "김지원",
                                position: "과장",
                                department: "IT서비스팀",
                                email: "jiwon.kim@hanwhalife.com",
                                phone: "02-789-5678",
                                extension: "5678"
                            }
                        },
                        timestamp: "2024-01-15T09:30:05.000Z"
                    }
                ]
            },
            {
                id: "chat-002",
                title: "휴가 조회",
                createdAt: "2024-01-14T14:00:00.000Z",
                lastUpdated: "2024-01-14T14:30:00.000Z",
                messages: [
                    {
                        id: "msg-003",
                        type: "user",
                        text: "이번 달 남은 휴가 일수 확인해주세요",
                        timestamp: "2024-01-14T14:00:00.000Z"
                    },
                    {
                        id: "msg-004",
                        type: "ai",
                        text: "김동준님의 연차 현황을 조회해드렸습니다.",
                        htmlContent: '<div class="message-container ai-message"><div class="message-bubble"><p class="message-text">김동준님의 연차 현황을 조회해드렸습니다.</p></div></div><div class="vacation-card"><h3 class="vacation-title">휴가 현황 📅</h3><div class="vacation-remaining"><div class="remaining-number">12</div><div class="remaining-text">일 남음</div></div><div class="vacation-breakdown"><div class="breakdown-item"><span class="breakdown-label">연차</span><span class="breakdown-value">10일</span></div><div class="breakdown-item"><span class="breakdown-label">병가</span><span class="breakdown-value">2일</span></div><div class="breakdown-item"><span class="breakdown-label">경조사</span><span class="breakdown-value">0일</span></div><div class="breakdown-item"><span class="breakdown-label">가족돌봄</span><span class="breakdown-value">0일</span></div></div></div><div class="responsible-card"><div class="responsible-avatar"><img src="assets/avatar-placeholder.png" alt="담당자"></div><div class="responsible-info"><div class="responsible-name">이민주</div><div class="responsible-position">대리 · 인사팀</div><div class="responsible-contact">📞 02-789-1234 📧 minju.lee@hanwhalife.com</div></div></div>',
                        metadata: {
                            type: "vacation",
                            vacationData: {
                                totalRemaining: 12,
                                annual: 10,
                                sick: 2,
                                congratulatory: 0,
                                familyCare: 0,
                                recentVacations: []
                            },
                            responsiblePerson: {
                                name: "이민주",
                                position: "대리",
                                department: "인사팀",
                                email: "minju.lee@hanwhalife.com",
                                phone: "02-789-1234",
                                extension: "1234"
                            }
                        },
                        timestamp: "2024-01-14T14:00:03.000Z"
                    }
                ]
            }
        ],
        "user-002": [
            {
                id: "chat-003",
                title: "마케팅 캠페인 기획",
                createdAt: "2024-01-15T11:00:00.000Z",
                lastUpdated: "2024-01-15T11:45:00.000Z",
                messages: [
                    {
                        id: "msg-005",
                        type: "user",
                        text: "신규 상품 마케팅 캠페인 아이디어가 필요해요.",
                        timestamp: "2024-01-15T11:00:00.000Z"
                    },
                    {
                        id: "msg-006",
                        type: "ai",
                        text: "신규 상품 마케팅 캠페인을 위한 아이디어를 제안해드리겠습니다. 타겟 고객층과 상품 특징을 알려주시면 더 구체적인 제안이 가능합니다.",
                        timestamp: "2024-01-15T11:00:05.000Z"
                    }
                ]
            }
        ],
        "user-003": [
            {
                id: "chat-004",
                title: "예산 분석",
                createdAt: "2024-01-15T08:30:00.000Z",
                lastUpdated: "2024-01-15T09:00:00.000Z",
                messages: [
                    {
                        id: "msg-007",
                        type: "user",
                        text: "분기별 예산 집행 현황을 분석해주세요.",
                        timestamp: "2024-01-15T08:30:00.000Z"
                    },
                    {
                        id: "msg-008",
                        type: "ai",
                        text: "분기별 예산 집행 현황을 분석해드리겠습니다. 어느 부서의 예산을 분석해드릴까요?",
                        timestamp: "2024-01-15T08:30:03.000Z"
                    }
                ]
            }
        ]
    },
    
    metadata: {
        version: "1.0.0",
        lastUpdated: "2024-01-15T12:00:00.000Z",
        totalChats: 4,
        totalUsers: 3
    }
};

// 전역에서 사용할 수 있도록 export
if (typeof window !== 'undefined') {
    window.SAMPLE_CHAT_HISTORY = SAMPLE_CHAT_HISTORY;
}
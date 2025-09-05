// User Test 기능 관리자
// user-test-data.js에서 데이터를 로드하고 처리

// User Test 요청 감지
function handleUserTestRequest(message) {
    if (!message || typeof message !== 'string') return null;
    
    const lowercaseMessage = message.toLowerCase();
    
    // User Test 관련 키워드 패턴
    const userTestKeywords = [
        '사용자 테스트', 'user test', '유저 테스트', 'ux 테스트',
        '사용성 테스트', 'usability test', '사용성 평가', 
        '테스트 시나리오', 'test scenario', '사용자 연구',
        'a/b 테스트', 'ab test', '사용자 경험', 'user experience',
        '프로토타입 테스트', '인터페이스 테스트'
    ];
    
    const hasUserTestKeyword = userTestKeywords.some(keyword => 
        lowercaseMessage.includes(keyword)
    );
    
    // 질문 유형 감지
    const requestTypes = {
        list: ['목록', 'list', '리스트', '보여줘', '알려줘', '있어', '무엇', '어떤'],
        create: ['만들어', 'create', '생성', '새로운', '시작', '진행'],
        result: ['결과', 'result', '분석', '리포트', '보고서', '성과'],
        help: ['도움', 'help', '방법', '어떻게', '가이드', '설명']
    };
    
    let requestType = 'general';
    for (const [type, keywords] of Object.entries(requestTypes)) {
        if (keywords.some(keyword => lowercaseMessage.includes(keyword))) {
            requestType = type;
            break;
        }
    }
    
    if (hasUserTestKeyword) {
        return {
            type: 'userTest',
            subType: requestType,
            originalMessage: message
        };
    }
    
    return null;
}

// User Test 응답 생성
function generateUserTestResponse(requestInfo) {
    const { subType } = requestInfo;
    
    switch (subType) {
        case 'list':
            return generateUserTestListResponse();
        case 'create':
            return generateUserTestCreateResponse();
        case 'result':
            return generateUserTestResultResponse();
        case 'help':
            return generateUserTestHelpResponse();
        default:
            return generateUserTestGeneralResponse();
    }
}

// 사용자 테스트 목록 응답
function generateUserTestListResponse() {
    const scenarios = window.USER_TEST_SCENARIOS || [];
    const templates = window.USER_TEST_TEMPLATES || {};
    
    let responseMessage = `현재 진행 중이거나 계획된 사용자 테스트들을 안내해 드릴게요.\n\n`;
    
    // 진행중인 테스트 시나리오
    if (scenarios.length > 0) {
        responseMessage += `**📋 테스트 시나리오 목록:**\n\n`;
        scenarios.slice(0, 3).forEach((scenario, index) => {
            const status = getTestStatus(scenario.id);
            responseMessage += `${index + 1}. **${scenario.title}**\n`;
            responseMessage += `   - 유형: ${scenario.type} 테스트\n`;
            responseMessage += `   - 예상 소요시간: ${scenario.duration}분\n`;
            responseMessage += `   - 참가자: ${scenario.participants}명\n`;
            responseMessage += `   - 상태: ${status.name} ${status.icon}\n\n`;
        });
    }
    
    responseMessage += `\n**🔧 사용 가능한 테스트 유형:**\n`;
    Object.entries(templates).forEach(([key, template]) => {
        responseMessage += `• **${template.name}**: ${template.description}\n`;
    });
    
    responseMessage += `\n더 자세한 정보나 새로운 테스트 계획이 필요하시면 언제든 말씀해 주세요!`;
    
    return {
        message: responseMessage,
        responsiblePerson: getUserTestManager('lead')
    };
}

// 새 테스트 생성 응답  
function generateUserTestCreateResponse() {
    const templates = window.USER_TEST_TEMPLATES || {};
    
    let responseMessage = `새로운 사용자 테스트를 계획해 보겠습니다! 🚀\n\n`;
    responseMessage += `**테스트 유형을 선택해 주세요:**\n\n`;
    
    Object.entries(templates).forEach(([key, template], index) => {
        responseMessage += `**${index + 1}. ${template.name}**\n`;
        responseMessage += `   - ${template.description}\n`;
        responseMessage += `   - 권장 소요시간: ${template.defaultDuration}분\n`;
        responseMessage += `   - 권장 참가자: ${template.recommendedParticipants}\n`;
        responseMessage += `   - 주요 지표: ${template.keyMetrics.join(', ')}\n\n`;
    });
    
    responseMessage += `선택하신 후에 테스트 대상, 목표, 참가자 조건 등을 구체적으로 설정해 드릴게요!`;
    
    return {
        message: responseMessage,
        responsiblePerson: getUserTestManager('lead')
    };
}

// 테스트 결과 응답
function generateUserTestResultResponse() {
    const results = window.USER_TEST_RESULTS || {};
    
    if (Object.keys(results).length === 0) {
        return {
            message: `아직 완료된 사용자 테스트 결과가 없습니다.\n\n새로운 테스트를 시작하시겠어요? 테스트 계획부터 결과 분석까지 전체 과정을 도와드릴 수 있습니다!`,
            responsiblePerson: getUserTestManager('lead')
        };
    }
    
    let responseMessage = `완료된 사용자 테스트 결과를 안내해 드릴게요. 📊\n\n`;
    
    Object.entries(results).forEach(([scenarioId, result]) => {
        const scenario = window.USER_TEST_SCENARIOS?.find(s => s.id === scenarioId);
        if (scenario && result.status === 'completed') {
            responseMessage += `**🎯 ${scenario.title}**\n`;
            responseMessage += `완료일: ${result.completedDate}\n`;
            responseMessage += `참가자: ${result.summary.totalParticipants}명\n`;
            responseMessage += `성공률: ${result.summary.completionRate}%\n`;
            responseMessage += `평균 소요시간: ${result.summary.averageTime}초\n`;
            responseMessage += `만족도: ${result.summary.satisfactionScore}/5.0\n\n`;
            
            if (result.summary.majorIssues && result.summary.majorIssues.length > 0) {
                responseMessage += `**주요 발견사항:**\n`;
                result.summary.majorIssues.slice(0, 3).forEach((issue, index) => {
                    responseMessage += `${index + 1}. ${issue}\n`;
                });
                responseMessage += `\n`;
            }
        }
    });
    
    responseMessage += `상세한 분석 결과나 개선 제안이 필요하시면 말씀해 주세요!`;
    
    return {
        message: responseMessage,
        responsiblePerson: getUserTestManager('analyst')
    };
}

// 도움말 응답
function generateUserTestHelpResponse() {
    let responseMessage = `사용자 테스트에 대해 도움을 드리겠습니다! 🤝\n\n`;
    
    responseMessage += `**📚 사용자 테스트란?**\n`;
    responseMessage += `실제 사용자가 제품이나 서비스를 사용하는 과정을 관찰하고 분석하여 사용성 문제를 발견하고 개선점을 도출하는 방법입니다.\n\n`;
    
    responseMessage += `**🔍 주요 테스트 유형:**\n`;
    responseMessage += `• **사용성 테스트**: 인터페이스의 사용편의성 평가\n`;
    responseMessage += `• **내비게이션 테스트**: 정보 구조와 탐색 경로 평가\n`;
    responseMessage += `• **상호작용 테스트**: 시스템과의 상호작용 자연스러움 평가\n`;
    responseMessage += `• **접근성 테스트**: 다양한 사용자의 접근성 평가\n\n`;
    
    responseMessage += `**📋 진행 과정:**\n`;
    responseMessage += `1. 테스트 목표 및 가설 설정\n`;
    responseMessage += `2. 참가자 모집 및 시나리오 작성\n`;
    responseMessage += `3. 테스트 진행 및 관찰\n`;
    responseMessage += `4. 결과 분석 및 개선사항 도출\n`;
    responseMessage += `5. 보고서 작성 및 후속 조치\n\n`;
    
    responseMessage += `구체적인 테스트 계획이나 진행 방법에 대해 궁금한 점이 있으시면 언제든 문의해 주세요!`;
    
    return {
        message: responseMessage,
        responsiblePerson: getUserTestManager('lead')
    };
}

// 일반적인 User Test 응답
function generateUserTestGeneralResponse() {
    let responseMessage = `사용자 테스트 관련 업무를 도와드리겠습니다! 🎯\n\n`;
    
    responseMessage += `다음 중에서 도움이 필요한 항목을 선택해 주세요:\n\n`;
    responseMessage += `📋 **"테스트 목록"** - 진행 중인 테스트 현황 확인\n`;
    responseMessage += `🚀 **"새 테스트 만들기"** - 새로운 테스트 계획 수립\n`;
    responseMessage += `📊 **"테스트 결과"** - 완료된 테스트 결과 분석\n`;
    responseMessage += `❓ **"테스트 도움말"** - 사용자 테스트 가이드\n\n`;
    
    responseMessage += `구체적인 질문이나 요청사항을 말씀해 주시면 더 정확한 도움을 드릴 수 있습니다!`;
    
    return {
        message: responseMessage,
        responsiblePerson: getUserTestManager('lead')
    };
}

// 테스트 상태 조회
function getTestStatus(scenarioId) {
    const results = window.USER_TEST_RESULTS || {};
    const statuses = window.USER_TEST_STATUS || {};
    
    if (results[scenarioId]) {
        const status = results[scenarioId].status;
        return statuses[status] || statuses.planned;
    }
    
    return statuses.planned || { name: '계획됨', color: '#6b7280', icon: '📋' };
}

// User Test 담당자 정보 조회
function getUserTestManager(type = 'lead') {
    const managers = window.USER_TEST_MANAGERS || {};
    const manager = managers[type];
    
    if (!manager) {
        return {
            id: 'user-002',
            name: '이정은',
            position: '선임 UX 연구원',
            department: '디지털프로덕트팀',
            email: 'jeongeun.lee@hanwhalife.com',
            phone: '010-1234-5679',
            profileImage: 'assets/avatar-placeholder.png'
        };
    }
    
    return manager;
}

// User Test 카드 렌더링 (추가 기능)
function createUserTestCard(testData) {
    const status = getTestStatus(testData.id);
    
    return `
        <div class="user-test-card">
            <div class="test-card-header">
                <div class="test-status" style="background-color: ${status.color}">
                    <span>${status.icon}</span>
                    <span>${status.name}</span>
                </div>
            </div>
            <div class="test-card-content">
                <h3 class="test-title">${testData.title}</h3>
                <p class="test-description">${testData.description}</p>
                <div class="test-meta">
                    <span class="test-duration">⏱️ ${testData.duration}분</span>
                    <span class="test-participants">👥 ${testData.participants}명</span>
                    <span class="test-type">🏷️ ${testData.type}</span>
                </div>
            </div>
        </div>
    `;
}

// 전역 함수로 내보내기
if (typeof window !== 'undefined') {
    window.handleUserTestRequest = handleUserTestRequest;
    window.generateUserTestResponse = generateUserTestResponse;
    window.getUserTestManager = getUserTestManager;
    window.createUserTestCard = createUserTestCard;
}
// 토스트 데모 및 테스트 함수들
// 개발자 콘솔에서 테스트할 수 있는 함수들

// 회의실 예약 완료 토스트 테스트
function testMeetingSuccessToast() {
    showMeetingSuccessToast({
        room: '8층 - E1 - 중회의실',
        date: '2025. 09. 05. (목)',
        time: '14:00',
        attendees: [
            { name: '김동준', position: '과장' },
            { name: '정준하', position: '과장' },
            { name: '박명수', position: '차장' }
        ]
    });
}

// 일반 성공 토스트 테스트
function testSuccessToast() {
    showSuccessToast('작업이 성공적으로 완료되었습니다!');
}

// 에러 토스트 테스트
function testErrorToast() {
    showErrorToast('오류가 발생했습니다. 다시 시도해주세요.');
}

// 자동 닫기 없는 토스트 테스트
function testPersistentToast() {
    showToast('이 메시지는 자동으로 닫히지 않습니다. 직접 닫기 버튼을 클릭하세요.', {
        type: 'info',
        duration: 0, // 자동 닫기 없음
        closable: true
    });
}

// 다양한 길이의 메시지 테스트
function testLongMessageToast() {
    showToast('이것은 매우 긴 메시지입니다. 토스트 컴포넌트가 긴 메시지를 어떻게 처리하는지 확인하기 위한 테스트입니다. 메시지가 너무 길면 줄바꿈이 되고, 최대 2줄까지 표시됩니다. 그 이상은 생략됩니다.', {
        type: 'success',
        duration: 8000
    });
}

// 여러 토스트 동시 표시 테스트
function testMultipleToasts() {
    showSuccessToast('첫 번째 토스트 메시지');
    
    setTimeout(() => {
        showToast('두 번째 토스트 메시지', { type: 'info' });
    }, 500);
    
    setTimeout(() => {
        showErrorToast('세 번째 토스트 메시지');
    }, 1000);
    
    setTimeout(() => {
        showMeetingSuccessToast();
    }, 1500);
}

// 모든 토스트 닫기 테스트
function testHideAllToasts() {
    hideAllToasts();
}

// 토스트 매니저 상태 확인
function checkToastManager() {
    const manager = window.toastManager || initToastManager();
    console.log('활성 토스트 개수:', manager.getActiveCount());
    console.log('토스트 목록:', manager.toasts.map(t => ({
        id: t.id,
        type: t.config.type,
        element: t.element.querySelector('.toast-content').textContent
    })));
}

// 브라우저 콘솔에서 사용할 수 있도록 전역으로 등록
if (typeof window !== 'undefined') {
    window.testMeetingSuccessToast = testMeetingSuccessToast;
    window.testSuccessToast = testSuccessToast;
    window.testErrorToast = testErrorToast;
    window.testPersistentToast = testPersistentToast;
    window.testLongMessageToast = testLongMessageToast;
    window.testMultipleToasts = testMultipleToasts;
    window.testHideAllToasts = testHideAllToasts;
    window.checkToastManager = checkToastManager;
}

console.log(`
🍞 토스트 시스템이 로드되었습니다!

개발자 콘솔에서 다음 함수들을 실행해보세요:

• testMeetingSuccessToast() - 회의실 예약 완료 토스트
• testSuccessToast() - 일반 성공 토스트  
• testErrorToast() - 에러 토스트
• testPersistentToast() - 자동 닫기 없는 토스트
• testLongMessageToast() - 긴 메시지 토스트
• testMultipleToasts() - 여러 토스트 동시 표시
• testHideAllToasts() - 모든 토스트 닫기
• checkToastManager() - 토스트 매니저 상태 확인
`);
// 모드 선택 컴포넌트 관리

// 모드 데이터
const MODES = {
    report: {
        id: 'report',
        name: '보고서 작성',
        icon: 'assets/icons/document-pen.svg',
        description: '한화생명 보고서 양식에 맞춰 보고서를 만들어 드려요',
        color: '#266cc9'  // 파란색
    },
    userTest: {
        id: 'userTest',
        name: 'User Test',
        icon: 'assets/icons/mobilescript.svg',
        description: '직접 설정한 사용자 조건을 기반으로 테스트를 진행해요.',
        color: '#3f9252'  // 초록색
    }
};

let selectedMode = null;
let modeSelectorDropdown = null;

// 모드 선택 드롭다운 생성
function createModeSelectorDropdown() {
    const dropdown = document.createElement('div');
    dropdown.className = 'mode-selector-dropdown';
    dropdown.innerHTML = `
        <div class="mode-options">
            ${Object.values(MODES).map(mode => `
                <div class="mode-option" data-mode="${mode.id}" onclick="selectMode('${mode.id}')">
                    <div class="mode-icon ${mode.id}">
                        <img src="${mode.icon}" alt="${mode.name}" />
                    </div>
                    <div class="mode-details">
                        <h3 class="mode-title">${mode.name}</h3>
                        <p class="mode-description">${mode.description}</p>
                    </div>
                </div>
            `).join('')}
        </div>
    `;
    return dropdown;
}

// 모드 선택 드롭다운 열기
function openModeSelectorDropdown() {
    const inputContainer = document.querySelector('.input-container');
    if (!inputContainer) return;

    if (!modeSelectorDropdown) {
        modeSelectorDropdown = createModeSelectorDropdown();
        inputContainer.appendChild(modeSelectorDropdown);
    }

    // 다른 열린 드롭다운들 닫기
    closeModeSelectorDropdown();

    setTimeout(() => {
        modeSelectorDropdown.classList.add('active');
    }, 10);
}

// 모드 선택 드롭다운 닫기
function closeModeSelectorDropdown() {
    if (modeSelectorDropdown) {
        modeSelectorDropdown.classList.remove('active');
    }
}

// 모드 선택 처리
function selectMode(modeId) {
    selectedMode = MODES[modeId];
    if (selectedMode) {
        console.log('모드 선택됨:', selectedMode.name);
        updateInputWithMode(selectedMode);
        closeModeSelectorDropdown();
    }
}

// 입력 필드에 선택된 모드 표시 (모드 선택 버튼 대체)
function updateInputWithMode(mode) {
    const inputContainer = document.querySelector('.input-container');
    const modeSelectorButton = inputContainer?.querySelector('.mode-selector-button');
    if (!inputContainer || !modeSelectorButton) return;

    // 모드 선택 버튼을 선택된 모드 버튼으로 대체
    const selectedModeButton = document.createElement('button');
    selectedModeButton.className = `selected-mode-button ${mode.id}`;
    selectedModeButton.onclick = clearSelectedMode;
    selectedModeButton.title = '모드 해제하려면 클릭';
    selectedModeButton.innerHTML = `
        <img src="${mode.icon}" alt="${mode.name}" />
        <span>${mode.name}</span>
    `;

    // 기존 모드 선택 버튼 교체
    modeSelectorButton.replaceWith(selectedModeButton);

    // 입력 필드 placeholder 업데이트
    const inputField = inputContainer.querySelector('.input-field');
    if (inputField) {
        inputField.placeholder = `${mode.name} 모드로 질문하기...`;
    }
}

// 선택된 모드 해제
function clearSelectedMode() {
    selectedMode = null;

    const inputContainer = document.querySelector('.input-container');
    const selectedModeButton = inputContainer?.querySelector('.selected-mode-button');
    if (!inputContainer || !selectedModeButton) return;

    // 선택된 모드 버튼을 다시 모드 선택 버튼으로 교체
    const modeSelectorButton = document.createElement('button');
    modeSelectorButton.className = 'mode-selector-button';
    modeSelectorButton.onclick = handleModeSelectorClick;
    modeSelectorButton.title = '모드 선택';
    modeSelectorButton.innerHTML = `
        <img src="assets/icons/mode-selector.svg" alt="모드 선택" />
        <span>모드 선택</span>
    `;

    // 기존 선택된 모드 버튼 교체
    selectedModeButton.replaceWith(modeSelectorButton);

    // 입력 필드 placeholder 복원
    const inputField = inputContainer.querySelector('.input-field');
    if (inputField) {
        inputField.placeholder = '무엇이든 물어보세요.';
    }

    // 드롭다운 닫기
    closeModeSelectorDropdown();
}

// 모드 선택 버튼 클릭 핸들러
function handleModeSelectorClick() {
    if (modeSelectorDropdown && modeSelectorDropdown.classList.contains('active')) {
        closeModeSelectorDropdown();
    } else {
        openModeSelectorDropdown();
    }
}

// 외부 클릭 시 드롭다운 닫기
document.addEventListener('click', (event) => {
    const inputContainer = document.querySelector('.input-container');
    const modeSelectorButton = document.querySelector('.mode-selector-button');
    const selectedModeButton = document.querySelector('.selected-mode-button');

    if (!inputContainer?.contains(event.target) &&
        !modeSelectorButton?.contains(event.target) &&
        !selectedModeButton?.contains(event.target)) {
        closeModeSelectorDropdown();
    }
});

// ESC 키로 드롭다운 닫기
document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && modeSelectorDropdown && modeSelectorDropdown.classList.contains('active')) {
        closeModeSelectorDropdown();
    }
});

// 현재 선택된 모드 반환 (다른 모듈에서 사용)
function getCurrentMode() {
    return selectedMode;
}

// 전역 함수로 내보내기
window.openModeSelectorDropdown = openModeSelectorDropdown;
window.closeModeSelectorDropdown = closeModeSelectorDropdown;
window.selectMode = selectMode;
window.clearSelectedMode = clearSelectedMode;
window.handleModeSelectorClick = handleModeSelectorClick;
window.getCurrentMode = getCurrentMode;

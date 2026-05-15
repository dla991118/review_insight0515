document.addEventListener('DOMContentLoaded', () => {
    const textInput = document.getElementById('textInput');
    const analyzeBtn = document.getElementById('analyzeBtn');
    const resultModal = document.getElementById('resultModal');
    const closeModal = document.getElementById('closeModal');
    const modalOkBtn = document.getElementById('modalOkBtn');
    
    const sentimentValue = document.getElementById('sentimentValue');
    const confidenceValue = document.getElementById('confidenceValue');
    const confidenceBar = document.getElementById('confidenceBar');
    const reasonValue = document.getElementById('reasonValue');
    const systemStatus = document.querySelector('.system-status');

    const setUIState = (state) => {
        switch (state) {
            case 'IDLE':
                analyzeBtn.textContent = 'ANALYZE';
                analyzeBtn.disabled = false;
                textInput.disabled = false;
                systemStatus.textContent = 'SYSTEM READY';
                systemStatus.style.color = 'var(--m-blue-light)';
                break;
            case 'LOADING':
                analyzeBtn.textContent = 'ANALYZING...';
                analyzeBtn.disabled = true;
                textInput.disabled = true;
                systemStatus.textContent = 'PROCESSING DATA...';
                systemStatus.style.color = 'var(--m-red)';
                break;
        }
    };

    const openModal = (data) => {
        sentimentValue.textContent = data.sentiment;
        sentimentValue.className = `value ${data.sentimentType}`;
        confidenceValue.textContent = `${data.confidence}%`;
        confidenceBar.style.width = '0%';
        reasonValue.textContent = data.reason;
        
        resultModal.classList.remove('hidden');
        
        setTimeout(() => {
            confidenceBar.style.width = `${data.confidence}%`;
        }, 300);
    };

    const hideModal = () => {
        resultModal.classList.add('hidden');
    };

    const analyzeSentiment = async (text) => {
        setUIState('LOADING');
        
        try {
            const response = await fetch('/api/analyze', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ text })
            });

            const result = await response.json();

            if (result.success) {
                openModal(result.data);
            } else {
                alert(`에러: ${result.error || '분석에 실패했습니다.'}`);
            }
        } catch (error) {
            console.error('Fetch Error:', error);
            alert('서버 연결에 실패했습니다. 백엔드가 실행 중인지 확인하세요.');
        } finally {
            setUIState('IDLE');
        }
    };

    analyzeBtn.addEventListener('click', () => {
        const text = textInput.value.trim();
        if (text) {
            analyzeSentiment(text);
        } else {
            alert('분석할 텍스트를 입력해 주세요.');
        }
    });

    closeModal.addEventListener('click', hideModal);
    modalOkBtn.addEventListener('click', hideModal);
    
    resultModal.addEventListener('click', (e) => {
        if (e.target === resultModal) {
            hideModal();
        }
    });

    window.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && !resultModal.classList.contains('hidden')) {
            hideModal();
        }
    });
});

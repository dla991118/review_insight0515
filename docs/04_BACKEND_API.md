# 백엔드 API (BACKEND API)

## 상태 (STATUS)
- [ ] 시작 전 (NOT STARTED)
- [ ] 진행 중 (IN PROGRESS)
- [ ] 완료 (COMPLETE)

# Express API

## 엔드포인트 (Endpoint)
POST /api/analyze

## 요청 (Request)
{
  "text": "오늘 정말 행복한 하루였어!"
}

## 응답 (Response)
{
  "success": true,
  "data": {
    "sentiment": "긍정",
    "confidence": 92,
    "reason": "긍정적인 표현이 포함되어 있습니다."
  }
}

## 구조 (Structure)
backend/
├── routes/
├── controllers/
├── services/
└── utils/

# 데이터베이스 스키마 (DATABASE SCHEMA)

## 상태 (STATUS)
- [ ] 시작 전 (NOT STARTED)
- [ ] 진행 중 (IN PROGRESS)
- [ ] 완료 (COMPLETE)

# Supabase 스키마 (Supabase Schema)

## 테이블 (Table)
sentiment_logs

## 컬럼 (Columns)
- id
- input_text
- sentiment
- confidence
- reason
- created_at

## SQL
create table sentiment_logs (
  id uuid primary key default gen_random_uuid(),
  input_text text not null,
  sentiment varchar(20) not null,
  confidence integer not null,
  reason text not null,
  created_at timestamp default now()
);

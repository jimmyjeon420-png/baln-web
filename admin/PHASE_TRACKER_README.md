# Phase 9-12 실시간 진행률 트래커 시스템

## 개요

WBS 탭에 Phase 9-12의 작업 진행 상황을 실시간으로 추적하고 관리할 수 있는 인터랙티브 시스템을 추가했습니다.

## 주요 기능

### 1. 진행률 시각화
- **진행률 바**: 각 Phase의 완료된 작업 비율을 실시간으로 표시
- **작업 카운터**: "3/5" 형식으로 완료/전체 작업 수 표시
- **상태 표시**:
  - `✅ 완료` - 모든 작업 완료
  - `🔄 N개 진행 중` - 진행 중인 작업 있음
  - `⚠️ N개 블로킹 중` - 블로킹된 작업 있음
  - `진행률 N%` - 기본 진행률 표시

### 2. 인터랙티브 체크리스트
- **토글 기능**: Phase 카드 클릭 시 상세 작업 목록 표시/숨김
- **상태 변경**: 작업 아이콘 클릭으로 상태 순환
  - ⬜ 대기 중 (pending)
  - 🔄 진행 중 (in_progress)
  - ✅ 완료 (completed)
  - 🚫 블로킹 (blocked)

### 3. 우선순위 표시
- 🔴 **긴급** (priority=2): 즉시 처리 필요
- 🟡 **중요** (priority=1): 높은 우선순위
- 일반 (priority=0): 뱃지 표시 없음

### 4. 추가 정보
- **작업 설명**: 각 작업의 상세 설명 표시
- **블로킹 사유**: blocked 상태일 때 이유 표시

## 시스템 구조

### 데이터베이스

**테이블**: `phase_tasks`

```sql
- id: UUID (Primary Key)
- phase_number: INTEGER (9-12)
- task_title: TEXT
- task_description: TEXT
- status: TEXT (pending, in_progress, completed, blocked)
- priority: INTEGER (0=일반, 1=중요, 2=긴급)
- assignee: TEXT (담당자, optional)
- blocking_reason: TEXT (블로킹 이유)
- completed_at: TIMESTAMPTZ
- created_at: TIMESTAMPTZ
- updated_at: TIMESTAMPTZ
```

**초기 데이터**: Phase 9-12의 모든 작업 자동 삽입됨 (총 26개 작업)

### 프론트엔드 함수

#### `loadPhaseTasks()`
- Supabase에서 phase_tasks 데이터 로드
- Phase별로 그룹화하여 캐시에 저장
- 각 Phase의 진행률 업데이트

#### `updatePhaseProgress(phaseNum)`
- 특정 Phase의 진행률 계산
- 진행률 바 및 텍스트 업데이트
- 완료/진행 중/블로킹 개수 계산

#### `togglePhaseDetails(phaseNum)`
- Phase 카드 클릭 시 상세 목록 토글
- 처음 열 때 작업 목록 렌더링

#### `renderPhaseTasks(phaseNum, tasksList)`
- 작업 목록 HTML 생성
- 상태별 아이콘 및 색상 적용
- 우선순위 뱃지 표시

#### `cycleTaskStatus(taskId, phaseNum)`
- 작업 아이콘 클릭 시 상태 변경
- Supabase 업데이트 후 UI 갱신
- 상태 순환: pending → in_progress → completed → pending

#### `refreshPhaseTasks()`
- 🔄 새로고침 버튼 클릭 시 데이터 재로드

## 사용 방법

### 1. 마이그레이션 적용

**옵션 A: Supabase Dashboard (가장 쉬움)**
1. https://supabase.com/dashboard/project/ruqeinfcqhgexrckonsy/sql/new
2. `/Users/nicenoodle/baln/supabase/migrations/20260215_phase_tasks_tracker.sql` 파일 내용 복사
3. SQL Editor에 붙여넣고 Run

**옵션 B: psql 명령어 (MacBook)**
```bash
cd ~/smart-rebalancer
git pull origin main
psql "postgresql://postgres.ruqeinfcqhgexrckonsy:Baln0926!@aws-0-ap-northeast-2.pooler.supabase.com:6543/postgres" \
  -f supabase/migrations/20260215_phase_tasks_tracker.sql
```

**옵션 C: Supabase CLI**
```bash
cd ~/baln
supabase db push
```

### 2. 관리자 대시보드 접속

1. https://baln-web.vercel.app/admin/ 접속
   (또는 로컬: `file:///Users/nicenoodle/baln-web/admin/index.html`)
2. Supabase URL과 Service Key 입력하여 로그인
3. **WBS 탭** 클릭
4. "Phase 9-12 실행 계획" 섹션으로 스크롤

### 3. 진행률 확인 및 작업 관리

- **진행률 확인**: 각 Phase의 진행률 바를 통해 한눈에 파악
- **상세 보기**: Phase 카드 아무 곳이나 클릭하여 작업 목록 표시
- **상태 변경**: 작업 아이콘(⬜, 🔄, ✅) 클릭으로 상태 업데이트
- **새로고침**: 🔄 버튼 클릭으로 최신 데이터 로드

## 데이터 관리

### SQL로 작업 추가

```sql
INSERT INTO phase_tasks (phase_number, task_title, task_description, status, priority)
VALUES (9, '새로운 작업', '작업 상세 설명', 'pending', 1);
```

### SQL로 작업 상태 변경

```sql
UPDATE phase_tasks
SET status = 'in_progress', assignee = '홍길동'
WHERE task_title = '5탭 → 3탭 전환';
```

### SQL로 블로킹 사유 추가

```sql
UPDATE phase_tasks
SET status = 'blocked', blocking_reason = 'API 키 대기 중'
WHERE task_title = 'Premium 페이월 연결';
```

### SQL로 작업 삭제

```sql
DELETE FROM phase_tasks
WHERE id = 'task-uuid';
```

## 색상 코드

| 상태 | 색상 | 아이콘 |
|------|------|--------|
| 완료 (completed) | 녹색 (#4CAF50) | ✅ |
| 진행 중 (in_progress) | 노란색 (#FFC107) | 🔄 |
| 블로킹 (blocked) | 빨간색 (#CF6679) | 🚫 |
| 대기 중 (pending) | 회색 (#9E9E9E) | ⬜ |

| Phase | 색상 |
|-------|------|
| Phase 9 | 녹색 (#4CAF50) |
| Phase 10 | 파란색 (#2196F3) |
| Phase 11 | 보라색 (#9C27B0) |
| Phase 12 | 노란색 (#FFC107) |

## 문제 해결

### 진행률이 표시되지 않을 때

1. **WBS 탭 활성화 확인**
   - WBS 탭을 클릭해야 데이터가 로드됩니다

2. **새로고침 버튼 클릭**
   - 🔄 새로고침 버튼으로 수동 로드

3. **브라우저 Console 확인**
   - F12 → Console 탭에서 에러 메시지 확인

4. **Supabase 연결 확인**
   - Service Key가 올바른지 확인
   - RLS 정책: phase_tasks는 service_role만 접근 가능

### 작업 상태가 변경되지 않을 때

1. **권한 확인**
   - Service Key로 로그인했는지 확인

2. **네트워크 확인**
   - Console에서 Supabase API 호출 성공 여부 확인

3. **테이블 존재 확인**
   ```sql
   SELECT COUNT(*) FROM phase_tasks;
   ```

## 향후 개선 사항

### 제안 기능
- [ ] 담당자 배정 UI
- [ ] 작업 기한 설정 및 경고
- [ ] 작업 추가/삭제 UI (현재는 SQL만 가능)
- [ ] 작업 히스토리 추적
- [ ] Slack/Discord 알림 연동
- [ ] 드래그앤드롭으로 우선순위 변경
- [ ] Phase별 Gantt 차트

### 데이터 분석
- [ ] Phase별 평균 완료 시간
- [ ] 블로킹 빈도 분석
- [ ] 담당자별 생산성 리포트

## 파일 위치

### 백엔드
- **마이그레이션**: `/Users/nicenoodle/baln/supabase/migrations/20260215_phase_tasks_tracker.sql`
- **적용 가이드**: `/Users/nicenoodle/baln/supabase/migrations/APPLY_THIS_20260215_phase_tasks_tracker.md`

### 프론트엔드
- **관리자 대시보드**: `/Users/nicenoodle/baln-web/admin/index.html`
  - 라인 1120-1220: Phase 9-12 HTML 구조
  - 라인 2989-3175: Phase 추적 JavaScript 함수

## Git 커밋

### baln 저장소
```
commit 7d95808
feat: Phase 9-12 실시간 진행률 트래커 추가
- phase_tasks 테이블 생성
- 초기 작업 데이터 26개 삽입
```

### baln-web 저장소
```
commit b631df0
feat: WBS 탭에 Phase 9-12 실시간 진행률 트래커 UI 추가
- 인터랙티브 진행률 바
- 토글 가능한 체크리스트
- 작업 상태 클릭 변경
```

## 연락처

문제 발생 시:
1. GitHub Issues: https://github.com/jimmyjeon420-png/baln/issues
2. 이 문서의 "문제 해결" 섹션 참고
3. Claude Code에게 질문

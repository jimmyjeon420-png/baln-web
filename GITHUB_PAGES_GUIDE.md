# GitHub Pages 활성화 가이드 — baln-web

> **레포지토리**: jimmyjeon420-png/baln-web
> **예상 URL**: https://jimmyjeon420-png.github.io/baln-web/
> **상태**: `gh` CLI 설치 완료, 인증 필요

---

## 방법 1: gh CLI로 활성화 (터미널에서 — 권장)

### Step 1: gh 로그인
```bash
gh auth login
```
- "GitHub.com" 선택
- "HTTPS" 선택
- "Login with a web browser" 선택
- 브라우저에서 표시되는 코드를 입력하고 인증 완료

### Step 2: GitHub Pages 활성화
```bash
gh api repos/jimmyjeon420-png/baln-web/pages -X POST --input - <<'EOF'
{"source":{"branch":"main","path":"/"}}
EOF
```

### Step 3: 확인
```bash
gh api repos/jimmyjeon420-png/baln-web/pages
```
응답에 `"html_url": "https://jimmyjeon420-png.github.io/baln-web/"` 가 포함되면 성공입니다.

---

## 방법 2: GitHub 웹사이트에서 수동 활성화

### Step 1: Settings 페이지로 이동
브라우저에서 아래 URL을 직접 열어주세요:

```
https://github.com/jimmyjeon420-png/baln-web/settings/pages
```

### Step 2: Source 설정
1. 페이지 중간에 **"Build and deployment"** 섹션이 보입니다
2. **"Source"** 드롭다운에서 **"Deploy from a branch"** 를 선택합니다
3. **"Branch"** 드롭다운에서 **"main"** 을 선택합니다
4. 옆에 있는 폴더 드롭다운에서 **"/ (root)"** 를 선택합니다
5. **"Save"** 버튼을 클릭합니다

### Step 3: 배포 확인
- Save 후 페이지 상단에 파란색 배너로 "GitHub Pages source saved." 메시지가 나타납니다
- 1~3분 후 같은 페이지를 새로고침하면 상단에 초록색 배너로 사이트 URL이 표시됩니다:
  **https://jimmyjeon420-png.github.io/baln-web/**
- 이 URL을 클릭하면 index.html 랜딩 페이지가 보여야 합니다

---

## 활성화 후 확인할 페이지들

| 페이지 | URL |
|--------|-----|
| 랜딩 페이지 | https://jimmyjeon420-png.github.io/baln-web/ |
| 이용약관 | https://jimmyjeon420-png.github.io/baln-web/terms.html |
| 개인정보처리방침 | https://jimmyjeon420-png.github.io/baln-web/privacy.html |

---

## 커스텀 도메인 연결 (선택사항 — 나중에)

baln.app 도메인을 연결하려면:
1. 같은 Settings > Pages 페이지에서 "Custom domain" 필드에 `baln.app` 입력
2. DNS 설정에서 CNAME 레코드 추가: `baln.app` -> `jimmyjeon420-png.github.io`
3. "Enforce HTTPS" 체크박스 활성화

---

## 문제 해결

### "404 Not Found" 가 보이는 경우
- Pages 설정 후 최대 10분까지 걸릴 수 있습니다. 잠시 기다려주세요.
- 브라우저 캐시를 지우고 다시 시도해보세요 (Cmd + Shift + R).

### "gh: not authenticated" 오류
- `gh auth login` 을 먼저 실행해서 인증을 완료하세요.
- 또는 방법 2 (웹사이트 수동 활성화)를 사용하세요.

### Pages 설정이 보이지 않는 경우
- 레포가 public인지 확인하세요. private 레포는 GitHub Pro 이상에서만 Pages 사용 가능합니다.
- 레포 Settings > General에서 Visibility를 "Public"으로 변경하세요.

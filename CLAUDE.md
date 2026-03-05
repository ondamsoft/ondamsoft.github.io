# OndamSoft 프로젝트 가이드

## 이 리포지토리 (ondamsoft.github.io)

- **용도**: OndamZip 홈페이지 + 자동 업데이트 JSON
- **도메인**: ondamsoft.com (GitHub Pages)
- **빌드 필요 없음**: 순수 정적 HTML/CSS/JS
- **수정 후 master에 push하면 바로 배포됨**

### 파일 구조

```
ondamsoft.github.io/
├── index.html          ← 메인 홈페이지 (한/영 다국어, 900줄, 수정 주의)
├── privacy.html        ← 개인정보처리방침
├── 404.html            ← 404 에러 페이지
├── logo.png            ← 회사 로고
├── logo-icon.png       ← 로고 아이콘 (푸터용)
├── ads.txt             ← Google AdSense (ca-pub-5085077973402796)
├── CNAME               ← 커스텀 도메인 (ondamsoft.com)
├── update/
│   └── ondamzip.json   ← 앱 자동 업데이트 정보 (버전, 다운로드 URL)
└── build.md            ← 빌드 상세 가이드 (참고용)
```

### 버전 업데이트 시 수정할 파일

1. **update/ondamzip.json** - version, notes, date, download_url 수정
2. **index.html** - 536번줄 근처 `v1.0.xx · 2026.xx` 버전 표시 수정
3. **index.html** - 684번줄, 695번줄 근처 다운로드 URL 수정

### 다운로드 URL 패턴

```
https://github.com/ondamsoft/ondamsoft.github.io/releases/download/v{VERSION}/OndamZip_{VERSION}_x64-setup.exe
https://github.com/ondamsoft/ondamsoft.github.io/releases/download/v{VERSION}/OndamZip_{VERSION}_aarch64.dmg
```

### index.html 수정 시 주의사항

- i18n(다국어) 시스템 사용 중 → `data-i18n`, `data-i18n-html` 속성
- HTML 본문 텍스트 + JS의 LANG 객체(ko/en) **둘 다** 수정해야 함
- LANG 객체는 731번줄부터 시작
- GitHub API로 다운로드 카운트 자동 표시 (869번줄)

---

## OndamZip 앱 (별도 프로젝트)

### 기술 스택

- **프레임워크**: Tauri v2 (Rust 백엔드 + 웹 프론트엔드)
- **프론트엔드**: Vue 3 + Vite
- **백엔드/코어**: Rust
- **개발 서버 포트**: 5173 (Vite 기본)

### 필수 개발 도구

| 도구 | 버전 | 설치 확인 | 설치 방법 |
|------|------|-----------|-----------|
| Node.js | 18+ | `node -v` | https://nodejs.org |
| npm | 9+ | `npm -v` | Node.js와 함께 설치됨 |
| Rust | stable | `rustc --version` | `curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs \| sh` |
| Cargo | stable | `cargo --version` | Rust와 함께 설치됨 |
| Git | 최신 | `git --version` | OS별 패키지 매니저 |

### `ni` 에러 해결

`ni`는 `@antfu/ni` 패키지 명령어. **없어도 됨!** 아래처럼 대체:

```bash
# ni 대신 → npm install
npm install

# nr dev 대신 → npm run dev
npm run dev

# nr build 대신 → npm run build
npm run build

# nr tauri dev 대신
npm run tauri dev

# nr tauri build 대신
npm run tauri build
```

꼭 ni를 쓰고 싶으면: `npm install -g @antfu/ni`

### PATH 에러 해결

```bash
# cargo/rustc not found 에러 시
export PATH="$HOME/.cargo/bin:$PATH"

# 영구 적용 (macOS)
echo 'export PATH="$HOME/.cargo/bin:$PATH"' >> ~/.zshrc
source ~/.zshrc

# 영구 적용 (Linux/bash)
echo 'export PATH="$HOME/.cargo/bin:$PATH"' >> ~/.bashrc
source ~/.bashrc
```

### macOS 빌드 환경 설정

```bash
# 1. Xcode Command Line Tools
xcode-select --install

# 2. Rust aarch64 타겟 추가 (Apple Silicon)
rustup target add aarch64-apple-darwin

# 3. 환경 확인
rustup target list --installed   # aarch64-apple-darwin 있어야 함
xcode-select -p                   # /Applications/Xcode.app/... 출력돼야 함
```

### Windows 빌드 환경 설정

```bash
# Visual Studio Build Tools 필요 (C++ 빌드 도구)
# WebView2 런타임 (Windows 10/11 기본 포함)
```

### 빌드 명령어

```bash
# 1. 의존성 설치
npm install

# 2. 개발 모드 (핫리로드, 5173 포트)
npm run tauri dev

# 3. 프로덕션 빌드
npm run tauri build

# 빌드 결과물 위치
# Windows: src-tauri/target/release/bundle/nsis/OndamZip_{VERSION}_x64-setup.exe
# macOS:   src-tauri/target/release/bundle/dmg/OndamZip_{VERSION}_aarch64.dmg
```

### macOS 코드서명 + 공증

배포용 빌드 시 필요한 환경변수:
```bash
export APPLE_SIGNING_IDENTITY="Developer ID Application: ..."
export APPLE_ID="your@email.com"
export APPLE_PASSWORD="앱 비밀번호 (앱 전용 암호)"
export APPLE_TEAM_ID="팀ID"
```

### 크로스 빌드 제한

- Windows 빌드 → **Windows에서만** 가능
- macOS 빌드 → **macOS에서만** 가능
- 콘솔 클로드(Linux 서버) → **빌드 불가**, 홈페이지 수정만 가능
- 클로드 데스크탑(로컬 PC) → 해당 OS 빌드 가능

---

## 배포 절차

### 1. 앱 프로젝트에서 버전 수정

- `package.json` → `"version": "x.x.x"`
- `src-tauri/tauri.conf.json` → `"version": "x.x.x"`
- `src-tauri/Cargo.toml` → `version = "x.x.x"`

### 2. 빌드

```bash
npm run tauri build
```

### 3. GitHub Release 생성

```bash
# 태그 생성 & 푸시
git tag vX.X.X
git push origin vX.X.X

# gh CLI로 릴리스 생성
gh release create vX.X.X \
  "OndamZip_X.X.X_x64-setup.exe" \
  "OndamZip_X.X.X_aarch64.dmg" \
  --title "OndamZip vX.X.X" \
  --notes "릴리스 노트"
```

### 4. 홈페이지 리포 업데이트

```bash
cd ondamsoft.github.io

# ondamzip.json 수정
# index.html 다운로드 URL + 버전 표시 수정

git add update/ondamzip.json index.html
git commit -m "vX.X.X: 다운로드 링크 업데이트"
git push origin master
```

---

## 트러블슈팅 체크리스트

- `node -v` → 18+ 나와야 함
- `npm -v` → 9+ 나와야 함
- `rustc --version` → stable 나와야 함
- `cargo --version` → stable 나와야 함
- `npm install` → 에러 없이 완료돼야 함
- `npm run build` → 프론트엔드 빌드 성공해야 함
- `npm run tauri build` → 전체 빌드 성공해야 함
- macOS: `xcode-select -p` → Xcode 경로 나와야 함
- macOS: `rustup target list --installed` → aarch64-apple-darwin 있어야 함

---

## 연락처

- 이메일: ondamsoft@gmail.com
- 카카오페이 후원: https://link.kakaopay.com/_/X5c6lXs

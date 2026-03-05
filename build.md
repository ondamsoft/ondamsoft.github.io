# OndamZip 빌드 & 배포 가이드

## 1. 프로젝트 개요

- **앱 이름**: OndamZip (온담집)
- **현재 버전**: 1.0.12
- **기술 스택**: Tauri v2 + Vue 3 + Vite + Rust
- **지원 플랫폼**: Windows (x64), macOS (aarch64/Apple Silicon)
- **개발 서버 포트**: 5173 (Vite 기본)
- **홈페이지 리포**: `ondamsoft/ondamsoft.github.io` (순수 정적 HTML, 빌드 불필요)
- **앱 리포**: 별도 (Tauri 프로젝트)

---

## 2. 개발 환경 설정

### 2-1. 공통 필수 도구

| 도구 | 용도 | 설치 확인 |
|------|------|-----------|
| Node.js (18+) | 프론트엔드 빌드 | `node -v` |
| npm / pnpm | 패키지 관리 | `npm -v` / `pnpm -v` |
| Rust (stable) | Tauri 백엔드 | `rustc --version` |
| Git | 버전 관리 | `git --version` |

### 2-2. Windows 추가 요구사항

```bash
# Visual Studio Build Tools (C++ 빌드 도구)
# WebView2 (Windows 10/11 기본 포함)
```

### 2-3. macOS 추가 요구사항

```bash
# Xcode Command Line Tools (필수)
xcode-select --install

# Rust aarch64 타겟 (Apple Silicon)
rustup target add aarch64-apple-darwin

# Xcode 전체 설치 (코드서명/공증 필요시)
# App Store에서 Xcode 설치
```

---

## 3. 흔한 에러와 해결법

### 3-1. `ni` 명령어를 찾을 수 없음

`ni`는 `@antfu/ni` 패키지의 명령어로, 패키지 매니저를 자동 감지해서 install 해주는 도구입니다.

```bash
# 에러 메시지 예시
# command not found: ni
# 'ni' is not recognized as an internal or external command

# 해결 방법 1: ni 글로벌 설치
npm install -g @antfu/ni

# 해결 방법 2: ni 대신 직접 명령어 사용
# ni == npm install (또는 pnpm install)
# nr dev == npm run dev
# nr build == npm run build
# nr tauri dev == npm run tauri dev
# nr tauri build == npm run tauri build

# 즉, ni 없이도 npm/pnpm으로 직접 실행 가능!
npm install        # ni 대신
npm run dev        # nr dev 대신
npm run build      # nr build 대신
```

### 3-2. PATH 관련 에러

```bash
# 에러: cargo not found / rustc not found
# Rust PATH가 안 잡혀있는 경우

# macOS/Linux - 셸 설정에 추가
echo 'export PATH="$HOME/.cargo/bin:$PATH"' >> ~/.zshrc
source ~/.zshrc

# 또는 직접 실행
export PATH="$HOME/.cargo/bin:$PATH"

# 확인
which cargo
which rustc
```

```bash
# 에러: node not found (nvm 사용시)
# nvm PATH 설정
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
nvm use --lts
```

### 3-3. Tauri CLI 없음

```bash
# 에러: tauri command not found

# 방법 1: npm 스크립트로 실행 (권장)
npm run tauri dev
npm run tauri build

# 방법 2: Tauri CLI 글로벌 설치
cargo install tauri-cli

# 방법 3: npx로 실행
npx tauri dev
npx tauri build
```

### 3-4. macOS 코드서명 관련

```bash
# 에러: codesign failed / identity not found
# Apple Developer 인증서 필요

# 개발용 (로컬 테스트만)
# tauri.conf.json에서 서명 비활성화 가능

# 배포용 (공증 필요)
# Apple Developer Program 가입 필요 ($99/년)
# Developer ID Application 인증서 발급
```

---

## 4. 빌드 방법

### 4-1. 의존성 설치

```bash
# 프로젝트 루트에서
npm install
# 또는
pnpm install
```

### 4-2. 개발 모드 (핫리로드)

```bash
npm run tauri dev
# Vite 개발 서버가 5173 포트에서 실행됨
# Tauri 윈도우가 자동으로 열림
```

### 4-3. 프로덕션 빌드

```bash
# Windows에서 Windows 빌드
npm run tauri build
# 결과물: src-tauri/target/release/bundle/nsis/OndamZip_x.x.x_x64-setup.exe

# macOS에서 macOS 빌드
npm run tauri build
# 결과물: src-tauri/target/release/bundle/dmg/OndamZip_x.x.x_aarch64.dmg
```

> **중요**: Windows 빌드는 Windows에서, macOS 빌드는 macOS에서만 가능 (크로스 컴파일 불가)

### 4-4. macOS 빌드 상세

```bash
# 1. 환경 확인
rustup target list --installed  # aarch64-apple-darwin 있어야 함
xcode-select -p                  # Xcode 경로 확인

# 2. 빌드
npm run tauri build -- --target aarch64-apple-darwin

# 3. 코드서명 + 공증 (배포용)
# tauri.conf.json의 macOS 서명 설정 확인
# APPLE_SIGNING_IDENTITY 환경변수 설정 필요
# APPLE_ID, APPLE_PASSWORD (앱 비밀번호), APPLE_TEAM_ID 필요
```

---

## 5. 버전 업데이트 & 배포 절차

### 5-1. 앱 버전 올리기

앱 프로젝트에서 다음 파일들의 버전 수정:
- `package.json` → `"version": "x.x.x"`
- `src-tauri/tauri.conf.json` → `"version": "x.x.x"`
- `src-tauri/Cargo.toml` → `version = "x.x.x"`

### 5-2. 빌드 & 릴리스 파일 생성

```bash
# Windows
npm run tauri build
# → OndamZip_x.x.x_x64-setup.exe 생성

# macOS
npm run tauri build
# → OndamZip_x.x.x_aarch64.dmg 생성
```

### 5-3. GitHub Release 생성

```bash
# 태그 생성
git tag vX.X.X
git push origin vX.X.X

# GitHub Release 페이지에서:
# 1. 새 릴리스 생성 (태그 선택)
# 2. .exe 파일 업로드
# 3. .dmg 파일 업로드
# 4. 릴리스 노트 작성
# 5. Publish release
```

또는 gh CLI 사용:
```bash
gh release create vX.X.X \
  OndamZip_X.X.X_x64-setup.exe \
  OndamZip_X.X.X_aarch64.dmg \
  --title "OndamZip vX.X.X" \
  --notes "릴리스 노트 내용"
```

### 5-4. 홈페이지 리포 업데이트 (ondamsoft.github.io)

```bash
cd ondamsoft.github.io

# 1. update/ondamzip.json 수정 (자동 업데이트 정보)
# version, notes, date, download_url 업데이트

# 2. index.html의 다운로드 링크 확인/수정 (필요시)

# 3. 커밋 & 푸시
git add update/ondamzip.json
git commit -m "vX.X.X: 다운로드 링크 업데이트"
git push origin master
```

---

## 6. ondamzip.json 형식 (자동 업데이트용)

```json
{
  "version": "1.0.12",
  "notes": "변경사항 요약",
  "date": "2026-03-03",
  "windows": {
    "download_url": "https://github.com/ondamsoft/ondamsoft.github.io/releases/download/v1.0.12/OndamZip_1.0.12_x64-setup.exe"
  },
  "macos": {
    "download_url": "https://github.com/ondamsoft/ondamsoft.github.io/releases/download/v1.0.12/OndamZip_1.0.12_aarch64.dmg"
  }
}
```

URL 패턴: `https://github.com/ondamsoft/ondamsoft.github.io/releases/download/v{VERSION}/OndamZip_{VERSION}_{ARCH}.{EXT}`

---

## 7. 콘솔 클로드에서 작업시 주의사항

1. **ni 명령어 사용 불가** → `npm install`, `npm run build` 직접 사용
2. **GUI 없음** → `npm run tauri dev`는 안됨 (디스플레이 없음)
3. **빌드만 가능** → `npm run tauri build`는 CLI에서 실행 가능
4. **크로스 빌드 불가** → Linux 콘솔에서는 Windows/macOS 빌드 불가
5. **PATH 확인 필수** → `which node`, `which cargo`, `which rustc`로 경로 확인
6. **홈페이지 수정은 가능** → `ondamsoft.github.io`는 정적 HTML이라 빌드 불필요

---

## 8. 트러블슈팅 체크리스트

- [ ] `node -v` 출력되는가? (18+ 필요)
- [ ] `npm -v` 또는 `pnpm -v` 출력되는가?
- [ ] `rustc --version` 출력되는가?
- [ ] `cargo --version` 출력되는가?
- [ ] `npm install` 성공하는가?
- [ ] `npm run build` (프론트엔드만) 성공하는가?
- [ ] `npm run tauri build` 성공하는가?
- [ ] macOS: `xcode-select -p` 출력되는가?
- [ ] macOS: `rustup target list --installed`에 aarch64-apple-darwin 있는가?

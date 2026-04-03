# RainDrop Tech Blog

Next.js App Router + MDX 기반 기술 블로그입니다.

## 로컬 실행

```bash
npm install
npm run dev
```

## 글 작성 방법

글 파일은 [content/posts](content/posts) 아래에 `.mdx`로 추가합니다.

예시 Frontmatter:

```md
---
title: "글 제목"
date: "2026-04-03"
category: "Next.js"
tags:
	- next
	- mdx
summary: "한 줄 요약"
draft: false
---
```

- 파일명은 자동으로 slug가 됩니다. 예: `hello-mdx.mdx` -> `/posts/hello-mdx`
- `category` 기준으로 자동 분류 페이지가 생성됩니다.
- `draft: true`인 글은 목록과 카테고리에서 숨겨집니다.

## 빌드 및 정적 export

이 프로젝트는 [next.config.ts](next.config.ts)에서 `output: "export"`를 사용합니다.

```bash
npm run build
```

빌드 결과는 `out/`에 생성되고 GitHub Pages 배포 아티팩트로 사용됩니다.

## GitHub Pages 배포

워크플로 파일: [.github/workflows/deploy.yml](.github/workflows/deploy.yml)

설정 순서:

1. 저장소 Settings -> Pages로 이동
2. Source를 `GitHub Actions`로 선택
3. `main` 브랜치에 push하면 자동 배포

사용자 페이지 저장소(`username.github.io`) 기준으로 basePath 없이 루트 경로에 배포됩니다.

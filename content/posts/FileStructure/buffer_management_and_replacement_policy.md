---
title: "Buffer 관리와 교체 정책"
date: "2026-11-16"
category: "File Structure"
tags:
  - FS
summary: "Buffer와 Page, 읽기/쓰기 시 buffer 관리 흐름, LRU·MRU 등 교체 정책 정리"
draft: false
---

# 개요

디스크는 block 단위로 읽고, 읽은 block은 메인 메모리에 올려 둔다.  
그럼 그 공간이 꽉 차면 어떤 block을 내보내야 할까?  
이번 글에서는 Buffer와 Page, 읽기/쓰기 때의 buffer 관리 흐름, 그리고 교체 정책에 대해 정리해보려 한다.

---

# Buffer와 Page

### 1. Buffer
- 디스크와 메인 메모리 사이에서 데이터를 덩어리(chunk) 단위로 옮기기 위한 임시 메모리다.
- buffer 하나에 여러 block이 들어간다.
- 메인 메모리 안에서 응용 프로그램 메모리와 디스크 사이에 위치한다.

```text
CPU
 ↕
Main Memory
 ├─ Memory for application program
 │      ↕
 └─ Buffer
        ↕
Secondary Memory Device
```

### 2. Page
- buffer(메인 메모리) 안에서 block 하나에 대응하는 조각이다.
- buffer가 꽉 차면 page 하나를 내보내고 새 block을 올린다. 이걸 Page Replacement라고 한다.
- 디스크에는 항상 모든 block이 있지만, buffer에서 수정된 page가 있다면 디스크 쪽이 옛날 버전이다.

나는 OS의 가상 메모리에서 page를 frame에 올리고 내리는 것과 같은 구조로 생각하니 이해가 쉬웠다.  
교재에서도 buffer manager가 언뜻 보면 가상 메모리 매니저와 다를 게 없어 보인다고 한다.

---

# Buffer Management: Read와 Write

### 1. Read
```text
Read Request
 ├─ 메인 메모리에 있음 → Get Data
 └─ 메인 메모리에 없음 → Access to Disk
                        → Load on main memory (+ Replacement)
                        → Get Data
```

### 2. Write
```text
Write Request
 ├─ 메인 메모리에 있음 → 그 page에 Write Data
 └─ 메인 메모리에 없음 → Access to Disk
                        → Load on main memory (+ Replacement)
                        → Write Data
수정된 page → 나중에 Write Data on Disk
```

### 3. 비교

| | Read | Write |
|---|---|---|
| 메모리에 있을 때 | 바로 가져온다 | page에 바로 쓴다 |
| 메모리에 없을 때 | 디스크에서 올린 뒤 가져온다 | 디스크에서 올린 뒤 쓴다 |
| 디스크 반영 | 없음 | 수정된 page를 디스크에 쓴다 |

- 읽든 쓰든 일단 메인 메모리를 거친다. 디스크에 바로 쓰지 않는다.
- 쫓겨나는 block은 디스크에 마지막으로 쓴 뒤 수정된 경우에만 디스크에 다시 쓴다.

---

# Replacement Policy

### 1. LRU (Least Recently Used)
- 가장 오래전에 사용된 block을 내보낸다.
- 대부분의 OS와 buffer 관리가 이 방식을 쓴다.
- 과거의 참조 패턴으로 미래를 예측한다. 최근에 쓴 block은 또 쓰일 거라는 가정이다.

### 2. 미래 참조 예측
- DB 질의는 sequential scan처럼 접근 패턴이 정해져 있다.
- 그래서 DBMS는 사용자 질의를 보고 앞으로 어떤 block이 필요할지 예측할 수 있다.
- OS는 과거만 보고 판단하지만, DB는 가까운 미래를 어느 정도 안다는 점이 다르다.

### 3. Pinned Block
- 디스크로 내보내면 안 되는 block이다. 교체 대상에서 빠진다.
- 읽는 중에 block이 쫓겨나면 엉뚱한 데이터를 읽게 되니, 쓰는 동안 pin을 걸고 끝나면 unpin한다.

### 4. Toss-immediate
- block의 마지막 tuple 처리가 끝나면 그 block의 공간을 바로 비운다.

### 5. MRU (Most Recently Used)
- 처리 중인 block은 pin해 둔다.
- 마지막 tuple 처리가 끝나면 unpin하고, 그 block이 가장 최근에 쓴 block이 된다.
- 교체할 때는 이 가장 최근에 쓴 block부터 내보낸다.

### 6. 예시: Nested Loop Join
교재는 `instructor`와 `department`를 join하는 경우로 설명한다.

```text
for each tuple i of instructor
    for each tuple d of department
        if i.dept_name = d.dept_name then 결과에 추가
```

| relation | 접근 패턴 | 알맞은 전략 |
|---|---|---|
| instructor (바깥) | 한 번 처리한 tuple은 다시 안 본다 | Toss-immediate |
| department (안쪽) | 바깥 tuple마다 처음부터 끝까지 다시 돈다 | MRU |

- department block 하나를 다 보면, 나머지 block을 전부 본 뒤에야 다시 필요하다.
- 즉 방금 쓴 block이 가장 늦게 다시 쓰인다. LRU의 가정과 정반대다.

---

# 마치며

buffer는 디스크 접근을 줄이려고 메인 메모리에 마련한 공간이고, 읽기와 쓰기 모두 이곳을 거친다.  
꽉 찼을 때 무엇을 내보내느냐가 hit ratio를 좌우하는데, 기본은 LRU지만 DB는 질의를 보고 앞을 예측할 수 있어서 MRU나 Toss-immediate가 더 나을 때가 있다.  

가장 최근에 쓴 걸 먼저 버리는 게 낫다는 게 처음엔 직관과 반대라 신기했다.  
다음에는 파일 시스템이 block을 어떻게 관리하는지, i-node부터 정리해볼 것 같다.

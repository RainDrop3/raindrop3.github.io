---
title: "저장 매체와 디스크 접근 시간"
date: "2026-10-18"
category: "File Structure"
tags:
  - FS
summary: "메모리 계층 구조와 하드디스크 접근 시간, 블록 단위 접근 정리"
draft: false
---

# 개요

대용량 데이터는 메인 메모리가 아니라 디스크에 있다.  
그럼 디스크에서 데이터를 한 번 꺼내 오는 데 얼마나 걸리고, 그 횟수는 어떻게 줄일 수 있을까?  
이번 글에서는 메모리 계층 구조와 저장 매체, 하드디스크 접근 시간, 그리고 Hit Ratio와 블록 단위 접근에 대해 정리해보려 한다.

---

# 메모리 계층 구조와 저장 매체

### 1. Memory Hierarchy
- 대용량 데이터는 메인 메모리에 다 들어가지 않으므로 secondary memory에 저장한다.
- 위로 갈수록 빠르고, 아래로 갈수록 싸고 크다.

```text
Cache Memory      8MB  (Core i7 L3)   ↑ Faster
Main Memory       16GB
Secondary Memory  1TB  (SSD, HDD)
Tertiary Memory   10PB                ↓ Cheaper
```

### 2. 접근 속도

| Memory type | Read | Write |
|---|---|---|
| Cache | 1~10 ns | 1~10 ns |
| Main Memory | 50~70 ns | 50~70 ns |
| SSD (random) | 50~150 μs | 100~500 μs |
| SSD (sequential) | 10~30 μs | 20~80 μs |
| HDD (random) | 5~10 ms | 5~12 ms |
| HDD (sequential) | 0.1~0.5 ms | 0.1~0.5 ms |

- 메인 메모리와 HDD random 접근은 약 10^5배 차이가 난다.
- HDD는 random과 sequential의 차이가 크다. 이유는 뒤에서 본다.

### 3. SSD (Flash Memory)
- 읽기/쓰기 단위는 page(4KB 정도), 지우기 단위는 block(64~256 pages)이다.
- 덮어쓰기가 안 된다. 다시 쓰려면 block 단위로 먼저 지워야 하고, 지우기는 1.5~4.5ms로 느리다.
- 쓰기/지우기 횟수에 제한이 있다(Aging Problem).

이 밖에 Optical(CD, DVD)과 Tape는 디스크보다 느린 대용량 매체로, 주로 백업에 쓴다.

---

# 하드디스크 접근 시간

### 1. 물리적 구조
- platter: 데이터가 기록되는 원판. spindle을 축으로 회전한다.
- track: platter 위의 동심원 하나. track당 200~400 sectors.
- sector: track을 나눈 조각. 보통 512 bytes.
- cylinder: 여러 platter에서 같은 위치에 있는 track들의 묶음.
- read-write head: arm 끝에 달려 원하는 track으로 이동한다.

### 2. Disk Access Time
```text
t = tS + tR + tT
```
- **tS: Seek Time**
  - head를 원하는 track 위로 옮기는 시간. Seek(찾다)라는 이름 그대로다.
  - 평균은 worst case의 1/2 정도, 보통 4~10ms.
- **tR: Rotational Latency**
  - 원하는 sector가 head 아래로 올 때까지 기다리는 시간.
  - index point를 찾는 데 ½r, sector까지 ½r를 더해 평균 r로 본다. (r: 한 바퀴 도는 시간)
  - 15000rpm이면 r = 60sec / 15000 = 4ms.
- **tT: Transfer Time**
  - 디스크에서 메인 메모리로 옮기는 시간. sector 수에 비례하지만 거의 무시할 만하다.

결국 디스크 접근 시간의 대부분은 head가 움직이고 디스크가 도는 **기계적인 시간**이다.  
HDD에서 sequential 접근이 빠른 것도 seek과 회전 대기가 거의 없기 때문이다.

---

# Hit Ratio와 블록 단위 접근

### 1. Hit Ratio
- 데이터를 요청하면 먼저 메인 메모리에 있는지 본다.
- 있으면 바로 가져오고, 없으면 디스크에서 메인 메모리로 올린 뒤 가져온다.

```text
r_h = n_h / n_a   (n_h: 메모리에서 찾은 횟수, n_a: 전체 접근 횟수)
```

나는 CPU 캐시의 hit/miss를 메인 메모리와 디스크 사이로 한 단계 내린 것이라 생각하니 이해가 쉬웠다.

### 2. Hit Ratio가 중요한 이유
```c
for (int i = 0; i < 1000; i++)
    Nbytes = read(fd, buf, 100);
```

| r_h | 계산 | 시간 |
|---|---|---|
| 0 | 1000 × 10^-2 sec | 10 sec |
| 1 | 1000 × 10^-8 sec | 10^-5 sec |

같은 코드인데 10^6배 차이가 난다.

### 3. Block-Oriented Disk Access
- 디스크는 byte가 아니라 **block** 단위로 접근한다.
- block 크기는 sector의 배수로, 1K~128K bytes 정도에서 설정한다.
- 아래처럼 10 bytes씩 1000번 읽을 때, 매번 디스크에서 읽으면 1000번 접근한다.
- 1024 bytes block을 buffer에 올려 두고 거기서 읽으면 디스크 접근은 약 10번이다.

```c
for (int i = 0; i < 1000; i++)
    Nbytes = read(fd, buf, 10);
```

### 4. Block을 무작정 크게 하면?
- 사용 가능한 메인 메모리 크기에 제한을 받는다.
- 필요 없는 sector까지 읽게 된다.
  - 100 bytes만 필요한데 block이 64K면 128 sectors, 약 반 바퀴(2ms)를 낭비한다.

---

# 마치며

정리하면 디스크 접근 시간은 seek time과 rotational latency 같은 기계적인 시간이 대부분이다.  
그래서 디스크 접근 횟수를 줄이는 게 핵심이고, 그 기본이 block 단위 접근과 hit ratio를 높이는 것이다.  

ns와 ms가 한 표에 같이 있으니 차이가 더 실감났다.  
다음에는 이번 글에서 잠깐 나온 buffer를 어떻게 관리하는지 정리해볼 것 같다.

---
title: "Interrupt와 DMA"
date: "2026-10-20"
category: "Operating System"
tags:
  - OS
summary: "인터럽트 처리 과정과 interrupt-driven I/O, DMA 정리"
draft: false
---

# 개요

OS는 부팅이 끝나면 첫 프로세스를 실행해두고, 그 뒤로는 무슨 일이 생기기를 기다린다.  
그럼 "일이 생겼다"는 걸 OS는 어떻게 알까?  
답은 인터럽트(interrupt)다.  
이번에는 인터럽트가 처리되는 과정, 디바이스 컨트롤러와 I/O, 그리고 DMA를 정리해보려 한다.

---

# 인터럽트 (Interrupt)

### 1. Interrupt-driven
- 부팅 시 firmware(ROM, EEPROM)에 있는 bootstrap program이 시스템을 초기화하고 kernel을 실행시킨다.  
- 이후 OS는 첫 프로세스를 실행하고 이벤트를 기다린다.  
- 이벤트는 하드웨어나 소프트웨어의 인터럽트로 알려진다. 그래서 OS를 interrupt-driven이라고 한다.

### 2. 인터럽트 처리 과정
- 인터럽트가 걸리면 제어가 interrupt service routine(ISR)으로 넘어간다.  
- 인터럽트 당한 명령어의 주소를 반드시 저장해야 한다. 그래야 처리 후 돌아올 수 있다.  
- OS는 레지스터와 PC를 저장해서 CPU 상태를 보존한다.  
- 인터럽트 하나를 처리하는 동안에는 새로 들어오는 인터럽트를 막아둔다. lost interrupt를 막기 위해서다.

### 3. Polling vs Vectored
OS가 어떤 인터럽트가 발생했는지 알아내는 방법은 두 가지다.

| 방식 | 동작 |
|---|---|
| Polling | 디바이스를 하나씩 확인하며 누가 인터럽트를 걸었는지 찾는다 |
| Vectored interrupt system | interrupt vector(모든 ISR 주소를 모은 표)에서 주소를 찾아 바로 점프한다 |

- 나는 interrupt vector를 이전 시스템콜의 트랩테이블과 같은 역할로 이해했다. 번호를 보고 처리할 루틴의 주소를 찾아가는 표라는 점이 같다.

### 4. H/W 인터럽트와 트랩
- H/W 인터럽트: 디바이스가 작업을 끝냈을 때처럼 하드웨어가 거는 인터럽트  
- 트랩(trap): 소프트웨어가 발생시키는 인터럽트  
  - 에러: divide by zero, stack overflow 등  
  - 사용자 요청: 시스템콜

---

# 디바이스 컨트롤러와 I/O

### 1. 구조
```text
          disks     mouse keyboard printer     monitor
            |            \    |    /              |
[CPU] [disk controller] [USB controller] [graphics adapter]
  |           |                |                  |
  +-----------+-------+--------+------------------+
                      |
                  [memory]
```
- 디바이스 컨트롤러는 특정 종류의 디바이스를 맡고, 각자 local buffer를 가진다.  
- device driver는 OS 쪽에서 디바이스 컨트롤러를 이해하고 다루는 소프트웨어다.  
- I/O 디바이스와 CPU는 동시에 실행될 수 있다.

### 2. Interrupt-driven I/O
- 디바이스 ↔ local buffer: 실제 I/O가 일어나는 구간  
- local buffer ↔ 메모리: CPU가 데이터를 옮긴다  
- 컨트롤러는 작업이 끝나면 인터럽트로 CPU에 알린다

| 시점 | CPU | I/O device |
|---|---|---|
| I/O request ~ transfer done | user process 계속 실행 | transferring |
| transfer done | H/W 인터럽트 → I/O interrupt processing | idle |
| 처리 후 | user process 실행 재개 | idle |

- 디바이스가 전송하는 동안 CPU는 기다리지 않고 자기 일을 한다.  
- 택배를 문 앞에서 기다리는 대신 도착 알림을 받는 것과 비슷하다고 생각했다.

---

# DMA (Direct Memory Access)

### 1. 등장 배경
- interrupt-driven I/O는 대량 데이터를 옮길 때 overhead가 크다.  
- byte마다 인터럽트가 걸리면 CPU는 인터럽트 처리에 시간을 다 쓰게 된다.

### 2. 동작
- 메모리 속도에 가깝게 전송할 수 있는 고속 I/O 디바이스에 쓰인다.  
- 디바이스 컨트롤러가 local buffer와 메모리 사이에서 block 전체를 직접 옮긴다. CPU는 개입하지 않는다.  
- 인터럽트는 block마다 한 번만 발생한다.  
- 이름 그대로 디바이스가 CPU를 거치지 않고 메모리에 Direct로 접근하는 것이다.

| | Interrupt-driven I/O | DMA |
|---|---|---|
| buffer ↔ 메모리 이동 | CPU가 수행 | 디바이스 컨트롤러가 수행 |
| 인터럽트 단위 | byte마다 | block마다 1번 |
| 적합한 경우 | 소량 데이터 | 고속 디바이스, 대량 데이터 |

---

# 마치며

OS는 평소엔 기다리다가 인터럽트가 오면 움직이는 구조라고 정리할 수 있겠다.  
DMA도 결국 CPU가 I/O에 묶여 있지 않게 하려는 아이디어라서 interrupt-driven I/O와 같은 방향인 것 같다.  
인터럽트를 disable하는 이야기는 Process Synchronization에서 다시 나오니 그때 같이 봐야겠다.  
다음에는 dual-mode operation과 timer를 정리해볼 생각이다.

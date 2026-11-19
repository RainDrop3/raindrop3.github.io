---
title: "Multiprogramming, Dual-Mode Operation과 Timer"
date: "2026-11-19"
category: "Operating System"
tags:
  - OS
summary: "Multiprogramming과 Timesharing, 이를 보호하는 Dual-Mode Operation과 Timer 정리"
draft: false
---
# 개요

여러 프로그램이 CPU와 메모리를 같이 쓰면 효율은 좋아진다.  
그런데 그중 하나가 무한루프를 돌거나 OS 영역을 건드리면 어떻게 될까?  
이번에는 Multiprogramming과 Timesharing을 보고, 그 상황에서 시스템을 보호하는 Dual-Mode Operation과 Timer를 정리해보려 한다.

---

# Multiprogramming과 Timesharing

### 1. Multiprogramming (Batch system)

- 사용자 한 명의 프로그램만으로는 CPU와 I/O 디바이스를 항상 바쁘게 만들 수 없다.  
- 그래서 여러 job(code와 data)을 메모리에 올려두고, CPU가 항상 실행할 job이 있게 한다.  
- 실행 중인 job이 I/O 등으로 기다려야 하면 OS가 다른 job으로 전환한다.

```text
0     | operating system |
      | job 1            |
      | job 2            |
      | job 3            |
      | job 4            |
512M  +------------------+
```

### 2. Timesharing (Multitasking)

- Multiprogramming을 논리적으로 확장한 것이다.  
- CPU가 job을 아주 자주 바꿔서 사용자가 실행 중인 job과 상호작용할 수 있다(interactive computing).  
- 응답 시간(response time)은 1초 미만이어야 한다.  
- 이름 그대로 CPU 시간을 잘게 나눠(sharing) 같이 쓰는 방식이다.


|           | Multiprogramming         | Timesharing                 |
| --------- | ------------------------ | --------------------------- |
| 목표        | CPU가 놀지 않게 (효율)          | 사용자와의 상호작용                  |
| job 전환 시점 | job이 기다려야 할 때            | 사용자가 못 느낄 만큼 자주             |
| 전환 계기     | job이 스스로 CPU를 놓음 (I/O 등) | Timer interrupt로 OS가 강제로 회수 |


### 3. 따라오는 문제들

- 준비된 job 중 무엇을 메모리에 올릴까 → Job scheduling  
- 실행 준비된 job 중 무엇을 돌릴까 → CPU scheduling  
- 메모리가 모자라면 → swapping, Virtual memory  
- OS 과목의 큰 줄기가 여기서 다 출발하는 것 같다.

---

# Dual-Mode Operation

### 1. 왜 필요한가

- OS와 사용자 프로그램은 자원을 같이 쓰므로, 한 프로그램의 오류는 그 프로그램에서 끝나야 한다.  
- 무한루프, 다른 프로세스나 OS를 수정하는 프로그램을 막아야 한다.

### 2. Mode bit

- CPU가 OS를 위해 일하는지, 사용자를 위해 일하는지를 bit 하나로 구분한다.  
- kernel mode = 0, user mode = 1 (하드웨어 지원 필요)  
- mode bit은 CPU 레지스터 안에 있다. user 프로그램은 이를 직접 바꿀 수 없고, trap/interrupt가 일어날 때 하드웨어가 kernel mode로 바꾼다.  
  - trap은 실행 중인 명령어 때문에 생기고(시스템콜, 0으로 나누기 등, 동기), interrupt는 timer나 I/O 장치처럼 CPU 바깥에서 아무 때나 들어온다(비동기).  
- 일부 명령어는 privileged로 지정되어 kernel mode에서만 실행된다.  
- user mode에서 privileged 명령어를 실행하려 하면 하드웨어가 illegal로 보고 OS로 trap을 건다.

```text
user (1)    calls system call                return from system call
                  | trap (bit=0)                    ^ return (bit=1)
kernel (0)        +---> execute system call --------+
```

- 시스템콜 내부 흐름은 이전 글 [Flow of System Call](/posts/system_call/)에서 다뤘다.

### 3. Privileged instruction 구분

각 명령이 어느 모드에서 실행 가능한지 정리하면 다음과 같다.


| 명령                       | 실행 가능 모드     | privileged |
| ------------------------ | ------------ | ---------- |
| Set value of timer       | Kernel       | O          |
| Read the clock           | User, Kernel | X          |
| Turn off interrupts      | Kernel       | O          |
| Access I/O devices       | Kernel       | O          |
| Issue a trap instruction | User, Kernel | X          |


- trap은 user mode에서 쓸 수 있어야 시스템콜로 kernel에 요청을 보낼 수 있다.  
- 반면 timer 설정이나 interrupt 끄기가 user에게 열려 있으면 프로그램 하나가 CPU를 영영 돌려주지 않을 수 있다.  
- 나는 "다른 프로그램이나 시스템 전체에 영향을 줄 수 있는가"를 기준으로 보니 구분이 쉬웠다.  
- 참고로 VMM(Virtual Machine Manager) mode처럼 mode를 더 두는 Multi-Mode도 있다.

---

# Timer

### 1. 역할

- 무한루프나 한 프로세스의 자원 독차지(hogging)를 막는다.  
- mode 구분만으로는 부족하다. -&gt; user 프로그램이 시스템콜 없이 돌기만 하면 OS가 CPU를 되찾을 계기가 없으므로 timer를 두어 강제 회수한다.

### 2. 동작

1. OS가 프로세스를 스케줄하기 전에 timer를 설정한다.
2. counter가 감소하다가 0이 되면 interrupt가 발생해 제어가 OS로 넘어온다.
3. OS는 할당 시간을 넘긴 프로그램을 종료하거나 다시 timer를 설정해 control을 유지한다.

- 알람을 맞춰두고 게임기를 빌려주는 것과 비슷하다. 알람이 울리면 게임기는 주인에게 돌아온다.  
- timer 설정이 privileged인 이유도 여기서 보인다. 사용자가 timer를 끌 수 있다면 timer는 있으나 마나다.

---

# 마치며

Multiprogramming과 Timesharing은 자원을 나눠 쓰게 하고, Dual-Mode와 Timer는 그 상황에서 프로그램 하나가 전체를 망치지 못하게 한다.  
dual mode 사용의 이유와 작동 flow만 잘 알아놔도 user, kernel의 개념공부에 큰 도움이 되는 것 같다.  
다음에는 OS 구조(Monolithic, Layered, Microkernel)를 정리해볼 생각이다.
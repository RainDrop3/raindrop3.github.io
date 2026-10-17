---
title: "Packet Switching vs Circuit Switching"
date: "2026-10-17"
category: "Computer Network"
tags:
  - NW
summary: "Network Core의 패킷 교환과 회선 교환 비교 정리"
draft: false
---

# 개요

내가 보낸 데이터는 라우터가 가득한 Network Core를 어떻게 지나 상대에게 도착할까?  
이번에는 Network Core에서 데이터를 나르는 두 가지 방식, packet switching과 circuit switching을 정리해보려 한다.  
패킷 교환의 store-and-forward와 지연, 회선 교환의 FDM/TDM을 보고 마지막에 둘을 비교한다.

---

# 패킷 교환 (Packet Switching)

### 1. 기본 동작
- 호스트는 애플리케이션 메시지를 작은 chunk로 쪼갠다. 이 chunk가 패킷(packet)이다.  
- 패킷은 source에서 destination까지 라우터와 링크를 한 칸씩 거치며 forwarding 된다.  
- 각 패킷은 링크 용량(R) 전부를 써서 전송된다.  
- 패킷은 차량 행렬, 라우터는 톨게이트라고 생각하면 편하다.

### 2. Store-and-Forward
- 라우터는 패킷 전체가 도착해야 다음 링크로 내보낼 수 있다.  
- 길이 L(bits) 패킷을 R(bps) 링크에 밀어내는 데 걸리는 시간이 transmission delay이다.  

```text
transmission delay = L / R
```

- 라우터 하나를 거치는 두 개의 링크라면 end-to-end delay는 2L/R이다. (propagation delay는 0으로 가정)  
- 예: L = 10 Kbits, R = 100 Mbps이면 한 hop의 transmission delay는 0.1 msec이다.  
- transmission delay는 물리 링크로 비트를 "밀어내는" 시간이고, propagation delay(전파 지연)와는 다른 개념이다.

### 3. Queueing과 Loss
- 어떤 링크로 들어오는 속도가 그 링크의 전송률을 일정 시간 넘으면 패킷은 큐에서 기다린다.  
- 라우터의 buffer가 꽉 차면 패킷은 버려진다.  
- 결국 패킷 교환에서 지연이 생기는 이유는 store-and-forward와 큐 대기 때문이다.

---

# 회선 교환 (Circuit Switching)

### 1. 기본 동작
- source와 destination 사이의 자원을 통화(call) 동안 미리 예약해 둔다.  
- 자원은 dedicated이다. 공유하지 않으므로 circuit-like한 성능이 보장된다.  
- 대신 그 call이 쓰지 않아도 circuit segment는 놀게 된다.  
- 전통적인 전화망이 이 방식이다. 전화를 걸면 회선이 잡힌다고 이해했다.

### 2. FDM과 TDM
링크 하나를 여러 circuit이 나눠 쓰는 방법이다.

| 구분 | 나누는 기준 | 전송 방식 |
|------|-------------|-----------|
| FDM (Frequency Division Multiplexing) | 주파수 | call마다 자기 narrow band를 받아 그 band의 max rate로 전송 |
| TDM (Time Division Multiplexing) | 시간 | 시간을 slot으로 나누고, call마다 주기적인 slot에서만 전송 |


---

# 두 방식의 비교

### 통계적 다중화 예시
- 1 Gb/s 링크가 있고, 사용자는 active일 때 100 Mb/s를 쓰며 시간의 10%만 active이다.  
- 회선 교환은 100 Mb/s씩 예약하므로 10명까지만 받을 수 있다.  
- 패킷 교환은 35명이 있어도 동시에 10명 넘게 active일 확률이 0.0004(0.04%)보다 작다.  
- 사용자가 항상 데이터를 보내는 게 아니라는 점을 이용한 것이다.


### 정리

| | 회선 교환 | 패킷 교환 |
|---|---|---|
| 자원 | 예약, 전용 | 공유, on-demand |
| call setup | 필요 | 불필요 |
| 성능 | 보장됨 | congestion 시 지연/손실 가능 |
| 유리한 경우 | 일정한 속도가 필요한 통신 | bursty한 데이터 |

- 패킷 교환이 압승인 건 아니다. congestion으로 지연과 loss가 생길 수 있어서 reliable data transfer와 congestion control 프로토콜이 필요하다.  
- 오디오/비디오처럼 bandwidth 보장이 필요한 경우에 회선 같은 동작을 인터넷에서 어떻게 줄 수 있을까라는 질문도 남아 있다.

---

# 마치며

인터넷이 패킷 교환을 택한 이유는 데이터가 bursty하기 때문이라고 정리할 수 있겠다.  
필요할 때만 자원을 쓰니 같은 링크로 더 많은 사용자를 받을 수 있고, 그 대가로 지연과 loss를 감수한다.  
처음엔 L/R 계산이 단순해 보였는데 store-and-forward가 붙으니 hop마다 L/R이 더해진다는 점이 헷갈렸다. 나중에 다시 계산해봐야겠다.  
다음에는 지연의 네 가지 원인(processing, queueing, transmission, propagation)이나 Internet structure를 정리해볼 생각이다.

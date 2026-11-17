---
title: "What is the Internet & Protocol"
date: "2026-10-31"
category: "Computer Network"
tags:
  - NW
summary: "인터넷을 보는 두 가지 관점과 프로토콜, 인터넷 구조 개요 정리"
draft: false
---
# 개요

인터넷이란 무엇일까? 매일 쓰는데 막상 정의하려고 하면 말문이 막힌다.  
이번에는 인터넷을 두 가지 관점(nuts and bolts, service)에서 정리해보려 한다.  
그리고 모든 통신을 지배하는 프로토콜과 edge/access/core로 나눈 인터넷 구조를 훑어본다.

---

# 부품으로 본 인터넷 ("nuts and bolts" view)

nuts and bolts는 나사와 볼트, 즉 부품이라는 뜻이다.  
이름 그대로 인터넷을 구성요소로 설명하는 관점이다.

### 1. 구성요소


| 구성요소                  | 설명                         | 예시                              |
| --------------------- | -------------------------- | ------------------------------- |
| hosts (= end systems) | edge에서 네트워크 앱을 실행하는 장치     | PC, 스마트폰, 서버                    |
| packet switches       | 패킷(데이터 chunk)을 forwarding  | router, switch                  |
| communication links   | 장치들을 잇는 연결                 | fiber, copper, radio, satellite |
| networks              | 한 조직이 관리하는 장치, 라우터, 링크의 묶음 | home, enterprise network        |


- host라는 이름은 애플리케이션 프로그램을 host(실행)한다는 데서 왔다.
- 링크의 전송률(transmission rate)을 bandwidth라고 한다.
- 패킷은 차량행렬, 스위치는 톨게이트라고 비유할 수 있다.

### 2. Network of networks와 표준

- 인터넷은 서로 연결된 ISP들의 집합, 즉 "network of networks"이다.
- 그 위의 모든 메시지 송수신은 프로토콜이 제어한다. ex) HTTP, TCP, IP, WiFi, Ethernet
- 인터넷 표준은 IETF가 만들고, 그 표준 문서를 RFC(Request for Comments)라고 한다.
- Ethernet, WiFi 같은 LAN 쪽 표준은 IEEE 802 위원회가 정한다.

---

# 서비스로 본 인터넷 ("service" view)

같은 인터넷을 애플리케이션 입장에서 보는 관점이다.

### 1. 애플리케이션에 서비스를 제공하는 인프라

- Web, 스트리밍, 이메일, 게임 등이 인터넷 서비스 위에서 돌아간다.
- 이런 앱은 end system에서만 실행되고, packet switch에서는 실행되지 않는다.

### 2. Programming interface (socket)

- 앱이 인터넷의 transport service에 "연결"할 수 있게 해주는 hook을 제공한다.
- 개발자는 "어떤 서버"로 "어떤 패킷"을 "어떻게 보낼지"에만 신경 쓰면 된다. 이게 socket 인터페이스다.


|       | nuts and bolts view     | service view   |
| ----- | ----------------------- | -------------- |
| 초점    | 무엇으로 이루어져 있나            | 무엇을 제공하나       |
| 등장 요소 | host, switch, link, ISP | 애플리케이션, socket |


---

# 프로토콜 (Protocol)

### 1. 사람의 프로토콜과 네트워크 프로토콜

- 사람도 "몇 시예요?" 같은 정해진 메시지를 주고받고, 답을 받으면 정해진 행동을 한다.
- 네트워크 프로토콜은 그 주체가 사람이 아니라 장치라는 점만 다르다.

### 2. 정의

프로토콜은 네트워크 개체들 사이에서 주고받는 메시지의 세 가지를 정한다.  

- **format**: 메시지의 형식
- **order**: 메시지를 주고받는 순서
- **action**: 메시지를 보내거나 받았을 때 하는 행동

### 3. 예시

사람의 대화와 웹 요청을 나란히 놓으면 구조가 똑같다.

```text
[사람]                     [컴퓨터]
A -> B : Hi                client -> server : TCP connection request
B -> A : Hi                server -> client : TCP connection response
A -> B : Got the time?     client -> server : GET <URL>
B -> A : 2:00              server -> client : <file>
```

- 연결 요청에 응답이 와야 GET을 보낸다. "Hi"에 "Hi"로 답이 와야 시간을 묻는 것과 같다.

---

# 인터넷 구조 한눈에 보기

```text
[Network edge]      host (client, server)
        |
[Access network]    유선/무선 링크 (physical media)
        |
[Network core]      서로 연결된 router들
```

### 1. Network edge

- host들이 있는 가장자리. client와 server로 나뉘고, server는 주로 data center에 있다.

### 2. Access networks, physical media

- host를 edge router에 연결하는 유선/무선 링크로, 사용자가 실제로 가장 관심을 갖는 부분이다.
- 기업/가정은 DSL, Cable, FTTH, Ethernet, Wi-Fi, 광역은 3G, LTE, 5G 등이 있다.

### 3. Network core

- 서로 연결된 router들의 mesh로, 패킷 교환과 지연, routing 등을 여기서 다룬다.

---

# 마치며

인터넷은 부품으로 보면 network of networks이고, 서비스로 보면 앱에 socket이라는 창구를 열어 둔 인프라이다.  
그 통신을 굴러가게 하는 게 format, order, action을 정한 프로토콜이다.  
앞으로 나올 HTTP, TCP, IP가 전부 이 정의의 구체적인 예라고 생각하면 생각보다 중요한 부분 같다.  
다음에는 access network(DSL, Cable, FTTH 등)와 physical media를 정리해볼 생각이다.
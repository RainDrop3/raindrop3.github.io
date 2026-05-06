---
title: "PL Introduction"
date: "2026-05-06"
category: "Programming Language"
tags:
  - PL
summary: "프로그래밍언어론에 대해"
draft: false
---

# 서론

프로그래밍언어론은 프로그래밍 언어가 어떻게 설계되고, 어떻게 구현되며, 어떤 철학을 가지고 있는지를 공부하는 학문이다.  
단순히 특정 언어 하나가 아닌, 수많은 언어들이 공유하는 언어 설계의 기본 원칙/원리/구조 등을 파악할 수 있다.  
컴파일러나 프로그래밍 언어 제작을 하기 위해 반드시 선행되어야 할 지식이다.  
이 블로그에선 Robert W. Sebesta의 [Concepts of Programming Languages] 를 기준으로 글을 작성하고자 한다.

---

# 본론1: 목차

해당 서적은 총 16개의 챕터로 이루어져있는데, 직관적인 이해를 위해 이를 다시 5개의 큰 파트로 구분해보았다.
### Part 1: 배경 및 기초

- Chp 1. Preliminaries
  - 프로그래밍 언어를 평가하는 기준(가독성, 작성력, 신뢰성, 비용 등)과 언어 구현 방식(컴파일, 인터프리터, 하이브리드) 등 기초 개념
- Chp 2. Evolution of the Major Programming Languages
  - Fortran부터 C, Java, Python 등 주요 언어들의 탄생 배경과 발전 역사, 각 언어가 프로그래밍 역사에 남긴 기여

### Part 2: 언어의 구조적/의미적 번역

- Chp 3. Describing Syntax and Semantics
  - 프로그래밍 언어의 문법 구조(Syntax)를 체계적으로 정의하는 방법(BNF, EBNF)과 코드가 가지는 의미(Semantics)를 설명하는 방법
- Chp 4. Lexical and Syntax Analysis
  - 컴파일러가 우리가 작성한 소스 코드를 어떻게 토큰으로 쪼개고(Lexical), 문법 구조를 Parse Tree로 만들어내는지(Syntax) 핵심 원리

### Part 3: 데이터와 메모리, 제어

- Chp 5. Names, Bindings, and Scopes
  - 변수명, 메모리 주소 할당(바인딩), 변수의 생명주기(Lifetime), 그리고 변수가 유효한 범위(정적/동적 스코프)
- Chp 6. Data Types
  - 원시 타입부터 문자열, 배열, 연관 배열(해시), 포인터, 레코드(구조체) 등 다양한 데이터 타입의 설계 이슈와 구현 방법
- Chp 7. Expressions and Assignment Statements
  - 연산자 우선순위, 결합 법칙, 단락 평가 및 할당문이 동작하는 원리
- Chp 8. Statement-Level Control Structures
  - 조건문과 반복문같은 프로그램 실행 흐름을 제어하는 구조의 설계와 논리

### Part 4: 서브프로그램과 객체지향

- Chp 9. Subprograms
  - 함수, 메서드, 프로시저의 특징과 매개변수 전달 방식의 차이
- Chp 10. Implementing Subprograms
  - 함수가 호출될 때 메모리의 Call Stack과 Activation Record에서 실제로 어떤 일들이 일어나는지, 즉 구현의 low level
- Chp 11. Abstract Data Types and Encapsulation Constructs
  - 데이터 정보 은닉과 모듈화를 위한 캡슐화 구조
- Chp 12. Support for Object-Oriented Programming
  - 상속, 동적 바인딩, 다형성 등 객체지향 패러다임을 언어 차원에서 어떻게 지원하는지 분석

### Part 5: 고급 기능 및 여러 패러다임

- Chp 13. Concurrency
  - 스레드, 세마포어, 모니터 등 멀티스레드 환경에서의 동시성 제어와 동기화 기법
- Chp 14. Exception Handling and Event Handling
  - 런타임 오류나 예외 상황을 안전하게 처리하는 언어적 메커니즘
- Chp 15. Functional Programming Languages
  - 부작용 없는 수학적 함수 기반의 프로그래밍 패러다임
- Chp 16. Logic Programming Languages
  - 규칙과 사실을 기반으로 논리적 추론을 통해 문제를 해결하는 패러다임

---

# 본론2: PL을 통해 얻고자 하는 것

CA, OS 등의 분야를 공부하다가 PL을 접하면 이걸 왜 하는거지 하는 생각이 들곤 한다.  
그래서 이 기회에 이 과목의 궁극적인 목표를 정리해보았다.

### 1. 새로운 언어에 대한 학습 속도 향상
- 모든 언어는 결국 이 과목에서 배운 원리에 기반하여 설계된다.  
따라서 근본적인 원리를 잘 알고 있다면 새로운 언어를 학습하는 속도 역시 빨라질 수 있다.

### 2. 프로젝트에 적합한 언어 선택 능력
- 개발하려는 플랫폼/시스템의 특성에 따라 각 언어의 장단을 비교/평가해 가장 적절한 언어/아키텍처를 고르는 안목을 기를 수 있다.

---

# 결론

본론2를 적고보니 생각보다 내용이 빈약한 것 같다. 다만, 이는 내가 아직 PL을 완전히 배우지 않았다는 점과 나의 인사이트가 아직 부족해서라고 생각한다.  

처음 배우기 시작할 때는 이걸 왜 하지 하는 생각을 자주 했는데, 아직 완전히 없어지진 않지만 그래도 나름의 흥미가 생기고 있는 것 같긴 하다.  
PL과 관련한 글이 쌓이면서 점점 그 이유/의미와 재미를 찾아갈 수 있었으면 좋겠다.  

다음 글은 아마 Chp1 또는 Chp3로 시작할 것 같다.
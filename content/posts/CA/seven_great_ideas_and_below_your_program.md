---
title: "Seven Great Ideas와 Below Your Program"
date: "2026-11-26"
category: "Computer Architecture"
tags:
  - CA
summary: "컴퓨터 구조의 7가지 핵심 아이디어와 프로그램 아래 계층 정리"
draft: false
---

# 개요

컴퓨터 구조에서 하는 설계들은 결국 무엇을 노리는 걸까?  
교재 1장은 그 답을 Seven Great Ideas라는 7가지 아이디어로 먼저 보여준다.  
이번 글에서는 이 7가지와, 내가 짠 프로그램 아래에 어떤 계층이 있는지를 정리해보려 한다.

---

# Seven Great Ideas

지난 60여 년간 컴퓨터 설계자들이 만든 아이디어 중 지금까지 계속 쓰이는 7가지이다.

### 1. Use Abstraction to Simplify Design
- 설계를 여러 수준으로 나누고, 아래 수준의 세부사항은 숨긴다.
- 이전 글에서 ISA를 ADT처럼 생각했었는데, 그게 바로 abstraction이다.

### 2. Make the Common Case Fast
- 드문 경우보다 자주 일어나는 경우를 빠르게 하는 게 전체 성능에 더 효과적이다.
- 단, 무엇이 common case인지는 측정해봐야 안다.

### 3. Performance via Parallelism
- 여러 연산을 동시에 수행해서 성능을 얻는다.

### 4. Performance via Pipelining
- parallelism의 한 패턴인데, 워낙 자주 쓰여서 따로 이름이 붙었다.

### 5. Performance via Prediction
- 확실히 알 때까지 기다리지 않고, 추측해서 먼저 실행한다.
- 예측이 꽤 정확하고 틀렸을 때 복구 비용이 작다면 평균적으로 더 빠르다.

### 6. Hierarchy of Memories
- 빠르고, 크고, 싼 메모리를 동시에 얻을 수는 없다.
- 위쪽엔 작고 빠르고 비싼 메모리, 아래쪽엔 크고 느리고 싼 메모리를 둔다.
- cache 덕분에 메모리가 위쪽만큼 빠르고 아래쪽만큼 큰 것처럼 보인다.

### 7. Dependability via Redundancy
- 고장에 대비해 여분의 부품을 두고, 고장 나면 대신 동작하게 한다.

+) 원래는 "Designing for Moore's Law"까지 8개였는데, Moore's Law가 더 이상 맞지 않게 되면서 빠졌다고 한다.

---

# Below Your Program

하드웨어는 아주 단순한 low-level 명령어만 실행할 수 있다.  
그래서 복잡한 응용 프로그램과 하드웨어 사이에 여러 소프트웨어 계층이 있다.  
이것도 결국 abstraction의 한 예이다.

| 계층 | 구성 | 역할 |
|---|---|---|
| Application software | 응용 프로그램 | high-level language로 작성 |
| Systems software | Compiler, OS | 응용과 하드웨어 사이에서 번역·관리 |
| Hardware | Processor, Memory, I/O controller | 실제 명령어 실행 |

- Compiler: high-level language 코드를 machine code로 번역한다.
- Operating System: 입출력 처리, 메모리·저장공간 관리, task scheduling과 자원 공유를 맡는다.

---

# Levels of Program Code

| 수준 | 특징 |
|---|---|
| High-level language | 문제 영역에 가까운 추상화, 생산성과 이식성 제공 |
| Assembly language | 명령어를 사람이 읽을 수 있는 텍스트로 표현 |
| Hardware representation | bit로 인코딩된 명령어와 데이터 |

### 1. 번역 과정
C의 swap 함수가 RISC-V 기계어가 되는 과정이다.
```text
[High-level language (C)]
swap(int v[], int k)
{int temp;
    temp = v[k];
    v[k] = v[k+1];
    v[k+1] = temp;
}
        ↓ Compiler
[Assembly language (RISC-V)]
swap:
    slli x6, x11, 3
    add  x6, x10, x6
    ld   x5, 0(x6)
    ld   x7, 8(x6)
    sd   x7, 0(x6)
    sd   x5, 8(x6)
    jalr x0, 0(x1)
        ↓ Assembler
[Machine language (RISC-V)]
00000000001101011001001100010011
00000000011001010000001100110011
00000000000000110011001010000011
00000000100000110011001110000011
00000000011100110011000000100011
00000000010100110011010000100011
00000000000000001000000001100111
```
- C 코드 3줄이 RISC-V 명령어 7개가 된다.
- 컴파일러에 따라 assembly 단계 없이 바로 기계어를 만들기도 한다.

### 2. 이전 글과 연결
두 번째 줄 `add x6, x10, x6`을 이전 글의 R-format대로 쪼개보면 다음과 같다.
```text
funct7  | rs2   | rs1   | funct3 | rd    | opcode
0000000 | 00110 | 01010 | 000    | 00110 | 0110011
        | (x6)  | (x10) |        | (x6)  |
```
assembler가 하는 일은 결국 이 format대로 bit를 채워 넣는 것이다.

---

# 마치며

Seven Great Ideas는 처음 보면 당연한 말 7개를 나열한 것 같다.  
그런데 cache, pipeline처럼 앞으로 배울 내용 대부분이 여기 들어간다는 점에서 일종의 목차 같다.  
Below Your Program을 보면서는 이전에 정리한 instruction format이 어느 계층에 있는지 위치가 잡혔다.  
다음에는 1장의 나머지 핵심인 성능, 그 중에서도 CPU Time과 CPI를 정리해볼 생각이다.

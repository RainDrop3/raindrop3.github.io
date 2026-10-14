---
title: "RISC-V instruction format"
date: "2026-04-29"
category: "Computer Architecture"
tags:
  - CA
summary: "ISA의 개념과 RISC-V의 instruction format에 대해"
draft: false
---

# 서론


컴퓨터는 0과 1만 알아들을 수 있다고들 한다. 그런데 나는 컴퓨터에게 0과 1로 명령한 적이 없다.
컴퓨터는 어셈블리 명령어를 어떻게 binary로 변환할까? 변환 규칙이 있을까?  
이번에는 CISC/RISC 비교 및 ISA 3가지를 알아보고, 그 중 RISC-V의 instruction format에 대해 정리해보려 한다.

---

# 본론1: CISC vs RISC
둘은 CPU가 명령어를 처리하는 방식에 따른 핵심 철학이다.
### 1. CISC
- Complex Instruction Set Computer  
- Complex가 이름에 붙은 만큼, 명령어 종류가 복잡하고 많다.
- 메모리에 직접 접근이 가능하여 레지스터 의존도가 적다.
- 하나의 명령어로 최대한 많은 작업을 수행하고자 한다.
- 하드웨어 설계가 복잡하고 전력 소모가 크다.
- x86 등
### 2. RISC
- Reduced Instruction Set Computer
- Reduced가 이름에 붙은 만큼, 명령어가 적고 단순하다.
- 명령어 실행 시간이 일정하여 파이프라이닝 최적화에 유리하다.
- 복잡한 작업을 위해서는 여러 명령어가 필요하다.
- 하드웨어 구조가 간결하고 전력 소모가 적다.
- ARM 등
---

# 본론2: ISA
ISA(Instruction Set Architecture)는 소프트웨어와 하드웨어 사이의 설계규격이다.  
나는 ISA를 마치 자료구조 ADT(Abstract Data Type)로 생각하니까 쉽게 이해할 수 있었다.  
ISA는 다음의 요소들을 포함하는 개념이다.  
- Instruction Set: 명령어의 종류와 binary로의 변환 format 정의
- Data Types: 정수, 부동소수점 등을 몇 bit로 처리할 지 정의
- Registers: 레지스터의 개수와 크기 정의
- Addressing Modes: 메모리의 데이터에 접근할 때 주소 계산 규칙 정의
- Exceptions & Interrupts: 예외,인터럽트에 대한 CPU의 반응 규칙 정의

ISA의 종류에는 x86, ARM, RISC-V 등이 있다.  
x86은 CISC기반, ARM과 RISC-V는 RISC기반이다. 따라서 x86은 주로 컴퓨터, 서버 등에 사용되고
ARM은 주로 모바일, 임베디드, IoT 등에 사용된다.  

RISC-V는 x86,ARM과 다르게 오픈소스여서 누구나 이를 이용해 칩을 설계해볼 수 있다.  
따라서 이 글과 앞으로의 CA관련 글 대부분에서 RISC-V를 기준으로 설명할것이다.  

---

# 본론3: RISC-V Instruction Format
RISC-V는 하드웨어의 복잡도를 최소화하기 위해 명령어 포맷을 규칙적으로 설계하였다.  
이 포맷은 `add`같은 명령어를 binary로 변환하는 규칙/규격을 의미한다.  
모든 기본 명령어는 32비트이고, 크게 6가지 기본 포맷이 있다.
### 0. field
format은 다음의 field들로 구성되어 있다.

| field  | description                            |
|--------|----------------------------------------|
| opcode | operation code                         |
| rd     | destination register number            |
| funct3 | 3-bit function code(additional opcode) |
| rs1    | the first source register number       |
| rs2    | the second source register number      |
| funct7 | 7-bit function code(additional opcode) |

### 1. R-format
![R-type.png](/images/ISA_and_RISC-V_inst_format/R-format.png)
ex) `add`, `sub`, `or`, `sll`...
 
 ### 2. I-format
![img.png](/images/ISA_and_RISC-V_inst_format/I-format.png)
ex) `addi`, `lw`...   
 +) immediate field는 상수 또는 offset으로 사용된다.
 
 ### 3. S-format
![img.png](/images/ISA_and_RISC-V_inst_format/S-format.png)
ex) `sw`...
 
 ### 4. B-format
![img.png](/images/ISA_and_RISC-V_inst_format/SB-format.png)
ex) `beq`, `bne`...
 
 ### 5. J-format
![img.png](/images/ISA_and_RISC-V_inst_format/UJ-format.png)
ex) `jal`...

### 6. U-format
```text
imm(20bits) | rd(5bits) | opcode(7bits)
```
ex) `lui`...

---

# 마치며
사실 현대의 아키텍처들은 CISC나 RISC중 하나를 택하는것이 아니라 둘을 적절히 섞어서
같이 사용한다고 한다. 예를 들어 x86은 겉으로 볼 땐 CISC이지만 내부적으로 명령어를 쪼개서
RISC처럼 동작한다.

막상 글을 쓰고 보니 Instruction format보단 CISC/RISC, ISA의 분량이 더 많아진 것 같다.  
사실 Imm field의 sign extend나 register종류, instrution 사용 형식 등
적을 만한 내용은 더 많으나 슬슬 잠이 와서 그만 적어야겠다. 지금 1:20인데 내일 1교시 수업이기도 하고..  

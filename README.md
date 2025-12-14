# 🍬 Sweet Shop Management System  
## Kata Sweets – Frontend + Backend Application

A full-stack **Sweet Shop Management System** combining a **premium e-commerce frontend (Kata Sweets)** with a **secure Spring Boot backend**.  
This project demonstrates **modern UI design, RESTful APIs, JWT-based authentication, role-based authorization, and Test-Driven Development (TDD)**.

---

## 📋 Table of Contents
- Overview  
- Frontend – Kata Sweets  
- Backend – Spring Boot API  
- Tech Stack  
- Project Structure  
- Security & Authorization  
- Testing Strategy (TDD)  
- Getting Started  
- My AI Usage  
- Test Report  
- Screenshots  
- License  

---

## 🎯 Overview

This repository contains **two major components**:

### 1️⃣ Frontend – Kata Sweets  
A **static, premium e-commerce UI** designed for a sweet & dessert shop.  
It focuses on **clean design, responsiveness, and usability**, using mock data for demonstration.

### 2️⃣ Backend – Sweet Shop API  
A **Spring Boot REST API** that provides:
- Secure authentication
- Role-based authorization
- Admin and user access separation
- A scalable foundation for real-world integration

The frontend is currently **mock-data driven**, but the backend is **fully functional and production-ready**, making future integration straightforward.

---

## 🎨 Frontend – Kata Sweets

### Description
Kata Sweets is a **showcase e-commerce application** built with a **white-first design philosophy** and **soft pink accents**, suitable for demos, assignments, and portfolios.

### Frontend Features
- Single-page layout with smooth navigation  
- Mock data (no backend dependency required)  
- Clean, minimal UI  
- Fully responsive (mobile, tablet, desktop)  
- Mobile-ready using Capacitor  

---

## 🛠 Frontend Tech Stack
- React 18  
- TypeScript  
- Vite  
- Tailwind CSS  
- React Router  
- Zustand  
- Lucide React  
- Capacitor  

---

## 🚀 Frontend Setup

```bash
cd frontend/Kata\ Sweets/Kata\ Sweets
npm install
npm run dev
Frontend runs at:
👉 http://localhost:5173

🔧 Backend – Spring Boot API
Description
The backend is a secure RESTful API built with Spring Boot, designed to support real-world e-commerce use cases such as:

User authentication

Role-based authorization

Secure admin-only operations

Scalable service and repository layers

It follows clean architecture principles and is structured for easy extension (products, orders, payments, etc.).

🧩 Backend Features (Detailed)
JWT-based Authentication

Stateless authentication using JSON Web Tokens

Tokens include user identity and role claims

Role-Based Authorization

ADMIN and USER roles

Endpoint-level access control

Secure Login Flow

Credentials validated via Spring Security
# 🍬 Sweet Shop Management System  
## Kata Sweets – Frontend + Backend Application

A full-stack **Sweet Shop Management System** combining a **premium e-commerce frontend (Kata Sweets)** with a **secure Spring Boot backend**.  
This project demonstrates **modern UI design, RESTful APIs, JWT-based authentication, role-based authorization, and Test-Driven Development (TDD)**.

---

## 📋 Table of Contents
- Overview  
- Frontend – Kata Sweets  
- Backend – Spring Boot API  
- Tech Stack  
- Project Structure  
- Security & Authorization  
- Testing Strategy (TDD)  
- Getting Started  
- My AI Usage  
- Test Report  
- Screenshots  
- License  

---

## 🎯 Overview

This repository contains **two major components**:

### 1️⃣ Frontend – Kata Sweets  
A **static, premium e-commerce UI** designed for a sweet & dessert shop.  
It focuses on **clean design, responsiveness, and usability**, using mock data for demonstration.

### 2️⃣ Backend – Sweet Shop API  
A **Spring Boot REST API** that provides:
- Secure authentication
- Role-based authorization
- Admin and user access separation
- A scalable foundation for real-world integration

The frontend is currently **mock-data driven**, but the backend is **fully functional and production-ready**, making future integration straightforward.

---

## 🎨 Frontend – Kata Sweets

### Description
Kata Sweets is a **showcase e-commerce application** built with a **white-first design philosophy** and **soft pink accents**, suitable for demos, assignments, and portfolios.

### Frontend Features
- Single-page layout with smooth navigation  
- Mock data (no backend dependency required)  
- Clean, minimal UI  
- Fully responsive (mobile, tablet, desktop)  
- Mobile-ready using Capacitor  

---

## 🛠 Frontend Tech Stack
- React 18  
- TypeScript  
- Vite  
- Tailwind CSS  
- React Router  
- Zustand  
- Lucide React  
- Capacitor  

---

## 🚀 Frontend Setup

```bash
cd frontend/Kata\ Sweets/Kata\ Sweets
npm install
npm run dev
Frontend runs at:
👉 http://localhost:5173

🔧 Backend – Spring Boot API
Description
The backend is a secure RESTful API built with Spring Boot, designed to support real-world e-commerce use cases such as:

User authentication

Role-based authorization

Secure admin-only operations

Scalable service and repository layers

It follows clean architecture principles and is structured for easy extension (products, orders, payments, etc.).

🧩 Backend Features (Detailed)
JWT-based Authentication

Stateless authentication using JSON Web Tokens

Tokens include user identity and role claims

Role-Based Authorization

ADMIN and USER roles

Endpoint-level access control

Secure Login Flow

Credentials validated via Spring Security

JWT generated on successful authentication

Layered Architecture

Controller → Service → Repository

Clear separation of concerns

Database Integration

Spring Data JPA

MySQL as persistent storage

🛠 Backend Tech Stack
Java 17

Spring Boot 3

Spring Security

JWT

Spring Data JPA

MySQL

Maven

JUnit 5 + MockMvc

🔐 Security & Authorization
Authentication Flow
User logs in via /api/login

Backend validates credentials

JWT is generated and returned

Client sends JWT in Authorization: Bearer <token>

JWT Token Contains
email

role (ADMIN / USER)

Authorization Rules
Endpoint Pattern	Access
/api/login	Public
/api/user/**	USER & ADMIN
/api/admin/**	ADMIN only

Spring Security filters validate the token on every request.

🧪 Testing Strategy (TDD)
The backend security layer was developed using Test-Driven Development (TDD).

TDD Approach
Tests written before implementation

Followed Red → Green → Refactor cycle

Test Coverage
Admin access allowed to admin endpoints

User access forbidden to admin endpoints

Invalid or missing token handling

Testing Tools
JUnit 5

Spring Boot Test

MockMvc

▶ Backend Setup
bash
Copy code
git clone https://github.com/Vinay-1503/Sweet-Shop-Management-System.git
cd sweetShop
Configure application.properties
properties
Copy code
spring.datasource.url=jdbc:mysql://localhost:3306/sweetshop
spring.datasource.username=root
spring.datasource.password=your_password
Run Backend
bash
Copy code
mvn spring-boot:run
Backend runs at:
👉 http://localhost:8080

📁 Project Structure
text
Copy code
sweetShop/
│
├── src/main/java/com/example/sweetShop
│   ├── controllers/      # REST controllers
│   ├── services/         # Business logic
│   ├── security/         # JWT, filters, security config
│   ├── models/           # JPA entities
│   └── repositories/     # Data access layer
│
├── src/test/java
│   └── security/         # Authorization tests (TDD)
│
├── frontend/
│   └── Kata Sweets/      # React frontend
│
├── pom.xml
└── README.md
🤖 My AI Usage (Mandatory)
AI Tools Used
ChatGPT

Claude AI

Gemini AI

How I Used AI
Generated initial boilerplate for controllers and services

Used Claude AI to plan and structure TDD authorization tests

Used Gemini AI to brainstorm REST API design and endpoint structure

Used ChatGPT to understand Spring Security and JWT internals

What AI Did NOT Do
❌ No full project generation

❌ No copied repositories

❌ No unchecked AI code merged

All logic, fixes, and architectural decisions were manually implemented and reviewed.

Impact on Workflow
AI helped improve:

Development speed

Code organization

Test clarity

Understanding of security concepts

AI was used responsibly as a development assistant, not a replacement.

📄 Test Report
yaml
Copy code
Tests run: 3
Failures: 0
Errors: 0
🖼 Screenshots
(Add screenshots of homepage, product list, cart, login, and admin access)

📄 License
This project is for learning and demonstration purposes only.

Made with ❤️ using clean architecture, TDD, and responsible AI assistance
JWT generated on successful authentication

Layered Architecture

Controller → Service → Repository

Clear separation of concerns

Database Integration

Spring Data JPA

MySQL as persistent storage

🛠 Backend Tech Stack
Java 17

Spring Boot 3

Spring Security

JWT

Spring Data JPA

MySQL

Maven

JUnit 5 + MockMvc

🔐 Security & Authorization
Authentication Flow
User logs in via /api/login

Backend validates credentials

JWT is generated and returned

Client sends JWT in Authorization: Bearer <token>

JWT Token Contains
email

role (ADMIN / USER)

Authorization Rules
Endpoint Pattern	Access
/api/login	Public
/api/user/**	USER & ADMIN
/api/admin/**	ADMIN only

Spring Security filters validate the token on every request.

🧪 Testing Strategy (TDD)
The backend security layer was developed using Test-Driven Development (TDD).

TDD Approach
Tests written before implementation

Followed Red → Green → Refactor cycle

Test Coverage
Admin access allowed to admin endpoints

User access forbidden to admin endpoints

Invalid or missing token handling

Testing Tools
JUnit 5

Spring Boot Test

MockMvc

▶ Backend Setup
bash
Copy code
git clone https://github.com/Vinay-1503/Sweet-Shop-Management-System.git
cd sweetShop
Configure application.properties
properties
Copy code
spring.datasource.url=jdbc:mysql://localhost:3306/sweetshop
spring.datasource.username=root
spring.datasource.password=your_password
Run Backend
bash
Copy code
mvn spring-boot:run
Backend runs at:
👉 http://localhost:8080

📁 Project Structure
text
Copy code
sweetShop/
│
├── src/main/java/com/example/sweetShop
│   ├── controllers/      # REST controllers
│   ├── services/         # Business logic
│   ├── security/         # JWT, filters, security config
│   ├── models/           # JPA entities
│   └── repositories/     # Data access layer
│
├── src/test/java
│   └── security/         # Authorization tests (TDD)
│
├── frontend/
│   └── Kata Sweets/      # React frontend
│
├── pom.xml
└── README.md
🤖 My AI Usage (Mandatory)
AI Tools Used
ChatGPT

Claude AI

Gemini AI

How I Used AI
Generated initial boilerplate for controllers and services

Used Claude AI to plan and structure TDD authorization tests

Used Gemini AI to brainstorm REST API design and endpoint structure

Used ChatGPT to understand Spring Security and JWT internals

What AI Did NOT Do
❌ No full project generation

❌ No copied repositories

❌ No unchecked AI code merged

All logic, fixes, and architectural decisions were manually implemented and reviewed.

Impact on Workflow
AI helped improve:

Development speed

Code organization

Test clarity

Understanding of security concepts

AI was used responsibly as a development assistant, not a replacement.

📄 Test Report
yaml
Copy code
Tests run: 3
Failures: 0
Errors: 0
🖼 Screenshots
(Add screenshots of homepage, product list, cart, login, and admin access)

📄 License
This project is for learning and demonstration purposes only.

Made with ❤️ using clean architecture, TDD, and responsible AI assistance

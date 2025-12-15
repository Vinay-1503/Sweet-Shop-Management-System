# 🍬 Sweet Shop Management System

## Kata Sweets – Frontend + Backend Application

A full-stack **Sweet Shop Management System** combining a **premium e-commerce frontend (Kata Sweets)** with a **secure Spring Boot backend**.

This project demonstrates **modern UI design, RESTful APIs, JWT-based authentication, role-based authorization, clean architecture, and Test-Driven Development (TDD)**.

---

## 📋 Table of Contents

* Overview
* Frontend – Kata Sweets
* Backend – Spring Boot API
* Tech Stack
* Security & Authorization
* Testing Strategy (TDD)
* Getting Started
* Project Structure
* AI Usage Disclosure
* Test Report
* Screenshots
* License

---

## 🎯 Overview

This repository contains **two independent but complementary modules**:

### 1️⃣ Frontend – Kata Sweets

A **static, premium e-commerce UI** designed for a sweet & dessert shop.
It focuses on **visual quality, responsiveness, and user experience**, using mock data for demonstration purposes.

### 2️⃣ Backend – Sweet Shop API

A **production-ready Spring Boot REST API** that provides:

* Secure authentication
* Role-based authorization
* Clear admin vs user separation
* A scalable architecture for real-world extensions

> The frontend currently uses mock data, while the backend is fully functional and ready for real integration.

---

## 🎨 Frontend – Kata Sweets

### Description

Kata Sweets is a **showcase e-commerce application** built with a **white-first design philosophy** and **soft pastel accents**, suitable for demos, assignments, and portfolios.

### Frontend Features

* Single-page application with smooth navigation
* Mock-data driven (no backend dependency)
* Clean and minimal UI
* Fully responsive (mobile, tablet, desktop)
* Mobile-ready using Capacitor

---

## 🛠 Frontend Tech Stack

* React 18
* TypeScript
* Vite
* Tailwind CSS
* React Router
* Zustand
* Lucide React
* Capacitor

---

## 🚀 Frontend Setup

```bash
cd frontend/Kata\ Sweets/Kata\ Sweets
npm install
npm run dev
```

Frontend runs at:
👉 [http://localhost:5173](http://localhost:5173)

---

## 🔧 Backend – Spring Boot API

### Description

The backend is a **secure RESTful API** built using Spring Boot, designed to support real-world e-commerce use cases such as:

* User authentication
* Role-based authorization
* Admin-only operations
* Scalable service and repository layers

It follows **clean architecture principles** and is structured for easy future extensions (products, orders, payments, etc.).

---

## 🧩 Backend Features

### 🔐 JWT-Based Authentication

* Stateless authentication using JSON Web Tokens
* Tokens contain user identity and role claims

### 🛡 Role-Based Authorization

* Roles: `ADMIN`, `USER`
* Endpoint-level access control using Spring Security

### 🔑 Secure Login Flow

1. User logs in via `/api/login`
2. Credentials are validated by Spring Security
3. JWT token is generated and returned
4. Client sends token in `Authorization: Bearer <token>`

### 🏗 Layered Architecture

* Controller → Service → Repository
* Clear separation of concerns

### 🗄 Database Integration

* Spring Data JPA
* MySQL as persistent storage

---

## 🛠 Backend Tech Stack

* Java 17
* Spring Boot 3
* Spring Security
* JWT
* Spring Data JPA
* MySQL
* Maven
* JUnit 5
* MockMvc

---

## 🔐 Security & Authorization

| Endpoint Pattern | Access      |
| ---------------- | ----------- |
| `/api/login`     | Public      |
| `/api/user/**`   | USER, ADMIN |
| `/api/admin/**`  | ADMIN only  |

Spring Security validates the JWT token on **every request**.

---

## 🧪 Testing Strategy (TDD)

The backend security layer was developed using **Test-Driven Development (TDD)**.

* Tests written before implementation
* Followed **Red → Green → Refactor** cycle

### Test Coverage

* Admin access allowed to admin endpoints
* User access forbidden to admin endpoints
* Invalid or missing token handling

---

## ▶ Getting Started (Backend)

```bash
git clone https://github.com/Vinay-1503/Sweet-Shop-Management-System.git
cd sweetShop
```

### Configure Database

```properties
spring.datasource.url=jdbc:mysql://localhost:3306/sweetshop
spring.datasource.username=root
spring.datasource.password=your_password
```

### Run Backend

```bash
mvn spring-boot:run
```

Backend runs at:
👉 [http://localhost:8080](http://localhost:8080)

---

## 📁 Project Structure

```text
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
```

---

## 🤖 AI Usage Disclosure

### AI Tools Used

* ChatGPT
* Claude AI
* Gemini AI

### Usage Policy

AI was used **only as a development assistant** for:

* Understanding Spring Security & JWT concepts
* Structuring TDD test cases
* Planning API design

❌ No full project generation
❌ No copied repositories
❌ No unchecked AI code merged

All implementation and architectural decisions were **manually reviewed and written**.

---

## 📄 Test Report

```yaml
Tests run: 3
Failures: 0
Errors: 0
```

---

## 🖼 Screenshots

(Add screenshots of homepage, product list, cart, login, and admin access)

---

## 📄 License

This project is for **learning and demonstration purposes only**.

---

**Made with ❤️ using clean architecture, Test-Driven Development (TDD), and responsible AI assistance.**

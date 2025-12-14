Sweet Shop Management System

Backend + Frontend Integration (Kata Sweets)

A full-stack Sweet Shop Management System built with Spring Boot (Backend) and React + TypeScript (Frontend).
This project demonstrates secure role-based authentication, RESTful APIs, and a modern premium e-commerce UI.

📌 Overview

This repository contains:

Backend: Spring Boot REST API with JWT-based authentication & authorization

Frontend: Kata Sweets premium e-commerce UI (static showcase)

Security: Role-based access for ADMIN and USER

Testing: Authorization tests written using TDD approach

🛠 Tech Stack
Backend

Java 17

Spring Boot 3

Spring Security

JWT Authentication

Spring Data JPA

MySQL

Maven

JUnit 5 + MockMvc

Frontend

React 18

TypeScript

Vite

Tailwind CSS

Zustand

React Router

Capacitor (Mobile-ready)

📁 Project Structure
sweetShop/
│
├── src/main/java/com/example/sweetShop
│   ├── controllers/        # REST controllers
│   ├── services/           # Business logic
│   ├── security/           # JWT, filters, config
│   ├── models/             # Entities
│   └── repositories/       # JPA repositories
│
├── src/test/java
│   └── security/           # Authorization tests (TDD)
│
├── frontend/
│   └── Kata Sweets/        # React frontend
│
├── pom.xml
└── README.md

🔐 Security & Authorization

JWT-based authentication

Token contains:

email

role (ADMIN / USER)

Role-based endpoint protection:

/api/admin/** → ADMIN only

/api/user/** → USER & ADMIN

🧪 Testing Strategy (TDD)

Authorization tests written before implementation

Covers:

Admin access validation

User forbidden access to admin endpoints

Invalid token handling

Tests executed using MockMvc

🚀 Getting Started
Prerequisites

Java 17+

Node.js 18+

MySQL

Maven

Backend Setup
git clone https://github.com/Vinay-1503/Sweet-Shop-Management-System.git
cd sweetShop


Configure application.properties:

spring.datasource.url=jdbc:mysql://localhost:3306/sweetshop
spring.datasource.username=root
spring.datasource.password=your_password


Run backend:

mvn spring-boot:run

Frontend Setup
cd frontend/Kata\ Sweets/Kata\ Sweets
npm install
npm run dev


Frontend runs at:

http://localhost:5173

🖼 Screenshots

(Add screenshots of homepage, product page, cart, login)

🤖 My AI Usage (Mandatory)
AI Tools Used

ChatGPT

Claude AI

Gemini AI

How I Used AI

Generated initial boilerplate for controllers and services

Used Claude AI for Test-Driven Development (TDD) test planning

Used Gemini AI to brainstorm REST API structure

Used ChatGPT for Spring Security and JWT clarification

What AI Did NOT Do

❌ No full project generation

❌ No copied repositories

❌ No unchecked AI code merged

All logic, fixes, and architectural decisions were manually implemented.

Impact on My Workflow

AI significantly improved:

Development speed

Code organization

Test clarity

Learning efficiency

AI acted as a development assistant, not a replacement.

Ethical Use

All AI usage is:

Transparent

Reviewed

Documented

Original

📄 Test Report
Tests run: 3
Failures: 0
Errors: 0
Result: BUILD SUCCESS

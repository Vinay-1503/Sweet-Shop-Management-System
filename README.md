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

This repository contains **two major parts**:

### 1️⃣ Frontend – Kata Sweets  
A **static, premium e-commerce UI** for a sweet & dessert shop.

### 2️⃣ Backend – Sweet Shop API  
A **Spring Boot REST API** providing authentication, authorization, and admin/user access control.

The frontend is currently **mock-data driven**, but structured to integrate seamlessly with backend APIs.

---

## 🎨 Frontend – Kata Sweets

### Description
Kata Sweets is a **showcase e-commerce application** built with a clean **white-first design** and **soft pink accents**, suitable for demos and portfolios.

### Features
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
http://localhost:5173

🔧 Backend – Spring Boot API
Description

The backend provides secure REST APIs using JWT-based authentication and role-based authorization.

Features

JWT authentication

ADMIN / USER roles

Protected admin endpoints

Clean architecture (Controller → Service → Repository)

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
Authentication

Login endpoint returns JWT

Token contains:

email

role (ADMIN / USER)

Authorization Rules
Endpoint	Access
/api/admin/**	ADMIN only
/api/user/**	USER & ADMIN
/api/login	Public
🧪 Testing Strategy (TDD)

Backend security was developed using Test-Driven Development.

Test Coverage

Admin access allowed to admin endpoints

User access forbidden to admin endpoints

Invalid token handling

Tools

JUnit 5

Spring Boot Test

MockMvc

▶ Backend Setup
git clone https://github.com/Vinay-1503/Sweet-Shop-Management-System.git
cd sweetShop

application.properties
spring.datasource.url=jdbc:mysql://localhost:3306/sweetshop
spring.datasource.username=root
spring.datasource.password=your_password

Run Backend
mvn spring-boot:run


Backend runs at:
http://localhost:8080

📁 Project Structure
sweetShop/
│
├── src/main/java/com/example/sweetShop
│   ├── controllers/
│   ├── services/
│   ├── security/
│   ├── models/
│   └── repositories/
│
├── src/test/java
│   └── security/        # Authorization tests (TDD)
│
├── frontend/
│   └── Kata Sweets/     # React frontend
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

Used Claude AI to plan TDD authorization tests

Used Gemini AI to brainstorm REST API structure

Used ChatGPT to understand Spring Security & JWT flows

What AI Did NOT Do

❌ No full project generation

❌ No copied repositories

❌ No unchecked AI code merged

All logic and architectural decisions were manually implemented.

Impact on Workflow

Faster development

Better test clarity

Improved understanding of security concepts

AI acted as an assistant, not a replacement.

📄 Test Report
Tests run: 3
Failures: 0
Errors: 0

🖼 Screenshots

(Add screenshots of homepage, product page, cart, login)

📄 License

This project is for learning and demonstration purposes only

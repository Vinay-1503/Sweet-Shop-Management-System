Sweet Shop Management System
Backend + Frontend Integration (Kata Sweets)

A full-stack Sweet Shop Management System built with Spring Boot (Backend) and React + TypeScript (Frontend).
This project demonstrates secure role-based authentication, RESTful APIs, JWT authorization, and a premium e-commerce UI.

📋 Table of Contents

Overview

Frontend Application (Kata Sweets)

Backend Application

Tech Stack

Project Structure

Security & Authorization

Testing Strategy (TDD)

Getting Started

Screenshots

🤖 My AI Usage

Test Report

License

🎯 Overview

This repository contains two main parts:

1️⃣ Frontend – Kata Sweets

A static, premium e-commerce UI showcasing a sweet & dessert shop experience.

2️⃣ Backend – Sweet Shop Management System

A secure REST API providing authentication, authorization, and role-based access using JWT.

🎨 Frontend Application – Kata Sweets
Premium Sweet & Dessert E-Commerce UI

Kata Sweets is a white-first, minimal, premium e-commerce UI built for demonstration and portfolio use.

Key Characteristics

Single-page design with smooth scrolling

Static showcase (mock data, no backend dependency)

Responsive design (mobile, tablet, desktop)

Clean white + pink color palette

Mobile-ready via Capacitor

🛠 Frontend Tech Stack

React 18

TypeScript

Vite

Tailwind CSS

React Router

Zustand (state management)

Lucide React (icons)

Capacitor (mobile-ready)

🎨 Design Philosophy

✅ White-first UI (80–90% white)

✅ Pink used only for emphasis

✅ No gradients

✅ No heavy animations

❌ No gold / green themes

📁 Frontend Structure
frontend/Kata Sweets/
├── public/                 # Images & static assets
├── src/
│   ├── components/         # Reusable UI components
│   ├── pages/              # Home, Products, Cart, Login
│   ├── data/               # Mock product & banner data
│   ├── store/              # Zustand state
│   ├── hooks/              # Custom hooks
│   ├── lib/                # Utilities
│   ├── App.tsx
│   └── main.tsx
├── tailwind.config.ts
├── vite.config.ts
└── package.json

⚙️ Backend Application – Sweet Shop Management System

The backend is a Spring Boot REST API that provides:

User authentication

JWT token generation

Role-based authorization

Secure API endpoints

🛠 Backend Tech Stack

Java 17

Spring Boot 3

Spring Security

JWT Authentication

Spring Data JPA

MySQL

Maven

JUnit 5 + MockMvc

📁 Backend Structure
sweetShop/
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
├── pom.xml
└── README.md

🔐 Security & Authorization

JWT-based authentication

Token contains:

email

role (ADMIN / USER)

Protected Endpoints
Endpoint	Access
/api/admin/**	ADMIN only
/api/user/**	USER & ADMIN
/api/login	Public
🧪 Testing Strategy (TDD)

This project follows a Test-Driven Development (TDD) approach for authorization.

Tests Cover

✅ Admin access to admin endpoints

❌ User forbidden from admin endpoints

❌ Invalid token handling

Tools Used

JUnit 5

MockMvc

Spring Security Test support

🚀 Getting Started
Prerequisites

Java 17+

Node.js 18+

MySQL

Maven

Backend Setup
git clone https://github.com/Vinay-1503/Sweet-Shop-Management-System.git
cd sweetShop

Configure application.properties
spring.datasource.url=jdbc:mysql://localhost:3306/sweetshop
spring.datasource.username=root
spring.datasource.password=your_password

Run Backend
mvn spring-boot:run


Backend runs on:

http://localhost:8080

Frontend Setup
cd frontend/Kata\ Sweets/Kata\ Sweets
npm install
npm run dev


Frontend runs on:

http://localhost:5173

🖼 Screenshots

📌 Add screenshots here:

Homepage

Product listing

Cart

Login page

🤖 My AI Usage (Mandatory)

This project was developed using responsible and transparent AI assistance.

AI Tools Used

ChatGPT

Claude AI

Gemini AI

How I Used AI
Backend Development

Generated initial controller & service boilerplate

Clarified Spring Security & JWT concepts

Test-Driven Development (TDD)

Used Claude AI to plan authorization test cases first

Defined expected behaviors before implementation

API Design

Used Gemini AI to brainstorm REST API structure

What AI Did NOT Do

❌ No full project generation

❌ No copied repositories

❌ No blind code merging

All logic, fixes, and architecture decisions were manually implemented.

Impact on My Workflow

AI helped improve:

Development speed

Test clarity

Learning efficiency

AI acted as an assistant, not a replacement.

Ethical & Responsible Use

Fully transparent

Reviewed & documented

Original work only

📄 Test Report
Tests run: 3
Failures: 0
Errors: 0

📜 License

This project is for demonstration and evaluation purposes.

❤️ Final Note

Made with care for Kata Sweets
A clean, modern example of full-stack development with security & testing

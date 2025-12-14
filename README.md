Sweet Shop Management System
Backend + Frontend Integration (Kata Sweets)
A full-stack Sweet Shop Management System built with Spring Boot (Backend) and React + TypeScript (Frontend).
This project demonstrates secure role-based authentication, RESTful APIs, Test-Driven Development (TDD), and a modern premium e-commerce UI.
________________________________________
📋 Table of Contents
•	Overview
•	Tech Stack
•	Project Structure
•	Security & Authorization
•	Testing Strategy (TDD)
•	Getting Started
•	Screenshots
•	My AI Usage
•	Test Report
________________________________________
🎯 Overview
This repository contains:
•	Backend: Spring Boot REST API with JWT-based authentication & authorization
•	Frontend: Kata Sweets premium e-commerce UI (static showcase)
•	Security: Role-based access control for ADMIN and USER
•	Testing: Authorization tests written using Test-Driven Development (TDD)
The project is designed to reflect real-world enterprise practices with clean architecture and clear separation of concerns.
________________________________________
🛠 Tech Stack
🔹 Backend
•	Java 17
•	Spring Boot 3
•	Spring Security
•	JWT Authentication
•	Spring Data JPA
•	MySQL
•	Maven
•	JUnit 5 + MockMvc
🔹 Frontend
•	React 18
•	TypeScript
•	Vite
•	Tailwind CSS
•	Zustand
•	React Router
•	Capacitor (Mobile-ready)
________________________________________
📁 Project Structure
sweetShop/
│
├── src/main/java/com/example/sweetShop
│   ├── controllers/        # REST controllers
│   ├── services/           # Business logic
│   ├── security/           # JWT, filters, configs
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
________________________________________
🔐 Security & Authorization
•	JWT-based authentication
•	Token contains:
o	email
o	role (ADMIN / USER)
•	Role-based endpoint protection:
o	/api/admin/** → ADMIN only
o	/api/user/** → USER & ADMIN
•	Stateless security using Spring Security filters
________________________________________
🧪 Testing Strategy (TDD)
The backend follows a Test-Driven Development approach.
Tests cover:
•	✅ Admin access to admin endpoints
•	❌ User forbidden access to admin endpoints
•	❌ Invalid / missing token handling
Tools used:
•	JUnit 5
•	MockMvc
•	Spring Boot Test
Tests were written before implementing authorization logic, ensuring correctness and confidence.
________________________________________
🚀 Getting Started
Prerequisites
•	Java 17+
•	Node.js 18+
•	MySQL
•	Maven
________________________________________
🔧 Backend Setup
git clone https://github.com/Vinay-1503/Sweet-Shop-Management-System.git
cd sweetShop
Configure application.properties
spring.datasource.url=jdbc:mysql://localhost:3306/sweetshop
spring.datasource.username=root
spring.datasource.password=your_password
Run Backend
mvn spring-boot:run
________________________________________
🎨 Frontend Setup
cd frontend/Kata\ Sweets/Kata\ Sweets
npm install
npm run dev
Frontend runs at:
http://localhost:5173
________________________________________
🖼 Screenshots
(Add screenshots here)
•	Homepage
•	Product listing
•	Cart
•	Login
________________________________________
🤖 My AI Usage (Mandatory)
AI Tools Used
•	ChatGPT
•	Claude AI
•	Gemini AI
How I Used AI
•	Generated initial boilerplate for controllers and services
•	Used Claude AI to plan TDD authorization test cases
•	Used Gemini AI to brainstorm REST API structure
•	Used ChatGPT for Spring Security & JWT clarifications
What AI Did NOT Do
•	❌ No full project generation
•	❌ No copied repositories
•	❌ No unchecked AI code merged
All logic, fixes, and architectural decisions were manually implemented.
Impact on My Workflow
AI significantly improved:
•	Development speed
•	Code organization
•	Test clarity
•	Learning efficiency
AI acted as a development assistant, not a replacement.
Ethical Use
All AI usage is:
•	Transparent
•	Reviewed
•	Documented
•	Original
________________________________________
📄 Test Report
Tests run:     3
Failures:      0
Errors:        0
Skipped:       0


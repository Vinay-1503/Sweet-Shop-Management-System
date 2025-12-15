# Sweet Shop Management System – TDD Based Backend

This repository contains an implementation of a **Sweet Shop Management System**, developed using **Spring Boot** and following **Test-Driven Development (TDD)** principles for the backend security layer.

The application provides **JWT-based authentication**, **role-based authorization**, and a clean layered architecture suitable for real-world backend systems.

---

## 📌 Project Overview

The project consists of two parts:

* **Backend** – Fully functional Spring Boot REST API
* **Frontend** – UI-only demo application (mock data)

> TDD is applied to the **backend authentication and authorization logic**.

---

## 🔧 Backend Responsibilities

The backend exposes REST APIs to:

* Authenticate users
* Generate JWT tokens
* Authorize users based on roles
* Restrict admin-only endpoints
* Secure all protected routes using Spring Security

---

## 🔐 Authentication & Authorization

### Login Endpoint

```http
POST /api/login
```

* Validates user credentials
* Generates JWT token on successful authentication

### JWT Token Contains

* Email
* Role (`ADMIN` / `USER`)

### Authorization Rules

| Endpoint Pattern | Access      |
| ---------------- | ----------- |
| `/api/login`     | Public      |
| `/api/user/**`   | USER, ADMIN |
| `/api/admin/**`  | ADMIN only  |

Spring Security filters validate the JWT token on **every request**.

---

## 🧪 Test-Driven Development (TDD)

The security layer was implemented using **strict TDD methodology**.

### TDD Workflow Followed

* Write failing test (Red)
* Implement minimal logic (Green)
* Refactor without breaking tests (Refactor)

---

## 🧪 Test Cases

The test classes focus on validating **authentication and authorization behavior** of the backend.

### Explained Test Cases

**1. Admin Access to Admin Endpoints**
Verifies that a user with `ADMIN` role can successfully access endpoints under `/api/admin/**` when a valid JWT token is provided.

**2. User Access Denied to Admin Endpoints**
Ensures that a user with `USER` role receives `403 Forbidden` when attempting to access admin-only endpoints.

**3. Missing JWT Token Handling**
Validates that requests without a JWT token are rejected with `401 Unauthorized`.

**4. Invalid JWT Token Handling**
Ensures that malformed or tampered JWT tokens are detected and access is denied.

All tests are written **before implementation**, following strict TDD principles.

---

## 🧠 Refactoring & Improvements

During development:

* Security filters were refactored for clarity
* JWT validation logic was isolated
* Authentication providers were separated for admin and users
* Clean separation maintained between controller, service, and security layers

Refactoring was done **only after tests passed**, keeping behavior unchanged.

---

## 🧾 Regarding Commits

Commits were made **frequently** to clearly demonstrate the TDD process.

Some commits contain minimal changes to reflect:

* Adding a failing test
* Passing the test with minimal logic
* Refactoring for readability

This makes the evolution of the solution easy to review.

---

## 🖥 Frontend (Demo Mode)

The frontend is a **UI-only demonstration**:

* Login screen does **not call backend**
* Uses mock data for products and user flow
* Exists only to showcase UI and role-based screens

Backend authentication is tested independently using **API tools**.

---

## 🖼 Screenshots

### 🔐 Login Screen (UI Demo)

![Login Screen](screenshots/login.png)

* Demonstrates login UI
* No backend call from frontend

### 🍭 Product Listing Page

![Product List](screenshots/products.png)

* Mock products displayed
* Responsive UI layout

### 🗄 Database – Users Table

![Database Users](screenshots/database-users.png)

* Shows stored users and roles
* Used by backend authentication logic

---

## 🛠 Tech Stack

**Backend**

* Java 17
* Spring Boot 3
* Spring Security
* JWT
* Spring Data JPA
* MySQL
* JUnit 5
* MockMvc

**Frontend**

* React
* TypeScript
* Tailwind CSS

---

## 📁 Project Structure

```text
sweetShop/
│
├── src/main/java/com/example/sweetShop
│   ├── controllers/        # REST controllers (login, user, admin)
│   ├── services/           # Business logic layer
│   ├── security/           # JWT provider, filters, security config
│   ├── models/             # JPA entities (User, Sweet, etc.)
│   └── repositories/       # Data access layer
│
├── src/test/java/com/example/sweetShop
│   └── security/           # Security & authorization tests (TDD)
│       ├── AdminAccessTest.java
│       ├── UserAccessTest.java
│       └── JwtValidationTest.java
│
├── frontend/               # UI-only demo frontend
├── screenshots/            # README screenshots
│   ├── login.png
│   ├── products.png
│   └── database-users.png
│
├── pom.xml
└── README.md
```

---

## 📊 Test Report

```yaml
Tests run: 3
Failures: 0
Errors: 0
```

---

## 📚 References

* The Three Laws of TDD – Robert C. Martin
* Spring Security Documentation
* JWT Specification (RFC 7519)

---

## 🙏 Thank You

This project was built to demonstrate **clean backend design**, **secure authentication**, and **practical application of Test-Driven Development**.

---

**Built using Test-Driven Development (TDD) with clean architecture and responsible use of AI assistance.**

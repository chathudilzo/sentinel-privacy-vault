# 🛡️ Sentinel Vault

> A high-performance, policy-driven distributed privacy vault built for enterprise microservice architectures.

Welcome to **Sentinel Vault**. I built this system to demonstrate how modern, decoupled architectures can handle secure file processing at scale. Whether it's managing proprietary enterprise documents, or securing microfinance data, this architecture ensures that every byte is verified against a centralized policy engine before it ever hits a hard drive.

---

## 🏗️ The Architecture 

This is a distributed ecosystem. Sentinel Vault operates on a four pillar architecture, ensuring that file streaming, business logic, user interface, and client access are entirely decoupled.

1. **The Engine (Go / Port 8080):** 
   A high-speed microservice dedicated exclusively to handling multipart file streams. It intercepts incoming uploads and holds them in memory while verifying permissions.
   <img width="1387" height="624" alt="Screenshot 2026-05-04 032557" src="https://github.com/user-attachments/assets/ac90a43c-4c96-4283-a916-c4532c1fb0f1" />

2. **The Brain (Java Spring Boot / Port 9090):** 
   The central authority. It maintains the security policies, issues RESTful response (APPROVE/DENY) to the Go Engine, and permanently records every interaction into the audit log.
   
3. **The Face (Next.js & Tailwind / Port 3000):** 
   A secure, server side rendered Admin Command Center. It utilizes React Server Actions to interact with the Java policy engine, featuring a real time Live Security Feed.
   <img width="1646" height="843" alt="Screenshot 2026-05-04 103119" src="https://github.com/user-attachments/assets/3a3d2b85-18de-46e1-a4bc-ef8d3c154849" />



5. **The Client (Flutter Mobile App):**
   A cross platform mobile dropzone featuring the MVVM architecture (Provider) and secure environment variable management. It allows field testing and mobile first data uploads directly to the Go Engine.
<p align="center">
  <img alt="Vault Screen 1" src="https://github.com/user-attachments/assets/f60c6410-5088-4ae1-a379-e706b4d7a8dc" width="30%" />
  <img alt="Vault Screen 2" src="https://github.com/user-attachments/assets/c8c82d4f-0ec5-4b56-9859-cd07ac4aa54e" width="30%" />
  <img alt="Vault Screen 3" src="https://github.com/user-attachments/assets/c4bfe6b5-36ff-490c-8469-397037693611" width="30%" />
</p>

---

## 🚀 The DevOps Edge

To eliminate the "it works on my machine" problem, the entire backend infrastructure is completely containerized. 

Using **Docker** and `docker-compose`, the network seamlessly links the Next.js frontend, the Go processing engine, the Java Spring Boot brain, and a **PostgreSQL 16** database on a unified virtual network.


### 🔌 Access Points:
* **Admin Dashboard:** `http://localhost:3000`
* **Java API:** `http://localhost:9090/api/v1/policy`
* **Go Upload Engine:** `http://localhost:8080/upload`
* **Postgres Database:** `localhost:5432`

🔒 Security & Data Flow

    A user attempts to upload a file (e.g., confidential_report.pdf) via the Flutter App.

    The file hits the Go Microservice. Go pauses the stream and asks Java: "Is 'confidential' allowed?"

    Java checks the Postgres database for active security directives.

    If blocked, Java logs a DENIED attempt and returns a 403. Go rejects the file.

    The Next.js dashboard instantly reflects the blocked attempt in the Live Security Feed.


### Quick Start (Running Locally)

You do not need to install Java, Node, or Go to run the backend. If you have Docker installed, you can spin up the entire enterprise architecture in one command:
```bash

# Clone the repository
git clone [https://github.com/chathudilzo/sentinel-privacy-vault.git](https://github.com/chathudilzo/sentinel-privacy-vault.git)
cd sentinel-privacy-vault

# Boot the entire infrastructure
docker-compose up --build

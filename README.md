# Meeting Room Booking App

A meeting room booking application with a frontend, backend API, and PostgreSQL database, all running with Docker Compose.

## Prerequisites

- Git
- Docker
- Docker Compose

## Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/Guts0984/meeting-room-booking-app.git
cd meeting-room-booking-app
```

### 2. Configure Environment Variables

Create your `.env` files from the example templates before starting the application:

```bash
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env
```

> **Security:** Never commit real passwords, API keys, or authentication secrets to GitHub.

### 3. Start the Application

From the project root directory, run:

```bash
docker compose up -d --build
```

This command builds the Docker images and starts the application services in the background.

## Accessing the Application

| Service    | URL / Address             |
|------------|---------------------------|
| Frontend   | http://localhost:5444     |
| Backend API| http://localhost:3000     |
| PostgreSQL | localhost:5433            |

## Stopping the Application

To stop the containers while preserving database data:

```bash
docker compose down
```

To stop the containers **and delete the database volume and its stored data**:

```bash
docker compose down -v
```

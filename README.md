Meeting Room Booking App

A meeting room booking application with a frontend, backend API, and PostgreSQL database, all running with Docker Compose.

Prerequisites
Git
Docker
Docker Compose
Getting Started
1. Clone the Repository
git clone https://github.com/Guts0984/meeting-room-booking-app.git
cd meeting-room-booking-app

2. Start the Application

From the project root directory, run:

docker compose up -d --build


This command builds the Docker images and starts the application services in the background.

3. Access the Application
Service	URL
Frontend	http://localhost:5444
Backend API	http://localhost:3000
PostgreSQL	localhost:5433
4. Stop the Application

To stop the containers while preserving database data:

docker compose down


To stop the containers and delete the database volume and its stored data:

docker compose down -v


Warning: The second command permanently deletes the database data stored in the Docker volume.

Environment Configuration

If your backend requires environment variables, create backend/.env before starting the application. Configure the required database connection and authentication secrets as appropriate for your setup.

Security: Never commit real passwords, API keys, or authentication secrets to GitHub.

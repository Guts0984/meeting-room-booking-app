Meeting Room Booking App

A meeting room booking application with a frontend, backend API, and PostgreSQL database, all running with Docker Compose.

Getting Started
Prerequisites
Docker
Docker Compose
Run the Application

From the project root directory, run:

docker compose up -d --build


This command builds the images and starts the application services in the background.

Access the Application
Service	URL
Frontend	http://localhost:5444
Backend API	http://localhost:3000
PostgreSQL	localhost:5433
Stop the Application

To stop the running containers, execute:

docker compose down


To stop the containers and remove the database volume and its stored data, run:

docker compose down -v


Note: The second command permanently deletes the PostgreSQL data stored in the Compose volume.

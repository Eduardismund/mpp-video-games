# Video Game Library - Assignment 7

---

##  Implemented Features

TODO

---

## 🧱 Tech Stack

- **Backend**: Java, Spring Boot, Hibernate, Postgres, Node.js
- **Frontend**: React, Vite
- **ORM**: Spring Data JPA (Hibernate)
- **Performance Testing**:  Grafana K6
- **Deployment**: Docker Compose, AWS ECS

---
# Deployment

## Local Deployment with Docker Compose

In order to build the docker images, one can rely on Docker Compose with the command:

```bash
docker compose build
```

And in order to run the containers stack, run the command:

```bash
docker compose up -d
```

## Cloud deployment on AWS

In order to build the docker images for AWS, one should first set up some environment variables running the command:

```bash
source aws-env.sh
```

and then run the actual images build with docker compose with the command:

```bash
docker compose build
```

Then we need to push the images to AWS Docker Registry with the command:

```bash
docker compose push
```

Finally we will deploy the containers stack to AWS ECS, using the tool [ecs_compose-x](https://docs.compose-x.io/).

Assuming the tool is installed, we can deploy to AWS with the command:

```bash
ecs-compose-x up -f docker-compose.yml -n mpp-vg
```

This will start deploying to AWS by means of __Cloud formation__.

# Development

## Running the Java backend application:

Provides API with database persistence for the majority of entities.
In order to run the Java backend use the command:

```bash
cd backend
gradle build
gradle bootRun
```

This application requires an SQL data source configured in [application.yml](backend/src/main/resources/application.yml).
The database can be launched using:

```bash
docker compose up -d db
```

## Running the JavaScript backend application:

Provides API for files storage.
In order to run the JavaScript backend use the command:

```bash
cd backend-js
npm install
npm run backend
```

## Running the frontend application:

The application is developed and built using the `vite` framework.

In order to run the application in production
preview mode, use the command:

```bash
cd frontend
npm run build && npm run preview
```

The `preview` command will launch a web server. Please use the url displayed in order to open the application in browser

```
> mpp-videogames@1.0.0 preview
> vite preview

  ➜  Local:   http://localhost:4173/
  ➜  Network: use --host to expose
  ➜  press h + enter to show help

```

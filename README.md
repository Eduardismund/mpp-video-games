# Video Game Library - Assignment 6

---

## ✅ Implemented Features

### 🥉 Bronze Tier

- **Relational Database Model** with Hibernate (JPA)
  - `VideoGame` ↔️ `VideoGameReviews` (One-to-Many relationship)
- **Full CRUD Operations** for both `VideoGame` and `Review`
- **Filtering and Sorting** support:
  - Filter video games by price
  - Sort video games ascending/descending by price
  - Filter reviews by timestamp and score
  - Sort reviews ascending/descending by timestamp/score
- **RESTful API** using Spring Boot
- **ORM**: Hibernate (Spring Data JPA)
- Frontend integration with backend via HTTP requests

---

### 🥈 Silver Tier

- **Automated Data Generation**:
  - Using **Faker.js** and **Grafana K6** to generate over **100,000 entries** for both `VideoGame` and `VideoGameReview` entities.
  - Execute the following command to populate the database with large-scale test data:
    ```bash
    k6 run -e TEST_FUNCTION=generateData perftests/dist/index-test.js
    ```
  - 📌 **Prerequisite setup** – before running the command above, ensure you:
    ```bash
    cd perftests
    npm run generateTokensFile
    npm run bundle
    ```

- **Performance Optimization**:
  - Introduced targeted **database indexing** to significantly enhance query performance on high-traffic columns such as `rating`, `game_id`, `genre`, and `release_date`.
  - Leveraged **Liquibase** to manage and apply schema changes declaratively. These can be found in [this file.](backend/src/main/resources/db/changelog/db.changelog-master.xml)

- **Performance Testing**:
  - Used **Grafana K6** for stress testing endpoints, using the command:
    ```bash
    k6 run -e TEST_FUNCTION=variousOps perftests/dist/index-test.js
    ```
  - Note: the same **Prerequisite setup** is the same as the **Automated Data Generation**
  - This command executes various operations: creating video games, creating video games reviews, retrieving video games, compute video games statistics, etc.
  - Performance results logged and analyzed for reporting.

---

### 🥇 Gold Tier

- **Authentication System**:
  - Users can register and log in
  - API key-like token-based auth system
- **User Roles**:
  - `ROLE_USER`: regular user with access to CRUD on own content
  - `ROLE_ADMIN`: admin access, including user monitoring
- **Log Table**:
  - Each CRUD action logged with:
    - user ID
    - action performed
    - timestamp
- **Monitoring Thread**:
  - Periodic background thread analyzes logs
  - Flags suspicious users performing too many actions too quickly, meaning they are inserted into a table with the following information:
    - userId
    - reason (e.g.: HIGH_FREQUENCY_OPS)
    - timestamp
  - A user is flagged with HIGH_FREQUENCY_OPS suspicion, if they perform more than 5 requests per second. The monitoring job runs every 10 seconds.
- **Admin Dashboard**:
  - Admin-only route to see list of monitored users
  - Includes simulated attack detection (automated test creates high-volume actions), by running the k6 performance tests with steady requests per seconds, with a rate greater than the suspicious threshold.
- **Secure Role-Based Access** to API operations and in frontend routes and components.

---

## 🧱 Tech Stack

- **Backend**: Java, Spring Boot, Spring Security, Hibernate, MySQL, Node.js
- **Frontend**: React, Vite
- **ORM**: Spring Data JPA (Hibernate)
- **Performance Testing**:  Grafana K6

---

## Prerequisites

In order to build and run the application, the node.js + npm is required. Tested with: node 22.14.0 and npm 10.9.2

After downloading the repository run the command:

```bash
cd frontend
npm install
```

in order to fetch the required libraries

# Running the Java backend application:

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

# Running the JavaScript backend application:

Provides API for files storage.
In order to run the JavaScript backend use the command:

```bash
cd backend-js
npm install
npm run backend
```

# Running the frontend application:

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

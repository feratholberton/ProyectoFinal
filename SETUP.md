# Development Environment Setup

This document explains the steps required to set up the backend development environment for **proyecto Final ELIO**.

---

## Prerequisites

Before starting, make sure you have the following installed on your machine:

- **Node.js** (v16 or higher recommended)
- **NPM** or **Yarn** for dependency management
- **Database Engine** (e.g., MySQL, PostgreSQL, or MongoDB, depending on your project)
- **Git** to manage the repository
- Code editor (recommended: Visual Studio Code)

---

## Setup Steps

### 1. Clone the Repository

First, clone the project repository to your local machine:
```bash
git clone https://github.com/new-user/proyectoFinal.git
cd proyectoFinal
```

---

### 2. Install Dependencies

Navigate to the backend directory and run the following command to install dependencies:
```bash
npm install
```

This will install all the libraries and tools required for the backend to function properly.

---

### 3. Configure Environment Variables

Create a `.env` file at the root of the project and define the following variables (adjust values as needed):

```env
# Port for the server
PORT=10000

# Database Configuration
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=1234
DB_NAME=my_database

# Other necessary variables
JWT_SECRET=your_jwt_secret
```

---

### 4. Set Up the Database

Ensure your database engine is running and create the database required by the project. For example:
```sql
CREATE DATABASE my_database;
```

If the project includes migration scripts, run them to set up the tables automatically:
```bash
npm run migrate
```

---

### 5. Start the Server

Start the backend server by running:
```bash
npm start
```

The server will be available at [http://localhost:10000](http://localhost:10000) by default.

---

## Troubleshooting

### Problem: Database Connection Error
- Verify that the credentials in your `.env` file are correct.
- Ensure the database service is running.

### Problem: Port Already in Use
- Change the `PORT` variable in your `.env` file to another number, for example:
  ```env
  PORT=4000
  ```

---

## Recommended Tools

- **Postman** or **Insomnia** to test API endpoints.
- **nodemon** for automatic server restarts during development:
  ```bash
  npm install -g nodemon
  ```

---

If you have questions or need support, please contact the development team.
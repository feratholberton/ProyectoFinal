# API Documentation

This document describes the available endpoints in the backend of the **proyecto Final ELIO** project, including request and response examples.

---

## Base URL

The API is available at:
```
http://localhost:3000/api
```

---

## Endpoints

### 1. **Authentication**

#### POST `/auth/login`
- **Description:** Logs in a user with their credentials.
- **Request Body Parameters:**
  ```json
  {
    "email": "user@example.com",
    "password": "123456"
  }
  ```
- **Response:**
  ```json
  {
    "token": "generated_jwt_token",
    "user": {
      "id": 1,
      "name": "User Name",
      "email": "user@example.com"
    }
  }
  ```
- **Status Codes:**
  - `200 OK`: Login successful.
  - `401 Unauthorized`: Incorrect credentials.

#### POST `/auth/register`
- **Description:** Registers a new user.
- **Request Body Parameters:**
  ```json
  {
    "name": "User Name",
    "email": "user@example.com",
    "password": "123456"
  }
  ```
- **Response:**
  ```json
  {
    "message": "User registered successfully",
    "user": {
      "id": 2,
      "name": "User Name",
      "email": "user@example.com"
    }
  }
  ```
- **Status Codes:**
  - `201 Created`: User registered successfully.
  - `400 Bad Request`: Invalid data sent.

---

### 2. **Users**

#### GET `/users`
- **Description:** Retrieves a list of all users.
- **Requires Authentication:** Yes.
- **Headers:**
  ```json
  {
    "Authorization": "Bearer jwt_token"
  }
  ```
- **Response:**
  ```json
  [
    {
      "id": 1,
      "name": "User Name",
      "email": "user@example.com"
    },
    {
      "id": 2,
      "name": "Another User",
      "email": "another@example.com"
    }
  ]
  ```
- **Status Codes:**
  - `200 OK`: Successfully retrieved the list of users.
  - `401 Unauthorized`: Missing or invalid token.

---

### 3. **Products**

#### GET `/products`
- **Description:** Retrieves a list of available products.
- **Response:**
  ```json
  [
    {
      "id": 1,
      "name": "Product 1",
      "price": 100.0,
      "description": "Description of Product 1"
    },
    {
      "id": 2,
      "name": "Product 2",
      "price": 200.0,
      "description": "Description of Product 2"
    }
  ]
  ```
- **Status Codes:**
  - `200 OK`: Successfully retrieved the list of products.

#### POST `/products`
- **Description:** Adds a new product.
- **Requires Authentication:** Yes.
- **Request Body Parameters:**
  ```json
  {
    "name": "New Product",
    "price": 150.0,
    "description": "Description of the new product"
  }
  ```
- **Response:**
  ```json
  {
    "message": "Product successfully created",
    "product": {
      "id": 3,
      "name": "New Product",
      "price": 150.0,
      "description": "Description of the new product"
    }
  }
  ```
- **Status Codes:**
  - `201 Created`: Product successfully created.
  - `400 Bad Request`: Invalid data sent.
  - `401 Unauthorized`: Missing or invalid token.

---

## API Notes

1. **Authentication:**
   - Most endpoints require a valid JWT token in the `Authorization` header.
   - Ensure you include `Bearer <token>` in each authenticated request.

2. **Common Errors:**
   - `400 Bad Request`: Invalid data in the request.
   - `401 Unauthorized`: Missing or invalid JWT token.
   - `404 Not Found`: Resource not found.

3. **Date Format:**
   - All dates are in ISO 8601 format (`YYYY-MM-DDTHH:mm:ssZ`).

---

## Recommended Tools for Testing

- **Postman:** To test API endpoints.
- **curl:** Command-line tool for making HTTP requests.
- **Insomnia:** An alternative to Postman for testing APIs.

---

If you have questions or need support, please contact the development team.
# Database Schema

This document outlines the database schema used in the backend of the **Proyecto Final ELIO** project.

---

## Tables

### Table: `users`
- **Description:** Stores user information.
- **Columns:**
  - `id` (Primary Key): Unique identifier for each user.
  - `name` (String): Full name of the user.
  - `email` (String): Email address of the user (must be unique).
  - `password` (String): Hashed password for authentication.
  - `created_at` (Timestamp): Timestamp of when the user was created.
  - `updated_at` (Timestamp): Timestamp of the last update.

### Table: `products`
- **Description:** Contains product details.
- **Columns:**
  - `id` (Primary Key): Unique identifier for each product.
  - `name` (String): Name of the product.
  - `description` (Text): Detailed description of the product.
  - `price` (Decimal): Price of the product.
  - `created_at` (Timestamp): Timestamp of when the product was created.
  - `updated_at` (Timestamp): Timestamp of the last update.

### Table: `orders`
- **Description:** Tracks customer orders.
- **Columns:**
  - `id` (Primary Key): Unique identifier for each order.
  - `user_id` (Foreign Key): References the `users` table.
  - `total` (Decimal): Total amount of the order.
  - `status` (String): Status of the order (e.g., pending, completed, canceled).
  - `created_at` (Timestamp): Timestamp of when the order was created.
  - `updated_at` (Timestamp): Timestamp of the last update.

### Table: `order_items`
- **Description:** Stores the items in each order.
- **Columns:**
  - `id` (Primary Key): Unique identifier for each order item.
  - `order_id` (Foreign Key): References the `orders` table.
  - `product_id` (Foreign Key): References the `products` table.
  - `quantity` (Integer): Quantity of the product in the order.
  - `price` (Decimal): Price of the product at the time of the order.

---

## Relationships

- **`users` -> `orders`:**
  - One user can place multiple orders, but each order belongs to only one user.
- **`orders` -> `order_items`:**
  - One order can have multiple items, but each item belongs to only one order.
- **`products` -> `order_items`:**
  - One product can appear in multiple orders, but each order item refers to only one product.

---

## ER Diagram

```plaintext
+-----------+        +-----------+        +--------------+        +---------------+
|   users   |        |  orders   |        |  order_items |        |   products    |
+-----------+        +-----------+        +--------------+        +---------------+
| id (PK)   | <----> | id (PK)   | <----> | id (PK)      | <----> | id (PK)       |
| name      |        | user_id   |        | order_id     |        | name          |
| email     |        | total     |        | product_id   |        | description   |
| password  |        | status    |        | quantity     |        | price         |
| created_at|        | created_at|        | price        |        | created_at    |
| updated_at|        | updated_at|        |              |        | updated_at    |
+-----------+        +-----------+        +--------------+        +---------------+

```
---

## Additional Notes

1. **Indexes:**
   - Ensure indexes are created for frequently queried columns, such as `email` in the `users` table and `user_id` in the `orders` table.

2. **Data Integrity:**
   - Use foreign key constraints to maintain relationships between tables.
   - Validate data at the application level before inserting into the database.

3. **Scalability:**
   - Consider sharding or partitioning large tables like `orders` and `order_items` if the dataset grows significantly.
   - Use caching strategies (e.g., Redis) for frequently accessed data.

---

For more details or clarifications about the database schema, feel free to contact the development team.
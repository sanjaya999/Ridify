# RentThis - Vehicle Rental Platform

RentThis is a comprehensive vehicle rental platform built with Java and Spring Boot. It provides a robust backend solution for users to rent vehicles, manage bookings, and handle payments securely. The platform features a clean, layered architecture and a secure RESTful API, making it a scalable and maintainable application.

## Key Features

-   **User Authentication & Authorization:** Secure user registration and login using JWT (JSON Web Tokens) with role-based access control (USER, SUPER_ADMIN).
-   **Vehicle Management:** Full CRUD (Create, Read, Update, Delete) functionality for vehicle listings. Vehicle owners can list their vehicles, and administrators can manage all platform listings.
-   **Booking System:** Users can browse available vehicles, check their availability for specific dates, and make bookings.
-   **Payment Gateway Integration:** Seamlessly integrated with the **Khalti Payment Gateway** for real-time, secure online payments.
-   **User Wallet System:** A personal wallet for users to store funds and make payments for bookings within the application.
-   **Geo-location Search:** Functionality to find available vehicles nearby based on the user's current latitude and longitude.
-   **Admin Dashboard:** A dedicated set of API endpoints for administrators to manage users, vehicles, and platform-wide settings.

## Technology Stack

-   **Backend:**
    -   Java 17
    -   Spring Boot 3
    -   Spring Security (for JWT Authentication)
    -   Spring Data JPA (Hibernate)
-   **Database:**
    -   Postgres (or your preferred relational database)
-   **Build Tool:**
    -   Maven
-   **API Documentation & Testing:**
    -   Postman / Swagger

## Setup and Installation

To get the project running locally, follow these steps:

**1. Prerequisites:**
-   JDK 17 or later
-   Maven
-   Postgres (or another relational database)

**2. Clone the Repository:**
```bash
git clone https://github.com/your-username/RentThis.git
cd RentThis
```

**3. Configure the Database:**
-   Create a new database in Postgres / mysql   
    ```sql
    CREATE DATABASE rentthis_db;
    ```
-   Open `src/main/resources/application.properties` and update the following properties with your database credentials:
    ```properties
    spring.datasource.url=jdbc:postgresql://localhost:5432/rentthis_db
    spring.datasource.username=your-db-username
    spring.datasource.password=your-db-password
    spring.jpa.hibernate.ddl-auto=update
    ```

**4. Configure Application Secrets:**
-   In the same `application.properties` file, set your JWT secret key and Khalti API keys:
    ```properties
    # JWT Configuration
    jwt.secret.key=your-super-secret-key-for-jwt

    # Khalti Configuration
    khalti.secret.key=your-khalti-secret-key
    khalti.api.url=https://khalti.com/api/v2/payment/verify/
    ```

**5. Build and Run the Application:**
-   Use Maven to build the project:
    ```bash
    mvn clean install
    ```
-   Run the application:
    ```bash
    mvn spring-boot:run
    ```
-   The application will start on `http://localhost:8080`.

## API Endpoints

Here are some of the main API endpoints available:

| Method | Endpoint                           | Description                               | Access      |
| :----- | :--------------------------------- | :---------------------------------------- | :---------- |
| POST   | `/api/auth/register`               | Register a new user                       | Public      |
| POST   | `/api/auth/login`                  | Authenticate a user and get a JWT token   | Public      |
| GET    | `/api/vehicles/available`          | Get all available vehicles for rent       | Public      |
| GET    | `/api/vehicles/{id}`               | Get details of a specific vehicle         | Public      |
| POST   | `/api/bookings/book`               | Book a vehicle for a specified duration   | User        |
| GET    | `/api/bookings/my-bookings`        | View personal booking history             | User        |
| POST   | `/api/payment/khalti/initiate`     | Initiate a payment with Khalti            | User        |
| GET    | `/api/wallet/balance`              | Check user wallet balance                 | User        |
| GET    | `/api/admin/users`                 | Get a list of all users                   | Super Admin |
| PUT    | `/api/admin/vehicles/suspend/{id}` | Suspend a vehicle listing                 | Super Admin |

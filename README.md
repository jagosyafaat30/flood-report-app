# Flood Report App (Laporkan Banjir)

A full-stack web application designed to facilitate the reporting and management of flood incidents. This application provides a user-friendly interface for citizens to report floods and a comprehensive dashboard for administrators to manage and track these reports.

## 1. The Problem

In many areas, there is no centralized or efficient system for citizens to report flood incidents. This can lead to delayed response times, difficulty in tracking the scope of flooding, and inefficient allocation of resources by authorities.

## 2. The Solution

This Flood Report App provides a simple and effective solution by offering:
-   **A Centralized Platform:** A single place for all flood-related reports.
-   **User-Friendly Reporting:** Citizens can quickly create reports with essential details like a title, description, and an image of the location.
-   **Admin Management Dashboard:** Authorities get access to a dashboard to view all submitted reports, track their status, and manage the data, enabling a more organized and timely response.

## 3. Key Features

-   **User Authentication:** Secure user registration and login system with JWT (JSON Web Tokens).
-   **Role-Based Access Control:**
    -   **User Role:**
        -   Create, read, update, and delete their own flood reports.
        -   View the status of their reports (as plain text).
        -   Cannot change the status of any report.
    -   **Admin Role:**
        -   Full CRUD (Create, Read, Update, Delete) access to all reports from any user.
        -   Ability to update the status of any report (`Pending`, `In Progress`, `Resolved`).
-   **Report Management:**
    -   Create reports with a title, description, and image upload.
    -   View a list of all submitted reports.
    -   View a detailed page for each individual report.
-   **RESTful API:** A well-structured backend API built with Node.js and Express.js.

## 4. Tech Stack

-   **Frontend:** React, React Router, Tailwind CSS, Axios
-   **Backend:** Node.js, Express.js, MongoDB (with Mongoose), JWT
-   **File Handling:** Multer for image uploads.

## 5. How to Run Locally

Follow these instructions to set up and run the project on your local machine.

### Prerequisites

-   [Node.js](https://nodejs.org/) (v14 or later recommended)
-   [npm](https://www.npmjs.com/)
-   [MongoDB](https://www.mongodb.com/try/download/community) (either local or a cloud instance like MongoDB Atlas)

### Backend Setup

1.  **Navigate to the backend directory:**
    ```bash
    cd flood-report-app/backend
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Create an environment file:**
    Create a file named `.env` in the `backend` directory and add the following variables:
    ```
    MONGODB_URI=your_mongodb_connection_string
    JWT_SECRET=your_super_secret_and_long_jwt_key
    ```
    (Replace the values with your actual MongoDB URI and a secure secret key).

4.  **Start the backend server:**
    ```bash
    npm start
    ```
    The backend server will start on `http://localhost:5000` (by default).

### Frontend Setup

1.  **Navigate to the frontend directory:**
    ```bash
    cd flood-report-app/frontend
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Start the frontend development server:**
    ```bash
    npm start
    ```
    The application will open automatically in your browser at `http://localhost:3000`.

### (Optional) Create an Admin User

The application is configured so that the default role for any new user is `user`. To create an admin:

1.  Register a new user through the application's registration page.
2.  In your backend terminal, run the following command, replacing `<user-email>` with the email of the user you just registered:
    ```bash
    node seed.js <user-email>
    ```
    This script will find the user and update their role to `admin`.

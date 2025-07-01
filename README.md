# Retail ERP System

A full-stack Retail ERP (Enterprise Resource Planning) system, providing core functionalities for product, customer, and sales management.

## Project Overview

This application consists of a modern React frontend for intuitive user interaction and a robust ASP.NET Core Web API backend for business logic and data management. Data is persisted using SQL Server via Entity Framework Core.

## Technologies Used

**Frontend:**
* React
* Vite
* Bootstrap (for responsive UI)
* JavaScript

**Backend:**
* ASP.NET Core (.NET 9.0)
* C#
* Entity Framework Core
* SQL Server

## Getting Started

Follow these steps to set up and run the project locally.

### Prerequisites

Ensure you have the following installed:
* [.NET SDK 9.0](https://dotnet.microsoft.com/download/dotnet/9.0)
* [Node.js & npm](https://nodejs.org/)
* [SQL Server Express](https://www.microsoft.com/en-us/sql-server/sql-server-downloads)
* [dotnet-ef global tool](https://docs.microsoft.com/en-us/ef/core/cli/dotnet): `dotnet tool install --global dotnet-ef`

### Setup & Database Migration

1.  **Backend Setup & DB Migration:**
    Navigate to the backend directory (`server/RetailERP.Server`).
    ```bash
    cd server/RetailERP.Server
    dotnet restore
    dotnet build
    dotnet ef database update
    ```
    *Ensure your `appsettings.json` connection string points to your SQL Server instance (e.g., `Server=BADASSTRON\\SQLEXPRESS;Database=RetailERPDb;...`). The `dotnet ef database update` command will create the database and tables.*

2.  **Frontend Setup:**
    Navigate to the frontend directory (`client/Front-End`).
    ```bash
    cd client/Front-End
    npm install
    ```

### Running the Application

1.  **Start Backend API:**
    In a new terminal, from `server/RetailERP.Server`:
    ```bash
    dotnet run
    ```
    *Note the HTTP URL (e.g., `http://localhost:5219`) and ensure your `ProductList.jsx` API_URL matches it.*

2.  **Start Frontend Dev Server:**
    In another new terminal, from `client/Front-End`:
    ```bash
    npm run dev
    ```

3.  **Access in Browser:**
    Open your browser and navigate to the frontend URL (e.g., `http://localhost:5173`).

## API Endpoints (Core)

* `/api/products`
* `/api/customers`
* `/api/bills`
* `/api/billitems`

---
*Developed as a comprehensive solution for managing products, customers, and sales.*

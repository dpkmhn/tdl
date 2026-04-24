# Trading Order Management System (OMS)

A production-style full-stack **Trading OMS starter** with:

- **Backend:** Spring Boot (Java 21)
- **Frontend:** React + TypeScript + Vite

## What makes this version better

- Rich order lifecycle support (**NEW → FILLED / CANCELLED**)
- Real-time dashboard KPIs (total, open, filled, cancelled, open notional)
- Order blotter with **filtering** by symbol and status
- Modern, responsive UI with glassmorphism-style trading panels
- API validation and clean error responses for frontend display

## Project Structure

```text
backend/   Spring Boot REST API
frontend/  React TypeScript Vite app
```

## Run Backend

```bash
cd backend
mvn spring-boot:run
```

API base: `http://localhost:8080/api/orders`

## Run Frontend

```bash
cd frontend
npm install
npm run dev
```

UI: `http://localhost:5173`

## API Endpoints

- `GET /api/orders` - list orders
- `GET /api/orders/summary` - aggregate dashboard metrics
- `POST /api/orders` - create order
- `PATCH /api/orders/{id}/fill` - mark order filled
- `PATCH /api/orders/{id}/cancel` - cancel order

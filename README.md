<img width="1877" height="1493" alt="Zrzut ekranu 2026-01-06 123957" src="https://github.com/user-attachments/assets/1ae4a94f-20c7-48fb-82bf-ae1c52b0285f" />
 
## Restaurant POS - Frontend

The frontend layer of a Full-stack Restaurant Point of Sale system, focusing on the customer ordering interface and cart management.
## 🚀 Live Demo
- **URL:** [https://restaurant.rafalsprengel.com/](https://restaurant.rafalsprengel.com/)

---

## 🔑 Key Features

- **Menu Browser** – Dynamically renders products and categories fetched from the backend API.  
- **Cart Management** – Persistent shopping cart stored via React Context, with multi-step order flow from selection to checkout.  
- **Order Flow** – Users can review, edit, and submit orders; view order history after login.  
- **User Accounts** – Registration, login, and profile management with JWT authentication.  
- **Table Reservations** – View table availability, create and manage reservations directly from the frontend.  
- **Messaging / Contact Form** – Submit messages to the restaurant and receive notifications; users can track messages.  
- **Payments Integration** – Stripe API for secure online transactions.  
- **Responsive UI** – Fully optimized for desktop, tablet, and mobile devices.  
- **Status & Feedback** – Shows order status updates and validation feedback during checkout.  

---

## 🛠 Tech Stack

- **React.js** – Functional components with Hooks.  
- **State Management** – React Context API (for cart, user, and UI state).  
- **Routing** – React Router for page navigation.  
- **Styling** – CSS / SCSS for modular, responsive design.  
- **HTTP Requests** – Axios / Fetch for API communication.  

---

## 🌐 Backend & Integration

The frontend communicates with the dedicated Restaurant POS REST API (Node.js / Express), supporting:

- **Database** – MongoDB for products, orders, reservations, and messages.  
- **Security** – JWT-based authentication and protected routes.  
- **Payments** – Stripe integration for secure transactions.  
- **User Management** – Full registration, login, and order history.  
- **Reservations** – Table booking system integrated with backend availability checks.  
- **Messaging** – Contact form submissions, replies, and unread message tracking.  

---

## 📁 Project Structure

- `src/pages/` – Page-level components (Menu, Cart, Checkout, Profile, Reservations).  
- `src/components/` – Reusable UI elements (Buttons, Modals, Cards, Forms).  
- `src/context/` – React Context for global state management (Cart, User, UI).  
- `src/data/` – Local JSON or constants for interface placeholders.  
- `src/styles/` – SCSS stylesheets for modular and responsive design.  
- `src/utils/` – Helper functions and API service calls.  

---

## 🚀 Setup & Development

```bash
git clone https://github.com/RafalSprengel/restaurant-pos-frontend
cd restaurant-pos-frontend
npm install
npm start

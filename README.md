#<img width="1877" height="1493" alt="Zrzut ekranu 2026-01-06 123957" src="https://github.com/user-attachments/assets/1ae4a94f-20c7-48fb-82bf-ae1c52b0285f" />
 Restaurant POS - Frontend

The frontend layer of a Full-stack Restaurant Point of Sale system, focusing on the customer ordering interface and cart management.

## 🔑 Key Features
- **Menu Browser**: Dynamic rendering of products from data structures.
- **Cart Logic**: Persistent shopping cart managed via React Context.
- **Order Flow**: Multi-step process from item selection to checkout summary.
- **Responsive UI**: Layout optimized for mobile and desktop devices.

## 🛠 Tech Stack
- **React.js**: Functional components and Hooks.
- **State Management**: React Context API (Cart & UI state).
- **Styling**: CSS / SCSS.
- **Routing**: React Router.

## 🌐 Backend & Integration Capabilities
The frontend is architected to communicate with a dedicated REST API (Node.js/Express) supporting:
- **Database**: MongoDB for product and order persistence.
- **Security**: JWT-based authorization and protected routes.
- **Payments**: Stripe API integration for secure transactions.
- **User Accounts**: Registration and authentication system.
- **Monitoring**: Server-side error logging to file.

## 📁 Project Structure
- `src/pages`: Page-level components.
- `src/components`: Reusable UI elements.
- `src/context`: ShoppingCartContext for global state handling.
- `src/data`: Local JSON data providers for the interface.
- `src/styles`: SCSS stylesheets.

## 🚀 Setup
1. Clone the repository: `git clone https://github.com/RafalSprengel/restaurant-pos-frontend`
2. Install dependencies: `npm install`
3. Start development server: `npm start`

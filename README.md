# Restaurant POS System

A modern, React-based Point of Sale (POS) system designed for restaurants, with a focus on a seamless online ordering experience. The system utilizes a Node.js and Express.js backend with MongoDB to create a robust REST API.

## Features

- User-friendly interface for customers to browse menu and place orders
- Home page with quick access to online ordering and menu viewing
- Shopping cart functionality for easy order management
- Responsive design for optimal viewing on various devices
- Integration with restaurant menu data (stored in JSON format)
- Backend REST API for handling data operations and business logic

## Tech Stack

- Frontend:
  - React.js
  - JavaScript (ES6+)
  - CSS3
  - JSON for data storage
- Backend:
  - Node.js
  - Express.js
  - MongoDB

## Getting Started

1. Clone the repository
2. Run `npm install` in both the root and server directories to install dependencies
3. Set up your MongoDB connection
4. Use `npm start` in the root directory to run the frontend app in development mode
5. Use `npm start` in the server directory to run the backend server
6. Open [http://localhost:3000](http://localhost:3000) to view the frontend in your browser

## Project Structure

- `src/pages`: Contains main page components (HomePage, Kontakt)
- `src/context`: Includes ShoppingCartContext for state management
- `src/data`: Stores menu items in JSON format
- `server/`: Contains the Node.js/Express.js backend code and API routes

This project aims to provide a robust, user-friendly POS system for restaurants, enhancing the online ordering experience for customers and streamlining operations for restaurant owners. The combination of a React frontend with a Node.js/Express.js backend and MongoDB database ensures a scalable and efficient solution for restaurant management.

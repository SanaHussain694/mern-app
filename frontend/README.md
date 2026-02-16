# MERN Stack Application

Full-stack web application built with MongoDB, Express.js, React, and Node.js.

## 📋 Description

Yeh ek complete MERN stack project hai jo modern web development practices follow karta hai.

## 🚀 Features

- User authentication (JWT)
- RESTful API
- React frontend with responsive design
- MongoDB database
- Express.js backend

## 🛠️ Technologies Used

### Frontend
- React.js
- React Router
- Axios
- CSS3

### Backend
- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT Authentication

## 📦 Installation

### Prerequisites
- Node.js (v14 ya upar)
- MongoDB
- Git

### Backend Setup
```bash
cd backend
npm install
cp .env.example .env
# .env file me apni details add karo
npm start
```

### Frontend Setup
```bash
cd frontend
npm install
npm start
```

## 🔐 Environment Variables

Backend `.env` file me ye variables chahiye:
```
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
```

## 🌐 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login

### Users
- `GET /api/users` - Get all users (protected)
- `GET /api/users/:id` - Get single user

## 📱 Screenshots

(Screenshots yahan add kar sakte hain)

## 👨‍💻 Author

Your Name

## 📄 License

MIT License

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.

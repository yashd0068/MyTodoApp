# 📝 Full‑Stack Todo Application

A modern **full‑stack Todo application** built with **React, Node.js, Express, Sequelize, and MySQL**, featuring secure authentication, pagination, filtering, and OAuth login.

---

## 🚀 Features

* 🔐 **Authentication & Authorization**

  * Email & Password login
  * Google OAuth
  * GitHub OAuth
  * JWT‑based authentication

* ✅ **Todo Management**

  * Create, update, delete todos
  * Mark todos as completed
  * Due date support

* 🔍 **Advanced Functionality**

  * Search todos by title or description
  * Pagination with dynamic page size
  * Sorting (by date, title, due date)

* 👤 **User Profile**

  * Update profile details
  * Change password

---

## 🛠 Tech Stack

### Frontend

* React
* React Router
* Axios
* Material UI
* Tailwind CSS

### Backend

* Node.js
* Express.js
* Sequelize ORM
* MySQL
* JWT Authentication
* OAuth (Google & GitHub)

---

## 📂 Project Structure

```
My_Todo_App/
│
├── backend/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── middleware/
│   ├── config/
│   └── server.js
│
├── frontend/
│   ├── src/
│   │   ├── pages/
│   │   ├── components/
│   │   └── hooks/
│   └── main.jsx
│
└── README.md
```

---

## ⚙️ Environment Variables

Create a `.env` file in both **frontend** and **backend** directories.

### Backend `.env`

```env
PORT=5000
DB_NAME=your_db_name
DB_USER=your_db_user
DB_PASSWORD=your_db_password
JWT_SECRET=your_jwt_secret
GOOGLE_CLIENT_ID=your_google_client_id
GITHUB_CLIENT_ID=your_github_client_id
GITHUB_CLIENT_SECRET=your_github_client_secret
```

### Frontend `.env`

```env
VITE_API_URL=http://localhost:5000
VITE_GOOGLE_CLIENT_ID=your_google_client_id
VITE_GITHUB_CLIENT_ID=your_github_client_id
```

---

## ▶️ How to Run Locally

### 1️⃣ Clone the repository

```bash
git clone https://github.com/yourusername/your-repo-name.git
```

### 2️⃣ Backend Setup

```bash
cd backend
npm install
npm run dev
```

### 3️⃣ Frontend Setup

```bash
cd frontend
npm install
npm run dev
```


## 🔒 Security Practices

* Environment variables secured via `.env`
* Passwords hashed before storing
* JWT used for secure API access

---

## 🤝 Contribution

Contributions are welcome! Feel free to fork this repository and submit a pull request.

---

## 👨‍💻 Author

**Yash**


---

⭐ If you like this project, give it a star!


# 💰 Smart Finance Advisor

An AI-Powered Personal Finance and Investment Advisory Web Application built as a Final Year Project. It helps users track their income & expenses, manage investments, set financial goals, and get AI-driven insights — all in a beautiful dark-themed dashboard.

![Made with Node.js](https://img.shields.io/badge/Backend-Node.js-339933?style=for-the-badge&logo=node.js&logoColor=white)
![Express.js](https://img.shields.io/badge/Server-Express.js-000000?style=for-the-badge&logo=express&logoColor=white)
![MongoDB](https://img.shields.io/badge/Database-MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white)
![HTML5](https://img.shields.io/badge/Frontend-HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/Styling-CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/Logic-JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)

---

## 📋 Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Installation & Setup](#-installation--setup)
- [API Endpoints](#-api-endpoints)
- [Pages & Modules](#-pages--modules)
- [Screenshots](#-screenshots)
- [Author](#-author)

---

## ✨ Features

### 🔐 Authentication & Security
- User Registration with **Name, Email, Mobile Number & Password**
- Secure Login with **JWT Token** based authentication
- **bcrypt** password hashing (12 salt rounds)
- Client-side & Server-side input validation
- Inline error messages (e.g., "No account found", "Incorrect password")
- Password strength indicator on registration

### 📊 Dashboard
- Financial overview with **Total Income, Expenses, Savings & Investments**
- **Interactive Charts** (Chart.js) — Spending trends & category breakdown
- Recent transactions list
- AI-powered insights preview

### 💸 Transactions Management
- Add, view, and filter transactions (Income/Expense)
- Category-wise classification (Food, Salary, Shopping, Transport, etc.)
- Monthly filtering and sorting
- Responsive data table with action buttons

### 📈 Investments
- Portfolio overview with **Total Invested, Current Value & Returns**
- **Portfolio Performance** line chart (monthly trends)
- **Asset Allocation** doughnut chart
- Risk Assessment Quiz with personalized risk profile
- AI-powered investment suggestions (Stocks, Mutual Funds, FDs)
- Add new investments with type, name, amount & current value

### 🧠 AI Insights
- Financial Health Score (0-100)
- 50/30/20 Budget Rule analysis
- Savings rate tracking
- Personalized financial advice
- AI Chat preview for financial queries

### 🎯 Goals
- Create financial goals with target amount & deadline
- Track progress with visual progress bars
- Update savings for each goal
- Mark goals as completed
- Goal completion statistics

### 👤 Profile Management
- View & edit personal information (Name, Phone, Date of Birth)
- Profile data stored in **MongoDB** (real backend)
- **Change Password** with current password verification
- Member since date, total transactions count, goals completed stats
- Last login timestamp

### ⚙️ Settings
- Currency preference selection
- Notification toggles (Email, Push, SMS)
- Theme preferences
- Data export options
- Account deletion (danger zone)

### 📱 Mobile Responsive
- Fully responsive design for all screen sizes
- Collapsible sidebar with hamburger menu on mobile
- Touch-friendly UI elements
- Charts resize properly on small screens

---

## 🛠 Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | HTML5, CSS3, Vanilla JavaScript |
| **Backend** | Node.js, Express.js |
| **Database** | MongoDB with Mongoose ODM |
| **Authentication** | JSON Web Tokens (JWT) |
| **Password Hashing** | bcrypt.js |
| **Charts** | Chart.js |
| **Icons** | Font Awesome 6.5 |
| **Fonts** | Google Fonts (Inter) |
| **Dev Tools** | Nodemon, Concurrently |
| **Environment** | dotenv |

---

## 📁 Project Structure

```
smart-finance-advisor/
├── backend/
│   ├── config/              # Database configuration
│   ├── controllers/         # Route controllers
│   ├── middleware/
│   │   └── auth.js          # JWT authentication middleware
│   ├── models/
│   │   ├── User.js          # User schema (name, email, phone, dob, password)
│   │   ├── Transaction.js   # Transaction schema
│   │   └── Investment.js    # Investment schema
│   ├── routes/
│   │   ├── auth.js          # Auth routes (login, register, profile, change-password)
│   │   ├── transactions.js  # Transaction CRUD routes
│   │   └── investments.js   # Investment CRUD routes
│   └── server.js            # Express server entry point (Port 1200)
├── frontend/
│   ├── css/
│   │   ├── style.css        # Global styles & landing page
│   │   ├── auth.css         # Login & Register page styles
│   │   ├── dashboard.css    # Dashboard & all inner pages styles
│   │   └── sections.css     # Landing page section styles
│   ├── js/
│   │   ├── main.js          # Utility functions, API helper, notifications
│   │   ├── auth.js          # Login & Register form handlers
│   │   ├── dashboard.js     # Dashboard charts & data
│   │   ├── transactions.js  # Transaction page logic
│   │   ├── investments.js   # Investment page logic & charts
│   │   └── insights.js      # AI Insights page logic
│   ├── index.html           # Landing page
│   ├── login.html           # Login page
│   ├── register.html        # Registration page
│   ├── dashboard.html       # Main dashboard
│   ├── transactions.html    # Transactions page
│   ├── investments.html     # Investments page
│   ├── insights.html        # AI Insights page
│   ├── goals.html           # Goals tracking page
│   ├── profile.html         # User profile page
│   └── settings.html        # App settings page
├── .env                     # Environment variables
├── .gitignore
├── package.json
└── README.md
```

---

## 🚀 Installation & Setup

### Prerequisites

- **Node.js** (v16 or higher)
- **MongoDB** (running locally or MongoDB Atlas)
- **Git**

### Steps

1. **Clone the repository**
   ```bash
   git clone https://github.com/ajaypatelxyz/Smart_Finance.git
   cd Smart_Finance
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Create `.env` file** in the root directory
   ```env
   PORT=1200
   MONGODB_URI=mongodb://localhost:27017/smart-finance
   JWT_SECRET=your-secret-key-here
   ```

4. **Start MongoDB** (if running locally)
   ```bash
   mongod
   ```

5. **Run the application**
   ```bash
   npm start
   ```

6. **Open in browser**
   ```
   http://localhost:1200
   ```

---

## 🔌 API Endpoints

### Authentication

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/auth/register` | Register new user (name, email, phone, password) |
| `POST` | `/api/auth/login` | Login user (email, password) |
| `GET` | `/api/auth/me` | Get current user profile (Protected) |
| `PUT` | `/api/auth/profile` | Update profile info (Protected) |
| `PUT` | `/api/auth/change-password` | Change password (Protected) |

### Transactions

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/transactions` | Get all transactions (Protected) |
| `POST` | `/api/transactions` | Add new transaction (Protected) |

### Investments

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/investments` | Get all investments (Protected) |
| `POST` | `/api/investments` | Add new investment (Protected) |

> **Note:** Protected routes require `Authorization: Bearer <token>` header.

---

## 📄 Pages & Modules

| Page | File | Description |
|------|------|-------------|
| 🏠 Landing | `index.html` | Hero section, features, testimonials, pricing |
| 🔑 Login | `login.html` | Email & password login with validation |
| 📝 Register | `register.html` | Sign up with name, email, mobile & password |
| 📊 Dashboard | `dashboard.html` | Financial overview, charts, recent activity |
| 💸 Transactions | `transactions.html` | Add/view/filter transactions |
| 📈 Investments | `investments.html` | Portfolio tracking, charts, risk assessment |
| 🧠 AI Insights | `insights.html` | Financial health score, budget analysis |
| 🎯 Goals | `goals.html` | Set & track financial goals |
| 👤 Profile | `profile.html` | View/edit profile, change password |
| ⚙️ Settings | `settings.html` | App preferences & configurations |

---

## 🔄 How It Works (Workflow)

```
User visits landing page (index.html)
        │
        ▼
Register / Login ──► Backend validates credentials
        │                    │
        │              JWT Token generated
        │                    │
        ▼                    ▼
Token stored in         User data stored
localStorage            in MongoDB
        │
        ▼
Dashboard loads ──► Fetches data via API calls
        │
        ├── Transactions ──► Add/View income & expenses
        ├── Investments ──► Track portfolio & get suggestions
        ├── AI Insights ──► Financial health analysis
        ├── Goals ──► Set targets & track progress
        ├── Profile ──► Edit info & change password
        └── Settings ──► Customize preferences
```

---

## 🖼 Screenshots

> Add your screenshots here after deploying the project.

---

## 👨‍💻 Author

**Ajay Patel**

- GitHub: [@ajaypatelxyz](https://github.com/ajaypatelxyz)

---

## 📄 License

This project is licensed under the **MIT License**.

---

<p align="center">
  Made with ❤️ as a Final Year Project
</p>

# Nellai Mart 🛒

A hyperlocal product discovery platform connecting customers with nearby local shops in Tirunelveli.

---

## 🚀 Quick Start

### Prerequisites
- Node.js v18+
- MongoDB (local or Atlas)

---

### 1. Clone & Install

```bash
# Install backend dependencies
cd backend && npm install

# Install frontend dependencies
cd ../frontend && npm install
```

---

### 2. Configure Backend Environment

Edit `backend/.env`:

```env
PORT=5000
NODE_ENV=development

# Option A: Local MongoDB
MONGODB_URI=mongodb://localhost:27017/nellai-mart

# Option B: MongoDB Atlas (recommended for production)
# MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/nellai-mart?retryWrites=true&w=majority

JWT_SECRET=nellai_mart_jwt_super_secret_key_2026_hyperlocal_discovery
JWT_EXPIRES_IN=7d

# Cloudinary (for image uploads — leave as demo for local dev)
CLOUDINARY_CLOUD_NAME=demo
CLOUDINARY_API_KEY=123456789
CLOUDINARY_API_SECRET=abcdefghijklmnopqrstuvwxyz

CORS_ORIGIN=http://localhost:5173,http://localhost:3000
```

---

### 3. Start MongoDB

**Option A — Local MongoDB Community Server:**
```bash
# Windows: Start MongoDB service
net start MongoDB

# Or run mongod directly
mongod --dbpath C:\data\db
```

**Option B — MongoDB Atlas (Cloud):**
1. Go to [cloud.mongodb.com](https://cloud.mongodb.com)
2. Create a free cluster
3. Get the connection string
4. Replace `MONGODB_URI` in `backend/.env`

---

### 4. Seed Sample Data

```bash
cd backend
npm run seed
```

This seeds:
- Super Admin: `admin@nellaimart.com` / `Admin@123456`
- 5 Categories
- 4 Shops (Tirunelveli area)
- 5 Products
- Shop-Product pricing mappings

---

### 5. Start the Backend

```bash
cd backend
npm run dev
# Server starts at http://localhost:5000
```

---

### 6. Start the Frontend

```bash
cd frontend
npm run dev
# App opens at http://localhost:5173
```

---

## 📁 Project Structure

```
nellai-mart/
├── backend/
│   ├── config/          # DB, Cloudinary, JWT config
│   ├── constants/       # Roles, status enums, messages
│   ├── controllers/     # HTTP request handlers
│   ├── middleware/      # Auth, upload, error handler
│   ├── models/          # Mongoose schemas
│   ├── repositories/    # Database query layer
│   ├── routes/          # Express route definitions
│   ├── scripts/         # Seed & verification scripts
│   ├── services/        # Business logic layer
│   ├── utils/           # Response helpers, pagination
│   ├── validators/      # Input validation chains
│   ├── .env             # Environment config
│   └── server.js        # Entry point
│
└── frontend/
    ├── src/
    │   ├── components/  # Reusable UI components
    │   ├── context/     # React Context (Auth, Toast)
    │   ├── pages/       # Page components
    │   ├── routes/      # React Router setup
    │   └── services/    # API service layer (Axios)
    └── index.html
```

---

## 🌐 API Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/v1/auth/login` | — | Admin login |
| GET | `/api/v1/auth/profile` | ✅ | Get admin profile |
| GET | `/api/v1/categories` | — | List all categories |
| GET | `/api/v1/categories/slug/:slug` | — | Category details |
| GET | `/api/v1/products` | — | List products (filterable) |
| GET | `/api/v1/products/slug/:slug` | — | Product details + shops |
| GET | `/api/v1/shops` | — | List shops (geo-sortable) |
| GET | `/api/v1/shops/slug/:slug` | — | Shop details + inventory |
| GET | `/api/v1/search?q=...` | — | Unified search |
| GET | `/api/v1/banners` | — | Homepage banners |
| GET | `/api/v1/admin/dashboard` | ✅ | Dashboard stats |
| GET | `/api/v1/admin/activity-logs` | ✅ | Audit trail |
| GET | `/api/v1/admin/reports` | ✅ | Analytics |

---

## 🔑 Admin Login

After seeding, use:
- **Email:** `admin@nellaimart.com`
- **Password:** `Admin@123456`

URL: `http://localhost:5173/admin`

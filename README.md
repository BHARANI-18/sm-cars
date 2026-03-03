# SM Motors - Car Dealership Platform

A modern, responsive full-stack web application designed for a premium car dealership. Built with Next.js (App Router), Tailwind CSS, Node.js, Express, and MongoDB.

## Features

- **Public Facing Website**: Browse cars in a beautiful, responsive grid layout. Detail view for each car with specifications and large imagery.
- **Admin Dashboard**: Secure protected route using JWT HttpOnly cookies for inventory management.
- **Full CRUD**: Admins can add, edit, and delete cars from the inventory.
- **Image Uploads**: Integrated Multer and Cloudinary for seamless image hosting.
- **Sleek UI/UX**: Dark mode support, modern typography, glassmorphism, and smooth transitions built using Tailwind CSS.

---

## Environment Setup

You need to create `.env` files for both the frontend and backend.

### Backend (`/backend/.env`)

```env
PORT=5000
MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.your-cluster.mongodb.net/cardealership
JWT_SECRET=your_super_secret_jwt_key
CLOUDINARY_CLOUD_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
```

### Frontend (`/frontend/.env.local`)

```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

---

## Installation & Running Locally

1. **Install Backend Dependencies**
   ```bash
   cd backend
   npm install
   ```
2. **Start Backend Server**
   ```bash
   npm run start
   # or node server.js
   ```

3. **Install Frontend Dependencies**
   ```bash
   cd frontend
   npm install
   ```
4. **Start Frontend Client**
   ```bash
   npm run dev
   ```

The frontend will be running at `http://localhost:3000` and the backend strictly expects requests from this origin in CORS locally.

### Seeding an Admin Account
To create an initial admin account, send a `POST` request to `http://localhost:5000/api/auth/seed` (can be done via Postman or Curl temporarily).
- **Username**: `admin`
- **Password**: `password123`

---

## Deployment Instructions

### 1. Database (MongoDB Atlas)
- Create a Free Cluster on MongoDB Atlas.
- Add your IP address to the Network Access whitelist (or `0.0.0.0/0` for universal access).
- Copy the Connection String and set it as `MONGODB_URI` in your backend environment variables.

### 2. Image Hosting (Cloudinary)
- Create a free Cloudinary account.
- Copy your `Cloud Name`, `API Key`, and `API Secret`.
- Add them to the backend environment variables.

### 3. Backend (Render / Heroku / Railway)
- Connect your Git repository to the platform.
- Set the Root Directory to `backend` (if supported) or split repos.
- Set Build Command: `npm install`
- Set Start Command: `node server.js`
- **Crucial**: Add all `.env` variables from the backend into the hosting platform's Environment Variables settings.

### 4. Frontend (Vercel)
- Import your repository into Vercel.
- Update the Root Directory to `frontend`.
- Framework Preset should automatically detect "Next.js".
- Add Environment Variable: `NEXT_PUBLIC_API_URL` -> URL of your deployed backend API (e.g., `https://your-backend.onrender.com/api`).
- Click Deploy.

## Author
Generated using Agentic Code Assistant.

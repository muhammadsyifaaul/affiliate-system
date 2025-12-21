# Affiliate Management System

A simple, headless Affiliate Management System built with Django (Backend) and React (Frontend).

## 🚀 Live Demo
- **Frontend**: [Link to your GitHub Pages]
- **Backend API**: [Link to your Railway App]

## 🏗 Architecture
The system follows a headless architecture:
- **Backend**: Django REST Framework serving JSON APIs.
  - Handles Authentication, Commission Logic, and Data Storage.
  - Database: PostgreSQL (via Railway).
- **Frontend**: React SPA.
  - Handles Referrals (grabbing URL params), User Dashboard, and Admin functions.
- **Workflow**: 
  1. Affiliate shares link (`/?ref=CODE`).
  2. Visitor clicks link -> Frontend stores code in LocalStorage.
  3. Visitor buys item -> Frontend sends transaction + ref code to Backend.
  4. Backend calculates 10% commission -> Updates Affiliate balance.

## 🛠 Tech Stack
- Frontend: React, Vite, Vanilla CSS (Premium Dark Mode)
- Backend: Python, Django, Django REST Framework
- Database: PostgreSQL

## 📦 Features
- **Affiliates**: Unique valid referral codes, Real-time commission dashboard, Payout requests.
- **Admin**: Approve/Reject payouts, View all transactions.
- **Public**: "Store" page that automatically tracks referrals.

---

## 🔧 Installation & Setup

### Backend (Django)
1. Navigate to `/backend`
2. Create virtual env: `python -m venv venv`
3. Install deps: `pip install -r requirements.txt`
4. Run migrations: `python manage.py migrate`
5. Create admin: `python manage.py createsuperuser`
6. Run server: `python manage.py runserve`

### Frontend (React)
1. Navigate to `/frontend`
2. Install deps: `npm install`
3. Run dev: `npm run dev`

---

## ☁️ Deployment Guide

### 1. Backend on Railway (Free Tier/Trial)
1. Push this repo to GitHub.
2. Login to [Railway.app](https://railway.app/).
3. Create "New Project" -> "Deploy from GitHub repo".
4. Add a **PostgreSQL** database service in Railway.
5. In Django Service variables, set:
   - `DATABASE_URL`: (Copy from Postgres service)
   - `SECRET_KEY`: (Generate a random string)
   - `DEBUG`: `False`
   - `ALLOWED_HOSTS`: `*` (or your railway URL)
6. Redeploy.

### 2. Frontend on GitHub Pages
1. In `frontend/package.json`, add: `"homepage": "https://<your-username>.github.io/<repo-name>"`
2. Update `src/api.js` with your Railway Backend URL.
3. Build: `npm run build`
4. Deploy using `gh-pages` package or manually upload `dist` folder to tracking branch.r

---

## 🧪 Testing the Flow
1. Login as Admin (`/admin`).
2. Go to Dashboard -> Copy Referral Link.
3. Open Incognito window -> Paste Link.
4. "Buy" a widget.
5. Go back to Admin Dashboard -> Refresh. You should see $$$.

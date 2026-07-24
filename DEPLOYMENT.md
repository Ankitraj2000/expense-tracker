# 🚀 Deployment Guide — Expense Tracker

This guide covers deploying the Expense Tracker to:
- **Frontend** → [Vercel](https://vercel.com)
- **Backend** → [Render](https://render.com)
- **Database** → [Neon](https://neon.tech)

---

## Step 1: Neon PostgreSQL (Database)

1. Go to [neon.tech](https://neon.tech) and sign up (free tier available).
2. Create a new **Project** named `expense-tracker`.
3. Create a new **Database** named `expense_tracker`.
4. Copy your connection string — it looks like:
   ```
   postgresql://user:pass@ep-xxx.us-east-1.aws.neon.tech/expense_tracker?sslmode=require
   ```
5. The JDBC URL format (for Spring Boot) is:
   ```
   jdbc:postgresql://ep-xxx.us-east-1.aws.neon.tech/expense_tracker?sslmode=require
   ```

---

## Step 2: Backend → Render

### Option A: Deploy via Render Web Service

1. Push your project to GitHub.
2. Go to [render.com](https://render.com) → **New** → **Web Service**.
3. Connect your GitHub repository.
4. Set:
   - **Root Directory**: `backend`
   - **Build Command**: `mvn clean package -DskipTests`
   - **Start Command**: `java -jar target/expense-tracker-backend-1.0.0.jar`
   - **Environment**: `Java`

5. Add these **Environment Variables** in Render:

   | Key | Value |
   |-----|-------|
   | `DATABASE_URL` | `jdbc:postgresql://your-neon-host/expense_tracker?sslmode=require` |
   | `DATABASE_USERNAME` | Your Neon username |
   | `DATABASE_PASSWORD` | Your Neon password |
   | `JWT_SECRET` | A strong 256-bit Base64 secret |
   | `CORS_ORIGINS` | `https://your-frontend.vercel.app` |

6. Click **Create Web Service**. Render will build and deploy.
7. Note your backend URL: `https://expense-tracker-api.onrender.com`

### Generate a JWT Secret

Run this in your terminal to generate a secure secret:
```bash
# Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"

# Or use an online tool: https://generate-secret.vercel.app/32
```

---

## Step 3: Frontend → Vercel

1. Go to [vercel.com](https://vercel.com) → **New Project**.
2. Import your GitHub repository.
3. Set:
   - **Root Directory**: `frontend`
   - **Framework Preset**: Vite
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`

4. Add **Environment Variable**:

   | Key | Value |
   |-----|-------|
   | `VITE_API_URL` | `https://expense-tracker-api.onrender.com` |

5. Click **Deploy**. Your app will be live at `https://your-app.vercel.app`.

---

## Step 4: Update CORS

After deployment, update the backend's `CORS_ORIGINS` environment variable in Render to include your Vercel URL:

```
CORS_ORIGINS=https://your-app.vercel.app
```

Then redeploy the backend service.

---

## Local → Production Checklist

- [ ] Neon database created and connection string copied
- [ ] JWT_SECRET is a strong random value (not the dev default)
- [ ] Backend deployed on Render with all env vars set
- [ ] Backend URL confirmed working: `GET /api/auth/login` returns 400 (not 500)
- [ ] Frontend deployed on Vercel with `VITE_API_URL` set to backend URL
- [ ] CORS_ORIGINS in backend includes the Vercel frontend URL
- [ ] End-to-end test: Register → Login → Add transaction → View dashboard

---

## Troubleshooting

### Backend won't start on Render
- Check Render logs for "Flyway" errors — your Neon DB URL may be wrong
- Make sure `?sslmode=require` is included in the JDBC URL

### CORS errors in browser
- The `CORS_ORIGINS` env var must exactly match the frontend origin (no trailing slash)
- Example: `https://expense-tracker.vercel.app` ✅

### 401 Unauthorized
- Make sure the frontend is sending `Authorization: Bearer <token>` header
- The Axios interceptor in `api.js` handles this automatically if the token is in localStorage

### PDF export not working
- PDF is generated entirely in the browser using jsPDF — no backend needed
- Make sure `jspdf` and `html2canvas` are installed: `npm install jspdf html2canvas`

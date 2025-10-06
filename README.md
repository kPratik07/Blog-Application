# 📝 Blog Application

**A modern, secure blog platform where users can create, read, update, and delete their blog posts. Features include JWT authentication, OTP-based password reset via email, and a fully responsive UI.**

---

## ✨ Features

- ✅ User authentication (Signup/Login) with JWT
- ✅ Password reset via OTP email verification
- ✅ Create, read, update, delete blogs
- ✅ User-specific blog management
- ✅ Fully responsive design (mobile, tablet, desktop)
- ✅ Secure API with interceptors and error handling
- ✅ Email enumeration prevention
- ✅ Auto token management

---

## 🛠️ Tech Stack

**Backend:** Node.js, Express.js, MongoDB, JWT, Bcrypt, Nodemailer  
**Frontend:** React, React Router, Vite, Tailwind CSS  
**Email:** Gmail SMTP (500 emails/day free)

---

## 🚀 Quick Start

### Backend Setup

```bash
cd backend
npm install
```

Create `backend/.env`:
```env
MONGODB_URL=your-mongodb-connection-string
JWT_SECRET=your-secret-key
PORT=4000

USE_REAL_EMAIL=true
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-gmail-app-password
EMAIL_FROM=Blog App <your-email@gmail.com>
```

Start server:
```bash
npm start
```

### Frontend Setup

```bash
cd frontend
npm install
```

Create `frontend/.env`:
```env
VITE_API_BASE_URL=http://localhost:4000
```

Start dev server:
```bash
npm run dev
```

Visit: `http://localhost:5173`

---

## 🔑 Gmail Setup

1. Enable 2FA: https://myaccount.google.com/security
2. Generate App Password: https://myaccount.google.com/apppasswords
3. Paste in `backend/.env` (remove spaces)

---

## 📚 API Endpoints

### Authentication
- `POST /signup` - Register new user
- `POST /login` - Login user (returns JWT token)

### Password Reset
- `POST /password/forgot-password` - Send OTP to email
- `POST /password/reset-password` - Reset password with OTP

### Blogs (Requires Auth Token)
- `GET /blogs` - Get user's blogs
- `POST /blogs/create` - Create new blog
- `PATCH /blogs/edit/:blogID` - Update blog
- `DELETE /blogs/delete/:blogID` - Delete blog

---

## 🔒 Security Features

- Password hashing with bcrypt
- JWT token authentication
- OTP expires in 10 minutes
- Email enumeration prevention
- Protected routes with middleware
- CORS protection
- Input validation (frontend & backend)
- Auto logout on 401 errors

---

## 🐛 Troubleshooting

**Email not sending?**
- Verify Gmail App Password is correct (no spaces)
- Check 2FA is enabled on Gmail

**Server won't start?**
- Check if port 4000 is in use
- Verify MongoDB connection string

**Login not working?**
- Clear localStorage
- Check backend JWT_SECRET is set

---

## 📄 License

MIT License

---

**Built with ❤️ using React, Node.js, and MongoDB**

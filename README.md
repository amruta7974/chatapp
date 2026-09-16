# 💬 ChatApp

A real-time full-stack chat application built with the MERN stack and Socket.IO.

ChatApp lets users create accounts, log in securely, search for other users, exchange real-time messages, see online/offline status, view typing indicators, track message delivery/read status, reply to messages, delete messages, and manage their profiles.

---

## 🚀 Features

### 🔐 Authentication
- User signup & login
- JWT-based authentication
- HTTP-only authentication cookie
- Protected backend routes
- Persistent login session
- Logout functionality

### 💬 Real-Time Messaging
- One-to-one messaging
- Real-time delivery via Socket.IO
- Online/offline user status
- Typing indicator
- Sent and delivered message status
- Seen/read message status
- Automatic message scrolling

### 🔎 User & Chat Features
- Search users
- Recent message preview
- Unread message count (persistent)
- Automatically sorted recent conversations

### ↩️ Message Actions
- Reply to messages
- Delete messages (with confirmation modal)
- Message timestamps
- Message options menu

### 👤 Profile
- View and edit profile (full name, email)
- Profile avatar
- Online status indicator

### 🎨 UI
- Responsive, mobile-friendly chat interface
- DaisyUI + Tailwind CSS
- Loading states & toast notifications
- Clean blue/white theme

---

## 🛠️ Tech Stack

**Frontend:** React, React Router, Tailwind CSS, DaisyUI, Zustand, Axios, React Hook Form, React Hot Toast, React Icons, Socket.IO Client, Vite

**Backend:** Node.js, Express.js, MongoDB, Mongoose, JWT, Cookie-based auth, Socket.IO, CORS

**Database:** MongoDB Atlas

---

## 📁 Project Structure

```text
chatapp/
│
├── Backend/
│   ├── controller/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── jwt/
│   ├── SocketIO/
│   ├── index.js
│   ├── package.json
│   ├── .env.example
│   └── .gitignore
│
├── Frontend/
│   ├── public/
│   ├── src/
│   │   ├── Components/
│   │   ├── Home/
│   │   ├── context/
│   │   ├── zustand/
│   │   ├── App.jsx
│   │   ├── AuthProvider.jsx
│   │   └── index.css
│   ├── package.json
│   └── .gitignore
│
└── README.md
```

---

## ⚙️ Prerequisites

- Node.js 20+
- npm
- MongoDB Atlas account
- Git

---

## 🧑‍💻 Local Setup

### 1. Clone the repository

```bash
git clone https://github.com/amruta7974/chatapp.git
cd chatapp
```

### 2. Backend Setup

```bash
cd Backend
npm install
```

Create a `.env` file in `Backend/`:

```env
PORT=5000
MONGO_DB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
CLIENT_URL=http://localhost:5173
```

Start the backend:

```bash
npm start
```

Backend runs on `http://localhost:5000`.

### 3. Frontend Setup

In a new terminal:

```bash
cd Frontend
npm install
npm run dev
```

Frontend runs on `http://localhost:5173`.

---

## 🔑 Environment Variables

The backend uses environment variables for sensitive configuration.

```env
PORT=5000
MONGO_DB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
CLIENT_URL=http://localhost:5173
```

> **Important:** Never commit the real `.env` file to GitHub. Use `.env.example` as the template.

---

## 🔐 Authentication

ChatApp uses JWT-based authentication:

```text
User → Signup/Login → Backend validates credentials → JWT generated
     → Auth cookie set → Protected API requests → Authenticated user
```

The frontend sends credentials with API requests where required, and protected routes are guarded by backend middleware.

---

## 🔌 Real-Time Communication

Socket.IO powers:

- New messages
- Message delivery
- Typing / stop-typing events
- Online/offline status
- Unread message updates
- Seen/read status

```text
User A → Frontend → Socket.IO → Backend → Socket.IO → User B
```

---

## 💾 Database

MongoDB Atlas, with the main collections:

- Users
- Messages
- Conversations

Connection details are stored in environment variables and never committed to the repo.

---

## 📱 Responsive Design

Built with responsive Tailwind CSS utilities to adapt across desktop, laptop, tablet, and mobile.

---

## 🧪 Testing Checklist

**Authentication**
- [ ] Signup works
- [ ] Login works
- [ ] Invalid login shows an error
- [ ] Refresh keeps the user logged in
- [ ] Logout works
- [ ] Protected routes reject unauthenticated requests

**Messaging**
- [ ] User can send messages
- [ ] Receiver gets messages in real time
- [ ] Messages persist after refresh
- [ ] Message timestamps work
- [ ] Recent message preview updates

**Real-Time Features**
- [ ] Online/offline status works
- [ ] Typing indicator works
- [ ] Delivered status works
- [ ] Seen status works

**Message Actions**
- [ ] Reply works, with preview
- [ ] Delete works, with confirmation
- [ ] Deleted message disappears correctly

**User Features**
- [ ] Search users works
- [ ] Unread count works
- [ ] Profile opens, updates, and persists after refresh

**Responsive UI**
- [ ] Desktop, tablet, and mobile layouts work
- [ ] Chat navigation works on mobile
- [ ] No horizontal overflow
- [ ] Message menu works near screen edges

---

## 🌐 Deployment

```text
        ┌─────────────────┐
        │  Vercel          │
        │  Frontend        │
        └────────┬─────────┘
                 │ HTTPS
                 ↓
        ┌─────────────────┐
        │  Render          │
        │  Backend +       │
        │  Socket.IO       │
        └────────┬─────────┘
                 ↓
        ┌─────────────────┐
        │  MongoDB Atlas   │
        │  Database        │
        └─────────────────┘
```

| Layer    | Platform      |
|----------|---------------|
| Frontend | Vercel        |
| Backend  | Render        |
| Database | MongoDB Atlas |

---

## 🔒 Production Security

Before deployment:

- Never commit `.env`
- Use a strong JWT secret
- Use MongoDB credentials securely
- Enable HTTPS
- Configure production CORS, restricted to the production frontend origin
- Configure authentication cookies correctly (`SameSite`, `Secure`, cross-origin settings)
- Never expose database credentials in frontend code

**Example production backend env:**

```env
PORT=10000
MONGO_DB_URI=your_production_mongodb_uri
JWT_SECRET=your_production_jwt_secret
CLIENT_URL=https://your-frontend-domain.vercel.app
```

> The exact `PORT` should follow your deployment platform's requirements (e.g. Render assigns its own).

---

## 🚧 Future Improvements

- Image/file sharing
- Group chats
- Voice messages
- Message reactions & editing
- Push notifications
- End-to-end encryption
- Message pagination
- Advanced search

---

## 👩‍💻 Author

**Amruta Gaikwad**
Computer Science Engineering Student
GitHub: [@amruta7974](https://github.com/amruta7974)

---

⭐ If you find this project useful, consider giving the repository a star.
# Perplexity Clone - AI-Powered Search Engine

A production-ready MERN stack application that replicates the Perplexity AI experience, featuring real-time AI responses, chat history, and authenticated user profiles.

![Screenshot Placeholder](https://via.placeholder.com/1200x600?text=Perplexity+Clone+Dashboard)

## 🚀 Features

- **AI-Powered Search**: Leveraging LangChain and Google/Mistral AI for intelligent responses.
- **Real-Time Communication**: Socket.io integration for seamless AI-human interaction.
- **Authentication**: Secure JWT-based auth with email verification.
- **History & Search**: Comprehensive chat history with live search and pro-search toggles.
- **Responsive UI**: Modern, dark-themed dashboard built with React and Tailwind CSS.
- **Robust Error Handling**: Centralized middleware for consistent backend error reporting.

## 🛠 Tech Stack

- **Frontend**: React 19, Redux Toolkit, Tailwind CSS v4, React Router 7.
- **Backend**: Node.js, Express 5, MongoDB (Mongoose 9).
- **AI/LLM**: LangChain, Google Gemini AI, Mistral AI.
- **Real-time**: Socket.io.
- **Security**: Helmet, Rate Limiting (express-rate-limit), CORS.

## ⚙️ Local Setup

### 1. Clone the repository
```bash
git clone <your-repo-url>
cd perplexity
```

### 2. Install Dependencies
```bash
# Backend
cd Backend
npm install

# Frontend
cd ../Frontend
npm install
```

### 3. Environment Variables
Create a `.env` file in both `Backend` and `Frontend` directories.

**Backend (.env)**
| Variable | Description | Example |
| :--- | :--- | :--- |
| `PORT` | Local server port | `3000` |
| `MONGODB_URI` | MongoDB connection string | `mongodb://localhost:27017/perplexity` |
| `JWT_SECRET` | Secret key for JWT | `your_secret_key` |
| `GOOGLE_API_KEY` | Google AI API Key | `your_google_key` |
| `MISTRAL_API_KEY` | Mistral AI API Key | `your_mistral_key` |
| `MAIL_USER` | Email for verification | `user@example.com` |
| `MAIL_PASS` | Email password/app key | `your_email_password` |

**Frontend (.env)**
| Variable | Description | Example |
| :--- | :--- | :--- |
| `VITE_API_URL` | Backend API Base URL | `http://localhost:3000/api` |

### 4. Run the Application
```bash
# Backend
cd Backend
npm run dev

# Frontend
cd ../Frontend
npm run dev
```

## 🛣 API Endpoints (Overview)

| Method | Endpoint | Description | Auth |
| :--- | :--- | :--- | :--- |
| POST | `/api/auth/register` | Register new user | No |
| POST | `/api/auth/login` | Login user | No |
| GET | `/api/auth/get-me` | Get profile details | Yes |
| GET | `/api/chats` | Fetch chat history | Yes |
| POST | `/api/chats` | Start new AI search | Yes |

## 🚢 Deployment Notes

- **CORS**: Ensure the `origin` in `app.js` is set to your production domain.
- **HTTPS**: Use SSL/TLS for all communications.
- **Rate Limiting**: Adjust `apiLimiter` settings in `rateLimit.middleware.js` based on expected traffic.
- **Process Manager**: Use `pm2` for managing the Node.js lifecycle in production.



# 🎓 LearnPro AI

> A full-stack AI-powered learning platform built with the MERN stack and Tailwind CSS — helping students learn smarter through contextual AI chat, auto-generated flashcards, quizzes, and real-time progress tracking.

<img width="1920" height="882" alt="dashboardLearn" src="https://github.com/user-attachments/assets/627a9094-0e43-43f5-8eb5-b205b8b3c9e4" />
<img width="1920" height="876" alt="documentLearn" src="https://github.com/user-attachments/assets/d0c357b5-5426-433c-a51f-fcd512117f81" />
<img width="1920" height="896" alt="chatLearn" src="https://github.com/user-attachments/assets/92daafae-1f2c-4124-a113-a597e655253b" />
<img width="1920" height="877" alt="SummaryLearn" src="https://github.com/user-attachments/assets/9d880c38-aef2-4a94-b8da-a1046fab90ca" />
<img width="1919" height="883" alt="flashcardLearn" src="https://github.com/user-attachments/assets/4a8a7925-b5bc-4cbb-bc81-da52d2ac5c28" />
<img width="1920" height="886" alt="quizzesLearn" src="https://github.com/user-attachments/assets/0593e835-28b6-476d-a885-62203ede6486" />

---

## 📖 Table of Contents

- [Overview](#-overview)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Environment Variables](#environment-variables)
  - [Running the App](#running-the-app)
- [API Endpoints](#-api-endpoints)
- [Architecture](#-architecture)
- [Contributing](#-contributing)
- [License](#-license)

---

## 🚀 Overview

**LearnPro AI** is a full-stack learning platform that lets students upload PDF documents and instantly unlock AI-powered study tools — contextual chat, automatic summaries, concept explanations, flashcard generation, and quizzes — all powered by **Google Gemini API** (`gemini-2.5-flash-lite`).

PDFs are stored on **Cloudinary** (up to 10MB), processed server-side via `pdf-parse` to extract text, which is then chunked and scored for relevance before being passed to Gemini for intelligent responses.

---

## ✨ Features

### 🤖 AI Learning Assistant (Google Gemini)
- **Contextual Chat** — Ask questions about any uploaded document; relevant text chunks are retrieved and passed as context to Gemini
- **Auto Summary** — Generate a concise document summary with one click
- **Concept Explanation** — Enter any concept and get a detailed, document-grounded explanation
- **Persistent Chat History** — Conversations are saved per document in MongoDB

### 📄 PDF Upload & Management
- Upload PDFs up to **10MB** via Multer + Cloudinary (`multer-storage-cloudinary`)
- Embedded **Google Docs in-browser viewer** — no forced download
- Background text extraction and chunking after upload (status: `processing` → `ready` → `failed`)

### 🧠 AI Flashcard Generator
- Auto-generates **10–20 flashcards** per document using Gemini
- Each card includes question, answer, and difficulty (`easy` / `medium` / `hard`)
- Flip animation, star/favourite toggle, and review count tracking
- Multiple flashcard sets per document

### 📝 AI Quiz Generator
- Generates **multiple-choice quizzes** (configurable question count) from document content
- 4 options per question with correct answer mapping and explanation
- Full submit flow with per-question result, score percentage, and detailed review page

### 📊 Progress Dashboard
- Overview stats: total documents, flashcard sets, flashcards, and quizzes
- Recent activity feed (last accessed documents + quiz attempts) with live timestamps
- Per-set progress bars showing reviewed vs. total flashcard counts

### 🔐 JWT Authentication
- Register / Login with bcrypt-hashed passwords
- JWT stored in `localStorage`, attached via Axios request interceptor
- Protected routes on both frontend (`ProtectedRoute`) and backend (`protect` middleware)
- Profile page with password change support

---

## 🛠 Tech Stack

### Backend (`/backend`)

| Layer | Technology |
|---|---|
| Runtime | Node.js 20+ |
| Framework | Express.js 5 |
| Database | MongoDB + Mongoose 9 |
| AI | `@google/genai` (Gemini 2.5 Flash Lite) |
| Auth | `jsonwebtoken` + `bcryptjs` |
| File Upload | Multer 2 + `multer-storage-cloudinary` |
| File Storage | Cloudinary |
| PDF Parsing | `pdf-parse` (fetches from Cloudinary URL) |
| Validation | `express-validator` |

### Frontend (`/frontend`)

| Layer | Technology |
|---|---|
| Framework | React 19 + Vite 7 |
| Styling | Tailwind CSS 4 |
| Routing | React Router DOM 7 |
| HTTP | Axios (with JWT interceptors) |
| Markdown | `react-markdown` + `remark-gfm` + `react-syntax-highlighter` |
| UI Icons | Lucide React |
| Notifications | `react-hot-toast` |
| Dates | Moment.js |

---

## 📁 Project Structure

```
learnpro-ai/
├── package.json                  # Root scripts (install-all, build, start)
│
├── backend/
│   ├── server.js                 # Express app, CORS, routes, production static serving
│   ├── package.json
│   ├── config/
│   │   ├── db.js                 # MongoDB connection
│   │   ├── cloudinary.js         # Cloudinary SDK config
│   │   └── multer.js             # Multer + CloudinaryStorage (10MB PDF limit)
│   ├── controllers/
│   │   ├── authController.js     # register, login, getProfile, updateProfile, changePassword
│   │   ├── documentController.js # upload, getDocuments, getDocument, deleteDocument
│   │   ├── aiController.js       # generateFlashcards, generateQuiz, generateSummary, Chat, explainConcept, getChatHistory
│   │   ├── flashcardController.js
│   │   ├── quizController.js
│   │   └── progressController.js # getDashboard (aggregated stats + recent activity)
│   ├── middleware/
│   │   ├── auth.js               # JWT protect middleware
│   │   └── errorHandler.js       # Centralised error handler (Mongoose, Multer, Cloudinary, JWT)
│   ├── models/
│   │   ├── User.js               # username, email, bcrypt password
│   │   ├── Document.js           # cloudinaryUrl, cloudinaryPublicId, chunks[], status
│   │   ├── Flashcard.js          # cards[]: question, answer, difficulty, reviewCount, isStarred
│   │   ├── Quiz.js               # questions[], userAnswers[], score, completedAt
│   │   └── ChatHistory.js        # messages[]: role, content, relevantChunks
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── documentRoutes.js
│   │   ├── aiRoutes.js
│   │   ├── flashcardRoutes.js
│   │   ├── quizRoutes.js
│   │   └── progressRoutes.js
│   └── utils/
│       ├── geminiService.js      # Gemini API wrappers (flashcards, quiz, summary, chat, explain)
│       ├── pdfParser.js          # Fetches PDF from Cloudinary URL → extracts text via pdf-parse
│       └── textChunker.js        # chunkText() (500 words, 50 overlap) + findRelevantChunks() (keyword scoring)
│
└── frontend/
    ├── index.html
    ├── vite.config.js
    ├── package.json
    └── src/
        ├── App.jsx               # Routes + auth redirect guard
        ├── main.jsx              # AuthProvider + Toaster
        ├── index.css             # Tailwind 4 + Urbanist Google Font
        ├── context/
        │   └── AuthContext.jsx   # Global auth state synced with localStorage
        ├── services/             # Axios API call wrappers per domain
        │   ├── authService.js
        │   ├── documentService.js
        │   ├── aiService.js
        │   ├── flashcardService.js
        │   ├── quizeService.js
        │   └── progressService.js
        ├── utils/
        │   ├── apiPaths.js       # Centralised API route constants
        │   └── axiosInstance.js  # Axios instance with JWT + error interceptors
        ├── components/
        │   ├── auth/ProtectedRoute.jsx
        │   ├── layout/           # AppLayout, Sidebar (mobile + desktop), Header
        │   ├── common/           # Button, Modal, Spinner, Tabs, PageHeader, EmptyState, MarkdownRender
        │   ├── ai/AIActions.jsx  # Summary + Explain Concept UI
        │   ├── chat/ChatInterface.jsx
        │   ├── documents/DocumentCard.jsx
        │   ├── flashcards/       # Flashcard (flip), FlashcardManager, FlashcardSetCard
        │   └── quizzes/          # QuizCard, QuizManager
        └── pages/
            ├── Auth/             # LoginPage, RegisterPage
            ├── Dashboard/        # DashboardPage (stats + activity feed)
            ├── Documents/        # DocumentListPage, DocumentDetailPage (5-tab layout)
            ├── Flashcards/       # FlashcardsListPage, FlashcardPage
            ├── Quizzes/          # QuizTakePage, QuizResultPage
            └── Profile/          # ProfilePage (view info + change password)
```

---

## 🏁 Getting Started

### Prerequisites

- **Node.js** v20+
- **MongoDB** (local or [MongoDB Atlas](https://www.mongodb.com/cloud/atlas))
- **Cloudinary** account — [cloudinary.com](https://cloudinary.com) (free tier works)
- **Google Gemini API key** — [aistudio.google.com](https://aistudio.google.com/app/apikey)

---

### Installation

**1. Clone the repository**

```bash
git clone https://github.com/your-username/learnpro-ai.git
cd learnpro-ai
```

**2. Install all dependencies**

```bash
npm run install-all
```

Or install each separately:

```bash
cd backend && npm install
cd ../frontend && npm install
```

---

### Environment Variables

Create a `.env` file inside `/backend`:

```env
# Server
PORT=5000
NODE_ENV=development

# MongoDB
MONGODB_URI=your_mongodb_connection_string

# JWT
JWT_SECRET=your_super_secret_jwt_key
JWT_EXPIRE=7d

# Google Gemini
GEMINI_API_KEY=your_gemini_api_key

# Cloudinary
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Frontend URL (for CORS)
CLIENT_URL=http://localhost:5173
```

Create a `.env` file inside `/frontend`:

```env
VITE_SERVER_URL=http://localhost:5000
```

---

### Running the App

**Development — run both servers separately:**

```bash
# Terminal 1 — Backend (nodemon)
cd backend
npm run dev

# Terminal 2 — Frontend (Vite HMR)
cd frontend
npm run dev
```

**Production build:**

```bash
# From the root directory
npm run build    # builds frontend/dist via Vite
npm run start    # starts backend; Express serves frontend/dist in production
```

The frontend runs at **`http://localhost:5173`** and the API at **`http://localhost:5000`**.

> In production, the Express server serves the built React app from `../frontend/dist` and catches all non-API routes with a `/{*splat}` handler to support client-side navigation.

---

## 📡 API Endpoints

All routes are prefixed with `/api`. Protected routes require the header:
```
Authorization: Bearer <jwt_token>
```

### Auth — `/api/auth`

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| `POST` | `/register` | Public | Register new user (username, email, password) |
| `POST` | `/login` | Public | Login, returns JWT + user object |
| `GET` | `/profile` | Protected | Get current user profile |
| `PUT` | `/profile` | Protected | Update username / email |
| `POST` | `/change-password` | Protected | Change password (currentPassword, newPassword) |

### Documents — `/api/documents`

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| `POST` | `/upload` | Protected | Upload PDF (`multipart/form-data`: `file`, `title`) |
| `GET` | `/` | Protected | List all user documents with flashcard & quiz counts |
| `GET` | `/:id` | Protected | Get single document; updates `lastAccessed` |
| `DELETE` | `/:id` | Protected | Delete document + Cloudinary raw file |

### AI — `/api/ai`

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| `POST` | `/generate-flashcards` | Protected | Generate flashcards (`documentId`, optional `count`) |
| `POST` | `/generate-quiz` | Protected | Generate quiz (`documentId`, `numQuestions`, `title`) |
| `POST` | `/generate-summary` | Protected | Summarise document (`documentId`) |
| `POST` | `/chat` | Protected | Chat with document (`documentId`, `question`) |
| `POST` | `/explain-concept` | Protected | Explain concept (`documentId`, `concept`) |
| `GET` | `/chat-history/:documentId` | Protected | Retrieve saved chat messages for a document |

### Flashcards — `/api/flashcards`

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| `GET` | `/` | Protected | Get all flashcard sets for current user |
| `GET` | `/:documentId` | Protected | Get flashcard sets for a specific document |
| `POST` | `/:cardId/review` | Protected | Increment `reviewCount` + update `lastReviewed` |
| `PUT` | `/:cardId/star` | Protected | Toggle `isStarred` on a card |
| `DELETE` | `/:id` | Protected | Delete an entire flashcard set |

### Quizzes — `/api/quizzes`

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| `GET` | `/:documentId` | Protected | Get quizzes for a document |
| `GET` | `/quiz/:id` | Protected | Get a single quiz by ID |
| `POST` | `/:id/submit` | Protected | Submit answers array, calculates & saves score |
| `GET` | `/:id/results` | Protected | Get detailed quiz results with explanations |
| `DELETE` | `/:id` | Protected | Delete a quiz |

### Progress — `/api/progress`

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| `GET` | `/dashboard` | Protected | Aggregated stats + recent 5 documents & quizzes |

---

## 🏗 Architecture

```
┌──────────────────────────────────────────────────────────────┐
│                  FRONTEND  (React 19 + Vite 7)               │
│                                                              │
│  AuthContext → Axios Interceptor (JWT) → API Service Layer   │
│                                                              │
│  Pages: Dashboard | Documents | Flashcards | Quizzes | Profile│
│  Document Detail: Content | Chat | AI Actions | FC | Quiz    │
└───────────────────────┬──────────────────────────────────────┘
                        │ HTTP (REST)
┌───────────────────────▼──────────────────────────────────────┐
│               BACKEND  (Express.js 5, Node.js 20)            │
│                                                              │
│  protect (JWT) → Routes → Controllers → Utils / Services     │
│  Centralised errorHandler (Mongoose, Multer, JWT, Cloudinary) │
└───────────┬──────────────────────────┬───────────────────────┘
            │                          │
┌───────────▼──────────┐  ┌────────────▼────────────────────┐
│  MongoDB (Mongoose)  │  │  External Services               │
│                      │  │                                  │
│  Users               │  │  Cloudinary  (PDF raw storage)   │
│  Documents + Chunks  │  │  Google Gemini API               │
│  Flashcards          │  │    gemini-2.5-flash-lite         │
│  Quizzes             │  │  pdf-parse   (text extraction)   │
│  ChatHistory         │  │                                  │
└──────────────────────┘  └──────────────────────────────────┘
```

### PDF Processing Pipeline

```
1. User uploads PDF (Multer → Cloudinary)
2. Document saved to MongoDB (status: "processing")
3. processPDF() runs async in background:
   a. fetch(cloudinaryUrl) → ArrayBuffer
   b. pdf-parse extracts raw text
   c. chunkText(text, 500 words, 50-word overlap) → chunks[]
   d. Document updated: extractedText, chunks, status: "ready"
4. AI requests use findRelevantChunks():
   - Keyword scoring with stop-word filtering
   - Exact match (+3) and partial match (+1.5) scoring
   - Position bias + multi-word bonus
   - Top 3 chunks passed as context to Gemini
```

---

## 🤝 Contributing

Contributions are welcome!

1. **Fork** the repository
2. **Create** a feature branch: `git checkout -b feature/your-feature`
3. **Commit** your changes: `git commit -m "feat: add your feature"`
4. **Push** to the branch: `git push origin feature/your-feature`
5. **Open** a Pull Request


<div align="center">

Built with ❤️ using the MERN Stack, Google Gemini AI & Cloudinary

[⭐ Star this repo](https://github.com/your-username/learnpro-ai) · [🐛 Report a Bug](https://github.com/your-username/learnpro-ai/issues) · [💡 Request a Feature](https://github.com/your-username/learnpro-ai/issues)

</div>

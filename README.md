# 🧑‍💻 Personal Developer Portfolio

A fully dynamic, responsive, and CMS-driven personal portfolio built with Next.js and MongoDB. This project showcases my skills, experience, projects, education, and certifications. It also features a secure admin dashboard for managing portfolio content and an interactive AI assistant powered by Google Gemini.

## 🔗 Live Demo

[Visit My Portfolio](https://myportfolio-zeta-two-15.vercel.app)

## 📸 Features

- 🔐 **Secure Admin Dashboard** – Authenticated via JWT and HTTP-only cookies
- 🧠 **AI Assistant Chatbot** – Powered by Google Gemini for dynamic Q&A about my portfolio
- 🖼️ **Cloudinary Integration** – Upload and manage images and resume files
- 🛠️ **Dynamic CMS** – Add, update, or delete:
  - Projects
  - Skills
  - Education
  - Experience
  - Certifications
  - Social Links
  - Resume and Profile Info
- 📱 **Responsive Design** – Fully mobile-friendly using Tailwind CSS
- 🌐 **SEO-Ready** – Dynamic meta tags and Open Graph support
- 🚀 **Deployed on Vercel**

## 🧑‍💻 Tech Stack

- **Frontend**: Next.js (TypeScript), Tailwind CSS, React Icons
- **Backend**: Next.js API Routes, Mongoose, JWT Authentication
- **Database**: MongoDB
- **File Storage**: Cloudinary
- **AI Integration**: Google Gemini API
- **Deployment**: Vercel

## 🗃️ Folder Structure
```bash
/pages
/api
/admin // Secure admin routes (CRUD)
/dashboard // Admin CMS views
/ // Public site pages (Home, Projects, etc.)
/components // Reusable UI components
/lib // Utilities (auth, DB connection, etc.)
/models // Mongoose schemas
/public // Static assets
/styles // Global styles
```

## 🔧 Environment Variables

Create a `.env.local` file in the root with:

```bash
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
NEXT_PUBLIC_GEMINI_API_KEY=your_google_gemini_api_key
```

> ⚠️ Keep this file secret and **DO NOT** commit it to GitHub.

## 🚀 Getting Started

1. **Clone the repo**

```bash
git clone https://github.com/yourusername/portfolio-project.git
cd portfolio-project
```

2. **Install dependencies**

```bash
npm install
```
Set up environment variables (.env.local)

3. **Run development server**

```bash
npm run dev
```

4. **Visit**
```bash
http://localhost:3000
```

## 🧠 AI Assistant Setup
Integrated using Google Gemini API

Configured via serverless function and client handler

See /lib/ai/gemini.ts (or your file structure) for implementation

## 📄 License
This project is licensed under the MIT License.

## 📬 Contact
📧 akshayraj7067@gmail.com

🌐 [LinkedIn](https://www.linkedin.com/in/akshay-raj-kushwaha-402021191)

---

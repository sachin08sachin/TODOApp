# QuickTask - TODO App (https://todo-app-cvqj.vercel.app/)

A modern TODO application built with Next.js, React, Node.js, Express, and MongoDB. QuickTask supports user authentication, task management, collaboration, and PWA features for offline support.

---

## Features

- **User Authentication:** Secure sign up, login, and session management using NextAuth.js and JWT.
- **Task Management:** Create, read, update, delete (CRUD) tasks with fields including title, description, due date, priority, completion status.
- **Collaboration:** Share tasks with multiple users by adding collaborators (emails).
- **Real-time Updates:** (If implemented) Tasks update in real-time for all collaborators using WebSockets.
- **Responsive UI:** Mobile-friendly with dark/light theme toggle.
- **Progressive Web App:** Offline capability with service workers, manifest, and caching strategies.
- **Backend API:** Express.js APIs with MongoDB Atlas integration.
- **Form Validation & Error Handling:** Client and server-side input validation, graceful error messages.
- **Code Quality:** TypeScript for type safety, modular CSS and CSS Modules for styling.

---

## Technology Stack

- Tech Stack: React, Next.js, TypeScript, CSS Modules, Tailwind CSS, MongoDB (Atlas)
- Authentication: NextAuth.js with Credentials Provider
- Realtime: WebSocket (Socket.io) 
- PWA: Workbox, service workers, manifest config
- DevOps: Git, Vercel deployment

---

## Setup

## Install dependencies
npm install

## Run development server
npm run dev

## Build for production
npm run build
npm start

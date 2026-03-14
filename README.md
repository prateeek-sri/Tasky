# 🚀 TaskManager - Simple, Secure, Modern

This is a professional-grade Task Management app built with the **latest Next.js (App Router)** and **MongoDB**.

## 💡 Key Features (How to Explain Them)

### 1. Modern Architecture
We use **Next.js 16** with the **App Router**. This means our server and client code live together, making the app faster and easier to deploy (Vercel).

### 2. Double Security (AES + bcrypt)
- **Passwords**: Hashed with `bcrypt` (one-way, can never be reversed).
- **Tasks**: Encrypted with `AES-256-CBC` (two-way). This hides task details in the database but lets the authorized user see them.

### 3. Smart Profile (Base64 Images)
Instead of using complex image servers (like AWS S3), we store the profile picture as a **Base64 String** directly in MongoDB. 
- **Advantage**: It's simple, requires zero extra configuration, and the image loads with the user data.

### 4. Clean API Design
All routes follow a clear pattern:
- Check if user is logged in.
- Connect to DB.
- Perform Action.
- Return success/error.

## 🛠 Tech Stack
- **Next.js 16**
- **MongoDB** (Mongoose)
- **JWT** (Auth)
- **Tailwind CSS** (Styling)

## ⚙️ How to Run
1. Rename `.env.example` to `.env` and add your keys.
2. `npm install`
3. `npm run dev`

---
*Built for performance. Optimized for clarity.*

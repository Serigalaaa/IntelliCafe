# IntelliCafe Setup Guide

## Complete Installation Instructions

### Step 1: Download and Extract
1. Download the ZIP file from v0
2. Extract to a folder on your computer
3. Open the folder in Visual Studio Code

### Step 2: Install Dependencies
Open the terminal in VS Code (View → Terminal) and run:
```bash
npm install --legacy-peer-deps
```

Wait for all packages to install (may take 2-3 minutes).

### Step 3: MongoDB Setup (Optional - Works without it!)

#### Option A: Works Without MongoDB
The app works perfectly with sample data. You can skip MongoDB setup and just run:
```bash
npm run dev
```
Then open http://localhost:3000

#### Option B: Connect to MongoDB Atlas (Recommended for Production)

**1. Create MongoDB Atlas Account:**
   - Go to https://www.mongodb.com/cloud/atlas/register
   - Sign up for FREE account
   - Create a FREE cluster (M0 tier)

**2. Create Database User:**
   - Click "Database Access" → "Add New Database User"
   - Username: `intellicafe_user`
   - Password: choose a secure password (save it!)
   - Privileges: "Read and write to any database"

**3. Whitelist IP Address:**
   - Click "Network Access" → "Add IP Address"
   - Click "Allow Access from Anywhere" (for development)
   - Click "Confirm"

**4. Get Connection String:**
   - Click "Database" → "Connect" → "Connect your application"
   - Copy the connection string
   - Replace `<password>` with your actual password
   - Add `/intellicafe` before the `?` to name your database

   Example:
   ```
   mongodb+srv://intellicafe_user:YourPassword123@cluster0.xxxxx.mongodb.net/intellicafe?retryWrites=true&w=majority
   ```

**5. Add to Your Project:**
   - Rename `.env.local.example` to `.env.local`
   - Paste your connection string:
   ```
   MONGODB_URI=mongodb+srv://intellicafe_user:YourPassword123@cluster0.xxxxx.mongodb.net/intellicafe?retryWrites=true&w=majority
   ```

### Step 4: Run the Application
```bash
npm run dev
```

Open your browser to: **http://localhost:3000**

---

## Features Overview

### 1. Home Page
- Dynamic greeting based on time of day
- Real-time clock
- Hero section with café background
- About section with key features

### 2. Authentication System
**Demo Accounts (without MongoDB):**
- **Admin:** admin@intellicafe.com / admin123
- **Customer:** customer@intellicafe.com / customer123
- **Guest Mode:** Browse without login

**With MongoDB:**
- Real user registration
- Secure password hashing (bcrypt)
- Session management
- Admin and customer roles

### 3. Menu Page
- 21 café items across 4 categories
- Coffee: Espresso, Cappuccino, Latte, Mocha, etc.
- Tea: Green, Earl Grey, Chai Latte, etc.
- Pastries: Croissants, Muffins, Cinnamon Rolls
- Sandwiches & Desserts
- Add to cart functionality
- Category filtering

### 4. Feedback System
- Star rating (1-5 stars)
- Text feedback submission
- Display all feedback with ratings
- Works with/without MongoDB

### 5. Games
**Memory Game:**
- Match café-themed cards
- Score tracking
- Timer

**Categorization Game:**
- Drag-and-drop food items into categories
- 4 categories: Beverages, Main Dishes, Desserts, Salads
- Score system (10 points correct, -5 incorrect)

### 6. AI Chatbot
- Intelligent café assistant
- Answers menu questions
- Provides recommendations
- Handles orders and queries
- Uses AI SDK with OpenAI (optional)
- Fallback to rule-based responses

### 7. Admin Dashboard
- Protected route (admin only)
- Statistics: Total users, orders, revenue
- User management
- Order management
- Menu management

---

## Project Structure

```
intellicafe/
├── app/
│   ├── page.tsx                 # Home page
│   ├── menu/page.tsx            # Menu page
│   ├── feedback/page.tsx        # Feedback page
│   ├── game/page.tsx            # Games page
│   ├── chatbot/page.tsx         # Chatbot page
│   ├── admin/page.tsx           # Admin dashboard
│   └── api/                     # API routes
│       ├── auth/                # Authentication APIs
│       ├── menu/route.ts        # Menu API
│       ├── feedback/route.ts    # Feedback API
│       └── chatbot/route.ts     # Chatbot API
├── components/
│   ├── navigation.tsx           # Main navigation
│   ├── hero-section.tsx         # Hero section
│   ├── auth-modal.tsx           # Login/Signup modal
│   ├── menu-grid.tsx            # Menu display
│   ├── cafe-game.tsx            # Memory game
│   ├── categorization-game.tsx  # Categorization game
│   ├── chat-interface.tsx       # Chatbot UI
│   └── ui/                      # UI components
├── lib/
│   ├── mongodb.ts               # MongoDB connection
│   ├── auth.ts                  # Auth utilities
│   └── db-models.ts             # Data models
├── hooks/
│   └── use-auth.ts              # Auth hook
└── public/                      # Static assets & images
```

---

## Troubleshooting

### Images Not Showing
- Clear browser cache
- Delete `.next` folder and restart server
- Images use placeholder.svg with dynamic generation

### MongoDB Connection Issues
- Check connection string format
- Verify IP is whitelisted
- Check username/password are correct
- App works without MongoDB using sample data

### Port Already in Use
```bash
# Kill process on port 3000
npx kill-port 3000
npm run dev
```

### Dependencies Error
```bash
# Clean install
rm -rf node_modules package-lock.json
npm install --legacy-peer-deps
```

---

## Environment Variables

Required only if using MongoDB or AI features:

```env
# MongoDB (Optional - app works without it)
MONGODB_URI=your_mongodb_connection_string

# OpenAI for Chatbot (Optional - has fallback)
OPENAI_API_KEY=your_openai_api_key
```

---

## Default Credentials (Sample Data Mode)

**Admin Account:**
- Email: admin@intellicafe.com
- Password: admin123

**Customer Account:**
- Email: customer@intellicafe.com
- Password: customer123

**Guest Mode:**
- Click "Guest Mode" to browse without login

---

## Technologies Used

- **Framework:** Next.js 15 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS v4
- **UI Components:** Radix UI + shadcn/ui
- **Database:** MongoDB (optional)
- **Authentication:** Custom JWT + bcrypt
- **AI:** Vercel AI SDK (optional)
- **Icons:** Lucide React

---

## Support

If you encounter issues:
1. Check this guide first
2. Verify all dependencies installed
3. Check terminal for error messages
4. Try deleting `.next` folder and restart

---

## License

This is a university final year project for educational purposes.

---

**Enjoy your IntelliCafe! ☕**

# IntelliCafe - An Interactive and Intelligent Web-based Café System

A modern, full-stack café management system with authentication, AI-powered chatbot, interactive games, and comprehensive admin dashboard.

## Features

### Authentication System
- **Customer Login** - Sign up and login for full access
- **Admin Login** - Special admin dashboard access
- **Guest Mode** - Browse without creating an account
- Session-based authentication with secure cookies

### Core Features
- **Smart Menu** - Browse café menu with categories and cart functionality
- **AI Chatbot** - Powered by OpenAI GPT-4 for intelligent customer assistance
- **Feedback System** - Submit and view customer feedback with star ratings
- **Interactive Games** - Memory card game and food categorization drag-and-drop game
- **Admin Dashboard** - Comprehensive management interface for menu, feedback, and statistics

## Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript
- **Styling**: Tailwind CSS v4, shadcn/ui components
- **Database**: MongoDB
- **Icons**: Lucide React
- **AI**: Vercel AI SDK

## Getting Started

### Prerequisites

- Node.js 18+ installed
- npm or yarn package manager
- MongoDB database (local or MongoDB Atlas)

### Installation

1. Clone the repository or download the ZIP file

2. Install dependencies:
```bash
npm install --legacy-peer-deps
npm install recharts date-fns --legacy-peer-deps```

3. Set up environment variables:
   - Copy `.env.local.example` to `.env.local`
   - Add your MongoDB connection string:
```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/intellicafe
```

4. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

## MongoDB Setup

### Option 1: MongoDB Atlas (Cloud - Recommended)

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free account and cluster
3. Create a database user
4. Get your connection string
5. Add it to `.env.local`

### Option 2: Local MongoDB

1. Install MongoDB locally
2. Start MongoDB service
3. Use connection string: `mongodb://localhost:27017/intellicafe`

## Database Collections

The application uses these MongoDB collections:

- `users` - User accounts and authentication
- `menu_items` - Café menu items
- `orders` - Customer orders
- `feedback` - Customer feedback and ratings

## Authentication Credentials

### Demo Accounts
- **Admin Account**
  - Email: `admin@intellicafe.com`
  - Password: `admin123`
  - Access: Full admin dashboard

- **Customer Account**
  - Email: `customer@example.com`
  - Password: `password123`
  - Access: Regular customer features

- **Guest Mode**
  - No login required
  - Limited access (1-day session)

## Pages

- `/` - Home page with hero section
- `/menu` - Browse and order menu items
- `/feedback` - Submit and view feedback
- `/game` - Interactive games (Memory & Categorization)
- `/chatbot` - AI assistant chatbot
- `/admin` - Admin dashboard (requires login)

## API Routes

- `GET/POST /api/menu` - Menu items management
- `GET/POST /api/feedback` - Feedback management
- `POST /api/chatbot` - Chatbot responses
- `GET /api/admin/stats` - Admin statistics

## Deployment

### Deploy to Vercel

1. Push your code to GitHub
2. Import your repository in Vercel
3. Add environment variables in Vercel dashboard
4. Deploy!

## Development Notes

- The app uses sample data if MongoDB is not connected
- All API routes have fallback data for testing
- Mobile-responsive design with Tailwind CSS
- Smooth animations and transitions throughout

## Key Features Explained

### Authentication Flow
1. Users click Login/Signup on home page
2. Modal opens with login/signup tabs
3. Credentials validated against user database
4. Session cookie created with 7-day expiry
5. User redirected based on role (admin → dashboard, customer → menu)

### AI Chatbot
- Powered by OpenAI GPT-4 via Vercel AI SDK
- Context-aware responses about café services
- Falls back to rule-based responses if AI unavailable
- Remembers conversation context

### Admin Dashboard
- View statistics (total orders, revenue, feedback)
- Manage menu items (add, edit, delete)
- Review customer feedback
- Protected route (admin role required)

### Guest Mode
- Temporary session (24 hours)
- Access to menu, feedback, game, chatbot
- No admin access or order history
- Can upgrade to full account

## Technologies Used

- **Next.js 15** - React framework with App Router
- **React 19** - UI library
- **TypeScript** - Type safety
- **Tailwind CSS v4** - Utility-first styling
- **shadcn/ui** - Component library
- **Vercel AI SDK** - AI integration
- **MongoDB** - Database (optional)
- **Geist Font** - Modern typography

## License

This is a university final year project prototype.

## Support

For issues or questions, please refer to the documentation or contact the development team.

---

Built with ❤️ using v0 by Vercel

Package json edit scripts:
  "scripts": {
    "build": "next build",
    "dev": "next dev",
    "lint": "next lint",
    "start": "next start"
    )
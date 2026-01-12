import { cookies } from "next/headers";
import mongoose from "mongoose";
import bcrypt from "bcrypt";

// --- 1. CONFIGURATION ---
const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/intellicafe";

// --- 2. TYPES ---
export interface User {
  id: string;
  email: string;
  name: string;
  role: "customer" | "admin" | "guest";
  createdAt: Date;
}

export interface AuthSession {
  user: User;
  expiresAt: Date;
}

// --- 3. MONGOOSE SCHEMA & MODEL ---
const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  password: { type: String, required: true },
  role: { type: String, required: true, default: "customer" },
  createdAt: { type: Date, default: Date.now },
});

// FIX: Check if model exists before creating it (Prevents OverwriteModelError)
const UserModel = mongoose.models.User || mongoose.model("User", userSchema);

// --- 4. DATABASE CONNECTION HELPER ---
const connectDB = async () => {
  if (mongoose.connection.readyState >= 1) return;
  try {
    await mongoose.connect(MONGODB_URI);
    console.log("Connected to MongoDB");
  } catch (err) {
    console.error("MongoDB Connection Error:", err);
  }
};

// --- 5. AUTH FUNCTIONS ---

export async function login(
  email: string,
  pass: string
): Promise<{ success: boolean; user?: User; error?: string }> {
  await connectDB();

  const mongoUser = await UserModel.findOne({ email });

  if (!mongoUser) {
    return { success: false, error: "Invalid email or password" };
  }

  const isMatch = await bcrypt.compare(pass, mongoUser.password);

  if (!isMatch) {
    return { success: false, error: "Invalid email or password" };
  }

  const user: User = {
    id: mongoUser._id.toString(),
    email: mongoUser.email,
    name: mongoUser.name,
    role: mongoUser.role as "customer" | "admin",
    createdAt: mongoUser.createdAt,
  };

  // Create session cookie
  await createSessionCookie(user);

  return { success: true, user };
}

export async function signup(
  email: string,
  password: string,
  name: string
): Promise<{ success: boolean; user?: User; error?: string }> {
  await connectDB();

  try {
    const existingUser = await UserModel.findOne({ email });
    if (existingUser) {
      return { success: false, error: "Email already exists" };
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUserDoc = await UserModel.create({
      email,
      name,
      password: hashedPassword,
      role: "customer",
    });

    const newUser: User = {
      id: newUserDoc._id.toString(),
      email: newUserDoc.email,
      name: newUserDoc.name,
      role: newUserDoc.role as "customer",
      createdAt: newUserDoc.createdAt,
    };

    // Create session cookie
    await createSessionCookie(newUser);

    return { success: true, user: newUser };
  } catch (error) {
    console.error("Signup error:", error);
    return { success: false, error: "Signup failed" };
  }
}

// --- 6. SESSION MANAGEMENT (Fixes "getSession not found") ---

async function createSessionCookie(user: User) {
  const cookieStore = await cookies();
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days
  
  const sessionData = JSON.stringify({ user, expiresAt });
  
  cookieStore.set("session", sessionData, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    expires: expiresAt,
    path: "/",
  });
}

export async function getSession(): Promise<AuthSession | null> {
  const cookieStore = await cookies();
  const sessionData = cookieStore.get("session");

  if (!sessionData) return null;

  try {
    const session: AuthSession = JSON.parse(sessionData.value);
    if (new Date(session.expiresAt) < new Date()) {
      return null;
    }
    return session;
  } catch {
    return null;
  }
}

export async function logout(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete("session");
}

// --- 7. GUEST MODE (Fixes "createGuestSession not found") ---
export async function createGuestSession(): Promise<User> {
  const guestUser: User = {
    id: `guest-${Date.now()}`,
    email: "guest@intellicafe.com",
    name: "Guest User",
    role: "guest",
    createdAt: new Date(),
  };

  await createSessionCookie(guestUser);
  return guestUser;
}

/*
import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

// 1. Connection (Replace with your connection string)
const uri = "mongodb://localhost:27017/intellicafe"; 

// 2. Define the Schema based on your JSON
const userSchema = new mongoose.Schema({
  email: { type: String, required: true },
  name: { type: String, required: true },
  password: { type: String, required: true },
  role: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  // __v is added automatically by Mongoose
});

const User = mongoose.model('User', userSchema);

const seedUsers = async () => {
  try {
    await mongoose.connect(uri);
    console.log("Connected to MongoDB...");

    // 3. Hash the passwords
    const saltRounds = 10;
    const adminHash = await bcrypt.hash("admin123", saltRounds);
    const customerHash = await bcrypt.hash("password123", saltRounds);

    // 4. Create the User Array
    const users = [
      {
        email: "admin@intellicafe.com",
        name: "System Admin",
        password: adminHash, // Storing the hashed version
        role: "admin",
        createdAt: new Date()
      },
      {
        email: "customer@example.com",
        name: "John Doe",
        password: customerHash, // Storing the hashed version
        role: "customer",
        createdAt: new Date()
      }
    ];

    // 5. Insert into Database
    await User.insertMany(users);
    console.log("Users created successfully!");

  } catch (error) {
    console.error("Error creating users:", error);
  } finally {
    mongoose.connection.close();
  }
};

seedUsers();

*/

// Hardcode
/*
import { cookies } from "next/headers"

export interface User {
  id: string
  email: string
  name: string
  role: "customer" | "admin" | "guest"
  createdAt: Date
}

export interface AuthSession {
  user: User
  expiresAt: Date
}

// Simulated user database (replace with MongoDB in production)
const users: User[] = [
  {
    id: "1",
    email: "admin@intellicafe.com",
    name: "Admin User",
    role: "admin",
    createdAt: new Date("2024-01-01"),
  },
  {
    id: "2",
    email: "customer@example.com",
    name: "John Doe",
    role: "customer",
    createdAt: new Date("2024-01-15"),
  },
]

// Simulated password storage (in production, use bcrypt with MongoDB)
const passwords: Record<string, string> = {
  "admin@intellicafe.com": "admin123",
  "customer@example.com": "password123",
}

export async function getSession(): Promise<AuthSession | null> {
  const cookieStore = await cookies()
  const sessionData = cookieStore.get("session")

  if (!sessionData) {
    return null
  }

  try {
    const session: AuthSession = JSON.parse(sessionData.value)

    // Check if session is expired
    if (new Date(session.expiresAt) < new Date()) {
      return null
    }

    return session
  } catch {
    return null
  }
}

export async function login(
  email: string,
  password: string,
): Promise<{ success: boolean; user?: User; error?: string }> {
  // Find user
  const user = users.find((u) => u.email === email)

  if (!user) {
    return { success: false, error: "Invalid email or password" }
  }

  // Check password
  if (passwords[email] !== password) {
    return { success: false, error: "Invalid email or password" }
  }

  return { success: true, user }
}

export async function signup(
  email: string,
  password: string,
  name: string,
): Promise<{ success: boolean; user?: User; error?: string }> {
  // Check if user already exists
  if (users.find((u) => u.email === email)) {
    return { success: false, error: "Email already exists" }
  }

  // Create new user
  const newUser: User = {
    id: (users.length + 1).toString(),
    email,
    name,
    role: "customer",
    createdAt: new Date(),
  }

  users.push(newUser)
  passwords[email] = password

  return { success: true, user: newUser }
}

export async function createGuestSession(): Promise<User> {
  return {
    id: `guest-${Date.now()}`,
    email: "guest@intellicafe.com",
    name: "Guest User",
    role: "guest",
    createdAt: new Date(),
  }
}

export async function logout(): Promise<void> {
  const cookieStore = await cookies()
  cookieStore.delete("session")
}

export async function requireAuth(): Promise<User> {
  const session = await getSession()

  if (!session) {
    throw new Error("Unauthorized")
  }

  return session.user
}

export async function requireAdmin(): Promise<User> {
  const user = await requireAuth()

  if (user.role !== "admin") {
    throw new Error("Forbidden: Admin access required")
  }

  return user
}
*/
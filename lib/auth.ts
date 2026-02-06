import { cookies } from "next/headers";
import mongoose from "mongoose";
import bcrypt from "bcryptjs"; // Make sure to install bcryptjs: npm install bcryptjs

// --- 1. CONFIGURATION ---
const MONGODB_URI = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/intellicafe";

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
  phone: { type: String }, // Added phone support
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
  name: string,
  phone: string // Added phone
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
      phone,
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

// --- 6. SESSION MANAGEMENT ---

async function createSessionCookie(user: User) {
  const cookieStore = await cookies();
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days
  
  const sessionData = JSON.stringify({ user, expiresAt });
  
  cookieStore.set("session", sessionData, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    expires: expiresAt
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
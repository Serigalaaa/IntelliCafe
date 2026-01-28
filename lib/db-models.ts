export interface User {
  _id?: string
  email: string
  password: string
  name: string
  // Add this line to match your DB Schema
  phone: string 
  role: "user" | "admin"
  createdAt: Date
}

export interface MenuItem {
  _id?: string
  name: string
  description: string
  price: number
  category: "coffee" | "mains" | "sides" | "desserts" | "entree" | "add-on"
  image: string
  available: boolean
}

export interface Order {
  _id?: string
  userId: string
  items: {
    menuItemId: string
    quantity: number
    price: number
  }[]
  total: number
  status: "pending" | "preparing" | "ready" | "completed"
  createdAt: Date
}

export interface Feedback {
  _id?: string
  userId?: string
  name: string
  email: string
  rating: number
  message: string
  createdAt: Date
}
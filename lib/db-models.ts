export interface User {
  _id?: string
  email: string
  password: string
  name: string
  role: "user" | "admin"
  createdAt: Date
}

export interface MenuItem {
  _id?: string
  name: string
  description: string
  price: number
  category: "coffee" | "tea" | "pastry" | "sandwich" | "dessert"
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

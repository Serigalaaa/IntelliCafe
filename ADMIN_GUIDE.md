# IntelliCafe Admin Guide

## Changing User Credentials

### How to Add/Edit Users and Passwords

**File to edit:** `lib/auth.ts`

### Adding a New User

1. Open `lib/auth.ts`
2. Find the `users` array (around line 14)
3. Add a new user object:

```typescript
{
  id: "3",  // Increment the ID
  email: "yourname@example.com",
  name: "Your Name",
  role: "customer",  // or "admin"
  createdAt: new Date(),
}
```

### Changing Passwords

1. Find the `passwords` object (around line 28)
2. Add or modify the password:

```typescript
const passwords: Record<string, string> = {
  "admin@intellicafe.com": "newadminpass",  // Change admin password
  "customer@example.com": "newcustomerpass",  // Change customer password
  "yourname@example.com": "yourpassword",  // Add new user password
}
```

### Default Credentials

**Admin Account:**
- Email: `admin@intellicafe.com`
- Password: `admin123`
- Role: admin (full access)

**Customer Account:**
- Email: `customer@example.com`
- Password: `password123`
- Role: customer

### Important Notes

- This is a demo system using simulated data
- For production, passwords should be hashed with bcrypt
- When MongoDB is connected, users will be stored in the database
- Guest mode doesn't require credentials

## Café Location

The café location has been set to:
**Juwita Kopi, Sutera Square, Masjid, Taman Sutera, 43000 Kajang, Selangor**

This information is now:
- Displayed under the chatbot interface
- Included in the AI chatbot's knowledge base
- Available as a fallback response

Customers can ask the chatbot about the location and get directions via Google Maps.

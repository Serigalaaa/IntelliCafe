# IntelliCafe Admin Guide

## User Management Overview

The IntelliCafe system uses a database-driven user management approach. User accounts are handled dynamically using MongoDB and API routes. There is no need to manually edit source files to create or update users.

---

## Adding Users

### Method 1: Sign Up via Website (Recommended)

1. Open the IntelliCafe website
2. Click **Sign Up**
3. Enter:
   - Name
   - Email
   - Phone number
   - Password
4. The user account will be automatically stored in MongoDB

Passwords are securely hashed using bcrypt before being saved.

---

## Admin Account

### Default Admin (Seeded Automatically)

When the server starts and MongoDB is connected for the first time, a default admin account is created automatically.

**Admin Credentials**
- Email: `admin@admin.com`
- Password: `admin123`
- Role: Admin

> ⚠️ This account is for development and demonstration purposes only.

---

## Editing or Managing Users

Users can be managed through:
- MongoDB Compass (manual editing)
- Admin dashboard (if enabled)

To edit users manually:
1. Open **MongoDB Compass**
2. Select database: `intellicafe`
3. Open collection: `users`
4. Modify user details such as role or email

---

## Guest Mode

Guest mode allows users to access the system without registering.

Guest users can:
- Browse menu
- Play games
- Use chatbot
- Submit feedback

Guest users cannot:
- Access admin dashboard
- Perform administrative actions

---

## Café Location Information

Café location configured in the system:

**JuwitaKopi**  
Sutera Square, Kajang, Selangor

This information is available through the chatbot when users ask about café location or directions.

# Menu Images Guide

## How to Replace Menu Images

All menu item images are stored in this `public/images/` folder.

### Steps to Add Your Own Images:

1. **Add your image file** to this folder (e.g., `my-espresso.jpg`)
2. **Open** `app/api/menu/route.ts`
3. **Find the menu item** you want to update (search for the item name)
4. **Change the image path**:
   ```typescript
   image: "/images/my-espresso.jpg"  // Use your filename
   ```

### Image Requirements:

- **Format**: JPG, PNG, or WebP
- **Size**: Recommended 400x400px or similar square ratio
- **File naming**: Use lowercase with hyphens (e.g., `espresso-coffee.jpg`)

### Example:

To replace the Espresso image:
1. Add your image: `public/images/my-espresso.jpg`
2. In `app/api/menu/route.ts`, find:
   ```typescript
   {
     name: "Espresso",
     image: "/images/espresso.jpg",  // Change this line
   }
   ```
3. Update to:
   ```typescript
   {
     name: "Espresso",
     image: "/images/my-espresso.jpg",  // Your new image
   }
   ```

The changes will appear immediately when you refresh the browser!

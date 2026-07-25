# User Roles Implementation Plan

## Summary
Add role differentiation (`"artist"` | `"user"`) to the signup flow and throughout the app.

## Changes

### 1. `src/context/AppContext.js`
- Add `role: "artist"` to `createArtistAccount()` output
- Add new `createUserAccount({ name, email, password })` function returning `{ id, name, email, role: "user", avatar }`
- Expose `createUserAccount` in context value

### 2. `src/app/signup/page.js`
- Add Step 0: Role selection with two cards (Artist / User)
- Artist: existing 3-step flow + submit → calls `createArtistAccount()` → redirect `/artist/{slug}`
- User: simplified single-step (name, email, password) → calls `createUserAccount()` → redirect `/`
- Dynamic title/desc based on role

### 3. `src/app/signup/SignupPage.module.css`
- Add `.roleGrid`, `.roleCard`, `.roleIcon`, `.roleTitle`, `.roleDesc`, `.selectedCard`, `.gridRow2` styles

### 4. `src/components/Navbar/Navbar.js`
- Check `currentUser.role` in dropdown:
  - Artist: "My Artist Profile", "Submit New Artwork", "My Orders", "Log Out"
  - User: "My Orders", "My Wishlist", "Log Out"
- Mobile menu: same logic

### 5. `src/components/ArtistChatModal/ArtistChatModal.js`
- Import `useApp`
- If `currentUser?.id === artist.id`: render placeholder "This is your own profile" instead of chat UI

### 6. `src/app/artist/[id]/page.js`
- Import `useApp`, get `currentUser`
- Disable "Chat & Commission" button and show "This is you" when `currentUser?.id === artist.id`

### 7. `src/app/artists/page.js`
- Update CTA to "Join as Artist" (keep as is, already correct but clarify)

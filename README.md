# 📚 Books Shop

A modern Books Shop management application built with **Next.js**, **React**, and **TailwindCSS**.

## Features

- 🔐 **Authentication** - Login/logout with secure sessions
- 👤 **User Profile** - View and edit profile (name, email)
- 📚 **Books Management** - Create, read, update, delete books
- 🛍️ **Books Shop** - Browse all books with pagination
- 📖 **My Books** - Manage your personal books
- 🔍 **Search & Filter** - Search by title, filter by category and price range
- 📊 **Sorting** - Sort books A-Z or Z-A
- 🔔 **Notifications** - Toast notifications for user actions

## Quick Start

### Prerequisites

- Node.js 18+
- npm 9+

### Installation

```bash
# Clone repository
git clone https://github.com/walidmouss/books-shop-frontend.git
cd books-shop-frontend

# Install dependencies
npm install
```

### Development

```bash
# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Login Credentials

```
Email: admin@books.com
Password: admin123
```

### view on Vercel

just go to the following link : [Vercel](https://books-shop-frontend-seven.vercel.app/login)

## Available Commands

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm start            # Start production server
npm test -- --run    # Run tests
npm run lint         # Check for linting errors
npm run format       # Format code with Prettier
```

## Project Structure

```
app/
  ├── (auth)/         # Authentication pages
  ├── (dashboard)/    # Protected pages (books, my-books)
  ├── profile/        # User profile pages
  └── api/            # API endpoints

components/
  ├── books/          # Book-related components
  ├── forms/          # Form components
  ├── layout/         # Layout components (Navbar, etc.)
  └── ui/             # Reusable UI components

lib/
  ├── mocks/          # Mock data
  ├── queries/        # React Query hooks
  └── validators/     # Zod validation schemas

tests/               # Test files
```

## Tech Stack

- **Framework:** Next.js 16.1.1
- **UI:** React 19.2.3
- **Styling:** TailwindCSS 4.0
- **Language:** TypeScript 5.x
- **State:** React Query v5
- **Forms:** React Hook Form + Zod
- **Testing:** Vitest + React Testing Library

## Key Pages

### Books Shop (`/books`)

- View all available books
- Search, filter (category, price), and sort
- Pagination (12 items per page)
- View, edit (if author), delete (if author) actions

### My Books (`/my-books`)

- View only your created books
- Create new book button
- Same search, filter, sort, pagination as Books Shop

### Book Details (`/books/:id`)

- Full book information
- Edit (author only) and Delete (author only) actions

### Create Book (`/books/new`)

- Form to create new book
- Categories: Technology, Science, History, Fantasy, Biography
- Form validation with React Hook Form + Zod

### User Profile (`/profile`)

- View profile information
- Edit button to update name and email

## Testing

```bash
# Run all tests
npm test -- --run

# Run in watch mode
npm run test
```

**Test Status:** 81/81 tests passing ✅

## Code Quality

```bash
# Lint code
npm run lint

# Format code
npm run format
```

**Status:** 0 linting errors ✅

## API Endpoints

- `POST /api/auth/login` - Login
- `POST /api/auth/logout` - Logout
- `GET /api/profile` - Get user profile
- `PUT /api/profile` - Update profile
- `GET /api/books` - List all books (with filters)
- `GET /api/books/:id` - Get book details
- `POST /api/books` - Create book
- `PUT /api/books/:id` - Update book
- `DELETE /api/books/:id` - Delete book
- `GET /api/books/my-books` - List user's books

## Deployment

### Build for Production

```bash
npm run build
npm start
```

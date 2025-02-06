# 🍫 Odin Chocolate - Premium Norse-Themed eCommerce

A Next.js-powered eCommerce platform for Odin Chocolate, featuring a Norse-inspired design and premium user experience.

## ✨ Features

- **Product Showcase**: Browse our artisanal Norse-themed chocolates
- **User Accounts**: Secure authentication and profile management
- **Shopping Experience**: Smooth cart and checkout process
- **Subscription Service**: Regular chocolate deliveries
- **Admin Dashboard**: Complete product and order management
- **Norse Design**: Immersive UI with Viking-inspired elements

## 🛠 Tech Stack

- **Frontend**: Next.js 14 with App Router
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **Backend**: PostgreSQL with Prisma ORM
- **Auth**: NextAuth.js
- **Language**: TypeScript

## 🚀 Getting Started

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   # or
   bun install
   ```
3. Set up your PostgreSQL database and update the connection string in `.env`
4. Run the database migrations:
   ```bash
   npx prisma migrate dev
   ```
5. Run the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   # or
   bun dev
   ```
6. Open [http://localhost:3000](http://localhost:3000)

## 📁 Project Structure

```
src/
├── app/                 # Next.js App Router pages
├── components/          # Reusable UI components
├── lib/                 # Utilities and helpers
│   ├── auth/           # Authentication services
│   ├── db.ts           # Prisma client
│   └── mock/           # Mock data for development
├── styles/             # Global styles
└── types/              # TypeScript type definitions
```

## 🎨 Design System

- Norse-inspired color palette
- Premium animations and transitions
- Responsive design for all devices
- Accessibility-first approach

## 🔒 Environment Variables

Create a `.env` file with:

```
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/odin_chocolate"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-generated-secret"
```

## 📝 License

[MIT](LICENSE)

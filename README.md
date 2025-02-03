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
- **Backend**: Appwrite (Auth, Database, Storage)
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
3. Run the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   # or
   bun dev
   ```
4. Open [http://localhost:3000](http://localhost:3000)

## 📁 Project Structure

```
src/
├── app/                 # Next.js App Router pages
├── components/          # Reusable UI components
├── lib/                 # Utilities and helpers
│   ├── appwrite/       # Appwrite client & services
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

Create a `.env.local` file with:

```
NEXT_PUBLIC_APPWRITE_ENDPOINT=your-appwrite-endpoint
NEXT_PUBLIC_APPWRITE_PROJECT_ID=your-project-id
```

## 📝 License

[MIT](LICENSE)

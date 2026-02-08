# Takaful - Charity Organization Web Platform & PWA

A modern, secure, and scalable bilingual (Arabic/French) web platform and Progressive Web Application for charity organizations.

## 🌟 Features

### Public Features
- ✅ Browse news and announcements without authentication
- ✅ Filter announcements by category (Food, Medicine, Clothing, Funeral)
- ✅ View urgent cases with real-time indicators
- ✅ Share content on social media
- ✅ Contact form for inquiries
- ✅ Full bilingual support (Arabic RTL / French LTR)
- ✅ Progressive Web App (PWA) - installable on mobile devices

### Admin Features
- 🔐 Secure authentication
- 📝 Create, edit, and delete news and announcements
- 🖼️ Image upload and management
- ⚡ Mark content as urgent
- 🌐 Manage bilingual content
- 📊 Dashboard with statistics

## 🛠️ Tech Stack

- **Frontend**: Next.js 16 (App Router)
- **Styling**: Tailwind CSS with custom design system
- **Backend**: Next.js API Routes
- **Database**: PostgreSQL
- **ORM**: Prisma
- **Authentication**: NextAuth.js
- **Internationalization**: next-intl
- **PWA**: next-pwa
- **Icons**: Lucide React

## 📦 Installation

### Prerequisites
- Node.js 18+ and npm
- PostgreSQL database

### Setup Steps

1. **Clone and navigate to the project**
   ```bash
   cd /path/to/Takaful
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   
   Update `.env` file with your database credentials:
   ```env
   DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DATABASE?schema=public"
   NEXTAUTH_SECRET="your-secret-key-here"
   NEXTAUTH_URL="http://localhost:3000"
   NEXT_PUBLIC_APP_URL="http://localhost:3000"
   ```

4. **Initialize the database**
   ```bash
   npx prisma generate
   npx prisma db push
   ```

5. **Seed initial admin user (optional)**
   ```bash
   npx prisma db seed
   ```

6. **Run development server**
   ```bash
   npm run dev
   ```

7. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🗂️ Project Structure

```
Takaful/
├── prisma/
│   └── schema.prisma          # Database schema
├── public/
│   ├── icons/                 # PWA icons
│   └── manifest.json          # PWA manifest
├── src/
│   ├── app/
│   │   ├── [locale]/          # Localized routes
│   │   │   ├── layout.tsx     # Locale layout
│   │   │   ├── page.tsx       # Homepage
│   │   │   ├── news/          # News pages
│   │   │   ├── announcements/ # Announcements pages
│   │   │   ├── contact/       # Contact page
│   │   │   └── admin/         # Admin dashboard
│   │   ├── api/               # API routes
│   │   ├── globals.css        # Global styles
│   │   └── layout.tsx         # Root layout
│   ├── components/            # React components
│   │   ├── Header.tsx
│   │   ├── Footer.tsx
│   │   └── ...
│   ├── lib/                   # Utilities
│   │   ├── prisma.ts          # Prisma client
│   │   └── utils.ts           # Helper functions
│   ├── i18n/                  # Internationalization
│   │   └── request.ts         # i18n config
│   ├── messages/              # Translation files
│   │   ├── ar.json            # Arabic translations
│   │   └── fr.json            # French translations
│   └── middleware.ts          # Next.js middleware
├── .env                       # Environment variables
├── next.config.ts             # Next.js configuration
├── package.json
└── README.md
```

## 🎨 Design System

The platform features a modern design system with:

- **Color Palette**: 
  - Primary: Emerald green (#10b981)
  - Secondary: Blue (#3b82f6)
  - Accent: Amber (#f59e0b)
  - Urgent: Red (#ef4444)

- **Typography**:
  - Arabic: Cairo font family
  - French/English: Inter font family

- **Animations**:
  - Smooth transitions
  - Hover effects
  - Loading states
  - Micro-interactions

- **Responsive Design**:
  - Mobile-first approach
  - Breakpoints: sm, md, lg, xl
  - Touch-friendly interfaces

## 🔒 Security Features

- ✅ HTTPS encryption (in production)
- ✅ Secure password hashing with bcrypt
- ✅ Protected admin routes
- ✅ Input validation and sanitization
- ✅ CSRF protection
- ✅ Rate limiting (to be implemented)

## 🌐 Internationalization

The platform supports two languages:

- **Arabic (ar)**: Primary language, RTL layout
- **French (fr)**: Secondary language, LTR layout

Language switching is available globally via the header.

## 📱 PWA Features

- ✅ Installable on mobile devices
- ✅ Offline support
- ✅ App-like experience
- ✅ Custom splash screens
- ✅ Responsive icons

## 🚀 Deployment

### Build for Production

```bash
npm run build
npm start
```

### Environment Variables for Production

Update the following in your production environment:

```env
DATABASE_URL="your-production-database-url"
NEXTAUTH_SECRET="strong-random-secret"
NEXTAUTH_URL="https://yourdomain.com"
NEXT_PUBLIC_APP_URL="https://yourdomain.com"
```

### Recommended Hosting Platforms

- Vercel (recommended for Next.js)
- Netlify
- Railway
- DigitalOcean App Platform

## 📊 Database Schema

### Models

- **User**: Admin users with authentication
- **News**: News articles (bilingual)
- **Announcement**: Solidarity announcements (bilingual, categorized)
- **ContactSubmission**: Contact form submissions
- **Settings**: Application settings

### Categories

- FOOD: Food distribution
- MEDICINE: Medicine sharing
- CLOTHING: Clothing donations
- FUNERAL: Funeral support

## 🔄 Future Enhancements

- [ ] Online donation system
- [ ] Volunteer accounts and management
- [ ] Email notifications
- [ ] Push notifications
- [ ] Analytics dashboard
- [ ] Advanced search and filtering
- [ ] Multi-image support for announcements
- [ ] Comment system
- [ ] Newsletter subscription

## 📝 License

This project is licensed under the MIT License.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📧 Contact

For questions or support, please contact: contact@takaful.org

---

**Made with ❤️ for humanity**

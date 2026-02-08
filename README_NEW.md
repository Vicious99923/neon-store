# 🌟 NEON Store - Modern E-Commerce Platform

![Version](https://img.shields.io/badge/version-2.0.0-blue.svg)
![Node](https://img.shields.io/badge/node-20.x-green.svg)
![License](https://img.shields.io/badge/license-MIT-blue.svg)

---

## 📚 Table of Contents

- [Overview](#-overview)
- [Features](#-features)
- [Quick Start](#-quick-start)
- [Installation](#-installation)
- [Configuration](#-configuration)
- [Usage](#-usage)
- [Tech Stack](#-tech-stack)
- [Troubleshooting](#-troubleshooting)
- [Documentation](#-documentation)

---

## 🎯 Overview

**NEON Store** is a modern, full-stack e-commerce platform built with React, TypeScript, Express, and PostgreSQL. It features a powerful admin dashboard with 15+ advanced features for managing products, orders, and analytics.

### What's New in v2.0

- ✨ Rebranded from "Ecom-Dropship" to **NEON Store**
- 🎨 Modern purple-to-pink gradient theme
- 📊 Advanced analytics dashboard
- 🔍 Enhanced search and filtering
- 📈 Multiple sorting options
- ✅ Bulk product management
- 📤 CSV data export
- 🧹 **Cleaned from Replit dependencies**
- 📝 **Comprehensive Arabic documentation**

---

## ⚡ Features

### Admin Dashboard
- **Real-time Analytics** - Revenue, orders, and inventory stats
- **Advanced Search** - Find products and orders instantly
- **Smart Filtering** - Category, status, and stock filters
- **Bulk Operations** - Select and delete multiple items
- **Data Export** - Download products and orders as CSV
- **Inventory Alerts** - Low stock notifications
- **Order Management** - Track and update order status
- **Product Management** - Full CRUD operations with images

### Frontend
- **Modern UI/UX** - Built with Tailwind CSS and shadcn/ui
- **Responsive Design** - Works on all devices
- **Fast Performance** - Optimized with React and Vite
- **Type Safety** - Full TypeScript coverage

### Backend
- **RESTful API** - Express.js server
- **Database** - PostgreSQL with Drizzle ORM
- **Authentication** - Passport.js with sessions
- **Validation** - Zod schema validation

---

## 🚀 Quick Start

### Prerequisites

- Node.js 20.x or higher
- PostgreSQL database (local or cloud)
- npm or yarn

### Installation (3 Steps)

```bash
# 1. Install dependencies
npm install

# 2. Setup environment
copy _env .env
# Edit .env with your database credentials

# 3. Setup database and run
npm run db:push
npm run dev
```

**Open:** http://localhost:5000

**Admin Login:**
- Username: `admin`
- Password: `admin123`

---

## 📦 Installation

### Detailed Steps

#### 1. Clone or Download

```bash
# If using git
git clone <repository-url>
cd NEON-Store

# Or download and extract ZIP
```

#### 2. Install Dependencies

```bash
npm install
```

This will install all required packages (~200 packages, ~2-5 minutes).

#### 3. Setup Environment Variables

```bash
# Copy example file
copy _env .env

# Or manually create .env with:
```

**Required variables in `.env`:**

```env
DATABASE_URL="your-postgresql-connection-string"
SESSION_SECRET="your-random-secret-key"
NODE_ENV=development
PORT=5000
```

#### 4. Database Setup

##### Option A: Use Existing Neon Database

The project includes a pre-configured Neon.tech database URL in `_env`. Just copy it:

```bash
copy _env .env
```

##### Option B: Use Your Own PostgreSQL

**Local PostgreSQL:**
```bash
# Create database
createdb neon_store

# Update .env
DATABASE_URL="postgresql://postgres:password@localhost:5432/neon_store"
```

**Docker PostgreSQL:**
```bash
docker run --name neon-postgres \
  -e POSTGRES_PASSWORD=pass123 \
  -e POSTGRES_DB=neon_store \
  -p 5432:5432 -d postgres
```

**Cloud PostgreSQL:**
- Neon.tech (recommended)
- Supabase
- Railway
- Render

#### 5. Initialize Database

```bash
npm run db:push
```

This creates all required tables.

#### 6. Start Development Server

```bash
npm run dev
```

Server runs on: http://localhost:5000

---

## ⚙️ Configuration

### Environment Variables

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `DATABASE_URL` | Yes | - | PostgreSQL connection string |
| `SESSION_SECRET` | Yes | - | Secret key for sessions |
| `NODE_ENV` | No | `development` | Environment mode |
| `PORT` | No | `5000` | Server port |

### Example `.env` File

```env
# Database (required)
DATABASE_URL="postgresql://user:pass@host:5432/dbname"

# Session (required)
SESSION_SECRET="change-this-to-random-string"

# Server (optional)
NODE_ENV=development
PORT=5000
```

---

## 📖 Usage

### Admin Dashboard

#### 1. Login

Navigate to `/admin` and login with:
- Username: `admin`
- Password: `admin123`

⚠️ **Change default password in production!**

#### 2. Manage Products

- **Add Product**: Click "Add Product" button
- **Edit Product**: Click on product row
- **Delete Product**: Select and click "Delete"
- **Bulk Delete**: Select multiple products
- **Search**: Use search bar
- **Filter**: Use category dropdown
- **Sort**: Click column headers

#### 3. View Orders

- **Filter by Status**: Pending, Processing, Shipped, etc.
- **Search Orders**: By customer name or ID
- **Sort Orders**: By date, amount, or status

#### 4. Export Data

- **Export Products**: Click "Export CSV" on Products tab
- **Export Orders**: Click "Export CSV" on Orders tab
- Files download as: `neon-products-YYYY-MM-DD.csv`

#### 5. Analytics

View real-time statistics:
- Total Revenue & Average Order Value
- Total Orders & Pending Count
- Products Count & Out of Stock
- Low Stock Alerts

---

## 🛠️ Tech Stack

### Frontend
- **React 18** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **shadcn/ui** - Component library
- **TanStack Query** - Data fetching
- **Wouter** - Routing
- **React Hook Form** - Forms
- **Zod** - Validation
- **Lucide React** - Icons

### Backend
- **Node.js** - Runtime
- **Express 5** - Web framework
- **PostgreSQL** - Database
- **Drizzle ORM** - Database ORM
- **Passport.js** - Authentication
- **Express Session** - Session management

### Development
- **tsx** - TypeScript execution
- **Drizzle Kit** - Database migrations
- **ESBuild** - Bundling

---

## 🐛 Troubleshooting

### Common Issues

#### 1. "DATABASE_URL must be set"

**Cause:** Missing `.env` file or empty `DATABASE_URL`

**Solution:**
```bash
# Create .env file
copy _env .env

# Or manually add to .env:
DATABASE_URL="your-database-url"
SESSION_SECRET="your-secret"
```

#### 2. "Cannot find module '@replit/...'"

**Cause:** Old dependencies not cleaned

**Solution:**
```bash
# Delete old files
rmdir /s /q node_modules
del package-lock.json

# Reinstall
npm install
```

#### 3. "Port 5000 already in use"

**Solution:**
```bash
# Change port in .env
PORT=3000

# Or kill process using port 5000
# Windows:
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# Linux/Mac:
lsof -ti:5000 | xargs kill
```

#### 4. Database Connection Failed

**Solution:**
- Check internet connection (if using cloud DB)
- Verify DATABASE_URL is correct
- Test database connection:
```bash
node test-db.js
```

#### 5. npm install fails

**Solution:**
```bash
# Clear cache and retry
npm cache clean --force
rmdir /s /q node_modules
del package-lock.json
npm install
```

---

## 📚 Documentation

### Arabic Documentation

- **حل_جميع_المشاكل.md** - Complete troubleshooting guide
- **الحل_السريع.md** - Quick start guide
- **دليل_مصور.md** - Step-by-step visual guide
- **أوامر_سريعة.txt** - Quick command reference
- **QUICKSTART_AR.md** - Original quick start
- **README_AR_FULL.md** - Full Arabic README
- **ARABIC_README.md** - Features documentation

### English Documentation

- **README.md** (this file) - Main documentation
- **CHANGES.md** - Changelog and updates

### Additional Files

- **fix-all.bat** - Automated setup script (Windows)
- **test-db.js** - Database connection tester

---

## 🚀 Deployment

### Build for Production

```bash
npm run build
npm start
```

### Recommended Platforms

- **Render.com** - Easy PostgreSQL + Node.js hosting
- **Railway.app** - One-click deploy
- **Vercel** - Frontend (use serverless functions for API)
- **DigitalOcean** - Full control with App Platform
- **AWS/Azure/GCP** - Enterprise solutions

### Environment Variables for Production

```env
DATABASE_URL="production-postgresql-url"
SESSION_SECRET="strong-random-secret-min-32-chars"
NODE_ENV=production
PORT=5000
```

---

## 📝 Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm start` | Run production server |
| `npm run check` | TypeScript type checking |
| `npm run db:push` | Sync database schema |
| `npm run db:studio` | Open Drizzle Studio |

---

## 🤝 Contributing

Contributions are welcome! Please:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

---

## 📄 License

MIT License - Feel free to use and modify

---

## 🙏 Acknowledgments

Built with modern web technologies and best practices.

Special thanks to:
- React Team
- Vite Team
- shadcn
- Drizzle Team
- And all open-source contributors

---

## 📞 Support

If you encounter any issues:

1. Check documentation in `حل_جميع_المشاكل.md`
2. Review troubleshooting section above
3. Run `node test-db.js` to test database
4. Check that all files are properly configured

---

## 🎯 Roadmap

### Coming Soon

- [ ] Product editing UI
- [ ] Order status updates from admin
- [ ] Email notifications
- [ ] Sales charts and graphs
- [ ] Customer management
- [ ] Discount/coupon system
- [ ] Multi-image upload
- [ ] Product variations
- [ ] Revenue forecasting
- [ ] Automated reports

---

## ⭐ Version History

### v2.0.0 (Current) - February 2026
- ✨ Complete admin dashboard redesign
- ✨ 15+ new features
- ✨ Rebranded to NEON Store
- ✨ Enhanced UI/UX
- ✨ Performance improvements
- 🧹 Cleaned from Replit dependencies
- 📝 Comprehensive documentation

### v1.0.0 - Initial Release
- 🎉 Basic product management
- 🎉 Simple order viewing
- 🎉 Basic authentication

---

**Made with ❤️ for better e-commerce management**

**Good Luck! 🚀**

# EcoStreak - Gamified Environmental Education Platform

## 🌍 Overview

EcoStreak is a **Smart India Hackathon 2025** winning project (Problem Code: SIH 25009, Theme: Sustainable Science) that transforms boring environmental education into an addictive, gamified learning experience similar to Duolingo + Pokémon GO for saving the planet!

## ✨ Features

### Core Features
- ✅ **Real Authentication** - Email/Password signup with mandatory Name, Email, and College fields
- ✅ **Gamified Dashboard** - Avatar, Level, XP points, Badges, Streak, Virtual Forest
- ✅ **8 Learning Modules** - Climate Change, Renewable Energy, Waste Segregation, Water Conservation, Biodiversity, Air Pollution, Sustainable Cities, LiFE Mission
- ✅ **Interactive Quizzes** - MCQ and True/False questions with instant feedback
- ✅ **Mini-Games** - Waste sorting drag-drop game and Carbon footprint calculator
- ✅ **Daily Challenges** - Real-world environmental actions with self-reporting
- ✅ **Real-time Leaderboards** - Global, College-wise, and Team rankings
- ✅ **Team Collaboration** - Create teams, share join codes, compete together
- ✅ **Certificate Generation** - Beautiful PDF certificates at 1000+ points
- ✅ **Admin Panel** - User management, analytics, college stats, CSV export
- ✅ **Dark Mode** - Full dark mode support
- ✅ **Mobile Responsive** - Works beautifully on all devices

### Gamification Elements
- **Virtual Forest** - Trees grow as you earn points (1 tree per 50 points, max 20 trees)
- **8 Beautiful Badges** - Unlock achievements based on points, streaks, and module completion
- **Streak System** - Maintain daily activity to unlock special badges
- **Level Progression** - Level up every 100 points

## 🛠️ Tech Stack

- **Frontend**: Next.js 14 (App Router), TypeScript, Tailwind CSS
- **UI Components**: NextUI (Hero UI)
- **Animations**: Framer Motion
- **Backend**: Appwrite Cloud (Free Tier)
  - Authentication
  - Databases & Collections
  - Realtime Subscriptions
- **Charts**: Recharts
- **PDF Generation**: jsPDF + html2canvas
- **Drag & Drop**: react-beautiful-dnd
- **Deployment**: Vercel (Frontend), Appwrite Cloud (Backend)

## 📁 Project Structure

```
EcoStreak/
├── app/
│   ├── admin/              # Admin panel pages
│   │   ├── colleges/       # College analytics
│   │   ├── users/          # User management
│   │   └── page.tsx        # Admin dashboard
│   ├── certificate/        # Certificate generation
│   ├── challenges/         # Daily challenges
│   ├── dashboard/          # User dashboard
│   ├── leaderboard/        # Leaderboard pages
│   ├── login/              # Login page
│   ├── modules/            # Learning modules
│   │   └── [slug]/         # Dynamic module pages
│   ├── signup/             # Signup page
│   ├── teams/              # Team management
│   ├── globals.css         # Global styles
│   ├── layout.tsx          # Root layout
│   ├── page.tsx            # Landing page
│   └── providers.tsx       # Context providers
├── components/
│   ├── BadgeDisplay.tsx    # Badge showcase
│   ├── CarbonCalculator.tsx # Carbon footprint game
│   ├── Certificate.tsx     # Certificate design
│   ├── Navbar.tsx          # Navigation bar
│   ├── Quiz.tsx            # Quiz component
│   ├── VirtualForest.tsx   # Virtual forest visualization
│   └── WasteSortingGame.tsx # Waste sorting game
├── contexts/
│   └── AuthContext.tsx     # Authentication context
├── data/
│   └── modules.ts          # All 8 module contents
├── lib/
│   ├── admin-auth.ts       # Admin authorization
│   ├── appwrite.ts         # Appwrite client setup
│   ├── appwrite-schema.json # Database schema
│   ├── certificate-generator.ts # PDF generation
│   └── gamification.ts     # Game logic utilities
├── types/
│   └── index.ts            # TypeScript interfaces
├── .env.local.example      # Environment variables template
├── next.config.js          # Next.js configuration
├── package.json            # Dependencies
├── tailwind.config.ts      # Tailwind + NextUI config
└── tsconfig.json           # TypeScript configuration
```

## 🚀 Quick Start

See [SETUP.md](./SETUP.md) for detailed installation and deployment instructions.

### Prerequisites
- Node.js 18+ and npm
- Appwrite Cloud account (free)
- Vercel account (free, for deployment)

### installation

1. **Clone/Download the project**
   ```bash
   cd EcoStreak
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up Appwrite** (See SETUP.md for detailed steps)
   - Create Appwrite project
   - Create database and collections
   - Configure authentication

4. **Configure environment variables**
   ```bash
   cp .env.local.example .env.local
   # Edit .env.local with your Appwrite credentials
   ```

5. **Run development server**
   ```bash
   npm run dev
   ```

6. **Open** http://localhost:3000

## 🎮 How to Use

### For Students
1. **Sign Up** - Create account with Name, Email, College
2. **Explore Modules** - Learn about 8 environmental topics
3. **Take Quizzes** - Test your knowledge, earn points
4. **Play Games** - Interactive waste sorting and carbon calculator
5. **Daily Challenges** - Complete real-world environmental actions
6. **Join/Create Teams** - Collaborate with friends
7. **Compete** - Climb the leaderboard
8. **Earn Certificate** - Get downloadable PDF at 1000+ points

### For Admins
Admin access is granted to:
- gauravramyadav@gmail.com
- admin@ecoquest.in
- principal@yourcollege.ac.in

Admin features:
- View all users and their stats
- College-wise analytics with charts
- Export data to CSV
- Monitor platform engagement

## 📊 Database Schema

See `lib/appwrite-schema.json` for complete schema.

### Collections:

1. **users**
   - name, email, college (mandatory)
   - points, level, badges, streak
   - role (student/admin), teamId

2. **teams**
   - teamName, teamCode (6-char unique)
   - leaderId, members[], totalPoints

3. **dailyChallenges**
   - date, title, description, points

## 🎨 Design Highlights

- **Beautiful Gradients** - Modern color schemes throughout
- **Smooth Animations** - Framer Motion for delightful interactions
- **NextUI Components** - Professional, accessible UI
- **Custom Illustrations** - Virtual forest, badges, certificates
- **Responsive Design** - Perfect on mobile, tablet, desktop
- **Dark Mode** - Easy on the eyes

## 🏆 Why This Wins SIH

1. **Real Impact** - Addresses environmental education gap
2. **Innovative Approach** - Gamification makes learning fun
3. **Scalable** - Cloud-based, can handle millions of users
4. **Complete Solution** - End-to-end platform with all features
5. **Indian Context** - Real Indian examples, colleges, missions
6. **Team Collaboration** - Encourages group learning
7. **Measurable Outcomes** - Points, certificates, analytics
8. **Admin Insights** - Track adoption and engagement

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
This project is created for Smart India Hackathon 2025.

## 👥 Support

For issues or questions:
- Create an issue in the repository
- Contact the development team

## 🌟 Acknowledgments

- Smart India Hackathon 2025
- Appwrite for amazing backend services
- Next.js and Vercel teams
- All environmental educators making a difference

---

**Made with 💚 for a sustainable future**

**Problem Code**: SIH 25009 | **Theme**: Sustainable Science

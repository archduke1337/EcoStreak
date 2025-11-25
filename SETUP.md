# EcoStreak Setup Guide

Complete step-by-step guide to set up and deploy EcoStreak.

## Table of Contents
1. [Appwrite Cloud Setup](#1-appwrite-cloud-setup)
2. [Local Development Setup](#2-local-development-setup)
3. [Vercel Deployment](#3-vercel-deployment)
4. [Testing](#4-testing)

---

## 1. Appwrite Cloud Setup

### Step 1.1: Create Appwrite Account
1. Go to [https://cloud.appwrite.io](https://cloud.appwrite.io)
2. Sign up for a free account
3. Verify your email

### Step 1.2: Create Project
1. Click "Create Project"
2. Name: `EcoStreak`
3. Click "Create"
4. Copy your **Project ID** (you'll need this later)

### Step 1.3: Enable Authentication
1. In your project, go to **Auth** tab
2. Click on **Settings**
3. Scroll to **Auth Methods**
4. Enable **Email/Password**
5. Save changes

### Step 1.4: Create Database
1. Go to **Databases** tab
2. Click "Create Database"
3. Name: `main`
4. Click "Create"
5. Copy your **Database ID**

### Step 1.5: Create Collections

You need to create 3 collections with exact attributes and indexes as specified below.

#### Collection 1: `users`

1. Click "Create Collection"
2. **Collection ID**: `users`
3. **Name**: `users`
4. Click "Create"

**Attributes** (Add each one by clicking "Create Attribute"):

| Key | Type | Size | Required | Default | Array |
|-----|------|------|----------|---------|-------|
| name | String | 255 | Yes | - | No |
| email | String | 320 | Yes | - | No |
| college | String | 500 | Yes | - | No |
| points | Integer | - | Yes | 0 | No |
| level | Integer | - | Yes | 1 | No |
| badges | String | 50 | Yes | [] | Yes |
| streak | Integer | - | Yes | 0 | No |
| lastActiveDate | String | 50 | Yes | - | No |
| role | String | 20 | Yes | "student" | No |
| teamId | String | 100 | No | - | No |

**Indexes** (Go to "Indexes" tab):

| Key | Type | Attributes | Orders |
|-----|------|------------|--------|
| email_index | Unique | email | ASC |
| points_index | Key | points | DESC |
| college_index | Key | college | ASC |
| role_index | Key | role | ASC |

**Permissions** (Go to "Settings" > "Permissions"):
- Read: `role:all`
- Create: `role:all`
- Update: `role:all`
- Delete: `role:admin`

#### Collection 2: `teams`

1. Create new collection
2. **Collection ID**: `teams`
3. **Name**: `teams`

**Attributes**:

| Key | Type | Size | Required | Default | Array |
|-----|------|------|----------|---------|-------|
| teamName | String | 255 | Yes | - | No |
| teamCode | String | 10 | Yes | - | No |
| leaderId | String | 100 | Yes | - | No |
| members | String | 100 | Yes | [] | Yes |
| totalPoints | Integer | - | Yes | 0 | No |

**Indexes**:

| Key | Type | Attributes | Orders |
|-----|------|------------|--------|
| teamCode_index | Unique | teamCode | ASC |
| totalPoints_index | Key | totalPoints | DESC |

**Permissions**:
- Read: `role:all`
- Create: `role:all`
- Update: `role:all`
- Delete: `role:admin`

#### Collection 3: `dailyChallenges`

1. Create new collection
2. **Collection ID**: `dailyChallenges`
3. **Name**: `dailyChallenges`

**Attributes**:

| Key | Type | Size | Required | Default | Array |
|-----|------|------|----------|---------|-------|
| date | String | 20 | Yes | - | No |
| title | String | 255 | Yes | - | No |
| description | String | 1000 | Yes | - | No |
| points | Integer | - | Yes | 50 | No |

**Indexes**:

| Key | Type | Attributes | Orders |
|-----|------|------------|--------|
| date_index | Unique | date | ASC |

**Permissions**:
- Read: `role:all`
- Create: `role:admin`
- Update: `role:admin`
- Delete: `role:admin`

### Step 1.6: Get Your Credentials

From your Appwrite console dashboard, collect:
- **Endpoint**: `https://cloud.appwrite.io/v1`
- **Project ID**: Found in project settings
- **Database ID**: Found in database settings
- **Collection IDs**: `users`, `teams`, `dailyChallenges`

---

## 2. Local Development Setup

### Step 2.1: Install Dependencies

```bash
cd EcoStreak
npm install
```

### Step 2.2: Configure Environment Variables

1. Copy the example file:
```bash
cp .env.local.example .env.local
```

2. Edit `.env.local` with your credentials:

```env
NEXT_PUBLIC_APPWRITE_ENDPOINT=https://cloud.appwrite.io/v1
NEXT_PUBLIC_APPWRITE_PROJECT_ID=your_project_id_here
NEXT_PUBLIC_APPWRITE_DATABASE_ID=your_database_id_here
NEXT_PUBLIC_APPWRITE_USERS_COLLECTION_ID=users
NEXT_PUBLIC_APPWRITE_TEAMS_COLLECTION_ID=teams
NEXT_PUBLIC_APPWRITE_CHALLENGES_COLLECTION_ID=dailyChallenges
```

Replace:
- `your_project_id_here` with your actual Project ID
- `your_database_id_here` with your actual Database ID

### Step 2.3: Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Step 2.4: Create Your First Account

1. Click "Start Your Journey" or "Sign Up"
2. Fill in:
   - Full Name
   - Email (use `gauravramyadav@gmail.com` for admin access)
   - College Name
   - Password (min 8 characters)
3. Click "Sign Up"

You should be redirected to the dashboard!

---

## 3. Vercel Deployment

### Step 3.1: Push to GitHub

1. Initialize git (if not already):
```bash
git init
git add .
git commit -m "Initial commit - EcoStreak"
```

2. Create a new repository on GitHub
3. Push your code:
```bash
git remote add origin https://github.com/yourusername/ecoquest.git
git branch -M main
git push -u origin main
```

### Step 3.2: Deploy to Vercel

1. Go to [https://vercel.com](https://vercel.com)
2. Click "Add New" > "Project"
3. Import your GitHub repository
4. Configure project:
   - Framework Preset: Next.js
   - Root Directory: `./`
5. Add Environment Variables:
   - Click "Environment Variables"
   - Add all variables from your `.env.local`:
     ```
     NEXT_PUBLIC_APPWRITE_ENDPOINT
     NEXT_PUBLIC_APPWRITE_PROJECT_ID
     NEXT_PUBLIC_APPWRITE_DATABASE_ID
     NEXT_PUBLIC_APPWRITE_USERS_COLLECTION_ID
     NEXT_PUBLIC_APPWRITE_TEAMS_COLLECTION_ID
     NEXT_PUBLIC_APPWRITE_CHALLENGES_COLLECTION_ID
     ```
6. Click "Deploy"

Wait 2-3 minutes for deployment to complete.

### Step 3.3: Update Appwrite Settings

1. Go back to Appwrite Console
2. Navigate to your project **Settings**
3. Scroll to **Platforms**
4. Click "Add Platform" > "Web App"
5. Add your Vercel URL: `https://your-app.vercel.app`
6. Save

Your app is now live! 🎉

---

## 4. Testing

### Test Authentication
1. Sign up with a new account
2. Log out
3. Log in again
4. Verify session persists

### Test Gamification
1. Navigate to Dashboard
2. Check stats display correctly
3. Verify virtual forest appears
4. Check badges display

### Test Modules
1. Go to Modules
2. Click on "Climate Change"
3. Read content
4. Play carbon calculator game
5. Take quiz
6. Verify points update in dashboard

### Test Leaderboard
1. Open Leaderboard
2. Check your name appears
3. Verify college and team tabs work
4. Open in two tabs, complete quiz in one
5. Verify real-time update in other tab

### Test Teams
1. Create a team with a unique name
2. Note the 6-character team code
3. Log in with another account
4. Join team using the code
5. Verify both members appear

### Test Certificate
1. Ensure you have 1000+ points
2. Go to Certificate page
3. Download PDF
4. Open and verify all details correct

### Test Admin Panel (if admin)
1. Log in with `gauravramyadav@gmail.com`
2. Go to `/admin`
3. Check stats display
4. Navigate to User Management
5. Search for users
6. Export CSV
7. Navigate to College Analytics
8. Verify charts render

---

## Troubleshooting

### "Failed to fetch" errors
- Check environment variables are correct
- Verify Appwrite project ID and database ID
- Ensure collections are created with exact IDs
- Check network connection

### Authentication not working
- Verify Email/Password auth is enabled in Appwrite
- Check platform URL is added in Appwrite settings
- Clear browser cache and cookies

### Points not updating
- Check user document permissions allow updates
- Verify `USERS_COLLECTION_ID` is correct
- Open browser console for error messages

### Leaderboard not real-time
- Appwrite Realtime requires proper permissions
- Check collection read permissions are `role:all`
- Verify websocket connections are not blocked

### Admin panel not accessible
- Confirm your email is in the whitelist (`lib/admin-auth.ts`)
- Check account was created with that exact email
- Verify role field in database is set correctly

---

## Next Steps

After successful setup:

1. **Customize Admin Whitelist**: Edit `lib/admin-auth.ts` to add more admin emails
2. **Add More Challenges**: Create documents in `dailyChallenges` collection
3. **Promote Your Platform**: Share with students and colleges
4. **Monitor Analytics**: Use admin panel to track engagement
5. **Collect Feedback**: Improve based on user suggestions

---

## Support

If you encounter issues:
1. Check this guide thoroughly
2. Verify all environment variables
3. Check browser console for errors
4. Review Appwrite console logs
5. Create an issue in the repository

---

**Happy Learning! Save the Planet! 🌍💚**

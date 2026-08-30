# Memory Map

A full-stack web application for creating, managing, and visualizing personal memories on an interactive map. Built with NestJS (backend), Next.js (frontend), PostgreSQL, and React-Leaflet.

## Features

- **Interactive Map**: View all your memories on an interactive map using Leaflet
- **Memory CRUD**: Create, read, update, and delete memories with rich details
- **Location Selection**: Pick locations directly on the map when creating memories
- **Image Upload**: Add photos to memories via URL
- **Timeline View**: Browse memories chronologically with a beautiful timeline
- **Statistics**: View insights about your memories (mood distribution, categories, monthly activity)
- **Search & Filter**: Filter memories by category, mood, date range, and search terms
- **Authentication**: Secure JWT-based authentication system
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Dark Mode**: Built-in dark mode support

## Tech Stack

### Backend
- **NestJS**: Progressive Node.js framework for building efficient backend applications
- **Prisma**: Modern ORM for database access
- **PostgreSQL**: Relational database
- **JWT**: JSON Web Tokens for authentication
- **Passport**: Authentication middleware
- **Bcrypt**: Password hashing

### Frontend
- **Next.js 16**: React framework with App Router
- **React**: UI library
- **TypeScript**: Type-safe JavaScript
- **Tailwind CSS**: Utility-first CSS framework
- **Zustand**: Lightweight state management
- **Axios**: HTTP client
- **React-Leaflet**: Leaflet integration for React
- **Lucide React**: Icon library

## Prerequisites

- Node.js (v18 or higher)
- PostgreSQL (v14 or higher)
- npm or yarn

## Installation

### 1. Clone the repository

```bash
git clone <repository-url>
cd memory-map
```

### 2. Set up the database

Create a PostgreSQL database named `memory_map`:

```sql
CREATE DATABASE memory_map;
```

### 3. Backend Setup

Navigate to the backend directory:

```bash
cd backend
```

Install dependencies:

```bash
npm install
```

Configure environment variables by creating a `.env` file in the backend directory:

```env
DATABASE_URL="postgresql://postgres:your-password@localhost:5432/memory_map?schema=public"
JWT_SECRET="your-secure-random-secret-key-at-least-32-characters"
JWT_EXPIRATION="7d"
PORT=3001
FRONTEND_URL="http://localhost:3000"
```

Generate Prisma client:

```bash
npx prisma generate
```

Run migrations:

```bash
npx prisma migrate dev
```

Seed categories (optional):

```bash
# After starting the backend, you can seed categories via:
curl -X POST http://localhost:3001/categories/seed
```

Start the backend server:

```bash
npm run dev
```

The backend will run on `http://localhost:3001`

### 4. Frontend Setup

Navigate to the frontend directory:

```bash
cd frontend
```

Install dependencies:

```bash
npm install
```

Configure environment variables by creating a `.env.local` file in the frontend directory:

```env
NEXT_PUBLIC_API_URL="http://localhost:3001"
```

Start the frontend development server:

```bash
npm run dev
```

The frontend will run on `http://localhost:3000`

## Usage

### 1. Register an Account

- Navigate to `http://localhost:3000`
- Click "Sign Up"
- Enter your email, password, and name
- Click "Create Account"

### 2. Login

- Click "Sign In"
- Enter your email and password
- Click "Sign In"

### 3. Create a Memory

- Click the "+" button on the dashboard
- Enter memory details:
  - Title (required)
  - Content/description
  - Location (click on the map to select)
  - Location name
  - Date
  - Mood
  - Category
- Click "Save Memory"

### 4. View Memories

- **Map View**: See all memories as markers on the interactive map
- **Timeline View**: Browse memories chronologically
- **Statistics View**: View insights about your memories

### 5. Edit/Delete Memories

- Click on a memory marker or list item
- Use the edit or delete buttons in the memory detail view

### 6. Add Photos

- Open a memory detail view
- Click "Add Photo"
- Enter an image URL
- Click "Add Photo"

## API Endpoints

### Authentication
- `POST /auth/register` - Register a new user
- `POST /auth/login` - Login
- `GET /auth/me` - Get current user

### Categories
- `GET /categories` - Get all categories
- `POST /categories/seed` - Seed default categories

### Memories
- `GET /memories` - Get all memories (with optional filters)
- `GET /memories/statistics` - Get memory statistics
- `GET /memories/:id` - Get a specific memory
- `POST /memories` - Create a new memory
- `PUT /memories/:id` - Update a memory
- `DELETE /memories/:id` - Delete a memory
- `POST /memories/:id/images` - Add an image to a memory
- `DELETE /memories/:memoryId/images/:imageId` - Delete an image

## Project Structure

```
memory-map/
├── backend/
│   ├── prisma/
│   │   └── schema.prisma       # Database schema
│   ├── src/
│   │   ├── auth/               # Authentication module
│   │   ├── categories/         # Categories module
│   │   ├── memories/           # Memories module
│   │   ├── users/              # Users module
│   │   ├── app.module.ts       # Root module
│   │   └── main.ts             # Application entry point
│   ├── .env                    # Environment variables
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── app/                # Next.js app directory
│   │   │   ├── dashboard/      # Dashboard page
│   │   │   ├── login/          # Login page
│   │   │   ├── register/       # Register page
│   │   │   ├── memories/       # Memory pages
│   │   │   ├── timeline/       # Timeline page
│   │   │   └── statistics/     # Statistics page
│   │   ├── components/         # Reusable components
│   │   ├── lib/                # API clients and utilities
│   │   └── store/              # State management
│   ├── .env.local              # Environment variables
│   └── package.json
└── README.md
```

## Security Considerations

- **JWT Secret**: Use a strong, random JWT secret in production (at least 32 characters)
- **Database Password**: Use a strong database password
- **HTTPS**: Use HTTPS in production
- **Environment Variables**: Never commit `.env` files to version control
- **CORS**: Configure CORS to allow only your frontend domain in production
- **Rate Limiting**: Consider implementing rate limiting for API endpoints in production

## Development

### Backend Development

```bash
cd backend
npm run dev          # Start development server
npm run build        # Build for production
npm run start:prod   # Start production server
```

### Frontend Development

```bash
cd frontend
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
```

### Database Migrations

```bash
cd backend
npx prisma migrate dev          # Create and apply migration
npx prisma migrate deploy       # Apply migrations (production)
npx prisma studio               # Open Prisma Studio
```

## Troubleshooting

### Backend Issues

- **Database Connection Error**: Check your DATABASE_URL in `.env`
- **Port Already in Use**: Change the PORT in `.env` or kill the process using the port
- **Prisma Errors**: Run `npx prisma generate` after installing dependencies

### Frontend Issues

- **API Connection Error**: Check NEXT_PUBLIC_API_URL in `.env.local`
- **Build Errors**: Clear Next.js cache with `rm -rf .next`
- **Map Not Loading**: Ensure Leaflet CSS is imported in your layout

## License

This project is licensed under the MIT License.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

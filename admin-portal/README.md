# WireFree Admin Portal

The WireFree Admin Portal is a web-based management interface for the WireFree virtual fencing platform. It allows farmers and administrators to manage livestock, virtual fences, tracking devices, and analytics from a centralized dashboard.

## Features

- Real-time livestock tracking and monitoring
- Virtual fence creation and management
- Device management for tracking devices (AirTags, Tiles, etc.)
- Alert system for fence breaches and device issues
- Analytics and reporting dashboard
- Herd management tools

## Port Configuration

The WireFree Admin Portal runs on port **6001** by default. When accessing the application, use the following URLs:

- Development: http://localhost:6001
- Production: http://your-domain:6001 (or with proper domain configuration)

## Prerequisites

- Node.js (v16 or higher)
- npm or yarn package manager
- PostgreSQL database
- Git

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/wirefree-admin-portal.git
   cd wirefree-admin-portal
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   ```bash
   cp .env.example .env
   ```

4. Update the `.env` file with your database connection details:
   ```
   DATABASE_URL="postgresql://username:password@localhost:5432/wirefree"
   NEXTAUTH_URL="http://localhost:6001"
   NEXTAUTH_SECRET="your-secret-key-here"
   ```

5. Set up the database:
   ```bash
   npx prisma generate
   npx prisma db push
   ```

6. Build and run the application:
   ```bash
   npm run build
   npm run dev
   ```

The application will be available at http://localhost:6001

## Docker Installation

To run the application with Docker:

```bash
docker-compose up --build
```

The application will be available at http://localhost:6001

## Testing the iOS App on MacBook M1

To test the iOS app on your MacBook M1:

1. Navigate to the iOS project directory:
   ```bash
   cd ../mobile/ios
   ```

2. Open the project in Xcode:
   ```bash
   open WireFree.xcworkspace
   ```

3. In Xcode:
   - Select a simulator (e.g., iPhone 14 Pro)
   - Click the "Run" button (or Cmd+R)
   - The app will build and run in the simulator

## Project Structure

```
admin-portal/
├── components/     # React components
├── pages/          # Next.js pages
├── public/         # Static assets
├── styles/         # CSS styles
├── lib/            # Utility functions and database logic
├── prisma/         # Prisma schema and database configuration
├── types/          # TypeScript type definitions
└── ...
```

## API Endpoints

The application provides the following API endpoints accessible through the admin portal:

- `/api/users` - User management
- `/api/devices` - Device tracking and management
- `/api/animals` - Livestock tracking
- `/api/fences` - Virtual fence management
- `/api/locations` - Location tracking
- `/api/alerts` - Alert management

## Troubleshooting

If you encounter issues:

1. Ensure all prerequisites are installed and properly configured
2. Verify database connection details in `.env`
3. Check that port 6001 is available and not being used by another application
4. Make sure you have proper permissions to run the application

## Support

If you have questions or encounter issues, please check the documentation or create an issue in the GitHub repository.

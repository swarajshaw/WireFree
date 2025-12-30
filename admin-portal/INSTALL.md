# WireFree Admin Portal Installation Guide

## Prerequisites

Before installing the WireFree Admin Portal, ensure you have the following prerequisites installed on your system:

- Node.js (v16 or higher)
- npm or yarn package manager
- PostgreSQL database (v12 or higher)
- Git
- Xcode Command Line Tools (for macOS users)

## Installation Steps

### 1. Clone the Repository

```bash
git clone https://github.com/swarajshaw/WireFree.git
cd wirefree-admin-portal
```

### 2. Install Dependencies

Using npm:
```bash
npm install
```

Or using yarn:
```bash
yarn install
```

### 3. Set Up Environment Variables

Create a `.env` file in the root directory by copying the example:

```bash
cp .env.example .env
```

Then update the `.env` file with your database connection details and other configurations:

```env
DATABASE_URL="postgresql://username:password@localhost:5432/wirefree"
NEXTAUTH_URL="http://localhost:6001"
NEXTAUTH_SECRET="your-secret-key-here"
MAPBOX_ACCESS_TOKEN="your-mapbox-access-token"
```

### 4. Set Up the Database

Install and set up Prisma:

```bash
npm run prisma:generate
npm run prisma:push
```

This will create the necessary database tables based on the schema defined in `prisma/schema.prisma`.

If you want to skip `npm install`, use the pinned CLI instead:
```bash
npx prisma@5.6.0 generate
npx prisma@5.6.0 db push
```

### 5. Build the Application

```bash
npm run build
```

### 6. Run the Application

For development:
```bash
npm run dev
```

For production:
```bash
npm start
```

The application will be available at http://localhost:6001

## Docker Installation (Alternative)

If you prefer to use Docker for installation:

### 1. Build and Run with Docker Compose

```bash
docker-compose up --build
```

The application will be available at http://localhost:6001

### 2. Run Migrations

In a separate terminal, run the database migrations:

```bash
docker-compose exec app npx prisma db push
```

## Testing the iOS App on MacBook M1

### Prerequisites

- Xcode installed from the App Store
- iOS Simulator (comes with Xcode)

### Steps to Test the iOS App

1. Navigate to the iOS project directory:
   ```bash
   cd mobile/ios
   ```

2. Open the project in Xcode:
   ```bash
   open WireFree.xcworkspace
   ```

3. In Xcode:
   - Select the target device (Simulator) from the dropdown menu (e.g., iPhone 14 Pro)
   - Make sure the target scheme is selected (WireFree)
   - Click the "Run" button (or press Cmd+R) to build and run the app in the simulator

4. If you want to run on a physical device:
   - Connect your iOS device to your Mac via USB
   - Trust the computer on your iOS device if prompted
   - Select your device from the target device list in Xcode
   - Click the "Run" button to build and deploy to your device

### Troubleshooting Common Issues

- **Xcode Command Line Tools Issue**: If you get an error about Xcode Command Line Tools, install them with:
  ```bash
  xcode-select --install
  ```

- **Architecture Issues on M1**: If you encounter issues with dependencies during installation, try:
  ```bash
  npm install --arch=x64
  ```

- **Database Connection Issues**: Ensure PostgreSQL is running and credentials in `.env` are correct.

- **iOS Simulator Not Starting**: In Xcode, go to Xcode > Preferences > Platforms > iOS and check if the simulator runtime is installed.

## Additional Configuration

### Setting up Authentication

The application uses NextAuth.js for authentication. To configure providers (Google, Facebook, etc.), update the `pages/api/auth/[...nextauth].js` file with your provider-specific configurations.

### Map Integration

The application uses Mapbox for map visualization. To use this feature, sign up for a Mapbox account and add your access token to the `.env` file as `MAPBOX_ACCESS_TOKEN`.

## Development

To start the development server:

```bash
npm run dev
```

The application will automatically reload when changes are made to the source files.

## Running Tests

To run the test suite:

```bash
npm test
```

## Deployment

For production deployment, ensure the following:

1. Environment variables are properly set for the production environment
2. Database is properly configured and migrated
3. SSL certificates are in place if using HTTPS
4. Proper domain and DNS configuration is set up

## Support

If you encounter any issues during installation or while running the application, please check the GitHub issues page or create a new issue with detailed information about the problem.

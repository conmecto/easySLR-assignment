# Task Management System

A modern task management system built with Next.js, tRPC, Prisma, and AWS SST. This application allows organizations to manage tasks, assign them to team members, and track progress efficiently.

## Live Demo

Visit the deployed application: [Task Management System](https://dndg42pnluycj.cloudfront.net)

## Features

- 🔐 Authentication with NextAuth.js
- 👥 Organization-based user management
- 📝 Task creation and management
- 👤 User assignment and task tracking
- 📊 Dashboard with task analytics
- 🎨 Modern UI with Tailwind CSS
- 🔄 Real-time updates with tRPC
- 🚀 Serverless deployment with SST

## Tech Stack

- **Frontend**: Next.js, React, Tailwind CSS
- **Backend**: tRPC, Prisma
- **Database**: PostgreSQL
- **Authentication**: NextAuth.js
- **Deployment**: AWS SST (Serverless Stack)
- **Infrastructure**: AWS (CloudFront, Lambda, RDS)

## Project Architecture

```
src/
├── components/         # React components
├── pages/             # Next.js pages
│   ├── api/          # API routes
│   └── dashboard.tsx # Dashboard page
├── server/
│   └── api/          # tRPC routers
├── styles/           # Global styles
└── utils/            # Utility functions
```

## Prerequisites

- Node.js (v16 or later)
- npm or yarn
- PostgreSQL database
- AWS account (for deployment)

## Local Development Setup

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd task-management-system
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```

3. Set up environment variables:
   Create a `.env` file in the root directory with the following variables:
   ```
   DATABASE_URL="postgresql://user:password@localhost:5432/dbname"
   NEXTAUTH_SECRET="your-secret"
   NEXTAUTH_URL="http://localhost:3000"
   ```

4. Set up the database:
   ```bash
   npx prisma migrate dev
   ```

5. Run the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   ```

The application will be available at `http://localhost:3000`

## Deployment with SST

1. Install SST CLI:
   ```bash
   npm install -g sst
   ```

2. Configure AWS credentials:
   ```bash
   aws configure
   ```

3. Deploy the application:
   ```bash
   npm run deploy
   # or
   yarn deploy
   ```

## Project Structure

### Components
- `MainLayout`: Main application layout with header and navigation
- `TaskCard`: Individual task display component
- `CreateOrganization`: Organization creation form
- `NoOrganization`: Component for users without an organization
- `UserProfileCard`: User profile information display

### API Routes
- Task management (create, update, delete, assign)
- Organization management (create, invite members)
- User management (profile, roles)

### Database Schema
- Users
- Organizations
- Tasks
- Task Assignments
- Organization Invites

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support, please open an issue in the GitHub repository or contact the maintainers.

# VetSync

A comprehensive veterinary clinic management system that connects pet owners with veterinary clinics and professionals. VetSync streamlines appointment booking, electronic health records (EHR) management, and clinic operations.

## Tech Stack

### Frontend
- **React 19** - UI library
- **Vite** - Build tool and dev server
- **TailwindCSS 4** - Utility-first CSS framework
- **React Router 7** - Client-side routing
- **Axios** - HTTP client
- **FullCalendar** - Appointment calendar
- **Leaflet/React-Leaflet** - Interactive maps

### Backend
- **Node.js** with **Express 5** - REST API server
- **PostgreSQL** - Relational database
- **Sequelize** - ORM for database operations
- **JWT** - Authentication tokens
- **Brevo/Nodemailer** - Email services
- **Google Drive API** - File storage
- **pdf-lib** - PDF generation

## Features

### Pet Owners
- Browse and search veterinary clinics
- View clinic details with location on map
- Book appointments with preferred clinics
- Manage multiple pets
- Access electronic health records (EHR)
- View vaccination history, prescriptions, lab results
- Profile and settings management

### Clinic Administrators
- Dashboard with clinic analytics
- Manage clinic information and schedule
- Register and manage veterinary professionals
- View and manage patient records (EHR)
- Handle appointment requests
- Clinic approval workflow (pending/approved/rejected status)

### Veterinary Professionals
- View and manage assigned appointments
- Access and update patient health records
- Add vaccinations, prescriptions, deworming records
- Record lab results
- Profile management

### System Administrators
- System-wide dashboard and analytics
- Manage all registered clinics
- Approve or reject clinic registrations
- User management across all roles
- Audit trail and logs

## User Types

| Role | Description |
|------|-------------|
| `pet_owner` | Pet owners who book appointments and manage their pets |
| `clinic_admin` | Administrators who manage clinic operations |
| `vet_professional` | Veterinary professionals who provide medical services |
| `system_admin` | Platform administrators with full system access |

## Getting Started

### Prerequisites
- Node.js (v18 or higher)
- PostgreSQL (v14 or higher)
- npm or yarn

### Environment Variables

Create a `.env` file in the `/backend` directory:

```env
# Database
DB_HOST=localhost
DB_USER=postgres
DB_PASSWORD=your_password
DB_DATABASE=vetsync_dev

# JWT
JWT_SECRET=your_jwt_secret

# Email (Brevo)
BREVO_API_KEY=your_brevo_api_key

# Google Drive
CLIENT_ID=your_client_id
CLIENT_SECRET=your_client_secret
```

Create a `.env` file in the `/frontend` directory:

```env
VITE_BACKEND_URL="http://localhost:4000"
VITE_NODE_ENV="development"
```

### Installation

1. Clone the repository
```bash
git clone https://github.com/v1nssvetsync.git
cd vetsync
```

2. Install backend dependencies
```bash
cd backend
npm install
```

3. Install frontend dependencies
```bash
cd ../frontend
npm install
```

4. Run database migrations
```bash
cd ../backend
npm run migrate
```

5. Start the development servers

Backend:
```bash
cd backend
npm run dev
```

Frontend (in a new terminal):
```bash
cd frontend
npm run dev
```

The frontend will be available at `http://localhost:5173` and the backend API at `http://localhost:3000`.

## Test Accounts

| Role | Email | Password |
|------|-------|----------|
| Pet Owner | `petowner@test.com` | `password123` |
| Clinic Admin | `clinicadmin@test.com` | `password123` |
| Vet Professional | `vetpro@test.com` | `password123` |
| System Admin | `sysadmin@gmail.com` | `123456` |

> **Note:** These are placeholder credentials for development/testing purposes. Update with actual seeded accounts.

## Project Structure

```
vetsync/
├── backend/
│   ├── config/           # Database configuration
│   ├── global/           # Shared utilities, middleware, config
│   │   ├── config/       # DB connection, multer, Google Drive
│   │   ├── middleware/   # Auth, audit middleware
│   │   └── utils/        # Helpers (token generation, PDF, Drive)
│   ├── migrations/       # Sequelize migrations
│   └── src/
│       ├── controllers/  # Route handlers
│       ├── models/       # Sequelize models
│       ├── routes/       # API route definitions
│       └── services/     # Business logic
├── frontend/
│   └── src/
│       ├── components/   # Reusable UI components
│       ├── context/      # React context providers
│       ├── global/       # API clients
│       ├── pages/        # Page components by user role
│       └── routes/       # Route configuration
└── README.md
```

## API Endpoints

### Authentication (`/auth`)
- `POST /auth/login` - User login
- `POST /auth/logout` - User logout
- `POST /auth/refresh-token` - Refresh access token
- `GET /auth/me` - Get current user profile

### Users (`/users`)
- `POST /users/register` - Register new user (pet owner or clinic admin)
- `GET /users/:id` - Get user by ID
- `PUT /users/update/:id` - Update user details
- `PUT /users/email-check` - Check if email exists
- `POST /users/vet` - Create vet professional (clinic admin only)
- `PATCH /users/vet/:vetId` - Update vet professional
- `GET /users/my-clinic/vets` - Get vet professionals for clinic

### Pets (`/pets`)
- `POST /pets/register` - Register a new pet
- `GET /pets/` - Get current user's pets
- `GET /pets/:pet_id` - Get pet by ID
- `PATCH /pets/:pet_id` - Update pet
- `DELETE /pets/:pet_id` - Delete pet

### Clinics (`/clinics`)
- `POST /clinics/register` - Register new clinic (clinic admin only)
- `PATCH /clinics/update/:clinicId` - Update clinic details
- `GET /clinics/approved` - Get all approved clinics
- `GET /clinics/search` - Search clinics
- `GET /clinics/public/:clinicId` - Get clinic by ID (public)
- `GET /clinics/my-clinic` - Get current admin's clinic

### Appointments (`/appointments`)
- `POST /appointments/create` - Create new appointment
- `GET /appointments/owner` - Get appointments by pet owner
- `GET /appointments/vet` - Get appointments by vet professional
- `GET /appointments/clinic/:clinicId` - Get appointments by clinic
- `PATCH /appointments/approve/:appointmentId` - Approve appointment
- `PATCH /appointments/reject/:appointmentId` - Reject appointment
- `PATCH /appointments/complete/:appointmentId` - Mark appointment complete
- `DELETE /appointments/delete/:appointmentId` - Delete appointment

### EHR - Electronic Health Records (`/ehr`)
- `POST /ehr/create` - Create new health record (vet only)
- `GET /ehr/:ehrId` - Get health record by ID
- `GET /ehr/owner/all` - Get all EHRs for pet owner
- `GET /ehr/pet/:petId` - Get all EHRs for a specific pet
- `GET /ehr/vet/all` - Get all EHRs created by vet
- `GET /ehr/clinic/:clinicId` - Get all EHRs for clinic
- `PATCH /ehr/:ehrId` - Update health record
- `DELETE /ehr/:ehrId` - Delete health record
- `DELETE /ehr/:ehrId/file/:fileId` - Delete file from health record

## License

This project is licensed under the ISC License.

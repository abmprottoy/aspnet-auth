# ASP.NET Core Authentication

A complete authentication system demonstrating ASP.NET Core Identity with JWT authentication and a React TypeScript frontend using Fluent UI v2.

> [!NOTE]
> This project is a full-stack demo. The backend uses an in-memory database for easy setup and testing. For production, switch to a persistent database.

## Features

### Backend (ASP.NET Core)
- **ASP.NET Core Identity** - User management and authentication
- **JWT Token Authentication** - Secure token-based authentication
- **HTTP-Only Cookies** - Secure token storage on the client side
- **In-Memory Database** - Entity Framework Core with in-memory database for demo purposes
- **Secure API Endpoints** - Protected weather data endpoints
- **CORS Configuration** - Properly configured for React frontend
- **Swagger Documentation** - API documentation and testing interface

### Frontend (React TypeScript)
- **React 18** with TypeScript
- **Fluent UI v2** - Modern Microsoft design system
- **React Router** - Client-side routing
- **Axios** - HTTP client with interceptors
- **Context API** - Global authentication state management
- **Protected Routes** - Route-level authentication guards
- **Responsive Design** - Mobile-friendly interface
- **Form Validation** - Client-side form validation

## Project Structure

```
aspnet-auth/
├── backend/                   # ASP.NET Core API
│   ├── Controllers/           # API controllers
│   ├── Data/                  # Entity Framework context
│   ├── Entities/              # Data models
│   ├── Interfaces/            # Service interfaces
│   ├── Models/                # DTOs and request/response models
│   ├── Services/              # Business logic services
│   ├── Program.cs             # Application entry point
│   └── appsettings.json       # Configuration
├── frontend/                  # React TypeScript app
│   ├── public/                # Static assets
│   ├── src/
│   │   ├── components/        # React components
│   │   ├── contexts/          # React contexts
│   │   ├── services/          # API services
│   │   ├── types/             # TypeScript type definitions
│   │   └── App.tsx            # Main app component
│   ├── package.json           # Frontend dependencies
│   └── tsconfig.json          # TypeScript configuration
├── .gitignore                 # Git ignore rules
└── README.md                  # This file
```

## Getting Started

### Prerequisites
- [.NET 9.0 SDK](https://dotnet.microsoft.com/download/dotnet/9.0)
- [Node.js](https://nodejs.org/) (v16 or higher)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)

### Backend Setup

> [!IMPORTANT]
> **Configuration files (`appsettings.json`, `appsettings.Development.json`) are NOT committed to version control.** You must create them from the provided templates before running the backend.

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Create your configuration files from templates:
   ```bash
   cp appsettings.template.json appsettings.json
   cp appsettings.Development.template.json appsettings.Development.json
   ```

3. Update the JWT secret key in both configuration files:
   - Open `appsettings.json` and `appsettings.Development.json`
   - Replace `REPLACE_WITH_YOUR_SECRET_KEY_AT_LEAST_32_CHARACTERS_LONG` with a secure secret key (minimum 32 characters)
   - Example: `"Key": "MySecretKeyForJWTTokenGeneration123456789"` (This is just an example, you should generate a secure secret key)

> [!WARNING]
> **Never commit `appsettings.json` or `appsettings.Development.json` to version control.** These files contain sensitive information like JWT secrets and database connection strings.

4. Restore NuGet packages:
   ```bash
   dotnet restore
   ```

5. Run the backend API:
   ```bash
   dotnet run
   ```

   The API will be available at `http://localhost:5153` (or the port shown in your terminal).

> [!TIP]
> If you need to use a different port, update both the backend launch settings and the `API_BASE_URL` in the frontend service file.

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install npm packages:
   ```bash
   npm install --legacy-peer-deps
   ```

3. Update the API base URL in `src/services/authService.ts` if needed:
   ```typescript
   const API_BASE_URL = 'https://localhost:7083/api'; // Update port if different
   ```

4. Start the React development server:
   ```bash
   npm start
   ```

   The frontend will be available at `http://localhost:3000`.

> [!TIP]
> The frontend is configured to send credentials (cookies) with every request. Make sure your backend CORS policy allows credentials and the correct origin.

## Usage

### Registration
1. Navigate to `http://localhost:3000`
2. Click "Sign Up" to create a new account
3. Fill in the registration form with your details
4. Upon successful registration, you'll be redirected to the dashboard

### Login
1. Click "Sign In" from the home page
2. Enter your email and password
3. Upon successful login, you'll be redirected to the dashboard

### Dashboard
The dashboard displays:
- User profile information
- Current weather data (secured endpoint)
- 5-day weather forecast (secured endpoint)
- Weather data for multiple cities (secured endpoint)

### Security Features
- JWT tokens are stored in HTTP-only cookies
- Automatic token refresh on API calls
- Protected routes require authentication
- Secure logout clears authentication cookies

## API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `GET /api/auth/me` - Get current user info
- `GET /api/auth/check` - Check authentication status

### Weather (Protected)
- `GET /api/weather/forecast` - Get 5-day weather forecast
- `GET /api/weather/current` - Get current weather
- `GET /api/weather/cities` - Get weather for multiple cities

## Configuration

### Backend Configuration
The backend uses configuration files that are **NOT** committed to version control for security reasons. You'll need to create them from the provided templates:

1. Copy `appsettings.template.json` to `appsettings.json`
2. Copy `appsettings.Development.template.json` to `appsettings.Development.json`
3. Update the JWT secret key in both files

> [!CAUTION]
> **Never share your JWT secret or production database credentials.** Use environment variables or secure vaults for production secrets.

**⚠️ Important**: Never commit `appsettings.json` or `appsettings.Development.json` to version control as they contain sensitive information like JWT secrets.

### Frontend Configuration
The frontend configuration is in `src/services/authService.ts`:

```typescript
const API_BASE_URL = 'http://localhost:5153/api';
```

## Technologies Used

### Backend
- ASP.NET Core 9.0
- Entity Framework Core
- ASP.NET Core Identity
- JWT Bearer Authentication
- Swagger/OpenAPI

### Frontend
- React 18
- TypeScript
- Fluent UI v2
- React Router
- Axios
- Context API

## Security Considerations

1. **HTTP-Only Cookies**: JWT tokens are stored in HTTP-only cookies to prevent XSS attacks
2. **CORS Configuration**: Properly configured CORS for secure cross-origin requests
3. **Token Validation**: Comprehensive JWT token validation on the backend
4. **Password Requirements**: Enforced password complexity requirements
5. **Protected Routes**: Client-side route protection with authentication guards
6. **Configuration Security**: Sensitive configuration files are excluded from version control
7. **JWT Secret Management**: JWT secrets should be strong (minimum 32 characters) and unique per environment

> [!CAUTION]
> For production deployments, always:
> - Use HTTPS
> - Store secrets securely (not in source code)
> - Use a persistent database
> - Regularly rotate secrets and credentials

## Development Notes

- The backend uses an in-memory database for demo purposes. In production, configure a proper database connection string.
- JWT secret keys should be stored securely (e.g., Azure Key Vault, environment variables).
- HTTPS should be enforced in production environments.
- Consider implementing refresh tokens for enhanced security.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

This project is for demonstration purposes. Feel free to use it as a starting point for your own projects. 
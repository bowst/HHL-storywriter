# Setup Guide for Campaign Story Creator

## Prerequisites

### 1. Install Node.js
- Download and install Node.js 18+ from [nodejs.org](https://nodejs.org/)
- Verify installation:
  ```bash
  node --version
  npm --version
  ```

### 2. Clone the Repository
```bash
git clone https://github.com/sophieerummlerr/HHL-storywriter.git
cd HHL-storywriter
```

### 3. Install Dependencies
```bash
npm run install:all
```
This command installs dependencies for the main project, backend, and frontend.

### 4. Environment Setup
1. Copy the environment file:
   ```bash
   cd backend
   cp .env.example .env
   ```

2. Edit `backend/.env` with your Google Cloud details:
   ```
   GOOGLE_CLOUD_PROJECT=your-project-id
   GOOGLE_CLOUD_LOCATION=us-central1
   PORT=3001
   ```

### 5. Google Cloud Authentication

**Option A: Service Account Key (Recommended)**
1. Create a service account in Google Cloud Console
2. Download the JSON key file
3. Set environment variable:
   ```bash
   export GOOGLE_APPLICATION_CREDENTIALS="path/to/your/service-account-key.json"
   ```

**Option B: gcloud CLI**
1. Install [Google Cloud CLI](https://cloud.google.com/sdk/docs/install)
2. Authenticate:
   ```bash
   gcloud auth application-default login
   ```

## Running the Application

### Start Development Servers
```bash
npm run dev
```

This starts both:
- **Backend**: http://localhost:3001
- **Frontend**: http://localhost:3000

### Individual Commands
```bash
# Backend only
npm run dev:backend

# Frontend only
npm run dev:frontend
```

## Troubleshooting

### Common Issues

1. **Port already in use**
   - Change PORT in `backend/.env`
   - Or kill existing processes: `lsof -ti:3001 | xargs kill`

2. **Google Cloud authentication failed**
   - Check if Vertex AI API is enabled
   - Verify credentials file path
   - Ensure service account has proper permissions

3. **Dependencies not installing**
   - Clear npm cache: `npm cache clean --force`
   - Delete node_modules: `rm -rf node_modules package-lock.json`
   - Reinstall: `npm install`

### Required Google Cloud APIs
- Vertex AI API
- Cloud Resource Manager API

### Permissions Needed
- Vertex AI User
- Editor (or custom role with vertexai.models.predict)

## Testing the Setup

1. Open http://localhost:3000
2. Click "Get Started"
3. Answer a few questions
4. Generate a story to test AI integration

## Building for Production

```bash
# Build both frontend and backend
npm run build

# Start production server
cd backend && npm start
```

## Support

- Check the logs in the terminal for error messages
- Verify Google Cloud project settings
- Ensure all environment variables are set correctly 
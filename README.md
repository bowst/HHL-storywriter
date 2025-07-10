# Campaign Story Creator

A fundraising story creation app that uses Google Vertex AI to help users craft compelling campaign stories through guided questions.

## Features

- **Welcome Screen**: Introduction to the app
- **Tone Selection**: Choose from serious, hopeful, light-hearted, or sentimental tones
- **Guided Questions**: 16 thoughtfully crafted questions with follow-ups and skip options
- **Story Preview**: AI-generated story based on user responses
- **Export Options**: Export data as JSON or CSV
- **Auto-save**: Answers are automatically saved as users progress
- **Responsive Design**: Beautiful, modern UI that works on all devices

## Architecture

- **Frontend**: React with TypeScript
- **Backend**: Node.js/Express with TypeScript
- **AI Service**: Google Vertex AI (Gemini Pro)
- **Data Storage**: In-memory (easily replaceable with database)

## Setup Instructions

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Google Cloud Project with Vertex AI enabled
- Google Cloud credentials

### Google Cloud Setup

1. Create a Google Cloud Project
2. Enable the Vertex AI API
3. Create a service account and download the JSON key file
4. Set up authentication:
   ```bash
   export GOOGLE_APPLICATION_CREDENTIALS="path/to/your/service-account-key.json"
   ```

### Installation

1. Clone the repository and install dependencies:
   ```bash
   npm run install:all
   ```

2. Set up environment variables:
   ```bash
   cd backend
   cp .env.example .env
   ```
   Edit `.env` with your Google Cloud project details:
   ```
   GOOGLE_CLOUD_PROJECT=your-project-id
   GOOGLE_CLOUD_LOCATION=us-central1
   PORT=3001
   ```

### Running the Application

1. Start both backend and frontend in development mode:
   ```bash
   npm run dev
   ```

   Or start them separately:
   ```bash
   # Backend (runs on port 3001)
   npm run dev:backend
   
   # Frontend (runs on port 3000)
   npm run dev:frontend
   ```

2. Open http://localhost:3000 in your browser

## Project Structure

```
campaign-stories/
├── backend/
│   ├── src/
│   │   ├── data/
│   │   │   └── questions.ts      # Question definitions
│   │   ├── services/
│   │   │   └── vertexai.ts       # Google Vertex AI service
│   │   ├── types/
│   │   │   └── index.ts          # TypeScript interfaces
│   │   └── server.ts             # Express server
│   ├── package.json
│   └── tsconfig.json
├── frontend/
│   ├── src/
│   │   ├── App.tsx               # Main React component
│   │   ├── App.css               # Styles
│   │   ├── index.tsx             # React entry point
│   │   └── index.css             # Global styles
│   ├── public/
│   │   └── index.html            # HTML template
│   └── package.json
└── README.md
```

## API Endpoints

- `GET /api/questions` - Get all questions
- `POST /api/users` - Create new user session
- `GET /api/users/:userId` - Get user data
- `POST /api/users/:userId/answers` - Save user answers
- `POST /api/users/:userId/tone` - Set user tone preference
- `POST /api/generate-story` - Generate story using AI
- `GET /api/users/:userId/export` - Export user data (JSON/CSV)
- `GET /api/health` - Health check

## Question Flow

The app follows this narrative structure:
1. **Introduction** - Who is this person beyond their diagnosis?
2. **Struggle** - What challenges are they facing?
3. **Help** - How can donations and support make a difference?

### Question Categories

- **Intro**: Identity, interesting qualities, what people love about them
- **Struggle**: Challenges, diagnosis thoughts, vulnerable moments
- **Help**: How funds help, what they're fundraising for, other ways to help
- **Background**: Hospital, previous resources, time-sensitive needs

## AI Story Generation

The system uses Google Vertex AI's Gemini Pro model with:
- Custom system instructions for Help Hope Live writing style
- Tone-specific prompts (serious, hopeful, light-hearted, sentimental)
- Structured narrative following intro → struggle → help flow
- Filtered answers (skipped questions are excluded)

## Deployment

### Backend Deployment

1. Build the backend:
   ```bash
   cd backend && npm run build
   ```

2. Deploy to your preferred platform (Google Cloud Run, AWS, etc.)
3. Set environment variables in production

### Frontend Deployment

1. Build the frontend:
   ```bash
   cd frontend && npm run build
   ```

2. Deploy the `build` folder to your hosting platform
3. Configure proxy/routing to point API calls to your backend

## Future Enhancements

- Database integration (PostgreSQL, MongoDB)
- User authentication and sessions
- Multiple story versions for different tones
- Image upload support
- Advanced export formats
- Story editing interface
- Analytics and metrics
- Mobile app version

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For issues or questions, please open a GitHub issue or contact the development team. 
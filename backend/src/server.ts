import express from 'express';
import cors from 'cors';
import { config } from 'dotenv';
import { v4 as uuidv4 } from 'uuid';
import { VertexAIService } from './services/vertexai';
import { questions } from './data/questions';
import { User, Answer, StoryGenerationRequest } from './types';

config();

const app = express();
const port = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// In-memory storage (replace with database in production)
const users: Map<string, User> = new Map();
const vertexAIService = new VertexAIService();

// API Routes

// Get all questions
app.get('/api/questions', (req, res) => {
  res.json(questions);
});

// Create new user session
app.post('/api/users', (req, res) => {
  const userId = uuidv4();
  const user: User = {
    userId,
    answers: [],
    createdAt: new Date(),
    updatedAt: new Date()
  };
  users.set(userId, user);
  res.json({ userId });
});

// Get user data
app.get('/api/users/:userId', (req, res) => {
  const { userId } = req.params;
  const user = users.get(userId);
  
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }
  
  res.json(user);
});

// Save user answers
app.post('/api/users/:userId/answers', (req, res) => {
  const { userId } = req.params;
  const { answers }: { answers: Answer[] } = req.body;
  
  const user = users.get(userId);
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }
  
  user.answers = answers;
  user.updatedAt = new Date();
  users.set(userId, user);
  
  res.json({ success: true });
});

// Set user tone
app.post('/api/users/:userId/tone', (req, res) => {
  const { userId } = req.params;
  const { tone } = req.body;
  
  const user = users.get(userId);
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }
  
  user.tone = tone;
  user.updatedAt = new Date();
  users.set(userId, user);
  
  res.json({ success: true });
});

// Generate story
app.post('/api/generate-story', async (req, res) => {
  const { userId, tone, answers }: StoryGenerationRequest = req.body;
  
  try {
    const story = await vertexAIService.generateStory(tone, answers);
    
    // Save story to user
    const user = users.get(userId);
    if (user) {
      user.storyDraft = story;
      user.updatedAt = new Date();
      users.set(userId, user);
    }
    
    res.json({ story, userId });
  } catch (error) {
    console.error('Error generating story:', error);
    res.status(500).json({ error: 'Failed to generate story' });
  }
});

// Export user data
app.get('/api/users/:userId/export', (req, res) => {
  const { userId } = req.params;
  const { format = 'json' } = req.query;
  
  const user = users.get(userId);
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }
  
  if (format === 'csv') {
    // Simple CSV export
    const csvData = [
      'Question ID,Answer,Follow-up Answer,Skipped',
      ...user.answers.map(a => 
        `"${a.questionId}","${a.answer || ''}","${a.followUpAnswer || ''}","${a.skipped}"`
      ),
      `"Story","${user.storyDraft || ''}","","false"`
    ].join('\n');
    
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename="campaign-story-${userId}.csv"`);
    res.send(csvData);
  } else {
    // JSON export
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Content-Disposition', `attachment; filename="campaign-story-${userId}.json"`);
    res.json(user);
  }
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
}); 
export interface Answer {
  questionId: string;
  answer: string;
  followUpAnswer?: string;
  skipped: boolean;
}

export interface User {
  userId: string;
  answers: Answer[];
  storyDraft?: string;
  tone?: 'serious' | 'hopeful' | 'light-hearted' | 'sentimental';
  createdAt: Date;
  updatedAt: Date;
}

export interface Question {
  id: string;
  text: string;
  followUpText?: string;
  category: 'basic_info' | 'intro' | 'struggle' | 'help' | 'background';
  required: boolean;
}

export interface StoryGenerationRequest {
  userId: string;
  tone: string;
  answers: Answer[];
}

export interface StoryGenerationResponse {
  story: string;
  userId: string;
} 
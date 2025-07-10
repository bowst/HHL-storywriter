import { VertexAI } from '@google-cloud/vertexai';
import { Answer } from '../types';

export class VertexAIService {
  private vertexAI: VertexAI | null = null;
  private model: any = null;
  private isConfigured: boolean = false;

  constructor() {
    try {
      if (process.env.GOOGLE_CLOUD_PROJECT && process.env.GOOGLE_CLOUD_PROJECT !== 'your-project-id') {
        this.vertexAI = new VertexAI({
          project: process.env.GOOGLE_CLOUD_PROJECT,
          location: process.env.GOOGLE_CLOUD_LOCATION || 'us-central1'
        });
        
        this.model = this.vertexAI.getGenerativeModel({
          model: 'gemini-2.5-flash',
          generationConfig: {
            maxOutputTokens: 2048,
            temperature: 0.7,
            topP: 0.8,
            topK: 40,
          },
        });
        
        this.isConfigured = true;
        console.log('✅ Vertex AI service configured successfully');
      } else {
        console.log('⚠️ Google Cloud credentials not configured. Story generation will use mock data.');
      }
    } catch (error) {
      console.error('❌ Failed to initialize Vertex AI service:', error);
      console.log('💡 Server will continue running with mock story generation');
    }
  }

  async generateStory(tone: string, answers: Answer[]): Promise<string> {
    if (!this.isConfigured || !this.model) {
      // Return a mock story when Vertex AI is not configured
      return this.generateMockStory(tone, answers);
    }

    const systemInstruction = `You are an expert writer at Help Hope Live, proficient in creative writing. Keep the story simple, supporters don't need a lot of medical or scientific details. Just help them understand why they should care and how they can help.

Write the story in FIRST PERSON from the perspective of the person who needs help. Use "I", "me", "my" throughout the story to make it personal and direct.

The story should follow this narrative structure:
1. Introduction - Who am I beyond my diagnosis?
2. Struggle - What challenges am I facing?
3. Help - How can donations and support make a difference in my life?

Write in a ${tone} tone. Make it compelling and personal while remaining respectful and authentic.`;

    const answersText = answers
      .filter(a => !a.skipped && a.answer)
      .map(a => {
        let text = `${a.answer}`;
        if (a.followUpAnswer) {
          text += ` ${a.followUpAnswer}`;
        }
        return text;
      })
      .join('\n\n');

    const prompt = `${systemInstruction}\n\nBased on these answers, write a compelling fundraising story:\n\n${answersText}`;

    try {
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      
      // Try different methods to extract text from response
      let generatedText = '';
      if (typeof response.text === 'function') {
        generatedText = response.text();
      } else if (response.candidates && response.candidates[0]) {
        const candidate = response.candidates[0];
        if (candidate.content && candidate.content.parts && candidate.content.parts[0]) {
          generatedText = candidate.content.parts[0].text;
        }
      } else if (response.text) {
        generatedText = response.text;
      }
      
      return generatedText || 'Unable to generate story. Please try again.';
    } catch (error) {
      console.error('Error generating story:', error);
      console.log('Falling back to mock story generation');
      return this.generateMockStory(tone, answers);
    }
  }

  private generateMockStory(tone: string, answers: Answer[]): string {
    const answersText = answers
      .filter(a => !a.skipped && a.answer)
      .map(a => {
        let text = `${a.answer}`;
        if (a.followUpAnswer) {
          text += ` ${a.followUpAnswer}`;
        }
        return text;
      })
      .join('\n\n');

    return `[MOCK STORY - ${tone.toUpperCase()} TONE - FIRST PERSON]

This is a sample story generated from your answers. To get AI-generated stories, please configure your Google Cloud Vertex AI credentials.

Based on your responses:
${answersText}

Your story would be crafted in a ${tone} tone, written in first person from your perspective, following the narrative structure of introduction, struggle, and how people can help. 

To enable AI story generation:
1. Set up a Google Cloud project
2. Enable Vertex AI API
3. Configure authentication
4. Update your .env file with your project details

For now, you can continue testing the app with this mock story generation.`;
  }
} 
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

interface Answer {
  questionId: string;
  answer: string;
  followUpAnswer?: string;
  skipped: boolean;
}

interface Question {
  id: string;
  text: string;
  followUpText?: string;
  category: string;
  required: boolean;
}

interface User {
  userId: string;
  answers: Answer[];
  storyDraft?: string;
  tone?: string;
}

const App: React.FC = () => {
  const [currentStep, setCurrentStep] = useState<'welcome' | 'questions' | 'preview'>('welcome');
  const [userId, setUserId] = useState<string>('');
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [tone, setTone] = useState<string>('');
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [storyDraft, setStoryDraft] = useState<string>('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchQuestions();
    createUser();
  }, []);

  const fetchQuestions = async () => {
    try {
      const response = await axios.get('/api/questions');
      setQuestions(response.data);
    } catch (error) {
      console.error('Error fetching questions:', error);
    }
  };

  const createUser = async () => {
    try {
      const response = await axios.post('/api/users');
      setUserId(response.data.userId);
    } catch (error) {
      console.error('Error creating user:', error);
    }
  };

  const saveAnswers = async (answersToSave: Answer[]) => {
    try {
      await axios.post(`/api/users/${userId}/answers`, { answers: answersToSave });
    } catch (error) {
      console.error('Error saving answers:', error);
    }
  };

  const generateStory = async () => {
    setLoading(true);
    try {
      // Extract tone from answers if not already set
      const toneAnswer = answers.find(a => a.questionId === 'tone');
      const storyTone = tone || toneAnswer?.answer || 'hopeful';
      
      const response = await axios.post('/api/generate-story', {
        userId,
        tone: storyTone,
        answers
      });
      setStoryDraft(response.data.story);
    } catch (error) {
      console.error('Error generating story:', error);
    } finally {
      setLoading(false);
    }
  };

  const exportData = async (format: 'json' | 'csv') => {
    try {
      const response = await axios.get(`/api/users/${userId}/export?format=${format}`, {
        responseType: format === 'csv' ? 'blob' : 'json'
      });
      
      if (format === 'csv') {
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.download = `campaign-story-${userId}.csv`;
        link.click();
      } else {
        const dataStr = JSON.stringify(response.data, null, 2);
        const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
        const exportFileDefaultName = `campaign-story-${userId}.json`;
        const linkElement = document.createElement('a');
        linkElement.setAttribute('href', dataUri);
        linkElement.setAttribute('download', exportFileDefaultName);
        linkElement.click();
      }
    } catch (error) {
      console.error('Error exporting data:', error);
    }
  };

  const handleAnswer = (answer: string) => {
    const question = questions[currentQuestionIndex];
    const existingAnswerIndex = answers.findIndex(a => a.questionId === question.id);
    
    let updatedAnswers = [...answers];
    
    if (existingAnswerIndex >= 0) {
      updatedAnswers[existingAnswerIndex] = {
        questionId: question.id,
        answer,
        skipped: false
      };
    } else {
      updatedAnswers.push({
        questionId: question.id,
        answer,
        skipped: false
      });
    }
    
    // If this is the tone question, save the tone separately
    if (question.id === 'tone') {
      setTone(answer);
      try {
        axios.post(`/api/users/${userId}/tone`, { tone: answer });
      } catch (error) {
        console.error('Error saving tone:', error);
      }
    }
    
    setAnswers(updatedAnswers);
    saveAnswers(updatedAnswers);
    handleNext();
  };

  const handleSkip = () => {
    const question = questions[currentQuestionIndex];
    const updatedAnswers = [...answers];
    const existingAnswerIndex = answers.findIndex(a => a.questionId === question.id);
    
    if (existingAnswerIndex >= 0) {
      updatedAnswers[existingAnswerIndex].skipped = true;
    } else {
      updatedAnswers.push({
        questionId: question.id,
        answer: '',
        skipped: true
      });
    }
    
    setAnswers(updatedAnswers);
    saveAnswers(updatedAnswers);
    handleNext();
  };

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      setCurrentStep('preview');
      generateStory();
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const renderWelcome = () => (
    <div className="welcome-screen">
      <h1>Create Your Campaign Story</h1>
      <p>Let's craft a compelling story that will help supporters understand your journey and how they can help.</p>
      <button onClick={() => setCurrentStep('questions')} className="btn btn-primary">
        Get Started
      </button>
    </div>
  );

  const renderQuestions = () => {
    if (questions.length === 0) return <div>Loading...</div>;
    
    const question = questions[currentQuestionIndex];
    const existingAnswer = answers.find(a => a.questionId === question.id);
    
    // Special handling for tone question - show as buttons instead of textarea
    if (question.id === 'tone') {
      return (
        <div className="question-screen">
          <div className="progress-bar">
            <div 
              className="progress-fill" 
              style={{ width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }}
            />
          </div>
          
          <div className="question-card">
            <h3>{question.text}</h3>
            
            <div className="tone-buttons">
              {['serious', 'hopeful', 'light-hearted', 'sentimental'].map(toneOption => (
                <button
                  key={toneOption}
                  onClick={() => handleAnswer(toneOption)}
                  className={`btn btn-tone ${existingAnswer?.answer === toneOption ? 'selected' : ''}`}
                >
                  {toneOption.charAt(0).toUpperCase() + toneOption.slice(1)}
                </button>
              ))}
            </div>
            
            <div className="button-group">
              <button onClick={handlePrevious} disabled={currentQuestionIndex === 0} className="btn btn-secondary">
                Back
              </button>
              {!question.required && (
                <button onClick={handleSkip} className="btn btn-skip">
                  Skip
                </button>
              )}
            </div>
          </div>
          
          <div className="question-info">
            Question {currentQuestionIndex + 1} of {questions.length}
          </div>
        </div>
      );
    }
    
    return (
      <div className="question-screen">
        <div className="progress-bar">
          <div 
            className="progress-fill" 
            style={{ width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }}
          />
        </div>
        
        <div className="question-card">
          <h3>{question.text}</h3>
          
          <textarea
            placeholder="Your answer..."
            defaultValue={existingAnswer?.answer || ''}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && e.ctrlKey) {
                handleAnswer(e.currentTarget.value);
              }
            }}
            rows={4}
            className="answer-input"
          />
          
          <div className="button-group">
            <button onClick={handlePrevious} disabled={currentQuestionIndex === 0} className="btn btn-secondary">
              Back
            </button>
            
            {!question.required && (
              <button onClick={handleSkip} className="btn btn-skip">
                Skip
              </button>
            )}
            
            <button 
              onClick={(e) => {
                const textarea = e.currentTarget.parentElement?.parentElement?.querySelector('textarea') as HTMLTextAreaElement;
                if (textarea) {
                  handleAnswer(textarea.value);
                }
              }}
              className="btn btn-primary"
            >
              Next
            </button>
          </div>
        </div>
        
        <div className="question-info">
          Question {currentQuestionIndex + 1} of {questions.length}
        </div>
      </div>
    );
  };

  const renderPreview = () => (
    <div className="preview-screen">
      <h2>Your Story Preview</h2>
      
      {loading ? (
        <div className="loading">Generating your story...</div>
      ) : (
        <div className="story-preview">
          <pre>{storyDraft}</pre>
        </div>
      )}
      
      <div className="button-group">
        <button onClick={() => setCurrentStep('questions')} className="btn btn-secondary">
          Edit Answers
        </button>
        
        <button onClick={() => generateStory()} className="btn btn-primary" disabled={loading}>
          Regenerate Story
        </button>
      </div>
      
      <div className="export-section">
        <h3>Export Your Data</h3>
        <button onClick={() => exportData('json')} className="btn btn-export">
          Export as JSON
        </button>
        <button onClick={() => exportData('csv')} className="btn btn-export">
          Export as CSV
        </button>
      </div>
    </div>
  );

  return (
    <div className="App">
      {currentStep === 'welcome' && renderWelcome()}
      {currentStep === 'questions' && renderQuestions()}
      {currentStep === 'preview' && renderPreview()}
    </div>
  );
};

export default App; 
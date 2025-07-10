import { Question } from '../types';

export const questions: Question[] = [
  // Basic Campaign Information
  {
    id: 'name',
    text: 'What is your name?',
    category: 'basic_info',
    required: true
  },
  {
    id: 'gender',
    text: 'What are your pronouns? This helps us write your story correctly (he/him, she/her, they/them, etc.)',
    category: 'basic_info',
    required: true
  },
  {
    id: 'condition',
    text: 'What is your medical condition or injury? Please provide a brief description of your diagnosis or what happened',
    category: 'basic_info',
    required: true
  },
  {
    id: 'age',
    text: 'How old are you? This helps supporters understand your life stage',
    category: 'basic_info',
    required: false
  },
  // Tone Selection
  {
    id: 'tone',
    text: 'What tone feels right for your story? Would you like to sound hopeful, serious, or something else?',
    category: 'intro',
    required: false
  },
  {
    id: 'identity',
    text: 'Who are you outside of your diagnosis? Tell us about your work, hobbies, family, etc.',
    category: 'intro',
    required: false
  },
  {
    id: 'interesting_things',
    text: 'What are some interesting things about you?',
    followUpText: 'How would your friends and family describe you?',
    category: 'intro',
    required: false
  },
  {
    id: 'loved_qualities',
    text: 'What do other people love about you?',
    followUpText: 'Are there any quotes, compliments, or traits people mention?',
    category: 'intro',
    required: false
  },
  {
    id: 'struggles',
    text: 'What are 1-5 things you struggle with because of your condition? This can be daily activities, feelings, or anything that is hard.',
    category: 'struggle',
    required: true
  },
  {
    id: 'how_funds_help',
    text: 'How could these funds help change your life? What will you be able to enjoy again? Or for the first time?',
    category: 'help',
    required: true
  },
  {
    id: 'fundraising_for',
    text: 'What are you fundraising for? If cost is known (or rough estimate) please add it.',
    category: 'help',
    required: true
  },
  {
    id: 'other_help',
    text: 'How can people help besides donating money? Can people visit? Help with car rides? Gas money? Food? Clothing? Etc.',
    category: 'help',
    required: false
  },
  {
    id: 'summary',
    text: 'Can you summarize your fundraiser in one sentence?',
    category: 'help',
    required: false
  },
  {
    id: 'hospital',
    text: 'What hospital are you at?',
    category: 'background',
    required: false
  },
  {
    id: 'diagnosis_thoughts',
    text: 'What was going through your mind when you got your diagnosis?',
    category: 'struggle',
    required: false
  },
  {
    id: 'strong_vulnerable_moment',
    text: 'Can you describe a moment that made you feel strong or vulnerable lately? What helped you through it?',
    category: 'struggle',
    required: false
  },
  {
    id: 'unexpected_challenge',
    text: 'What has been the most unexpected challenge about all of this? How do you handle it?',
    category: 'struggle',
    required: false
  },
  {
    id: 'other_resources',
    text: 'Have you tried other resources or funding before this?',
    followUpText: 'Why is the fundraiser the best next step?',
    category: 'background',
    required: false
  },
  {
    id: 'time_sensitive',
    text: 'Are there any time-sensitive parts of your care or recovery right now? A scheduled surgery, treatment deadline',
    category: 'help',
    required: false
  },
  {
    id: 'looking_forward',
    text: 'What is something you\'re looking forward to if this goes well? Seeing a family member, going on a trip, even walking your dog',
    category: 'help',
    required: false
  }
]; 
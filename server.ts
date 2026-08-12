import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI, Type } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

app.use(express.json({ limit: '15mb' }));

// Initialize Google Gen AI client with server-side API Key
function getAiClient() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.warn('GEMINI_API_KEY environment variable is missing.');
  }
  return new GoogleGenAI({
    apiKey: apiKey || '',
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

const SYSTEM_INSTRUCTION = `You are WAEC AI Tutor, an educational assistant helping secondary-school students in West Africa understand academic concepts and practice WAEC-style questions.

Your purpose is teaching, explanation and exam preparation for WASSCE / WAEC exams.

Use clear and simple English suitable for secondary school students.

Never claim to be WAEC or West African Examinations Council.
Never claim AI-generated questions are official WAEC past questions.

When creating practice questions, label them: "WAEC-style practice question".

When solving a question:
- Explain what the question is asking
- Identify relevant concepts / important information
- Show step-by-step working / solution
- Give the final answer clearly
- Provide a detailed explanation
- Provide a practical exam tip (WASSCE specific)
- Point out common mistakes to avoid

If the question is unclear or incomplete, ask for clarification politely.
If an uploaded image is unclear or unreadable, tell the student that the image needs to be clearer.
Do not invent information. When uncertain, clearly state uncertainty.
Do not assist students in cheating during an active examination.
Prioritize understanding over memorization.`;

// 1. Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', service: 'WAEC AI Tutor Backend', timestamp: new Date().toISOString() });
});

// 2. AI Tutor Question Solver API
app.post('/api/gemini/tutor', async (req, res) => {
  try {
    const { question, subject, topic, difficulty, imageBase64, imageMimeType } = req.body;

    if (!question && !imageBase64) {

      res.status(400).json({ error: 'Please provide a question or an image.' });
      return;
    }

    const ai = getAiClient();
    
    // Prepare contents
    const parts: any[] = [];
    
    if (imageBase64) {
      parts.push({
        inlineData: {
          mimeType: imageMimeType || 'image/jpeg',
          data: imageBase64.includes(',') ? imageBase64.split(',')[1] : imageBase64,
        },
      });
    }

    const promptText = `Subject: ${subject || 'General Academic'}
Topic: ${topic || 'General'}
Target Exam Level: WAEC / WASSCE (${difficulty || 'Medium'})
Question / Prompt: ${question || 'Please analyze and solve the question in the attached image.'}

Please solve this and format your response as JSON matching this structure:
{
  "subject": "${subject || 'General'}",
  "topic": "${topic || 'General'}",
  "difficulty": "${difficulty || 'Medium'}",
  "questionType": "calculation",
  "explanation": {
    "asking": "Clear breakdown of what the question requires",
    "importantInfo": ["Key formula or rule 1", "Key concept 2"],
    "stepByStep": ["Step 1 description and working", "Step 2 description and working"],
    "finalAnswer": "The direct final answer highlighted",
    "explanation": "Why this answer is correct in simple terms",
    "examTip": "WASSCE exam tip on how to gain full marks",
    "commonMistake": "Typical error students make on this type of question"
  }
}`;

    parts.push({ text: promptText });

    const response = await ai.models.generateContent({
      model: 'gemini-3.6-flash',
      contents: { parts },
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            subject: { type: Type.STRING },
            topic: { type: Type.STRING },
            difficulty: { type: Type.STRING },
            questionType: { type: Type.STRING },
            explanation: {
              type: Type.OBJECT,
              properties: {
                asking: { type: Type.STRING },
                importantInfo: { type: Type.ARRAY, items: { type: Type.STRING } },
                stepByStep: { type: Type.ARRAY, items: { type: Type.STRING } },
                finalAnswer: { type: Type.STRING },
                explanation: { type: Type.STRING },
                examTip: { type: Type.STRING },
                commonMistake: { type: Type.STRING },
              },
              required: ['asking', 'stepByStep', 'finalAnswer', 'explanation', 'examTip', 'commonMistake'],
            },
          },
          required: ['subject', 'topic', 'difficulty', 'explanation'],
        },
      },
    });

    const jsonText = response.text || '{}';
    const data = JSON.parse(jsonText);

    res.json({ success: true, data });
  } catch (err: any) {
    console.error('Tutor API Error:', err);
    res.status(500).json({
      error: 'We couldn\'t process your question right now. Please check your network connection or try again.',
      details: err?.message || 'AI service temporary error',
    });
  }
});

// 3. Image OCR Question Extractor
app.post('/api/gemini/ocr', async (req, res) => {
  try {
    const { imageBase64, imageMimeType } = req.body;
    if (!imageBase64) {
      res.status(400).json({ error: 'Image is required.' });
      return;
    }

    const ai = getAiClient();
    const cleanBase64 = imageBase64.includes(',') ? imageBase64.split(',')[1] : imageBase64;

    const response = await ai.models.generateContent({
      model: 'gemini-3.6-flash',
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: imageMimeType || 'image/jpeg',
              data: cleanBase64,
            },
          },
          {
            text: 'Extract the handwritten or printed academic question from this image verbatim. Also detect the academic subject and topic.',
          },
        ],
      },
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            extractedQuestion: { type: Type.STRING },
            detectedSubject: { type: Type.STRING },
            detectedTopic: { type: Type.STRING },
            confidenceScore: { type: Type.NUMBER, description: 'Score between 0 and 100' },
            isClear: { type: Type.BOOLEAN },
            clarityNotes: { type: Type.STRING },
          },
          required: ['extractedQuestion', 'detectedSubject', 'confidenceScore', 'isClear'],
        },
      },
    });

    const data = JSON.parse(response.text || '{}');
    res.json({ success: true, data });
  } catch (err: any) {
    console.error('OCR API Error:', err);
    res.status(500).json({
      error: 'Failed to scan image. Please ensure the question image is clear and well lit.',
    });
  }
});

// 4. Quiz Generator API
app.post('/api/gemini/quiz', async (req, res) => {
  try {
    const { subject, topic, difficulty, questionCount = 5, questionType = 'multiple_choice' } = req.body;

    const ai = getAiClient();
    const prompt = `Generate a ${questionCount}-question WAEC-style practice quiz for the subject "${subject || 'Mathematics'}" on the topic "${topic || 'General'}".
Difficulty: ${difficulty || 'Medium'}.
Question Type: ${questionType}.

All questions must be formatted cleanly for secondary school students. Include correct answers and brief step-by-step explanations.
Label this internally as WAEC-style practice question.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.6-flash',
      contents: prompt,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            subject: { type: Type.STRING },
            topic: { type: Type.STRING },
            difficulty: { type: Type.STRING },
            questions: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  id: { type: Type.STRING },
                  question: { type: Type.STRING },
                  options: { type: Type.ARRAY, items: { type: Type.STRING } },
                  correctAnswer: { type: Type.STRING, description: 'The exact correct option string or value' },
                  explanation: { type: Type.STRING },
                  type: { type: Type.STRING },
                },
                required: ['id', 'question', 'correctAnswer', 'explanation'],
              },
            },
          },
          required: ['subject', 'topic', 'questions'],
        },
      },
    });

    const data = JSON.parse(response.text || '{}');
    res.json({ success: true, data });
  } catch (err: any) {
    console.error('Quiz Generator Error:', err);
    res.status(500).json({
      error: 'Could not generate practice quiz right now. Please try again.',
    });
  }
});

// 5. Flashcards Generator API
app.post('/api/gemini/flashcards', async (req, res) => {
  try {
    const { subject, topic } = req.body;
    const ai = getAiClient();

    const prompt = `Generate 6 high-yield WAEC exam flashcards for ${subject} on the topic "${topic}".
Each card should test a key term, formula, rule, or core concept that frequently appears in WASSCE exams.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.6-flash',
      contents: prompt,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            subject: { type: Type.STRING },
            topic: { type: Type.STRING },
            cards: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  id: { type: Type.STRING },
                  question: { type: Type.STRING },
                  answer: { type: Type.STRING },
                  explanation: { type: Type.STRING },
                },
                required: ['id', 'question', 'answer', 'explanation'],
              },
            },
          },
          required: ['subject', 'topic', 'cards'],
        },
      },
    });

    const data = JSON.parse(response.text || '{}');
    res.json({ success: true, data });
  } catch (err: any) {
    console.error('Flashcard Error:', err);
    res.status(500).json({ error: 'Failed to generate flashcards.' });
  }
});

// 6. AI Revision Notes API
app.post('/api/gemini/notes', async (req, res) => {
  try {
    const { subject, topic } = req.body;
    const ai = getAiClient();

    const prompt = `Create comprehensive WAEC revision notes for ${subject} on "${topic}".
Include clear definitions, core concepts, formulas, exam tips, and common mistakes.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.6-flash',
      contents: prompt,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            subject: { type: Type.STRING },
            topic: { type: Type.STRING },
            definition: { type: Type.STRING },
            keyConcepts: { type: Type.ARRAY, items: { type: Type.STRING } },
            examples: { type: Type.ARRAY, items: { type: Type.STRING } },
            formulas: { type: Type.ARRAY, items: { type: Type.STRING } },
            examTips: { type: Type.ARRAY, items: { type: Type.STRING } },
            commonMistakes: { type: Type.ARRAY, items: { type: Type.STRING } },
            summary: { type: Type.STRING },
          },
          required: ['subject', 'topic', 'definition', 'keyConcepts', 'examTips', 'summary'],
        },
      },
    });

    const data = JSON.parse(response.text || '{}');
    res.json({ success: true, data });
  } catch (err: any) {
    console.error('Notes Error:', err);
    res.status(500).json({ error: 'Failed to generate revision notes.' });
  }
});

// 7. AI Study Plan Generator API
app.post('/api/gemini/study-plan', async (req, res) => {
  try {
    const { examDate, subjects, dailyStudyMinutes, weakSubjects, strongSubjects } = req.body;
    const ai = getAiClient();

    const prompt = `Create a realistic 7-day weekly study schedule for a secondary school student preparing for WAEC exams on ${examDate || 'upcoming session'}.
Daily Study Time Available: ${dailyStudyMinutes || 120} minutes.
Subjects: ${(subjects || []).join(', ')}.
Weak Subjects needing extra focus: ${(weakSubjects || []).join(', ')}.
Strong Subjects: ${(strongSubjects || []).join(', ')}.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.6-flash',
      contents: prompt,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            weeklyPlan: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  id: { type: Type.STRING },
                  day: { type: Type.STRING },
                  subject: { type: Type.STRING },
                  topic: { type: Type.STRING },
                  targetObjective: { type: Type.STRING },
                  durationMinutes: { type: Type.NUMBER },
                  status: { type: Type.STRING },
                },
                required: ['id', 'day', 'subject', 'topic', 'targetObjective', 'durationMinutes'],
              },
            },
          },
          required: ['weeklyPlan'],
        },
      },
    });

    const data = JSON.parse(response.text || '{}');
    res.json({ success: true, data });
  } catch (err: any) {
    console.error('Study Plan Error:', err);
    res.status(500).json({ error: 'Failed to generate study plan.' });
  }
});

// Vite dev server middleware integration
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`WAEC AI Tutor backend running at http://0.0.0.0:${PORT}`);
  });
}

startServer();

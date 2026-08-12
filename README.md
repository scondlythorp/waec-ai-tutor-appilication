# WAEC AI Tutor & Study Companion

An AI-powered study platform designed specifically for West African secondary school students (SSS1–SSS3) preparing for the West African Senior School Certificate Examination (WASSCE / WAEC).

## 🌟 Key Features

- **AI Question Solver & Step-by-Step Tutor**:
  - Ask questions via text prompt, photo upload, or audio input.
  - Generates clear, step-by-step explanations, key formulas, and exam tips tailored to the WAEC syllabus.
  - Supports low-data mode for reliable access over limited bandwidth.

- **Interactive Practice & Assessment**:
  - **Quiz Generator**: Create custom multiple-choice quizzes targeted at specific subjects and topics.
  - **WASSCE Mock Exam Engine**: Timed past question simulation with question palette navigation and automatic scoring.
  - **Flashcards & Revision Notes**: Quick concept drills and concise revision summaries.

- **AI Study Planner**:
  - Generates personalized weekly study schedules based on student weak areas and target exam dates.
  - Tracks lesson completion status and daily streak progress.

- **Progress & Analytics Tracker**:
  - Tracks performance metrics, subject strength breakdowns, and test attempt histories.

- **Multi-Role Support**:
  - **Student View**: Complete study dashboard, streak counters, and AI tutor access.
  - **Teacher Portal**: Class management, assignment creation, and weakness trends.
  - **Admin Overview**: System analytics and popular topic metrics.

## 📚 Supported Subjects

14 core and elective subjects across West Africa:
- Core: Mathematics, English Language, Integrated Science, Social Studies
- Sciences: Physics, Chemistry, Biology, Further Mathematics
- Arts & Humanities: Government, Economics, Literature in English, Christian Religious Studies (CRS), History, Commerce

## 🚀 Tech Stack

- **Frontend**: React 18, TypeScript, Tailwind CSS, Lucide React Icons
- **Backend / Server**: Node.js, Express, Vite
- **AI Integration**: Gemini API (`@google/genai`)

## 🛠️ Getting Started

### Prerequisites
- Node.js 18+
- npm or bun

### Environment Variables
Copy `.env.example` to `.env` and set your API keys:
```env
GEMINI_API_KEY=your_gemini_api_key_here
```

### Installation
```bash
npm install
```

### Development
Start the local server on port 3000:
```bash
npm run dev
```

### Production Build
```bash
npm run build
npm start
```

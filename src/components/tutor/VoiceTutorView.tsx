import React, { useState, useEffect } from 'react';
import { Mic, MicOff, ArrowLeft, Volume2, VolumeX, Bot, Sparkles, RefreshCw, AlertCircle } from 'lucide-react';
import { aiService } from '../../services/aiService';
import { AiQuestionResponse } from '../../types';

interface VoiceTutorViewProps {
  onNavigate: (view: string, state?: any) => void;
  showToast: (msg: string, type?: 'success' | 'error' | 'info') => void;
}

export const VoiceTutorView: React.FC<VoiceTutorViewProps> = ({ onNavigate, showToast }) => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [recognition, setRecognition] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState<AiQuestionResponse | null>(null);
  const [isSpeaking, setIsSpeaking] = useState(false);

  useEffect(() => {
    if ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window) {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      const rec = new SpeechRecognition();
      rec.continuous = false;
      rec.interimResults = true;
      rec.lang = 'en-US';

      rec.onresult = (event: any) => {
        let currentTranscript = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          currentTranscript += event.results[i][0].transcript;
        }
        setTranscript(currentTranscript);
      };

      rec.onend = () => {
        setIsListening(false);
      };

      rec.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
        showToast('Speech recognition error. Please try speaking again.', 'error');
      };

      setRecognition(rec);
    }
  }, []);

  const toggleListen = () => {
    if (!recognition) {
      showToast('Speech Recognition is not supported on this browser. Try Chrome or Safari.', 'error');
      return;
    }

    if (isListening) {
      recognition.stop();
      setIsListening(false);
    } else {
      setTranscript('');
      setResponse(null);
      recognition.start();
      setIsListening(true);
    }
  };

  const handleAskVoiceQuestion = async () => {
    if (!transcript.trim()) {
      showToast('Please speak your question first.', 'error');
      return;
    }

    setLoading(true);
    try {
      const res = await aiService.solveQuestion({
        question: transcript,
        subject: 'General',
        difficulty: 'Medium',
      });

      setResponse(res);
      speakAnswer(res.explanation.finalAnswer + '. ' + res.explanation.explanation);
    } catch (err: any) {
      showToast(err.message || 'Could not process voice question.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const speakAnswer = (text: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.95;
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);
      setIsSpeaking(true);
      window.speechSynthesis.speak(utterance);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex items-center gap-3 border-b border-slate-800 pb-4">
        <button
          onClick={() => onNavigate('dashboard')}
          className="p-2 rounded-xl bg-slate-900 text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-white flex items-center gap-2">
            <Mic className="w-6 h-6 text-amber-400" /> Interactive Voice Tutor
          </h1>
          <p className="text-xs text-slate-400">Speak your question aloud in English and receive spoken audio solutions.</p>
        </div>
      </div>

      {/* Voice Recording Card */}
      <div className="p-8 rounded-3xl bg-slate-900 border border-slate-800 text-center space-y-6 shadow-xl">
        <div className="relative inline-block">
          <button
            onClick={toggleListen}
            className={`w-28 h-28 rounded-full flex items-center justify-center transition-all ${
              isListening
                ? 'bg-rose-600 text-white shadow-2xl shadow-rose-950 animate-pulse scale-110'
                : 'bg-amber-500 text-slate-950 hover:scale-105 shadow-xl shadow-amber-950'
            }`}
          >
            {isListening ? <MicOff className="w-12 h-12" /> : <Mic className="w-12 h-12" />}
          </button>
          {isListening && (
            <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-rose-500 text-white font-bold text-[10px] uppercase tracking-wider animate-bounce">
              Listening...
            </span>
          )}
        </div>

        <p className="text-xs text-slate-400 max-w-sm mx-auto">
          {isListening
            ? 'Speak clearly into your microphone now...'
            : 'Tap the microphone icon to begin speaking your question.'}
        </p>

        {/* Live Transcript Box */}
        <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 text-left min-h-[100px] flex flex-col justify-between">
          <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400">Spoken Transcript</span>
          <p className="text-sm font-medium text-white my-2">
            {transcript || <span className="text-slate-600 italic">"Your spoken words will appear here..."</span>}
          </p>
          {transcript && (
            <div className="flex justify-end pt-2">
              <button
                onClick={handleAskVoiceQuestion}
                disabled={loading}
                className="px-5 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-500 rounded-xl shadow-md flex items-center gap-1.5"
              >
                {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                <span>Ask AI Voice Tutor</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Spoken Response Box */}
      {response && (
        <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4 shadow-xl animate-in fade-in">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <span className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
              <Bot className="w-4 h-4" /> AI Voice Explanation
            </span>
            <button
              onClick={() => speakAnswer(response.explanation.finalAnswer + '. ' + response.explanation.explanation)}
              className="p-2 rounded-xl bg-slate-950 border border-slate-800 text-amber-400 hover:bg-slate-800"
            >
              {isSpeaking ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            </button>
          </div>

          <div className="p-4 rounded-2xl bg-emerald-950/40 border border-emerald-800/80">
            <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 block mb-1">Final Answer</span>
            <p className="text-base font-extrabold text-white">{response.explanation.finalAnswer}</p>
          </div>

          <p className="text-xs text-slate-300 leading-relaxed">{response.explanation.explanation}</p>
        </div>
      )}
    </div>
  );
};

import React, { useState } from 'react';
import { Camera, Upload, ArrowLeft, RefreshCw, CheckCircle2, Bot, Sparkles } from 'lucide-react';
import { aiService } from '../../services/aiService';

interface QuestionScannerViewProps {
  onNavigate: (view: string, state?: any) => void;
  showToast: (msg: string, type?: 'success' | 'error' | 'info') => void;
}

export const QuestionScannerView: React.FC<QuestionScannerViewProps> = ({ onNavigate, showToast }) => {
  const [imageBase64, setImageBase64] = useState<string | null>(null);
  const [extractedText, setExtractedText] = useState<string>('');
  const [detectedSubject, setDetectedSubject] = useState<string>('Mathematics');
  const [loading, setLoading] = useState(false);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result as string;
        setImageBase64(base64);
        processOCR(base64);
      };
      reader.readAsDataURL(file);
    }
  };

  const processOCR = async (base64: string) => {
    setLoading(true);
    setExtractedText('');

    try {
      const data = await aiService.scanImageQuestion(base64);
      setExtractedText(data.questionText || '');
      if (data.detectedSubject) {
        setDetectedSubject(data.detectedSubject);
      }
      showToast('Text extracted from image! Please confirm accuracy.', 'success');
    } catch (err: any) {
      console.error('OCR Error:', err);
      showToast('Could not extract text. You can still type your question manually.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleProceedToSolve = () => {
    if (!extractedText.trim() && !imageBase64) {
      showToast('Please upload an image or confirm question text first.', 'error');
      return;
    }

    onNavigate('tutor', {
      initialQuestionItem: {
        id: 'ocr-' + Date.now(),
        questionText: extractedText,
        subject: detectedSubject,
        topic: 'General',
        difficulty: 'Medium',
        response: { asking: '', importantInfo: [], stepByStep: [], finalAnswer: '', explanation: '', examTip: '', commonMistake: '' },
        createdAt: new Date().toISOString(),
      },
    });
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
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
            <Camera className="w-6 h-6 text-blue-400" /> Question Scanner (Vision AI)
          </h1>
          <p className="text-xs text-slate-400">Scan past paper or textbook questions using your smartphone camera or gallery photo.</p>
        </div>
      </div>

      {/* Main Upload / Scanner Box */}
      <div className="p-8 rounded-3xl bg-slate-900 border border-slate-800 text-center space-y-6 shadow-xl">
        {!imageBase64 ? (
          <label className="border-2 border-dashed border-slate-700 hover:border-emerald-500 rounded-3xl p-10 flex flex-col items-center justify-center cursor-pointer transition-colors group">
            <div className="w-16 h-16 rounded-2xl bg-slate-800 text-emerald-400 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Upload className="w-8 h-8" />
            </div>
            <h3 className="text-base font-bold text-white mb-1">Upload Photo or Scan Question</h3>
            <p className="text-xs text-slate-400 max-w-sm mb-4">
              Take a clear picture of printed text or legibly handwritten math/science questions.
            </p>
            <span className="px-4 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-500 rounded-xl shadow-md">
              Choose Image File
            </span>
            <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
          </label>
        ) : (
          <div className="space-y-6">
            <div className="max-w-md mx-auto relative rounded-2xl overflow-hidden border border-slate-700 shadow-md">
              <img src={imageBase64} alt="Scanned Question" className="w-full max-h-64 object-contain bg-slate-950" />
              <button
                onClick={() => {
                  setImageBase64(null);
                  setExtractedText('');
                }}
                className="absolute top-2 right-2 px-3 py-1 rounded-lg bg-slate-900/90 text-xs font-bold text-rose-400 border border-slate-700"
              >
                Change Photo
              </button>
            </div>

            {loading ? (
              <div className="flex flex-col items-center gap-2 py-6 text-emerald-400 font-semibold text-xs">
                <RefreshCw className="w-6 h-6 animate-spin" />
                <span>Extracting question text using Vision AI...</span>
              </div>
            ) : (
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 text-left space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4" /> Detected Question Text
                  </span>
                  <span className="text-[10px] text-slate-400">Edit below if needed</span>
                </div>

                <textarea
                  rows={4}
                  value={extractedText}
                  onChange={(e) => setExtractedText(e.target.value)}
                  placeholder="Extracted question text will appear here..."
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl p-3 text-xs text-white leading-relaxed focus:outline-none focus:border-emerald-500"
                />

                <div className="flex items-center justify-between pt-2">
                  <span className="text-xs text-slate-400">Detected Subject: <strong className="text-emerald-400">{detectedSubject}</strong></span>
                  <button
                    onClick={handleProceedToSolve}
                    className="px-6 py-2.5 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-500 rounded-xl shadow-md flex items-center gap-2"
                  >
                    <Bot className="w-4 h-4" />
                    <span>Solve Question</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

import React, { useState, useRef, useEffect } from 'react';
import { X, Send, Bot, User, Volume2, Mic, MicOff } from 'lucide-react';
import type { FeasibilityReport, FinancialRoadmap, Language } from '../types';
import { askBusinessCoach } from '../services/aiAdvisorService';
import { useTranslation } from '../utils/i18n';

interface AICoachDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  report?: FeasibilityReport;
  financials?: FinancialRoadmap;
  currentLanguage: Language;
}

interface ChatMessage {
  id: string;
  sender: 'user' | 'bot';
  text: string;
  timestamp: string;
}

export const AICoachDrawer: React.FC<AICoachDrawerProps> = ({
  isOpen,
  onClose,
  report,
  financials,
  currentLanguage
}) => {
  const t = useTranslation(currentLanguage);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'msg_welcome',
      sender: 'bot',
      text: currentLanguage === 'hi'
        ? `नमस्ते! मैं आपका **ग्राम उद्योग AI साथी** हूँ। आपके प्रस्तावित व्यवसाय, 10% मार्जिन, 90% बैंक ऋण, FSSAI लाइसेंस या PMEGP/PMFME सरकारी सब्सिडी के बारे में कोई भी प्रश्न पूछें।`
        : `Namaste! I am your **GramUdyog AI Coach**. Ask me anything about your 10% margin, 90% scheme loan, moratorium period, FSSAI/Udyam licenses, or government subsidies!`,
      timestamp: 'Just now'
    }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  if (!isOpen) return null;

  const handleSend = async (textToSend?: string) => {
    const query = (textToSend || input).trim();
    if (!query) return;

    const userMsg: ChatMessage = {
      id: 'usr_' + Date.now(),
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    if (!textToSend) setInput('');
    setIsTyping(true);

    try {
      const responseText = await askBusinessCoach(query, report, financials, currentLanguage);
      const botMsg: ChatMessage = {
        id: 'bot_' + Date.now(),
        sender: 'bot',
        text: responseText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, botMsg]);
    } catch {
      setMessages(prev => [
        ...prev,
        {
          id: 'bot_err',
          sender: 'bot',
          text: 'Unable to connect right now. Please check your query or offline heuristics.',
          timestamp: 'Now'
        }
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  const speakText = (text: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text.replace(/[#*`_]/g, ''));
      utterance.lang = currentLanguage === 'hi' ? 'hi-IN' : 'en-IN';
      utterance.rate = 0.95;
      window.speechSynthesis.speak(utterance);
    }
  };

  const toggleSpeechRecognition = () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      alert('Speech recognition is not supported in this browser. Please use Chrome/Edge.');
      return;
    }

    // @ts-ignore
    const SpeechRec = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRec();
    recognition.lang = currentLanguage === 'hi' ? 'hi-IN' : 'en-IN';
    recognition.interimResults = false;

    if (!isListening) {
      setIsListening(true);
      recognition.start();

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInput(transcript);
        setIsListening(false);
      };

      recognition.onerror = () => {
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };
    } else {
      setIsListening(false);
      recognition.stop();
    }
  };

  const SUGGESTED_QUERIES = [
    currentLanguage === 'hi' ? 'लाइसेंस और रजिस्ट्रेशन प्रक्रिया क्या है?' : 'What licenses & registrations are needed?',
    currentLanguage === 'hi' ? 'मोहलत (Moratorium) का क्या फायदा है?' : 'How does the Moratorium benefit me?',
    currentLanguage === 'hi' ? 'सरकारी सब्सिडी (PMEGP / PMFME) कैसे मिलेगी?' : 'How to get PMEGP / PMFME subsidies?',
    currentLanguage === 'hi' ? 'मशीनरी खरीदने के टिप्स क्या हैं?' : 'How to negotiate with machinery suppliers?'
  ];

  return (
    <div className="fixed inset-y-0 right-0 z-50 w-full sm:w-96 bg-white shadow-2xl border-l border-slate-200 flex flex-col animate-in slide-in-from-right duration-200">
      
      {/* Header */}
      <div className="p-4 bg-gradient-to-r from-slate-900 to-emerald-950 text-white flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center text-white">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-sm">GramUdyog AI Coach</h3>
            <p className="text-[11px] text-emerald-300">Rural Business & Credit Specialist</p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Messages Feed */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3.5 bg-slate-50">
        {messages.map(msg => (
          <div
            key={msg.id}
            className={`flex items-start gap-2 ${msg.sender === 'user' ? 'flex-row-reverse' : ''}`}
          >
            <div className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 text-xs ${
              msg.sender === 'user' ? 'bg-emerald-600 text-white' : 'bg-slate-900 text-white'
            }`}>
              {msg.sender === 'user' ? <User className="w-3.5 h-3.5" /> : <Bot className="w-3.5 h-3.5" />}
            </div>

            <div className={`max-w-[82%] p-3 rounded-2xl text-xs leading-relaxed ${
              msg.sender === 'user'
                ? 'bg-emerald-600 text-white rounded-tr-none'
                : 'bg-white text-slate-800 border border-slate-200 rounded-tl-none shadow-2xs'
            }`}>
              <div className="whitespace-pre-wrap">{msg.text}</div>
              <div className="flex items-center justify-between mt-1.5 pt-1 border-t border-slate-100 text-[10px] opacity-70">
                <span>{msg.timestamp}</span>
                {msg.sender === 'bot' && (
                  <button
                    onClick={() => speakText(msg.text)}
                    className="p-0.5 hover:opacity-100 transition-opacity"
                    title="Read Aloud"
                  >
                    <Volume2 className="w-3 h-3" />
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}

        {isTyping && (
          <div className="flex items-center gap-2 text-slate-400 text-xs">
            <Bot className="w-4 h-4 animate-bounce text-emerald-600" />
            <span>GramUdyog Coach is thinking...</span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Quick Prompts */}
      <div className="p-2.5 bg-white border-t border-slate-100">
        <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5 px-1">
          Quick Questions:
        </div>
        <div className="flex flex-wrap gap-1.5">
          {SUGGESTED_QUERIES.map((sq, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(sq)}
              className="text-[11px] px-2 py-1 bg-slate-100 hover:bg-emerald-50 hover:text-emerald-800 text-slate-700 rounded-lg transition-colors truncate max-w-full text-left"
            >
              {sq}
            </button>
          ))}
        </div>
      </div>

      {/* Input Form */}
      <div className="p-3 bg-white border-t border-slate-200 flex items-center gap-2">
        <button
          onClick={toggleSpeechRecognition}
          className={`p-2.5 rounded-xl transition-colors ${
            isListening ? 'bg-rose-600 text-white animate-pulse' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
          }`}
          title="Speak in Hindi/English"
        >
          {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
        </button>

        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          placeholder={t.askCoachPlaceholder}
          className="flex-1 text-xs bg-slate-50 border border-slate-300 rounded-xl p-2.5 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
        />

        <button
          onClick={() => handleSend()}
          disabled={!input.trim() || isTyping}
          className="p-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl transition-colors disabled:opacity-40 cursor-pointer shadow-xs"
        >
          <Send className="w-4 h-4" />
        </button>
      </div>

    </div>
  );
};

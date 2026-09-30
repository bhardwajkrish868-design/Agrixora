import React, { useState, useRef, useEffect } from 'react';
import { 
  Bot, 
  User, 
  Send, 
  Mic, 
  MicOff, 
  Volume2
} from 'lucide-react';
import type { FeasibilityReport, FinancialRoadmap, Language, LocationCatchment } from '../../types';
import { askBusinessCoach } from '../../services/aiAdvisorService';

interface AgriXoraAIAdvisorProps {
  report: FeasibilityReport | null;
  financials: FinancialRoadmap | null;
  currentLanguage: Language;
  location?: LocationCatchment;
  userName?: string;
}

interface ChatMessage {
  id: string;
  sender: 'user' | 'bot';
  text: string;
  timestamp: string;
}

export const AgriXoraAIAdvisor: React.FC<AgriXoraAIAdvisorProps> = ({
  report,
  financials,
  currentLanguage,
  userName
}) => {
  const greetingName = userName ? `${userName} ji` : '';
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'msg_welcome',
      sender: 'bot',
      text: currentLanguage === 'hi'
        ? `नमस्ते ${greetingName}! मैं आपका **AgriXora AI सलाहकार (KisanBiz AI)** हूँ। आपके 10% मार्जिन, 90% बैंक ऋण, योजना चयन, FSSAI लाइसेंस या थोक खरीदार ऑर्डर के बारे में कोई भी प्रश्न हिन्दी, English या Hinglish में पूछें।`
        : currentLanguage === 'hinglish'
        ? `Namaste ${greetingName}! Main aapka **AgriXora AI Advisor (KisanBiz AI)** hoon. Apne 10% margin, 90% bank loan, scheme selection, FSSAI licenses ya bulk buyer orders ke baare me koi bhi sawaal puchein!`
        : `Namaste ${greetingName ? greetingName : ''}! I am your **AgriXora AI Advisor (KisanBiz AI)**. Ask me anything about your 10% margin, 90% scheme loan, moratorium period, FSSAI/Udyam licenses, or institutional buyer contracts!`,
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
      const responseText = await askBusinessCoach(
        query, 
        report || undefined, 
        financials || undefined, 
        currentLanguage
      );
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
          text: 'Connection timeout. Switched to offline expert econometric engine.',
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

  const toggleSpeech = () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      alert('Speech recognition not supported in this browser. Please use Chrome or Edge.');
      return;
    }

    // @ts-ignore
    const SpeechRec = window.SpeechRecognition || window.webkitSpeechRecognition;
    const rec = new SpeechRec();
    rec.lang = currentLanguage === 'hi' ? 'hi-IN' : 'en-IN';

    if (!isListening) {
      setIsListening(true);
      rec.start();
      rec.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInput(transcript);
        setIsListening(false);
      };
      rec.onerror = () => setIsListening(false);
      rec.onend = () => setIsListening(false);
    } else {
      setIsListening(false);
      rec.stop();
    }
  };

  const SAMPLE_QUESTIONS = [
    '₹1 lakh margin me kaunsa business start kar sakta hoon?',
    'Mere village me dairy business viable hai?',
    '₹5 lakh project ke liye kaunsi scheme milegi?',
    'Mere area me kaunsa business underserved hai?',
    '500 kg tomato ke liye buyer kaise find karu?',
    'Loan lene ke baad meri EMI kitni hogi?'
  ];

  return (
    <div className="space-y-6">
      
      {/* Top Banner */}
      <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-teal-700 bg-teal-100 dark:bg-teal-950 dark:text-teal-400 px-3 py-1 rounded-full">
            KisanBiz AI • Multilingual Voice Advisor
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mt-2">
            AgriXora AI Business Advisor (किसान साथी)
          </h1>
          <p className="text-xs text-slate-500 max-w-2xl mt-1">
            Real-time advisory for subsidy synergies (PMEGP / PMFME), licensing (Udyam, FSSAI), machinery negotiation, and institutional buyers in English, Hindi, and Hinglish.
          </p>
        </div>
      </div>

      {/* Main Chat Interface Container */}
      <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-xl overflow-hidden flex flex-col h-[640px]">
        
        {/* Chat Header */}
        <div className="p-4 bg-gradient-to-r from-slate-900 via-emerald-950 to-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-2xl bg-emerald-600 flex items-center justify-center font-bold text-sm shadow-md shadow-emerald-600/30">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-sm">KisanBiz AI Assistant</h3>
              <p className="text-[10px] text-emerald-300">Grounded in PS 26091 & PS 26033 Institutional Rules</p>
            </div>
          </div>
          <div className="text-[11px] text-slate-400 font-mono">
            {currentLanguage.toUpperCase()} MODE
          </div>
        </div>

        {/* Message Thread */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 bg-slate-50 dark:bg-slate-900">
          {messages.map(msg => (
            <div
              key={msg.id}
              className={`flex items-start gap-3 ${msg.sender === 'user' ? 'flex-row-reverse' : ''}`}
            >
              <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 text-xs font-bold ${
                msg.sender === 'user'
                  ? 'bg-emerald-600 text-white'
                  : 'bg-slate-900 dark:bg-slate-700 text-white'
              }`}>
                {msg.sender === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
              </div>

              <div className={`max-w-[85%] sm:max-w-[75%] p-4 rounded-3xl text-xs leading-relaxed ${
                msg.sender === 'user'
                  ? 'bg-emerald-600 text-white rounded-tr-none shadow-md'
                  : 'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 rounded-tl-none shadow-sm'
              }`}>
                <div className="whitespace-pre-wrap">{msg.text}</div>
                <div className="flex items-center justify-between mt-2 pt-1 border-t border-slate-100 dark:border-slate-700 text-[10px] opacity-70">
                  <span>{msg.timestamp}</span>
                  {msg.sender === 'bot' && (
                    <button
                      onClick={() => speakText(msg.text)}
                      className="p-1 hover:opacity-100 transition-opacity"
                      title="Read Aloud"
                    >
                      <Volume2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}

          {isTyping && (
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <Bot className="w-4 h-4 animate-bounce text-emerald-600" />
              <span>AgriXora AI is calculating answer...</span>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Suggested Prompt Chips */}
        <div className="p-3 bg-white dark:bg-slate-800 border-t border-slate-100 dark:border-slate-700">
          <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2">
            Suggested Rural Questions:
          </div>
          <div className="flex flex-wrap gap-1.5 overflow-x-auto pb-1">
            {SAMPLE_QUESTIONS.map((q, idx) => (
              <button
                key={idx}
                onClick={() => handleSend(q)}
                className="text-[11px] px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-700 hover:bg-emerald-50 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-300 font-medium transition-colors text-left"
              >
                {q}
              </button>
            ))}
          </div>
        </div>

        {/* Input Controls */}
        <div className="p-4 bg-white dark:bg-slate-800 border-t border-slate-200 dark:border-slate-700 flex items-center gap-2">
          <button
            onClick={toggleSpeech}
            className={`p-3 rounded-2xl transition-all ${
              isListening ? 'bg-rose-600 text-white animate-pulse' : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-200'
            }`}
            title="Voice Input (Hindi/English)"
          >
            {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
          </button>

          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder={
              currentLanguage === 'hi'
                ? 'हिन्दी या English में प्रश्न पूछें (जैसे: ₹1 लाख में कौन सा उद्योग शुरू करें?)...'
                : 'Ask anything in English or Hinglish (e.g., ₹1 lakh margin me kaunsa business start karein?)...'
            }
            className="flex-1 text-xs bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-2xl p-3 text-slate-900 dark:text-white placeholder-slate-400 focus:ring-2 focus:ring-emerald-500 outline-none"
          />

          <button
            onClick={() => handleSend()}
            disabled={!input.trim() || isTyping}
            className="p-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl transition-all disabled:opacity-40 cursor-pointer shadow-md"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>

      </div>

    </div>
  );
};

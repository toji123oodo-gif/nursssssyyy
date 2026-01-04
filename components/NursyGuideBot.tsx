
import React, { useState, useEffect, useRef } from 'react';
import * as ReactRouterDOM from 'react-router-dom';
const { useLocation, useNavigate } = ReactRouterDOM as any;
import { 
  X, Send, Bot, Zap, Minimize2, Maximize2, Sparkles, User
} from 'lucide-react';
import { GoogleGenAI, Type, FunctionDeclaration } from "@google/genai";
import { useApp } from '../context/AppContext';

interface Message {
  role: 'user' | 'bot';
  text: string;
}

export const NursyGuideBot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const { user } = useApp();
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (messages.length === 0 && user) {
      setMessages([{ 
        role: 'bot', 
        text: `أهلاً د. ${user.name.split(' ')[0]}! أنا مساعدك الذكي، أقدر أساعدك في إيه النهاردة؟` 
      }]);
    }
  }, [user]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || isLoading) return;

    setMessages(prev => [...prev, { role: 'user', text: inputValue }]);
    setInputValue('');
    setIsLoading(true);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: inputValue,
        config: {
          systemInstruction: `أنت مساعد ذكي لمنصة تعليمية للتمريض. جاوب باختصار وبلهجة ودودة.`
        }
      });
      setMessages(prev => [...prev, { role: 'bot', text: response.text || "عفواً، لم أفهم." }]);
    } catch (err) {
      setMessages(prev => [...prev, { role: 'bot', text: "حدث خطأ في الاتصال." }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {!isOpen && (
        <button 
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 z-[100] w-14 h-14 bg-brand-blue text-white rounded-full flex items-center justify-center shadow-lg hover:bg-blue-700 transition-all"
        >
          <Bot size={24} />
        </button>
      )}

      {isOpen && (
        <div className={`fixed bottom-6 right-6 z-[100] bg-white border border-gray-200 rounded-2xl shadow-2xl flex flex-col overflow-hidden transition-all ${isMinimized ? 'w-72 h-14' : 'w-80 md:w-96 h-[500px]'}`}>
          
          <div className="p-3 bg-brand-blue text-white flex justify-between items-center shrink-0">
             <div className="flex items-center gap-2">
                <Sparkles size={16} />
                <span className="font-bold text-sm">مساعد نيرسي</span>
             </div>
             <div className="flex gap-1">
                <button onClick={() => setIsMinimized(!isMinimized)} className="p-1 hover:bg-white/10 rounded"><Minimize2 size={16}/></button>
                <button onClick={() => setIsOpen(false)} className="p-1 hover:bg-white/10 rounded"><X size={16}/></button>
             </div>
          </div>

          {!isMinimized && (
            <>
              <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
                 {messages.map((m, i) => (
                   <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-[85%] p-3 rounded-xl text-sm ${
                        m.role === 'user' 
                        ? 'bg-brand-blue text-white rounded-br-none' 
                        : 'bg-white border border-gray-200 text-gray-800 rounded-bl-none shadow-sm'
                      }`}>
                        {m.text}
                      </div>
                   </div>
                 ))}
                 {isLoading && <div className="text-xs text-gray-400 px-2">جاري الكتابة...</div>}
                 <div ref={chatEndRef} />
              </div>

              <form onSubmit={handleSendMessage} className="p-3 bg-white border-t border-gray-200 flex gap-2">
                 <input 
                   type="text" 
                   value={inputValue}
                   onChange={(e) => setInputValue(e.target.value)}
                   placeholder="اكتب سؤالك..."
                   className="flex-1 text-sm bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 outline-none focus:border-brand-blue"
                 />
                 <button type="submit" disabled={isLoading} className="p-2 bg-brand-blue text-white rounded-lg hover:bg-blue-700 disabled:opacity-50">
                    <Send size={16} />
                 </button>
              </form>
            </>
          )}
        </div>
      )}
    </>
  );
};

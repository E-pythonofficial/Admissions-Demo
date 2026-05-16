import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Send, MoreVertical, Phone, Video, Paperclip, Smile } from 'lucide-react';
import { Sender, Message } from '../types';
import { getTolaResponse } from '../services/geminiService';

export const ChatInterface: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const viewportRef = useRef<HTMLDivElement>(null);

  // Initial greeting
  useEffect(() => {
    const initialMessages: Message[] = [
      {
        id: '1',
        sender: Sender.TOLA,
        text: "Hi there! I'm Tola from the Admissions Office. 👋",
        timestamp: new Date(),
      },
      {
        id: '2',
        sender: Sender.TOLA,
        text: "How can I help you today? Looking to apply or checking for some requirements?",
        timestamp: new Date(),
      }
    ];

    const timer = setTimeout(() => {
      setMessages(initialMessages);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  // Handle mobile keyboard and scrolling
  useEffect(() => {
    const handleResize = () => {
      if (window.visualViewport) {
        // Adjust the height to match visual viewport (handling soft keyboard)
        if (viewportRef.current) {
          viewportRef.current.style.height = `${window.visualViewport.height}px`;
        }
        scrollToBottom();
      }
    };

    window.visualViewport?.addEventListener('resize', handleResize);
    window.visualViewport?.addEventListener('scroll', handleResize);
    
    return () => {
      window.visualViewport?.removeEventListener('resize', handleResize);
      window.visualViewport?.removeEventListener('scroll', handleResize);
    };
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMsg: Message = {
      id: `user-${Date.now()}-${Math.random()}`,
      sender: Sender.USER,
      text: input,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    try {
      const history = messages.map(m => ({
        role: m.sender === Sender.USER ? 'user' as const : 'model' as const,
        parts: [{ text: m.text }]
      }));

      const response = await getTolaResponse(input, history);
      
      for (const [index, text] of response.messages.entries()) {
        await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 1200));
        
        const newMsg: Message = {
          id: `tola-${Date.now()}-${index}-${Math.random()}`,
          sender: Sender.TOLA,
          text: text,
          timestamp: new Date(),
        };
        
        setMessages(prev => [...prev, newMsg]);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsTyping(false);
    }
  };

  const clearChat = () => {
    if (confirm("Clear this chat?")) {
      setMessages([]);
      setTimeout(() => {
        setMessages([{
          id: '1',
          sender: Sender.TOLA,
          text: "Chat cleared! Let's start fresh. How can I help you?",
          timestamp: new Date(),
        }]);
      }, 500);
    }
  };

  return (
    <div 
      ref={viewportRef}
      className="flex flex-col h-full w-full max-w-md mx-auto bg-[#E5DDD5] shadow-2xl relative overflow-hidden whatsapp-bg"
    >
      {/* WhatsApp-style Header */}
      <header className="bg-[#075E54] text-white p-3 py-4 flex items-center justify-between shadow-md z-10 shrink-0">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-10 h-10 bg-slate-200 rounded-full overflow-hidden border border-white/20">
              <img 
                src="https://ui-avatars.com/api/?name=Tola+Admissions&background=DCF8C6&color=075E54" 
                alt="Tola" 
                className="w-full h-full object-cover"
              />
            </div>
            <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-[#25D366] rounded-full border border-[#075E54]"></div>
          </div>
          <div>
            <h2 className="font-bold text-sm leading-tight">Tola</h2>
            <p className="text-[10px] text-white/80">online</p>
          </div>
        </div>
        <div className="flex items-center gap-4 pr-1">
          <Video size={18} className="opacity-80 active:opacity-100" />
          <Phone size={18} className="opacity-80 active:opacity-100" />
          <button onClick={clearChat}>
            <MoreVertical size={18} className="opacity-80 active:opacity-100" />
          </button>
        </div>
      </header>

      {/* Messages list with correct scroll handling */}
      <div className="flex-1 overflow-y-auto p-3 space-y-2 scrollbar-hide">
        <div className="flex justify-center my-4">
          <span className="bg-[#D1E9F6] text-[#557F95] text-[10px] sm:text-xs px-3 py-1 rounded-lg uppercase font-semibold shadow-sm">
            Tola - Admissions Support
          </span>
        </div>
        
        <AnimatePresence initial={false}>
          {messages.map((msg) => (
            <MessageBubble key={msg.id} message={msg} />
          ))}
          {isTyping && (
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0 }}
              className="flex justify-start items-start"
            >
              <div className="bg-white rounded-lg rounded-tl-none p-2 px-3 shadow-sm flex items-center gap-1">
                <div className="flex gap-1.5 items-center h-4">
                  <motion.div
                    animate={{ opacity: [0.4, 1, 0.4] }}
                    transition={{ repeat: Infinity, duration: 1 }}
                    className="w-1 h-1 bg-slate-400 rounded-full"
                  />
                  <motion.div
                    animate={{ opacity: [0.4, 1, 0.4] }}
                    transition={{ repeat: Infinity, duration: 1, delay: 0.2 }}
                    className="w-1 h-1 bg-slate-400 rounded-full"
                  />
                  <motion.div
                    animate={{ opacity: [0.4, 1, 0.4] }}
                    transition={{ repeat: Infinity, duration: 1, delay: 0.4 }}
                    className="w-1 h-1 bg-slate-400 rounded-full"
                  />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        <div ref={messagesEndRef} className="h-2" />
      </div>

      {/* WhatsApp Input Area */}
      <footer className="p-2 sm:p-3 flex items-end gap-2 bg-transparent z-10">
        <div className="flex-1 bg-white rounded-full p-2 pl-4 shadow-sm flex items-center gap-3">
          <Smile size={24} className="text-slate-400 hidden sm:block" />
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Type a message"
            className="flex-1 bg-transparent border-none outline-none text-sm sm:text-base text-slate-800 py-1"
          />
          <Paperclip size={24} className="text-slate-400 rotate-45" />
        </div>
        <button
          onClick={handleSend}
          disabled={!input.trim() || isTyping}
          className={`w-12 h-12 rounded-full flex items-center justify-center transition-all shadow-md shrink-0 ${
            !input.trim() || isTyping 
              ? 'bg-slate-400 text-white' 
              : 'bg-[#075E54] text-white active:scale-90'
          }`}
        >
          <Send size={20} className={!input.trim() ? "translate-x-0" : "translate-x-0.5"} />
        </button>
      </footer>
    </div>
  );
};

const MessageBubble: React.FC<{ message: Message }> = ({ message }) => {
  const isTola = message.sender === Sender.TOLA;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className={`flex items-start ${isTola ? 'justify-start' : 'justify-end'}`}
    >
      <div
        className={`max-w-[75%] sm:max-w-[85%] px-3 py-1.5 rounded-lg shadow-sm relative ${
          isTola
            ? 'bg-white text-slate-800 rounded-tl-none'
            : 'bg-[#DCF8C6] text-slate-800 rounded-tr-none'
        }`}
      >
        {/* Tail decoration for chat bubbles */}
        <div 
          className={`absolute top-0 w-2 h-2 ${
            isTola 
              ? '-left-1 bg-white triangle-left' 
              : '-right-1 bg-[#DCF8C6] triangle-right'
          }`}
          style={{ clipPath: isTola ? 'polygon(100% 0, 0 0, 100% 100%)' : 'polygon(0 0, 0 100%, 100% 0)' }}
        />
        
        <p className="text-[13px] sm:text-[15px] leading-tight pr-10">{message.text}</p>
        <div className="absolute bottom-1 right-2 flex items-center gap-1">
          <span className="text-[9px] text-slate-400 select-none">
            {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </span>
          {!isTola && (
            <div className="flex -space-x-1">
               <span className="text-[10px] text-blue-500 font-bold">✓✓</span>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

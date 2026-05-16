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
  const containerRef = useRef<HTMLDivElement>(null);

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
    const timer = setTimeout(() => setMessages(initialMessages), 500);
    return () => clearTimeout(timer);
  }, []);

  // Fix mobile keyboard: track visualViewport so the footer never hides behind the keyboard
  useEffect(() => {
    const viewport = window.visualViewport;
    if (!viewport) return;

    const handleViewportChange = () => {
      if (containerRef.current) {
        containerRef.current.style.height = `${viewport.height}px`;
        containerRef.current.style.top = `${viewport.offsetTop}px`;
      }
      setTimeout(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    };

    viewport.addEventListener('resize', handleViewportChange);
    viewport.addEventListener('scroll', handleViewportChange);
    handleViewportChange(); // set on mount

    return () => {
      viewport.removeEventListener('resize', handleViewportChange);
      viewport.removeEventListener('scroll', handleViewportChange);
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
          text,
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
    if (confirm('Clear this chat?')) {
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
      ref={containerRef}
      style={{
        display: 'flex',
        flexDirection: 'column',
        position: 'fixed',        /* Tracks visual viewport on mobile */
        top: 0,
        left: 0,
        right: 0,
        width: '100%',
        height: '100%',           /* Updated by visualViewport listener */
        overflow: 'hidden',
        backgroundColor: '#efeae2',
        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100'%3E%3Cdefs%3E%3Cstyle%3E.a%7Bfill:none;stroke:%23c8bdb3;stroke-width:0.4;opacity:0.5%7D%3C/style%3E%3C/defs%3E%3Ccircle class='a' cx='20' cy='20' r='6'/%3E%3Ccircle class='a' cx='80' cy='20' r='6'/%3E%3Ccircle class='a' cx='50' cy='50' r='6'/%3E%3Ccircle class='a' cx='20' cy='80' r='6'/%3E%3Ccircle class='a' cx='80' cy='80' r='6'/%3E%3Cpath class='a' d='M20 20 Q50 10 80 20'/%3E%3Cpath class='a' d='M20 80 Q50 90 80 80'/%3E%3Cpath class='a' d='M20 20 Q10 50 20 80'/%3E%3Cpath class='a' d='M80 20 Q90 50 80 80'/%3E%3Cpath class='a' d='M20 50 Q50 40 80 50'/%3E%3C/svg%3E")`,
        backgroundRepeat: 'repeat',
        backgroundSize: '100px 100px',
      }}
    >
      {/* Header */}
      <header style={{
        backgroundColor: '#202c33',
        color: 'white',
        padding: '10px 16px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        boxShadow: '0 1px 3px rgba(0,0,0,0.3)',
        zIndex: 10,
        flexShrink: 0,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ position: 'relative' }}>
            <div style={{
              width: 40, height: 40,
              borderRadius: '50%',
              overflow: 'hidden',
              border: '1px solid rgba(255,255,255,0.2)',
            }}>
              <img
                src="https://ui-avatars.com/api/?name=Tola+Admissions&background=DCF8C6&color=075E54"
                alt="Tola"
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            </div>
            <div style={{
              position: 'absolute', bottom: 0, right: 0,
              width: 10, height: 10,
              backgroundColor: '#25D366',
              borderRadius: '50%',
              border: '2px solid #202c33',
            }} />
          </div>
          <div>
            <p style={{ fontWeight: 600, fontSize: 15, lineHeight: 1.2 }}>Tola</p>
            <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.7)' }}>online</p>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
          <Video size={20} style={{ opacity: 0.8, cursor: 'pointer' }} />
          <Phone size={20} style={{ opacity: 0.8, cursor: 'pointer' }} />
          <button onClick={clearChat} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'white' }}>
            <MoreVertical size={20} style={{ opacity: 0.8 }} />
          </button>
        </div>
      </header>

      {/* Messages */}
      <div style={{
        flex: 1,
        overflowY: 'auto',
        padding: '12px',
        display: 'flex',
        flexDirection: 'column',
        gap: 4,
        scrollbarWidth: 'none',
        msOverflowStyle: 'none',
        WebkitOverflowScrolling: 'touch',
      }}>
        <div style={{ display: 'flex', justifyContent: 'center', margin: '12px 0' }}>
          <span style={{
            backgroundColor: '#d1e9f6',
            color: '#557f95',
            fontSize: 11,
            padding: '4px 12px',
            borderRadius: 8,
            fontWeight: 600,
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
          }}>
            Tola — Admissions Support
          </span>
        </div>

        <AnimatePresence initial={false}>
          {messages.map((msg) => (
            <MessageBubble key={msg.id} message={msg} />
          ))}

          {isTyping && (
            <motion.div
              key="typing"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0 }}
              style={{ display: 'flex', justifyContent: 'flex-start', marginTop: 4 }}
            >
              <div style={{
                backgroundColor: 'white',
                borderRadius: '8px 8px 8px 0',
                padding: '10px 14px',
                boxShadow: '0 1px 2px rgba(0,0,0,0.15)',
                display: 'flex',
                gap: 5,
                alignItems: 'center',
              }}>
                {[0, 0.15, 0.3].map((delay, i) => (
                  <motion.div
                    key={i}
                    animate={{ y: [0, -5, 0] }}
                    transition={{ repeat: Infinity, duration: 0.6, delay }}
                    style={{ width: 7, height: 7, backgroundColor: '#8696a0', borderRadius: '50%' }}
                  />
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        <div ref={messagesEndRef} style={{ height: 8 }} />
      </div>

      {/* Input area - bg matches chat so no dark bleed behind keyboard */}
      <footer style={{
        padding: '8px 12px',
        paddingBottom: 'max(8px, env(safe-area-inset-bottom))',
        display: 'flex',
        alignItems: 'flex-end',
        gap: 8,
        backgroundColor: '#efeae2',   /* Same as chat bg — no dark gap */
        zIndex: 10,
        flexShrink: 0,
      }}>
        <div style={{
          flex: 1,
          backgroundColor: 'white',
          borderRadius: 24,
          padding: '8px 16px',
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          boxShadow: '0 1px 2px rgba(0,0,0,0.1)',
        }}>
          <Smile size={22} style={{ color: '#8696a0', flexShrink: 0 }} />
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Type a message"
            style={{
              flex: 1,
              border: 'none',
              outline: 'none',
              fontSize: 16,        /* 16px stops iOS from auto-zooming on focus */
              color: '#111b21',
              backgroundColor: 'transparent',
              fontFamily: 'inherit',
            }}
          />
          <Paperclip size={22} style={{ color: '#8696a0', transform: 'rotate(45deg)', flexShrink: 0 }} />
        </div>
        <button
          onClick={handleSend}
          disabled={!input.trim() || isTyping}
          style={{
            width: 48, height: 48,
            borderRadius: '50%',
            backgroundColor: input.trim() && !isTyping ? '#00a884' : '#8696a0',
            color: 'white',
            border: 'none',
            cursor: input.trim() && !isTyping ? 'pointer' : 'not-allowed',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
            transition: 'background-color 0.2s, transform 0.1s',
            boxShadow: '0 2px 6px rgba(0,0,0,0.25)',
          }}
        >
          <Send size={20} />
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
      style={{
        display: 'flex',
        justifyContent: isTola ? 'flex-start' : 'flex-end',
        marginBottom: 2,
      }}
    >
      <div style={{
        maxWidth: '75%',
        padding: '7px 12px 22px',
        borderRadius: isTola ? '8px 8px 8px 0' : '8px 8px 0 8px',
        backgroundColor: isTola ? '#ffffff' : '#d9fdd3',
        color: '#111b21',
        boxShadow: '0 1px 2px rgba(0,0,0,0.15)',
        position: 'relative',
      }}>
        <p style={{ fontSize: 14.5, lineHeight: 1.45, margin: 0 }}>{message.text}</p>
        <div style={{
          position: 'absolute',
          bottom: 5,
          right: 10,
          display: 'flex',
          alignItems: 'center',
          gap: 3,
        }}>
          <span style={{ fontSize: 10, color: '#8696a0' }}>
            {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </span>
          {!isTola && (
            <span style={{ fontSize: 12, color: '#53bdeb', fontWeight: 700 }}>✓✓</span>
          )}
        </div>
      </div>
    </motion.div>
  );
};
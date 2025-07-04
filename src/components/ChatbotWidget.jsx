import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import ChatbotImage from '@/assets/chatbot-icon.png';
import { motion, AnimatePresence } from 'framer-motion';

const ChatbotWidget = () => {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [typing, setTyping] = useState(false);
  const wrapperRef = useRef(null);
  const messagesEndRef = useRef(null);

  // Close chatbot on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (open && wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [open]);

  // Scroll to bottom when messages/typing changes
  useEffect(() => {
    scrollToBottom();
  }, [messages, typing, open]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSend = async () => {
    if (!input.trim()) return;
    const userMessage = { type: 'user', text: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setTyping(true);

    try {
      const res = await axios.post('https://user-service-oyy1.onrender.com/api/chat', { message: input });
      const botReply = { type: 'bot', text: res.data?.reply || res.data || '🤖 No response' };
      setTimeout(() => {
        setMessages(prev => [...prev, botReply]);
        setTyping(false);
      }, 800);
    } catch {
      setMessages(prev => [...prev, { type: 'bot', text: '⚠️ Sorry, something went wrong.' }]);
      setTyping(false);
    }
  };

  return (
    <div ref={wrapperRef} className="fixed bottom-5 right-5 z-50">
      <AnimatePresence>
        {!open ? (
          <motion.button
            onClick={() => setOpen(true)}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.3 }}
            className="rounded-full hover:scale-105 transition"
            title="Chatbot"
          >
            <img src={ChatbotImage} alt="Chatbot" className="w-16 h-16 object-cover" />
          </motion.button>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            transition={{ duration: 0.3 }}
            className="bg-white dark:bg-gray-900 w-80 h-96 rounded-2xl shadow-2xl flex flex-col"
          >
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-3 rounded-t-2xl flex justify-between items-center">
              <span className="font-semibold">AI Chatbot</span>
              <button onClick={() => setOpen(false)} className="text-white text-lg font-bold hover:scale-110 transition">✕</button>
            </div>

            <div className="flex-1 overflow-y-auto p-3 flex flex-col gap-2">
              {messages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`p-2 rounded-lg max-w-xs ${
                    msg.type === 'user'
                      ? 'bg-blue-100 dark:bg-blue-700 text-gray-900 dark:text-white self-end'
                      : 'bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white self-start'
                  }`}
                >
                  {msg.text}
                </div>
              ))}
              {typing && <div className="text-gray-500 text-sm italic self-start">Bot is typing...</div>}
              <div ref={messagesEndRef} />
            </div>

            <div className="p-2 flex gap-2 border-t dark:border-gray-700">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                className="flex-1 p-2 rounded-lg border dark:border-gray-600 dark:bg-gray-800 dark:text-white"
                placeholder="Type a message..."
              />
              <button
                onClick={handleSend}
                className="bg-gradient-to-r from-blue-500 to-purple-500 text-white p-2 rounded-lg hover:scale-105 transition"
              >
                Send
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ChatbotWidget;

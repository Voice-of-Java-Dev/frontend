import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { Send, MessageSquare } from 'lucide-react';

const ChatbotWidget = () => {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [typing, setTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, typing]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = { type: 'user', text: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setTyping(true);

    try {
      const res = await axios.post('https://user-service-oyy1.onrender.com/api/chat', {
        message: input,
      });

      const botReply = { type: 'bot', text: res.data };
      setTimeout(() => {
        setMessages((prev) => [...prev, botReply]);
        setTyping(false);
      }, 800); // artificial delay for better UX
    } catch (err) {
      setMessages((prev) => [...prev, { type: 'bot', text: 'Error getting response.' }]);
      setTyping(false);
    }
  };

  return (
    <div className="fixed bottom-5 right-5 z-50">
      {/* Floating Button */}
      {!open && (
        <button
          onClick={() => setOpen(true)}
          className="bg-gradient-to-r from-blue-500 to-purple-500 text-white p-3 rounded-full shadow-xl hover:scale-105 transition"
        >
          <MessageSquare size={24} />
        </button>
      )}

      {/* Chat Window */}
      {open && (
        <div className="bg-white dark:bg-gray-900 w-80 h-96 rounded-2xl shadow-2xl flex flex-col transition">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-3 rounded-t-2xl flex justify-between items-center">
            <span className="font-semibold">AI Chatbot</span>
            <button onClick={() => setOpen(false)} className="text-white text-lg font-bold hover:scale-110 transition">
              ✕
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-3 space-y-2">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`p-2 rounded-lg max-w-xs ${
                  msg.type === 'user'
                    ? 'bg-blue-100 dark:bg-blue-700 text-gray-900 dark:text-white self-end ml-auto'
                    : 'bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white self-start mr-auto'
                }`}
              >
                {msg.text}
              </div>
            ))}
            {typing && (
              <div className="text-gray-500 text-sm italic">Bot is typing...</div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
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
              <Send size={18} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatbotWidget;

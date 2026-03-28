import React, { useState, useRef, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useSendChatMessageMutation } from '../../services/api';
import { FaRobot, FaTimes, FaPaperPlane } from 'react-icons/fa';
import { HiSparkles } from 'react-icons/hi2';
import { IoSparkles } from 'react-icons/io5';
import { motion, AnimatePresence } from 'framer-motion';

const WELCOME_MESSAGE = {
  role: 'assistant',
  content: "Hello! 👋 I'm Vayka AI, your personal hotel booking assistant. I can help you with:\n• Searching for hotels in any city\n• Answering questions about our platform\n• Viewing your reservations (if you're logged in)\n\nHow can I assist you today?",
};

const ChatWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [messages, setMessages] = useState([WELCOME_MESSAGE]);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const [sendChatMessage, { isLoading }] = useSendChatMessageMutation();

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  const handleSend = async () => {
    const text = inputValue.trim();
    if (!text || isLoading) return;

    const userMessage = { role: 'user', content: text };
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setInputValue('');

    // FIX: Send only the last 6 user/assistant messages to avoid token limit
    const apiMessages = updatedMessages
      .filter((m) => m.role === 'user' || m.role === 'assistant')
      .slice(-6)
      .map((m) => ({ role: m.role, content: m.content }));

    try {
      const result = await sendChatMessage(apiMessages).unwrap();
      setMessages((prev) => [...prev, { role: 'assistant', content: result.message }]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: '⚠️ Sorry, a connection error occurred. Please try again.',
        },
      ]);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const formatMessage = (content) => {
    return content.split('\n').map((line, i) => (
      <span key={i}>
        {line}
        {i < content.split('\n').length - 1 && <br />}
      </span>
    ));
  };

  const toggleChat = () => {
    setIsOpen(!isOpen);
    setIsMenuOpen(false);
  };

  const openSmartSearch = () => {
    window.dispatchEvent(new CustomEvent('open-smart-search'));
    setIsMenuOpen(false);
  };

  return (
    <>
      {/* Floating Buttons */}
      <div className="fixed bottom-6 right-6 z-[101] flex flex-col items-center gap-3">
        <AnimatePresence>
          {isMenuOpen && (
            <>
              <motion.div
                initial={{ opacity: 0, y: 15, scale: 0.8 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 15, scale: 0.8 }}
                className="relative flex items-center group"
              >
                <div className="absolute right-full mr-3 px-2.5 py-1.5 rounded-lg bg-gray-900/90 backdrop-blur-sm text-white text-[10px] font-bold uppercase tracking-wider opacity-0 group-hover:opacity-100 transition-all duration-200 pointer-events-none whitespace-nowrap translate-x-2 group-hover:translate-x-0">
                  Smart Search
                </div>
                <button
                  onClick={openSmartSearch}
                  className="w-11 h-11 rounded-full flex items-center justify-center bg-indigo-600 text-white shadow-lg hover:bg-indigo-700 transition-all hover:scale-110 active:scale-95 cursor-pointer"
                >
                  <IoSparkles size={18} />
                </button>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 15, scale: 0.8 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 15, scale: 0.8 }}
                transition={{ delay: 0.05 }}
                className="relative flex items-center group"
              >
                <div className="absolute right-full mr-3 px-2.5 py-1.5 rounded-lg bg-gray-900/90 backdrop-blur-sm text-white text-[10px] font-bold uppercase tracking-wider opacity-0 group-hover:opacity-100 transition-all duration-200 pointer-events-none whitespace-nowrap translate-x-2 group-hover:translate-x-0">
                  AI Assistant
                </div>
                <button
                  onClick={toggleChat}
                  className="w-11 h-11 rounded-full flex items-center justify-center bg-blue-600 text-white shadow-lg hover:bg-blue-700 transition-all hover:scale-110 active:scale-95 cursor-pointer"
                >
                  <FaRobot size={18} />
                </button>
              </motion.div>
            </>
          )}
        </AnimatePresence>

        {/* Main Button */}
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className={`relative z-10 flex items-center justify-center w-13 h-13 rounded-full shadow-2xl transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer ${
            isMenuOpen ? 'bg-gray-800' : 'bg-gradient-to-tr from-blue-600 via-indigo-600 to-purple-600'
          } text-white`}
        >
          {isMenuOpen ? (
            <FaTimes size={20} />
          ) : (
            <HiSparkles size={24} className="animate-pulse" />
          )}
          {!isMenuOpen && (
            <span className="absolute top-0 right-0 w-3 h-3 bg-emerald-400 rounded-full border-2 border-white animate-pulse" />
          )}
        </button>
      </div>

      {/* Chat Window */}
      {isOpen && (
        <div
          className="fixed bottom-24 right-6 z-[101] w-[360px] max-w-[calc(100vw-24px)] flex flex-col bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden animate-in slide-in-from-bottom-4 duration-300"
          style={{ height: '500px' }}
        >
          {/* Header */}
          <div className="flex items-center gap-3 px-4 py-3 bg-blue-600 text-white flex-shrink-0">
            <div className="flex items-center justify-center w-9 h-9 rounded-full bg-blue-500">
              <HiSparkles size={18} />
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-semibold text-sm">Vayka AI</div>
              <div className="text-xs text-blue-200 flex items-center gap-1">
                <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full inline-block animate-pulse" />
                {isAuthenticated
                  ? `Welcome, ${user?.name?.split(' ')[0]}`
                  : 'Online • Ready to help'}
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1.5 rounded-full hover:bg-blue-500 transition-colors cursor-pointer"
            >
              <FaTimes size={14} />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3 bg-gray-50 dark:bg-gray-900">
            {messages.map((msg, idx) => (
              <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                {msg.role === 'assistant' && (
                  <div className="flex-shrink-0 w-7 h-7 rounded-full bg-blue-600 flex items-center justify-center mr-2 mt-0.5">
                    <FaRobot size={12} className="text-white" />
                  </div>
                )}
                <div
                  className={`max-w-[80%] px-3 py-2 rounded-2xl text-sm leading-relaxed ${
                    msg.role === 'user'
                      ? 'bg-blue-600 text-white rounded-tr-sm'
                      : 'bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 border border-gray-200 dark:border-gray-700 rounded-tl-sm shadow-sm'
                  }`}
                >
                  {formatMessage(msg.content)}
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="flex justify-start">
                <div className="flex-shrink-0 w-7 h-7 rounded-full bg-blue-600 flex items-center justify-center mr-2">
                  <FaRobot size={12} className="text-white" />
                </div>
                <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 px-4 py-3 rounded-2xl rounded-tl-sm shadow-sm">
                  <div className="flex items-center gap-1">
                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Actions */}
          {messages.length <= 1 && (
            <div className="px-4 py-2 flex flex-wrap gap-2 bg-gray-50 dark:bg-gray-900 border-t border-gray-100 dark:border-gray-800 flex-shrink-0">
              {['🏨 Hotels in Spain', '📋 My Bookings', '💡 How to book?'].map((q) => (
                <button
                  key={q}
                  onClick={() => { setInputValue(q.slice(2).trim()); inputRef.current?.focus(); }}
                  className="text-xs px-3 py-1.5 rounded-full bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800 hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-colors cursor-pointer"
                >
                  {q}
                </button>
              ))}
            </div>
          )}

          {/* Input */}
          <div className="px-3 py-3 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 flex-shrink-0">
            <div className="flex items-center gap-2 bg-gray-100 dark:bg-gray-700 rounded-xl px-3 py-2">
              <textarea
                ref={inputRef}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Type your question here..."
                rows={1}
                className="flex-1 bg-transparent text-sm text-gray-800 dark:text-gray-100 placeholder-gray-400 outline-none resize-none max-h-20 leading-relaxed"
              />
              <button
                onClick={handleSend}
                disabled={!inputValue.trim() || isLoading}
                className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-all cursor-pointer ${
                  inputValue.trim() && !isLoading
                    ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-md'
                    : 'bg-gray-300 dark:bg-gray-600 text-gray-400 cursor-not-allowed'
                }`}
              >
                <FaPaperPlane size={13} />
              </button>
            </div>
            <p className="text-center text-[10px] text-gray-400 mt-1.5">
              Powered by Groq • Llama 3.3
            </p>
          </div>
        </div>
      )}
    </>
  );
};

export default ChatWidget;
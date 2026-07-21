'use client';

import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, Sparkles, Bot, User } from 'lucide-react';
import styles from './AIChatWidget.module.css';

const QUICK_QUESTIONS = [
  'How do I submit artwork?',
  'How do I create an account?',
  'How do reviews work?',
  'Who are featured artists?',
];

export default function AIChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: 'Welcome to ArtBox! I am your AI Concierge. How can I help you navigate or submit art today?',
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  const handleSend = async (customText) => {
    const textToSend = customText || input;
    if (!textToSend.trim() || isLoading) return;

    const userMessage = { role: 'user', content: textToSend };
    const updatedMessages = [...messages, userMessage];

    setMessages(updatedMessages);
    if (!customText) setInput('');
    setIsLoading(true);

    try {
      // Send conversation history to API route
      const apiMessages = updatedMessages.map((m) => ({
        role: m.role,
        content: m.content,
      }));

      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: apiMessages }),
      });

      const data = await res.json();

      if (data.reply) {
        setMessages((prev) => [
          ...prev,
          { role: 'assistant', content: data.reply },
        ]);
      } else {
        setMessages((prev) => [
          ...prev,
          {
            role: 'assistant',
            content: 'I am experiencing a temporary connection issue. Please try again shortly.',
          },
        ]);
      }
    } catch (err) {
      console.error('Chat Widget error:', err);
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: 'Unable to reach assistant. Please check your connection.',
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className={styles.widgetWrapper}>
      {/* Floating Toggle Button */}
      {!isOpen && (
        <button
          className={styles.floatingTrigger}
          onClick={() => setIsOpen(true)}
          aria-label="Open Customer Service AI Chat"
        >
          <Sparkles className={styles.sparkleIcon} size={18} />
          <span className={styles.triggerText}>AI Support</span>
        </button>
      )}

      {/* Floating Chat Drawer */}
      {isOpen && (
        <div className={styles.chatDrawer}>
          {/* Header */}
          <div className={styles.chatHeader}>
            <div className={styles.headerTitleGroup}>
              <div className={styles.botBadge}>
                <Bot size={18} />
              </div>
              <div>
                <h3 className={styles.headerTitle}>ArtBox Assistant</h3>
                <span className={styles.headerSubtitle}>Concierge Support</span>
              </div>
            </div>
            <button
              className={styles.closeBtn}
              onClick={() => setIsOpen(false)}
              aria-label="Close Chat"
            >
              <X size={18} />
            </button>
          </div>

          {/* Messages Area */}
          <div className={styles.messageList}>
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`${styles.messageRow} ${
                  msg.role === 'user' ? styles.userRow : styles.assistantRow
                }`}
              >
                <div className={styles.avatarBubble}>
                  {msg.role === 'user' ? <User size={14} /> : <Bot size={14} />}
                </div>
                <div className={styles.messageBubble}>{msg.content}</div>
              </div>
            ))}

            {isLoading && (
              <div className={`${styles.messageRow} ${styles.assistantRow}`}>
                <div className={styles.avatarBubble}>
                  <Bot size={14} />
                </div>
                <div className={`${styles.messageBubble} ${styles.loadingBubble}`}>
                  <span className={styles.dot} />
                  <span className={styles.dot} />
                  <span className={styles.dot} />
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Suggestion Chips */}
          <div className={styles.quickChips}>
            {QUICK_QUESTIONS.map((q) => (
              <button
                key={q}
                className={styles.chipBtn}
                onClick={() => handleSend(q)}
                disabled={isLoading}
              >
                {q}
              </button>
            ))}
          </div>

          {/* Input Form */}
          <div className={styles.inputArea}>
            <input
              type="text"
              className={styles.inputField}
              placeholder="Ask about submitting art, reviews, or accounts..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={isLoading}
            />
            <button
              className={styles.sendBtn}
              onClick={() => handleSend()}
              disabled={!input.trim() || isLoading}
              aria-label="Send message"
            >
              <Send size={16} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

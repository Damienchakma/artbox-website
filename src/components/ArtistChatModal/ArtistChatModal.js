'use client';

import React, { useState, useRef, useEffect } from 'react';
import { X, Send, Sparkles, CheckCircle2, User, Palette, MapPin } from 'lucide-react';
import styles from './ArtistChatModal.module.css';

const COMMISION_CHIPS = [
  'I would like to commission a custom oil painting.',
  'What canvas sizes and turnaround times do you offer?',
  'Can we discuss a custom color palette for my home?',
];

export default function ArtistChatModal({ artist, isOpen, onClose }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  // Set initial welcome greeting when artist modal opens
  useEffect(() => {
    if (artist && isOpen) {
      setMessages([
        {
          role: 'assistant',
          content: `Welcome to my studio! I'm ${artist.name}. Thank you for following my ${artist.movement} work. How can I help you with a custom commission or piece today?`,
        },
      ]);
    }
  }, [artist, isOpen]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  if (!isOpen || !artist) return null;

  const handleSend = async (customText) => {
    const textToSend = customText || input;
    if (!textToSend.trim() || isLoading) return;

    const userMessage = { role: 'user', content: textToSend };
    const updatedMessages = [...messages, userMessage];

    setMessages(updatedMessages);
    if (!customText) setInput('');
    setIsLoading(true);

    try {
      const apiMessages = updatedMessages.map((m) => ({
        role: m.role,
        content: m.content,
      }));

      const res = await fetch('/api/artist-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          artistName: artist.name,
          movement: artist.movement,
          bio: artist.bio,
          location: artist.location,
          messages: apiMessages,
        }),
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
            content: `Thank you for your message! I'd love to work on this custom commission with you. Let me check my studio schedule.`,
          },
        ]);
      }
    } catch (err) {
      console.error('Artist Chat Error:', err);
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: `My studio message system encountered a brief glitch, but I'd be delighted to discuss custom canvas commissions with you!`,
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
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className={styles.header}>
          <div className={styles.artistMeta}>
            <div className={styles.avatarWrapper}>
              <img src={artist.avatar} alt={artist.name} className={styles.avatarImg} />
              <span className={styles.onlineDot} title="Studio Active" />
            </div>

            <div className={styles.artistInfo}>
              <div className={styles.nameRow}>
                <h3 className={styles.artistName}>{artist.name}</h3>
                {artist.verified && <CheckCircle2 size={16} className={styles.verifiedIcon} />}
              </div>
              <div className={styles.subtitleRow}>
                <span className={styles.movementBadge}>{artist.movement}</span>
                <span className={styles.locationText}>
                  <MapPin size={12} /> {artist.location}
                </span>
              </div>
            </div>
          </div>

          <button className={styles.closeBtn} onClick={onClose} aria-label="Close Chat">
            <X size={20} />
          </button>
        </div>

        {/* Studio Commission Notice Banner */}
        <div className={styles.noticeBanner}>
          <Sparkles size={14} className={styles.sparkleIcon} />
          <span>Direct Studio Messaging • Open for Custom Canvas & Digital Commissions</span>
        </div>

        {/* Message Thread */}
        <div className={styles.messageList}>
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`${styles.messageRow} ${
                msg.role === 'user' ? styles.userRow : styles.artistRow
              }`}
            >
              <div className={styles.avatarBubble}>
                {msg.role === 'user' ? (
                  <User size={14} />
                ) : (
                  <img src={artist.avatar} alt={artist.name} className={styles.bubbleImg} />
                )}
              </div>
              <div className={styles.messageBubble}>
                {msg.role === 'assistant' && (
                  <span className={styles.senderName}>{artist.name.split(' ')[0]}</span>
                )}
                <p className={styles.msgText}>{msg.content}</p>
              </div>
            </div>
          ))}

          {isLoading && (
            <div className={`${styles.messageRow} ${styles.artistRow}`}>
              <div className={styles.avatarBubble}>
                <img src={artist.avatar} alt={artist.name} className={styles.bubbleImg} />
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
        <div className={styles.chipRow}>
          {COMMISION_CHIPS.map((chip) => (
            <button
              key={chip}
              onClick={() => handleSend(chip)}
              disabled={isLoading}
              className={styles.chipBtn}
            >
              {chip}
            </button>
          ))}
        </div>

        {/* Input Controls */}
        <div className={styles.inputArea}>
          <input
            type="text"
            className={styles.inputField}
            placeholder={`Message ${artist.name.split(' ')[0]} about custom art...`}
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
    </div>
  );
}

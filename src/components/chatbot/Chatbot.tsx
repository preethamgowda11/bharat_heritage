
'use client';

import { useState, useEffect, useRef } from 'react';
import { Bot, X, Send, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useUserPreferences } from '@/context/UserPreferencesContext';

interface QaPair {
  question: string;
  answer: string;
}

interface Embeddings {
  [key: string]: number[];
}

interface Message {
  text: string;
  sender: 'user' | 'bot';
}

// Cosine Similarity Function
const cosineSimilarity = (vecA: number[], vecB: number[]): number => {
  const dotProduct = vecA.reduce((sum, a, i) => sum + a * (vecB[i] || 0), 0);
  const magnitudeA = Math.sqrt(vecA.reduce((sum, a) => sum + a * a, 0));
  const magnitudeB = Math.sqrt(vecB.reduce((sum, b) => sum + b * b, 0));
  if (magnitudeA === 0 || magnitudeB === 0) {
    return 0;
  }
  return dotProduct / (magnitudeA * magnitudeB);
};

export function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [dataset, setDataset] = useState<QaPair[]>([]);
  const [embeddings, setEmbeddings] = useState<Embeddings>({});
  const chatBodyRef = useRef<HTMLDivElement>(null);
  const { language } = useUserPreferences();

  useEffect(() => {
    const loadData = async () => {
      try {
        const [datasetRes, embeddingsRes] = await Promise.all([
          fetch('/chatbot/dataset.json'),
          fetch('/chatbot/embeddings.json'),
        ]);

        if (!datasetRes.ok || !embeddingsRes.ok) {
          throw new Error('Failed to load chatbot data');
        }

        const datasetData = await datasetRes.json();
        const embeddingsData = await embeddingsRes.json();

        setDataset(datasetData.qa_pairs);
        setEmbeddings(embeddingsData);
        
        setMessages([
          { text: 'Hello! I am an AI assistant for Heritage Lens. How can I help you explore India\'s rich culture today?', sender: 'bot' },
        ]);

      } catch (error) {
        console.error('Chatbot initialization failed:', error);
        setMessages([
          { text: 'Sorry, I am currently unavailable. Please try again later.', sender: 'bot' },
        ]);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  useEffect(() => {
    if (chatBodyRef.current) {
      chatBodyRef.current.scrollTop = chatBodyRef.current.scrollHeight;
    }
  }, [messages]);
  
  const findBestMatch = (userInput: string): string => {
    const userInputEmbedding = embeddings[userInput.toLowerCase().trim()];
    if (!userInputEmbedding) {
        // A simple keyword match as a fallback if no exact embedding found
        const keywords = userInput.toLowerCase().trim().split(/\s+/);
        let bestMatch: { answer: string; score: number } = { answer: '', score: 0 };
        dataset.forEach(pair => {
            const questionKeywords = pair.question.toLowerCase().split(/\s+/);
            const commonKeywords = keywords.filter(k => questionKeywords.includes(k));
            if (commonKeywords.length > bestMatch.score) {
                bestMatch = { answer: pair.answer, score: commonKeywords.length };
            }
        });
        if (bestMatch.score > 0) return bestMatch.answer;
        return "I'm sorry, I don't have information about that. Could you try asking in a different way?";
    }

    let bestMatch: { answer: string; score: number } | null = null;

    dataset.forEach(pair => {
        const questionEmbedding = embeddings[pair.question.toLowerCase().trim()];
        if (questionEmbedding) {
            const similarity = cosineSimilarity(userInputEmbedding, questionEmbedding);
            if (!bestMatch || similarity > bestMatch.score) {
                bestMatch = { answer: pair.answer, score: similarity };
            }
        }
    });
    
    if (bestMatch && bestMatch.score > 0.7) { // Confidence threshold
        return bestMatch.answer;
    }

    return "I'm not sure I understand. Can you rephrase your question? You could ask me about heritage sites, artifacts, or accessibility features.";
  };


  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    const userMessage = inputValue.trim();
    if (!userMessage) return;

    setMessages(prev => [...prev, { text: userMessage, sender: 'user' }]);
    setInputValue('');

    setTimeout(() => {
        const botResponse = findBestMatch(userMessage);
        setMessages(prev => [...prev, { text: botResponse, sender: 'bot' }]);
    }, 500);
  };

  return (
    <>
      <div className={`chatbot-widget ${isOpen ? 'open' : ''}`}>
        <div className="chatbot-header" onClick={() => setIsOpen(!isOpen)}>
          <span>Chat with our AI Assistant</span>
          <button className="chatbot-close-btn">{isOpen ? <X size={20} /> : <Bot size={24} />}</button>
        </div>
        <div className="chatbot-body" ref={chatBodyRef}>
          {isLoading ? (
             <div className="flex items-center justify-center h-full">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
             </div>
          ) : (
            messages.map((msg, index) => (
              <div key={index} className={`chat-message ${msg.sender}`}>
                <p>{msg.text}</p>
              </div>
            ))
          )}
        </div>
        <div className="chatbot-footer">
          <form onSubmit={handleSendMessage} className="flex items-center gap-2">
            <Input
              type="text"
              placeholder="Ask a question..."
              value={inputValue}
              onChange={e => setInputValue(e.target.value)}
              disabled={isLoading}
              className='bg-background'
            />
            <Button type="submit" size="icon" disabled={isLoading}>
              <Send size={20} />
            </Button>
          </form>
        </div>
      </div>
      
      {!isOpen && (
        <Button
          className="fixed bottom-4 right-4 h-16 w-16 rounded-full shadow-lg"
          onClick={() => setIsOpen(true)}
        >
          <Bot size={32} />
        </Button>
      )}
    </>
  );
}

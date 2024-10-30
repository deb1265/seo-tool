import React, { createContext, useContext, useState } from 'react';
import { useApi } from './ApiContext';
import toast from 'react-hot-toast';

const ChatContext = createContext();

export function ChatProvider({ children }) {
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const { client, model } = useApi();

  const sendMessage = async (content, type = 'create', parameters = {}) => {
    if (!client) {
      throw new Error('API client not configured');
    }

    try {
      setIsLoading(true);
      
      // Add user message
      const userMessage = {
        id: Date.now(),
        role: 'user',
        content: content,
        timestamp: new Date().toISOString(),
      };
      
      setMessages(prev => [...prev, userMessage]);

      // Send to API
      const completion = await client.chat.completions.create({
        messages: [{ role: 'user', content }],
        model: model || 'gpt-3.5-turbo',
        temperature: 0.7,
        max_tokens: 2000,
      });

      const response = completion.choices[0].message;
      
      // Add AI response
      setMessages(prev => [...prev, {
        id: Date.now() + 1,
        role: 'assistant',
        content: response.content,
        timestamp: new Date().toISOString(),
      }]);

      return response.content;
    } catch (error) {
      console.error('Chat error:', error);
      
      // Add error message
      setMessages(prev => [...prev, {
        id: Date.now() + 1,
        role: 'error',
        content: 'Failed to generate response. Please try again.',
        timestamp: new Date().toISOString(),
      }]);

      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ChatContext.Provider value={{ 
      messages, 
      isLoading, 
      sendMessage,
    }}>
      {children}
    </ChatContext.Provider>
  );
}

export const useChat = () => {
  const context = useContext(ChatContext);
  if (context === undefined) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
};

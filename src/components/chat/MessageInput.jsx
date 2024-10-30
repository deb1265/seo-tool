import React, { useState, useCallback } from 'react';
import styled from 'styled-components';
import { FiSend, FiPaperclip, FiMic } from 'react-icons/fi';
import { useChat } from '../../context/ChatContext';
import { useApi } from '../../context/ApiContext';
import toast from 'react-hot-toast';

const InputContainer = styled.div`
  border-top: 1px solid ${props => props.theme.colors.border};
  padding: ${props => props.theme.spacing.lg};
  background: ${props => props.theme.colors.surface};
`

const InputWrapper = styled.div`
  display: flex;
  gap: ${props => props.theme.spacing.md};
  background: ${props => props.theme.colors.secondary};
  border-radius: ${props => props.theme.borderRadius.lg};
  padding: ${props => props.theme.spacing.sm};
`

const TextArea = styled.textarea`
  flex: 1;
  border: none;
  background: none;
  resize: none;
  min-height: 40px;
  max-height: 120px;
  padding: ${props => props.theme.spacing.sm};
  font-family: inherit;
  font-size: ${props => props.theme.typography.body};
  color: ${props => props.theme.colors.neutral};
  
  &:focus {
    outline: none;
  }

  &::placeholder {
    color: ${props => props.theme.colors.neutralLight};
  }
`

const IconButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  color: ${props => props.theme.colors.neutralLight};
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: ${props => props.theme.borderRadius.full};
  transition: all ${props => props.theme.transitions.default};
  
  &:hover {
    color: ${props => props.theme.colors.primary};
    background: ${props => props.theme.colors.primaryLight};
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  ${props => props.$isPrimary && `
    background: ${props.theme.colors.primary};
    color: white;
    
    &:hover:not(:disabled) {
      background: ${props.theme.colors.primaryDark};
      color: white;
    }
  `}
`

function MessageInput() {
  const [message, setMessage] = useState('');
  const { client } = useApi();
  const { sendMessage, isLoading } = useChat();

  const handleSubmit = useCallback(async () => {
    if (!message.trim()) {
      toast.error('Please enter a message');
      return;
    }

    if (!client) {
      toast.error('Please configure API settings first');
      return;
    }

    if (isLoading) return;
    
    try {
      const loadingToast = toast.loading('Sending message...');
      await sendMessage(message, 'create', {
        contentType: 'Article',
        audience: 'General',
        tone: 'Professional',
        style: 'Informative'
      });
      toast.dismiss(loadingToast);
      setMessage('');
    } catch (error) {
      toast.error('Failed to send message');
    }
  }, [message, client, isLoading, sendMessage]);

  const handleKeyPress = useCallback((e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  }, [handleSubmit]);

  return (
    <InputContainer>
      <InputWrapper>
        <IconButton disabled={isLoading}>
          <FiPaperclip size={20} />
        </IconButton>
        <TextArea 
          placeholder="Type your message..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyPress={handleKeyPress}
          disabled={isLoading}
          rows={1}
        />
        <IconButton disabled={isLoading}>
          <FiMic size={20} />
        </IconButton>
        <IconButton 
          $isPrimary
          onClick={handleSubmit}
          disabled={!client || !message.trim() || isLoading}
        >
          <FiSend size={20} />
        </IconButton>
      </InputWrapper>
    </InputContainer>
  );
}

export default MessageInput;

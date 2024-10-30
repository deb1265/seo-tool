import React from 'react';
import styled from 'styled-components';
import ReactMarkdown from 'react-markdown';
import { useChat } from '../../context/ChatContext';
import { FiClock } from 'react-icons/fi';

const MessageListContainer = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: ${props => props.theme.spacing.lg};
  display: flex;
  flex-direction: column;
  gap: ${props => props.theme.spacing.md};
`

const Message = styled.div`
  padding: ${props => props.theme.spacing.lg};
  border-radius: ${props => props.theme.borderRadius.lg};
  max-width: 80%;
  ${props => props.role === 'user' ? `
    align-self: flex-end;
    background: linear-gradient(135deg, ${props.theme.colors.primary}, ${props.theme.colors.primaryDark});
    color: white;
  ` : props.role === 'error' ? `
    align-self: flex-start;
    background: ${props.theme.colors.error};
    color: white;
  ` : `
    align-self: flex-start;
    background: ${props.theme.colors.secondary};
    color: ${props.theme.colors.neutral};
  `}
  box-shadow: ${props => props.theme.shadows.sm};
`

const MessageHeader = styled.div`
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing.sm};
  margin-bottom: ${props => props.theme.spacing.sm};
  font-size: ${props => props.theme.typography.small};
  opacity: 0.8;
`

const Avatar = styled.div`
  width: 24px;
  height: 24px;
  border-radius: ${props => props.theme.borderRadius.full};
  background: ${props => props.role === 'user' ? 'rgba(255, 255, 255, 0.2)' : props.theme.colors.primary};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: ${props => props.theme.typography.tiny};
  color: ${props => props.role === 'user' ? 'white' : props.theme.colors.surface};
  font-weight: 600;
`

const Timestamp = styled.div`
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing.xs};
  font-size: ${props => props.theme.typography.tiny};
`

const LoadingIndicator = styled.div`
  align-self: center;
  padding: ${props => props.theme.spacing.md};
  color: ${props => props.theme.colors.primary};
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing.sm};
  font-size: ${props => props.theme.typography.small};
  
  @keyframes pulse {
    0% { opacity: 1; }
    50% { opacity: 0.5; }
    100% { opacity: 1; }
  }
  
  animation: pulse 1.5s ease-in-out infinite;
`

const EmptyState = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: ${props => props.theme.spacing.md};
  color: ${props => props.theme.colors.neutralLight};
  text-align: center;
  padding: ${props => props.theme.spacing.xl};
`

function MessageList() {
  const { messages, isLoading } = useChat();

  if (messages.length === 0 && !isLoading) {
    return (
      <EmptyState>
        <img src="/logo.svg" alt="Logo" width="48" height="48" />
        <h3>No messages yet</h3>
        <p>Start a conversation or generate content</p>
      </EmptyState>
    );
  }

  return (
    <MessageListContainer>
      {messages.map(message => (
        <Message key={message.id} role={message.role}>
          <MessageHeader>
            <Avatar role={message.role}>
              {message.role === 'user' ? 'U' : 'AI'}
            </Avatar>
            <Timestamp>
              <FiClock size={12} />
              {new Date(message.timestamp).toLocaleTimeString()}
            </Timestamp>
          </MessageHeader>
          <ReactMarkdown>{message.content}</ReactMarkdown>
        </Message>
      ))}
      {isLoading && (
        <LoadingIndicator>
          AI is thinking...
        </LoadingIndicator>
      )}
    </MessageListContainer>
  );
}

export default MessageList;

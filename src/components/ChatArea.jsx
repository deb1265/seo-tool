import React from 'react';
import styled from 'styled-components';
import MessageList from './chat/MessageList';
import MessageInput from './chat/MessageInput';

const ChatContainer = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  background: ${props => props.theme.colors.surface};
  border-radius: ${props => props.theme.borderRadius.lg};
  box-shadow: ${props => props.theme.shadows.sm};
  overflow: hidden;
`

const ChatHeader = styled.div`
  padding: ${props => props.theme.spacing.lg};
  border-bottom: 1px solid ${props => props.theme.colors.border};
  background: ${props => props.theme.colors.surface};
`

const ChatTitle = styled.h2`
  font-size: ${props => props.theme.typography.h3};
  color: ${props => props.theme.colors.neutral};
  font-weight: 600;
`

const ChatDescription = styled.p`
  font-size: ${props => props.theme.typography.small};
  color: ${props => props.theme.colors.neutralLight};
  margin-top: ${props => props.theme.spacing.xs};
`

function ChatArea() {
  return (
    <ChatContainer>
      <ChatHeader>
        <ChatTitle>AI Assistant</ChatTitle>
        <ChatDescription>
          Ask questions or request content generation
        </ChatDescription>
      </ChatHeader>
      <MessageList />
      <MessageInput />
    </ChatContainer>
  );
}

export default ChatArea;

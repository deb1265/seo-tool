import React, { useState, useCallback } from 'react';
import styled from 'styled-components';
import Editor from "@monaco-editor/react";
import { useChat } from '../../context/ChatContext';

const EditorContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  background: ${props => props.theme.colors.secondary};
  padding: ${props => props.theme.spacing.md};
  width: 50%;
`

const ControlsContainer = styled.div`
  display: flex;
  gap: ${props => props.theme.spacing.md};
  margin-bottom: ${props => props.theme.spacing.md};
`

const Button = styled.button`
  background-color: ${props => props.theme.colors.primary};
  color: white;
  border: none;
  border-radius: 4px;
  padding: ${props => props.theme.spacing.sm} ${props => props.theme.spacing.md};
  cursor: pointer;
  
  &:hover {
    opacity: 0.9;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`

const EditorWrapper = styled.div`
  flex: 1;
  border-radius: 4px;
  overflow: hidden;
  border: 1px solid ${props => props.theme.colors.secondary};
`

function EditorPanel() {
  const [content, setContent] = useState('');
  const { sendMessage, isLoading } = useChat();
  const [parameters] = useState({
    contentType: 'Article',
    audience: 'General',
    tone: 'Professional',
    style: 'Informative'
  });

  const handleEdit = useCallback(() => {
    if (!content.trim()) return;
    sendMessage(content, 'edit', parameters);
  }, [content, sendMessage, parameters]);

  const handleFileUpload = useCallback((event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      setContent(e.target.result);
    };
    reader.readAsText(file);
  }, []);

  const handleEditorChange = useCallback((value) => {
    setContent(value || '');
  }, []);

  return (
    <EditorContainer>
      <ControlsContainer>
        <input
          type="file"
          accept=".txt,.md,.doc,.docx"
          onChange={handleFileUpload}
          style={{ display: 'none' }}
          id="file-upload"
        />
        <Button as="label" htmlFor="file-upload">
          Load File
        </Button>
        <Button 
          onClick={handleEdit}
          disabled={isLoading || !content.trim()}
        >
          Edit Content
        </Button>
      </ControlsContainer>
      <EditorWrapper>
        <Editor
          height="100%"
          defaultLanguage="markdown"
          value={content}
          onChange={handleEditorChange}
          theme="vs-light"
          options={{
            minimap: { enabled: false },
            wordWrap: 'on',
            lineNumbers: 'off',
            fontSize: 14,
          }}
        />
      </EditorWrapper>
    </EditorContainer>
  );
}

export default EditorPanel;

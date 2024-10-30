import React, { useState } from 'react';
import styled from 'styled-components';
import { useExa } from '../../context/ExaContext';
import { FiSearch } from 'react-icons/fi';

const SettingsContainer = styled.div`
  padding: ${props => props.theme.spacing.md};
  background-color: ${props => props.theme.colors.secondary};
  border-radius: 8px;
  margin-bottom: ${props => props.theme.spacing.md};
`

const Title = styled.h3`
  font-size: ${props => props.theme.typography.h3};
  margin-bottom: ${props => props.theme.spacing.md};
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing.sm};
`

const Input = styled.input`
  width: 100%;
  padding: ${props => props.theme.spacing.sm};
  border: 1px solid ${props => props.theme.colors.secondary};
  border-radius: 4px;
  margin-bottom: ${props => props.theme.spacing.sm};
  
  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
  }
`

const Button = styled.button`
  background-color: ${props => props.theme.colors.primary};
  color: white;
  border: none;
  border-radius: 4px;
  padding: ${props => props.theme.spacing.sm} ${props => props.theme.spacing.md};
  cursor: pointer;
  width: 100%;
  
  &:hover {
    opacity: 0.9;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`

function ExaSettings() {
  const { apiKey, updateApiKey } = useExa();
  const [newApiKey, setNewApiKey] = useState(apiKey);

  const handleSubmit = (e) => {
    e.preventDefault();
    updateApiKey(newApiKey);
  };

  return (
    <SettingsContainer>
      <Title>
        <FiSearch />
        Exa Search Settings
      </Title>
      <form onSubmit={handleSubmit}>
        <Input
          type="password"
          placeholder="Exa API Key"
          value={newApiKey}
          onChange={(e) => setNewApiKey(e.target.value)}
          required
          autoComplete="off"
        />
        <Button type="submit">
          Save Exa API Key
        </Button>
      </form>
    </SettingsContainer>
  );
}

export default ExaSettings;

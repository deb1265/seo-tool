import React, { useState } from 'react';
import styled from 'styled-components';
import { FiPlus, FiTrash2, FiAlertTriangle } from 'react-icons/fi';
import { useApi } from '../../context/ApiContext';
import toast from 'react-hot-toast';

const SettingsContainer = styled.div`
  padding: ${props => props.theme.spacing.md};
  background-color: ${props => props.theme.colors.secondary};
  border-radius: 8px;
  margin-bottom: ${props => props.theme.spacing.md};
`

const Title = styled.h3`
  font-size: ${props => props.theme.typography.h3};
  margin-bottom: ${props => props.theme.spacing.md};
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
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing.sm};
  
  &:hover {
    opacity: 0.9;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`

const WarningMessage = styled.div`
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing.sm};
  padding: ${props => props.theme.spacing.sm};
  margin-bottom: ${props => props.theme.spacing.md};
  background-color: ${props => props.theme.colors.warning}20;
  border: 1px solid ${props => props.theme.colors.warning};
  border-radius: 4px;
  color: ${props => props.theme.colors.neutral};
  font-size: ${props => props.theme.typography.small};
`

const ModelSection = styled.div`
  margin-top: ${props => props.theme.spacing.lg};
  border-top: 1px solid ${props => props.theme.colors.border};
  padding-top: ${props => props.theme.spacing.md};
`

const ModelList = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${props => props.theme.spacing.sm};
  margin-top: ${props => props.theme.spacing.md};
`

const ModelItem = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: ${props => props.theme.spacing.sm};
  background: white;
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 4px;
`

const ModelName = styled.span`
  flex: 1;
`

const AddModelForm = styled.form`
  display: flex;
  gap: ${props => props.theme.spacing.sm};
  margin-bottom: ${props => props.theme.spacing.md};
`

const IconButton = styled.button`
  background: none;
  border: none;
  color: ${props => props.theme.colors.neutral};
  cursor: pointer;
  padding: ${props => props.theme.spacing.xs};
  display: flex;
  align-items: center;
  
  &:hover {
    color: ${props => props.theme.colors.error};
  }
`

function ApiSettings() {
  const { updateConfig, customModels, addCustomModel, removeCustomModel } = useApi();
  const [formData, setFormData] = useState({
    apiKey: '',
    baseURL: 'https://api.openai.com/v1',
    model: ''
  });
  const [newModel, setNewModel] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;

    setIsSubmitting(true);
    try {
      await updateConfig(formData.apiKey, formData.baseURL, formData.model);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAddModel = (e) => {
    e.preventDefault();
    if (!newModel.trim()) {
      toast.error('Please enter a model name');
      return;
    }
    addCustomModel(newModel.trim());
    setNewModel('');
  };

  return (
    <SettingsContainer>
      <Title>API Settings</Title>
      
      <WarningMessage>
        <FiAlertTriangle />
        <span>API key will be stored in the browser. Use with caution.</span>
      </WarningMessage>

      <form onSubmit={handleSubmit}>
        <Input
          type="password"
          placeholder="OpenAI API Key"
          value={formData.apiKey}
          onChange={(e) => setFormData(prev => ({ ...prev, apiKey: e.target.value }))}
          required
        />
        <Input
          type="url"
          placeholder="Base URL"
          value={formData.baseURL}
          onChange={(e) => setFormData(prev => ({ ...prev, baseURL: e.target.value }))}
          required
        />
        <Input
          type="text"
          placeholder="Select or enter model name"
          value={formData.model}
          onChange={(e) => setFormData(prev => ({ ...prev, model: e.target.value }))}
          list="models"
          required
        />
        <datalist id="models">
          {customModels.map(model => (
            <option key={model} value={model} />
          ))}
        </datalist>
        
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Saving...' : 'Save Settings'}
        </Button>
      </form>

      <ModelSection>
        <Title>Manage Models</Title>
        <AddModelForm onSubmit={handleAddModel}>
          <Input
            type="text"
            placeholder="Add new model (e.g., gpt-4)"
            value={newModel}
            onChange={(e) => setNewModel(e.target.value)}
          />
          <Button type="submit">
            <FiPlus /> Add
          </Button>
        </AddModelForm>

        <ModelList>
          {customModels.map(model => (
            <ModelItem key={model}>
              <ModelName>{model}</ModelName>
              <IconButton onClick={() => removeCustomModel(model)}>
                <FiTrash2 />
              </IconButton>
            </ModelItem>
          ))}
        </ModelList>
      </ModelSection>
    </SettingsContainer>
  );
}

export default ApiSettings;

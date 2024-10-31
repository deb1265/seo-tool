import React from 'react';
import styled from 'styled-components';
import { FiZap, FiAlertCircle } from 'react-icons/fi';
import { ContentBrief } from './sidebar/ContentBrief';
import { ContentParameters } from './sidebar/ContentParameters';
import ApiSettings from './settings/ApiSettings';
import ExaSettings from './settings/ExaSettings';
import ResearchPanel from './research/ResearchPanel';
import { useChat } from '../context/ChatContext';
import { useApi } from '../context/ApiContext';
import promptGenerator from '../services/promptGenerator';
import toast from 'react-hot-toast';

const SidebarContainer = styled.div`
  width: 400px;
  border-right: 1px solid ${props => props.theme.colors.border};
  background: ${props => props.theme.colors.surface};
  display: flex;
  flex-direction: column;
  height: 100%;
`

const ScrollableContent = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: ${props => props.theme.spacing.lg};
  display: flex;
  flex-direction: column;
  gap: ${props => props.theme.spacing.lg};
`

const GenerateButton = styled.button`
  background: linear-gradient(135deg, ${props => props.theme.colors.primary}, ${props => props.theme.colors.primaryDark});
  color: white;
  border: none;
  border-radius: ${props => props.theme.borderRadius.md};
  padding: ${props => props.theme.spacing.lg};
  margin: ${props => props.theme.spacing.lg};
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: ${props => props.theme.spacing.sm};
  font-size: ${props => props.theme.typography.body};
  font-weight: 600;
  transition: all ${props => props.theme.transitions.default};
  box-shadow: ${props => props.theme.shadows.md};
  
  &:hover:not(:disabled) {
    transform: translateY(-1px);
    box-shadow: ${props => props.theme.shadows.lg};
  }

  &:active:not(:disabled) {
    transform: translateY(0);
    box-shadow: ${props => props.theme.shadows.sm};
  }
  
  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
  }

  svg {
    width: 20px;
    height: 20px;
  }
`

const Section = styled.div`
  background: white;
  border-radius: ${props => props.theme.borderRadius.lg};
  padding: ${props => props.theme.spacing.lg};
  box-shadow: ${props => props.theme.shadows.sm};
`

const ErrorMessage = styled.div`
  color: ${props => props.theme.colors.error};
  background: ${props => props.theme.colors.error}10;
  padding: ${props => props.theme.spacing.md};
  margin: ${props => props.theme.spacing.md};
  border-radius: ${props => props.theme.borderRadius.md};
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing.sm};
  font-size: ${props => props.theme.typography.small};

  svg {
    flex-shrink: 0;
  }
`

function Sidebar() {
  const { sendMessage, isLoading } = useChat();
  const { client } = useApi();

  const validateParameters = () => {
    const topic = localStorage.getItem('contentTopic')?.trim();
    const contentType = localStorage.getItem('contentType');
    const audience = localStorage.getItem('targetAudience');

    const errors = [];

    if (!topic) {
      errors.push('Please enter a topic in the Content Brief');
    }

    if (!contentType) {
      errors.push('Please select a content type');
    }

    if (!audience) {
      errors.push('Please select a target audience');
    }

    return errors;
  };

  const handleUseContent = (content) => {
    toast.success('Content ready to use');
  };

  const getContentParameters = () => {
    return {
      topic: localStorage.getItem('contentTopic')?.trim(),
      contentType: localStorage.getItem('contentType') || 'Article',
      audience: localStorage.getItem('targetAudience') || 'General',
      tone: localStorage.getItem('contentTone') || 'Professional',
      style: localStorage.getItem('writingStyle') || 'Informative',
      keywords: JSON.parse(localStorage.getItem('seoKeywords') || '[]'),
      includeReferences: localStorage.getItem('includeReferences') === 'true',
      competitorAnalysis: localStorage.getItem('competitorAnalysis') === 'true'
    };
  };

  const generateContent = async () => {
    if (!client) {
      toast.error('Please configure API settings first');
      return;
    }

    const errors = validateParameters();
    if (errors.length > 0) {
      errors.forEach(error => toast.error(error));
      return;
    }

    const loadingToast = toast.loading('Generating content...');

    try {
      const parameters = getContentParameters();
      const prompt = promptGenerator.generatePrompt(parameters);

      console.log('Generating content with parameters:', parameters);
      const response = await sendMessage(prompt, 'create', parameters);
      
      // Check if the response meets the requirements
      const validation = validateResponse(response, parameters);
      if (validation.issues.length > 0) {
        // If there are issues, try to fix them
        const improvedPrompt = promptGenerator.generateEditPrompt(response, {
          ...parameters,
          specificIssues: validation.issues
        });
        await sendMessage(improvedPrompt, 'edit', parameters);
      }

      toast.success('Content generated successfully');
    } catch (error) {
      console.error('Generation error:', error);
      toast.error(error.message || 'Failed to generate content');
    } finally {
      toast.dismiss(loadingToast);
    }
  };

  const validateResponse = (content, parameters) => {
    const issues = [];

    // Check word count
    const wordCount = content.split(/\s+/).length;
    const minWords = parameters.contentType === 'Article' ? 1000 : 500;
    if (wordCount < minWords) {
      issues.push(`Content is too short (${wordCount} words). Minimum expected: ${minWords} words`);
    }

    // Check keyword usage
    if (parameters.keywords.length > 0) {
      const missingKeywords = parameters.keywords.filter(keyword => 
        !content.toLowerCase().includes(keyword.toLowerCase())
      );
      if (missingKeywords.length > 0) {
        issues.push(`Missing keywords: ${missingKeywords.join(', ')}`);
      }
    }

    // Check for references if required
    if (parameters.includeReferences && !content.includes('Reference') && !content.includes('Source')) {
      issues.push('Missing references section');
    }

    return { issues, wordCount };
  };

  return (
    <SidebarContainer>
      <ScrollableContent>
        <Section>
          <ApiSettings />
        </Section>
        <Section>
          <ExaSettings />
        </Section>
        <Section>
          <ResearchPanel onUseContent={handleUseContent} />
        </Section>
        <Section>
          <ContentBrief />
        </Section>
        <Section>
          <ContentParameters />
        </Section>
      </ScrollableContent>
      <GenerateButton 
        onClick={generateContent}
        disabled={isLoading || !client}
      >
        <FiZap />
        {isLoading ? 'Generating...' : 'Generate Content'}
      </GenerateButton>
      {!client && (
        <ErrorMessage>
          <FiAlertCircle />
          Please configure API settings before generating content
        </ErrorMessage>
      )}
    </SidebarContainer>
  );
}

export default Sidebar;
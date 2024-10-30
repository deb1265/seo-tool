import React from 'react';
import styled from 'styled-components';
import { FiZap } from 'react-icons/fi';
import { ContentBrief } from './sidebar/ContentBrief';
import { ContentParameters } from './sidebar/ContentParameters';
import ApiSettings from './settings/ApiSettings';
import ExaSettings from './settings/ExaSettings';
import ResearchPanel from './research/ResearchPanel';
import { useChat } from '../context/ChatContext';
import { useApi } from '../context/ApiContext';
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

function Sidebar() {
  const { sendMessage, isLoading } = useChat();
  const { client } = useApi();

  const handleUseContent = (content) => {
    toast.success('Content ready to use');
  };

  const generateContent = async () => {
    if (!client) {
      toast.error('Please configure API settings first');
      return;
    }

    // Get content brief data from localStorage
    const topic = localStorage.getItem('contentTopic')?.trim();
    if (!topic) {
      toast.error('Please enter a topic in the Content Brief');
      return;
    }

    const loadingToast = toast.loading('Generating content...');

    try {
      // Gather all parameters
      const parameters = {
        contentType: localStorage.getItem('contentType') || 'Article',
        audience: localStorage.getItem('targetAudience') || 'General',
        tone: localStorage.getItem('contentTone') || 'Professional',
        style: localStorage.getItem('writingStyle') || 'Informative',
        keywords: JSON.parse(localStorage.getItem('seoKeywords') || '[]'),
        includeReferences: localStorage.getItem('includeReferences') === 'true',
        competitorAnalysis: localStorage.getItem('competitorAnalysis') === 'true'
      };

      // Create a structured prompt
      const prompt = `
Topic: ${topic}

Content Type: ${parameters.contentType}
Target Audience: ${parameters.audience}
Tone: ${parameters.tone}
Writing Style: ${parameters.style}
${parameters.keywords.length > 0 ? `\nKeywords to include: ${parameters.keywords.join(', ')}` : ''}
${parameters.includeReferences ? '\nPlease include relevant citations and references.' : ''}
${parameters.competitorAnalysis ? '\nInclude competitive analysis and market insights.' : ''}

Please create comprehensive content that:
1. Is well-structured and engaging
2. Matches the specified tone and style
3. Targets the intended audience effectively
4. Naturally incorporates the provided keywords
5. Includes proper headings and sections
${parameters.includeReferences ? '6. Cites reliable sources and includes references' : ''}
${parameters.competitorAnalysis ? '7. Analyzes competitive content and provides unique insights' : ''}
`;

      console.log('Generating content with prompt:', prompt);
      await sendMessage(prompt, 'create', parameters);
      toast.success('Content generated successfully');
    } catch (error) {
      console.error('Generation error:', error);
      toast.error('Failed to generate content');
    } finally {
      toast.dismiss(loadingToast);
    }
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
        Generate Content
      </GenerateButton>
    </SidebarContainer>
  );
}

export default Sidebar;

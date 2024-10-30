import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import toast from 'react-hot-toast';

const Section = styled.section`
  margin-bottom: ${props => props.theme.spacing.lg};
`

const Title = styled.h2`
  font-size: ${props => props.theme.typography.h2};
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

const Select = styled.select`
  width: 100%;
  padding: ${props => props.theme.spacing.sm};
  border: 1px solid ${props => props.theme.colors.secondary};
  border-radius: 4px;
  margin-bottom: ${props => props.theme.spacing.sm};
`

const KeywordContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${props => props.theme.spacing.xs};
  margin-top: ${props => props.theme.spacing.xs};
`

const Keyword = styled.div`
  background-color: ${props => props.theme.colors.primary};
  color: white;
  padding: ${props => props.theme.spacing.xs} ${props => props.theme.spacing.sm};
  border-radius: 4px;
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing.xs};
  font-size: ${props => props.theme.typography.small};
`

const RemoveKeyword = styled.button`
  background: none;
  border: none;
  color: white;
  cursor: pointer;
  padding: 0;
  font-size: ${props => props.theme.typography.small};
  
  &:hover {
    opacity: 0.8;
  }
`

export function ContentBrief() {
  const [topic, setTopic] = useState('');
  const [audience, setAudience] = useState('');
  const [contentType, setContentType] = useState('');
  const [keywords, setKeywords] = useState([]);
  const [keywordInput, setKeywordInput] = useState('');

  // Load saved values
  useEffect(() => {
    const savedTopic = localStorage.getItem('contentTopic');
    const savedAudience = localStorage.getItem('targetAudience');
    const savedContentType = localStorage.getItem('contentType');
    const savedKeywords = JSON.parse(localStorage.getItem('seoKeywords') || '[]');

    if (savedTopic) setTopic(savedTopic);
    if (savedAudience) setAudience(savedAudience);
    if (savedContentType) setContentType(savedContentType);
    if (savedKeywords.length > 0) setKeywords(savedKeywords);
  }, []);

  const handleTopicChange = (e) => {
    const newTopic = e.target.value;
    setTopic(newTopic);
    localStorage.setItem('contentTopic', newTopic);
  };

  const handleTopicBlur = () => {
    if (!topic.trim()) {
      toast.error('Please enter a topic');
    }
  };

  const handleAudienceChange = (e) => {
    const newAudience = e.target.value;
    setAudience(newAudience);
    localStorage.setItem('targetAudience', newAudience);
  };

  const handleContentTypeChange = (e) => {
    const newContentType = e.target.value;
    setContentType(newContentType);
    localStorage.setItem('contentType', newContentType);
  };

  const handleKeywordSubmit = (e) => {
    if (e.key === 'Enter' && keywordInput.trim()) {
      const newKeyword = keywordInput.trim();
      if (keywords.includes(newKeyword)) {
        toast.error('Keyword already exists');
        return;
      }
      
      const newKeywords = [...keywords, newKeyword];
      setKeywords(newKeywords);
      localStorage.setItem('seoKeywords', JSON.stringify(newKeywords));
      setKeywordInput('');
      toast.success('Keyword added');
    }
  };

  const removeKeyword = (indexToRemove) => {
    const newKeywords = keywords.filter((_, index) => index !== indexToRemove);
    setKeywords(newKeywords);
    localStorage.setItem('seoKeywords', JSON.stringify(newKeywords));
    toast.success('Keyword removed');
  };

  return (
    <Section>
      <Title>Content Brief</Title>
      <Input 
        placeholder="Enter your topic *"
        value={topic}
        onChange={handleTopicChange}
        onBlur={handleTopicBlur}
        required
      />
      <Select 
        value={audience}
        onChange={handleAudienceChange}
      >
        <option value="">Select Target Audience</option>
        <option value="general">General</option>
        <option value="professional">Professional</option>
        <option value="technical">Technical</option>
        <option value="academic">Academic</option>
        <option value="business">Business</option>
      </Select>
      <Select 
        value={contentType}
        onChange={handleContentTypeChange}
      >
        <option value="">Select Content Type</option>
        <option value="blog">Blog Post</option>
        <option value="article">Article</option>
        <option value="whitepaper">White Paper</option>
        <option value="social">Social Post</option>
        <option value="email">Email</option>
        <option value="press">Press Release</option>
      </Select>
      <Input
        placeholder="Add SEO Keywords (Press Enter)"
        value={keywordInput}
        onChange={(e) => setKeywordInput(e.target.value)}
        onKeyPress={handleKeywordSubmit}
      />
      <KeywordContainer>
        {keywords.map((keyword, index) => (
          <Keyword key={index}>
            {keyword}
            <RemoveKeyword onClick={() => removeKeyword(index)}>×</RemoveKeyword>
          </Keyword>
        ))}
      </KeywordContainer>
    </Section>
  );
}

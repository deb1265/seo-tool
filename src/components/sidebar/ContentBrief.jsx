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
  
  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
  }
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

const ErrorMessage = styled.div`
  color: ${props => props.theme.colors.error};
  font-size: ${props => props.theme.typography.small};
  margin-top: ${props => props.theme.spacing.xs};
  margin-bottom: ${props => props.theme.spacing.sm};
`

export function ContentBrief() {
  // Initialize all state variables
  const [topic, setTopic] = useState('');
  const [audience, setAudience] = useState('');
  const [contentType, setContentType] = useState('');
  const [keywords, setKeywords] = useState([]);
  const [keywordInput, setKeywordInput] = useState('');
  const [error, setError] = useState('');

  // Load saved values on component mount
  useEffect(() => {
    try {
      // Load topic
      const savedTopic = localStorage.getItem('contentTopic');
      if (savedTopic) setTopic(savedTopic);

      // Load audience
      const savedAudience = localStorage.getItem('targetAudience');
      if (savedAudience) setAudience(savedAudience);

      // Load content type
      const savedContentType = localStorage.getItem('contentType');
      if (savedContentType) setContentType(savedContentType);

      // Load and parse keywords with validation
      const savedKeywords = localStorage.getItem('seoKeywords');
      if (savedKeywords) {
        const parsedKeywords = JSON.parse(savedKeywords);
        if (Array.isArray(parsedKeywords)) {
          setKeywords(parsedKeywords);
        } else {
          throw new Error('Saved keywords are not in valid format');
        }
      }
    } catch (err) {
      console.error('Error loading saved data:', err);
      setError('Error loading saved data. Some values have been reset.');
      setKeywords([]); // Reset to empty array
      localStorage.setItem('seoKeywords', '[]'); // Reset localStorage
    }
  }, []);

  const handleTopicChange = (e) => {
    const newTopic = e.target.value;
    setTopic(newTopic);
    try {
      localStorage.setItem('contentTopic', newTopic);
    } catch (err) {
      console.error('Error saving topic:', err);
      toast.error('Failed to save topic');
    }
  };

  const handleTopicBlur = () => {
    if (!topic.trim()) {
      toast.error('Please enter a topic');
    }
  };

  const handleAudienceChange = (e) => {
    const newAudience = e.target.value;
    setAudience(newAudience);
    try {
      localStorage.setItem('targetAudience', newAudience);
    } catch (err) {
      console.error('Error saving audience:', err);
      toast.error('Failed to save audience selection');
    }
  };

  const handleContentTypeChange = (e) => {
    const newContentType = e.target.value;
    setContentType(newContentType);
    try {
      localStorage.setItem('contentType', newContentType);
    } catch (err) {
      console.error('Error saving content type:', err);
      toast.error('Failed to save content type');
    }
  };

  const handleKeywordSubmit = (e) => {
    if (e.key === 'Enter' && keywordInput.trim()) {
      try {
        const newKeyword = keywordInput.trim();
        
        // Validate keyword isn't already in list
        if (keywords.includes(newKeyword)) {
          toast.error('Keyword already exists');
          return;
        }

        // Ensure we're working with an array
        const currentKeywords = Array.isArray(keywords) ? keywords : [];
        const newKeywords = [...currentKeywords, newKeyword];
        
        // Update state and localStorage
        setKeywords(newKeywords);
        localStorage.setItem('seoKeywords', JSON.stringify(newKeywords));
        setKeywordInput('');
        toast.success('Keyword added');
      } catch (err) {
        console.error('Error adding keyword:', err);
        toast.error('Failed to add keyword');
      }
    }
  };

  const removeKeyword = (indexToRemove) => {
    try {
      const newKeywords = keywords.filter((_, index) => index !== indexToRemove);
      setKeywords(newKeywords);
      localStorage.setItem('seoKeywords', JSON.stringify(newKeywords));
      toast.success('Keyword removed');
    } catch (err) {
      console.error('Error removing keyword:', err);
      toast.error('Failed to remove keyword');
    }
  };

  return (
    <Section>
      <Title>Content Brief</Title>
      {error && <ErrorMessage>{error}</ErrorMessage>}
      
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
        {Array.isArray(keywords) && keywords.map((keyword, index) => (
          <Keyword key={index}>
            {keyword}
            <RemoveKeyword 
              onClick={() => removeKeyword(index)}
              aria-label="Remove keyword"
            >
              ×
            </RemoveKeyword>
          </Keyword>
        ))}
      </KeywordContainer>
    </Section>
  );
}
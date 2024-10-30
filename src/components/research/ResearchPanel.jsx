import React, { useState } from 'react';
import styled from 'styled-components';
import { FiSearch, FiExternalLink } from 'react-icons/fi';
import { useExa } from '../../context/ExaContext';
import toast from 'react-hot-toast';

const Container = styled.div`
  padding: ${props => props.theme.spacing.md};
  background-color: white;
  border-radius: 8px;
  margin-bottom: ${props => props.theme.spacing.md};
`

const SearchContainer = styled.div`
  display: flex;
  gap: ${props => props.theme.spacing.sm};
  margin-bottom: ${props => props.theme.spacing.md};
`

const SearchInput = styled.input`
  flex: 1;
  padding: ${props => props.theme.spacing.sm};
  border: 1px solid ${props => props.theme.colors.secondary};
  border-radius: 4px;
  
  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
  }
`

const SearchButton = styled.button`
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

const ResultsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${props => props.theme.spacing.md};
`

const ResultItem = styled.div`
  padding: ${props => props.theme.spacing.md};
  border: 1px solid ${props => props.theme.colors.secondary};
  border-radius: 4px;
  background-color: white;
`

const ResultTitle = styled.h4`
  font-size: ${props => props.theme.typography.body};
  margin-bottom: ${props => props.theme.spacing.sm};
  color: ${props => props.theme.colors.primary};
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing.sm};
  
  a {
    color: inherit;
    text-decoration: none;
    
    &:hover {
      text-decoration: underline;
    }
  }
`

const ResultExcerpt = styled.p`
  font-size: ${props => props.theme.typography.small};
  color: ${props => props.theme.colors.neutral};
  margin-bottom: ${props => props.theme.spacing.sm};
`

const UseButton = styled.button`
  background: none;
  border: 1px solid ${props => props.theme.colors.primary};
  color: ${props => props.theme.colors.primary};
  border-radius: 4px;
  padding: ${props => props.theme.spacing.xs} ${props => props.theme.spacing.sm};
  cursor: pointer;
  font-size: ${props => props.theme.typography.small};
  
  &:hover {
    background-color: ${props => props.theme.colors.primary};
    color: white;
  }
`

function ResearchPanel({ onUseContent }) {
  const { searchContent, isSearching, client } = useExa();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);

  const handleSearch = async () => {
    if (!query.trim()) {
      toast.error('Please enter a search query');
      return;
    }

    const searchResults = await searchContent(query);
    if (searchResults) {
      setResults(searchResults);
      toast.success(`Found ${searchResults.length} results`);
    }
  };

  const handleUseContent = (content) => {
    onUseContent(content);
    toast.success('Content added to editor');
  };

  return (
    <Container>
      <SearchContainer>
        <SearchInput
          placeholder="Search for content..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          disabled={isSearching || !client}
        />
        <SearchButton 
          onClick={handleSearch}
          disabled={isSearching || !client || !query.trim()}
        >
          <FiSearch />
          {isSearching ? 'Searching...' : 'Search'}
        </SearchButton>
      </SearchContainer>

      <ResultsList>
        {results.map((result, index) => (
          <ResultItem key={index}>
            <ResultTitle>
              <a href={result.url} target="_blank" rel="noopener noreferrer">
                {result.title || 'Untitled'}
              </a>
              <FiExternalLink size={14} />
            </ResultTitle>
            <ResultExcerpt>
              {result.text?.slice(0, 200)}...
            </ResultExcerpt>
            <UseButton onClick={() => handleUseContent(result.text)}>
              Use Content
            </UseButton>
          </ResultItem>
        ))}
      </ResultsList>
    </Container>
  );
}

export default ResearchPanel;

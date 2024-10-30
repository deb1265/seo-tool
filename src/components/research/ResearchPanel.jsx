import React, { useState } from 'react';
import styled from 'styled-components';
import { FiSearch, FiExternalLink, FiCopy, FiInfo, FiPlus } from 'react-icons/fi';
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
  
  &:hover:not(:disabled) {
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
  max-height: 400px;
  overflow-y: auto;
`

const ResultItem = styled.div`
  padding: ${props => props.theme.spacing.md};
  border: 1px solid ${props => props.theme.colors.secondary};
  border-radius: 4px;
  background-color: white;
  transition: all ${props => props.theme.transitions.default};

  &:hover {
    box-shadow: ${props => props.theme.shadows.md};
    border-color: ${props => props.theme.colors.primary};
  }
`

const ResultTitle = styled.div`
  font-size: ${props => props.theme.typography.body};
  margin-bottom: ${props => props.theme.spacing.sm};
  color: ${props => props.theme.colors.primary};
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: ${props => props.theme.spacing.sm};
`

const TitleText = styled.a`
  color: inherit;
  text-decoration: none;
  flex: 1;
  font-weight: 500;
  
  &:hover {
    text-decoration: underline;
  }
`

const ActionButtons = styled.div`
  display: flex;
  gap: ${props => props.theme.spacing.xs};
`

const IconButton = styled.button`
  background: none;
  border: none;
  color: ${props => props.theme.colors.neutral};
  cursor: pointer;
  padding: ${props => props.theme.spacing.xs};
  display: flex;
  align-items: center;
  border-radius: ${props => props.theme.borderRadius.sm};
  transition: all ${props => props.theme.transitions.default};
  
  &:hover {
    color: ${props => props.theme.colors.primary};
    background: ${props => props.theme.colors.primaryLight};
  }
`

const ResultExcerpt = styled.p`
  font-size: ${props => props.theme.typography.small};
  color: ${props => props.theme.colors.neutral};
  margin-bottom: ${props => props.theme.spacing.sm};
  line-height: 1.6;
`

const ResultMeta = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: ${props => props.theme.typography.small};
  color: ${props => props.theme.colors.neutralLight};
  margin-top: ${props => props.theme.spacing.sm};
  padding-top: ${props => props.theme.spacing.sm};
  border-top: 1px solid ${props => props.theme.colors.secondary};
`

const UseContentButton = styled(SearchButton)`
  background: ${props => props.theme.colors.primaryLight};
  color: ${props => props.theme.colors.primary};
  font-weight: 500;
  padding: ${props => props.theme.spacing.xs} ${props => props.theme.spacing.sm};
  
  &:hover:not(:disabled) {
    background: ${props => props.theme.colors.primary};
    color: white;
  }
`

const NoResults = styled.div`
  text-align: center;
  padding: ${props => props.theme.spacing.xl};
  color: ${props => props.theme.colors.neutralLight};
`

const LoadingSpinner = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: ${props => props.theme.spacing.xl};
  color: ${props => props.theme.colors.primary};

  @keyframes spin {
    to { transform: rotate(360deg); }
  }

  svg {
    animation: spin 1s linear infinite;
  }
`

function ResearchPanel({ onUseContent }) {
  const { searchContent, isSearching, client } = useExa();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = async () => {
    if (!query.trim()) {
      toast.error('Please enter a search query');
      return;
    }

    try {
      setHasSearched(true);
      const searchResults = await searchContent(query, {
        type: "neural",
        useAutoprompt: true,
        numResults: 5,
        text: true,
        highlights: true
      });

      if (searchResults?.length > 0) {
        setResults(searchResults);
        toast.success(`Found ${searchResults.length} results`);
      } else {
        setResults([]);
        toast.error('No results found');
      }
    } catch (error) {
      console.error('Search error:', error);
      toast.error('Failed to perform search');
      setResults([]);
    }
  };

  const handleUseContent = (content) => {
    onUseContent(content);
    toast.success('Content added to editor');
  };

  const handleCopyUrl = async (url) => {
    try {
      await navigator.clipboard.writeText(url);
      toast.success('URL copied to clipboard');
    } catch (error) {
      toast.error('Failed to copy URL');
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !isSearching) {
      handleSearch();
    }
  };

  const formatUrl = (url) => {
    try {
      const domain = new URL(url).hostname;
      return domain.replace('www.', '');
    } catch {
      return url;
    }
  };

  return (
    <Container>
      <SearchContainer>
        <SearchInput
          placeholder="Search for relevant content..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyPress={handleKeyPress}
          disabled={isSearching}
        />
        <SearchButton 
          onClick={handleSearch}
          disabled={isSearching || !query.trim()}
        >
          <FiSearch />
          {isSearching ? 'Searching...' : 'Search'}
        </SearchButton>
      </SearchContainer>

      <ResultsList>
        {isSearching ? (
          <LoadingSpinner>
            <FiSearch size={24} />
          </LoadingSpinner>
        ) : results.length > 0 ? (
          results.map((result, index) => (
            <ResultItem key={index}>
              <ResultTitle>
                <TitleText 
                  href={result.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                >
                  {result.title || 'Untitled'}
                </TitleText>
                <ActionButtons>
                  <IconButton 
                    onClick={() => handleCopyUrl(result.url)}
                    title="Copy URL"
                  >
                    <FiCopy size={14} />
                  </IconButton>
                  <IconButton 
                    onClick={() => window.open(result.url, '_blank')}
                    title="Open in new tab"
                  >
                    <FiExternalLink size={14} />
                  </IconButton>
                </ActionButtons>
              </ResultTitle>
              <ResultExcerpt>
                {result.text?.slice(0, 200)}...
              </ResultExcerpt>
              <ResultMeta>
                <span>{formatUrl(result.url)}</span>
                <UseContentButton 
                  onClick={() => handleUseContent(result.text)}
                >
                  <FiPlus size={14} />
                  Use Content
                </UseContentButton>
              </ResultMeta>
            </ResultItem>
          ))
        ) : hasSearched ? (
          <NoResults>
            <FiInfo size={24} />
            <p>No results found. Try different keywords.</p>
          </NoResults>
        ) : null}
      </ResultsList>
    </Container>
  );
}

export default ResearchPanel;

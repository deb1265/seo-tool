// src/services/exaClient.js
import Exa from 'exa-js';

class ExaClient {
  constructor(apiKey) {
    this.client = new Exa(apiKey);
  }

  async searchAndContents(query, options = {}) {
    const defaultOptions = {
      type: "neural",
      useAutoprompt: true,
      numResults: 5,
      text: true,
      ...options
    };

    try {
      const results = await this.client.searchAndContents(query, defaultOptions);
      return results.results || [];
    } catch (error) {
      console.error('Exa search error:', error);
      // Rethrow with more specific error message
      throw new Error(`Exa API error: ${error.message || 'Unknown error'}`);
    }
  }

  // Add additional methods for other Exa features
  async findSimilarContent(url, options = {}) {
    return this.client.findSimilarAndContents(url, {
      numResults: 10,
      text: true,
      summary: true,
      ...options
    });
  }
}

export default ExaClient;
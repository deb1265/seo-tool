class ExaClient {
  constructor(apiKey) {
    this.apiKey = apiKey;
    this.baseUrl = 'https://api.exa.ai/documents/search';
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
      const response = await fetch(this.baseUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`
        },
        body: JSON.stringify({
          query,
          ...defaultOptions
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data.results;
    } catch (error) {
      console.error('Exa search error:', error);
      throw error;
    }
  }
}

export default ExaClient;

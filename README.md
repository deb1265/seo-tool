# ContentShake - Content Generation Platform

## Exa API Integration

The Exa API integration is currently in demo mode using simulated responses. To implement the full functionality:

1. Create a backend server (Node.js/Express recommended)
2. Set up a proxy endpoint for Exa API requests
3. Handle API key securely on the server side
4. Implement proper CORS headers
5. Update the `exaClient.js` to use your backend endpoint

Example backend implementation:

```javascript
// Express route example
app.post('/api/exa/search', async (req, res) => {
  try {
    const response = await fetch('https://api.exa.ai/documents/search', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.EXA_API_KEY}`,
        'x-api-key': process.env.EXA_API_KEY
      },
      body: JSON.stringify(req.body)
    });

    const data = await response.json();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
```

Then update `exaClient.js` to use your backend endpoint:

```javascript
class ExaClient {
  constructor(apiKey) {
    this.apiKey = apiKey;
    this.baseUrl = '/api/exa/search'; // Your backend endpoint
  }
  // ... rest of the implementation
}
```

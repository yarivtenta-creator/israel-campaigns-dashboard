require('dotenv').config();
const axios = require('axios');

const API_KEY = process.env.ANTHROPIC_API_KEY;
console.log('API Key loaded:', API_KEY ? 'YES' : 'NO');
console.log('API Key starts with:', API_KEY?.substring(0, 20) + '...');
console.log('API Key length:', API_KEY?.length);

const testRequest = async () => {
  try {
    const response = await axios.post('https://api.anthropic.com/v1/messages', {
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 100,
      messages: [{ role: 'user', content: 'Hi' }]
    }, {
      headers: {
        'x-api-key': API_KEY,
        'anthropic-version': '2023-06-01',
        'content-type': 'application/json'
      }
    });
    console.log('✅ API Key is VALID');
    console.log('Response:', response.data.content[0].text?.substring(0, 50));
  } catch (error) {
    console.log('❌ API Error:', error.response?.status, error.response?.data?.error?.message || error.message);
    if (error.response?.data) {
      console.log('Full error:', JSON.stringify(error.response.data, null, 2));
    }
  }
};

testRequest();

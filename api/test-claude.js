const axios = require('axios');

const API_KEY = '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';

async function test() {
  try {
    console.log('Testing Claude API with key:', API_KEY.substring(0, 30) + '...');

    const response = await axios.post('https://api.anthropic.com/v1/messages', {
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 100,
      messages: [{ role: 'user', content: 'Hello' }]
    }, {
      headers: {
        'x-api-key': API_KEY,
        'anthropic-version': '2023-06-01',
        'content-type': 'application/json'
      },
      timeout: 10000
    });

    console.log('✅ API Key VALID');
    console.log('Response:', response.data.content[0].text);
  } catch (error) {
    console.log('❌ Error:', error.response?.status, error.response?.data?.error?.message || error.message);
    if (error.response?.data) {
      console.log('Response data:', JSON.stringify(error.response.data, null, 2));
    }
  }
}

test();

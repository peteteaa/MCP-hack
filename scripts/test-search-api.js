// Script to test Google Programmable Search API
const fs = require('fs');
const path = require('path');
const https = require('https');

// Read API key from .env.local file
function getEnvVars() {
  try {
    const envPath = path.join(process.cwd(), '.env.local');
    const envContent = fs.readFileSync(envPath, 'utf8');
    
    const googleApiKey = envContent.match(/GOOGLE_API_KEY=(.+)/)?.[1]?.trim();
    const googleSearchEngineId = envContent.match(/GOOGLE_SEARCH_ENGINE_ID=(.+)/)?.[1]?.trim();
    
    return { googleApiKey, googleSearchEngineId };
  } catch (error) {
    console.error('Error reading environment variables:', error.message);
    process.exit(1);
  }
}

async function testSearchApi() {
  const { googleApiKey, googleSearchEngineId } = getEnvVars();
  
  console.log('Testing Google Programmable Search API...');
  console.log('API Key:', googleApiKey ? `${googleApiKey.substring(0, 5)}...` : 'Not found');
  console.log('Search Engine ID:', googleSearchEngineId || 'Not found');
  
  if (!googleApiKey || !googleSearchEngineId) {
    console.error('Error: Missing API key or Search Engine ID');
    return;
  }
  
  const query = 'AI events';
  const url = `https://www.googleapis.com/customsearch/v1?key=${googleApiKey}&cx=${googleSearchEngineId}&q=${encodeURIComponent(query)}`;
  
  console.log(`\nSending test request to: ${url.replace(googleApiKey, 'API_KEY')}`);
  
  try {
    // Make the request using the https module to avoid any dependency issues
    const makeRequest = () => {
      return new Promise((resolve, reject) => {
        https.get(url, (res) => {
          let data = '';
          
          res.on('data', (chunk) => {
            data += chunk;
          });
          
          res.on('end', () => {
            console.log(`Response status: ${res.statusCode}`);
            try {
              const parsedData = JSON.parse(data);
              resolve({ statusCode: res.statusCode, data: parsedData });
            } catch (e) {
              reject(new Error(`Failed to parse response: ${e.message}`));
            }
          });
        }).on('error', (err) => {
          reject(err);
        });
      });
    };
    
    const { statusCode, data } = await makeRequest();
    
    if (statusCode !== 200) {
      console.error('Error response:', JSON.stringify(data, null, 2));
      
      if (data.error?.code === 403) {
        console.log('\nAPI ERROR: The Custom Search API is not enabled for your project.');
        console.log('Please visit this URL to enable it:');
        console.log(`https://console.developers.google.com/apis/api/customsearch.googleapis.com/overview?project=${data.error?.details?.[0]?.links?.[0]?.url?.split('project=')[1] || ''}`);
      }
    } else {
      console.log('\nAPI test successful!');
      console.log(`Found ${data.searchInformation?.totalResults || 0} results`);
      
      if (data.items && data.items.length > 0) {
        console.log('\nFirst result:');
        console.log(`- Title: ${data.items[0].title}`);
        console.log(`- Link: ${data.items[0].link}`);
        console.log(`- Snippet: ${data.items[0].snippet}`);
      }
    }
  } catch (error) {
    console.error('Error testing API:', error.message);
  }
}

testSearchApi();

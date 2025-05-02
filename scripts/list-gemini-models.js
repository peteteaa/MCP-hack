// Script to list available Gemini models
const { GoogleGenerativeAI } = require('@google/generative-ai');
const fs = require('fs');
const path = require('path');

// Read API key from .env.local file
function getApiKey() {
  try {
    const envPath = path.join(process.cwd(), '.env.local');
    const envContent = fs.readFileSync(envPath, 'utf8');
    const match = envContent.match(/NEXT_PUBLIC_GEMINI_API_KEY=(.+)/);
    
    if (match && match[1]) {
      return match[1].trim();
    }
    
    throw new Error('API key not found in .env.local file');
  } catch (error) {
    console.error('Error reading API key:', error.message);
    process.exit(1);
  }
}

const API_KEY = getApiKey();
const genAI = new GoogleGenerativeAI(API_KEY);

async function listAvailableModels() {
  try {
    console.log('Fetching available Gemini models...');
    const models = await genAI.listModels();
    
    console.log('\nAvailable models:');
    console.log('=================');
    
    for (const model of models.models) {
      console.log(`Model: ${model.name}`);
      console.log(`Supported methods: ${model.supportedGenerationMethods.join(', ')}`);
      console.log('-------------------');
    }
    
    console.log('\nRecommended models for text generation:');
    const textModels = models.models.filter(m => 
      m.supportedGenerationMethods.includes('generateContent') && 
      m.name.includes('gemini')
    );
    
    for (const model of textModels) {
      console.log(`- ${model.name.replace('models/', '')}`);
    }
    
  } catch (error) {
    console.error('Error fetching models:', error.message);
    if (error.message.includes('401')) {
      console.error('Authentication error. Please check your API key.');
    }
  }
}

listAvailableModels();

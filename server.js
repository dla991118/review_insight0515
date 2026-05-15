require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { OpenAI } = require('openai');
const { createClient } = require('@supabase/supabase-js');

const path = require('path');

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Serve static files from the root directory using absolute path
app.use(express.static(path.join(process.cwd(), '.')));

// Root Route - Serve index.html explicitly
app.get('/', (req, res) => {
  res.sendFile(path.join(process.cwd(), 'index.html'));
});

// Clients
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const supabase = createClient(
  process.env.SUPABASE_URL || 'https://placeholder.supabase.co',
  process.env.SUPABASE_SERVICE_ROLE_KEY || 'placeholder_key'
);

// Route
app.post('/api/analyze', async (req, res) => {
  const { text } = req.body;

  if (!text) {
    return res.status(400).json({ success: false, error: 'Text is required' });
  }

  try {
    // 1. OpenAI Analysis
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "You are a sentiment analysis expert. Analyze the sentiment of the provided text and return ONLY a valid JSON object with the following fields: 'sentiment' (one of: '긍정', '부정', '중립'), 'sentimentType' (one of: 'positive', 'negative', 'neutral'), 'confidence' (integer 0-100), and 'reason' (a concise explanation in Korean)."
        },
        {
          role: "user",
          content: text
        }
      ],
      response_format: { type: "json_object" }
    });

    const analysisResult = JSON.parse(response.choices[0].message.content);

    // 2. Supabase Logging
    if (process.env.SUPABASE_URL && process.env.SUPABASE_URL !== 'https://placeholder.supabase.co') {
        const { error } = await supabase
          .from('sentiment_logs')
          .insert([
            { 
              input_text: text, 
              sentiment: analysisResult.sentiment, 
              confidence: analysisResult.confidence, 
              reason: analysisResult.reason 
            }
          ]);
        
        if (error) console.error('Supabase Error:', error);
    }

    // 3. Return Response
    res.json({
      success: true,
      data: analysisResult
    });

  } catch (error) {
    console.error('API Error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Analysis failed',
      details: error.message 
    });
  }
});

if (process.env.NODE_ENV !== 'production') {
  app.listen(port, () => {
    console.log(`Review Insight Backend listening at http://localhost:${port}`);
  });
}

module.exports = app;

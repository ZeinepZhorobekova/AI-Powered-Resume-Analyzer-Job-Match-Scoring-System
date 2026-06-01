require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const connectDB = require('./config/db');
const analysisRoutes = require('./routes/analysisRoutes');

if (!process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY.startsWith('sk-placeholder')) {
  console.warn('[mock] OPENAI_API_KEY not configured — AI responses will be simulated. Add your key to server/.env to enable real analysis.');
}

const app = express();
const PORT = process.env.PORT || 5000;

connectDB();

app.use(helmet());
app.use(cors({ origin: process.env.CLIENT_URL || 'http://localhost:5173' }));
app.use(express.json({ limit: '1mb' }));

const analysisLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many analysis requests — please try again in 15 minutes.' },
});

app.use('/api/analyze', analysisLimiter);
app.use('/api', analysisRoutes);

app.get('/health', (req, res) => {
  const { IS_MOCK } = require('./services/openaiService');
  res.json({ status: 'ok', mockMode: IS_MOCK, timestamp: new Date().toISOString() });
});

app.use((req, res) => {
  res.status(404).json({ error: `Route ${req.method} ${req.path} not found` });
});

// Multer errors (file too large, wrong MIME type) come through here as err.code
app.use((err, req, res, next) => {
  if (err.code === 'LIMIT_FILE_SIZE') {
    return res.status(413).json({ error: 'File too large — maximum size is 5 MB.' });
  }
  if (err.message === 'Only PDF files are accepted') {
    return res.status(415).json({ error: err.message });
  }
  console.error(err.stack);
  res.status(500).json({ error: err.message || 'Internal server error' });
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

const express = require('express');
const router = express.Router();
const upload = require('../middleware/upload');
const { analyze, getSession } = require('../controllers/analysisController');

router.post('/analyze', upload.single('resume'), analyze);
router.get('/session/:sessionId', getSession);

module.exports = router;

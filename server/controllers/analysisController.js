const { v4: uuidv4 } = require('uuid');
const { extractText } = require('../services/pdfService');
const { extractSkillProfile, matchJobDescription } = require('../services/openaiService');
const Session = require('../models/Session');

const analyze = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'Resume PDF is required' });
    }
    const { jobDescription } = req.body;
    if (!jobDescription || jobDescription.trim().length < 50) {
      return res.status(400).json({ error: 'Job description must be at least 50 characters' });
    }

    const resumeText = await extractText(req.file.buffer);
    const skillProfile = await extractSkillProfile(resumeText);
    const matchResult = await matchJobDescription(skillProfile, jobDescription);

    const sessionId = uuidv4();
    await Session.create({
      sessionId,
      fitScore: matchResult.fit_score,
      matchedSkills: matchResult.matched_skills,
      missingSkills: matchResult.missing_skills,
      recommendations: matchResult.recommendations,
      jobTitle: matchResult.job_title || '',
    });

    res.json({
      sessionId,
      fitScore: matchResult.fit_score,
      jobTitle: matchResult.job_title,
      matchedSkills: matchResult.matched_skills,
      missingSkills: matchResult.missing_skills,
      recommendations: matchResult.recommendations,
      skillProfile,
    });
  } catch (err) {
    console.error('Analysis error:', err);
    res.status(500).json({ error: err.message || 'Analysis failed' });
  }
};

const getSession = async (req, res) => {
  try {
    const session = await Session.findOne({ sessionId: req.params.sessionId });
    if (!session) {
      return res.status(404).json({ error: 'Session not found or expired' });
    }
    res.json({
      sessionId: session.sessionId,
      fitScore: session.fitScore,
      jobTitle: session.jobTitle,
      matchedSkills: session.matchedSkills,
      missingSkills: session.missingSkills,
      recommendations: session.recommendations,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { analyze, getSession };

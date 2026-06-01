const mongoose = require('mongoose');

const sessionSchema = new mongoose.Schema(
  {
    sessionId: { type: String, required: true, unique: true, index: true },
    fitScore: { type: Number, required: true },
    matchedSkills: [String],
    missingSkills: [String],
    recommendations: [String],
    jobTitle: { type: String, default: '' },
    expiresAt: {
      type: Date,
      default: () => new Date(Date.now() + 60 * 60 * 1000), // 1 hour TTL
      index: { expires: 0 },
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Session', sessionSchema);

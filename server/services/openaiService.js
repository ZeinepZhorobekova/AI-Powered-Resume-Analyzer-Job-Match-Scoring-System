const OpenAI = require('openai');

const IS_MOCK = !process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY.startsWith('sk-placeholder');

const client = IS_MOCK ? null : new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

if (IS_MOCK) {
  console.log('[mock] OPENAI_API_KEY not set — running in mock mode. AI responses are simulated.');
}

// ── Mock responses (used when no real API key is present) ─────────────────────

const mockSkillProfile = (resumeText) => {
  // Extract a few words from the resume to make the mock feel dynamic
  const words = resumeText.split(/\s+/).filter(w => w.length > 4).slice(0, 5);
  return {
    skills: ['JavaScript', 'React.js', 'Node.js', 'Python', 'SQL', 'Git', 'REST APIs', 'TypeScript'],
    experience_years: 3,
    education: 'B.S. Computer Science',
    job_titles: ['Software Engineer', 'Frontend Developer'],
    summary: `Experienced software engineer with a background in full-stack web development. Proficient in JavaScript, React, and Node.js with exposure to cloud platforms. (Mock profile — resume text detected: "${words.join(' ')}...")`,
  };
};

const mockMatchResult = (skillProfile, jobDescription) => {
  const jdLower = jobDescription.toLowerCase();

  // Vary score based on how many of the candidate's skills appear in the JD
  const matched = skillProfile.skills.filter(s => jdLower.includes(s.toLowerCase()));
  const fitScore = Math.min(95, Math.max(30, 45 + matched.length * 6));

  const allJobSkills = ['Docker', 'Kubernetes', 'GraphQL', 'AWS', 'PostgreSQL', 'Redis', 'CI/CD', 'TypeScript'];
  const missing = allJobSkills.filter(s => !jdLower.includes(s.toLowerCase())).slice(0, 4);

  // Infer a rough job title from first 80 chars of JD
  const jobTitle = jobDescription.slice(0, 80).split('\n')[0].trim() || 'Software Engineer';

  return {
    fit_score: fitScore,
    job_title: jobTitle,
    matched_skills: matched.length > 0 ? matched : skillProfile.skills.slice(0, 4),
    missing_skills: missing,
    recommendations: [
      'Add quantified achievements to your experience section — e.g., "reduced page load time by 35%" rather than describing duties alone.',
      `Include any experience with ${missing[0] || 'cloud infrastructure'} in your projects section, even if it was exploratory or self-taught.`,
      'Tailor your professional summary to mirror the language in the job description — use the exact role title they advertise.',
      'Add a dedicated Skills section near the top of your resume so ATS parsers detect your qualifications immediately.',
      'If you have open-source contributions or a GitHub portfolio, add the link prominently — this role values demonstrated code output.',
    ],
  };
};

// ── Real OpenAI prompts ───────────────────────────────────────────────────────

const EXTRACT_PROMPT = (resumeText) => `
You are a resume parsing assistant. Extract a structured skill profile from the resume below.

Return ONLY valid JSON matching this schema (no markdown, no explanation):
{
  "skills": ["string"],
  "experience_years": number,
  "education": "string",
  "job_titles": ["string"],
  "summary": "string"
}

Resume:
"""
${resumeText}
"""
`.trim();

const MATCH_PROMPT = (skillProfile, jobDescription) => `
You are a senior technical recruiter. Compare the candidate skill profile against the job description and return a match analysis.

Return ONLY valid JSON matching this schema (no markdown, no explanation):
{
  "fit_score": number (0-100),
  "job_title": "string (inferred from job description)",
  "matched_skills": ["string"],
  "missing_skills": ["string"],
  "recommendations": ["string (specific, actionable resume improvement)"]
}

Rules:
- fit_score must reflect semantic alignment, not just keyword overlap
- matched_skills: skills the candidate has that appear in the job requirements
- missing_skills: skills required by the job that the candidate lacks
- recommendations: 3-5 specific, role-contextualized suggestions to improve the resume

Candidate Profile:
${JSON.stringify(skillProfile, null, 2)}

Job Description:
"""
${jobDescription}
"""
`.trim();

const parseJSON = (raw, label) => {
  try {
    return JSON.parse(raw);
  } catch {
    throw new Error(`GPT-4o returned invalid JSON for ${label}. Try again or simplify your input.`);
  }
};

// ── Exported functions ────────────────────────────────────────────────────────

const extractSkillProfile = async (resumeText) => {
  if (IS_MOCK) return mockSkillProfile(resumeText);

  const trimmed = resumeText.slice(0, 12000);
  const response = await client.chat.completions.create({
    model: 'gpt-4o',
    messages: [{ role: 'user', content: EXTRACT_PROMPT(trimmed) }],
    temperature: 0.2,
    response_format: { type: 'json_object' },
  });
  return parseJSON(response.choices[0].message.content, 'skill extraction');
};

const matchJobDescription = async (skillProfile, jobDescription) => {
  if (IS_MOCK) return mockMatchResult(skillProfile, jobDescription);

  const trimmedJD = jobDescription.slice(0, 8000);
  const response = await client.chat.completions.create({
    model: 'gpt-4o',
    messages: [{ role: 'user', content: MATCH_PROMPT(skillProfile, trimmedJD) }],
    temperature: 0.2,
    response_format: { type: 'json_object' },
  });
  return parseJSON(response.choices[0].message.content, 'job match');
};

module.exports = { extractSkillProfile, matchJobDescription, IS_MOCK };

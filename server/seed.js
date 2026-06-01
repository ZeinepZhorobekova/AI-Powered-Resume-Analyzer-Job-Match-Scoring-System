require('dotenv').config();
const mongoose = require('mongoose');
const Session = require('./models/Session');

const FAR_FUTURE = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000); // 1 year TTL for demo sessions

const SEED_SESSIONS = [
  // ── 1. Strong match — Full-Stack Engineer → React/Node role ──────────────
  {
    sessionId: 'demo-001-fullstack-strong',
    fitScore: 87,
    jobTitle: 'Senior Full-Stack Engineer',
    matchedSkills: [
      'React.js', 'Node.js', 'Express.js', 'MongoDB', 'REST APIs',
      'TypeScript', 'Git', 'Jest', 'Docker', 'AWS',
    ],
    missingSkills: ['GraphQL', 'Kubernetes', 'Redis'],
    recommendations: [
      'Add a dedicated "GraphQL" project or describe any schema-design experience on your current REST API work — the role lists it as a preferred skill.',
      'Mention any container orchestration work (Kubernetes, ECS, or Docker Compose in production) to strengthen the DevOps section of your resume.',
      'Highlight Redis caching experience if you have used it, even informally; the job description calls it out under backend infrastructure.',
      'Quantify impact on your current projects — e.g., "reduced API latency by 40%" scores higher with ATS and human reviewers than descriptions without metrics.',
    ],
    expiresAt: FAR_FUTURE,
  },

  // ── 2. Partial match — Data Analyst → Machine Learning Engineer ──────────
  {
    sessionId: 'demo-002-data-partial',
    fitScore: 61,
    jobTitle: 'Machine Learning Engineer',
    matchedSkills: [
      'Python', 'Pandas', 'NumPy', 'SQL', 'Data Visualization',
      'Scikit-learn', 'Jupyter Notebooks',
    ],
    missingSkills: [
      'PyTorch', 'TensorFlow', 'MLOps', 'Kubernetes', 'Feature Stores',
      'Model Serving', 'CI/CD for ML pipelines', 'Spark',
    ],
    recommendations: [
      'Complete and publish a project using PyTorch or TensorFlow on GitHub — the role requires hands-on deep learning framework experience that your resume currently lacks.',
      'Add an MLOps section describing any model deployment work: even a Flask API wrapping a scikit-learn model counts; document it on GitHub and link it.',
      'List any experience with large-scale data processing tools (Spark, Dask, BigQuery) under a "Big Data" skill cluster — the JD emphasizes scale.',
      'Reframe your current data analyst projects around the ML lifecycle: data collection → feature engineering → model training → evaluation, not just reporting.',
      'Consider earning a short MLOps certificate (Coursera MLOps Specialization or similar) and add it to your education section to signal pipeline maturity.',
    ],
    expiresAt: FAR_FUTURE,
  },

  // ── 3. Weak match — Junior Frontend Dev → DevOps Engineer ────────────────
  {
    sessionId: 'demo-003-frontend-weak',
    fitScore: 28,
    jobTitle: 'DevOps / Site Reliability Engineer',
    matchedSkills: ['Git', 'Linux basics', 'Bash scripting'],
    missingSkills: [
      'Kubernetes', 'Terraform', 'AWS / GCP / Azure', 'CI/CD pipelines',
      'Docker', 'Prometheus', 'Grafana', 'Ansible', 'Helm', 'Python (SRE)',
      'Incident management', 'On-call rotations',
    ],
    recommendations: [
      'This role requires a fundamentally different skill set from frontend development. Before applying, build hands-on experience with Docker and at least one cloud provider (AWS Free Tier works) and document the projects.',
      'Complete the HashiCorp Terraform Associate certification or the AWS Cloud Practitioner as a first step — these signal cloud fluency to DevOps hiring managers.',
      'Set up a personal CI/CD pipeline (GitHub Actions → Docker build → deploy to a VPS) and describe it in detail on your resume under a "Personal Projects" section.',
      'Reframe your Git and Bash experience in operational terms: e.g., "Wrote Bash scripts to automate frontend build and deployment steps" rather than listing them as generic skills.',
      'Consider applying to Frontend + DevOps hybrid roles or Platform Engineering positions where frontend context is valued alongside emerging infrastructure skills.',
    ],
    expiresAt: FAR_FUTURE,
  },

  // ── 4. Strong match — Backend Engineer → Senior Backend Engineer ─────────
  {
    sessionId: 'demo-004-backend-strong',
    fitScore: 92,
    jobTitle: 'Senior Backend Engineer (Python / FastAPI)',
    matchedSkills: [
      'Python', 'FastAPI', 'PostgreSQL', 'Redis', 'Docker',
      'AWS Lambda', 'REST APIs', 'SQLAlchemy', 'Pytest', 'Git',
      'Celery', 'Microservices', 'CI/CD',
    ],
    missingSkills: ['Kafka', 'gRPC'],
    recommendations: [
      'Add Kafka or any event-streaming experience (RabbitMQ, AWS SQS/SNS) — the role mentions async event processing as a core responsibility.',
      'Describe any inter-service communication patterns you have used; even REST-over-HTTP between microservices is relevant context if gRPC is absent.',
      'Quantify reliability metrics where possible — e.g., "maintained 99.9% uptime across 12 microservices" directly maps to the SRE expectations in this JD.',
    ],
    expiresAt: FAR_FUTURE,
  },
];

async function seed() {
  if (!process.env.MONGODB_URI) {
    console.error('\n❌  MONGODB_URI is not set.\n');
    console.error('    1. Copy server/.env.example  →  server/.env');
    console.error('    2. Fill in your MongoDB Atlas connection string and OPENAI_API_KEY');
    console.error('    3. Run:  npm run seed  (from the server/ directory)\n');
    process.exit(1);
  }

  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✓  Connected to MongoDB');

    // Upsert so running seed twice doesn't duplicate
    for (const s of SEED_SESSIONS) {
      await Session.findOneAndUpdate(
        { sessionId: s.sessionId },
        s,
        { upsert: true, new: true, setDefaultsOnInsert: true }
      );
      console.log(`✓  Seeded session: ${s.sessionId}  (score: ${s.fitScore}  |  "${s.jobTitle}")`);
    }

    console.log('\n🎉  Seed complete! Open these demo URLs in your browser:');
    const base = process.env.CLIENT_URL || 'http://localhost:5173';
    SEED_SESSIONS.forEach((s) => {
      console.log(`   ${base}/results/${s.sessionId}`);
    });
    console.log();
  } catch (err) {
    console.error('Seed failed:', err.message);
  } finally {
    await mongoose.disconnect();
  }
}

seed();

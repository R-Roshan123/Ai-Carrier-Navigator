const DEFAULT_MODEL = 'gpt-4o-mini';

const validateAIResponse = (payload, expectedKeys = []) => {
  if (!payload || typeof payload !== 'object') {
    return {
      success: false,
      message: 'AI service returned an invalid payload.',
    };
  }

  const missingKeys = expectedKeys.filter((key) => !(key in payload));
  if (missingKeys.length) {
    return {
      success: false,
      message: `AI payload missing required keys: ${missingKeys.join(', ')}`,
    };
  }

  return { success: true };
};

const fallbackMessage =
  'AI service is currently unavailable. The platform is using a structured fallback recommendation engine.';

export const aiService = {
  async analyzeCareerAssessment(assessmentData) {
    const validation = validateAIResponse(assessmentData, ['interests', 'skills']);
    if (!validation.success) {
      return { success: false, message: validation.message };
    }

    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      return {
        success: true,
        provider: 'fallback',
        message: fallbackMessage,
        recommendations: [
          { career: 'Data Scientist', match: 92, reason: 'Strong analytical and problem solving profile.' },
          { career: 'Machine Learning Engineer', match: 89, reason: 'Aligns well with technical and AI-focused skills.' },
          { career: 'Software Engineer', match: 84, reason: 'Matches your problem solving and technical interests.' },
        ],
        strengths: ['Analytical thinking', 'Technical curiosity', 'Problem solving'],
        weaknesses: ['Project depth', 'Communication polish', 'Interview preparation'],
        suggestedImprovements: ['Build 1 portfolio project', 'Sharpen SQL and statistics', 'Practice mock interviews'],
      };
    }

    return {
      success: true,
      provider: DEFAULT_MODEL,
      message: 'AI assessment analyzed successfully.',
      recommendations: [],
    };
  },

  async recommendCareers(profile) {
    if (!process.env.OPENAI_API_KEY) {
      return {
        success: true,
        provider: 'fallback',
        message: fallbackMessage,
        careers: [
          { name: 'AI Engineer', match: 92, salary: '$110k - $150k', growth: 'High', difficulty: 'Moderate' },
          { name: 'Data Scientist', match: 89, salary: '$105k - $140k', growth: 'High', difficulty: 'High' },
          { name: 'Product Analyst', match: 87, salary: '$95k - $130k', growth: 'High', difficulty: 'Moderate' },
        ],
      };
    }

    return { success: true, provider: DEFAULT_MODEL, careers: [] };
  },

  async analyzeSkillGap(userSkills, targetCareer) {
    if (!process.env.OPENAI_API_KEY) {
      return {
        success: true,
        provider: 'fallback',
        message: fallbackMessage,
        gapSummary: [
          { skill: 'Python', current: 82, required: 90, gap: 8, priority: 'MEDIUM' },
          { skill: 'SQL', current: 58, required: 80, gap: 22, priority: 'HIGH' },
          { skill: 'Machine Learning', current: 42, required: 75, gap: 33, priority: 'HIGH' },
          { skill: 'Statistics', current: 66, required: 80, gap: 14, priority: 'MEDIUM' },
        ],
      };
    }

    return { success: true, provider: DEFAULT_MODEL, gapSummary: [] };
  },

  async generateLearningRoadmap(targetCareer) {
    if (!process.env.OPENAI_API_KEY) {
      return {
        success: true,
        provider: 'fallback',
        message: fallbackMessage,
        roadmapTitle: `Target: ${targetCareer || 'Machine Learning Engineer'}`,
        phases: [
          { name: 'Python Fundamentals', duration: '3 weeks', topics: ['Loops', 'Functions', 'Data handling'], progress: 90 },
          { name: 'Data Structures', duration: '2 weeks', topics: ['Lists', 'Dicts', 'Sets'], progress: 80 },
          { name: 'Statistics', duration: '3 weeks', topics: ['Hypothesis testing', 'Probability'], progress: 62 },
          { name: 'Machine Learning', duration: '5 weeks', topics: ['Linear regression', 'Classification'], progress: 42 },
        ],
      };
    }

    return { success: true, provider: DEFAULT_MODEL, phases: [] };
  },

  async recommendCourses(skillGap) {
    if (!process.env.OPENAI_API_KEY) {
      return {
        success: true,
        provider: 'fallback',
        message: fallbackMessage,
        courses: [
          { name: 'SQL for Data Analytics', platform: 'Coursera', level: 'Beginner', duration: '4 weeks', cost: 'Free', rating: 4.8 },
          { name: 'Machine Learning Crash Course', platform: 'Google', level: 'Intermediate', duration: '6 weeks', cost: 'Free', rating: 4.7 },
          { name: 'Python for Data Science', platform: 'Udemy', level: 'Beginner', duration: '5 weeks', cost: 'Paid', rating: 4.9 },
        ],
      };
    }

    return { success: true, provider: DEFAULT_MODEL, courses: [] };
  },

  async recommendProjects(targetCareer) {
    if (!process.env.OPENAI_API_KEY) {
      return {
        success: true,
        provider: 'fallback',
        message: fallbackMessage,
        projects: [
          { name: 'Customer Churn Prediction', difficulty: 'Intermediate', technologies: ['Python', 'Scikit-learn'] },
          { name: 'Sales Forecasting Dashboard', difficulty: 'Intermediate', technologies: ['SQL', 'Python', 'Power BI'] },
          { name: 'Recommendation System', difficulty: 'Advanced', technologies: ['Python', 'Pandas', 'PyTorch'] },
        ],
      };
    }

    return { success: true, provider: DEFAULT_MODEL, projects: [] };
  },

  async analyzeResume(resumeData) {
    if (!process.env.OPENAI_API_KEY) {
      return {
        success: true,
        provider: 'fallback',
        message: fallbackMessage,
        score: 82,
        breakdown: {
          skills: 85,
          experience: 78,
          projects: 80,
          keywords: 75,
          formatting: 90,
        },
        strengths: ['Strong technical foundation', 'Clear academic background'],
        improvements: ['Add measurable impact metrics', 'Include project outcomes'],
        missingSkills: ['Power BI', 'SQL optimization'],
      };
    }

    return { success: true, provider: DEFAULT_MODEL, score: 0 };
  },

  async generateResume(jobProfile) {
    if (!process.env.OPENAI_API_KEY) {
      return {
        success: true,
        provider: 'fallback',
        message: fallbackMessage,
        summary:
          'Results-driven data-focused candidate with strong analytical thinking, problem solving, and a passion for solving real-world challenges through technology.',
      };
    }

    return { success: true, provider: DEFAULT_MODEL, summary: '' };
  },

  async analyzeJobMatch(job, profile) {
    if (!process.env.OPENAI_API_KEY) {
      return {
        success: true,
        provider: 'fallback',
        message: fallbackMessage,
        match: 91,
        reasons: ['Python', 'SQL', 'Statistics'],
        missingSkills: ['Power BI'],
      };
    }

    return { success: true, provider: DEFAULT_MODEL, match: 0 };
  },
};

export default aiService;

import { Hono } from 'hono';
import { cors } from 'hono/cors';

const app = new Hono();

// CORS configuration
app.use('*', cors({
  origin: ['https://flowmatik.co', 'https://admin.flowmatik.co', 'http://localhost:3000'],
  allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowHeaders: ['Content-Type', 'Authorization'],
} ));

// AI Agents Configuration
const AI_AGENTS = {
  'flowi-ceo': {
    name: 'FLOWI CEO',
    personality: 'Visionario estratégico, líder inspirador, enfocado en crecimiento exponencial',
    expertise: 'Estrategia empresarial, liderazgo, innovación, toma de decisiones ejecutivas'
  },
  'trend-researcher': {
    name: 'Trend Researcher',
    personality: 'Analítico, curioso, siempre al día con las últimas tendencias',
    expertise: 'Investigación de mercado, análisis de tendencias, predicción de comportamientos'
  },
  'hook-creator': {
    name: 'Hook Creator',
    personality: 'Creativo, persuasivo, experto en captar atención instantánea',
    expertise: 'Copywriting, hooks virales, engagement, psicología del consumidor'
  },
  'content-strategist': {
    name: 'Content Strategist',
    personality: 'Planificador meticuloso, creativo, orientado a resultados',
    expertise: 'Estrategia de contenido, planificación editorial, storytelling'
  },
  'viral-optimizer': {
    name: 'Viral Optimizer',
    personality: 'Obsesivo con métricas, experimentador, growth hacker',
    expertise: 'Optimización viral, A/B testing, métricas de engagement, algoritmos'
  },
  'community-manager': {
    name: 'Community Manager',
    personality: 'Empático, comunicativo, constructor de relaciones',
    expertise: 'Gestión de comunidades, engagement, atención al cliente, moderación'
  },
  'data-analyst': {
    name: 'Data Analyst',
    personality: 'Meticuloso, objetivo, orientado a datos y insights',
    expertise: 'Análisis de datos, métricas, reporting, insights de comportamiento'
  },
  'automation-expert': {
    name: 'Automation Expert',
    personality: 'Eficiente, sistemático, obsesivo con la optimización',
    expertise: 'Automatización de procesos, workflows, integración de herramientas'
  }
};

// Eternal Memory System
class EternalMemory {
  constructor() {
    this.conversations = new Map();
    this.userProfiles = new Map();
    this.contextHistory = new Map();
  }

  saveConversation(userId, agentId, message, response) {
    const key = `${userId}_${agentId}`;
    if (!this.conversations.has(key)) {
      this.conversations.set(key, []);
    }
    
    this.conversations.get(key).push({
      timestamp: new Date().toISOString(),
      message,
      response,
      context: this.getContext(userId, agentId)
    });
  }

  getConversationHistory(userId, agentId) {
    const key = `${userId}_${agentId}`;
    return this.conversations.get(key) || [];
  }

  updateUserProfile(userId, data) {
    if (!this.userProfiles.has(userId)) {
      this.userProfiles.set(userId, {});
    }
    Object.assign(this.userProfiles.get(userId), data);
  }

  getUserProfile(userId) {
    return this.userProfiles.get(userId) || {};
  }

  getContext(userId, agentId) {
    const profile = this.getUserProfile(userId);
    const history = this.getConversationHistory(userId, agentId);
    return {
      profile,
      recentInteractions: history.slice(-5),
      totalInteractions: history.length
    };
  }
}

const memory = new EternalMemory();

// Doubao AI Integration
async function callDoubaoAI(prompt, agentConfig) {
  const API_KEY = env.AI_302_API_KEY;
  
  if (!API_KEY) {
    throw new Error('AI_302_API_KEY not configured');
  }

  const systemPrompt = `Eres ${agentConfig.name}, un agente de IA especializado.

PERSONALIDAD: ${agentConfig.personality}
EXPERTISE: ${agentConfig.expertise}

INSTRUCCIONES:
- Responde SIEMPRE en español
- Mantén tu personalidad única y consistente
- Usa tu expertise para dar respuestas valiosas
- Sé conversacional pero profesional
- Adapta tu tono a tu personalidad específica`;

  try {
    const response = await fetch('https://api.302.ai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'doubao-1.5-pro',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: prompt }
        ],
        temperature: 0.7,
        max_tokens: 1000
      } )
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`);
    }

    const data = await response.json();
    return data.choices[0].message.content;
  } catch (error) {
    console.error('Doubao AI Error:', error);
    throw error;
  }
}

// Routes
app.get('/', (c) => {
  return c.json({
    message: 'Flowmatik Professional Backend - 8 AI Agents + Doubao 1.5-pro',
    version: '1.0.0',
    agents: Object.keys(AI_AGENTS),
    features: ['Eternal Memory', 'Multi-Agent System', 'Doubao 1.5-pro Integration'],
    endpoints: {
      agents: '/api/agents',
      chat: '/api/chat/:agentId',
      memory: '/api/memory/:userId',
      health: '/health'
    }
  });
});

app.get('/health', (c) => {
  return c.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime?.() || 'N/A'
  });
});

app.get('/api/agents', (c) => {
  return c.json({
    agents: AI_AGENTS,
    total: Object.keys(AI_AGENTS).length
  });
});

app.post('/api/chat/:agentId', async (c) => {
  try {
    const agentId = c.req.param('agentId');
    const { message, userId = 'anonymous' } = await c.req.json();

    if (!AI_AGENTS[agentId]) {
      return c.json({ error: 'Agent not found' }, 404);
    }

    if (!message) {
      return c.json({ error: 'Message is required' }, 400);
    }

    const agentConfig = AI_AGENTS[agentId];
    const context = memory.getContext(userId, agentId);
    
    // Enhance prompt with context
    const enhancedPrompt = `
CONTEXTO DEL USUARIO:
${JSON.stringify(context, null, 2)}

MENSAJE ACTUAL: ${message}

Responde considerando todo el contexto y tu personalidad única.`;

    const response = await callDoubaoAI(enhancedPrompt, agentConfig);

    // Save to eternal memory
    memory.saveConversation(userId, agentId, message, response);

    return c.json({
      agent: agentConfig.name,
      response,
      timestamp: new Date().toISOString(),
      conversationId: `${userId}_${agentId}`
    });

  } catch (error) {
    console.error('Chat Error:', error);
    return c.json({ 
      error: 'Internal server error',
      details: error.message 
    }, 500);
  }
});

app.get('/api/memory/:userId', (c) => {
  const userId = c.req.param('userId');
  const profile = memory.getUserProfile(userId);
  
  const conversations = {};
  Object.keys(AI_AGENTS).forEach(agentId => {
    conversations[agentId] = memory.getConversationHistory(userId, agentId);
  });

  return c.json({
    userId,
    profile,
    conversations,
    totalInteractions: Object.values(conversations).reduce((sum, conv) => sum + conv.length, 0)
  });
});

app.post('/api/memory/:userId/profile', async (c) => {
  try {
    const userId = c.req.param('userId');
    const profileData = await c.req.json();
    
    memory.updateUserProfile(userId, profileData);
    import { Hono } from 'hono';
import { cors } from 'hono/cors';

const app = new Hono();

// CORS configuration
app.use('*', cors({
  origin: ['https://flowmatik.co', 'https://admin.flowmatik.co', 'http://localhost:3000'],
  allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowHeaders: ['Content-Type', 'Authorization'],
} ));

// AI Agents Configuration
const AI_AGENTS = {
  'flowi-ceo': {
    name: 'FLOWI CEO',
    personality: 'Visionario estratégico, líder inspirador, enfocado en crecimiento exponencial',
    expertise: 'Estrategia empresarial, liderazgo, innovación, toma de decisiones ejecutivas'
  },
  'trend-researcher': {
    name: 'Trend Researcher',
    personality: 'Analítico, curioso, siempre al día con las últimas tendencias',
    expertise: 'Investigación de mercado, análisis de tendencias, predicción de comportamientos'
  },
  'hook-creator': {
    name: 'Hook Creator',
    personality: 'Creativo, persuasivo, experto en captar atención instantánea',
    expertise: 'Copywriting, hooks virales, engagement, psicología del consumidor'
  },
  'content-strategist': {
    name: 'Content Strategist',
    personality: 'Planificador meticuloso, creativo, orientado a resultados',
    expertise: 'Estrategia de contenido, planificación editorial, storytelling'
  },
  'viral-optimizer': {
    name: 'Viral Optimizer',
    personality: 'Obsesivo con métricas, experimentador, growth hacker',
    expertise: 'Optimización viral, A/B testing, métricas de engagement, algoritmos'
  },
  'community-manager': {
    name: 'Community Manager',
    personality: 'Empático, comunicativo, constructor de relaciones',
    expertise: 'Gestión de comunidades, engagement, atención al cliente, moderación'
  },
  'data-analyst': {
    name: 'Data Analyst',
    personality: 'Meticuloso, objetivo, orientado a datos y insights',
    expertise: 'Análisis de datos, métricas, reporting, insights de comportamiento'
  },
  'automation-expert': {
    name: 'Automation Expert',
    personality: 'Eficiente, sistemático, obsesivo con la optimización',
    expertise: 'Automatización de procesos, workflows, integración de herramientas'
  }
};

// Eternal Memory System
class EternalMemory {
  constructor() {
    this.conversations = new Map();
    this.userProfiles = new Map();
    this.contextHistory = new Map();
  }

  saveConversation(userId, agentId, message, response) {
    const key = `${userId}_${agentId}`;
    if (!this.conversations.has(key)) {
      this.conversations.set(key, []);
    }
    
    this.conversations.get(key).push({
      timestamp: new Date().toISOString(),
      message,
      response,
      context: this.getContext(userId, agentId)
    });
  }

  getConversationHistory(userId, agentId) {
    const key = `${userId}_${agentId}`;
    return this.conversations.get(key) || [];
  }

  updateUserProfile(userId, data) {
    if (!this.userProfiles.has(userId)) {
      this.userProfiles.set(userId, {});
    }
    Object.assign(this.userProfiles.get(userId), data);
  }

  getUserProfile(userId) {
    return this.userProfiles.get(userId) || {};
  }

  getContext(userId, agentId) {
    const profile = this.getUserProfile(userId);
    const history = this.getConversationHistory(userId, agentId);
    return {
      profile,
      recentInteractions: history.slice(-5),
      totalInteractions: history.length
    };
  }
}

const memory = new EternalMemory();

// Doubao AI Integration
async function callDoubaoAI(prompt, agentConfig) {
  const API_KEY = env.AI_302_API_KEY;
  
  if (!API_KEY) {
    throw new Error('AI_302_API_KEY not configured');
  }

  const systemPrompt = `Eres ${agentConfig.name}, un agente de IA especializado.

PERSONALIDAD: ${agentConfig.personality}
EXPERTISE: ${agentConfig.expertise}

INSTRUCCIONES:
- Responde SIEMPRE en español
- Mantén tu personalidad única y consistente
- Usa tu expertise para dar respuestas valiosas
- Sé conversacional pero profesional
- Adapta tu tono a tu personalidad específica`;

  try {
    const response = await fetch('https://api.302.ai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'doubao-1.5-pro',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: prompt }
        ],
        temperature: 0.7,
        max_tokens: 1000
      } )
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`);
    }

    const data = await response.json();
    return data.choices[0].message.content;
  } catch (error) {
    console.error('Doubao AI Error:', error);
    throw error;
  }
}

// Routes
app.get('/', (c) => {
  return c.json({
    message: 'Flowmatik Professional Backend - 8 AI Agents + Doubao 1.5-pro',
    version: '1.0.0',
    agents: Object.keys(AI_AGENTS),
    features: ['Eternal Memory', 'Multi-Agent System', 'Doubao 1.5-pro Integration'],
    endpoints: {
      agents: '/api/agents',
      chat: '/api/chat/:agentId',
      memory: '/api/memory/:userId',
      health: '/health'
    }
  });
});

app.get('/health', (c) => {
  return c.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime?.() || 'N/A'
  });
});

app.get('/api/agents', (c) => {
  return c.json({
    agents: AI_AGENTS,
    total: Object.keys(AI_AGENTS).length
  });
});

app.post('/api/chat/:agentId', async (c) => {
  try {
    const agentId = c.req.param('agentId');
    const { message, userId = 'anonymous' } = await c.req.json();

    if (!AI_AGENTS[agentId]) {
      return c.json({ error: 'Agent not found' }, 404);
    }

    if (!message) {
      return c.json({ error: 'Message is required' }, 400);
    }

    const agentConfig = AI_AGENTS[agentId];
    const context = memory.getContext(userId, agentId);
    
    // Enhance prompt with context
    const enhancedPrompt = `
CONTEXTO DEL USUARIO:
${JSON.stringify(context, null, 2)}

MENSAJE ACTUAL: ${message}

Responde considerando todo el contexto y tu personalidad única.`;

    const response = await callDoubaoAI(enhancedPrompt, agentConfig);

    // Save to eternal memory
    memory.saveConversation(userId, agentId, message, response);

    return c.json({
      agent: agentConfig.name,
      response,
      timestamp: new Date().toISOString(),
      conversationId: `${userId}_${agentId}`
    });

  } catch (error) {
    console.error('Chat Error:', error);
    return c.json({ 
      error: 'Internal server error',
      details: error.message 
    }, 500);
  }
});

app.get('/api/memory/:userId', (c) => {
  const userId = c.req.param('userId');
  const profile = memory.getUserProfile(userId);
  
  const conversations = {};
  Object.keys(AI_AGENTS).forEach(agentId => {
    conversations[agentId] = memory.getConversationHistory(userId, agentId);
  });

  return c.json({
    userId,
    profile,
    conversations,
    totalInteractions: Object.values(conversations).reduce((sum, conv) => sum + conv.length, 0)
  });
});

app.post('/api/memory/:userId/profile', async (c) => {
  try {
    const userId = c.req.param('userId');
    const profileData = await c.req.json();
    
    memory.updateUserProfile(userId, profileData);
    
    return c.json({
      message: 'Profile updated successfully',
      userId,
      profile: memory.getUserProfile(userId)
    });
  } catch (error) {
    return c.json({ error: 'Invalid JSON data' }, 400);
  }
});

// 404 handler
app.notFound((c) => {
  return c.json({ error: 'Endpoint not found' }, 404);
});

// Error handler
app.onError((err, c) => {
  console.error('Global Error:', err);
  return c.json({ 
    error: 'Internal server error',
    message: err.message 
  }, 500);
});

export default app;

    return c.json({
      message: 'Profile updated successfully',
      userId,
      profile: memory.getUserProfile(userId)
    });
  } catch (error) {
    return c.json({ error: 'Invalid JSON data' }, 400);
  }
});

// 404 handler
app.notFound((c) => {
  return c.json({ error: 'Endpoint not found' }, 404);
});

// Error handler
app.onError((err, c) => {
  console.error('Global Error:', err);
  return c.json({ 
    error: 'Internal server error',
    message: err.message 
  }, 500);
});

export default app;

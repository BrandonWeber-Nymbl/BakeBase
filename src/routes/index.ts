import { Router } from 'express';
import { IngredientController } from '../controllers/ingredient.controller';
import { CategoryController } from '../controllers/category.controller';
import { DocsController } from '../controllers/docs.controller';
import { KeysController } from '../controllers/keys.controller';
import { openApiSpec } from '../middleware/openapi';
import { agentManifest } from '../config/agent-manifest';
import { requireApiKey } from '../middleware/auth';
import { keyProvisioningLimiter } from '../middleware/rateLimit';

const router = Router();

// Root route
router.get('/', (_req, res) => {
  res.json({
    service: 'BakeBase',
    description: 'AI-first food science reference API for baking ingredients',
    version: '1.0.0',
    status: 'healthy',
    links: {
      agents: '/agents',
      ingredients: '/ingredients',
      categories: '/categories',
      combine: '/ingredients/combine',
      docs: '/docs/openapi.json',
      manifest: '/.well-known/agent-manifest.json',
      health: '/health',
      api_keys: '/dashboard/keys',
    },
    meta: {
      description:
        'BakeBase root. If you are an AI agent, start at /agents for usage guidance or /ingredients to browse the ingredient database.',
    },
  });
});

// AgentManifest endpoint - MUST be served at /.well-known/agent-manifest.json
router.get('/.well-known/agent-manifest.json', (_req, res) => {
  res.json(agentManifest);
});

// Health check
router.get('/health', DocsController.healthCheck);

// Agent guide
router.get('/agents', DocsController.getAgentGuide);

// OpenAPI spec
router.get('/docs/openapi.json', (_req, res) => {
  res.json(openApiSpec);
});

// Key provisioning (public - validator expects 200 from key_provisioning_url)
router.get('/dashboard/keys', KeysController.getDashboard);
router.post('/dashboard/keys', keyProvisioningLimiter, KeysController.createKey);
router.post('/api/keys', keyProvisioningLimiter, KeysController.createKeyJson);

// Protected endpoints (require API key)
router.get('/ingredients/search', requireApiKey, IngredientController.search);
router.get('/ingredients/:id', requireApiKey, IngredientController.getById);
router.get('/ingredients', requireApiKey, IngredientController.getAll);
router.post('/ingredients/combine', requireApiKey, IngredientController.combine);
router.get('/categories', requireApiKey, CategoryController.getAll);

export default router;

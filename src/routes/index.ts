import { Router } from 'express';
import { IngredientController } from '../controllers/ingredient.controller';
import { CategoryController } from '../controllers/category.controller';
import { DocsController } from '../controllers/docs.controller';
import { openApiSpec } from '../middleware/openapi';
import { agentManifest } from '../config/agent-manifest';

const router = Router();

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

// Ingredients endpoints
router.get('/ingredients/search', IngredientController.search);
router.get('/ingredients/:id', IngredientController.getById);
router.get('/ingredients', IngredientController.getAll);
router.post('/ingredients/combine', IngredientController.combine);

// Categories
router.get('/categories', CategoryController.getAll);

export default router;

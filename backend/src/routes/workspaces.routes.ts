import express from 'express';
import { WorkspaceController } from '../controllers/workspaces.controller';

const router = express.Router();

// POST /create workspace and workspace members
router.post('/', (req, res) => {
    WorkspaceController.createWorkspace(req, res);
});

router.get('/allworkspaces', (req, res) => {
    WorkspaceController.getAllWorkspaces(req, res)
});

router.get('/current/:userId', (req, res) => {
    WorkspaceController.getCurrentWorkspace(req, res)
})


export default router;


import { Router } from 'express';
import TeamsController from '../controllers/teams.controllers';

const router = Router();

const teamsController = new TeamsController();

router.get('/', teamsController.getTeams);
router.get('/:id', teamsController.getTeam);
router.post('/', teamsController.createTeam);
router.put('/:id', teamsController.updateTeam);
router.put('/fields/:id', teamsController.updateTeamsFields);
router.delete('/fields/:id', teamsController.deleteTeamsFields);
router.delete('/:id', teamsController.deleteTeam);

export default router;

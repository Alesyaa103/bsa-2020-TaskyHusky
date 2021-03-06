import { Router } from 'express';
import TeammatesController from '../controllers/teammates.controllers';
import UserController from '../controllers/user.controllers';

const router = Router();
const teammatesController = new TeammatesController();

router.get('/:id/incoming-invites', teammatesController.getIncomingInvitation);
router.post('/:id/incoming-invites', teammatesController.changeInviteStatus);
router.get('/:id/pending-invites', teammatesController.getPendingInvitation);
router.get('/:id/teammates', teammatesController.getTeammates);
router.post('/:id/pending-invites', teammatesController.createInvite);
router.post('/search', teammatesController.getOneTeammate);

export default router;

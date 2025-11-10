import { Router} from 'express';

import { CreateStudentController } from './Controllers/Student/CreateStudentController'
import { AuthStudentController } from './Controllers/Student/AuthStudentController'
import { DeleteUserController } from './Controllers/Student/DeleteStudentController';
import { UpdateUserController } from './Controllers/Student/UpdateStudentController';
import { AuthAdminController } from './Controllers/Admin/AuthAdminController';
import { AuthController } from './Controllers/Auth/AuthController';
import { checkAdmin } from './middlewares/checkIsAdmin';
import { isAuthenticated } from './middlewares/isAuthenticated';
import { CreateQrcodeController } from './Controllers/Qrcode/CreateQrcodeController'

const router = Router();

// router.get('/alunos', new CreateStudentController().handle)
router.post('/alunos', isAuthenticated, checkAdmin, new CreateStudentController().handle)
// router.get('/alunos/:id', new CreateStudentController().handle)
// router.put('/alunos/:id', new CreateStudentController().handle)
// router.delete('/alunos/:id', new CreateStudentController().handle)
router.get('/auth/user', isAuthenticated, new AuthController().handle )
router.post('/qrcode', isAuthenticated, new CreateQrcodeController().handle)
router.get('/presenca/relatorio', isAuthenticated, new CreateQrcodeController().handleRelatorioPresenca)
router.post('/qrcode/chamada', isAuthenticated, checkAdmin, new CreateQrcodeController().handleChamadaDaPresenca)
router.post('/presenca/manual', isAuthenticated, checkAdmin, new CreateQrcodeController().handlePresencaManual)
router.get('/alunos/presencas', isAuthenticated, checkAdmin, new CreateQrcodeController().handleListagemAlunosPresencas)


router.post('/login/aluno', new AuthStudentController().handle)
router.post('/login/admin', new AuthAdminController().handle)



export { router };

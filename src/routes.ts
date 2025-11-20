import { Router} from 'express';

import { CreateStudentController } from './Controllers/Student/CreateStudentController'
import { UpdateStudentController } from './Controllers/Student/UpdateStudentController'
import { DeleteStudentController } from './Controllers/Student/DeleteStudentController'
import { AuthStudentController } from './Controllers/Student/AuthStudentController'
import { AuthAdminController } from './Controllers/Admin/AuthAdminController';
import { AuthController } from './Controllers/Auth/AuthController';
import { checkAdmin } from './middlewares/checkIsAdmin';
import { isAuthenticated } from './middlewares/isAuthenticated';
import { CreateQrcodeController } from './Controllers/Qrcode/CreateQrcodeController'
import { ReadStudentController } from './Controllers/Student/ReadStudentController';
import { AuthProfController } from './Controllers/Professor/AuthProfController';
import { CreateProfessorController } from './Controllers/Professor/CreateProfController';
import { ListProfController } from './Controllers/Professor/ListProfController';
import { UpdateProfController } from './Controllers/Professor/UpdateProfController';
import { DeleteProfController } from './Controllers/Professor/DeleteProfController';
import { checkProfessor } from './middlewares/checkIsProfessor';

const router = Router();

//rotas de aluno
router.post('/login/aluno', new AuthStudentController().handle)
router.get('/qrcode', isAuthenticated, new CreateQrcodeController().handle)
router.get('/presenca/relatorio', isAuthenticated, new CreateQrcodeController().handleRelatorioPresenca)
//rotas de professor
router.post('/login/professor', new AuthProfController().handle)
router.post('/presenca/manual', isAuthenticated, checkProfessor, new CreateQrcodeController().handlePresencaManual)
router.post('/qrcode/chamada', isAuthenticated, checkAdmin, new CreateQrcodeController().handleChamadaDaPresenca)
//rotas de admin
router.post('/login/admin', new AuthAdminController().handle)
router.post('/alunos', isAuthenticated, checkAdmin, new CreateStudentController().handle)
router.post('/professores', isAuthenticated, checkAdmin, new CreateProfessorController().handle)
router.put('/professores/:id', isAuthenticated, checkAdmin, new UpdateProfController().handle)
router.delete('/professores/:id', isAuthenticated, checkAdmin, new DeleteProfController().handle)
router.put('/alunos/:id', isAuthenticated, checkAdmin, new UpdateStudentController().handle)
router.delete('/alunos/:id', isAuthenticated, checkAdmin, new DeleteStudentController().handle)
router.get('/alunos/presencas', isAuthenticated, checkAdmin, new CreateQrcodeController().handleListagemAlunosPresencas)
router.get('/students', new ReadStudentController().handle)
router.get('/professores', new ListProfController().handle)

router.get('/auth/user', isAuthenticated, new AuthController().handle )


export { router };
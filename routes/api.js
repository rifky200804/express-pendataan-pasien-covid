import  express  from "express"
const router = express.Router()
import middleware from "../utils/middleware.js"

import AuthController from '../controllers/AuthController.js'
router.post('/login',AuthController.login)
router.post('/register',AuthController.register)

import PatientController from '../controllers/PatientController.js'
router.get('/patients',middleware.auth,PatientController.index)
router.post('/patients',middleware.auth,PatientController.create)
router.get('/patients/:id',middleware.auth,PatientController.detail)
router.put('/patients/:id',middleware.auth,PatientController.update)
router.delete('/patients/:id',middleware.auth,PatientController.delete)

export default router;
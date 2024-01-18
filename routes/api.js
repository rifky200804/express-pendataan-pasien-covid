import  express  from "express"
const router = express.Router()
import middleware from "../utils/middleware.js"

import AuthController from '../controllers/AuthController.js'

/**
 * @swagger
 * tags:
 *   name: Authentication
 *   description: Authentication API
 */

/**
 * @swagger
 *  /login:
 *    post:
 *      summary: Login to the Pendataan Pasien Covid
 *      tags: [Authentication]
 *      requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                username:
 *                  type: string
 *                  description: The username.
 *                password:
 *                  type: string
 *                  description: The password.
 *              example:
 *                username: username
 *                password: password
 *      responses:
 *        '200':
 *          description: Successfully login
 *          content:
 *            application/json:
 *              example:
 *                username: username,
 *                token : token
 *        '400':
 *          description: Bad Request
 *        '401':
 *          description: Unauthorized
 *        '422':
 *          description: Unprocessable Entity
 */
router.post('/login',AuthController.login)

/**
 * @swagger
 *  /register:
 *    post:
 *      summary: Register admin For Pendataan Pasien Covid
 *      tags: [Authentication]
 *      requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                username:
 *                  type: string
 *                  description: The username.
 *                email:
 *                  type: string
 *                  description: The email.
 *                password:
 *                  type: string
 *                  description: The password.
 *              example:
 *                username: raka
 *                email: raka@gmail.com
 *                password: secret123
 *      responses:
 *        '201':
 *          description: Successfully registered
 *          content:
 *            application/json:
 *              example:
 *                id: 1
 *                username: raka
 *                email: raka@gmail.com
 *        '400':
 *          description: Bad Request
 *        '422':
 *          description: Unprocessable Entity
 */
router.post('/register',AuthController.register)

import PatientController from '../controllers/PatientController.js'
/**
 * @swagger
 * tags:
 *   name: Patient
 *   description: Patient API
 */

/**
 * @swagger
 * /patients:
 *   get:
 *     security:
 *       - BearerAuth: []
 *     summary: Get a list of patients
 *     tags: [Patient]
 *     description: Retrieve a list of patients with optional filtering and pagination.
 *     parameters:
 *       - name: page[number]
 *         in: query
 *         description: Page number for pagination
 *         required: false
 *         schema:
 *           type: integer
 *           format: int32
 *       - name: page[limit]
 *         in: query
 *         description: Page Limit for pagination
 *         required: false
 *         schema:
 *           type: integer
 *           format: int32
 *       - name: filter[name]
 *         in: query
 *         description: Filter name for patients
 *         required: false
 *         schema:
 *           type: string
 *       - name: filter[address]
 *         in: query
 *         description: Filter address for patients
 *         required: false
 *         schema:
 *           type: string
 *       - name: filter[status]
 *         in: query
 *         description: Filter status for patients
 *         required: false
 *         schema:
 *           type: string
 *       - name: sort
 *         in: query
 *         description: Sort order for patients
 *         required: false
 *         schema:
 *           type: string
 *           enum: [tanggal_masuk, tanggal_keluar, address]
 *       - name: order
 *         in: query
 *         description: Order (asc or desc) for sorting
 *         required: false
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *     responses:
 *       200:
 *         description: A list of patients
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *               data: []
 *               page:
 *                 pageLimit: 10
 *                 pageNumber: 1
 *                 totalData: 0
 *                 totalPages: 0
 *               message: Successfully Get Data
 *       500:
 *         description: Internal Server Error
 */
router.get('/patients',middleware.auth,PatientController.index)

/**
 * @swagger
 * /patients:
 *   post:
 *     security:
 *      - BearerAuth: []
 *     summary: Create a new patient
 *     tags: [Patient]
 *     description: Create a new patient with the provided data.
 *     requestBody:
 *       content:
 *         application/json:
 *           example:
 *             name: Unity
 *             phone: 9784289471
 *             address: Street no 90
 *             status: positif/sembuh/meniggal
 *             inDateAt: 2022-01-01
 *             outDateAt: 2022-01-10
 *     responses:
 *       201:
 *         description: Patient created successfully
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *               data: {}
 *               message: Successfully created patient
 *       422:
 *         description: Validation error
 *         content:
 *           application/json:
 *             example:
 *               success: false
 *               errors: [{ name: 'Name is required' },{phone: 'Phone is required'},{status: 'Status is required'},{inDateAt: 'inDateAt is required'}]
 */
router.post('/patients',middleware.auth,PatientController.create)

/**
 * @swagger
 * /patients/{id}:
 *   get:
 *     security:
 *      - BearerAuth: []
 *     summary: Get details of a patient
 *     tags: [Patient]
 *     description: details of a specific patient by ID.
 *     parameters:
 *       - name: id
 *         in: path
 *         description: ID of the patient
 *         required: true
 *     responses:
 *       200:
 *         description: Details of the patient
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *               data: {}
 *               message: Successfully get data
 *       404:
 *         description: Patient not found
 *         content:
 *           application/json:
 *             example:
 *               errors: []
 *               message: Patient not found
 */
router.get('/patients/:id',middleware.auth,PatientController.detail)

/**
 * @swagger
 * /patients/{id}:
 *   put:
 *     security:
 *      - BearerAuth: []
 *     summary: Update a patient
 *     tags: [Patient]
 *     description: Update a specific patient by ID with the provided data.
 *     parameters:
 *       - name: id
 *         in: path
 *         description: ID of the patient
 *         required: true
 *     requestBody:
 *       content:
 *         application/json:
 *           example:
 *             name: Updated Name
 *             phone: 987654321
 *             address:  Street
 *             status: positif/sembuh/meniggal
 *             inDateAt: 2022-01-01
 *             outDateAt: 2022-01-15
 *     responses:
 *       200:
 *         description: Patient updated successfully
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *               data: {}
 *               message: Successfully updated patient
 *       404:
 *         description: Patient not found
 *         content:
 *           application/json:
 *             example:
 *               success: false
 *               message: Patient not found
 *       422:
 *         description: Validation error
 *         content:
 *           application/json:
 *             example:
 *               message: There must be 1 column updated
 *               errors: []
 */
router.put('/patients/:id',middleware.auth,PatientController.update)

/**
 * @swagger
 * /patients/{id}:
 *   delete:
 *     security:
 *      - BearerAuth: []
 *     summary: Delete a patient
 *     tags: [Patient]
 *     description: Delete a specific patient by ID.
 *     parameters:
 *       - name: id
 *         in: path
 *         description: ID of the patient
 *         required: true
 *     responses:
 *       200:
 *         description: Patient deleted successfully
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *               data: {}
 *               message: Successfully deleted patient
 *       404:
 *         description: Patient not found
 *         content:
 *           application/json:
 *             example:
 *               errors: {}
 *               message: Patient not found
 */
router.delete('/patients/:id',middleware.auth,PatientController.delete)

export default router;
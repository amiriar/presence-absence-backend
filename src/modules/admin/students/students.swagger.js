/**
 * @swagger
 * tags:
 *  name: Students (AdminPanel)
 *  description: Students (AdminPanel) module and routes
 */

/**
 * @swagger
 * tags:
 *  name: Logs (AdminPanel)
 *  description: Logs (AdminPanel) module and routes
 */

/**
 * @swagger
 *  components:
 *      schemas:
 *         UpdateStudent:
 *           type: object
 *           properties:
 *             firstName:
 *               type: string
 *               description: First name of the student
 *             lastName:
 *               type: string
 *               description: Last name of the student
 *             nationalCode:
 *               type: string
 *               description: National code of the student
 *             email:
 *               type: string
 *               description: Email of the student
 *             age:
 *               type: number
 *               description: Age of the student
 *             job:
 *               type: string
 *               description: Job title of the student
 *             phoneNumber:
 *               type: string
 *               description: Phone number of the student
 *             education:
 *               type: string
 *               description: Education level or background of the student
 *             isStudent:
 *               type: boolean
 *               description: Indicator whether the person is a student
 *             profile:
 *               type: string
 *               format: binary
 *               description: Profile image of the student uploaded as a file
 *             description:
 *               type: string
 *               description: Brief description of the student
 *             linkedin:
 *               type: string
 *               description: LinkedIn profile URL of the student
 *             pinterest:
 *               type: string
 *               description: Pinterest profile URL of the student
 *             twitterX:
 *               type: string
 *               description: Twitter handle of the student
 *             facebook:
 *               type: string
 *               description: Facebook profile URL of the student
 */

/**
 * @swagger
 *  /api/admin/students/logs/day:
 *    get:
 *      tags:
 *        - Logs (AdminPanel)
 *      summary: Get today's student logs
 *      responses:
 *        200:
 *          description: Successful operation
 */

/**
 * @swagger
 *  /api/admin/students/logs/month:
 *    get:
 *      tags:
 *        - Logs (AdminPanel)
 *      summary: Get this month's student logs
 *      responses:
 *        200:
 *          description: Successful operation
 */

/**
 * @swagger
 *  /api/admin/students/logs/{nationalCode}:
 *    get:
 *      tags:
 *        - Logs (AdminPanel)
 *      summary: Get this month's student logs
 *      parameters:
 *        - name: nationalCode
 *          in: path
 *          required: true
 *          description: national code of the student
 *      responses:
 *        200:
 *          description: Successful operation
 */

/**
 * @swagger
 *  /api/admin/students/all:
 *    get:
 *      tags:
 *        - Students (AdminPanel)
 *      summary: Get all students
 *      responses:
 *        200:
 *          description: Successful operation
 */

/**
 * @swagger
 *  /api/admin/students/student/{nationalCode}:
 *    get:
 *      tags:
 *        - Students (AdminPanel)
 *      summary: Get student data by national code
 *      parameters:
 *        - name: nationalCode
 *          in: path
 *          required: true
 *          description: National code of the student
 *          schema:
 *            type: string
 *      responses:
 *        200:
 *          description: Successful operation
 */

/**
 * @swagger
 *  /api/admin/students/change/{pcId}:
 *    post:
 *      tags:
 *        - Students (AdminPanel)
 *      summary: Change student data by PC ID
 *      parameters:
 *        - name: pcId
 *          in: path
 *          required: true
 *          description: PC ID of the student
 *          schema:
 *            type: string
 *      requestBody:
 *        required: true
 *        content:
 *          multipart/form-data:
 *            schema:
 *              $ref: '#/components/schemas/UpdateStudent'
 *      responses:
 *        200:
 *          description: Successful operation
 */

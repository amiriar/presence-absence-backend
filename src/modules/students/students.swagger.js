/**
 * @swagger
 * tags:
 *  name: Auth
 *  description: Auth module and routes
 */

/**
 * @swagger
 *  components:
 *   schemas:
 *    register:
 *     type: object
 *     required:
 *      -  username
 *      -  password
 *      -  pcId
 *      -  course
 *     properties: 
 *      username:
 *       type: string
 *      email:
 *       type: string
 *      password:
 *       type: string
 *      course:
 *       type: string
 *  
 *    login:
 *     type: object
 *     required:
 *      -  username
 *      -  password
 *      -  pcId
 *      -  course
 *     properties: 
 *      username:
 *       type: string
 *      email:
 *       type: string
 *      password:
 *       type: string
 *      course:
 *       type: string
 */

/**
 * @swagger
 * 
 * /api/auth/register:
 *  post:
 *   summary: register for users
 *   tags:
 *      - Auth
 *   requestBody:
 *    content:
 *     application/x-www-form-urlencoded:
 *      schema:
 *       $ref: '#/components/schemas/register'
 *   responses:
 *    200:
 *     description: success
 */

/**
 * @swagger
 * 
 * /api/auth/login:
 *  post:
 *   summary: login for users
 *   tags:
 *    - Auth
 *   requestBody:
 *    content:
 *     application/x-www-form-urlencoded:
 *      schema:
 *       $ref: '#/components/schemas/login'
 *     application/json:
 *      schema:
 *       $ref: '#/components/schemas/login'
 *   responses:
 *    200:
 *     description: success
 */

/**
 * @swagger
 * 
 * /api/auth/logout:
 *  get:
 *   summary: logout user
 *   tags:
 *    - Auth
 *   responses:
 *    200:
 *     description: success
 */

/**
 * @swagger
 * 
 * /api/auth/whoami:
 *  get:
 *   summary: returns user
 *   tags:
 *    - Auth
 *   responses:
 *    200:
 *     description: success
 */
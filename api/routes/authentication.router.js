/* eslint-disable max-len */
const router = require('express').Router();
const UserModel = require('../models/user.model');
const { verifyUserBody, hashPassword, verifyUserUnique } = require('../middleware/authentication');
const generateToken = require('../utils/generateToken');

/**
 * @swagger
 * components:
 *  schemas:
 *    Authentication:
 *      type: object
 *      required:
 *        - token
 *      properties:
 *        token:
 *          type: string
 *          description: This is a jwt token used for authentication on protected routes
 *      example:
 *        token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c'
 *    User:
 *      type: object
 *      required:
 *        - uuid
 *        - username
 *        - email
 *        - password
 *        - avatar_url
 *      properties:
 *        uuid:
 *          type: string
 *          description: uuid v4 string to work as public id for user
 *        username:
 *          type: string
 *        email:
 *          type: string
 *        password:
 *          type: string
 *        avatar_url:
 *          type: string
 *          description: public url of user avatar
 *      example:
 *        uuid: '7a97e42c-124c-4e2c-8109-c5ce6e5f77a4'
 *        username: 'The_Riker'
 *        email: 'william.t.riker@starfleet.com'
 *        password: '@R33allyG00dP@55w0rd'
 *        avatar_url:
 *          'https://upload.wikimedia.org/wikipedia/en/thumb/2/20/WilRiker.jpg/220px-WilRiker.jpg'
 *
 * /auth/register:
 *  post:
 *    description: Create new user
 *    tags:
 *      - authentication
 *    requestBody:
 *      description: User object to be created
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/User'
 *    responses:
 *      201:
 *        description: token created for newly registered user
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/Authentication'
 *      400:
 *        description: Data missing from request body __missing_property__
 */
router.post('/register', verifyUserBody, hashPassword, async (req, res, next) => {
  const { user } = req;
  try {
    const registered = await UserModel.create(user);
    if (registered) {
      const token = await generateToken(registered);
      res.status(201).json({ token });
    }
  } catch (error) {
    next(error);
  }
});

module.exports = router;

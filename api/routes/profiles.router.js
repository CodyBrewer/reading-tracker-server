const router = require('express').Router()
const UserModel = require('../models/user.model')
const { verifyToken } = require('../middleware/authentication.middleware')
const { verifyProfile } = require('../middleware/profiles.middleware')

/**
 * @swagger
 * components:
 *  schemas:
 *    PublicProfile:
 *      type: object
 *      properties:
 *        username:
 *          type: string
 *        uuid:
 *          type: string
 *      example:
 *        username: The_Riker
 *        uuid: 7a97e42c-124c-4e2c-8109-c5ce6e5f77a4
 *
 * /profiles:
 *   get:
 *    description: get information for public profiles
 *    tags:
 *      - profiles
 *    responses:
 *      200:
 *        description: token created for newly registered user
 *        content:
 *          application/json:
 *            schema:
 *              type: array
 *              items:
 *               - $ref: '#/components/schemas/PublicProfile'
 *            example:
 *              profiles: [
 *                {
 *                  username: The_Riker,
 *                  uuid: 7a97e42c-124c-4e2c-8109-c5ce6e5f77a4
 *                },
 *                {
 *                  uuid: '1d9dd170-8757-40ec-9ccf-11e4e3de27b1',
 *                  username: 'Jean-Luck',
 *                }
 *              ]
 *      401:
 *        $ref: '#/components/responses/UnauthorizedError'
 */
router.get('/', verifyToken, async (req, res, next) => {
  try {
    const publicProfiles = await UserModel.getAllPublic()
    if (publicProfiles.length) {
      res.status(200).json({ profiles: publicProfiles })
    } else {
      res.status(404).json({ error: 'No Profiles' })
    }
  } catch (error) {
    next(error)
  }
})

router.get('/:profileId', verifyToken, verifyProfile, async (req, res) => {
  res.status(200).json(res.locals.profile)
})

module.exports = router

const router = require('express').Router()
const UserModel = require('../models/user.model')
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
router.get('/', async (req, res, next) => {
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

/**
 * @swagger
 * components:
 *  parameters:
 *    ProfileId:
 *      in: path
 *      name: profileId
 *      description: Public UUID of profile to request
 *      schema:
 *        type: string
 *      required: true
 *      example: '1d9dd170-8757-40ec-9ccf-11e4e3de27b1'
 * /profiles/:profileId/:
 *  get:
 *    description: Get profile information for one profile
 *    tags:
 *      - profiles
 *    parameters:
 *      - $ref: '#/components/parameters/ProfileId'
 *    responses:
 *      200:
 *        description: Information for the Profile requested
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/PublicProfile'
 *      401:
 *        $ref: '#/components/respones/UnauthorizedError'
 *      403:
 *        description: 'User Profile is not public'
 */
router.get('/:profileId', verifyProfile, (req, res) => {
  res.status(200).json(res.locals.otherProfile)
})

/**
 * @swagger
 * /profiles/:profileId/readingLists/:
 *  get:
 *    description: Get reading lists for a profile if it is public
 *    tags:
 *      - profiles
 *    parameters:
 *      - $ref: '#/components/parameters/ProfileId'
 *    responses:
 *      200:
 *        description: reading lists data
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/ReadingLists'
 *      401:
 *        $ref: '#/components/responses/UnauthorizedError'
 *      403:
 *        description: 'User Profile is not public'
 *
 * /profiles/:profileId/readingLists/:readingListId/:
 *  get:
 *    description: Get reading list by reading list id for a profile if it is public
 *    tags:
 *      - profiles
 *    parameters:
 *      - $ref: '#/components/parameters/ProfileId'
 *      - $ref: '#/components/parameters/ReadingListId'
 *    responses:
 *      200:
 *        description: reading list data
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/ReadingLists'
 *      401:
 *        $ref: '#/components/responses/UnauthorizedError'
 *      403:
 *        description: 'User Profile is not public'
 */

module.exports = router

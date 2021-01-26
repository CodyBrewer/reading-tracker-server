const router = require('express').Router()

/**
 * @swagger
 * /status:
 *  get:
 *    description: root path returning status
 *    tags:
 *      - status
 *    responses:
 *      200:
 *        description: status is up
 *        content:
 *          application/json:
 *            schema:
 *              type: Object
 *              properties:
 *                message:
 *                  type: String
 *                current_time:
 *                  type: String
 *                  description: Current Date Time in UTC
 *              example:
 *                {
 *                  "message": "up",
 *                  "current_time": "Wed, 13 Jan 2021 23:04:22 GMT"
 *                }
 */
router.get('/', (req, res) => {
  const currentTime = new Date(Date.now())
  res.send({ message: 'up', current_time: currentTime.toUTCString() })
})

module.exports = router

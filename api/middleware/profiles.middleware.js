const UserModel = require('../models/user.model')

const verifyProfile = async (req, res, next) => {
  try {
    // check if profile exists
    const userProfile = await UserModel.getUserBy({
      uuid: req.params.profileId
    })
    // if not send 404 profile does not exists
    if (userProfile == null) {
      const error = new Error('User Profile does not exist')
      res.status(404)
      next(error)
    }
    // check if profile is set to public
    // if not send 403 forbidden user is not public
    if (userProfile.public === false) {
      const error = new Error('User profile is not public')
      res.status(403)
      next(error)
    }
    // if profile exists and is public set res.locals.userProfile to the profile
    res.locals.profile = userProfile
    next()
  } catch (error) {
    next(error)
  }
}

module.exports = {
  verifyProfile
}

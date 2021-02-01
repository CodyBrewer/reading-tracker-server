const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const { restart } = require('nodemon')
const { v4: uuidv4 } = require('uuid')
const UserModel = require('../models/user.model')

const requiredUserInfo = ['username', 'email', 'password', 'avatar_url']

const verifyUserRegisterBody = (req, res, next) => {
  requiredUserInfo.forEach((property) => {
    if (!Object.prototype.hasOwnProperty.call(req.body, property)) {
      const error = new Error()
      error.message = `Missing Required user property: ${property}`
      res.status(400)
      next(error)
    }
  })
  res.locals.user = req.body
  res.locals.user.uuid = uuidv4()
  next()
}

const hashPassword = async (req, res, next) => {
  if (res.locals.user) {
    try {
      const hash = await bcrypt.hash(
        res.locals.user.password,
        Number(process.env.SALT)
      )
      if (hash !== res.locals.user.password) {
        res.locals.user.password = hash
        next()
      }
    } catch (err) {
      const error = new Error('Error hashing password')
      res.status(500)
      next(error)
    }
  }
}

const verifyToken = (req, res, next) => {
  const bearerHeader = req.headers.authorization
  if (bearerHeader !== undefined) {
    const bearerToken = bearerHeader.split(' ')[1]
    jwt.verify(bearerToken, process.env.JWT_SECRET, (err, decodedToken) => {
      if (err !== null) {
        console.log({ err })
        const error = new Error('Invalid token')
        res.status(401)
        next(error)
      } else {
        res.locals.profile = {
          username: decodedToken.username,
          uuid: decodedToken.uuid
        }
        next()
      }
    })
  } else {
    const error = new Error('missing authorization header')
    res.status(403)
    next(error)
  }
}

const verifyUserLogin = async (req, res, next) => {
  const { username, password } = req.body

  if (username && password) {
    try {
      const user = await UserModel.getUserBy({ username })
      if (user) {
        const validPassword = await bcrypt.compare(password, user.password)
        if (!validPassword) {
          const error = new Error()
          res.status(401)
          error.message = 'Incorrect username or password'
          next(error)
        }
        res.locals.user = { username, password: user.password, uuid: user.uuid }
        next()
      } else {
        const error = new Error()
        res.status(401)
        error.message = 'Incorrect username or password'
        next(error)
      }
    } catch (error) {
      next(error)
    }
  } else {
    const error = new Error()
    res.status(400)
    error.message = 'Username or password field missing from body'
    next(error)
  }
}

module.exports = {
  verifyUserRegisterBody,
  hashPassword,
  verifyToken,
  verifyUserLogin
}

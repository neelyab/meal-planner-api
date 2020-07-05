const express = require('express')
const UsersService = require('./users-service')
const path = require('path')

const usersRouter = express.Router()
const jsonBodyParser = express.json()

usersRouter
  .post('/', jsonBodyParser, (req, res, next) => {
      const {user_password, username, first_name} = req.body
      // check to see if any of the required fields are missing
    for (const field of ['first_name', 'username', 'user_password'])
        if (!req.body[field])
         return res.status(400).json({
           error: `Missing '${field}' in request body`
        })
    // validate password...passwordError will return true if there is an error
    const passwordError = UsersService.validatePassword(user_password)

    if (passwordError)
         return res.status(400).json({ error: passwordError })

      // check to see if username already exists
    UsersService.hasUserWithUserName(
        req.app.get('db'),
        username
        )
        .then(hasUserWithUserName => {
          if (hasUserWithUserName)
            return res.status(400).json({ error: `Username already taken` })
         // hash password
        return UsersService.hashPassword(user_password)
        .then(hashedPassword => {
            const newUser = {
                         username: username.toLowerCase(),
                         user_password: hashedPassword,
                         first_name,
                         date_created: 'now()',
                       }
                // insert user into database
                return UsersService.insertUser(
                    req.app.get('db'),
                    newUser
                )
                .then(user => {
                    res
                    .status(201)
                    .location(path.posix.join(req.originalUrl, `/${user.id}`))
                    .json(UsersService.serializeUser(user))
               })
           })
        })
       .catch(next)
    })

module.exports = usersRouter
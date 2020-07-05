const bcrypt = require('bcryptjs')
const xss = require('xss')

const REGEX_UPPER_LOWER_NUMBER_SPECIAL = /(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&])[\S]+/

const UsersService = {
  hasUserWithUserName(db, username) {
    return db('users')
      .where({ username })
      .first()
      .then(user => !!user)
  },
  getUser(db, username){
    return db('users')
    .where({username})
    .first()
  },
  insertUser(db, newUser) {
    return db
      .insert(newUser)
      .into('users')
      .returning('*')
      .then(([user]) => user)
  },
  validatePassword(password) {
    // check if password length is >= 8
    if (password.length < 8) {
      return 'Password must be longer than 8 characters'
    }
    // check that password is less than 72 characters
    if (password.length > 72) {
      return 'Password must be less than 72 characters'
    }
    // check that password does not have empty spaces at start or end
    if (password.startsWith(' ') || password.endsWith(' ')) {
      return 'Password must not start or end with empty spaces'
    }
    // check regex to make sure required characters are present
    if (!REGEX_UPPER_LOWER_NUMBER_SPECIAL.test(password)) {
      return 'Password must contain one upper case, lower case, number and special character'
    }
    // if password meets all requirements, return null
    return null
  },
  hashPassword(password) {
    return bcrypt.hash(password, 12)
  },
  serializeUser(user) {
    return {
      id: user.id,
      first_name: xss(user.first_name),
      username: xss(user.username),
      date_created: new Date(user.date_created),
    }
  },
}

module.exports = UsersService